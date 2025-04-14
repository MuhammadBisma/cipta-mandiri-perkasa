import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, User, ArrowRight } from "lucide-react"
import prisma from "@/lib/db"
import { formatDate } from "@/lib/utils"
import BlogSidebar from "@/components/blog/blog-sidebar"
import { Prisma } from "@prisma/client"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"

export const metadata: Metadata = {
  title: "Blog - Cipta Mandiri Perkasa",
  description: "Artikel dan informasi seputar kubah masjid, mimbar, menara, kerawangan, dan awan kaligrafi.",
}

// Categories for filtering
const categories = ["Semua", "Sejarah", "Tips", "Desain", "Perawatan", "Tren", "Arsitektur", "Berita", "Lainnya"]

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Get category from query params or default to "Semua"
  const category = typeof searchParams.category === "string" ? searchParams.category : "Semua"
  const search = typeof searchParams.search === "string" ? searchParams.search : undefined

  // Build where clause for Prisma query
  const where: Prisma.BlogPostWhereInput = {
    published: true,
  }

  // Add category filter if not "Semua"
  if (category !== "Semua") {
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

  // Fetch blog posts from database
  const blogPosts = await prisma.blogPost.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
  })

  return (
    <>
    <Navbar/>
    <main className="pt-24">
      <section className="py-12 md:py-16 bg-primary text-white">
        <div className="container">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Blog & Artikel</h1>
          <p className="text-lg text-white/80 max-w-3xl">
            Temukan informasi dan inspirasi seputar arsitektur islami dan ornamen masjid.
          </p>
          {/* Tombol Kembali */}
                      <Link href="/#blog">
                        <Button 
                          variant="outline" 
                          className="rounded-xl bg-white text-primary hover:bg-white/90 hover:text-primary/90 transition-colors"
                        >
                          Kembali ke Beranda
                        </Button>
                      </Link>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="w-full lg:w-2/3">
              <div className="flex flex-wrap gap-2 mb-8">
                {categories.map((cat, index) => (
                  <Link key={index} href={`/blog?category=${cat}`}>
                    <Button
                      variant={category === cat ? "default" : "outline"}
                      className={`${category === cat ? "bg-primary" : ""} rounded-xl`}
                    >
                      {cat}
                    </Button>
                  </Link>
                ))}
              </div>

              {blogPosts.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-8">
                  {blogPosts.map((post) => (
                    <div
                      key={post.id}
                      className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-2"
                    >
                      <div className="relative h-48">
                        <Image
                          src={post.imageUrl || "/placeholder.svg"}
                          alt={post.title}
                          fill
                          className="object-cover"
                          loading="lazy"
                        />
                        <div className="absolute top-4 right-4 bg-primary text-white text-xs font-semibold py-1 px-2 rounded">
                          {post.category}
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                          <div className="flex items-center mr-4">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>{formatDate(new Date(post.createdAt))}</span>
                          </div>
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            <span>{post.author?.name}</span>
                          </div>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                        <p className="text-gray-600 mb-4">{post.excerpt}</p>
                        <Link href={`/blog/${post.slug}`}>
                          <Button variant="link" className="text-primary p-0 flex items-center">
                            Baca Selengkapnya <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">Belum ada artikel dalam kategori ini.</p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="w-full lg:w-1/3">
              <BlogSidebar />
            </div>
          </div>
        </div>
      </section>
    </main>
    <Footer/>
    </>
  )
}
