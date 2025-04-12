"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Upload, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const categories = ["kubah", "mimbar", "menara", "kerawangan", "kaligrafi", "masjid", "ornamen"]

export default function EditGalleryItem() {
  const params = useParams()
  const id = params.id as string

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Fetch gallery item data
    const fetchGalleryItem = async () => {
      if (!id) return

      try {
        const response = await fetch(`/api/gallery/${id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch gallery item")
        }
        const item = await response.json()

        setTitle(item.title)
        setDescription(item.description || "")
        setCategory(item.category)
        setImagePreview(item.imageUrl)
      } catch (error) {
        toast({
          title: "Error",
          description: "Gagal memuat data galeri",
          variant: "destructive",
        })
      } finally {
        setFetchLoading(false)
      }
    }

    fetchGalleryItem()
  }, [id, toast])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Ukuran file terlalu besar. Maksimal 5MB.",
        variant: "destructive",
      })
      return
    }

    setImage(file)

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!title || !category) {
        throw new Error("Judul dan kategori harus diisi")
      }

      const formData = new FormData()
      formData.append("title", title)
      formData.append("description", description)
      formData.append("category", category)
      if (image) {
        formData.append("image", image)
      }

      const response = await fetch(`/api/gallery/${id}`, {
        method: "PUT",
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Gagal mengupdate item galeri")
      }

      toast({
        title: "Berhasil",
        description: "Item galeri berhasil diupdate",
      })

      router.push("/admin/gallery")
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Terjadi kesalahan saat mengupdate item galeri",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <p>Memuat data galeri...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Edit Item Galeri</h1>
          <p className="text-gray-500">Edit item galeri Cipta Mandiri Perkasa</p>
        </div>
        <Link href="/admin/gallery">
          <Button 
          variant="outline"
          className="rounded-xl">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Item</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Judul</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Masukkan judul foto"
                  className="rounded-xl border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Masukkan deskripsi foto (opsional)"
                  className="rounded-xl border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Kategori</Label>
                <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger className="bg-white rounded-xl hover:bg-white focus:bg-white data-[state=open]:bg-white">
                  <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                      <SelectContent className="bg-white mt-1">
                        {categories.map((cat) => (
                        <SelectItem 
                        key={cat} 
                        value={cat}
                        className="hover:bg-gray-100 focus:bg-gray-100"
                        >
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gambar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="image">Unggah Gambar</Label>
                <div className="flex flex-col gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("image")?.click()}
                    className="w-full flex items-center justify-center gap-2 rounded-xl"
                  >
                    <Upload className="h-4 w-4" />
                    Ganti Gambar
                  </Button>
                  <Input id="image" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  {imagePreview ? (
                    <div className="relative aspect-square rounded-md overflow-hidden border">
                      <Image src={imagePreview || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 rounded-full"
                        onClick={() => {
                          setImage(null)
                          setImagePreview(null)
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="aspect-square rounded-md border border-dashed flex items-center justify-center bg-gray-50">
                      <p className="text-sm text-gray-500">Belum ada gambar</p>
                    </div>
                  )}
                  <p className="text-xs text-gray-500">Ukuran maksimal 5MB. Format yang didukung: JPG, PNG, GIF.</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full bg-primary rounded-xl" disabled={loading}>
                {loading ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  )
}
