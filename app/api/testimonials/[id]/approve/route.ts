import { NextResponse } from "next/server"
import prisma from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    // Check if user is authenticated
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Ensure params.id is properly awaited/accessed
    const { id } = params

    // Update testimonial status
    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: { approved: true },
    })

    return NextResponse.json({ success: true, testimonial })
  } catch (error) {
    console.error("Error approving testimonial:", error)
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 })
  }
}
