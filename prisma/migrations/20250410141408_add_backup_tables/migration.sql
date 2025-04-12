-- CreateEnum
CREATE TYPE "BackupType" AS ENUM ('FULL', 'PARTIAL', 'MANUAL', 'SCHEDULED');

-- CreateEnum
CREATE TYPE "BackupStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "ScheduleFrequency" AS ENUM ('HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY');

-- CreateTable
CREATE TABLE "Backup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "filePath" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "fileType" TEXT NOT NULL,
    "tables" TEXT[],
    "type" "BackupType" NOT NULL,
    "status" "BackupStatus" NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Backup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BackupSchedule" (
    "id" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "frequency" "ScheduleFrequency" NOT NULL,
    "time" TEXT NOT NULL,
    "retentionDays" INTEGER NOT NULL DEFAULT 30,
    "lastRun" TIMESTAMP(3),
    "nextRun" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BackupSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Backup_createdAt_idx" ON "Backup"("createdAt");

-- AddForeignKey
ALTER TABLE "Backup" ADD CONSTRAINT "Backup_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
