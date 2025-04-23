// Script daemon untuk menjalankan backup sesuai jadwal
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Inisialisasi Prisma
const prisma = new PrismaClient();

// Path ke direktori log
const LOG_DIR = path.join(process.cwd(), "logs");
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

// File log
const logFile = path.join(LOG_DIR, "backup-daemon.log");

// Fungsi untuk menulis log
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  console.log(message);
  fs.appendFileSync(logFile, logMessage);
}

// Fungsi untuk memeriksa apakah backup perlu dijalankan
async function checkAndRunBackup() {
  try {
    log("Checking backup schedule...");
    
    // Ambil pengaturan jadwal dari database
    const schedule = await prisma.backupSchedule.findFirst();
    
    if (!schedule) {
      log("No backup schedule found");
      return;
    }
    
    if (!schedule.enabled) {
      log("Backup schedule is disabled");
      return;
    }
    
    log(`Schedule: ${schedule.frequency} at ${schedule.time}`);
    log(`Next run: ${schedule.nextRun ? new Date(schedule.nextRun).toISOString() : 'Not set'}`);
    log(`Last run: ${schedule.lastRun ? new Date(schedule.lastRun).toISOString() : 'Never'}`);
    
    const now = new Date();
    
    if (!schedule.nextRun) {
      log("Next run time not set, calculating...");
      
      // Hitung waktu berikutnya
      const nextRun = calculateNextRun(schedule.frequency, schedule.time);
      
      // Update nextRun di database
      await prisma.backupSchedule.update({
        where: { id: schedule.id },
        data: { nextRun },
      });
      
      log(`Next run time set to: ${nextRun.toISOString()}`);
      return;
    }
    
    const nextRun = new Date(schedule.nextRun);
    
    // Jika waktu sekarang sudah melewati waktu nextRun
    if (now >= nextRun) {
      log("It's time to run backup!");
      
      // Jalankan backup
      try {
        log("Running backup script...");
        
        // Jalankan script backup
        execSync("node scripts/force-backup.js", { stdio: 'inherit' });
        
        log("Backup completed successfully");
        
        // Hitung waktu berikutnya
        const newNextRun = calculateNextRun(schedule.frequency, schedule.time);
        
        // Update lastRun dan nextRun di database
        await prisma.backupSchedule.update({
          where: { id: schedule.id },
          data: {
            lastRun: now,
            nextRun: newNextRun,
          },
        });
        
        log(`Next backup scheduled for: ${newNextRun.toISOString()}`);
      } catch (backupError) {
        log(`Error running backup: ${backupError.message}`);
      }
    } else {
      // Hitung selisih waktu
      const diffMs = nextRun.getTime() - now.getTime();
      const diffMins = Math.round(diffMs / 60000);
      
      log(`Next backup will run in ${diffMins} minutes`);
    }
  } catch (error) {
    log(`Error checking backup schedule: ${error.message}`);
    log(`Error stack: ${error.stack}`);
  }
}

// Fungsi untuk menghitung waktu backup berikutnya
function calculateNextRun(frequency, time) {
  const now = new Date();
  const [hours, minutes] = time.split(":").map(Number);
  
  const nextRun = new Date(now);
  nextRun.setHours(hours, minutes, 0, 0);
  
  if (nextRun <= now) {
    switch (frequency) {
      case "HOURLY":
        nextRun.setHours(now.getHours() + 1, 0, 0, 0);
        break;
      case "DAILY":
        nextRun.setDate(nextRun.getDate() + 1);
        break;
      case "WEEKLY":
        nextRun.setDate(nextRun.getDate() + (7 - nextRun.getDay()));
        break;
      case "MONTHLY":
        nextRun.setMonth(nextRun.getMonth() + 1);
        nextRun.setDate(1);
        break;
    }
  }
  
  return nextRun;
}

// Fungsi utama
async function main() {
  log("Starting backup daemon");
  
  // Periksa jadwal setiap menit
  setInterval(checkAndRunBackup, 60 * 1000);
  
  // Periksa jadwal saat startup
  await checkAndRunBackup();
}

// Jalankan fungsi utama
main().catch((error) => {
  log(`Fatal error: ${error.message}`);
  log(`Error stack: ${error.stack}`);
});