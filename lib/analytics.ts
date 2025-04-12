
import type { NextRequest } from "next/server"
import prisma from "@/lib/prisma"
import { UAParser } from "ua-parser-js"

// Interface for geolocation data
interface GeolocationData {
  country?: string
  city?: string
  region?: string
}

// Function to get IP address from request
export function getIpAddress(request: NextRequest | Request): string {
  // For NextRequest (middleware)
  if ("nextUrl" in request) {
    // Try to get IP from Vercel-specific headers
    const forwardedFor = request.headers.get("x-forwarded-for")
    if (forwardedFor) {
      return forwardedFor.split(",")[0].trim()
    }

    // Try to get IP from standard headers
    const realIp = request.headers.get("x-real-ip")
    if (realIp) {
      return realIp
    }
  } else {
    // For standard Request (API routes)
    const forwardedFor = request.headers.get("x-forwarded-for")
    if (forwardedFor) {
      return forwardedFor.split(",")[0].trim()
    }

    const realIp = request.headers.get("x-real-ip")
    if (realIp) {
      return realIp
    }
  }

  // Fallback to a placeholder for local development
  return "127.0.0.1"
}

// Function to parse user agent
export function parseUserAgent(userAgent: string | null) {
  if (!userAgent) return { browser: "Unknown", os: "Unknown", device: "Unknown" }

  const parser = new UAParser(userAgent)
  const browser = parser.getBrowser()
  const os = parser.getOS()
  const device = parser.getDevice()

  return {
    browser: browser.name || "Unknown",
    os: os.name || "Unknown",
    device: device.type || "desktop",
  }
}

