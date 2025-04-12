import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { getBackupSchedule, updateBackupSchedule } from "@/lib/backup"

export async function GET(_request: Request) {
  try {
    // Check if user is authenticated
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the backup schedule
    const schedule = await getBackupSchedule()

    return NextResponse.json({
      enabled: schedule.enabled,
      frequency: schedule.frequency,
      time: schedule.time,
      retentionDays: schedule.retentionDays,
      lastRun: schedule.lastRun ? schedule.lastRun.toISOString() : null,
      nextRun: schedule.nextRun ? schedule.nextRun.toISOString() : null,
    })
  } catch (error) {
    console.error("Error fetching backup schedule:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // Check if user is authenticated
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { enabled, frequency, time, retentionDays } = await request.json()

    if (enabled === undefined || !frequency || !time || retentionDays === undefined) {
      return NextResponse.json({ error: "All schedule parameters are required" }, { status: 400 })
    }

    // Update the backup schedule
    const schedule = await updateBackupSchedule(enabled, frequency, time, retentionDays)

    return NextResponse.json({
      success: true,
      message: "Backup schedule updated successfully",
      schedule: {
        enabled: schedule.enabled,
        frequency: schedule.frequency,
        time: schedule.time,
        retentionDays: schedule.retentionDays,
        lastRun: schedule.lastRun ? schedule.lastRun.toISOString() : null,
        nextRun: schedule.nextRun ? schedule.nextRun.toISOString() : null,
      },
    })
  } catch (error) {
    console.error("Error updating backup schedule:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
