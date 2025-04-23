// Script backup yang lebih robust
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");
const { createGzip } = require("zlib");
const { pipeline } = require("stream/promises");
const { createWriteStream } = require("fs");
const { Readable } = require("stream");

// Inisialisasi Prisma
const prisma = new PrismaClient();

// Konfigurasi
const ADMIN_USER_ID = process.env.ADMIN_USER_ID || "550e8400-e29b-41d4-a716-446655440001";
const BACKUP_DIR = path.join(process.cwd(), "backups");
const LOG_DIR = path.join(process.cwd(), "logs");

// Pastikan direktori backups ada
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

// Log file
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}
const logFile = path.join(LOG_DIR, `backup-${new Date().toISOString().replace(/[:.]/g, "-")}.log`);

// Fungsi untuk menulis log
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  console.log(message);
  fs.appendFileSync(logFile, logMessage);
}

// Fungsi untuk menghitung next run
function calculateNextRun(frequency, time) {
  const now = new Date();
  const nextRun = new Date(now);

  switch (frequency) {
    case "DAILY":
      nextRun.setDate(now.getDate() + 1);
      break;
    case "WEEKLY":
      nextRun.setDate(now.getDate() + 7);
      break;
    case "MONTHLY":
      nextRun.setMonth(now.getMonth() + 1);
      break;
    default:
      throw new Error(`Unknown frequency: ${frequency}`);
  }

  if (time) {
    const [hours, minutes] = time.split(":").map(Number);
    nextRun.setHours(hours, minutes, 0, 0);
  } else {
    nextRun.setHours(0, 0, 0, 0);
  }

  return nextRun;
}