// Function to get geolocation data from IP address with better error handling
export async function getGeolocationData(ipAddress: string): Promise<GeolocationData> {
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

// Function to track a page view - SERVER SIDE ONLY
export async function trackPageView(
  ipAddress: string,
  userAgent: string | null,
  path: string,
  pageTitle: string | null,
  referrer: string | null,
  queryParams: string | null,
  blogPostId?: string,
  galleryId?: string,
) {
  try {
    // Validate required fields
    if (!path) {
      throw new Error("Path is required for page view tracking")
    }

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

    return { visitor, pageView }
  } catch (error) {
    console.error("Error tracking page view:", error)
    throw error
  }
}

// Improve the updateDailyAnalytics function to calculate metrics more accurately
export async function updateDailyAnalytics() {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Start of today

    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1) // Start of tomorrow

    // Get page views for today
    const pageViewsCount = await prisma.pageView.count({
      where: {
        timestamp: {
          gte: today,
          lt: tomorrow,
        },
      },
    })

    // Get unique visitors for today
    const uniqueVisitorsCount = await prisma.pageView
      .groupBy({
        by: ["visitorId"],
        where: {
          timestamp: {
            gte: today,
            lt: tomorrow,
          },
        },
      })
      .then((result) => result.length)

    // Get new visitors for today
    const newVisitorsCount = await prisma.visitor.count({
      where: {
        firstVisit: {
          gte: today,
          lt: tomorrow,
        },
      },
    })

    // Calculate returning visitors
    const returningVisitorsCount = uniqueVisitorsCount - newVisitorsCount

    // Calculate average session duration
    const pageViewsWithDuration = await prisma.pageView.findMany({
      where: {
        timestamp: {
          gte: today,
          lt: tomorrow,
        },
        duration: {
          not: null,
        },
      },
      select: {
        duration: true,
        visitorId: true,
      },
    })

    // Group page views by visitor to calculate session durations
    const sessionsByVisitor: Record<string, number[]> = {}
    pageViewsWithDuration.forEach((pv) => {
      if (!sessionsByVisitor[pv.visitorId]) {
        sessionsByVisitor[pv.visitorId] = []
      }
      if (pv.duration) {
        sessionsByVisitor[pv.visitorId].push(pv.duration)
      }
    })

    // Calculate average session duration
    let totalSessionDuration = 0
    let sessionCount = 0

    Object.values(sessionsByVisitor).forEach((durations) => {
      if (durations.length > 0) {
        // Sum durations for this visitor
        const visitorTotalDuration = durations.reduce((sum, duration) => sum + duration, 0)
        totalSessionDuration += visitorTotalDuration
        sessionCount++
      }
    })

    const avgSessionDuration = sessionCount > 0 ? Math.round(totalSessionDuration / sessionCount) : 0

    // Calculate bounce rate (single page sessions)
    const bounceCount = Object.values(sessionsByVisitor).filter((durations) => durations.length === 1).length
    const bounceRate = sessionCount > 0 ? (bounceCount / sessionCount) * 100 : 0

    // Get top pages
    const topPages = await prisma.pageView.groupBy({
      by: ["path", "pageTitle"],
      where: {
        timestamp: {
          gte: today,
          lt: tomorrow,
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
      take: 10,
    })

    // Get top countries
    const topCountries = await prisma.visitor.groupBy({
      by: ["country"],
      where: {
        pageViews: {
          some: {
            timestamp: {
              gte: today,
              lt: tomorrow,
            },
          },
        },
      },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: "desc",
        },
      },
      take: 10,
    })

    // Get top referrers
    const topReferrers = await prisma.pageView.groupBy({
      by: ["referrer"],
      where: {
        timestamp: {
          gte: today,
          lt: tomorrow,
        },
        referrer: {
          not: null,
        },
      },
      _count: {
        referrer: true,
      },
      orderBy: {
        _count: {
          referrer: "desc",
        },
      },
      take: 10,
    })

    // Create or update DailyAnalytics
    const dailyAnalytics = await prisma.dailyAnalytics.upsert({
      where: { date: today },
      update: {
        pageViews: pageViewsCount,
        uniqueVisitors: uniqueVisitorsCount,
        newVisitors: newVisitorsCount,
        returningVisitors: returningVisitorsCount,
        avgSessionDuration: avgSessionDuration,
        bounceRate: bounceRate,
        topPages: JSON.stringify(topPages),
        topCountries: JSON.stringify(topCountries),
        topReferrers: JSON.stringify(topReferrers),
      },
      create: {
        date: today,
        pageViews: pageViewsCount,
        uniqueVisitors: uniqueVisitorsCount,
        newVisitors: newVisitorsCount,
        returningVisitors: returningVisitorsCount,
        avgSessionDuration: avgSessionDuration,
        bounceRate: bounceRate,
        topPages: JSON.stringify(topPages),
        topCountries: JSON.stringify(topCountries),
        topReferrers: JSON.stringify(topReferrers),
      },
    })

    return dailyAnalytics
  } catch (error) {
    console.error("Error updating daily analytics:", error)
    throw error
  }
}

