module.exports = {
  apps: [
    {
      name: "kubahcmp",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      instances: "max",
      exec_mode: "cluster",
      env: {
        PORT: 3000,
        NODE_ENV: "production",
      },
    },
    {
      name: "backup-checker",
      script: "scripts/run-scheduled-backup.js",
      cron_restart: "*/30 * * * *", // Cek setiap 30 menit
      autorestart: true, // Ubah ke true agar restart otomatis
      max_restarts: 10, // Batasi jumlah restart untuk menghindari loop
      restart_delay: 5000, // Tunggu 5 detik sebelum restart
      watch: false,
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "backup-monitor",
      script: "scripts/monitor-backup-checker.js",
      watch: false,
      autorestart: true,
    },
  ],
}