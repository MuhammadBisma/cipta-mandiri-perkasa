const { execSync } = require("child_process")
const path = require("path")

function main() {
  try {
    console.log(`[${new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })}] Running scheduled backups...`)

    // Gunakan ts-node untuk menjalankan script TypeScript
    const scriptPath = path.resolve(__dirname, "run-backup.ts")
    execSync(`npx ts-node ${scriptPath}`, { stdio: "inherit" })

    console.log(
      `[${new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })}] Scheduled backups completed successfully`,
    )
  } catch (error) {
    console.error(
      `[${new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })}] Error running scheduled backups:`,
      error,
    )
    process.exit(1)
  }
}

main()