import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import prisma from "@/lib/db"
import { formatDate } from "@/lib/utils"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"

type Props = {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const galleryItem = await prisma.gallery.findUnique({
    where: { id: params.id },
  })

  if (!galleryItem) {
    return {
      title: "Item Tidak Ditemukan - Cipta Mandiri Perkasa",
    }
  }

  return {
    title: `${galleryItem.title} - Galeri Cipta Mandiri Perkasa`,
    description: galleryItem.description || `Detail proyek ${galleryItem.title} oleh Cipta Mandiri Perkasa`,
    openGraph: {
      title: `${galleryItem.title} - Galeri Cipta Mandiri Perkasa`,
      description: galleryItem.description || `Detail proyek ${galleryItem.title} oleh Cipta Mandiri Perkasa`,
      images: [
        {
          url: galleryItem.imageUrl,
          width: 1200,
          height: 630,
          alt: galleryItem.title,
        },
      ],
    },
  }
}

export default async function GalleryItemPage({ params }: Props) {
  const galleryItem = await prisma.gallery.findUnique({
    where: { id: params.id },
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
  })

  if (!galleryItem) {
    notFound()
  }

  // Fetch related items from the same category
  const relatedItems = await prisma.gallery.findMany({
    where: {
      category: galleryItem.category,
      id: { not: galleryItem.id },
    },
    take: 3,
  })

  return (
    <>
    <Navbar/>
    <main className="pt-24">
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="mb-8">
            <Link href="/gallery">
              <Button variant="outline" className="mb-6 rounded-xl">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali ke Galeri
              </Button>
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{galleryItem.title}</h1>
            <div className="flex flex-wrap gap-4 items-center text-sm text-gray-500">
              <span>
                Kategori:{" "}
                <Link href={`/gallery?category=${galleryItem.category}`} className="text-primary hover:underline">
                  {galleryItem.category.charAt(0).toUpperCase() + galleryItem.category.slice(1)}
                </Link>
              </span>
              <span>Ditambahkan pada {formatDate(new Date(galleryItem.createdAt))}</span>
              <span>Oleh {galleryItem.author.name}</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div className="relative aspect-square rounded-lg overflow-hidden shadow-lg">
              <Image
                src={galleryItem.imageUrl || "/placeholder.svg"}
                alt={galleryItem.title}
                fill
                className="object-cover"
                priority
              />
            </div>
            <div>
              <div className="prose max-w-none">
                {galleryItem.description ? (
                  <p className="text-lg">{galleryItem.description}</p>
                ) : (
                  <p className="text-lg">
                    Proyek {galleryItem.title} merupakan salah satu karya Cipta Mandiri Perkasa dalam kategori{" "}
                    {galleryItem.category}. Kami mengutamakan kualitas dan keindahan dalam setiap karya yang kami
                    hasilkan.
                  </p>
                )}
              </div>

              <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-4">Tertarik dengan layanan kami?</h2>
                <p className="mb-4">
                  Konsultasikan kebutuhan Anda dengan tim kami untuk mendapatkan solusi terbaik dan penawaran harga yang
                  kompetitif.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/#contact">
                    <Button className="bg-primary rounded-xl">Hubungi Kami</Button>
                  </Link>
                  <Link href={`/services/${galleryItem.category}`}>
                    <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white rounded-xl">
                      Lihat Layanan {galleryItem.category.charAt(0).toUpperCase() + galleryItem.category.slice(1)}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {relatedItems.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-semibold mb-6">Proyek Terkait</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedItems.map((item) => (
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
                        <h3 className="font-semibold">{item.title}</h3>
                        {item.description && <p className="text-gray-600 mt-1 line-clamp-2">{item.description}</p>}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
    <Footer/>
    </>
  )
}
