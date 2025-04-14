"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Calendar, Tag } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale"

type Category = {
  name: string
  count: number
}

type RecentPost = {
  id: string
  title: string
  slug: string
  imageUrl: string
  createdAt: string
  category: string
}

export default function BlogSidebar() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categories, setCategories] = useState<Category[]>([])
  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get("category")
  const currentSlug = pathname.split("/").pop()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/blog/categories")
        if (response.ok) {
          const data = await response.json()
          setCategories(data)
        }
      } catch (error) {
        console.error("Error fetching categories:", error)
      }
    }

    const fetchRecentPosts = async () => {
      try {
        const response = await fetch("/api/blog?limit=5")
        if (response.ok) {
          const data = await response.json()
          setRecentPosts(data)
        }
      } catch (error) {
        console.error("Error fetching recent posts:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
    fetchRecentPosts()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/blog?search=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <div className="space-y-8">
      {/* Search Box */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-3">Cari Artikel</h3>
          <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            type="text"
            placeholder="Kata kunci..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 rounded-xl placeholder-transparent border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
            <Button type="submit" size="icon" className="rounded-full">
              <Search className="h-4 w-4 rounded-xl" />
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-3">Kategori</h3>
          <div className="space-y-2">
            <Link
              href="/blog"
              className={`flex justify-between items-center p-2 rounded-md hover:bg-gray-100 transition-colors ${!currentCategory ? "bg-primary/10 font-medium" : ""}`}
            >
              <span>Semua Artikel</span>
              <span className="text-sm text-gray-500">{categories.reduce((sum, cat) => sum + cat.count, 0)}</span>
            </Link>
            {categories.map((category) => (
              <Link
                key={category.name}
                href={`/blog?category=${encodeURIComponent(category.name)}`}
                className={`flex justify-between items-center p-2 rounded-md hover:bg-gray-100 transition-colors ${currentCategory === category.name ? "bg-primary/10 font-medium" : ""}`}
              >
                <span>{category.name}</span>
                <span className="text-sm text-gray-500">{category.count}</span>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Posts */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-3">Artikel Terbaru</h3>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse flex gap-3">
                  <div className="bg-gray-200 h-16 w-16 rounded-md"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : recentPosts.length === 0 ? (
            <p className="text-gray-500 text-sm">Belum ada artikel</p>
          ) : (
            <div className="space-y-4">
              {recentPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className={`flex gap-3 group ${currentSlug === post.slug ? "bg-primary/10 p-2 rounded-md" : ""}`}
                >
                  <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={post.imageUrl || "/placeholder.svg?height=64&width=64"}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                      sizes="64px"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h4>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>
                        {formatDistanceToNow(new Date(post.createdAt), {
                          addSuffix: true,
                          locale: id,
                        })}
                      </span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <Tag className="h-3 w-3 mr-1" />
                      <span>{post.category}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
