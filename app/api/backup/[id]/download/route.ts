import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import prisma from "@/lib/db"
import path from "path"
import fs from "fs"

// Define the backup directory
const BACKUP_DIR = path.join(process.cwd(), "backups")

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // Check if user is authenticated
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = params.id

    // Get the backup from the database
    const backup = await prisma.backup.findUnique({
      where: { id },
    })

    if (!backup) {
      return NextResponse.json({ error: "Backup not found" }, { status: 404 })
    }

    // Get the backup file path
    const filePath = path.join(BACKUP_DIR, backup.filePath)

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "Backup file not found" }, { status: 404 })
    }

    // Read the file
    const fileBuffer = fs.readFileSync(filePath)

    // Set headers for file download
    const headers = new Headers()
    headers.set("Content-Type", "application/gzip")
    headers.set("Content-Disposition", `attachment; filename="${backup.name}.json.gz"`)
    headers.set("Content-Length", backup.fileSize.toString())

    return new NextResponse(fileBuffer, {
      status: 200,
      headers,
    })
  } catch (error) {
    console.error(`Error downloading backup ${params.id}:`, error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
