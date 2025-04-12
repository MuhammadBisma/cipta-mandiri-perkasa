import { NextResponse } from "next/server"
import prisma from "@/lib/db"
import { uploadImage } from "@/lib/cloudinary"
import { notifyClients } from "./sse/route"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const isAdmin = url.searchParams.get("admin") === "true"

    if (isAdmin) {
      // For admin, return all testimonials
      const testimonials = await prisma.testimonial.findMany({
        orderBy: { createdAt: "desc" },
      })
      return NextResponse.json(testimonials)
    } else {
      // For public, only return approved testimonials
      const testimonials = await prisma.testimonial.findMany({
        where: { approved: true },
        orderBy: { createdAt: "desc" },
      })
      return NextResponse.json(testimonials)
    }
  } catch (error) {
    console.error("Error fetching testimonials:", error)
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const name = formData.get("name") as string
    const position = formData.get("position") as string
    const message = formData.get("message") as string
    const rating = Number.parseFloat(formData.get("rating") as string)
    const imageFile = formData.get("image") as File | null

    if (!name || !message || isNaN(rating)) {
      return NextResponse.json({ error: "Nama, pesan, dan rating harus diisi" }, { status: 400 })
    }

    let imageUrl = null
    if (imageFile) {
      imageUrl = await uploadImage(imageFile)
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        name,
        position,
        message,
        rating,
        imageUrl,
        approved: false, // Default to not approved
      },
    })

    // Notify all connected clients about the new testimonial
    notifyClients({
      type: "new_testimonial",
      testimonial,
    })

    return NextResponse.json({
      success: true,
      message: "Terima kasih atas testimoni Anda. Testimoni akan ditampilkan setelah disetujui oleh admin.",
    })
  } catch (error) {
    console.error("Error creating testimonial:", error)
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 })
  }
}
