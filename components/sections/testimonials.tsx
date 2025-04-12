"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Star, StarHalf, MessageSquare, X, Upload, Quote, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { motion, useInView } from "framer-motion"
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination, Autoplay, EffectCards } from "swiper/modules"

// Import Swiper styles
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/effect-cards"

type Testimonial = {
  id: string
  name: string
  position: string | null
  message: string
  rating: number
  imageUrl: string | null
  createdAt: string
}

export default function Testimonials() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isSuccessOpen, setIsSuccessOpen] = useState(false)
  const [name, setName] = useState("")
  const [position, setPosition] = useState("")
  const [message, setMessage] = useState("")
  const [rating, setRating] = useState(5)
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.1 })

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch("/api/testimonials")
        if (!response.ok) {
          throw new Error("Failed to fetch testimonials")
        }
        const data = await response.json()
        setTestimonials(data)
      } catch (error) {
        console.error("Error fetching testimonials:", error)
        toast({
          title: "Error",
          description: "Gagal memuat testimoni",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchTestimonials()
  }, [toast])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setError("Ukuran file terlalu besar. Maksimal 5MB.")
      return
    }

    setError(null)
    setImage(file)

    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      const formData = new FormData()
      formData.append("name", name)
      formData.append("position", position)
      formData.append("message", message)
      formData.append("rating", rating.toString())
      if (image) {
        formData.append("image", image)
      }

      const response = await fetch("/api/testimonials", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Gagal mengirim testimoni")
      }

      toast({
        title: "Berhasil",
        description: "Terima kasih atas testimoni Anda.",
      })

      setName("")
      setPosition("")
      setMessage("")
      setRating(5)
      setImage(null)
      setImagePreview(null)
      setIsFormOpen(false)
      setIsSuccessOpen(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat mengirim testimoni")
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Terjadi kesalahan saat mengirim testimoni",
        variant: "destructive",
      })
    }
  }

  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="h-5 w-5 fill-yellow-400 text-yellow-400" />)
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="h-5 w-5 fill-yellow-400 text-yellow-400" />)
    }

    const remainingStars = 5 - stars.length
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-star-${i}`} className="h-5 w-5 text-gray-300" />)
    }

    return stars
  }

  return (
    <section id="testimonials" className="section-padding bg-gray-50" ref={ref}>
      <div className="container">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="heading-primary">Testimoni Pelanggan</h2>
          <p className="max-w-3xl mx-auto text-lg text-gray-600">
            Apa kata pelanggan kami tentang produk dan layanan Cipta Mandiri Perkasa.
          </p>
        </motion.div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-4 text-gray-500">Memuat testimoni...</p>
          </div>
        ) : testimonials.length > 0 ? (
          <motion.div
            className="mb-12"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Swiper
              modules={[Pagination, Autoplay, EffectCards]}
              spaceBetween={30}
              slidesPerView={1}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                },
                1024: {
                  slidesPerView: 3,
                },
              }}
              pagination={{ clickable: true }}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              className="testimonial-swiper py-10"
            >
              {testimonials.map((testimonial) => (
                <SwiperSlide key={testimonial.id}>
                <div className="bg-white p-6 rounded-lg shadow-md h-full flex flex-col">
                  <Quote className="self-end mb-2 h-8 w-8 text-primary/20" />
                  <div className="flex items-center mb-4">
                    <div className="relative h-14 w-14 min-w-[56px] mr-4">
                      <Image
                        src={testimonial.imageUrl || "/placeholder.svg"}
                        alt={testimonial.name}
                        fill
                        className="rounded-full object-cover border-2 border-primary/20"
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-lg truncate">{testimonial.name}</h3>
                      <p className="text-sm text-gray-600 truncate">
                        {testimonial.position || "Pelanggan"}
                      </p>
                    </div>
                  </div>
                  <div className="flex mb-3">{renderStars(testimonial.rating)}</div>
                  <div className="flex-grow overflow-hidden">
                    <p className="text-gray-600 line-clamp-4 mb-4 break-words overflow-hidden text-ellipsis">
                      &ldquo;{testimonial.message}&rdquo;
                    </p>
                  </div>
                  <p className="text-xs text-gray-400 mt-auto pt-2 border-t border-gray-100">
                    {new Date(testimonial.createdAt).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>
        ) : (
          <div className="text-center py-12 mb-12">
            <p className="text-gray-500">Belum ada testimoni. Jadilah yang pertama memberikan testimoni!</p>
          </div>
        )}

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex justify-center">
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button className="btn-primary flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Berikan Testimoni Anda
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Berikan Testimoni Anda</DialogTitle>
                  <DialogDescription>
                    Bagikan pengalaman Anda bekerja sama dengan Cipta Mandiri Perkasa.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Lengkap</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">Jabatan/Pekerjaan</Label>
                    <Input id="position" value={position} onChange={(e) => setPosition(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Testimoni</Label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Rating</Label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="focus:outline-none transition-transform hover:scale-110"
                        >
                          <Star
                            className={`h-6 w-6 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image">Foto (Maks. 5MB)</Label>
                    <div className="flex items-center gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById("image")?.click()}
                        className="flex items-center gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        Pilih Foto
                      </Button>
                      <Input id="image" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                      {imagePreview && (
                        <div className="relative">
                          <Image
                            src={imagePreview || "/placeholder.svg"}
                            alt="Preview"
                            width={60}
                            height={60}
                            className="rounded-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setImage(null)
                              setImagePreview(null)
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                      Batal
                    </Button>
                    <Button type="submit" className="bg-primary">
                      Kirim Testimoni
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        {/* Modal Sukses */}
        <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
          <DialogContent className="sm:max-w-[425px] text-center">
            <div className="flex flex-col items-center justify-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
              <DialogTitle>Testimoni Terkirim!</DialogTitle>
              <DialogDescription className="text-base">
                Terima kasih atas testimoni Anda. Testimoni akan ditampilkan setelah disetujui oleh admin.
              </DialogDescription>
              <Button 
                onClick={() => setIsSuccessOpen(false)} 
                className="mt-4"
              >
                Tutup
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
}