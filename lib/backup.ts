import { PrismaClient, BackupType, BackupStatus } from "@prisma/client"
import fs from "fs"
import path from "path"
import { createGzip } from "zlib"
import { pipeline } from "stream/promises"
import { createWriteStream } from "fs"
import { Readable } from "stream"
import { getSession } from "./auth"

const prisma = new PrismaClient()
const BACKUP_DIR = path.join(process.cwd(), "backups")

// Pastikan direktori backups ada
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true })
}

export async function createBackup(
  name: string,
  tables: string[],
  description?: string,
  type: BackupType = BackupType.MANUAL,
): Promise<string> {
  const session = await getSession()
  if (!session) {
    throw new Error("Unauthorized")
  }

  const backup = await prisma.backup.create({
    data: {
      name,
      description,
      filePath: "",
      fileSize: 0,
      fileType: "json.gz",
      tables,
      type,
      status: BackupStatus.IN_PROGRESS,
      createdBy: {
        connect: { id: session.id },
      },
    },
  })

  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
    const fileName = `backup-${backup.id}-${timestamp}.json.gz`
    const filePath = path.join(BACKUP_DIR, fileName)
    const backupData: Record<string, any> = {
      metadata: {
        id: backup.id,
        name,
        description,
        tables,
        type,
        createdAt: new Date().toISOString(),
        createdBy: session.username,
      },
      data: {},
    }

    for (const table of tables) {
      switch (table) {
        case "users":
          const users = await prisma.user.findMany({
            select: {
              id: true,
              username: true,
              name: true,
              role: true,
              createdAt: true,
              updatedAt: true,
            },
          })
          backupData.data.users = users
          break
        case "blog_posts":
          const blogPosts = await prisma.blogPost.findMany()
          backupData.data.blog_posts = blogPosts
          break
        case "gallery":
          const gallery = await prisma.gallery.findMany()
          backupData.data.gallery = gallery
          break
        case "testimonials":
          const testimonials = await prisma.testimonial.findMany()
          backupData.data.testimonials = testimonials
          break
        case "backups":
          const backups = await prisma.backup.findMany()
          backupData.data.backups = backups
          break
        case "backup_schedules":
          const backupSchedules = await prisma.backupSchedule.findMany()
          backupData.data.backup_schedules = backupSchedules
          break
        default:
          console.warn(`Unknown table: ${table}`)
      }
    }

    const jsonData = JSON.stringify(backupData, null, 2)

    const gzip = createGzip()
    const source = Buffer.from(jsonData)
    const destination = createWriteStream(filePath)

    await pipeline(Readable.from(source), gzip, destination)

    const stats = fs.statSync(filePath)
    const fileSize = stats.size

    await prisma.backup.update({
      where: { id: backup.id },
      data: {
        filePath: fileName,
        fileSize,
        status: BackupStatus.COMPLETED,
      },
    })

    return backup.id
  } catch (error) {
    await prisma.backup.update({
      where: { id: backup.id },
      data: {
        status: BackupStatus.FAILED,
      },
    })

    console.error("Backup error:", error)
    throw error
  }
}

export async function restoreBackup(backupId: string): Promise<boolean> {
  const session = await getSession()
  if (!session) {
    throw new Error("Unauthorized")
  }

  const backup = await prisma.backup.findUnique({
    where: { id: backupId },
  })

  if (!backup) {
    throw new Error("Backup not found")
  }

  if (backup.status !== BackupStatus.COMPLETED) {
    throw new Error("Cannot restore from an incomplete backup")
  }

  try {
    const filePath = path.join(BACKUP_DIR, backup.filePath)

    if (!fs.existsSync(filePath)) {
      throw new Error("Backup file not found")
    }

    const fileContents = fs.readFileSync(filePath)
    const decompressed = await new Promise<string>((resolve, reject) => {
      const gunzip = require("zlib").createGunzip()
      const chunks: Buffer[] = []

      gunzip.on("data", (chunk: Buffer) => chunks.push(chunk))
      gunzip.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")))
      gunzip.on("error", reject)

      gunzip.end(fileContents)
    })

    const backupData = JSON.parse(decompressed)
    await prisma.$transaction(async (tx) => {
      for (const table of backup.tables) {
        switch (table) {
          case "blog_posts":
            if (backupData.data.blog_posts) {
              await tx.blogPost.deleteMany({})

              for (const post of backupData.data.blog_posts) {
                await tx.blogPost.create({
                  data: {
                    id: post.id,
                    title: post.title,
                    slug: post.slug,
                    excerpt: post.excerpt,
                    content: post.content,
                    imageUrl: post.imageUrl,
                    category: post.category,
                    published: post.published,
                    authorId: post.authorId,
                    createdAt: new Date(post.createdAt),
                    updatedAt: new Date(post.updatedAt),
                  },
                })
              }
            }
            break
          case "gallery":
            if (backupData.data.gallery) {
              await tx.gallery.deleteMany({})

              for (const item of backupData.data.gallery) {
                await tx.gallery.create({
                  data: {
                    id: item.id,
                    title: item.title,
                    description: item.description,
                    imageUrl: item.imageUrl,
                    category: item.category,
                    authorId: item.authorId,
                    createdAt: new Date(item.createdAt),
                    updatedAt: new Date(item.updatedAt),
                  },
                })
              }
            }
            break
          case "testimonials":
            if (backupData.data.testimonials) {
              await tx.testimonial.deleteMany({})

              for (const testimonial of backupData.data.testimonials) {
                await tx.testimonial.create({
                  data: {
                    id: testimonial.id,
                    name: testimonial.name,
                    position: testimonial.position,
                    message: testimonial.message,
                    rating: testimonial.rating,
                    imageUrl: testimonial.imageUrl,
                    approved: testimonial.approved,
                    createdAt: new Date(testimonial.createdAt),
                    updatedAt: new Date(testimonial.updatedAt),
                  },
                })
              }
            }
            break
          default:
            console.warn(`Skipping table: ${table}`)
        }
      }
    })

    return true
  } catch (error) {
    console.error("Restore error:", error)
    throw error
  }
}

