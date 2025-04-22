import cron from "node-cron"
import { PrismaClient } from "@prisma/client"
import { createBackup } from "./backup"

const prisma = new PrismaClient()
let scheduledJobs: { [key: string]: cron.ScheduledTask } = {}

// Konversi frekuensi backup ke ekspresi cron
function frequencyToCronExpression(frequency: string, time: string): string {
  const [hours, minutes] = time.split(":").map(Number)

  switch (frequency) {
    case "HOURLY":
      return `${minutes} * * * *`
    case "DAILY":
      return `${minutes} ${hours} * * *`
    case "WEEKLY":
      return `${minutes} ${hours} * * 0` // Setiap hari Minggu
    case "MONTHLY":
      return `${minutes} ${hours} 1 * *` // Tanggal 1 setiap bulan
    default:
      return `${minutes} ${hours} * * *` // Default: daily
  }
}

// Inisialisasi cron job berdasarkan pengaturan di database
export async function initScheduledBackups(): Promise<void> {
  try {
    // Hentikan semua job yang sedang berjalan
    Object.values(scheduledJobs).forEach((job) => job.stop())
    scheduledJobs = {}

    // Ambil pengaturan jadwal dari database
    const schedule = await prisma.backupSchedule.findFirst()

    if (!schedule || !schedule.enabled) {
      console.log("Backup scheduling is disabled or not configured")
      return
    }

    // Buat ekspresi cron berdasarkan frekuensi dan waktu
    const cronExpression = frequencyToCronExpression(schedule.frequency, schedule.time)

    // Jadwalkan backup
    scheduledJobs["backup"] = cron.schedule(cronExpression, async () => {
      console.log(`Running scheduled backup at ${new Date().toISOString()}`)

      try {
        // Dapatkan semua tabel yang tersedia
        const tables = (await prisma.$queryRaw`
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_schema = 'public'
        `) as { table_name: string }[]

        const tableNames = tables.map((t) => t.table_name)

        // Buat nama backup dengan timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
        const backupName = `Scheduled Backup ${timestamp}`

        // Jalankan backup dengan semua tabel
        await createBackup(
          backupName,
          tableNames,
          `Automatic scheduled backup (${schedule.frequency.toLowerCase()})`,
          "SCHEDULED",
        )

        // Update waktu terakhir backup
        await prisma.backupSchedule.update({
          where: { id: schedule.id },
          data: { lastRun: new Date() },
        })

        console.log(`Scheduled backup completed successfully`)
      } catch (error) {
        console.error("Error running scheduled backup:", error)
      }
    })

    console.log(`Backup scheduled with cron expression: ${cronExpression}`)
  } catch (error) {
    console.error("Error initializing scheduled backups:", error)
  }
}

// Fungsi untuk memperbarui jadwal backup
export async function updateBackupSchedule(
  enabled: boolean,
  frequency: string,
  time: string,
  retentionDays: number,
): Promise<void> {
  try {
    // Perbarui jadwal di database
    const schedule = await prisma.backupSchedule.findFirst()
    const nextRun = calculateNextRun(frequency, time)

    if (schedule) {
      await prisma.backupSchedule.update({
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
      await prisma.backupSchedule.create({
        data: {
          enabled,
          frequency: frequency as any,
          time,
          retentionDays,
          nextRun,
        },
      })
    }

    // Reinisialisasi cron job dengan pengaturan baru
    await initScheduledBackups()
  } catch (error) {
    console.error("Error updating backup schedule:", error)
    throw error
  }
}

// Hitung waktu backup berikutnya
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
