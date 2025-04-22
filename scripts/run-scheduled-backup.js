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
  execSync("npx prisma db pull", {
    cwd: projectDir,
    stdio: "inherit",
  })

  // Jalankan script backup dengan node
  const result = execSync("node -r ts-node/register/transpile-only ./scripts/run-backup.ts", {
    cwd: projectDir,
    encoding: "utf8",
  })

  // Tulis output ke log file
  fs.writeFileSync(logFile, result)

  console.log(`Backup completed successfully. Log saved to ${logFile}`)
} catch (error) {
  console.error("Error running scheduled backup:", error)

  // Tulis error ke log file
  fs.writeFileSync(logFile, `ERROR: ${error.message}\n${error.stack}`)

  process.exit(1)
}
