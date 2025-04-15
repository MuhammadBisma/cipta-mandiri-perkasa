import type { MetadataRoute } from "next"
import prisma from "@/lib/prisma"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://kubahcmp.id"

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
  ]

  // Service pages
  const servicePages = ["masjid", "kubah", "mimbar", "menara", "kerawangan", "kaligrafi", "ornamen"].map((service) => ({
    url: `${baseUrl}/services/${service}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  // Dynamic blog posts
  let blogPosts: MetadataRoute.Sitemap = []
  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
      orderBy: { createdAt: "desc" },
    })

    blogPosts = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }))
  } catch (error) {
    console.error("Error fetching blog posts for sitemap:", error)
  }

  // Dynamic gallery items
  let galleryItems: MetadataRoute.Sitemap = []
  try {
    const items = await prisma.gallery.findMany({
      select: { id: true, updatedAt: true },
      orderBy: { createdAt: "desc" },
    })

    galleryItems = items.map((item) => ({
      url: `${baseUrl}/gallery/${item.id}`,
      lastModified: item.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    }))
  } catch (error) {
    console.error("Error fetching gallery items for sitemap:", error)
  }

  // Combine all URLs
  return [...staticPages, ...servicePages, ...blogPosts, ...galleryItems]
}
