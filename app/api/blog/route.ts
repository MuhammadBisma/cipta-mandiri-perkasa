import { NextResponse } from "next/server"
import prisma from "@/lib/db"
import { getSession } from "@/lib/auth"
import { slugify } from "@/lib/utils"
import { uploadImage } from "@/lib/cloudinary"
import { Prisma } from "@prisma/client"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit") as string) : undefined
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const publishedParam = searchParams.get("published")

    // Default to showing only published posts for public requests
    let publishedFilter: boolean | undefined = true

    // Check if the request is from an authenticated admin
    const session = await getSession()
    if (session) {
      // If authenticated and published param is provided, use it
      if (publishedParam !== null) {
        publishedFilter = publishedParam === "true"
      } else {
        // For admins, we can show all posts by not filtering on published
        publishedFilter = undefined
      }
    }

    // Build the where clause
    const where: Prisma.BlogPostWhereInput = {}

    // Only add published filter if it's defined
    if (publishedFilter !== undefined) {
      where.published = publishedFilter
    }

    // Add category filter if provided
    if (category) {
      where.category = category
    }

    // Add search filter if provided
    if (search) {
      where.OR = [
        { title: { contains: search, mode: Prisma.QueryMode.insensitive } },
        { excerpt: { contains: search, mode: Prisma.QueryMode.insensitive } },
        { content: { contains: search, mode: Prisma.QueryMode.insensitive } },
      ]
    }

    const posts = await prisma.blogPost.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
    })

    return NextResponse.json(posts)
  } catch (error) {
    console.error("Error fetching blog posts:", error)
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
    const excerpt = formData.get("excerpt") as string
    const content = formData.get("content") as string
    const category = formData.get("category") as string
    const published = formData.get("published") === "true"
    const imageFile = formData.get("image") as File | null

    if (!title || !excerpt || !content || !category) {
      return NextResponse.json({ error: "Semua field harus diisi" }, { status: 400 })
    }

    let imageUrl = "/placeholder.svg?height=400&width=600"
    if (imageFile) {
      imageUrl = await uploadImage(imageFile)
    }

    const slug = slugify(title)

    // Check if slug already exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug },
    })

    if (existingPost) {
      return NextResponse.json({ error: "Judul artikel sudah digunakan" }, { status: 400 })
    }

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        category,
        published,
        imageUrl,
        author: {
          connect: { id: session.id },
        },
      },
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error("Error creating blog post:", error)
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 })
  }
}
