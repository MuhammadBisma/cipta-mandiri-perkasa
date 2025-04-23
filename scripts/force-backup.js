// Script untuk memaksa backup berjalan
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

// Path ke direktori backup
const BACKUP_DIR = path.join(process.cwd(), "backups");

// Pastikan direktori backups ada
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

// Log file
const LOG_DIR = path.join(process.cwd(), "logs");
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}
const logFile = path.join(LOG_DIR, `force-backup-${new Date().toISOString().replace(/[:.]/g, "-")}.log`);

// Fungsi untuk menulis log
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  console.log(message);
  fs.appendFileSync(logFile, logMessage);
}

// Fungsi utama
async function main() {
  log("Starting forced backup process");
  
  try {
    // Periksa apakah ada konfigurasi backup
    const schedule = await prisma.backupSchedule.findFirst();
    
    if (!schedule) {
      log("No backup schedule found. Creating default schedule.");
      
      // Buat jadwal default jika tidak ada
      await prisma.backupSchedule.create({
        data: {
          enabled: true,
          frequency: "DAILY",
          time: "02:00",
          retentionDays: 30,
          nextRun: new Date(new Date().setHours(2, 0, 0, 0) + 24 * 60 * 60 * 1000),
        },
      });
      
      log("Default schedule created.");
    } else if (!schedule.enabled) {
      log("Backup schedule is disabled. Enabling it.");
      
      // Aktifkan jadwal jika dinonaktifkan
      await prisma.backupSchedule.update({
        where: { id: schedule.id },
        data: { enabled: true },
      });
    }
    
    // Dapatkan semua model Prisma
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
    
    const now = new Date();
    const backupName = `Forced backup - ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
    
    // Buat backup
    log(`Creating backup: ${backupName}`);
    
    // Buat entri backup di database
    const backup = await prisma.backup.create({
      data: {
        name: backupName,
        description: "Manually forced backup",
        filePath: "",
        fileSize: 0,
        fileType: "json.gz",
        tables: models,
        type: "MANUAL",
        status: "IN_PROGRESS",
        createdBy: {
          connect: { id: "550e8400-e29b-41d4-a716-446655440001" }, 
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
          description: "Manually forced backup",
          tables: models,
          type: "MANUAL",
          createdAt: now.toISOString(),
          createdBy: "System",
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
          log(`Error stack: ${tableError.stack}`);
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
      
      log(`Backup completed successfully.`);
    } catch (error) {
      log(`Error creating backup: ${error.message}`);
      log(`Error stack: ${error.stack}`);
      
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
    log(`Error stack: ${error.stack}`);
    
    // Log detail error tambahan
    if (error.code) log(`Error code: ${error.code}`);
    if (error.errno) log(`Error errno: ${error.errno}`);
    if (error.syscall) log(`Error syscall: ${error.syscall}`);
    if (error.path) log(`Error path: ${error.path}`);
  } finally {
    await prisma.$disconnect();
  }
}

// Jalankan fungsi utama
main()
  .then(() => {
    log("Forced backup script completed");
    process.exit(0);
  })
  .catch((error) => {
    log(`Fatal error: ${error.message}`);
    log(`Error stack: ${error.stack}`);
    process.exit(1);
  });