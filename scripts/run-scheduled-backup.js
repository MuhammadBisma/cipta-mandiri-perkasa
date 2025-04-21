const { execSync } = require("child_process")
const path = require("path")

function main() {
  try {
    console.log("Running scheduled backups...")

    // Gunakan ts-node untuk menjalankan script TypeScript
    const scriptPath = path.resolve(__dirname, "run-backup.ts")
    execSync(`npx ts-node ${scriptPath}`, { stdio: "inherit" })

    console.log("Scheduled backups completed successfully")
  } catch (error) {
    console.error("Error running scheduled backups:", error)
    process.exit(1)
  }
}

main()
