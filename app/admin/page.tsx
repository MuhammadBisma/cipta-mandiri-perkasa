"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
  FileText,
  ImageIcon,
  MessageSquare,
  Users,
  Bell,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { motion } from "framer-motion"
import DashboardCard from "@/components/admin/dashboard-card"
import ActivityCard from "@/components/admin/activity-card"
import StatsCard from "@/components/admin/stats-card"
import { AreaChart, BarChart } from "@tremor/react"
import { Button } from "@/components/ui/button"
import { format, subDays, formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

interface DashboardData {
  blogCount: number
  galleryCount: number
  testimonialCount: number
  pendingTestimonialCount: number
  userName: string
}

interface AnalyticsData {
  totalPageViews: number
  uniqueVisitors: number
  topPages: { path: string; _count: { path: number } }[]
  topCountries: { country: string; _count: { id: number } }[]
  deviceBreakdown: { deviceType: string; _count: { id: number } }[]
  browserBreakdown: { browser: string; _count: { id: number } }[]
  dailyAnalytics?: { date: string; pageViews: number; uniqueVisitors: number }[]
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

interface Activity {
  id: string
  title: string
  time: string
  icon: React.ReactNode
  isNew?: boolean
}

interface Testimonial {
  id: string
  name: string
  position?: string
  message: string
  rating: number
  imageUrl?: string
  approved: boolean
  createdAt: string
  updatedAt: string
}

interface ServiceData {
  name: string
  value: number
  color: string
  path: string
}

// Define service colors - one for each service
const serviceColors = ["indigo", "cyan", "emerald", "amber", "rose", "blue", "purple", "green", "yellow", "red"]

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [realTimeVisitors, setRealTimeVisitors] = useState<RealTimeVisitor[]>([])
  const [visitorChartData, setVisitorChartData] = useState<any[]>([])
  const [serviceData, setServiceData] = useState<ServiceData[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [pendingTestimonials, setPendingTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [newTestimonialAlert, setNewTestimonialAlert] = useState(false)
  const eventSourceRef = useRef<EventSource | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  // Function to generate mock visitor data for the last 7 days
  const generateMockVisitorData = () => {
    const data = []
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i)
      data.push({
        date: format(date, "d MMM", { locale: id }),
        Pengunjung: Math.floor(Math.random() * 100) + 50,
        "Tampilan Halaman": Math.floor(Math.random() * 200) + 100,
      })
    }
    return data
  }

  // Function to fetch pending testimonials
  const fetchPendingTestimonials = async () => {
    try {
      const res = await fetch("/api/testimonials/pending")
      if (!res.ok) {
        throw new Error("Failed to fetch pending testimonials")
      }
      const data = await res.json()
      setPendingTestimonials(data.testimonials || [])
      return data.testimonials?.length || 0
    } catch (err) {
      console.error("Error fetching pending testimonials:", err)
      return 0
    }
  }

  // Function to fetch popular services
  const fetchPopularServices = async () => {
    try {
      const startDate = format(subDays(new Date(), 30), "yyyy-MM-dd")
      const endDate = format(new Date(), "yyyy-MM-dd")

      const res = await fetch(`/api/analytics/popular-services?startDate=${startDate}&endDate=${endDate}&limit=7`)

      if (!res.ok) {
        throw new Error("Failed to fetch popular services")
      }

      const data = await res.json()

      if (data.success && Array.isArray(data.services)) {
        setServiceData(data.services)
        return data.services
      } else {
        throw new Error("Invalid response format")
      }
    } catch (err) {
      console.error("Error fetching popular services:", err)

      // Return default data in case of error
      const defaultServices = [
        { name: "Kubah Masjid", value: 45, color: serviceColors[0], path: "/services/kubah-masjid" },
        { name: "Mimbar", value: 38, color: serviceColors[1], path: "/services/mimbar" },
        { name: "Menara", value: 32, color: serviceColors[2], path: "/services/menara" },
        { name: "Kerawangan", value: 28, color: serviceColors[3], path: "/services/kerawangan" },
        { name: "Kaligrafi", value: 25, color: serviceColors[4], path: "/services/kaligrafi" },
        { name: "Ornamen", value: 20, color: serviceColors[5], path: "/services/ornamen" },
        { name: "Pintu", value: 15, color: serviceColors[6], path: "/services/pintu" },
      ]

      setServiceData(defaultServices)
      return defaultServices
    }
  }

  // Function to fetch all dashboard data
  const fetchDashboardData = async () => {
    setRefreshing(true)
    try {
      // Fetch content counts
      const [blogRes, galleryRes, testimonialRes, analyticsRes, realTimeRes] = await Promise.all([
        fetch("/api/blog"),
        fetch("/api/gallery"),
        fetch("/api/testimonials?admin=true"),
        fetch(
          `/api/analytics?startDate=${format(subDays(new Date(), 7), "yyyy-MM-dd")}&endDate=${format(new Date(), "yyyy-MM-dd")}`,
        ),
        fetch("/api/analytics?realTime=true"),
      ])

      if (!blogRes.ok || !galleryRes.ok || !testimonialRes.ok) {
        throw new Error("Failed to fetch content data")
      }

      if (!analyticsRes.ok) {
        throw new Error("Failed to fetch analytics data")
      }

      const [blogData, galleryData, testimonialData, analytics, realTime] = await Promise.all([
        blogRes.json(),
        galleryRes.json(),
        testimonialRes.json(),
        analyticsRes.json(),
        realTimeRes.json(),
      ])

      // Fetch pending testimonials
      const pendingCount = await fetchPendingTestimonials()

      // Fetch popular services
      await fetchPopularServices()

      // Set dashboard data
      setData({
        blogCount: blogData.length || 0,
        galleryCount: galleryData.length || 0,
        testimonialCount: testimonialData.length || 0,
        pendingTestimonialCount: pendingCount,
        userName: "Admin", // This could come from a user profile API
      })

      // Set analytics data
      setAnalyticsData(analytics)
      setRealTimeVisitors(Array.isArray(realTime) ? realTime : [])

      // Generate visitor chart data from the last 7 days
      let chartData = []

      // Check if we have daily analytics data from the API
      if (analytics.dailyAnalytics && Array.isArray(analytics.dailyAnalytics) && analytics.dailyAnalytics.length > 0) {
        // Use real data from API
        chartData = analytics.dailyAnalytics.map((day: any) => ({
          date: format(new Date(day.date), "d MMM", { locale: id }),
          Pengunjung: day.uniqueVisitors || 0,
          "Tampilan Halaman": day.pageViews || 0,
        }))
      } else {
        // If no data or wrong format, use mock data
        console.log("Using mock visitor data because API data is not available or in wrong format")
        chartData = generateMockVisitorData()
      }

      setVisitorChartData(chartData)

      // Generate recent activities
      const recentActivities: Activity[] = []

      // Add recent page views
      if (Array.isArray(realTime) && realTime.length > 0) {
        recentActivities.push({
          id: "visitors",
          title: `${realTime.length} pengunjung aktif saat ini`,
          time: "Saat ini",
          icon: <Users className="h-4 w-4 text-green-500" />,
        })
      }

      // Add recent blog posts
      if (Array.isArray(blogData) && blogData.length > 0) {
        const recentBlog = blogData[0]
        recentActivities.push({
          id: `blog-${recentBlog.id}`,
          title: `Blog post baru: ${recentBlog.title}`,
          time: format(new Date(recentBlog.createdAt), "d MMM yyyy, HH:mm", { locale: id }),
          icon: <FileText className="h-4 w-4 text-blue-500" />,
        })
      }

      // Add recent testimonials
      if (pendingCount > 0) {
        recentActivities.push({
          id: "pending-testimonials",
          title: `${pendingCount} testimoni menunggu persetujuan`,
          time: "Perlu ditinjau",
          icon: <MessageSquare className="h-4 w-4 text-yellow-500" />,
        })
      }

      // Add recent gallery items
      if (Array.isArray(galleryData) && galleryData.length > 0) {
        const recentGallery = galleryData[0]
        recentActivities.push({
          id: `gallery-${recentGallery.id}`,
          title: `Foto baru: ${recentGallery.title}`,
          time: format(new Date(recentGallery.createdAt), "d MMM yyyy, HH:mm", { locale: id }),
          icon: <ImageIcon className="h-4 w-4 text-green-500" />,
        })
      }

      // Add a notification about analytics
      recentActivities.push({
        id: "analytics-update",
        title: `Analitik diperbarui`,
        time: format(new Date(), "d MMM yyyy, HH:mm", { locale: id }),
        icon: <Bell className="h-4 w-4 text-red-500" />,
      })

      setActivities(recentActivities)
      setError(null)
    } catch (err) {
      console.error("Error fetching dashboard data:", err)
      setError("Gagal memuat data dashboard. Silakan coba lagi.")

      // Set fallback data for charts
      setVisitorChartData(generateMockVisitorData())

      // Set fallback data for services
      const defaultServices = [
        { name: "Kubah Masjid", value: 45, color: serviceColors[0], path: "/services/kubah-masjid" },
        { name: "Mimbar", value: 38, color: serviceColors[1], path: "/services/mimbar" },
        { name: "Menara", value: 32, color: serviceColors[2], path: "/services/menara" },
        { name: "Kerawangan", value: 28, color: serviceColors[3], path: "/services/kerawangan" },
        { name: "Kaligrafi", value: 25, color: serviceColors[4], path: "/services/kaligrafi" },
        { name: "Ornamen", value: 20, color: serviceColors[5], path: "/services/ornamen" },
        { name: "Pintu", value: 15, color: serviceColors[6], path: "/services/pintu" },
      ]

      setServiceData(defaultServices)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Setup SSE connection for real-time updates
  useEffect(() => {
    // Connect to SSE endpoint
    const connectSSE = () => {
      const eventSource = new EventSource("/api/testimonials/sse")
      eventSourceRef.current = eventSource

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)

          if (data.type === "new_testimonial") {
            // Update pending testimonials count and list
            fetchPendingTestimonials().then((count) => {
              setData((prev) => (prev ? { ...prev, pendingTestimonialCount: count } : null))
              setNewTestimonialAlert(true)

              // Show toast notification
              toast({
                title: "Testimoni Baru",
                description: `${data.testimonial.name} telah mengirimkan testimoni baru.`,
                variant: "default",
              })

              // Add to activities
              setActivities((prev) => [
                {
                  id: `new-testimonial-${data.testimonial.id}`,
                  title: `Testimoni baru dari ${data.testimonial.name}`,
                  time: "Baru saja",
                  icon: <MessageSquare className="h-4 w-4 text-yellow-500" />,
                  isNew: true,
                },
                ...prev.filter((a) => a.id !== "pending-testimonials"),
              ])

              // Update pending testimonials activity
              if (count > 0) {
                setActivities((prev) => [
                  {
                    id: "pending-testimonials",
                    title: `${count} testimoni menunggu persetujuan`,
                    time: "Perlu ditinjau",
                    icon: <MessageSquare className="h-4 w-4 text-yellow-500" />,
                  },
                  ...prev.filter((a) => a.id !== "pending-testimonials"),
                ])
              }
            })
          } else if (
            data.type === "testimonial_approved" ||
            data.type === "testimonial_rejected" ||
            data.type === "testimonial_deleted"
          ) {
            // Update pending testimonials count
            fetchPendingTestimonials().then((count) => {
              setData((prev) => (prev ? { ...prev, pendingTestimonialCount: count } : null))

              // Update activities
              if (count > 0) {
                setActivities((prev) => {
                  const filtered = prev.filter((a) => a.id !== "pending-testimonials")
                  return [
                    {
                      id: "pending-testimonials",
                      title: `${count} testimoni menunggu persetujuan`,
                      time: "Perlu ditinjau",
                      icon: <MessageSquare className="h-4 w-4 text-yellow-500" />,
                    },
                    ...filtered,
                  ]
                })
              } else {
                setActivities((prev) => prev.filter((a) => a.id !== "pending-testimonials"))
              }

              // Add approval/rejection/deletion activity
              let actionType = "diproses"
              let icon = <Bell className="h-4 w-4 text-blue-500" />

              if (data.type === "testimonial_approved") {
                actionType = "disetujui"
                icon = <CheckCircle className="h-4 w-4 text-green-500" />
              } else if (data.type === "testimonial_rejected") {
                actionType = "ditolak"
                icon = <XCircle className="h-4 w-4 text-red-500" />
              } else if (data.type === "testimonial_deleted") {
                actionType = "dihapus"
                icon = <AlertTriangle className="h-4 w-4 text-amber-500" />
              }

              setActivities((prev) => [
                {
                  id: `${data.type}-${data.testimonialId}`,
                  title: `Testimoni telah ${actionType}`,
                  time: "Baru saja",
                  icon,
                  isNew: true,
                },
                ...prev,
              ])
            })
          }
        } catch (error) {
          console.error("Error parsing SSE data:", error)
        }
      }

      eventSource.onerror = (error) => {
        console.error("SSE connection error:", error)
        eventSource.close()

        // Try to reconnect after a delay
        setTimeout(connectSSE, 5000)
      }
    }

    connectSSE()

    // Cleanup function
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
      }
    }
  }, [toast])

  // Fetch data on component mount
  useEffect(() => {
    fetchDashboardData()

    // Set up interval to refresh real-time visitors every 30 seconds
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/analytics?realTime=true")
        if (res.ok) {
          const realTime = await res.json()
          if (Array.isArray(realTime)) {
            setRealTimeVisitors(realTime)
          }
        }
      } catch (err) {
        console.error("Error refreshing real-time visitors:", err)
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  // Reset new testimonial alert after 5 seconds
  useEffect(() => {
    if (newTestimonialAlert) {
      const timer = setTimeout(() => {
        setNewTestimonialAlert(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [newTestimonialAlert])

  // Navigate to testimonials page
  const goToTestimonials = () => {
    router.push("/admin/testimonials")
  }

  // Navigate to service page when clicking on a service in the chart
  const handleServiceClick = (service: ServiceData) => {
    if (service.path) {
      window.open(service.path, "_blank")
    }
  }

  // Generate website stats
  const websiteStats = [
    {
      label: "Total Pengunjung",
      value: analyticsData?.uniqueVisitors?.toString() || "0",
      change: 12, // This would ideally be calculated from historical data
    },
    {
      label: "Halaman Terpopuler",
      value: analyticsData?.topPages?.[0]?.path || "Beranda",
    },
    {
      label: "Negara Terbanyak",
      value: analyticsData?.topCountries?.[0]?.country || "Indonesia",
    },
    {
      label: "Browser Terpopuler",
      value: analyticsData?.browserBreakdown?.[0]?.browser || "Chrome",
    },
  ]

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-100px)]">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          <p className="mt-4 text-gray-500">Memuat data dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-500">Selamat datang, {data?.userName || "Admin"}!</p>
        </div>
        <Button onClick={fetchDashboardData} variant="outline" size="sm" className="gap-2" disabled={refreshing}>
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          Refresh Data
        </Button>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2"
        >
          <AlertTriangle className="h-5 w-5" />
          <p>{error}</p>
        </motion.div>
      )}

      {/* Equal-sized dashboard cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="h-full">
          <DashboardCard
            title="Blog Posts"
            value={data?.blogCount || 0}
            icon={<FileText className="h-8 w-8" />}
            description="Total artikel blog"
            color="blue"
            index={0}
            className="h-full"
          />
        </div>
        <div className="h-full">
          <DashboardCard
            title="Gallery Items"
            value={data?.galleryCount || 0}
            icon={<ImageIcon className="h-8 w-8" />}
            description="Total item galeri"
            color="green"
            index={1}
            className="h-full"
          />
        </div>
        <div className="h-full">
          <DashboardCard
            title="Testimonials"
            value={data?.testimonialCount || 0}
            icon={<MessageSquare className="h-8 w-8" />}
            description="Total testimoni"
            color="yellow"
            index={2}
            className="h-full"
          />
        </div>
        <div className="h-full">
          <DashboardCard
            title="Pending Approvals"
            value={data?.pendingTestimonialCount || 0}
            icon={<Users className="h-8 w-8" />}
            description="Testimoni menunggu persetujuan"
            color="red"
            index={3}
            badge={newTestimonialAlert ? "Baru!" : undefined}
            isAnimating={newTestimonialAlert}
            onClick={goToTestimonials}
            className="h-full"
          />
        </div>
      </div>

      {pendingTestimonials.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Testimoni Menunggu Persetujuan</h3>
                <Button variant="outline" size="sm" onClick={goToTestimonials}>
                  Lihat Semua
                </Button>
              </div>
              <div className="space-y-4">
                {pendingTestimonials.slice(0, 3).map((testimonial, index) => (
                  <motion.div
                    key={testimonial.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="p-4 border rounded-lg bg-amber-50 relative"
                  >
                    {new Date(testimonial.createdAt).getTime() > Date.now() - 5 * 60 * 1000 && (
                      <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                        Baru!
                      </div>
                    )}
                    <div className="flex justify-between">
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-gray-500">
                        {formatDistanceToNow(new Date(testimonial.createdAt), { addSuffix: true, locale: id })}
                      </div>
                    </div>
                    <div className="text-sm mt-1 line-clamp-2">{testimonial.message}</div>
                    <div className="flex gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-green-600 border-green-200 hover:bg-green-50"
                        onClick={async (e) => {
                          e.stopPropagation()
                          try {
                            await fetch(`/api/testimonials/${testimonial.id}/approve`, {
                              method: "POST",
                            })
                            fetchPendingTestimonials()
                          } catch (error) {
                            console.error("Error approving testimonial:", error)
                          }
                        }}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" /> Setujui
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={async (e) => {
                          e.stopPropagation()
                          try {
                            await fetch(`/api/testimonials/${testimonial.id}/reject`, {
                              method: "POST",
                            })
                            fetchPendingTestimonials()
                          } catch (error) {
                            console.error("Error rejecting testimonial:", error)
                          }
                        }}
                      >
                        <XCircle className="h-4 w-4 mr-1" /> Tolak
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Statistik Pengunjung</h3>
                <div className="text-sm text-green-500 font-medium flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  {realTimeVisitors.length} pengunjung online
                </div>
              </div>
              {visitorChartData.length > 0 ? (
                <AreaChart
                  className="h-72"
                  data={visitorChartData}
                  index="date"
                  categories={["Pengunjung", "Tampilan Halaman"]}
                  colors={["indigo", "cyan"]}
                  valueFormatter={(number) => `${Intl.NumberFormat("id").format(number)}`}
                  showLegend
                  showAnimation
                />
              ) : (
                <div className="h-72 flex items-center justify-center bg-gray-50 rounded-lg">
                  <p className="text-gray-500">Tidak ada data pengunjung tersedia</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Layanan Terpopuler</h3>
              {serviceData.length > 0 ? (
                <div className="h-80">
                  <BarChart
                    className="h-80"
                    data={serviceData}
                    index="name"
                    categories={["value"]}
                    colors={serviceData.map((item) => item.color)}
                    valueFormatter={(number) => `${number} kunjungan`}
                    showLegend={false}
                    showAnimation
                    layout="vertical"
                    yAxisWidth={120}
                  />
                </div>
              ) : (
                <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
                  <p className="text-gray-500">Tidak ada data layanan tersedia</p>
                </div>
              )}
              {/* Service legend */}
              {serviceData.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {serviceData.map((service, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      className="justify-start hover:bg-gray-100"
                      onClick={() => handleServiceClick(service)}
                    >
                      <div className={`w-3 h-3 rounded-full bg-${service.color}-500 mr-2`}></div>
                      <span className="truncate">{service.name}</span>
                    </Button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ActivityCard
          title="Aktivitas Terbaru"
          description="Aktivitas terbaru di website"
          activities={activities}
          delay={0.6}
        />

        <StatsCard
          title="Ringkasan Website"
          description="Statistik website Cipta Mandiri Perkasa"
          stats={websiteStats}
          delay={0.7}
        />
      </div>

      {realTimeVisitors.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Pengunjung Aktif Saat Ini</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left pb-2 font-medium">Lokasi</th>
                      <th className="text-left pb-2 font-medium">Browser</th>
                      <th className="text-left pb-2 font-medium">Perangkat</th>
                      <th className="text-left pb-2 font-medium">Halaman Saat Ini</th>
                      <th className="text-left pb-2 font-medium">Terakhir Aktif</th>
                    </tr>
                  </thead>
                  <tbody>
                    {realTimeVisitors.map((visitor) => (
                      <tr key={visitor.id} className="border-b last:border-b-0">
                        <td className="py-3">
                          {visitor.city && visitor.city !== "Unknown" ? `${visitor.city}, ` : ""}
                          {visitor.country || "Unknown"}
                        </td>
                        <td className="py-3">{visitor.browser || "Unknown"}</td>
                        <td className="py-3">{visitor.device || "desktop"}</td>
                        <td className="py-3 max-w-[200px] truncate">{visitor.currentPage}</td>
                        <td className="py-3">{format(new Date(visitor.lastActive), "HH:mm:ss")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
