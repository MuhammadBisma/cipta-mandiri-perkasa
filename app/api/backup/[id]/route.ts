import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { deleteBackup, restoreBackup } from "@/lib/backup"
import prisma from "@/lib/db"
import path from "path"

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
      include: {
        createdBy: {
          select: {
            name: true,
          },
        },
      },
    })

    if (!backup) {
      return NextResponse.json({ error: "Backup not found" }, { status: 404 })
    }

    // Format the backup for the response
    const formattedBackup = {
      id: backup.id,
      name: backup.name,
      description: backup.description,
      date: backup.createdAt.toISOString(),
      size: formatFileSize(backup.fileSize),
      sizeBytes: backup.fileSize,
      type: backup.type,
      status: backup.status,
      tables: backup.tables,
      createdBy: backup.createdBy.name,
      downloadUrl: `/api/backup/${id}/download`,
    }

    return NextResponse.json(formattedBackup)
  } catch (error) {
    console.error(`Error fetching backup ${params.id}:`, error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Check if user is authenticated
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = params.id

    // Delete the backup
    const success = await deleteBackup(id)

    if (!success) {
      return NextResponse.json({ error: "Failed to delete backup" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: `Backup ${id} deleted successfully` })
  } catch (error) {
    console.error(`Error deleting backup ${params.id}:`, error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    // Check if user is authenticated
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = params.id
    const { action } = await request.json()

    if (action === "restore") {
      // Restore the backup
      const success = await restoreBackup(id)

      if (!success) {
        return NextResponse.json({ error: "Failed to restore backup" }, { status: 500 })
      }

      return NextResponse.json({ success: true, message: `Backup ${id} restored successfully` })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error(`Error processing backup ${params.id}:`, error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Helper function to format file size
function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  } else if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  } else {
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`
  }
}
