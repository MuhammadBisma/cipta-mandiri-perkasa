import { NextResponse } from "next/server"
import prisma from "@/lib/db"
import { getSession } from "@/lib/auth"
import { uploadImage } from "@/lib/cloudinary"

export async function GET() {
  try {
    const galleryItems = await prisma.gallery.findMany({
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(galleryItems)
  } catch (error) {
    console.error("Error fetching gallery items:", error)
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const category = formData.get("category") as string
    const imageFile = formData.get("image") as File | null

    if (!title || !category || !imageFile) {
      return NextResponse.json({ error: "Judul, kategori, dan gambar harus diisi" }, { status: 400 })
    }

    let imageUrl = "/placeholder.svg?height=600&width=800"
    if (imageFile) {
      imageUrl = await uploadImage(imageFile)
    }

    const galleryItem = await prisma.gallery.create({
      data: {
        title,
        description,
        category,
        imageUrl,
        author: {
          connect: { id: session.id },
        },
      },
    })

    return NextResponse.json(galleryItem)
  } catch (error) {
    console.error("Error creating gallery item:", error)
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 })
  }
}
