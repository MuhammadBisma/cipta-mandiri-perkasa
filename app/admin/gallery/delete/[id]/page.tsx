"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ArrowLeft, AlertTriangle, Trash2, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function DeleteGalleryItem() {
  const params = useParams()
  const id = params.id as string
  const [galleryItem, setGalleryItem] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchGalleryItem = async () => {
      try {
        const response = await fetch(`/api/gallery/${id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch gallery item")
        }
        const data = await response.json()
        setGalleryItem(data)
      } catch (error) {
        console.error("Error fetching gallery item:", error)
        toast({
          title: "Error",
          description: "Gagal memuat data galeri",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchGalleryItem()
  }, [id, toast])

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/gallery/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete gallery item")
      }

      toast({
        title: "Berhasil",
        description: "Item galeri berhasil dihapus",
      })

      router.push("/admin/gallery")
      router.refresh()
    } catch (error) {
      console.error("Error deleting gallery item:", error)
      toast({
        title: "Error",
        description: "Gagal menghapus item galeri",
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

  if (!galleryItem) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Hapus Item Galeri</h1>
            <p className="text-gray-500">Item tidak ditemukan</p>
          </div>
          <Link href="/admin/gallery">
            <Button variant="outline" className="rounded-xl">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
          </Link>
        </div>
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Item galeri tidak ditemukan atau telah dihapus.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Hapus Item Galeri</h1>
          <p className="text-gray-500">Konfirmasi penghapusan item galeri</p>
        </div>
        <Link href="/admin/gallery">
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
          <CardDescription>
            Anda akan menghapus item galeri berikut. Tindakan ini tidak dapat dibatalkan.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="relative h-48 w-48 rounded-lg overflow-hidden">
              <Image
                src={galleryItem.imageUrl || "/placeholder.svg"}
                alt={galleryItem.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2">{galleryItem.title}</h3>
              <p className="text-sm text-gray-600 mb-2">
                Kategori: {galleryItem.category.charAt(0).toUpperCase() + galleryItem.category.slice(1)}
              </p>
              {galleryItem.description && <p className="text-sm text-gray-600 mb-4">{galleryItem.description}</p>}
              <div className="bg-white p-4 rounded-lg border border-red-200 mt-4">
                <p className="text-red-600 font-medium">
                  Penghapusan akan menghilangkan item ini secara permanen dari galeri website.
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
          <Link href="/admin/gallery" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full">
              Batal
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
} 