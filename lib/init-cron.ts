import { initScheduledBackups } from "./cron"

// Inisialisasi cron job saat aplikasi dimulai
export async function initCronJobs() {
  try {
    console.log("Initializing cron jobs...")
    await initScheduledBackups()
    console.log("Cron jobs initialized successfully")
  } catch (error) {
    console.error("Error initializing cron jobs:", error)
  }
}

// Panggil fungsi inisialisasi
initCronJobs()