// Improve the getAnalytics function to provide more accurate data
export async function getAnalytics(startDate: Date, endDate: Date) {
  try {
    // Adjust end date to include the full day
    const adjustedEndDate = new Date(endDate)
    adjustedEndDate.setHours(23, 59, 59, 999)

    // Get daily analytics for the date range
    const dailyAnalytics = await prisma.dailyAnalytics.findMany({
      where: {
        date: {
          gte: startDate,
          lte: adjustedEndDate,
        },
      },
      orderBy: {
        date: "asc",
      },
    })

    // If no daily analytics exist, calculate them on the fly
    if (dailyAnalytics.length === 0) {
      // Get total page views for the date range
      const totalPageViews = await prisma.pageView.count({
        where: {
          timestamp: {
            gte: startDate,
            lte: adjustedEndDate,
          },
        },
      })

      // Get unique visitors for the date range
      const uniqueVisitors = await prisma.pageView
        .groupBy({
          by: ["visitorId"],
          where: {
            timestamp: {
              gte: startDate,
              lte: adjustedEndDate,
            },
          },
        })
        .then((result) => result.length)

      // Calculate average session duration
      const pageViewsWithDuration = await prisma.pageView.findMany({
        where: {
          timestamp: {
            gte: startDate,
            lte: adjustedEndDate,
          },
          duration: {
            not: null,
          },
        },
        select: {
          duration: true,
          visitorId: true,
        },
      })

      // Group page views by visitor to calculate session durations
      const sessionsByVisitor: Record<string, number[]> = {}
      pageViewsWithDuration.forEach((pv) => {
        if (!sessionsByVisitor[pv.visitorId]) {
          sessionsByVisitor[pv.visitorId] = []
        }
        if (pv.duration) {
          sessionsByVisitor[pv.visitorId].push(pv.duration)
        }
      })

      // Calculate average session duration
      let totalSessionDuration = 0
      let sessionCount = 0

      Object.values(sessionsByVisitor).forEach((durations) => {
        if (durations.length > 0) {
          // Sum durations for this visitor
          const visitorTotalDuration = durations.reduce((sum, duration) => sum + duration, 0)
          totalSessionDuration += visitorTotalDuration
          sessionCount++
        }
      })

      const avgSessionDuration = sessionCount > 0 ? Math.round(totalSessionDuration / sessionCount) : 0

      // Calculate bounce rate (single page sessions)
      const bounceCount = Object.values(sessionsByVisitor).filter((durations) => durations.length === 1).length
      const bounceRate = sessionCount > 0 ? (bounceCount / sessionCount) * 100 : 0

      // Create a synthetic daily analytics record
      dailyAnalytics.push({
        id: "synthetic",
        date: startDate,
        pageViews: totalPageViews,
        uniqueVisitors: uniqueVisitors,
        newVisitors: 0,
        returningVisitors: 0,
        avgSessionDuration: avgSessionDuration,
        bounceRate: bounceRate,
        topPages: "[]",
        topCountries: "[]",
        topReferrers: "[]",
      })
    }

    // Get total page views for the date range
    const totalPageViews = await prisma.pageView.count({
      where: {
        timestamp: {
          gte: startDate,
          lte: adjustedEndDate,
        },
      },
    })

    // Get unique visitors for the date range
    const uniqueVisitors = await prisma.pageView
      .groupBy({
        by: ["visitorId"],
        where: {
          timestamp: {
            gte: startDate,
            lte: adjustedEndDate,
          },
        },
      })
      .then((result) => result.length)

    // Get device breakdown
    const deviceBreakdown = await prisma.visitor.groupBy({
      by: ["deviceType"],
      where: {
        pageViews: {
          some: {
            timestamp: {
              gte: startDate,
              lte: adjustedEndDate,
            },
          },
        },
      },
      _count: {
        id: true,
      },
    })

    // Get browser breakdown
    const browserBreakdown = await prisma.visitor.groupBy({
      by: ["browser"],
      where: {
        pageViews: {
          some: {
            timestamp: {
              gte: startDate,
              lte: adjustedEndDate,
            },
          },
        },
      },
      _count: {
        id: true,
      },
    })

    // Get top pages
    const topPages = await prisma.pageView.groupBy({
      by: ["path", "pageTitle"],
      where: {
        timestamp: {
          gte: startDate,
          lte: adjustedEndDate,
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
      take: 10,
    })

    // Get top countries
    const topCountries = await prisma.visitor.groupBy({
      by: ["country"],
      where: {
        pageViews: {
          some: {
            timestamp: {
              gte: startDate,
              lte: adjustedEndDate,
            },
          },
        },
      },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: "desc",
        },
      },
      take: 10,
    })

    // Get top cities
    const topCities = await prisma.visitor.groupBy({
      by: ["city", "country"],
      where: {
        pageViews: {
          some: {
            timestamp: {
              gte: startDate,
              lte: adjustedEndDate,
            },
          },
        },
      },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: "desc",
        },
      },
      take: 10,
    })

    return {
      dailyAnalytics,
      totalPageViews,
      uniqueVisitors,
      topPages,
      topCountries,
      topCities,
      deviceBreakdown,
      browserBreakdown,
    }
  } catch (error) {
    console.error("Error getting analytics:", error)
    throw error
  }
}

