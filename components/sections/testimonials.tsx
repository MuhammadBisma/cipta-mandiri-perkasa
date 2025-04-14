"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Star, StarHalf, MessageSquare, X, Upload, Quote, CheckCircle, ChevronDown } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { motion, useInView } from "framer-motion"
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination, Autoplay, EffectCards } from "swiper/modules"
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
  const [expandedTestimonials, setExpandedTestimonials] = useState<Record<string, boolean>>({})
  const { toast } = useToast()

  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.1 })

  // Fetch testimonials
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

      // Reset form
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

  const toggleTestimonialExpand = (id: string) => {
    setExpandedTestimonials(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
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
                  <div className="bg-white p-6 rounded-lg shadow-md h-full flex flex-col transition-all duration-300 hover:shadow-lg">
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
                    <div className="flex-grow overflow-hidden relative">
                      <p className={`text-gray-600 mb-4 break-words ${expandedTestimonials[testimonial.id] ? '' : 'line-clamp-4'}`}>
                        &ldquo;{testimonial.message}&rdquo;
                      </p>
                      {testimonial.message.length > 150 && (
                        <button
                          onClick={() => toggleTestimonialExpand(testimonial.id)}
                          className="text-primary text-sm font-medium flex items-center mt-2 hover:underline"
                        >
                          {expandedTestimonials[testimonial.id] ? 'Lihat lebih sedikit' : 'Lihat semua'}
                          <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${expandedTestimonials[testimonial.id] ? 'rotate-180' : ''}`} />
                        </button>
                      )}
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
          <Button 
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="rounded-xl px-6 py-3 text-sm font-medium bg-primary hover:bg-primary/90 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1 mb-8"
          >
            <MessageSquare className="h-5 w-5 mr-2" />
            {isFormOpen ? 'Tutup Form Testimoni' : 'Berikan Testimoni Anda'}
          </Button>

          {/* Form Testimoni */}
          {isFormOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-md p-6 mb-12 border border-gray-100 max-w-2xl mx-auto"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Formulir Testimoni</h3>
                <button 
                  onClick={() => setIsFormOpen(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="block text-left text-gray-700 mb-1">Nama Lengkap</Label>
                  <Input 
                    id="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required 
                    className="w-full rounded-xl border-gray-300 focus:border-primary focus:ring-primary placeholder:text-gray-400 placeholder:opacity-50"
                    placeholder="Masukkan nama lengkap Anda"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="position" className="block text-left text-gray-700 mb-1">Jabatan/Pekerjaan</Label>
                  <Input 
                    id="position" 
                    value={position} 
                    onChange={(e) => setPosition(e.target.value)} 
                    required 
                    className="w-full rounded-xl border-gray-300 focus:border-primary focus:ring-primary placeholder:text-gray-400 placeholder:opacity-50"
                    placeholder="Contoh: DKM Masjid Nurul Hidayah"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message" className="block text-left text-gray-700 mb-1">Testimoni</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    required
                    className="w-full rounded-xl border-gray-300 focus:border-primary focus:ring-primary placeholder:text-gray-400 placeholder:opacity-50"
                    placeholder="Ceritakan pengalaman Anda menggunakan layanan kami..."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="block text-left text-gray-700 mb-1">Rating</Label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="focus:outline-none transition-transform hover:scale-110"
                      >
                        <Star
                          className={`h-7 w-7 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                        />
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1 block text-left">
                    {rating === 5 ? "Sangat Puas" : 
                     rating === 4 ? "Puas" : 
                     rating === 3 ? "Cukup" : 
                     rating === 2 ? "Kurang Puas" : 
                     "Tidak Puas"}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="image" className="block text-left text-gray-700 mb-1">Foto Profil (Opsional)</Label>
                  <div className="flex items-center gap-4 flex-wrap">
                    <label
                      htmlFor="image"
                      className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <Upload className="h-4 w-4" />
                      <span className="text-sm">Pilih Foto</span>
                    </label>
                    <Input 
                      id="image" 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageChange} 
                      className="hidden" 
                    />
                    {imagePreview && (
                      <div className="relative">
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          width={60}
                          height={60}
                          className="rounded-full object-cover border-2 border-primary/20"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImage(null)
                            setImagePreview(null)
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 block text-left">Maksimal 5MB (Format: JPG, PNG)</p>
                  {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                </div>
                
                <div className="flex justify-end gap-2 pt-4 flex-wrap">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsFormOpen(false)}
                    className="flex-1 sm:flex-none rounded-xl border-gray-300 hover:bg-gray-50"
                  >
                    Batal
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-primary hover:bg-primary/90 flex-1 sm:flex-none rounded-xl"
                  >
                    Kirim Testimoni
                  </Button>
                </div>
              </form>
            </motion.div>
          )}
        </motion.div>

        {/* Success Modal */}
        <div className={`fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isSuccessOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={isSuccessOpen ? { scale: 1, opacity: 1 } : { scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-xl p-6 max-w-sm w-full text-center shadow-xl"
          >
            <div className="bg-green-100 p-3 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Testimoni Terkirim!</h3>
            <p className="text-gray-600 mb-6">
              Terima kasih atas testimoni Anda. Testimoni Anda akan muncul setelah kami memverifikasinya.
            </p>
            <Button 
              onClick={() => setIsSuccessOpen(false)} 
              className="w-full rounded-lg bg-primary hover:bg-primary/90"
            >
              Tutup
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}