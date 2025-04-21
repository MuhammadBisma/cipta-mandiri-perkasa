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
      cron_restart: "*/5 * * * *",
      autorestart: false,
      watch: false,
      env: {
        NODE_ENV: "production",
      },
    }
  ],
}