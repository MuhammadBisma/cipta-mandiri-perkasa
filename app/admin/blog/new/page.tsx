"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CheckCircle2 } from "lucide-react"
import TipTapEditor from "@/components/blog/tiptap-editor"
import EditorGuidelines from "@/components/blog/editor-guidelines"

const categories = ["Sejarah", "Tips", "Desain", "Perawatan", "Tren", "Arsitektur", "Berita", "Lainnya"]

export default function NewBlogPost() {
  const [title, setTitle] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("")
  const [published, setPublished] = useState(false)
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [createdArticleTitle, setCreatedArticleTitle] = useState("")

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

  const handleContentChange = (html: string) => {
    setContent(html)
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

      const response = await fetch("/api/blog", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Gagal membuat artikel")
      }

      // Store the created article title for the success modal
      setCreatedArticleTitle(title)

      // Show success modal instead of immediately redirecting
      setShowSuccessModal(true)

      // Still show toast
      toast({
        title: "Berhasil",
        description: "Artikel berhasil dibuat",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Terjadi kesalahan saat membuat artikel",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Add a function to handle creating another article
  const handleCreateAnother = () => {
    // Reset form
    setTitle("")
    setExcerpt("")
    setContent("")
    setCategory("")
    setPublished(false)
    setImage(null)
    setImagePreview(null)

    // Close modal
    setShowSuccessModal(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Tambah Artikel Baru</h1>
          <p className="text-gray-500">Buat artikel blog baru untuk website Cipta Mandiri Perkasa</p>
        </div>
        <Link href="/admin/blog">
          <Button variant="outline" className="rounded-xl border-gray-300 hover:bg-gray-50 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
        </Link>
      </div>

      <EditorGuidelines />

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
                  <TipTapEditor
                    content={content}
                    onChange={handleContentChange}
                    placeholder="Mulai menulis artikel Anda..."
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
                        <SelectItem key={cat} value={cat} className="hover:bg-gray-100 focus:bg-gray-100">
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
                      Pilih Gambar
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
                  {loading ? "Menyimpan..." : "Simpan Artikel"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </form>
      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
              <span>Artikel Berhasil Dibuat</span>
            </DialogTitle>
            <DialogDescription>
              Artikel <span className="font-medium">"{createdArticleTitle}"</span> telah berhasil dibuat dan{" "}
              {published ? "dipublikasikan" : "disimpan sebagai draft"}.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-4">
            <div className="rounded-full bg-green-50 p-3">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle2 className="h-10 w-10 text-green-500" />
              </div>
            </div>
          </div>
          <DialogFooter className="flex sm:justify-between gap-4">
            <Button type="button" variant="outline" onClick={handleCreateAnother} className="flex-1 rounded-xl">
              Buat Artikel Lain
            </Button>
            <Button
              type="button"
              onClick={() => {
                router.push("/admin/blog")
                router.refresh()
              }}
              className="flex-1 bg-primary rounded-xl"
            >
              Kembali ke Daftar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
