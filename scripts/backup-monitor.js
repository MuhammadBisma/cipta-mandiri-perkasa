// Script monitor sederhana untuk backup
require("dotenv").config();
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Direktori log
const LOG_DIR = path.join(process.cwd(), "logs");
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

// File log
const logFile = path.join(LOG_DIR, "backup-monitor.log");

// Fungsi untuk menulis log
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  console.log(message);
  fs.appendFileSync(logFile, logMessage);
}

// Fungsi untuk menjalankan backup
function runBackup() {
  try {
    log("Running scheduled backup check");
    
    // Jalankan script backup
    const result = execSync("node scripts/force-backup.js", { encoding: "utf8" });
    log("Backup check completed");
  } catch (error) {
    log(`Error running backup: ${error.message}`);
  }
}

// Jalankan backup setiap jam
log("Starting backup monitor");
setInterval(runBackup, 60 * 60 * 1000); // Setiap jam

// Jalankan backup saat startup
setTimeout(runBackup, 10000); // Tunggu 10 detik setelah startup

// Jaga agar proses tetap berjalan
setInterval(() => {
  log("Backup monitor is running");
}, 24 * 60 * 60 * 1000); // Log setiap 24 jam