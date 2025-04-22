import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { createBackup, getAvailableTables } from "@/lib/backup"
import prisma from "@/lib/db"
import { BackupStatus } from "@prisma/client"

// Modifikasi fungsi GET untuk menampilkan semua backup termasuk yang terjadwal
export async function GET(request: Request) {
  try {
    // Check if user is authenticated
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit") as string) : undefined
    const search = searchParams.get("search") || undefined
    const type = searchParams.get("type") || undefined

    // Build the query
    const query: any = {}
    if (search) {
      query.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ]
    }

    if (type) {
      query.type = type
    }

    // Fetch backups from the database
    const backups = await prisma.backup.findMany({
      where: query,
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        createdBy: {
          select: {
            name: true,
          },
        },
      },
    })

    // Format the backups for the response
    const formattedBackups = backups.map((backup) => ({
      id: backup.id,
      name: backup.name,
      description: backup.description,
      date: backup.createdAt.toISOString(),
      size: formatFileSize(backup.fileSize),
      sizeBytes: backup.fileSize,
      type: backup.type,
      status: backup.status,
      tables: backup.tables,
      createdBy: backup.createdBy?.name || "System",
    }))

    return NextResponse.json(formattedBackups)
  } catch (error) {
    console.error("Error fetching backups:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // Check if user is authenticated
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, tables, description } = await request.json()

    if (!name || !tables || tables.length === 0) {
      return NextResponse.json({ error: "Name and tables are required" }, { status: 400 })
    }

    // Create the backup
    const backupId = await createBackup(name, tables, description)

    // Get the created backup
    const backup = await prisma.backup.findUnique({
      where: { id: backupId },
      include: {
        createdBy: {
          select: {
            name: true,
          },
        },
      },
    })

    if (!backup) {
      return NextResponse.json({ error: "Failed to create backup" }, { status: 500 })
    }

    // Format the backup for the response
    const formattedBackup = {
      id: backup.id,
      name: backup.name,
      description: backup.description,
      date: backup.createdAt.toISOString(),
      size: formatFileSize(backup.fileSize),
      sizeBytes: backup.fileSize,
      type: backup.type,
      status: backup.status,
      tables: backup.tables,
      createdBy: backup.createdBy.name,
    }

    return NextResponse.json(formattedBackup)
  } catch (error) {
    console.error("Error creating backup:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Helper function to format file size
function formatFileSize(bytes: number): string {
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

export async function OPTIONS(request: Request) {
  try {
    // Check if user is authenticated
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get available tables
    const tables = await getAvailableTables()

    // Get backup statistics
    const [totalBackups, completedBackups, failedBackups] = await Promise.all([
      prisma.backup.count(),
      prisma.backup.count({ where: { status: BackupStatus.COMPLETED } }),
      prisma.backup.count({ where: { status: BackupStatus.FAILED } }),
    ])

    // Calculate total size
    const totalSize = await prisma.backup.aggregate({
      _sum: {
        fileSize: true,
      },
    })

    // Get the latest backup
    const latestBackup = await prisma.backup.findFirst({
      where: { status: BackupStatus.COMPLETED },
      orderBy: { createdAt: "desc" },
    })

    // Get the backup schedule
    const schedule = await prisma.backupSchedule.findFirst()

    return NextResponse.json({
      tables,
      stats: {
        totalBackups,
        completedBackups,
        failedBackups,
        totalSize: formatFileSize(totalSize._sum.fileSize || 0),
        totalSizeBytes: totalSize._sum.fileSize || 0,
        latestBackup: latestBackup ? latestBackup.createdAt.toISOString() : null,
        nextScheduledBackup: schedule?.nextRun ? schedule.nextRun.toISOString() : null,
      },
    })
  } catch (error) {
    console.error("Error fetching backup options:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