// Fungsi utama
async function main() {
  log("Starting backup process");

  try {
    // Periksa admin user
    const adminUser = await prisma.user.findUnique({ 
      where: { id: ADMIN_USER_ID },
      select: { id: true, role: true }
    });

    if (!adminUser) {
      log(`Admin user with ID ${ADMIN_USER_ID} not found`);
      process.exit(1);
    }

    if (adminUser.role !== "ADMIN") {
      log(`User ${ADMIN_USER_ID} does not have ADMIN role`);
      process.exit(1);
    }

    // Periksa apakah perlu menjalankan backup
    const schedule = await prisma.backupSchedule.findFirst();

    if (!schedule || !schedule.enabled) {
      log("Backup scheduling is disabled or not configured");
      return;
    }

    const now = new Date();
    const nextRun = schedule.nextRun ? new Date(schedule.nextRun) : null;

    if (!nextRun) {
      log("No next run scheduled");
      return;
    }

    // Tambahkan buffer 5 menit
    const buffer = 5 * 60 * 1000; // 5 menit dalam milidetik

    if (nextRun.getTime() > now.getTime() + buffer) {
      log(`Next backup scheduled at ${nextRun.toISOString()}, skipping for now`);
      return;
    }

    if (schedule.lastRun && new Date(schedule.lastRun).getTime() > nextRun.getTime() - buffer) {
      log("Backup already ran recently");
      return;
    }

    log(`Backup should run. Next scheduled time: ${nextRun.toISOString()}, Current time: ${now.toISOString()}`);

    // Tambahkan lock untuk mencegah backup ganda
    const lockId = `backup_lock_${new Date().toISOString()}`;

    // Coba update lastRun sebagai lock
    const updated = await prisma.backupSchedule.updateMany({
      where: {
        id: schedule.id,
        lastRun: schedule.lastRun, // Hanya update jika lastRun belum berubah
      },
      data: {
        lastRun: now,
      },
    });

    // Jika tidak ada yang diupdate, berarti ada proses lain yang sedang berjalan
    if (updated.count === 0) {
      log("Another backup process is already running");
      return;
    }

    // Daftar model yang akan dibackup
    const models = [
      "User",
      "BlogPost",
      "Gallery",
      "Testimonial",
      "Backup",
      "BackupSchedule",
      "Visitor",
      "PageView",
      "DailyAnalytics",
    ];

    const backupName = `Scheduled ${schedule.frequency.toLowerCase()} backup - ${now.toLocaleDateString()}`;

    // Buat backup
    log(`Creating backup: ${backupName}`);

    // Buat entri backup di database
    const backup = await prisma.backup.create({
      data: {
        name: backupName,
        description: "Automatically created by scheduler",
        filePath: "",
        fileSize: 0,
        fileType: "json.gz",
        tables: models,
        type: "SCHEDULED",
        status: "IN_PROGRESS",
        createdBy: {
          connect: { id: ADMIN_USER_ID },
        },
      },
    });

    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const fileName = `backup-${backup.id}-${timestamp}.json.gz`;
      const filePath = path.join(BACKUP_DIR, fileName);
      const backupData = {
        metadata: {
          id: backup.id,
          name: backupName,
          description: "Automatically created by scheduler",
          tables: models,
          type: "SCHEDULED",
          createdAt: now.toISOString(),
          createdBy: adminUser.id,
        },
        data: {},
      };

      // Proses backup untuk setiap tabel
      for (const table of models) {
        try {
          log(`Backing up table: ${table}`);

          // Dapatkan data dari tabel
          let tableData;
          switch (table) {
            case "User":
              tableData = await prisma.user.findMany({
                select: {
                  id: true,
                  username: true,
                  name: true,
                  role: true,
                  createdAt: true,
                  updatedAt: true,
                },
              });
              break;
            case "BlogPost":
              tableData = await prisma.blogPost.findMany();
              break;
            case "Gallery":
              tableData = await prisma.gallery.findMany();
              break;
            case "Testimonial":
              tableData = await prisma.testimonial.findMany();
              break;
            case "Backup":
              tableData = await prisma.backup.findMany();
              break;
            case "BackupSchedule":
              tableData = await prisma.backupSchedule.findMany();
              break;
            case "Visitor":
              tableData = await prisma.visitor.findMany();
              break;
            case "PageView":
              tableData = await prisma.pageView.findMany();
              break;
            case "DailyAnalytics":
              tableData = await prisma.dailyAnalytics.findMany();
              break;
            default:
              log(`Skipping unknown table: ${table}`);
              continue;
          }

          backupData.data[table] = tableData;
          log(`Backed up ${tableData.length} records from ${table}`);
        } catch (tableError) {
          log(`Error backing up table ${table}: ${tableError.message}`);
          // Lanjutkan ke tabel berikutnya meskipun ada error
        }
      }

      const jsonData = JSON.stringify(backupData, null, 2);

      log(`Writing backup to file: ${filePath}`);
      const gzip = createGzip();
      const source = Buffer.from(jsonData);
      const destination = createWriteStream(filePath);

      await pipeline(Readable.from(source), gzip, destination);

      const stats = fs.statSync(filePath);
      const fileSize = stats.size;

      log(`Backup file created: ${filePath} (${fileSize} bytes)`);

      // Update backup record
      await prisma.backup.update({
        where: { id: backup.id },
        data: {
          filePath: fileName,
          fileSize,
          status: "COMPLETED",
        },
      });

      // Perbarui waktu berikutnya
      const nextRun = calculateNextRun(schedule.frequency, schedule.time);
      await prisma.backupSchedule.update({
        where: { id: schedule.id },
        data: {
          nextRun,
        },
      });

      log(`Backup completed successfully. Next run: ${nextRun}`);

      // Hapus backup lama berdasarkan retensi
      const oldBackups = await prisma.backup.findMany({
        where: {
          type: "SCHEDULED",
          createdAt: {
            lt: new Date(now.getTime() - schedule.retentionDays * 24 * 60 * 60 * 1000),
          },
        },
      });

      for (const oldBackup of oldBackups) {
        log(`Deleting old backup: ${oldBackup.name}`);

        try {
          // Hapus file backup
          if (oldBackup.filePath) {
            const oldFilePath = path.join(BACKUP_DIR, oldBackup.filePath);
            if (fs.existsSync(oldFilePath)) {
              fs.unlinkSync(oldFilePath);
            }
          }

          // Hapus record dari database
          await prisma.backup.delete({
            where: { id: oldBackup.id },
          });
        } catch (deleteError) {
          log(`Error deleting old backup: ${deleteError.message}`);
        }
      }
    } catch (error) {
      log(`Error creating backup: ${error.message}`);
      
      // Menambahkan detail error
      if (error.code) log(`Error code: ${error.code}`);
      if (error.errno) log(`Error errno: ${error.errno}`);
      if (error.syscall) log(`Error syscall: ${error.syscall}`);
      if (error.path) log(`Error path: ${error.path}`);
      
      // Update backup record to failed
      await prisma.backup.update({
        where: { id: backup.id },
        data: {
          status: "FAILED",
        },
      });
    }
  } catch (error) {
    log(`Error in backup process: ${error.message}`);
    
    // Menambahkan detail error
    if (error.code) log(`Error code: ${error.code}`);
    if (error.errno) log(`Error errno: ${error.errno}`);
    if (error.syscall) log(`Error syscall: ${error.syscall}`);
    if (error.path) log(`Error path: ${error.path}`);
  } finally {
    await prisma.$disconnect();
  }
}

// Menjalankan fungsi utama
main().catch((e) => {
  console.error("Unexpected error: ", e);
  process.exit(1);
});