// Function to get real-time visitors (last 5 minutes)
export async function getRealTimeVisitors() {
  try {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)

    const activeVisitors = await prisma.pageView.groupBy({
      by: ["visitorId"],
      where: {
        timestamp: {
          gte: fiveMinutesAgo,
        },
      },
      _count: {
        visitorId: true,
      },
    })

    const visitorDetails = await prisma.visitor.findMany({
      where: {
        id: {
          in: activeVisitors.map((v) => v.visitorId),
        },
      },
      include: {
        pageViews: {
          where: {
            timestamp: {
              gte: fiveMinutesAgo,
            },
          },
          orderBy: {
            timestamp: "desc",
          },
          take: 1,
        },
      },
    })

    return visitorDetails.map((visitor) => ({
      id: visitor.id,
      country: visitor.country,
      city: visitor.city,
      browser: visitor.browser,
      device: visitor.deviceType,
      currentPage: visitor.pageViews[0]?.path || "Unknown",
      lastActive: visitor.pageViews[0]?.timestamp || visitor.lastVisit,
    }))
  } catch (error) {
    console.error("Error getting real-time visitors:", error)
    throw error
  }
}

// Function to generate CSV data for analytics export
export async function generateAnalyticsCSV(type: string, startDate: Date, endDate: Date): Promise<string> {
  try {
    let csvContent = ""
    const endDateAdjusted = new Date(endDate.getTime() + 86400000) // Add one day to include the end date

    switch (type) {
      case "visitors":
        // Export visitor data
        const visitors = await prisma.visitor.findMany({
          where: {
            firstVisit: {
              gte: startDate,
              lte: endDateAdjusted,
            },
          },
          orderBy: {
            firstVisit: "desc",
          },
        })

        // Create CSV header
        csvContent =
          "ID,IP Address,Browser,Operating System,Device Type,Country,City,Region,First Visit,Last Visit,Visit Count\n"

        // Add data rows
        visitors.forEach((visitor) => {
          csvContent += `${visitor.id},${visitor.ipAddress},"${visitor.browser}","${visitor.operatingSystem}","${visitor.deviceType}","${visitor.country || ""}","${visitor.city || ""}","${visitor.region || ""}","${visitor.firstVisit.toISOString()}","${visitor.lastVisit.toISOString()}",${visitor.visitCount}\n`
        })
        break

      case "pageviews":
        // Export page view data
        const pageViews = await prisma.pageView.findMany({
          where: {
            timestamp: {
              gte: startDate,
              lte: endDateAdjusted,
            },
          },
          include: {
            visitor: {
              select: {
                ipAddress: true,
                country: true,
                city: true,
              },
            },
          },
          orderBy: {
            timestamp: "desc",
          },
        })

        // Create CSV header
        csvContent = "ID,Path,Page Title,Referrer,Query Params,Timestamp,Duration (seconds),Visitor IP,Country,City\n"

        // Add data rows
        pageViews.forEach((view) => {
          csvContent += `${view.id},"${view.path}","${(view.pageTitle || "").replace(/"/g, '""')}","${(view.referrer || "").replace(/"/g, '""')}","${(view.queryParams || "").replace(/"/g, '""')}","${view.timestamp.toISOString()}",${view.duration || 0},"${view.visitor.ipAddress}","${view.visitor.country || ""}","${view.visitor.city || ""}"\n`
        })
        break

      case "daily":
        // Export daily analytics summary
        const dailyData = await prisma.dailyAnalytics.findMany({
          where: {
            date: {
              gte: startDate,
              lte: endDate,
            },
          },
          orderBy: {
            date: "asc",
          },
        })

        // Create CSV header
        csvContent =
          "Date,Page Views,Unique Visitors,New Visitors,Returning Visitors,Avg Session Duration (seconds),Bounce Rate (%)\n"

        // Add data rows
        dailyData.forEach((day) => {
          csvContent += `"${day.date.toISOString().split("T")[0]}",${day.pageViews},${day.uniqueVisitors},${day.newVisitors},${day.returningVisitors},${day.avgSessionDuration},${day.bounceRate.toFixed(2)}\n`
        })
        break

      default:
        throw new Error("Invalid export type")
    }

    return csvContent
  } catch (error) {
    console.error("Error generating analytics CSV:", error)
    throw error
  }
}
