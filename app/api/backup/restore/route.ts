import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { restoreBackup } from "@/lib/backup"
import prisma from "@/lib/db"
import { BackupType, BackupStatus } from "@prisma/client"
import path from "path"
import fs from "fs"
import { createGunzip } from "zlib"
import { pipeline } from "stream/promises"
import { Writable } from "stream"

// Define the backup directory
const BACKUP_DIR = path.join(process.cwd(), "backups")
const TEMP_DIR = path.join(process.cwd(), "temp")

// Ensure the temp directory exists
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true })
}

export async function POST(request: Request) {
  try {
    // Check if user is authenticated
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if this is a multipart form data request (file upload)
    const contentType = request.headers.get("content-type") || ""

    if (contentType.includes("multipart/form-data")) {
      // Handle file upload
      const formData = await request.formData()
      const file = formData.get("file") as File

      if (!file) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 })
      }

      // Check file type
      if (!file.name.endsWith(".json") && !file.name.endsWith(".json.gz")) {
        return NextResponse.json(
          { error: "Invalid file type. Only .json and .json.gz files are supported" },
          { status: 400 },
        )
      }

      // Create a timestamp for the filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
      const fileName = `uploaded-${timestamp}-${file.name}`
      const filePath = path.join(TEMP_DIR, fileName)

      // Save the file
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      fs.writeFileSync(filePath, buffer)

      // Create a backup record
      const backup = await prisma.backup.create({
        data: {
          name: `Uploaded: ${file.name}`,
          description: "Uploaded backup file",
          filePath: fileName,
          fileSize: buffer.length,
          fileType: file.name.endsWith(".json.gz") ? "json.gz" : "json",
          tables: ["unknown"], // We don't know which tables are in the uploaded file
          type: BackupType.MANUAL,
          status: BackupStatus.COMPLETED,
          createdBy: {
            connect: { id: session.id },
          },
        },
      })

      // Process the file to determine its contents
      try {
        let fileContents: string

        if (file.name.endsWith(".json.gz")) {
          // Decompress the file
          const gunzip = createGunzip()
          const chunks: Buffer[] = []

          const source = fs.createReadStream(filePath)
          const destination = new Writable({
            write(chunk, encoding, callback) {
              chunks.push(chunk)
              callback()
            },
          })

          await pipeline(source, gunzip, destination)
          fileContents = Buffer.concat(chunks).toString("utf8")
        } else {
          // Read the JSON file directly
          fileContents = fs.readFileSync(filePath, "utf8")
        }

        // Parse the JSON to determine tables
        const backupData = JSON.parse(fileContents)
        const tables = backupData.metadata?.tables || Object.keys(backupData.data || {})

        // Update the backup record with the tables
        await prisma.backup.update({
          where: { id: backup.id },
          data: {
            tables,
          },
        })

        // Move the file to the backup directory
        const newFilePath = path.join(BACKUP_DIR, fileName)
        fs.renameSync(filePath, newFilePath)

        // Update the backup record with the new file path
        await prisma.backup.update({
          where: { id: backup.id },
          data: {
            filePath: fileName,
          },
        })

        return NextResponse.json({
          success: true,
          message: "Backup file uploaded successfully",
          backupId: backup.id,
        })
      } catch (error) {
        console.error("Error processing uploaded file:", error)

        // Update the backup record with the error status
        await prisma.backup.update({
          where: { id: backup.id },
          data: {
            status: BackupStatus.FAILED,
          },
        })

        return NextResponse.json({ error: "Failed to process the uploaded file" }, { status: 500 })
      }
    } else {
      // Handle restore from existing backup
      const { backupId } = await request.json()

      if (!backupId) {
        return NextResponse.json({ error: "Backup ID is required" }, { status: 400 })
      }

      // Restore the backup
      const success = await restoreBackup(backupId)

      if (!success) {
        return NextResponse.json({ error: "Failed to restore backup" }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        message: `Database successfully restored from backup ${backupId}`,
      })
    }
  } catch (error) {
    console.error("Error restoring backup:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
