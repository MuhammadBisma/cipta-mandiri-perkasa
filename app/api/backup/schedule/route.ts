import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(_request: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const schedule = await prisma.backupSchedule.findFirst()

    if (!schedule) {
      return NextResponse.json({ error: "No schedule found" }, { status: 404 })
    }

    return NextResponse.json({
      enabled: schedule.enabled,
      frequency: schedule.frequency,
      time: schedule.time,
      retentionDays: schedule.retentionDays,
      lastRun: schedule.lastRun?.toISOString() ?? null,
      nextRun: schedule.nextRun?.toISOString() ?? null,
    })
  } catch (error) {
    console.error("Error fetching backup schedule:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { enabled, frequency, time, retentionDays } = await request.json()

    if (enabled === undefined || !frequency || !time || retentionDays === undefined) {
      return NextResponse.json({ error: "All schedule parameters are required" }, { status: 400 })
    }

    const now = new Date()
    const [hours, minutes] = time.split(":").map(Number)
    const nextRun = new Date(now)
    nextRun.setHours(hours, minutes, 0, 0)

    if (nextRun <= now) {
      switch (frequency) {
        case "HOURLY":
          nextRun.setHours(now.getHours() + 1, 0, 0, 0)
          break
        case "DAILY":
          nextRun.setDate(nextRun.getDate() + 1)
          break
        case "WEEKLY":
          nextRun.setDate(nextRun.getDate() + (7 - nextRun.getDay()))
          break
        case "MONTHLY":
          nextRun.setMonth(nextRun.getMonth() + 1)
          nextRun.setDate(1)
          break
      }
    }

    const existing = await prisma.backupSchedule.findFirst()

    if (existing) {
      await prisma.backupSchedule.update({
        where: { id: existing.id },
        data: {
          enabled,
          frequency,
          time,
          retentionDays,
          nextRun,
        },
      })
    } else {
      await prisma.backupSchedule.create({
        data: {
          enabled,
          frequency,
          time,
          retentionDays,
          nextRun,
        },
      })
    }

    const updated = await prisma.backupSchedule.findFirst()

    // ❗ Tambahkan pengecekan null
    if (!updated) {
      return NextResponse.json({ error: "Failed to retrieve updated schedule" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Backup schedule updated successfully",
      schedule: {
        enabled: updated.enabled,
        frequency: updated.frequency,
        time: updated.time,
        retentionDays: updated.retentionDays,
        lastRun: updated.lastRun?.toISOString() ?? null,
        nextRun: updated.nextRun?.toISOString() ?? null,
      },
    })
  } catch (error) {
    console.error("Error updating backup schedule:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
