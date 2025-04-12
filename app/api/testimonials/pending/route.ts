import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: {
        approved: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Get the count of pending testimonials
    const pendingCount = await prisma.testimonial.count({
      where: {
        approved: false,
      },
    })

    return NextResponse.json({
      success: true,
      testimonials,
      pendingCount,
    })
  } catch (error) {
    console.error("Error fetching pending testimonials:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch pending testimonials" }, { status: 500 })
  }
}
