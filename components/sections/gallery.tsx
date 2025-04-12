"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

type GalleryItem = {
  id: string
  title: string
  description: string | null
  imageUrl: string
  category: string
}

const categories = [
  { id: "all", name: "Semua" },
  { id: "kubah", name: "Kubah" },
  { id: "mimbar", name: "Mimbar" },
  { id: "menara", name: "Menara" },
  { id: "kerawangan", name: "Kerawangan" },
  { id: "kaligrafi", name: "Kaligrafi" },
]

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState("all")
  const [selectedItem, setSelectedItem] = useState<null | GalleryItem>(null)
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Fetch gallery items from API
    const fetchGalleryItems = async () => {
      try {
        const response = await fetch("/api/gallery")
        if (!response.ok) {
          throw new Error("Failed to fetch gallery items")
        }
        const data = await response.json()
        setGalleryItems(data)
      } catch (error) {
        console.error("Error fetching gallery items:", error)
        toast({
          title: "Error",
          description: "Gagal memuat galeri",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchGalleryItems()
  }, [toast])

  const filteredItems =
    activeCategory === "all"
      ? galleryItems
      : galleryItems.filter((item) => item.category.toLowerCase() === activeCategory)

  return (
    <section id="gallery" className="section-padding">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="heading-primary">Galeri Proyek</h2>
          <p className="max-w-3xl mx-auto text-lg text-gray-600">
            Lihat hasil karya kami yang telah terpasang di berbagai masjid di Indonesia.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <Button
            key={category.id}
            variant={activeCategory === category.id ? "default" : "outline"}
            className={cn(
              "rounded-full transition-all duration-200", 
              activeCategory === category.id 
                ? "bg-primary hover:bg-primary/90 shadow-md" 
                : "hover:bg-gray-100 dark:hover:bg-gray-800",
              "px-6 py-3 text-sm font-medium"
            )}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.name}
          </Button>
          
          ))}
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Memuat galeri...</p>
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="relative group overflow-hidden rounded-lg shadow-md cursor-pointer"
                onClick={() => setSelectedItem(item)}
              >
                <div className="relative h-64">
                  <Image
                    src={item.imageUrl || "/placeholder.svg"}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <h3 className="text-white font-semibold text-lg">{item.title}</h3>
                    <p className="text-white/80 text-sm">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">Tidak ada item galeri dalam kategori ini.</p>
          </div>
        )}

        {/* Load More Button */}
        {filteredItems.length > 0 && (
          <div className="mt-10 text-center">
            <Link href="/gallery">
              <Button className="btn-primary rounded-full px-6 py-3 text-sm font-medium">
              Lihat Lebih Banyak
              </Button>
            </Link>
          </div>
        )}

        {/* Lightbox Modal */}
        {selectedItem && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <div className="relative max-w-4xl w-full bg-white rounded-lg overflow-hidden">
              <Button
                variant="ghost"
                className="absolute right-2 top-2 z-10 text-white bg-black/50 hover:bg-black/70 rounded-full p-2"
                onClick={() => setSelectedItem(null)}
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </Button>
              <div className="relative h-[60vh]">
                <Image
                  src={selectedItem.imageUrl || "/placeholder.svg"}
                  alt={selectedItem.title}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="p-4 bg-white">
                <h3 className="text-xl font-semibold">{selectedItem.title}</h3>
                <p className="text-gray-600">{selectedItem.description}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
