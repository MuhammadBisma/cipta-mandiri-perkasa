// File baru untuk menjalankan backup dengan ts-node
import { runScheduledBackups } from "../lib/backup"

async function main() {
  try {
    console.log("Executing scheduled backup...")
    await runScheduledBackups()
    console.log("Backup completed successfully")
  } catch (error) {
    console.error("Error executing backup:", error)
    process.exit(1)
  }
}

main()
