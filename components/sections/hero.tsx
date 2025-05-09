"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Phone } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useMediaQuery } from "@/hooks/use-mobile"
import Link from "next/link"
import ErrorBoundary from "@/components/error-boundary"

const slides = [
  {
    id: 1,
    image: "/background2.webp",
    title: "Wujudkan Keindahan",
    subtitle: "Masjid Impian Anda Bersama Kami",
    description: "Spesialis pembuatan kubah masjid dengan kualitas premium dan material terbaik",
    highlightColor: "from-blue-400 to-blue-600",
  },
  {
    id: 2,
    image: "/background1.webp",
    title: "Mimbar Berkualitas",
    subtitle: "Dengan Sentuhan Artistik Nan Elegan",
    description: "Desain mimbar masjid yang elegan, fungsional, dan tahan lama",
    highlightColor: "from-blue-400 to-blue-600",
  },
  {
    id: 3,
    image: "/background3.webp",
    title: "Menara Megah",
    subtitle: "Ikon Spiritual yang Memukau",
    description: "Pembuatan menara masjid dengan struktur kokoh dan desain menawan",
    highlightColor: "from-blue-400 to-blue-600",
  },
]

const whatsappNumber = "6281386225702"
const whatsappMessage = "Halo, saya ingin berkonsultasi tentang..."

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const isMobile = useMediaQuery("(max-width: 768px)")

  const openWhatsApp = () => {
    try {
      window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`, "_blank")
    } catch (error) {
      console.error("Error opening WhatsApp:", error)
    }
  }

  const handleCall = () => {
    try {
      window.location.href = `tel:${whatsappNumber}`
    } catch (error) {
      console.error("Error making phone call:", error)
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <ErrorBoundary>
      <section id="hero" className="relative min-h-screen flex items-center pt-16 w-full overflow-x-hidden">
        {/* Background Slideshow */}
        <div className="absolute inset-0 z-0 w-full">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? "opacity-100" : "opacity-0"}`}
            >
              <Image
                src={slide.image || "/placeholder.svg"}
                alt={slide.title}
                fill
                priority
                className="object-cover w-full"
                quality={100}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                onError={(e) => {
                  console.error(`Error loading image: ${slide.image}`)
                  e.currentTarget.src = "/placeholder.svg"
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/30"></div>
              <div className="absolute inset-0 bg-noise opacity-10"></div>
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="container relative z-10 mx-auto px-4 sm:px-6 py-12 md:py-24 w-full max-w-screen">
          <div className="max-w-3xl text-white px-2 sm:px-0 w-full">
            {/* Text Animation */}
            <div className="relative h-[120px] sm:h-48 md:h-64 lg:h-80 mb-6 w-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={slides[currentSlide].id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="absolute top-0 left-0 w-full"
                >
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                    <span className="text-white">{slides[currentSlide].title}</span>
                    <br />
                    <span className="text-blue-400 font-extrabold">
                      {slides[currentSlide].subtitle}
                    </span>
                  </h1>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Description */}
            <div className="relative h-16 sm:h-20 mb-8 sm:mb-10 w-full">
              <AnimatePresence mode="wait">
                <motion.p
                  key={slides[currentSlide].id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="absolute top-0 left-0 text-base sm:text-lg md:text-xl text-white w-full max-w-2xl leading-relaxed"
                >
                  <span className="bg-primary/80 px-3 sm:px-4 py-1 sm:py-2 rounded-lg inline-block">
                    {slides[currentSlide].description}
                  </span>
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-12 sm:mb-16 w-full px-2 sm:px-0">
              <Button
                onClick={openWhatsApp}
                className="rounded-full px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-bold bg-[#25D366] hover:bg-[#1DA851] text-white shadow-lg transition-all flex items-center justify-center flex-1 w-full"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 sm:h-5 sm:w-5 mr-2"
                  viewBox="0 0 32 32"
                  fill="currentColor"
                >
                  <path d="M16 0C7.2 0 0 6.9 0 15.3c0 2.7.7 5.3 2.1 7.5L0 32l9.4-2.4c2 .5 4 .8 6.1.8 8.8 0 16-6.9 16-15.3S24.8 0 16 0zm0 28.4c-1.8 0-3.5-.3-5.1-.8l-.4-.1-5.6 1.4 1.5-5.3-.3-.4c-1.3-1.9-2-4.2-2-6.6 0-6.6 5.6-11.9 12.5-11.9s12.5 5.3 12.5 11.9-5.6 11.9-12.5 11.9zm6.8-8.8c-.4-.2-2.5-1.2-2.9-1.3-.4-.2-.6-.2-.8.2-.2.4-.9 1.3-1.1 1.5-.2.2-.4.2-.8 0-.4-.2-1.5-.5-2.9-1.7-1.1-.9-1.8-2-2-2.3-.2-.3 0-.5.1-.7.1-.1.3-.4.5-.6.1-.2.1-.4.2-.6 0-.2 0-.5-.1-.7-.2-.2-.8-1.9-1.1-2.6-.3-.7-.6-.6-.8-.6-.2 0-.4 0-.6 0s-.6.1-.9.4c-.3.3-1.2 1.1-1.2 2.6s1.3 3 1.5 3.2c.2.2 2.5 3.9 6 5.4.8.3 1.5.5 2 .6.8.2 1.6.2 2.2.1.7-.1 2.5-1 2.9-2 .4-1 .4-1.8.3-2 0-.2-.3-.3-.7-.5z" />
                </svg>
                <span aria-label="Hubungi via WhatsApp" className="truncate">
                  Hubungi via WhatsApp
                </span>
              </Button>

              {isMobile && (
                <Button
                  onClick={handleCall}
                  className="rounded-full px-4 py-3 text-sm font-bold bg-red-600 hover:bg-red-700 text-white shadow-lg transition-all flex items-center justify-center flex-1 w-full"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  <span aria-label="Hubungi via Telpon" className="truncate">
                    Hubungi via Telepon
                  </span>
                </Button>
              )}

              {!isMobile && (
                <Link href="/gallery" className="flex-1 w-full">
                  <Button
                    variant="outline"
                    className="rounded-full w-full px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-medium border-2 border-blue-500 bg-blue-500 hover:bg-blue-600 text-white hover:text-white transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-blue-500/20 group"
                  >
                    <span className="relative z-10 flex items-center justify-center w-full">
                      <span className="truncate">Lihat Portofolio</span>
                      <ArrowRight className="ml-2 sm:ml-3 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                </Link>
              )}
            </div>

            {isMobile && (
              <div className="w-full mb-8 px-2">
                <Link href="/gallery">
                  <Button
                    variant="outline"
                    className="rounded-full w-full px-4 py-3 text-sm font-medium border-2 border-blue-500 bg-blue-500 hover:bg-blue-600 text-white hover:text-white transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-blue-500/20 group"
                  >
                    <span className="relative z-10 flex items-center justify-center w-full">
                      <span className="truncate">Lihat Portofolio</span>
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Indicators Container - Responsive Positioning */}
        <div className={`absolute ${isMobile ? 'bottom-4' : 'bottom-8'} left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center gap-3 w-full max-w-[95vw]`}>
          {/* Scroll Indicator - Only show on desktop */}
          {!isMobile && (
            <motion.div
              className="flex flex-col items-center cursor-pointer group"
              onClick={() => window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' })}
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 400, 
                damping: 10,
                delay: 1.5, 
                duration: 0.8 
              }}
            >
              <motion.div
                className="w-8 h-12 sm:w-10 sm:h-14 rounded-3xl border-2 border-white/70 flex justify-center pt-2 relative"
                animate={{
                  borderColor: ["rgba(255,255,255,0.5)", "rgba(255,255,255,0.8)", "rgba(255,255,255,0.5)"],
                }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 2.5,
                  ease: "easeInOut"
                }}
              >
                <motion.div
                  className="w-1 h-2 sm:h-3 bg-white rounded-full"
                  animate={{
                    y: [0, 6, 0],
                    opacity: [0.6, 1, 0.6]
                  }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 1.8,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>

              <motion.span
                className="text-xs sm:text-sm mt-2 text-white/80 font-medium tracking-wider"
                animate={{
                  opacity: [0.6, 1, 0.6],
                  y: [0, -3, 0]
                }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 2.5,
                  ease: "easeInOut"
                }}
              >
                SCROLL UNTUK MELIHAT
              </motion.span>
            </motion.div>
          )}

          {/* Slide Indicators */}
          <div className="flex gap-2 justify-center">
            {slides.map((slide, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-blue-400 w-6 sm:w-8 md:w-12"
                    : "bg-white/30 w-3 sm:w-4 md:w-6"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>
    </ErrorBoundary>
  )
}