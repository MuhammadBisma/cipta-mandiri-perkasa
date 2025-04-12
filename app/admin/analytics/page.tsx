"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { CalendarIcon, RefreshCw, Users, Clock, Globe, Monitor, Smartphone, Tablet } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { AreaChart, BarChart, DonutChart } from "@tremor/react"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import ExportAnalyticsButton from "@/components/analytics/export-analytics-button"

// Tambahkan interface untuk data analytics di bagian atas file
interface AnalyticsData {
  dailyAnalytics: DailyAnalytic[]
  totalPageViews: number
  uniqueVisitors: number
  topPages: TopPage[]
  topCountries: TopCountry[]
  topCities: TopCity[]
  deviceBreakdown: DeviceBreakdown[]
  browserBreakdown: BrowserBreakdown[]
  realTimeVisitors: RealTimeVisitor[]
}

interface DailyAnalytic {
  date: string
  pageViews: number
  uniqueVisitors: number
  newVisitors: number
  returningVisitors: number
  avgSessionDuration: number
  bounceRate: number
}

interface TopPage {
  path: string
  pageTitle?: string
  _count: { path: number }
}

interface TopCountry {
  country: string
  _count: { id: number }
}

interface TopCity {
  city: string
  country: string
  _count: { id: number }
}

interface DeviceBreakdown {
  deviceType: string
  _count: { id: number }
}

interface BrowserBreakdown {
  browser: string
  _count: { id: number }
}

interface RealTimeVisitor {
  id: string
  country: string
  city: string
  browser: string
  device: string
  currentPage: string
  lastActive: string
}

