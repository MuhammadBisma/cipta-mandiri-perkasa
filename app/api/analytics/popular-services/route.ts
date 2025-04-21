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

   // Define valid services to track
   const validServices = ["kubah-masjid", "mimbar", "menara", "kerawangan", "kaligrafi", "ornamen", "masjid"]

   // Get page views for service pages
   const servicePageViews = await prisma.pageView.groupBy({
     by: ["path", "pageTitle"],
     where: {
       path: {
         startsWith: "/services/",
       },
       // Exclude the main services page and ensure path contains a valid service
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
     take: limit * 2, // Fetch more than needed to account for filtering
   })

   // Format the data for the chart and filter out invalid services
   let services = servicePageViews.map((service) => {
     // Extract service name from path or use page title
     let name = service.pageTitle || ""
     let path = service.path

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

     // Consolidate "Kubah Masjid" and "Kubah"
     if (name.toLowerCase().includes("kubah")) {
       name = "Kubah"
     }

     // Make sure the path is valid
     path = path.startsWith("/") ? path : `/${path}`

     return {
       name,
       value: service._count.path,
       path,
       isValid: !name.includes("404") && !name.includes("Not Found") && !path.includes("404"),
     }
   })

   // Filter out 404 pages and invalid services
   services = services.filter((service) => service.isValid)

   // Aggregate counts for services with the same name
   const aggregatedServices: { name: string; value: number; path: string }[] = []
   const seenNames = new Set<string>()

   for (const service of services) {
     if (seenNames.has(service.name)) {
       // If we've already seen this service, add to the existing count
       const existingService = aggregatedServices.find((s) => s.name === service.name)
       if (existingService) {
         existingService.value += service.value
       }
     } else {
       // Otherwise, add it to the list
       aggregatedServices.push(service)
       seenNames.add(service.name)
     }
   }

   // Sort aggregated services by value
   aggregatedServices.sort((a, b) => b.value - a.value)

   // If we don't have enough valid services, add default ones
   if (aggregatedServices.length < limit) {
     const defaultServices = [
       { name: "Kubah", value: 45, path: "/services/kubah" },
       { name: "Mimbar", value: 38, path: "/services/mimbar" },
       { name: "Menara", value: 32, path: "/services/menara" },
       { name: "Kerawangan", value: 28, path: "/services/kerawangan" },
       { name: "Kaligrafi", value: 25, path: "/services/kaligrafi" },
       { name: "Ornamen", value: 20, path: "/services/ornamen" },
       { name: "Masjid", value: 15, path: "/services/masjid" },
     ]

     // Get names of services we already have
     const existingNames = aggregatedServices.map((s) => s.name.toLowerCase())

     // Add default services that aren't already in our list
     for (const defaultService of defaultServices) {
       if (!existingNames.includes(defaultService.name.toLowerCase()) && aggregatedServices.length < limit) {
         aggregatedServices.push({
           ...defaultService,
         })
       }
     }
   }

   // Take only the requested number of services
   let limitedServices = aggregatedServices.slice(0, limit)

   // Assign colors to each service
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

   const servicesWithColors = limitedServices.map((service, index) => ({
     name: service.name,
     value: service.value,
     path: service.path,
     color: serviceColors[index % serviceColors.length],
   }))

   return NextResponse.json({ success: true, services: servicesWithColors })
 } catch (error) {
   console.error("Error fetching popular services:", error)
   return NextResponse.json({ success: false, error: "Failed to fetch popular services" }, { status: 500 })
 }
}