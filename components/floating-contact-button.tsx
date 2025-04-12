"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Phone, MessageCircle, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function FloatingContactButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const heroSectionRef = useRef<HTMLElement | null>(null)

  // Find hero section and set up intersection observer
  useEffect(() => {
    const heroSection = document.getElementById("hero")
    heroSectionRef.current = heroSection

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Hide when hero is visible, show when hero is not visible
        setIsVisible(!entry.isIntersecting)
      },
      { threshold: 0.1 },
    )

    if (heroSection) {
      observer.observe(heroSection)
    }

    return () => {
      if (heroSection) {
        observer.unobserve(heroSection)
      }
    }
  }, [])

  // Show popup every 3 seconds
  useEffect(() => {
    if (!isVisible) return

    const interval = setInterval(() => {
      if (!isOpen) {
        setShowPopup(true)
        setTimeout(() => {
          setShowPopup(false)
        }, 2000) 
      }
    }, 3000) 

    return () => clearInterval(interval)
  }, [isVisible, isOpen])

  const handleCall = () => {
    window.location.href = "tel:+6285218729008"
    setIsOpen(false)
  }

  const handleWhatsApp = () => {
    window.open("https://wa.me/6285218729008", "_blank")
    setIsOpen(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {showPopup && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute bottom-full right-0 mb-2 bg-white px-4 py-2 rounded-full shadow-lg text-sm font-medium"
          >
            Hubungi Kami Sekarang
            <div className="absolute bottom-0 right-4 transform translate-y-1/2 rotate-45 w-2 h-2 bg-white"></div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className="absolute bottom-full right-0 mb-4 flex flex-col gap-2 items-end"
          >
            <Button
              onClick={handleWhatsApp}
              className="bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center gap-2 px-4 py-2 shadow-lg"
            >
              <MessageCircle className="h-5 w-5" />
              <span>WhatsApp</span>
            </Button>
            <Button
              onClick={handleCall}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center gap-2 px-4 py-2 shadow-lg"
            >
              <Phone className="h-5 w-5" />
              <span>Telepon</span>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        className={`rounded-full w-14 h-14 flex items-center justify-center shadow-lg ${
          isOpen ? "bg-red-500 hover:bg-red-600" : "bg-primary hover:bg-primary-dark"
        }`}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? <X className="h-6 w-6 text-white" /> : <Phone className="h-6 w-6 text-white" />}
      </motion.button>
    </div>
  )
}
