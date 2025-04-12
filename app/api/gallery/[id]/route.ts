import { NextResponse } from "next/server"
import prisma from "@/lib/db"
import { getSession } from "@/lib/auth"
import { uploadImage } from "@/lib/cloudinary"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const galleryItem = await prisma.gallery.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
    })

    if (!galleryItem) {
      return NextResponse.json({ error: "Item galeri tidak ditemukan" }, { status: 404 })
    }

    return NextResponse.json(galleryItem)
  } catch (error) {
    console.error("Error fetching gallery item:", error)
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = params.id
    const formData = await request.formData()
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const category = formData.get("category") as string
    const imageFile = formData.get("image") as File | null

    if (!title || !category) {
      return NextResponse.json({ error: "Judul dan kategori harus diisi" }, { status: 400 })
    }

    // Get the existing gallery item
    const existingItem = await prisma.gallery.findUnique({
      where: { id },
    })

    if (!existingItem) {
      return NextResponse.json({ error: "Item galeri tidak ditemukan" }, { status: 404 })
    }

    let imageUrl = existingItem.imageUrl
    if (imageFile) {
      imageUrl = await uploadImage(imageFile)
    }

    const galleryItem = await prisma.gallery.update({
      where: { id },
      data: {
        title,
        description,
        category,
        imageUrl,
      },
    })

    return NextResponse.json(galleryItem)
  } catch (error) {
    console.error("Error updating gallery item:", error)
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = params.id

    await prisma.gallery.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting gallery item:", error)
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 })
  }
}
