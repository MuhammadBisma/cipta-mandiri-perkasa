#!/bin/bash

# backup-runner.sh
# Script untuk menjalankan backup terjadwal

# Path ke direktori aplikasi
APP_DIR="/var/www/kubahcmp/cipta-mandiri-perkasa"

# Log file
LOG_FILE="/var/log/kubahcmp/cipta-mandiri-perkasa/backup.log"

# Pastikan direktori log ada
mkdir -p "$(dirname "$LOG_FILE")"

# Catat waktu mulai
echo "$(date): Memulai backup terjadwal" >> "$LOG_FILE"

# Jalankan script backup dengan Node.js
cd "$APP_DIR" && /usr/bin/node scripts/run-scheduled-backup.js >> "$LOG_FILE" 2>&1

# Catat status selesai
echo "$(date): Backup terjadwal selesai dengan status: $?" >> "$LOG_FILE"
