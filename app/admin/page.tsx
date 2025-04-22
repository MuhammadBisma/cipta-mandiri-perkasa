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
  Globe,
  Smartphone,
  Tablet,
  Monitor,
  Clock,
  Star,
} from "lucide-react"
import { motion } from "framer-motion"
import DashboardCard from "@/components/admin/dashboard-card"
import ActivityCard from "@/components/admin/activity-card"
import StatsCard from "@/components/admin/stats-card"
import { AreaChart } from "@tremor/react"
import { Button } from "@/components/ui/button"
import { format, subDays, formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import Image from "next/image"
import { PieChart, Pie, Cell, Tooltip, LabelList, ResponsiveContainer } from "recharts"

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

// Define service colors with actual color values
const serviceColors = [
  "#6366f1", // indigo
  "#06b6d4", // cyan
  "#10b981", // emerald
  "#f59e0b", // amber
  "#f43f5e", // rose
  "#3b82f6", // blue
  "#8b5cf6", // purple
  "#22c55e", // green
  "#eab308", // yellow
  "#ef4444", // red
]

// Define valid services
const validServices = ["Kubah Masjid", "Mimbar", "Menara", "Kerawangan", "Kaligrafi", "Ornamen", "Masjid"]

// Custom label renderer for the pie chart
const renderCustomizedLabel = (props: any) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, value } = props
  const RADIAN = Math.PI / 180
  const radius = innerRadius + (outerRadius - innerRadius) * 1.1
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text
      x={x}
      y={y}
      fill={serviceColors[index % serviceColors.length]}
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      className="text-xs font-medium"
    >
      {name} ({value})
    </text>
  )
}

