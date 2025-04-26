// Warning: This file should not be imported in client components
// Use analytics-client.ts for client-side analytics functions

// Throw an error if this file is imported in a client component
if (typeof window !== "undefined") {
  console.error(
    "Error: lib/analytics.ts should not be imported in client components. " + "Use lib/analytics-client.ts instead.",
  )
}

// Simple in-memory cache
const analyticsCache: Record<string, { data: any; timestamp: number }> = {}
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes in milliseconds

// Re-export functions from the server file
export * from "./analytics-server"

import { prisma } from "@/lib/prisma"

// Simple in-memory cache for real-time visitors
let realTimeCache: { data: any; timestamp: number } | null = null
const REALTIME_CACHE_TTL = 30 * 1000 // 30 seconds

// Function to get real-time visitors (last 5 minutes)
export async function getRealTimeVisitors() {
  // Check if we have a valid cache entry
  if (realTimeCache && Date.now() - realTimeCache.timestamp < REALTIME_CACHE_TTL) {
    return realTimeCache.data
  }

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

    const result = visitorDetails.map((visitor) => ({
      id: visitor.id,
      country: visitor.country,
      city: visitor.city,
      browser: visitor.browser,
      device: visitor.deviceType,
      currentPage: visitor.pageViews[0]?.path || "Unknown",
      lastActive: visitor.pageViews[0]?.timestamp || visitor.lastVisit,
    }))

    // Store in cache
    realTimeCache = {
      data: result,
      timestamp: Date.now(),
    }

    return result
  } catch (error) {
    console.error("Error getting real-time visitors:", error)
    throw error
  }
}

export async function getAnalytics(startDate: Date, endDate: Date) {
  // Create a cache key based on the date range
  const cacheKey = `analytics_${startDate.toISOString()}_${endDate.toISOString()}`

  // Check if we have a valid cache entry
  const cachedData = analyticsCache[cacheKey]
  if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL) {
    return cachedData.data
  }

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

    // Ensure dailyAnalytics is sorted by date
    const sortedDailyAnalytics = [...dailyAnalytics].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    )

    const result = {
      dailyAnalytics: sortedDailyAnalytics,
      totalPageViews,
      uniqueVisitors,
      topPages,
      topCountries,
      topCities,
      deviceBreakdown,
      browserBreakdown,
    }

    // Store in cache
    analyticsCache[cacheKey] = {
      data: result,
      timestamp: Date.now(),
    }

    return result
  } catch (error) {
    console.error("Error getting analytics:", error)
    throw error
  }
}
