import { runScheduledBackups } from "@/lib/backup"
import { initScheduledBackups } from "@/lib/cron"

async function main() {
  try {
    console.log("Initializing scheduled backups...")
    await initScheduledBackups()

    console.log("Running scheduled backups...")
    await runScheduledBackups()

    console.log("Scheduled backups completed successfully")
    process.exit(0)
  } catch (error) {
    console.error("Error running scheduled backups:", error)
    process.exit(1)
  }
}

main()