// Custom tooltip for the pie chart
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200 min-w-[180px]">
        <h3 className="font-semibold mb-2">Layanan Terpopuler</h3>
        <p className="text-sm text-gray-500 mb-3">Detail kunjungan</p>
        <div className="space-y-2">
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }}></div>
                <span className="text-sm">{entry.name}</span>
              </div>
              <span className="text-sm font-medium">{entry.value} kunjungan</span>
            </div>
          ))}
        </div>
      </div>
    )
  }
  return null
}

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

  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [approvedTestimonial, setApprovedTestimonial] = useState<Testimonial | null>(null)

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
        // Filter out any 404 pages or invalid services
        let services = data.services.filter((service: any) => {
          const serviceName = service.name.toLowerCase()
          return (
            !serviceName.includes("404") && !serviceName.includes("not found") && !serviceName.includes("could not")
          )
        })

        // If we don't have enough services, add default ones
        if (services.length < 7) {
          const defaultServices = [
            { name: "Kubah Masjid", value: 45, color: serviceColors[0], path: "/services/kubah" },
            { name: "Mimbar", value: 38, color: serviceColors[1], path: "/services/mimbar" },
            { name: "Menara", value: 32, color: serviceColors[2], path: "/services/menara" },
            { name: "Kerawangan", value: 28, color: serviceColors[3], path: "/services/kerawangan" },
            { name: "Kaligrafi", value: 25, color: serviceColors[4], path: "/services/kaligrafi" },
            { name: "Ornamen", value: 20, color: serviceColors[5], path: "/services/ornamen" },
            { name: "Masjid", value: 15, color: serviceColors[6], path: "/services/masjid" },
          ]

          // Get names of services we already have
          const existingNames = services.map((s: any) => s.name.toLowerCase())

          // Add default services that aren't already in our list
          for (const defaultService of defaultServices) {
            if (!existingNames.includes(defaultService.name.toLowerCase()) && services.length < 7) {
              services.push({
                ...defaultService,
                color: serviceColors[services.length % serviceColors.length],
              })
            }
          }
        }

        // Limit to 7 services
        services = services.slice(0, 7)

        setServiceData(services)
        return services
      } else {
        throw new Error("Invalid response format")
      }
    } catch (err) {
      console.error("Error fetching popular services:", err)

      // Return default data in case of error
      const defaultServices = [
        { name: "Kubah Masjid", value: 45, color: serviceColors[0], path: "/services/kubah" },
        { name: "Mimbar", value: 38, color: serviceColors[1], path: "/services/mimbar" },
        { name: "Menara", value: 32, color: serviceColors[2], path: "/services/menara" },
        { name: "Kerawangan", value: 28, color: serviceColors[3], path: "/services/kerawangan" },
        { name: "Kaligrafi", value: 25, color: serviceColors[4], path: "/services/kaligrafi" },
        { name: "Ornamen", value: 20, color: serviceColors[5], path: "/services/ornamen" },
        { name: "Masjid", value: 15, color: serviceColors[6], path: "/services/masjid" },
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
        { name: "Kubah Masjid", value: 45, color: serviceColors[0], path: "/services/kubah" },
        { name: "Mimbar", value: 38, color: serviceColors[1], path: "/services/mimbar" },
        { name: "Menara", value: 32, color: serviceColors[2], path: "/services/menara" },
        { name: "Kerawangan", value: 28, color: serviceColors[3], path: "/services/kerawangan" },
        { name: "Kaligrafi", value: 25, color: serviceColors[4], path: "/services/kaligrafi" },
        { name: "Ornamen", value: 20, color: serviceColors[5], path: "/services/ornamen" },
        { name: "Masjid", value: 15, color: serviceColors[6], path: "/services/masjid" },
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
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 grid-template-rows:repeat(auto-fill, minmax(0, 1fr))">
        <div className="h-full">
          <DashboardCard
            title="Blog Posts"
            value={data?.blogCount || 0}
            icon={<FileText className="h-8 w-8" />}
            description="Total artikel blog"
            color="blue"
            index={0}
            className="h-full rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
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
            className="h-full rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
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
            className="h-full rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
          />
        </div>
        <div className="h-full">
          <DashboardCard
            title="Pending Testimoni"
            value={data?.pendingTestimonialCount || 0}
            icon={<Users className="h-8 w-8" />}
            description="Testimoni menunggu persetujuan"
            color="red"
            index={3}
            badge={newTestimonialAlert ? "Baru!" : undefined}
            isAnimating={newTestimonialAlert}
            onClick={goToTestimonials}
            className="h-full rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
          />
        </div>
      </div>

      {pendingTestimonials.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl overflow-hidden bg-gradient-to-br from-amber-50 to-white">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-amber-500" />
                  Testimoni Menunggu Persetujuan
                </h3>
                <Button variant="outline" size="sm" onClick={goToTestimonials} className="rounded-lg">
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
                    className="p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-300 relative"
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
                        className="text-green-600 border-green-200 hover:bg-green-50 rounded-lg"
                        onClick={async (e) => {
                          e.stopPropagation()
                          try {
                            const res = await fetch(`/api/testimonials/${testimonial.id}/approve`, {
                              method: "POST",
                            })
                            if (!res.ok) throw new Error("Failed to approve testimonial")

                            // Set the approved testimonial and show success modal
                            setApprovedTestimonial(testimonial)
                            setShowSuccessModal(true)

                            // Update the UI
                            await fetchPendingTestimonials()

                            // Show toast notification
                            toast({
                              title: "Testimoni Disetujui",
                              description: `Testimoni dari ${testimonial.name} telah berhasil disetujui.`,
                              variant: "default",
                            })
                          } catch (error) {
                            console.error("Error approving testimonial:", error)
                            toast({
                              title: "Error",
                              description: "Gagal menyetujui testimoni",
                              variant: "destructive",
                            })
                          }
                        }}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" /> Setujui
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-200 hover:bg-red-50 rounded-lg"
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

      {/* Statistik Pengunjung - Full Width */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl overflow-hidden">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Statistik Pengunjung</h3>
              <div className="text-sm text-green-500 font-medium flex items-center gap-1 bg-green-50 px-3 py-1 rounded-full transition-all duration-300 ease-in-out hover:bg-white hover:text-green-500 hover:shadow-lg">
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

      {/* Layanan Terpopuler - Full Width di bawah Statistik Pengunjung */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Layanan Terpopuler</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {serviceData.length > 0 ? (
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={serviceData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        animationBegin={0}
                        animationDuration={1000}
                        isAnimationActive={true}
                      >
                        {serviceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                        <LabelList dataKey="name" position="outside" content={renderCustomizedLabel} />
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
                  <p className="text-gray-500">Tidak ada data layanan tersedia</p>
                </div>
              )}

              {/* Service legend - Dipindahkan ke samping chart pada layar medium ke atas */}
              {serviceData.length > 0 && (
                <div className="flex flex-col justify-center">
                  <h4 className="text-sm font-medium text-gray-500 mb-3">Daftar Layanan</h4>
                  <div className="grid grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-2">
                    {serviceData.map((service, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        className="justify-start hover:bg-gray-100 rounded-lg"
                        onClick={() => handleServiceClick(service)}
                      >
                        <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: service.color }}></div>
                        <span className="truncate">{service.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

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
          <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl overflow-hidden bg-gradient-to-br from-blue-50 to-white">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Users className="h-5 w-5 mr-2 text-blue-500" />
                Pengunjung Aktif Saat Ini
                <div className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full flex items-center">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                  Live
                </div>
              </h3>
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left py-2 px-3 font-medium">Lokasi</th>
                      <th className="text-left py-2 px-3 font-medium">Browser</th>
                      <th className="text-left py-2 px-3 font-medium">Perangkat</th>
                      <th className="text-left py-2 px-3 font-medium">Halaman Saat Ini</th>
                      <th className="text-left py-2 px-3 font-medium">Terakhir Aktif</th>
                    </tr>
                  </thead>
                  <tbody>
                    {realTimeVisitors.map((visitor, index) => (
                      <tr
                        key={visitor.id}
                        className={`border-t ${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50 transition-colors duration-150`}
                      >
                        <td className="py-2 px-3">
                          <div className="flex items-center">
                            <Globe className="h-4 w-4 mr-2 text-gray-400" />
                            {visitor.city && visitor.city !== "Unknown" ? `${visitor.city}, ` : ""}
                            {visitor.country || "Unknown"}
                          </div>
                        </td>
                        <td className="py-2 px-3">{visitor.browser || "Unknown"}</td>
                        <td className="py-2 px-3">
                          <div className="flex items-center">
                            {visitor.device === "mobile" ? (
                              <Smartphone className="h-4 w-4 mr-1 text-gray-400" />
                            ) : visitor.device === "tablet" ? (
                              <Tablet className="h-4 w-4 mr-1 text-gray-400" />
                            ) : (
                              <Monitor className="h-4 w-4 mr-1 text-gray-400" />
                            )}
                            {visitor.device || "desktop"}
                          </div>
                        </td>
                        <td className="py-2 px-3 max-w-[200px] truncate">{visitor.currentPage}</td>
                        <td className="py-2 px-3">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-gray-400" />
                            {format(new Date(visitor.lastActive), "HH:mm:ss")}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {realTimeVisitors.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-gray-500">
                          Tidak ada pengunjung aktif saat ini
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-500" />
              Testimoni Disetujui
            </DialogTitle>
            <DialogDescription>
              Testimoni dari <span className="font-medium">{approvedTestimonial?.name}</span> telah berhasil disetujui
              dan akan ditampilkan di website.
            </DialogDescription>
          </DialogHeader>

          {approvedTestimonial && (
            <div className="bg-green-50 border border-green-100 rounded-lg p-4 my-2 overflow-hidden">
              <div className="flex items-start gap-3">
                <div className="relative h-10 w-10 flex-shrink-0">
                  <Image
                    src={approvedTestimonial.imageUrl || "/placeholder.svg"}
                    alt={approvedTestimonial.name}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium">{approvedTestimonial.name}</p>
                  <div className="flex mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < approvedTestimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-700 mt-1 line-clamp-3 break-words whitespace-normal overflow-hidden">
                    "{approvedTestimonial.message}"
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex sm:justify-between gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowSuccessModal(false)
                fetchPendingTestimonials()
              }}
            >
              Segarkan Daftar
            </Button>
            <Button
              onClick={() => {
                setShowSuccessModal(false)
                router.push("/admin/testimonials")
              }}
            >
              Lihat Semua Testimoni
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
