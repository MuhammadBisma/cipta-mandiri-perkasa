import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// Helper function to get IP address from request
function getIpAddress(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for")
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim()
  }

  const realIp = request.headers.get("x-real-ip")
  if (realIp) {
    return realIp
  }

  // Fallback to a placeholder for local development
  return "127.0.0.1"
}

// Helper function to parse user agent
function parseUserAgent(userAgent: string | null) {
  if (!userAgent) return { browser: "Unknown", os: "Unknown", device: "Unknown" }

  // Simple user agent parsing
  const browser = userAgent.includes("Chrome")
    ? "Chrome"
    : userAgent.includes("Firefox")
      ? "Firefox"
      : userAgent.includes("Safari")
        ? "Safari"
        : userAgent.includes("Edge")
          ? "Edge"
          : "Unknown"

  const os = userAgent.includes("Windows")
    ? "Windows"
    : userAgent.includes("Mac")
      ? "MacOS"
      : userAgent.includes("Linux")
        ? "Linux"
        : userAgent.includes("Android")
          ? "Android"
          : userAgent.includes("iPhone") || userAgent.includes("iPad")
            ? "iOS"
            : "Unknown"

  const device = userAgent.includes("Mobile") ? "mobile" : userAgent.includes("Tablet") ? "tablet" : "desktop"

  return { browser, os, device }
}

// Helper function to get geolocation data
async function getGeolocationData(ipAddress: string) {
  // Skip geolocation for localhost or private IPs
  if (ipAddress === "127.0.0.1" || ipAddress.startsWith("192.168.") || ipAddress.startsWith("10.")) {
    return { country: "Local", city: "Development", region: "Local" }
  }

  try {
    // Use a free IP geolocation API with timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3000)

    const response = await fetch(`https://ipapi.co/${ipAddress}/json/`, {
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      // If rate limited, return default values instead of throwing
      if (response.status === 429) {
        console.warn("Geolocation API rate limited, using default values")
        return { country: "Unknown (Rate Limited)", city: "Unknown", region: "Unknown" }
      }
      throw new Error(`Geolocation API error: ${response.status}`)
    }

    const data = await response.json()

    return {
      country: data.country_name || "Unknown",
      city: data.city || "Unknown",
      region: data.region || "Unknown",
    }
  } catch (error) {
    console.error("Error fetching geolocation data:", error)
    return { country: "Unknown", city: "Unknown", region: "Unknown" }
  }
}

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
