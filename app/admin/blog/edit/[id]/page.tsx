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
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Upload, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const categories = ["Sejarah", "Tips", "Desain", "Perawatan", "Tren", "Arsitektur", "Berita", "Lainnya"]

export default function EditBlogPost() {
  const params = useParams()
  const id = params.id as string

  const [title, setTitle] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("")
  const [published, setPublished] = useState(false)
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Fetch blog post data
    const fetchPost = async () => {
      if (!id) return

      try {
        const response = await fetch(`/api/blog/${id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch blog post")
        }
        const post = await response.json()

        setTitle(post.title)
        setExcerpt(post.excerpt)
        setContent(post.content)
        setCategory(post.category)
        setPublished(post.published)
        setImagePreview(post.imageUrl)
      } catch (error) {
        toast({
          title: "Error",
          description: "Gagal memuat data artikel",
          variant: "destructive",
        })
      } finally {
        setFetchLoading(false)
      }
    }

    fetchPost()
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
      if (!title || !excerpt || !content || !category) {
        throw new Error("Semua field harus diisi")
      }

      const formData = new FormData()
      formData.append("title", title)
      formData.append("excerpt", excerpt)
      formData.append("content", content)
      formData.append("category", category)
      formData.append("published", published.toString())
      if (image) {
        formData.append("image", image)
      }

      const response = await fetch(`/api/blog/${id}`, {
        method: "PUT",
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Gagal mengupdate artikel")
      }

      toast({
        title: "Berhasil",
        description: "Artikel berhasil diupdate",
      })

      router.push("/admin/blog")
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Terjadi kesalahan saat mengupdate artikel",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <p>Memuat data artikel...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Edit Artikel</h1>
          <p className="text-gray-500">Edit artikel blog Cipta Mandiri Perkasa</p>
        </div>
        <Link href="/admin/blog">
          <Button 
          variant="outline" 
          className="rounded-xl border-gray-300 hover:bg-gray-50 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informasi Artikel</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Judul Artikel</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Masukkan judul artikel"
                    className="block w-full p-2 border border-gray-300 rounded-xl"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="excerpt">Ringkasan</Label>
                  <Textarea
                    id="excerpt"
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Masukkan ringkasan artikel (maksimal 200 karakter)"
                    className="block w-full p-2 border border-gray-300 rounded-xl"
                    rows={3}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Konten</Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Masukkan konten artikel"
                    className="block w-full p-2 border border-gray-300 rounded-xl"
                    rows={15}
                    required
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Publikasi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="published">Status Publikasi</Label>
                  <div className="flex items-center space-x-2">
                    <Switch id="published" checked={published} onCheckedChange={setPublished} />
                    <span className="text-sm font-medium">{published ? "Publikasikan" : "Draft"}</span>
                  </div>
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
                <CardTitle>Gambar Artikel</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="image">Gambar Utama</Label>
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
                      <div className="relative aspect-video rounded-md overflow-hidden border">
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
                      <div className="aspect-video rounded-md border border-dashed flex items-center justify-center bg-gray-50">
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
        </div>
      </form>
    </div>
  )
}
