import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { getAnalytics, getRealTimeVisitors, updateDailyAnalytics } from "@/lib/analytics"

export async function GET(request: Request) {
  try {
    // Check if user is authenticated
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const startDateParam = searchParams.get("startDate")
    const endDateParam = searchParams.get("endDate")
    const realTime = searchParams.get("realTime") === "true"

    if (realTime) {
      // Get real-time visitors
      const visitors = await getRealTimeVisitors()
      return NextResponse.json(visitors)
    }

    // Parse dates or use defaults (last 7 days)
    const endDate = endDateParam ? new Date(endDateParam) : new Date()
    const startDate = startDateParam ? new Date(startDateParam) : new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000)

    // Get analytics data
    const analytics = await getAnalytics(startDate, endDate)
    return NextResponse.json(analytics)
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch analytics",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

// Update the POST endpoint to use the new refresh endpoint
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
    console.error("Error updating analytics:", error)
    return NextResponse.json(
      {
        error: "Failed to update analytics",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
