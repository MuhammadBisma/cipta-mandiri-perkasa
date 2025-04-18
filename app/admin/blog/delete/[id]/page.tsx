"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ArrowLeft, AlertTriangle, Trash2, Loader2, Calendar, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { formatDate } from "@/lib/utils"

export default function DeleteBlogPost() {
  const params = useParams()
  const id = params.id as string
  const [blogPost, setBlogPost] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        const response = await fetch(`/api/blog/${id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch blog post")
        }
        const data = await response.json()
        setBlogPost(data)
      } catch (error) {
        console.error("Error fetching blog post:", error)
        toast({
          title: "Error",
          description: "Gagal memuat data artikel",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchBlogPost()
  }, [id, toast])

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/blog/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete blog post")
      }

      toast({
        title: "Berhasil",
        description: "Artikel berhasil dihapus",
      })

      router.push("/admin/blog")
      router.refresh()
    } catch (error) {
      console.error("Error deleting blog post:", error)
      toast({
        title: "Error",
        description: "Gagal menghapus artikel",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Memuat data...</p>
      </div>
    )
  }

  if (!blogPost) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Hapus Artikel</h1>
            <p className="text-gray-500">Artikel tidak ditemukan</p>
          </div>
          <Link href="/admin/blog">
            <Button variant="outline" className="rounded-xl">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
          </Link>
        </div>
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Artikel tidak ditemukan atau telah dihapus.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Hapus Artikel</h1>
          <p className="text-gray-500">Konfirmasi penghapusan artikel blog</p>
        </div>
        <Link href="/admin/blog">
          <Button variant="outline" className="rounded-xl">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
        </Link>
      </div>

      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-600 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Konfirmasi Penghapusan
          </CardTitle>
          <CardDescription>Anda akan menghapus artikel berikut. Tindakan ini tidak dapat dibatalkan.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="relative h-48 w-full md:w-64 rounded-lg overflow-hidden">
              <Image src={blogPost.imageUrl || "/placeholder.svg"} alt={blogPost.title} fill className="object-cover" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2">{blogPost.title}</h3>
              <div className="flex flex-wrap items-center text-sm text-gray-500 mb-3">
                <div className="flex items-center mr-4 mb-2">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{formatDate(new Date(blogPost.createdAt))}</span>
                </div>
                <div className="flex items-center mb-2">
                  <User className="h-4 w-4 mr-1" />
                  <span>{blogPost.author?.name}</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2">Kategori: {blogPost.category}</p>
              <p className="text-sm text-gray-600 mb-4">{blogPost.excerpt}</p>
              <div className="bg-white p-4 rounded-lg border border-red-200 mt-4">
                <p className="text-red-600 font-medium">
                  Penghapusan akan menghilangkan artikel ini secara permanen dari website.
                  {blogPost.published && " Artikel ini saat ini dipublikasikan dan dapat dilihat oleh pengunjung."}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3">
          <Button variant="destructive" className="w-full sm:w-auto" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Menghapus...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Hapus Permanen
              </>
            )}
          </Button>
          <Link href="/admin/blog" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full">
              Batal
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}