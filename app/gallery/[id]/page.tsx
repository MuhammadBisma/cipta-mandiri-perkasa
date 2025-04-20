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
import Breadcrumbs from "@/components/seo/breadcrumbs"
import StructuredData from "@/components/seo/structured-data"
import CanonicalUrl from "@/components/seo/canonical-url"

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params
  const galleryItem = await prisma.gallery.findUnique({
    where: { id: resolvedParams.id },
  })

  if (!galleryItem) {
    return {
      title: "Item Tidak Ditemukan - Cipta Mandiri Perkasa",
    }
  }

  return {
    title: `${galleryItem.title} - Galeri Cipta Mandiri Perkasa`,
    description: galleryItem.description || `Detail proyek ${galleryItem.title} oleh Cipta Mandiri Perkasa`,
    keywords: [
      galleryItem.title,
      galleryItem.category,
      `${galleryItem.category} masjid`,
      `proyek ${galleryItem.category}`,
      `galeri ${galleryItem.category}`,
      `desain ${galleryItem.category}`,
      `model ${galleryItem.category}`,
      "ornamen islami",
      "kubah masjid",
      "desain masjid",
    ],
    openGraph: {
      title: `${galleryItem.title} - Galeri Cipta Mandiri Perkasa`,
      description: galleryItem.description || `Detail proyek ${galleryItem.title} oleh Cipta Mandiri Perkasa`,
      url: `https://kubahcmp.id/gallery/${galleryItem.id}`,
      images: [
        {
          url: galleryItem.imageUrl,
          width: 1200,
          height: 630,
          alt: galleryItem.title,
        },
      ],
      type: "article",
    },
    alternates: {
      canonical: `https://kubahcmp.id/gallery/${galleryItem.id}`,
    },
  }
}

export default async function GalleryItemPage({ params }: Props) {
  const resolvedParams = await params
  const galleryItem = await prisma.gallery.findUnique({
    where: { id: resolvedParams.id },
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
      <Navbar />
      <CanonicalUrl path={`/gallery/${galleryItem?.id}`} />
      <StructuredData
        type="Product"
        title={galleryItem.title}
        description={galleryItem.description || `Proyek ${galleryItem.title} kategori ${galleryItem.category}`}
        imageUrl={galleryItem.imageUrl}
      />

      <main className="pt-24">
        <section className="py-12 md:py-16">
          <div className="container">
            <div className="mb-8">
              <Breadcrumbs
                customItems={[
                  { label: "Galeri", href: "/gallery" },
                  { label: galleryItem.title, href: `/gallery/${galleryItem.id}` },
                ]}
                className="mb-4"
              />

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
                  sizes="(max-width: 768px) 100vw, 50vw"
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
                    Konsultasikan kebutuhan Anda dengan tim kami untuk mendapatkan solusi terbaik dan penawaran harga
                    yang kompetitif.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Link href="https://wa.me/6281386225702" target="_blank" rel="noopener noreferrer">
                      <Button className="bg-green-600 hover:bg-green-700 rounded-xl">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 sm:h-5 sm:w-5 mr-2"
                          viewBox="0 0 32 32"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path d="M16 0C7.2 0 0 6.9 0 15.3c0 2.7.7 5.3 2.1 7.5L0 32l9.4-2.4c2 .5 4 .8 6.1.8 8.8 0 16-6.9 16-15.3S24.8 0 16 0zm0 28.4c-1.8 0-3.5-.3-5.1-.8l-.4-.1-5.6 1.4 1.5-5.3-.3-.4c-1.3-1.9-2-4.2-2-6.6 0-6.6 5.6-11.9 12.5-11.9s12.5 5.3 12.5 11.9-5.6 11.9-12.5 11.9zm6.8-8.8c-.4-.2-2.5-1.2-2.9-1.3-.4-.2-.6-.2-.8.2-.2.4-.9 1.3-1.1 1.5-.2.2-.4.2-.8 0-.4-.2-1.5-.5-2.9-1.7-1.1-.9-1.8-2-2-2.3-.2-.3 0-.5.1-.7.1-.1.3-.4.5-.6.1-.2.1-.4.2-.6 0-.2 0-.5-.1-.7-.2-.2-.8-1.9-1.1-2.6-.3-.7-.6-.6-.8-.6-.2 0-.4 0-.6 0s-.6.1-.9.4c-.3.3-1.2 1.1-1.2 2.6s1.3 3 1.5 3.2c.2.2 2.5 3.9 6 5.4.8.3 1.5.5 2 .6.8.2 1.6.2 2.2.1.7-.1 2.5-1 2.9-2 .4-1 .4-1.8.3-2 0-.2-.3-.3-.7-.5z" />
                        </svg>
                        Hubungi Kami via WA
                      </Button>
                    </Link>
                    <Link href={`/services/${galleryItem.category}`}>
                      <Button
                        variant="outline"
                        className="border-primary text-primary hover:bg-primary hover:text-white rounded-xl"
                      >
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
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
      <Footer />
    </>
  )
}
