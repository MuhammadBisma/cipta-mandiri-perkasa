// File untuk menjalankan backup dengan ts-node
import { runScheduledBackups } from "../lib/backup"

async function main() {
  try {
    console.log(`Executing scheduled backup at ${new Date().toISOString()}...`)
    await runScheduledBackups()
    console.log("Backup completed successfully")
    process.exit(0)
  } catch (error) {
    console.error("Error executing backup:", error)
    process.exit(1)
  }
}

main()
