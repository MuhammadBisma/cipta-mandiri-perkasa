// scripts/monitor-backup-checker.js
const { execSync } = require("child_process")
const fs = require("fs")
const path = require("path")

const logDir = path.join(__dirname, "../logs")
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true })
}

function checkAndRestartBackupChecker() {
  try {
    // Periksa status backup-checker
    const pmList = execSync("pm2 jlist").toString()
    const processes = JSON.parse(pmList)
    
    const backupChecker = processes.find(p => p.name === "backup-checker")
    
    if (!backupChecker || backupChecker.pm2_env.status !== "online") {
      console.log(`[${new Date().toISOString()}] Backup checker is not running. Restarting...`)
      
      try {
        execSync("pm2 restart backup-checker")
        console.log(`[${new Date().toISOString()}] Backup checker restarted successfully`)
      } catch (restartError) {
        console.log(`[${new Date().toISOString()}] Failed to restart, trying to start...`)
        execSync("pm2 start ecosystem.config.js --only backup-checker")
      }
    } else {
      console.log(`[${new Date().toISOString()}] Backup checker is running normally`)
    }
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error checking backup checker:`, error.message)
    
    // Coba restart jika terjadi error
    try {
      execSync("pm2 restart backup-checker")
    } catch (e) {
      // Ignore
    }
  }
}

// Jalankan pemeriksaan setiap 5 menit
setInterval(checkAndRestartBackupChecker, 5 * 60 * 1000)

// Jalankan pemeriksaan saat startup
checkAndRestartBackupChecker()

console.log(`[${new Date().toISOString()}] Backup checker monitor started`)