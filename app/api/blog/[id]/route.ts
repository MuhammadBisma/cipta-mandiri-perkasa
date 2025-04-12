import { NextResponse } from "next/server"
import prisma from "@/lib/db"
import { getSession } from "@/lib/auth"
import { slugify } from "@/lib/utils"
import { uploadImage } from "@/lib/cloudinary"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const post = await prisma.blogPost.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
    })

    if (!post) {
      return NextResponse.json({ error: "Artikel tidak ditemukan" }, { status: 404 })
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error("Error fetching blog post:", error)
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
    const excerpt = formData.get("excerpt") as string
    const content = formData.get("content") as string
    const category = formData.get("category") as string
    const published = formData.get("published") === "true"
    const imageFile = formData.get("image") as File | null

    if (!title || !excerpt || !content || !category) {
      return NextResponse.json({ error: "Semua field harus diisi" }, { status: 400 })
    }

    // Get the existing post
    const existingPost = await prisma.blogPost.findUnique({
      where: { id },
    })

    if (!existingPost) {
      return NextResponse.json({ error: "Artikel tidak ditemukan" }, { status: 404 })
    }

    let imageUrl = existingPost.imageUrl
    if (imageFile) {
      imageUrl = await uploadImage(imageFile)
    }

    const slug = slugify(title)

    // Check if slug already exists and is not the current post
    const slugExists = await prisma.blogPost.findFirst({
      where: {
        slug,
        id: { not: id },
      },
    })

    if (slugExists) {
      return NextResponse.json({ error: "Judul artikel sudah digunakan" }, { status: 400 })
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        title,
        slug,
        excerpt,
        content,
        category,
        published,
        imageUrl,
      },
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error("Error updating blog post:", error)
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

    await prisma.blogPost.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting blog post:", error)
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 })
  }
}