export async function deleteBackup(backupId: string): Promise<boolean> {
  const session = await getSession()
  if (!session) {
    throw new Error("Unauthorized")
  }

  const backup = await prisma.backup.findUnique({
    where: { id: backupId },
  })

  if (!backup) {
    throw new Error("Backup not found")
  }

  try {
    // Perbaikan: Pastikan filePath adalah file, bukan direktori
    if (!backup.filePath) {
      console.warn(`Backup ${backupId} has no file path, skipping file deletion`)
    } else {
      const filePath = path.join(BACKUP_DIR, backup.filePath)

      // Periksa apakah ini adalah file (bukan direktori) dan file tersebut ada
      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        // Gunakan try-catch untuk menangani error izin
        try {
          fs.unlinkSync(filePath)
        } catch (fileError) {
          console.error(`Failed to delete backup file: ${filePath}`, fileError)
          // Lanjutkan meskipun file tidak dapat dihapus
        }
      } else {
        console.warn(`Backup file not found or is a directory: ${filePath}`)
      }
    }

    // Hapus entri dari database terlepas dari apakah file berhasil dihapus
    await prisma.backup.delete({
      where: { id: backupId },
    })

    return true
  } catch (error) {
    console.error("Delete backup error:", error)
    throw error
  }
}

export async function getAvailableTables(): Promise<{ id: string; name: string; count: number; size: string }[]> {
  const [userCount, blogPostCount, galleryCount, testimonialCount] = await Promise.all([
    prisma.user.count(),
    prisma.blogPost.count(),
    prisma.gallery.count(),
    prisma.testimonial.count(),
  ])

  return [
    { id: "users", name: "Users", count: userCount, size: `${Math.round(userCount * 0.5 * 10) / 10} KB` },
    {
      id: "blog_posts",
      name: "Blog Posts",
      count: blogPostCount,
      size: `${Math.round(blogPostCount * 2 * 10) / 10} KB`,
    },
    { id: "gallery", name: "Gallery", count: galleryCount, size: `${Math.round(galleryCount * 1.5 * 10) / 10} KB` },
    {
      id: "testimonials",
      name: "Testimonials",
      count: testimonialCount,
      size: `${Math.round(testimonialCount * 1 * 10) / 10} KB`,
    },
  ]
}

export async function getBackupSchedule(): Promise<any> {
  const schedule = await prisma.backupSchedule.findFirst()

  if (!schedule) {
    return prisma.backupSchedule.create({
      data: {
        enabled: false,
        frequency: "DAILY",
        time: "00:00",
        retentionDays: 30,
      },
    })
  }

  return schedule
}

export async function updateBackupSchedule(
  enabled: boolean,
  frequency: string,
  time: string,
  retentionDays: number,
): Promise<any> {
  const schedule = await prisma.backupSchedule.findFirst()
  const nextRun = calculateNextRun(frequency, time)

  if (schedule) {
    return prisma.backupSchedule.update({
      where: { id: schedule.id },
      data: {
        enabled,
        frequency: frequency as any,
        time,
        retentionDays,
        nextRun,
      },
    })
  } else {
    return prisma.backupSchedule.create({
      data: {
        enabled,
        frequency: frequency as any,
        time,
        retentionDays,
        nextRun,
      },
    })
  }
}

function calculateNextRun(frequency: string, time: string): Date {
  const now = new Date()
  const [hours, minutes] = time.split(":").map(Number)

  const nextRun = new Date(now)
  nextRun.setHours(hours, minutes, 0, 0)

  if (nextRun <= now) {
    switch (frequency) {
      case "HOURLY":
        nextRun.setHours(now.getHours() + 1, 0, 0, 0)
        break
      case "DAILY":
        nextRun.setDate(nextRun.getDate() + 1)
        break
      case "WEEKLY":
        nextRun.setDate(nextRun.getDate() + (7 - nextRun.getDay()))
        break
      case "MONTHLY":
        nextRun.setMonth(nextRun.getMonth() + 1)
        nextRun.setDate(1)
        break
    }
  }

  return nextRun
}

export async function runScheduledBackups(): Promise<void> {
  const schedule = await prisma.backupSchedule.findFirst()

  if (!schedule || !schedule.enabled || !schedule.nextRun) {
    return
  }

  const now = new Date()
  if (schedule.nextRun > now) {
    return
  }

  try {
    const backupName = `Scheduled ${schedule.frequency.toLowerCase()} backup`

    const tables = ["users", "blog_posts", "gallery", "testimonials"]

    await createBackup(backupName, tables, "Automatically created by scheduler", BackupType.SCHEDULED)

    const oldBackups = await prisma.backup.findMany({
      where: {
        type: BackupType.SCHEDULED,
        createdAt: {
          lt: new Date(now.getTime() - schedule.retentionDays * 24 * 60 * 60 * 1000),
        },
      },
    })

    for (const backup of oldBackups) {
      await deleteBackup(backup.id)
    }

    const nextRun = calculateNextRun(schedule.frequency, schedule.time)
    await prisma.backupSchedule.update({
      where: { id: schedule.id },
      data: {
        lastRun: now,
        nextRun,
      },
    })
  } catch (error) {
    console.error("Scheduled backup error:", error)
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  } else if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  } else {
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`
  }
}
