import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import prisma from "@/lib/db"
import { formatDate } from "@/lib/utils"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"

export const metadata: Metadata = {
  title: "Galeri - Cipta Mandiri Perkasa",
  description: "Galeri proyek kubah masjid, mimbar, menara, kerawangan, dan awan kaligrafi dari Cipta Mandiri Perkasa.",
}

// Categories for filtering
const categories = [
  { id: "all", name: "Semua" },
  { id: "kubah", name: "Kubah" },
  { id: "mimbar", name: "Mimbar" },
  { id: "menara", name: "Menara" },
  { id: "kerawangan", name: "Kerawangan" },
  { id: "kaligrafi", name: "Kaligrafi" },
  { id: "masjid", name: "Masjid" },
]

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Get category from query params or default to "all"
  const category = typeof searchParams.category === "string" ? searchParams.category : "all"

  // Fetch gallery items from database
  let galleryItems
  if (category === "all") {
    galleryItems = await prisma.gallery.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
    })
  } else {
    galleryItems = await prisma.gallery.findMany({
      where: {
        category: category,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
    })
  }

  return (
    <>
    <Navbar/>
    <main className="pt-24">
      <section className="py-12 md:py-16 bg-primary text-white">
        <div className="container">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Galeri Proyek</h1>
          <p className="text-lg text-white/80 max-w-3xl">
            Lihat hasil karya kami yang telah terpasang di berbagai masjid di Indonesia.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-8">
  {categories.map((cat) => (
    <Link key={cat.id} href={`/gallery?category=${cat.id}`}>
      <Button
        variant={category === cat.id ? "default" : "outline"}
        className={`rounded-full px-6 py-3 md:px-8 md:py-4 text-base font-medium transition-all duration-300 ${
          category === cat.id
            ? "bg-primary text-white shadow-md hover:bg-primary/90"
            : "border-2 border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400"
        }`}
      >
        {cat.name}
      </Button>
    </Link>
  ))}
</div>
          {/* Gallery Grid */}
          {galleryItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryItems.map((item) => (
                <Link key={item.id} href={`/gallery/${item.id}`}>
                  <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-2">
                    <div className="relative h-64">
                      <Image
                        src={item.imageUrl || "/placeholder.svg"}
                        alt={item.title}
                        fill
                        className="object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                      {item.description && <p className="text-gray-600 mt-1">{item.description}</p>}
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-500">
                          Ditambahkan pada {formatDate(new Date(item.createdAt))}
                        </span>
                        <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-full">
                          {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Tidak ada item galeri dalam kategori ini.</p>
            </div>
          )}
        </div>
      </section>
    </main>
    <Footer/>
    </>
  )
}
