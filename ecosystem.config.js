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
      script: "node",
      args: "scripts/run-backup-robust.js",  
      instances: 1,
      exec_mode: "fork",
      cron_restart: "*/15 * * * *",  // Restart setiap 15 menit
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
}