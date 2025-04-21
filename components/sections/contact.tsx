"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { SuccessModal } from "@/components/sections/success-modal"
import { Phone, Mail, MapPin, Send, Clock, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react'
import { motion, useInView } from "framer-motion"
import { useToast } from "@/hooks/use-toast"

// Define consistent contact information
const CONTACT_INFO = {
  phone1: "+62 813-8622-5702",
  phone2: "+62 813-8622-5702",
  email1: "kubah.cmp@gmail.com",
  email2: "kubah.cmp@gmail.com",
  address: "Kp.pisang, batu, Jl. Raya Tambelang No.RT.02, Kertamukti, Kec. Cibitung, Kabupaten Bekasi, Jawa Barat 17520"
}

export default function Contact() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")
  const [mapLoaded, setMapLoaded] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const { toast } = useToast()

  const ref = useRef(null)
  const formRef = useRef<HTMLFormElement>(null)
  const isInView = useInView(ref, { once: false, amount: 0.1 })

  // Lazy load Google Maps
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setMapLoaded(true)
        observer.disconnect()
      }
    })

    const mapContainer = document.getElementById("map-container")
    if (mapContainer) {
      observer.observe(mapContainer)
    }

    return () => {
      if (mapContainer) {
        observer.unobserve(mapContainer)
      }
    }
  }, [])

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!name.trim()) newErrors.name = "Nama tidak boleh kosong"

    if (!email.trim()) {
      newErrors.email = "Email tidak boleh kosong"
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Format email tidak valid"
    }

    if (!phone.trim()) {
      newErrors.phone = "Nomor telepon tidak boleh kosong"
    } else if (!/^[0-9+\-\s()]{10,15}$/.test(phone)) {
      newErrors.phone = "Format nomor telepon tidak valid"
    }

    if (!message.trim()) newErrors.message = "Pesan tidak boleh kosong"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form first
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setErrors({})

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          message,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to send message")
      }

      // Success case
      setIsSubmitted(true)
      toast({
        title: "Pesan Terkirim!",
        description: data.message || "Terima kasih telah menghubungi kami.",
        variant: "default",
      })

    } catch (error) {
      console.error("Submission error:", error)

      toast({
        title: "Gagal Mengirim Pesan",
        description:
          error instanceof Error ? error.message : "Terjadi kesalahan tidak terduga. Silakan coba lagi nanti.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false);
      setShowSuccessModal(true); // Ensure modal is shown regardless of success or failure
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  return (
    <section id="contact" className="bg-gradient-to-b from-white to-gray-50 py-16 md:py-24" ref={ref}>
      {/* Success Modal */}
      <SuccessModal open={showSuccessModal} onOpenChange={setShowSuccessModal} name={name || "Pelanggan"} />

      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="heading-primary">Hubungi Kami</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6 rounded-full"></div>
          <p className="max-w-3xl mx-auto text-lg text-gray-600">
            Konsultasikan kebutuhan Anda dengan tim kami untuk mendapatkan solusi terbaik.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Contact Info Column */}
          <motion.div
            className="lg:col-span-5 space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <motion.div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100" variants={itemVariants}>
              <h3 className="text-2xl font-semibold mb-6">Informasi Kontak</h3>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium mb-1">Alamat Kantor</h4>
                    <p className="text-gray-600">
                      {CONTACT_INFO.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium mb-1">Telepon</h4>
                    <p className="text-gray-600">{CONTACT_INFO.phone1}</p>
                    <p className="text-gray-600">{CONTACT_INFO.phone2}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium mb-1">Email</h4>
                    <p className="text-gray-600">{CONTACT_INFO.email1}</p>
                    <p className="text-gray-600">{CONTACT_INFO.email2}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium mb-1">Jam Operasional</h4>
                    <p className="text-gray-600">Senin - Jumat: 08:00 - 17:00 WIB</p>
                    <p className="text-gray-600">Sabtu: 08:00 - 15:00 WIB</p>
                    <p className="text-gray-600">Minggu & Hari Libur: Tutup</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100" variants={itemVariants}>
              <h3 className="text-2xl font-semibold mb-6">Ikuti Kami</h3>
              <div className="flex space-x-4">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="h-12 w-12 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center text-white transition-colors duration-300"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="h-12 w-12 rounded-full bg-pink-500 hover:bg-pink-600 flex items-center justify-center text-white transition-colors duration-300"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                  className="h-12 w-12 rounded-full bg-sky-500 hover:bg-sky-600 flex items-center justify-center text-white transition-colors duration-300"
                >
                  <Twitter className="h-5 w-5" />
                </a>
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form Column */}
          <motion.div
            className="lg:col-span-7"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <motion.form
              ref={formRef}
              onSubmit={handleSubmit}
              className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100 space-y-6"
              variants={itemVariants}
            >
              <h3 className="text-2xl font-semibold mb-6">Formulir Kontak</h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/30 px-4 py-2 shadow-sm transition-all placeholder:text-gray-400 placeholder:opacity-50" placeholder="Masukkan Nama Anda" />
                  {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/30 px-4 py-2 shadow-sm transition-all placeholder:text-gray-400 placeholder:opacity-50" placeholder="Masukkan Email Anda" />
                  {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                </div>

                <div>
                  <Label htmlFor="phone">Nomor Telepon</Label>
                  <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/30 px-4 py-2 shadow-sm transition-all placeholder:text-gray-400 placeholder:opacity-50" placeholder="Masukkan Nomor Telepon Anda" />
                  {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="message">Pesan</Label>
                <Textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} rows={5} className="rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/30 px-4 py-2 shadow-sm transition-all placeholder:text-gray-400 placeholder:opacity-50" placeholder="Masukkan Pesan Anda" />
                {errors.message && <p className="text-sm text-red-500 mt-1">{errors.message}</p>}
              </div>

              <Button type="submit" disabled={isSubmitting} className="rounded-xl px-6 py-2 flex items-center gap-2">
                {isSubmitting ? "Mengirim..." : "Kirim Pesan"}
                <Send className="ml-2 h-4 w-4" />
              </Button>
            </motion.form>
          </motion.div>
        </div>

        {/* Lazy Loaded Google Maps */}
        <div id="map-container" className="mt-16">
          {mapLoaded && (
            <div className="w-full h-[500px] rounded-3xl overflow-hidden shadow-lg border border-gray-200">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.2925248538536!2d107.11352067316736!3d-6.225107560963205!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69854f9b8a9187%3A0x639e660cbd4dacdf!2sCipta%20Mandiri%20Perkasa!5e0!3m2!1sid!2sid!4v1744917216045!5m2!1sid!2sid"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          )}
        </div>
      </div>
    </section>
  )
}
