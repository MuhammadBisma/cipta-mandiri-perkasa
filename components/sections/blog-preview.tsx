"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, User, ArrowRight } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

type BlogPost = {
  id: string
  title: string
  slug: string
  excerpt: string
  imageUrl: string
  category: string
  createdAt: string
  author: {
    name: string
  }
}

export default function BlogPreview() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Fetch blog posts from API
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/blog")
        if (!response.ok) {
          throw new Error("Failed to fetch blog posts")
        }
        const data = await response.json()
        // Only show published posts and limit to 3
        const publishedPosts = data.filter((post: BlogPost & { published: boolean }) => post.published).slice(0, 3)
        setPosts(publishedPosts)
      } catch (error) {
        console.error("Error fetching blog posts:", error)
        toast({
          title: "Error",
          description: "Gagal memuat artikel blog",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [toast])

  return (
    <section id="blog" className="section-padding bg-gray-50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="heading-primary">Blog & Artikel</h2>
          <p className="max-w-3xl mx-auto text-lg text-gray-600">
            Temukan informasi dan inspirasi seputar arsitektur islami dan ornamen masjid.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Memuat artikel...</p>
          </div>
        ) : posts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-2"
              >
                <div className="relative h-48">
                  <Image 
                  src={post.imageUrl || "/placeholder.svg"} 
                  alt={post.title} 
                  fill 
                  loading="lazy"
                  className="object-cover" />
                </div>
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <div className="flex items-center mr-4">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{formatDate(new Date(post.createdAt))}</span>
                    </div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      <span>{post.author.name}</span>
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
            <p className="text-gray-500">Belum ada artikel blog.</p>
          </div>
        )}

<div className="mt-10 text-center">
  <Link href="/blog">
    <Button className="rounded-xl px-6 py-3 text-sm font-medium bg-primary hover:bg-primary/90 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1">
      Lihat Semua Artikel
    </Button>
  </Link>
</div>
      </div>
    </section>
  )
}
