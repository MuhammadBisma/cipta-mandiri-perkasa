import { NextResponse } from "next/server"
import { getIpAddress, parseUserAgent, getGeolocationData } from "@/lib/analytics"
import prisma from "@/lib/db"

export async function POST(request: Request) {
  try {
    // Get the request data
    const data = await request.json()
    const { path, pageTitle, referrer, queryParams, blogPostId, galleryId } = data

    // Validate required fields
    if (!path) {
      return NextResponse.json({ error: "Path is required" }, { status: 400 })
    }

    // Get the real IP address from the request headers
    const ipAddress = getIpAddress(request)

    // Get user agent from request headers
    const userAgent = request.headers.get("user-agent")

    // Parse user agent
    const { browser, os, device } = parseUserAgent(userAgent)

    // Get geolocation data
    const { country, city, region } = await getGeolocationData(ipAddress)

    // Find or create visitor
    let visitor = await prisma.visitor.findFirst({
      where: { ipAddress },
    })

    if (visitor) {
      // Update existing visitor
      visitor = await prisma.visitor.update({
        where: { id: visitor.id },
        data: {
          lastVisit: new Date(),
          visitCount: { increment: 1 },
        },
      })
    } else {
      // Create new visitor
      visitor = await prisma.visitor.create({
        data: {
          ipAddress,
          userAgent: userAgent || undefined,
          browser,
          operatingSystem: os,
          deviceType: device,
          country,
          city,
          region,
        },
      })
    }

    // Create page view
    const pageView = await prisma.pageView.create({
      data: {
        path,
        pageTitle: pageTitle || undefined,
        referrer: referrer || undefined,
        queryParams: queryParams || undefined,
        visitorId: visitor.id,
        blogPostId: blogPostId || undefined,
        galleryId: galleryId || undefined,
      },
    })

    return NextResponse.json({ success: true, result: { visitor, pageView } })
  } catch (error) {
    console.error("Error tracking page view:", error)
    return NextResponse.json({ error: "Failed to track page view" }, { status: 500 })
  }
}

// Update page view duration
export async function PUT(request: Request) {
  try {
    const { pageViewId, duration } = await request.json()

    if (!pageViewId || typeof duration !== "number") {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 })
    }

    // Update the page view duration
    const updatedPageView = await prisma.pageView.update({
      where: { id: pageViewId },
      data: { duration },
    })

    return NextResponse.json({ success: true, pageView: updatedPageView })
  } catch (error) {
    console.error("Error updating page view duration:", error)
    return NextResponse.json({ error: "Failed to update page view duration" }, { status: 500 })
  }
}
