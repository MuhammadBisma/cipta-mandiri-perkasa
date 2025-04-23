// Script untuk dijalankan oleh crontab
require("dotenv").config()
const { execSync } = require("child_process")
const path = require("path")
const fs = require("fs")

// Path ke direktori proyek
const projectDir = path.resolve(__dirname, "..")
const logDir = path.join(projectDir, "logs")

// Pastikan direktori log ada
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true })
}

// Nama file log dengan timestamp
const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
const logFile = path.join(logDir, `backup-${timestamp}.log`)

try {
  console.log(`Starting scheduled backup at ${new Date().toISOString()}`)

  // Jalankan prisma db pull untuk memastikan schema up-to-date
  try {
    execSync("sudo npx prisma db pull", {
      cwd: projectDir,
      stdio: "inherit",
    })
  } catch (dbPullError) {
    console.error("Warning: Failed to run prisma db pull:", dbPullError.message)
    // Lanjutkan meskipun db pull gagal
  }

  // Jalankan script backup dengan node
  try {
    const result = execSync("node -r ts-node/register/transpile-only ./scripts/run-backup.ts", {
      cwd: projectDir,
      encoding: "utf8",
    })

    // Tulis output ke log file
    fs.writeFileSync(logFile, result)

    console.log(`Backup completed successfully. Log saved to ${logFile}`)
  } catch (backupError) {
    console.error("Error running backup script:", backupError.message)
    fs.writeFileSync(logFile, `ERROR: ${backupError.message}\n${backupError.stack}`)
    // Jangan exit dengan kode error, biarkan proses tetap berjalan
  }
} catch (error) {
  console.error("Error in backup process:", error.message)
  // Tulis error ke log file
  fs.writeFileSync(logFile, `ERROR: ${error.message}\n${error.stack}`)
  // Jangan exit dengan kode error
}

// Tambahkan ini untuk memastikan proses tidak keluar terlalu cepat
console.log("Backup checker completed, waiting for next schedule")
process.exit(0)
