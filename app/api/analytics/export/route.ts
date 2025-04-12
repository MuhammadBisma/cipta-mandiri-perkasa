import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { generateAnalyticsCSV } from "@/lib/analytics"

export async function GET(request: Request) {
  try {
    // Check if user is authenticated
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") || "visitors"
    const startDateParam = searchParams.get("startDate")
    const endDateParam = searchParams.get("endDate")

    // Validate parameters
    if (!["visitors", "pageviews", "daily"].includes(type)) {
      return NextResponse.json({ error: "Invalid export type" }, { status: 400 })
    }

    // Parse dates or use defaults (last 30 days)
    const endDate = endDateParam ? new Date(endDateParam) : new Date()
    const startDate = startDateParam ? new Date(startDateParam) : new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000)

    // Generate CSV data
    const csvData = await generateAnalyticsCSV(type, startDate, endDate)

    // Set headers for file download
    const headers = new Headers()
    headers.set("Content-Type", "text/csv")
    headers.set(
      "Content-Disposition",
      `attachment; filename="analytics-${type}-${startDate.toISOString().split("T")[0]}-to-${endDate.toISOString().split("T")[0]}.csv"`,
    )

    return new NextResponse(csvData, {
      status: 200,
      headers,
    })
  } catch (error) {
    console.error("Error exporting analytics:", error)
    return NextResponse.json({ error: "Failed to export analytics" }, { status: 500 })
  }
}
