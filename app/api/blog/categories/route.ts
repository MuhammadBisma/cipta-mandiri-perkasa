import { NextResponse } from "next/server"
import prisma from "@/lib/db"

export async function GET() {
  try {
    // Get all blog posts
    const posts = await prisma.blogPost.findMany({
      where: {
        published: true,
      },
      select: {
        category: true,
      },
    })

    // Count occurrences of each category
    const categoryCounts = posts.reduce(
      (acc, post) => {
        const { category } = post
        if (!acc[category]) {
          acc[category] = 0
        }
        acc[category]++
        return acc
      },
      {} as Record<string, number>,
    )

    // Convert to array of objects
    const categories = Object.entries(categoryCounts).map(([name, count]) => ({
      name,
      count,
    }))

    // Sort by count (descending)
    categories.sort((a, b) => b.count - a.count)

    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 })
  }
}
