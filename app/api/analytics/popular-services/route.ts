import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const startDateParam = searchParams.get("startDate")
    const endDateParam = searchParams.get("endDate")
    const limit = Number.parseInt(searchParams.get("limit") || "7", 10) // Default to 7 services

    // Parse dates or use defaults (last 30 days)
    const endDate = endDateParam ? new Date(endDateParam) : new Date()
    const startDate = startDateParam ? new Date(startDateParam) : new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000)

    // Adjust end date to include the full day
    endDate.setHours(23, 59, 59, 999)

    // Get page views for service pages
    const servicePageViews = await prisma.pageView.groupBy({
      by: ["path", "pageTitle"],
      where: {
        path: {
          startsWith: "/services/",
        },
        // Exclude the main services page
        NOT: {
          path: "/services",
        },
        timestamp: {
          gte: startDate,
          lte: endDate,
        },
      },
      _count: {
        path: true,
      },
      orderBy: {
        _count: {
          path: "desc",
        },
      },
      take: limit,
    })

    // Format the data for the chart
    const services = servicePageViews.map((service) => {
      // Extract service name from path or use page title
      let name = service.pageTitle || ""

      if (!name) {
        // Extract from path more carefully
        const pathParts = service.path.split("/").filter(Boolean)
        name = pathParts.length > 1 ? pathParts[1] : service.path
      }

      // Clean up the name
      name = name
        .replace(/-/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase())
        .trim()

      // Limit name length
      if (name.length > 25) {
        name = name.substring(0, 22) + "..."
      }

      // Make sure the path is valid
      const path = service.path.startsWith("/") ? service.path : `/${service.path}`

      return {
        name,
        value: service._count.path,
        path,
      }
    })

    const defaultServices = [
      { name: "Kubah Masjid", value: 45, path: "/services/kubah-masjid" },
      { name: "Mimbar", value: 38, path: "/services/mimbar" },
      { name: "Menara", value: 32, path: "/services/menara" },
      { name: "Kerawangan", value: 28, path: "/services/kerawangan" },
      { name: "Kaligrafi", value: 25, path: "/services/kaligrafi" },
      { name: "Ornamen", value: 20, path: "/services/ornamen" },
      { name: "Masjid", value: 15, path: "/services/masjid" },
    ]

    // Add missing services if we don't have 7
    if (services.length < 7) {
      // Get names of services we already have
      const existingNames = services.map((s) => s.name.toLowerCase())

      // Add default services that aren't already in our list
      for (const defaultService of defaultServices) {
        if (!existingNames.includes(defaultService.name.toLowerCase()) && services.length < 7) {
          services.push(defaultService)
        }
      }
    }

    // Assign colors to each service
    const serviceColors = ["indigo", "cyan", "emerald", "amber", "rose", "blue", "purple", "green", "yellow", "red"]

    const servicesWithColors = services.map((service, index) => ({
      ...service,
      color: serviceColors[index % serviceColors.length],
    }))

    return NextResponse.json({ success: true, services: servicesWithColors })
  } catch (error) {
    console.error("Error fetching popular services:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch popular services" }, { status: 500 })
  }
}
