require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");
const { createGzip } = require("zlib");
const { pipeline } = require("stream/promises");
const { createWriteStream } = require("fs");
const { Readable } = require("stream");

const prisma = new PrismaClient();

const BACKUP_DIR = path.join(process.cwd(), "backups");
const LOG_DIR = path.join(process.cwd(), "logs");

if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });
if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });

const logFile = path.join(LOG_DIR, `force-backup-${new Date().toISOString().replace(/[:.]/g, "-")}.log`);

function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  console.log(message);
  fs.appendFileSync(logFile, logMessage);
}

async function fetchTableData(table) {
  switch (table) {
    case "User":
      return await prisma.user.findMany({
        select: {
          id: true,
          username: true,
          name: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    case "BlogPost":
      return await prisma.blogPost.findMany();
    case "Gallery":
      return await prisma.gallery.findMany();
    case "Testimonial":
      return await prisma.testimonial.findMany();
    case "Backup":
      return await prisma.backup.findMany();
    case "BackupSchedule":
      return await prisma.backupSchedule.findMany();
    case "Visitor":
      return await prisma.visitor.findMany();
    case "PageView":
      return await prisma.pageView.findMany();
    case "DailyAnalytics":
      return await prisma.dailyAnalytics.findMany();
    default:
      return null;
  }
}

async function main() {
  log("Starting forced backup process");

  try {
    const schedule = await prisma.backupSchedule.findFirst();

    if (!schedule) {
      log("No backup schedule found. Creating default schedule.");
      await prisma.backupSchedule.create({
        data: {
          enabled: true,
          frequency: "DAILY",
          time: "02:00",
          retentionDays: 30,
          nextRun: new Date(new Date().setHours(2, 0, 0, 0) + 86400000), // 24 jam kemudian
        },
      });
      log("Default schedule created.");
    } else if (!schedule.enabled) {
      log("Backup schedule is disabled. Enabling it.");
      await prisma.backupSchedule.update({
        where: { id: schedule.id },
        data: { enabled: true },
      });
    }

    const models = [
      "User", "BlogPost", "Gallery", "Testimonial",
      "Backup", "BackupSchedule", "Visitor", "PageView", "DailyAnalytics"
    ];

    const now = new Date();
    const backupName = `Forced backup - ${now.toISOString().replace("T", " ").split(".")[0]}`;
    log(`Creating backup: ${backupName}`);

    const backup = await prisma.backup.create({
      data: {
        name: backupName,
        description: "Manually forced backup",
        filePath: "",
        fileSize: 0,
        fileType: "json.gz",
        tables: models,
        type: "MANUAL",
        status: "IN_PROGRESS",
        createdBy: {
          connect: { id: "39d9693c-92e7-4b80-aef8-e688c957eae3" }, // Ganti ID sesuai admin
        },
      },
    });

    try {
      const timestamp = now.toISOString().replace(/[:.]/g, "-");
      const fileName = `backup-${backup.id}-${timestamp}.json.gz`;
      const filePath = path.join(BACKUP_DIR, fileName);
      const backupData = {
        metadata: {
          id: backup.id,
          name: backupName,
          description: "Manually forced backup",
          tables: models,
          type: "MANUAL",
          createdAt: now.toISOString(),
          createdBy: "System",
        },
        data: {},
      };

      for (const table of models) {
        try {
          log(`Backing up table: ${table}`);
          const tableData = await fetchTableData(table);
          if (tableData) {
            backupData.data[table] = tableData;
            log(`Backed up ${tableData.length} records from ${table}`);
          } else {
            log(`Skipping unknown table: ${table}`);
          }
        } catch (tableError) {
          log(`Error backing up table ${table}: ${tableError.message}`);
        }
      }

      const jsonData = JSON.stringify(backupData, null, 2);
      const gzip = createGzip();
      const source = Readable.from(Buffer.from(jsonData));
      const destination = createWriteStream(filePath);

      await pipeline(source, gzip, destination);

      const fileSize = fs.statSync(filePath).size;
      log(`Backup file created: ${filePath} (${fileSize} bytes)`);

      await prisma.backup.update({
        where: { id: backup.id },
        data: {
          filePath: fileName,
          fileSize,
          status: "COMPLETED",
        },
      });

      log("Backup completed successfully.");
    } catch (error) {
      log(`Error during file creation: ${error.message}`);
      await prisma.backup.update({
        where: { id: backup.id },
        data: { status: "FAILED" },
      });
    }
  } catch (error) {
    log(`Unexpected error: ${error.message}`);
    if (error.stack) log(error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(() => {
    log("Forced backup script completed");
    process.exit(0);
  })
  .catch((error) => {
    log(`Fatal error: ${error.message}`);
    if (error.stack) log(error.stack);
    process.exit(1);
  });