// Tambahkan fungsi helper untuk memformat data
const formatSessionDuration = (seconds: number): string => {
  if (!seconds) return "0m 0s"
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}m ${remainingSeconds}s`
}

// Tambahkan fungsi helper untuk mendapatkan warna berdasarkan tipe
const getDeviceColor = (deviceType: string): string => {
  const type = deviceType.toLowerCase()
  if (type.includes("desktop")) return deviceColors.Desktop
  if (type.includes("mobile")) return deviceColors.Mobile
  if (type.includes("tablet")) return deviceColors.Tablet
  return deviceColors.Other
}

const getBrowserColor = (browser: string): string => {
  const name = browser.toLowerCase()
  if (name.includes("chrome")) return browserColors.Chrome
  if (name.includes("firefox")) return browserColors.Firefox
  if (name.includes("safari")) return browserColors.Safari
  if (name.includes("edge")) return browserColors.Edge
  if (name.includes("opera")) return browserColors.Opera
  if (name.includes("samsung")) return browserColors["Samsung Internet"]
  if (name.includes("ie") || name.includes("internet explorer")) return browserColors.IE
  return browserColors.Other
}

// Device type colors for the chart
const deviceColors = {
  Desktop: "#0ea5e9", // Sky blue
  Mobile: "#8b5cf6", // Purple
  Tablet: "#10b981", // Emerald
  Other: "#f59e0b", // Amber
}

// Browser colors for the chart
const browserColors = {
  Chrome: "#0ea5e9", // Sky blue
  Firefox: "#f97316", // Orange
  Safari: "#10b981", // Emerald
  Edge: "#0284c7", // Blue
  Opera: "#ef4444", // Red
  "Samsung Internet": "#8b5cf6", // Purple
  IE: "#6b7280", // Gray
  Other: "#f59e0b", // Amber
}

// Refactor data preparation functions untuk lebih modular
const prepareVisitorChartData = (analyticsData: AnalyticsData | null) => {
  if (!analyticsData?.dailyAnalytics) return []

  return analyticsData.dailyAnalytics.map((day: any) => ({
    date: format(new Date(day.date), "dd MMM"),
    "Page Views": day.pageViews || 0,
    "Unique Visitors": day.uniqueVisitors || 0,
    "New Visitors": day.newVisitors || 0,
    "Returning Visitors": day.returningVisitors || 0,
  }))
}

const prepareDeviceData = (analyticsData: AnalyticsData | null) => {
  if (!analyticsData?.deviceBreakdown) return []

  return analyticsData.deviceBreakdown.map((item: any) => ({
    name: item.deviceType.charAt(0).toUpperCase() + item.deviceType.slice(1),
    value: item._count.id,
  }))
}

const prepareBrowserData = (analyticsData: AnalyticsData | null) => {
  if (!analyticsData?.browserBreakdown) return []

  return analyticsData.browserBreakdown.map((item: any) => ({
    name: item.browser,
    value: item._count.id,
  }))
}

const prepareTopPagesData = (analyticsData: AnalyticsData | null) => {
  if (!analyticsData?.topPages) return []

  return analyticsData.topPages.map((page: any) => ({
    path: page.path,
    title: page.pageTitle || page.path,
    views: page._count.path,
  }))
}

const prepareTopCountriesData = (analyticsData: AnalyticsData | null) => {
  if (!analyticsData?.topCountries) return []

  return analyticsData.topCountries.map((country: any) => ({
    country: country.country || "Unknown",
    visitors: country._count.id,
  }))
}

const prepareTopCitiesData = (analyticsData: AnalyticsData | null) => {
  if (!analyticsData?.topCities) return []

  return analyticsData.topCities.map((city: any) => ({
    city: city.city || "Unknown",
    country: city.country || "Unknown",
    visitors: city._count.id,
  }))
}

// Refactor calculation functions untuk lebih modular
const getAvgSessionDuration = (analyticsData: AnalyticsData | null) => {
  if (!analyticsData?.dailyAnalytics || analyticsData.dailyAnalytics.length === 0) return 0

  // Calculate average across all days with proper weighting by page views
  let totalDuration = 0
  let totalPageViews = 0

  analyticsData.dailyAnalytics.forEach((day) => {
    if (day.avgSessionDuration && day.pageViews) {
      totalDuration += day.avgSessionDuration * day.pageViews
      totalPageViews += day.pageViews
    }
  })

  return totalPageViews > 0 ? Math.round(totalDuration / totalPageViews) : 0
}

const getBounceRate = (analyticsData: AnalyticsData | null) => {
  if (!analyticsData?.dailyAnalytics || analyticsData.dailyAnalytics.length === 0) return 0

  // Calculate weighted average bounce rate
  let totalBounces = 0
  let totalSessions = 0

  analyticsData.dailyAnalytics.forEach((day) => {
    if (day.bounceRate !== null && day.uniqueVisitors) {
      // Convert bounce rate percentage to number of bounces
      const bounces = Math.round((day.bounceRate / 100) * day.uniqueVisitors)
      totalBounces += bounces
      totalSessions += day.uniqueVisitors
    }
  })

  return totalSessions > 0 ? Math.round((totalBounces / totalSessions) * 100) : 0
}

export default function AnalyticsPage() {
  const [startDate, setStartDate] = useState<Date>(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
  const [endDate, setEndDate] = useState<Date>(new Date())
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [realTimeVisitors, setRealTimeVisitors] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("overview")
  const { toast } = useToast()

  // Refactor fetchAnalytics function untuk lebih modular
  const fetchAnalytics = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(
        `/api/analytics?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`,
      )

      if (!response.ok) {
        throw new Error("Failed to fetch analytics data")
      }

      const data = await response.json()
      setAnalyticsData(data)
    } catch (error) {
      console.error("Error fetching analytics:", error)
      toast({
        title: "Error",
        description: "Failed to fetch analytics data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Refactor fetchRealTimeVisitors function untuk lebih modular
  const fetchRealTimeVisitors = async () => {
    try {
      const response = await fetch("/api/analytics?realTime=true")

      if (!response.ok) {
        throw new Error("Failed to fetch real-time visitors")
      }

      const data = await response.json()
      setRealTimeVisitors(data)
    } catch (error) {
      console.error("Error fetching real-time visitors:", error)
    }
  }

  // Refactor refreshAnalytics function untuk lebih modular
  const refreshAnalytics = async () => {
    try {
      setIsRefreshing(true)

      // Call the API to refresh analytics data
      const response = await fetch("/api/analytics/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to refresh analytics data")
      }

      toast({
        title: "Success",
        description: "Analytics data refreshed successfully",
      })

      // Fetch the updated data
      fetchAnalytics()
    } catch (error) {
      console.error("Error refreshing analytics:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to refresh analytics data",
        variant: "destructive",
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  // Initial data fetch
  useEffect(() => {
    fetchAnalytics()
  }, [startDate, endDate])

  // Fetch real-time visitors when on the real-time tab
  useEffect(() => {
    if (activeTab === "real-time") {
      fetchRealTimeVisitors()
      const interval = setInterval(fetchRealTimeVisitors, 30000) // Refresh every 30 seconds
      return () => clearInterval(interval)
    }
  }, [activeTab])

  // Prepare chart data

  // Add a custom tooltip for the visitor chart to show more detailed information
  const visitorChartTooltip = (props: any) => {
    const { payload, label, active } = props
    if (!active || !payload || payload.length === 0) return null

    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="font-medium">{label}</div>
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center gap-2 text-sm">
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span>
              {entry.name}: {entry.value}
            </span>
          </div>
        ))}
      </div>
    )
  }

  // Prepare device breakdown data

  // Prepare browser breakdown data

  // Prepare top pages data

  // Prepare top countries data

  // Prepare top cities data

  // Get average session duration from analytics data

  // Get bounce rate from analytics data

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-gray-500">Track and analyze visitor data for your website</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("justify-start text-left font-normal", !startDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : "Start date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => date && setStartDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("justify-start text-left font-normal", !endDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : "End date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={endDate} onSelect={(date) => date && setEndDate(date)} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex gap-2">
            <Button onClick={refreshAnalytics} disabled={isRefreshing}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>

            <ExportAnalyticsButton startDate={startDate} endDate={endDate} />
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pages">Pages</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="real-time">Real-time</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="pb-2">
                    <div className="h-5 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Page Views</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{analyticsData?.totalPageViews || 0}</div>
                  <p className="text-xs text-gray-500 mt-1">
                    During {format(startDate, "PP")} - {format(endDate, "PP")}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{analyticsData?.uniqueVisitors || 0}</div>
                  <p className="text-xs text-gray-500 mt-1">
                    During {format(startDate, "PP")} - {format(endDate, "PP")}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Session Duration</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {formatSessionDuration(getAvgSessionDuration(analyticsData))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Average time spent on site</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{`${getBounceRate(analyticsData)}%`}</div>
                  <p className="text-xs text-gray-500 mt-1">Single page sessions</p>
                </CardContent>
              </Card>
            </div>
          )}

          {!isLoading && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Visitor Trends</CardTitle>
                  <CardDescription>Page views and unique visitors over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <AreaChart
                    className="h-72"
                    data={prepareVisitorChartData(analyticsData)}
                    index="date"
                    categories={["Page Views", "Unique Visitors", "New Visitors", "Returning Visitors"]}
                    colors={["blue", "indigo", "green", "purple"]}
                    valueFormatter={(number) => number.toString()}
                    showLegend
                    showAnimation
                    customTooltip={visitorChartTooltip}
                  />
                </CardContent>
              </Card>

              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Device Breakdown</CardTitle>
                    <CardDescription>Visitors by device type</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <DonutChart
                      className="h-60"
                      data={prepareDeviceData(analyticsData)}
                      category="value"
                      index="name"
                      colors={Object.values(deviceColors)}
                      valueFormatter={(number) => `${number} visitors`}
                      showAnimation
                    />
                    <div className="mt-4 flex flex-wrap justify-center gap-3">
                      <div className="flex items-center">
                        <div
                          className="h-3 w-3 rounded-full mr-1"
                          style={{ backgroundColor: deviceColors.Desktop }}
                        ></div>
                        <span className="text-sm">Desktop</span>
                      </div>
                      <div className="flex items-center">
                        <div
                          className="h-3 w-3 rounded-full mr-1"
                          style={{ backgroundColor: deviceColors.Mobile }}
                        ></div>
                        <span className="text-sm">Mobile</span>
                      </div>
                      <div className="flex items-center">
                        <div
                          className="h-3 w-3 rounded-full mr-1"
                          style={{ backgroundColor: deviceColors.Tablet }}
                        ></div>
                        <span className="text-sm">Tablet</span>
                      </div>
                      <div className="flex items-center">
                        <div
                          className="h-3 w-3 rounded-full mr-1"
                          style={{ backgroundColor: deviceColors.Other }}
                        ></div>
                        <span className="text-sm">Other</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Browser Breakdown</CardTitle>
                    <CardDescription>Visitors by browser</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <BarChart
                      className="h-60"
                      data={prepareBrowserData(analyticsData)}
                      index="name"
                      categories={["value"]}
                      colors={["blue"]}
                      valueFormatter={(number) => `${number} visitors`}
                      showLegend={false}
                      showAnimation
                      customTooltip={(props) => {
                        const { payload, active } = props
                        if (!active || !payload) return null

                        const categoryValue = payload[0]?.payload
                        if (!categoryValue) return null

                        const browserName = categoryValue.name
                        const value = categoryValue.value
                        const color = getBrowserColor(browserName)

                        return (
                          <div className="rounded-lg border bg-background p-2 shadow-sm">
                            <div className="flex items-center">
                              <div className="h-2 w-2 rounded-full mr-1" style={{ backgroundColor: color }}></div>
                              <span className="font-medium">{browserName}</span>
                            </div>
                            <div className="mt-1 text-sm text-muted-foreground">{value} visitors</div>
                          </div>
                        )
                      }}
                    />
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="pages" className="space-y-6">
          {isLoading ? (
            <Card className="animate-pulse">
              <CardHeader>
                <div className="h-5 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-10 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Top Pages</CardTitle>
                <CardDescription>Most visited pages on your website</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Page</TableHead>
                      <TableHead className="text-right">Views</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {prepareTopPagesData(analyticsData).map((page, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="font-medium">{page.title}</div>
                          <div className="text-sm text-gray-500">{page.path}</div>
                        </TableCell>
                        <TableCell className="text-right">{page.views}</TableCell>
                      </TableRow>
                    ))}
                    {prepareTopPagesData(analyticsData).length === 0 && (
                      <TableRow>
                        <TableCell colSpan={2} className="text-center py-4 text-gray-500">
                          No page view data available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="locations" className="space-y-6">
          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2">
              {[1, 2].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-5 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[1, 2, 3, 4, 5].map((j) => (
                        <div key={j} className="h-10 bg-gray-200 rounded"></div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Top Countries</CardTitle>
                  <CardDescription>Visitors by country</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Country</TableHead>
                        <TableHead className="text-right">Visitors</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {prepareTopCountriesData(analyticsData).map((country, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <div className="flex items-center">
                              <Globe className="h-4 w-4 mr-2 text-gray-500" />
                              <span>{country.country}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">{country.visitors}</TableCell>
                        </TableRow>
                      ))}
                      {prepareTopCountriesData(analyticsData).length === 0 && (
                        <TableRow>
                          <TableCell colSpan={2} className="text-center py-4 text-gray-500">
                            No country data available
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Cities</CardTitle>
                  <CardDescription>Visitors by city</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>City</TableHead>
                        <TableHead>Country</TableHead>
                        <TableHead className="text-right">Visitors</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {prepareTopCitiesData(analyticsData).map((city, index) => (
                        <TableRow key={index}>
                          <TableCell>{city.city}</TableCell>
                          <TableCell>{city.country}</TableCell>
                          <TableCell className="text-right">{city.visitors}</TableCell>
                        </TableRow>
                      ))}
                      {prepareTopCitiesData(analyticsData).length === 0 && (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-4 text-gray-500">
                            No city data available
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="real-time" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-primary" />
                Real-time Visitors
                <Badge className="ml-2 bg-green-500">{realTimeVisitors.length} active</Badge>
              </CardTitle>
              <CardDescription>Visitors currently active on your website (last 5 minutes)</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Location</TableHead>
                    <TableHead>Browser</TableHead>
                    <TableHead>Device</TableHead>
                    <TableHead>Current Page</TableHead>
                    <TableHead>Last Activity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {realTimeVisitors.map((visitor) => (
                    <TableRow key={visitor.id}>
                      <TableCell>
                        <div className="flex items-center">
                          <Globe className="h-4 w-4 mr-2 text-gray-500" />
                          <span>
                            {visitor.city && visitor.city !== "Unknown"
                              ? `${visitor.city}, ${visitor.country}`
                              : visitor.country}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{visitor.browser}</TableCell>
                      <TableCell>
                        {visitor.device === "mobile" ? (
                          <Smartphone className="h-4 w-4 text-gray-500" />
                        ) : visitor.device === "tablet" ? (
                          <Tablet className="h-4 w-4 text-gray-500" />
                        ) : (
                          <Monitor className="h-4 w-4 text-gray-500" />
                        )}
                        <span className="ml-2">{visitor.device}</span>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[200px] truncate" title={visitor.currentPage}>
                          {visitor.currentPage}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{format(new Date(visitor.lastActive), "HH:mm:ss")}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {realTimeVisitors.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                        No active visitors at the moment
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
