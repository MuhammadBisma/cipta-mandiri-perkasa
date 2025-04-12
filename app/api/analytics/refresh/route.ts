import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { updateDailyAnalytics } from "@/lib/analytics"

export async function POST(request: Request) {
  try {
    // Check if user is authenticated
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Update daily analytics
    const result = await updateDailyAnalytics()

    return NextResponse.json({
      success: true,
      message: "Analytics data refreshed successfully",
      data: result,
    })
  } catch (error) {
    console.error("Error refreshing analytics:", error)
    return NextResponse.json(
      {
        error: "Failed to refresh analytics data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
