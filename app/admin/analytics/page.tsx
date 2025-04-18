"use client"

import { useState, useEffect, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  CalendarIcon,
  RefreshCw,
  Users,
  Clock,
  Globe,
  Monitor,
  Smartphone,
  Tablet,
  AlertTriangle,
  LineChart,
  FileText,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { AreaChart, DonutChart } from "@tremor/react"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import ExportAnalyticsButton from "@/components/analytics/export-analytics-button"

// Define types for analytics data
interface AnalyticsData {
  dailyAnalytics?: DailyAnalytic[]
  totalPageViews?: number
  uniqueVisitors?: number
  topPages?: TopPage[]
  topCountries?: TopCountry[]
  topCities?: TopCity[]
  deviceBreakdown?: DeviceBreakdown[]
  browserBreakdown?: BrowserBreakdown[]
}

interface DailyAnalytic {
  date: string
  pageViews: number
  uniqueVisitors: number
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

interface ChartDataPoint {
  date: string
  [key: string]: string | number
}

interface TooltipProps {
  payload?: {
    payload: any
    value: number
    name: string
    color: string
  }[]
  label?: string
  active?: boolean
}

export default function AnalyticsPage() {
  const [startDate, setStartDate] = useState<Date>(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
  const [endDate, setEndDate] = useState<Date>(new Date())
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [realTimeVisitors, setRealTimeVisitors] = useState<RealTimeVisitor[]>([])
  const [activeTab, setActiveTab] = useState("overview")
  const { toast } = useToast()

  // Fetch analytics data
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

  // Fetch real-time visitors
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

  // Refresh analytics data
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate])

  // Fetch real-time visitors when on the real-time tab
  useEffect(() => {
    if (activeTab === "real-time") {
      fetchRealTimeVisitors()
      const interval = setInterval(fetchRealTimeVisitors, 30000) // Refresh every 30 seconds
      return () => clearInterval(interval)
    }
  }, [activeTab])

  // Format session duration for display
  const formatSessionDuration = (seconds: number) => {
    if (!seconds) return "0m 0s"
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  // Prepare chart data
  const prepareVisitorChartData = (): ChartDataPoint[] => {
    if (!analyticsData?.dailyAnalytics) return []

    return analyticsData.dailyAnalytics.map((day) => ({
      date: format(new Date(day.date), "dd MMM"),
      "Page Views": day.pageViews || 0,
      "Unique Visitors": day.uniqueVisitors || 0,
      "New Visitors": 0, // Default value if not available
      "Returning Visitors": 0, // Default value if not available
    }))
  }

  // Add a custom tooltip for the visitor chart to show more detailed information
  const visitorChartTooltip = ({ payload, label, active }: TooltipProps) => {
    if (!active || !payload || payload.length === 0) return null

    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="font-medium">{label}</div>
        {payload.map((entry, index) => (
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
  const prepareDeviceData = (): { name: string; value: number }[] => {
    if (!analyticsData?.deviceBreakdown) return []

    return analyticsData.deviceBreakdown.map((item) => ({
      name: item.deviceType.charAt(0).toUpperCase() + item.deviceType.slice(1),
      value: item._count.id,
    }))
  }

  // Prepare browser breakdown data
  const prepareBrowserData = (): { name: string; value: number }[] => {
    if (!analyticsData?.browserBreakdown) return []

    return analyticsData.browserBreakdown.map((item) => ({
      name: item.browser,
      value: item._count.id,
    }))
  }

  // Prepare top pages data
  const prepareTopPagesData = (): { path: string; title: string; views: number }[] => {
    if (!analyticsData?.topPages) return []

    return analyticsData.topPages.map((page) => ({
      path: page.path,
      title: page.pageTitle || page.path,
      views: page._count.path,
    }))
  }

  // Prepare top countries data
  const prepareTopCountriesData = (): { country: string; visitors: number }[] => {
    if (!analyticsData?.topCountries) return []

    return analyticsData.topCountries.map((country) => ({
      country: country.country || "Unknown",
      visitors: country._count.id,
    }))
  }

  // Prepare top cities data
  const prepareTopCitiesData = (): { city: string; country: string; visitors: number }[] => {
    if (!analyticsData?.topCities) return []

    return analyticsData.topCities.map((city) => ({
      city: city.city || "Unknown",
      country: city.country || "Unknown",
      visitors: city._count.id,
    }))
  }

  // Get average session duration from analytics data
  const getAvgSessionDuration = (): number => {
    if (!analyticsData?.dailyAnalytics || analyticsData.dailyAnalytics.length === 0) return 0

    // Calculate average across all days with proper weighting by page views
    let totalDuration = 0
    let totalPageViews = 0

    analyticsData.dailyAnalytics.forEach((day: { avgSessionDuration?: number; pageViews: number }) => {
      if (day.avgSessionDuration && day.pageViews) {
        totalDuration += day.avgSessionDuration * day.pageViews
        totalPageViews += day.pageViews
      }
    })

    return totalPageViews > 0 ? Math.round(totalDuration / totalPageViews) : 0
  }

  // Get bounce rate from analytics data
  const getBounceRate = (): number => {
    if (!analyticsData?.dailyAnalytics || analyticsData.dailyAnalytics.length === 0) return 0

    // Calculate weighted average bounce rate
    let totalBounces = 0
    let totalSessions = 0

    analyticsData.dailyAnalytics.forEach((day: { bounceRate?: number | null; uniqueVisitors: number }) => {
      if (day.bounceRate !== null && day.bounceRate !== undefined && day.uniqueVisitors) {
        // Convert bounce rate percentage to number of bounces
        const bounces = Math.round((day.bounceRate / 100) * day.uniqueVisitors)
        totalBounces += bounces
        totalSessions += day.uniqueVisitors
      }
    })

    return totalSessions > 0 ? Math.round((totalBounces / totalSessions) * 100) : 0
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

  // Get color for device
  const getDeviceColor = (deviceType: string): string => {
    const type = deviceType.toLowerCase()
    if (type.includes("desktop")) return deviceColors.Desktop
    if (type.includes("mobile")) return deviceColors.Mobile
    if (type.includes("tablet")) return deviceColors.Tablet
    return deviceColors.Other
  }

  // Get color for browser
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

  // Prepare device data with colors
  const prepareDeviceDataWithColors = () => {
    const data = prepareDeviceData()
    return data.map((item) => ({
      ...item,
      color: getDeviceColor(item.name),
    }))
  }

  // Prepare browser data with colors
  const prepareBrowserDataWithColors = () => {
    const data = prepareBrowserData()
    return data.map((item) => ({
      ...item,
      color: getBrowserColor(item.name),
    }))
  }

  return (
    <div className="space-y-6">
      {/* Enhance the analytics page header */}
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
                  className={cn(
                    "justify-start text-left font-normal rounded-xl",
                    !startDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : "Start date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white">
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
                  className={cn("justify-start text-left font-normal rounded-xl", !endDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : "End date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white">
                <Calendar mode="single" selected={endDate} onSelect={(date) => date && setEndDate(date)} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex gap-2">
            <Button
              className="rounded-xl bg-indigo-600 hover:bg-indigo-700"
              onClick={refreshAnalytics}
              disabled={isRefreshing}
            >
              <RefreshCw className={`mr-2 h-4 w-4 rounded-xl ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>

            <ExportAnalyticsButton startDate={startDate} endDate={endDate} />
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        {/* Enhance the tabs */}
        <TabsList className="grid grid-cols-4 mb-6 rounded-xl overflow-hidden">
          <TabsTrigger value="overview" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
            Overview
          </TabsTrigger>
          <TabsTrigger value="pages" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
            Pages
          </TabsTrigger>
          <TabsTrigger value="locations" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
            Locations
          </TabsTrigger>
          <TabsTrigger value="real-time" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
            Real-time
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 rounded-xl">
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
            /* Enhance the stats cards */
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="rounded-xl overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-blue-50 to-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Monitor className="h-4 w-4 mr-2 text-blue-500" />
                    Total Page Views
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{analyticsData?.totalPageViews || 0}</div>
                  <p className="text-xs text-gray-500 mt-1">
                    During {format(startDate, "PP")} - {format(endDate, "PP")}
                  </p>
                </CardContent>
              </Card>

              <Card className="rounded-xl overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-indigo-50 to-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Users className="h-4 w-4 mr-2 text-indigo-500" />
                    Unique Visitors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{analyticsData?.uniqueVisitors || 0}</div>
                  <p className="text-xs text-gray-500 mt-1">
                    During {format(startDate, "PP")} - {format(endDate, "PP")}
                  </p>
                </CardContent>
              </Card>

              <Card className="rounded-xl overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-green-50 to-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-green-500" />
                    Avg. Session Duration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{formatSessionDuration(getAvgSessionDuration())}</div>
                  <p className="text-xs text-gray-500 mt-1">Average time spent on site</p>
                </CardContent>
              </Card>

              <Card className="rounded-xl overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-amber-50 to-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
                    Bounce Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{`${getBounceRate()}%`}</div>
                  <p className="text-xs text-gray-500 mt-1">Single page sessions</p>
                </CardContent>
              </Card>
            </div>
          )}

          {!isLoading && (
            <>
              {/* Enhance the visitor trends chart */}
              <Card className="rounded-xl overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <LineChart className="h-5 w-5 mr-2 text-indigo-500" />
                    Visitor Trends
                  </CardTitle>
                  <CardDescription>Page views and unique visitors over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <AreaChart
                    className="h-72"
                    data={prepareVisitorChartData()}
                    index="date"
                    categories={["Page Views", "Unique Visitors", "New Visitors", "Returning Visitors"]}
                    colors={["blue", "indigo", "green", "purple"]}
                    valueFormatter={(number: number) => number.toString()}
                    showLegend
                    showAnimation
                    customTooltip={visitorChartTooltip}
                  />
                </CardContent>
              </Card>

              {/* Enhance the device and browser breakdown charts */}
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="rounded-xl overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Smartphone className="h-5 w-5 mr-2 text-blue-500" />
                      Device Breakdown
                    </CardTitle>
                    <CardDescription>Visitors by device type</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <DonutChart
                      className="h-60"
                      data={prepareDeviceDataWithColors()}
                      category="value"
                      index="name"
                      colors={["#0ea5e9", "#8b5cf6", "#10b981", "#f59e0b"]}
                      valueFormatter={(number: number) => `${number} visitors`}
                      showAnimation
                      showTooltip
                      showLabel
                      customTooltip={(props) => {
                        return (
                          <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200 min-w-[180px]">
                            <h3 className="font-semibold mb-2">Device Breakdown</h3>
                            <p className="text-sm text-gray-500 mb-3">Visitors by device type</p>
                            
                            <div className="space-y-2">
                              {props.payload?.map((item: { color: any; name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; value: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined }, index: Key | null | undefined) => (
                                <div key={index} className="flex justify-between items-center">
                                  <div className="flex items-center">
                                    <div 
                                      className="h-3 w-3 rounded-full mr-2" 
                                      style={{ backgroundColor: item.color }}
                                    ></div>
                                    <span className="text-sm">{item.name}</span>
                                  </div>
                                  <span className="text-sm font-medium">
                                    {item.value} visitors
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      }}
                    />
                    <div className="mt-4 flex flex-wrap justify-center gap-3">
                      {Object.entries(deviceColors).map(([name, color]) => (
                        <div key={name} className="flex items-center bg-gray-50 px-2 py-1 rounded-full">
                          <div className="h-3 w-3 rounded-full mr-1" style={{ backgroundColor: color }}></div>
                          <span className="text-sm">{name}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-xl overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300">
  <CardHeader>
    <CardTitle className="flex items-center">
      <Globe className="h-5 w-5 mr-2 text-indigo-500" />
      Browser Breakdown
    </CardTitle>
    <CardDescription>Visitors by browser</CardDescription>
  </CardHeader>
  <CardContent>
    <DonutChart
      className="h-60"
      data={prepareBrowserDataWithColors()}
      category="value"
      index="name"
      colors={Object.values(browserColors)}
      valueFormatter={(number: number) => `${number} visitors`}
      showAnimation
      showTooltip
      showLabel
      customTooltip={(props) => {
        return (
          <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200 min-w-[180px]">
            <h3 className="font-semibold mb-2">Browser Breakdown</h3>
            <p className="text-sm text-gray-500 mb-3">Visitors by browser</p>
            
            <div className="space-y-2">
              {props.payload?.map((item: { color: any; name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; value: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined }, index: Key | null | undefined) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div 
                      className="h-3 w-3 rounded-full mr-2" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium">
                    {item.value} visitors
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      }}
    />
    <div className="mt-4 flex flex-wrap justify-center gap-2">
      {Object.entries(browserColors).map(([name, color]) => (
        <div key={name} className="flex items-center bg-gray-50 px-2 py-1 rounded-full">
          <div className="h-3 w-3 rounded-full mr-1" style={{ backgroundColor: color }}></div>
          <span className="text-sm">{name}</span>
        </div>
      ))}
    </div>
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
            /* Enhance the top pages card */
            <Card className="rounded-xl overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-indigo-500" />
                  Top Pages
                </CardTitle>
                <CardDescription>Most visited pages on your website</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead>Page</TableHead>
                      <TableHead className="text-right">Views</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {prepareTopPagesData().map((page, index) => (
                      <TableRow key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <TableCell>
                          <div className="font-medium">{page.title}</div>
                          <div className="text-sm text-gray-500">{page.path}</div>
                        </TableCell>
                        <TableCell className="text-right font-medium">{page.views}</TableCell>
                      </TableRow>
                    ))}
                    {prepareTopPagesData().length === 0 && (
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
                      {prepareTopCountriesData().map((country, index) => (
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
                      {prepareTopCountriesData().length === 0 && (
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
                      {prepareTopCitiesData().map((city, index) => (
                        <TableRow key={index}>
                          <TableCell>{city.city}</TableCell>
                          <TableCell>{city.country}</TableCell>
                          <TableCell className="text-right">{city.visitors}</TableCell>
                        </TableRow>
                      ))}
                      {prepareTopCitiesData().length === 0 && (
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
          {/* Enhance the real-time visitors card */}
          <Card className="rounded-xl overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-blue-50 to-white">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-primary" />
                Real-time Visitors
                <Badge className="ml-2 bg-green-500">{realTimeVisitors.length} active</Badge>
              </CardTitle>
              <CardDescription>Visitors currently active on your website (last 5 minutes)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead>Location</TableHead>
                      <TableHead>Browser</TableHead>
                      <TableHead>Device</TableHead>
                      <TableHead>Current Page</TableHead>
                      <TableHead>Last Activity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {realTimeVisitors.map((visitor, index) => (
                      <TableRow key={visitor.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
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
                          <div className="flex items-center">
                            {visitor.device === "mobile" ? (
                              <Smartphone className="h-4 w-4 mr-2 text-gray-500" />
                            ) : visitor.device === "tablet" ? (
                              <Tablet className="h-4 w-4 mr-2 text-gray-500" />
                            ) : (
                              <Monitor className="h-4 w-4 mr-2 text-gray-500" />
                            )}
                            <span>{visitor.device}</span>
                          </div>
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
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
