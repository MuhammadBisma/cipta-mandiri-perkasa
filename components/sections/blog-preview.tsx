"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, User, ArrowRight } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: {
    template: "%s | Cipta Mandiri Perkasa",
    default: "Cipta Mandiri Perkasa - Spesialis Kubah Masjid & Ornamen Islami",
  },
  description:
    "Cipta Mandiri Perkasa adalah perusahaan spesialis pembuatan kubah masjid, mimbar, menara, kerawangan, dan awan kaligrafi dengan kualitas terbaik dan harga terjangkau.",
  keywords: [
    "kubah masjid",
    "mimbar masjid",
    "menara masjid",
    "kerawangan",
    "awan kaligrafi",
    "ornamen islami",
    "kubah masjid murah",
    "mimbar masjid murah",
    "menara masjid murah",
    "kerawangan murah",
    "awan kaligrafi murah",
    "ornamen islami murah",
    "pembuatan masjid modern murah",
    "pembuatan masjid minimalis murah",
    "kubah masjid modern",
    "kubah GRC",
    "harga kubah masjid grc",
    "grc kubah",
    "kubah grc",
    "kubah architecture",
    "kubah grafik",
    "kubah grc motif",
    "kubah grc bekasi",
    "kubah grc adalah",
    "grc kubah menara masjid",
    "rangka kubah grc",
    "gambar kubah grc",
    "model kubah grc",
    "kubah dari grc",
    "berat kubah grc",
    "bahan kubah grc",
    "harga kubah grc diameter 4 meter",
    "mahkota kubah grc",
    "leher kubah grc",
    "pemasangan kubah grc masjid",
    "kubah grc masjid",
    "grc kubah masjid",
    "desain kubah grc",
    "pemesanan kubah GRC",
    "pemasangan kubah grc",
    "pemasangan kubah grc masjid",
    "pasang kubah grc",
    "pemasangan kubah cor",
    "cara pemasangan kubah grc",
    "menara GRC",
    "grc menara masjid",
    "rangka menara grc",
    "harga menara grc",
    "gambar menara grc",
    "menara masjid grc kubah",
    "menara masjid dari grc",
    "harga grc menara masjid",
    "menara gracia",
    "menara group",
    "menara bca green building",
    "menara great eastern",
    "menara arcadia",
    "menara greenview",
    "menara great eastern 2",
    "menara great eastern 2 address",
    "menara great eastern kl",
    "menara great eastern address",
    "menara great eastern ampang",
    "menara great eastern jalan ampang",
    "kubah cibitung",
    "masjid GRC",
    "grc masjid krawangan",
    "grc masjid 3d warehouse",
    "mihrab masjid grc",
    "kubah masjid grc",
    "menara masjid grc",
    "ornamen masjid grc",
    "pagar masjid grc",
    "plafon masjid grc",
    "menara masjid grc kubah",
    "motif grc masjid",
    "rab menara masjid grc",
    "ornamen grc masjid",
    "kubah grc masjid",
    "grc menara masjid",
    "grc mihrab masjid",
    "grc dinding masjid",
    "roster grc masjid",
    "model grc masjid",
    "panel grc masjid",
    "grc untuk masjid",
    "kaligrafi grc masjid",
    "grc jendela masjid",
    "lisplang grc masjid",
    "grc masjid",
    "masjid grc",
    "masjid arch design",
    "masjid gresik",
    "masjid grafik",
    "masjid architecture",
    "masjid green",
    "masjid grafis",
    "masjid gren alia cikini",
    "ornamen GRC",
    "ornamen grc masjid",
    "ornamen grc terdekat",
    "ornamen grc tempel",
    "ornamen grc minimalis",
    "ornamen grc krawangan",
    "ornamen grc klasik",
    "ornamen grc dinding",
    "ornamen grc board",
    "ornamen grc pt adirahma harapan jaya",
    "ornamen grc rumah",
    "ornamen grc pagar",
    "ornamen grc relief",
    "ornamen grc pekanbaru",
    "ornamen grc adalah",
    "ornamen grc cetak",
    "ornamen grc",
    "ornamen grc dinding masjid",
    "grc ornamen",
    "ornamen grc skp",
    "ornamen tiang grc",
    "grc ornaments",
    "menara GRC",
    "menara grc",
    "grc menara masjid",
    "rangka menara grc",
    "harga menara grc",
    "gambar menara grc",
    "menara masjid grc kubah",
    "menara masjid dari grc",
    "harga grc menara masjid",
    "menara gracia",
    "menara group",
    "menara bca green building",
    "grc kubah menara masjid",
    "grc menara",
    "menara great eastern",
    "grc ornamen krawangan",
    "grc ornamen dinding",
    "grc ornamen pagar",
    "menara great eastern ampang",
    "menara great eastern jalan ampang",
    "krawangan GRC",
    "krawangan grc motif daun",
    "krawangan grc pagar",
    "krawangan grc makassar",
    "krawangan grc minimalis",
    "krawangan grc terdekat",
    "krawangan grc motif batik",
    "krawangan grc motif bunga",
    "krawangan grc mushola",
    "krawangan grc kaligrafi",
    "krawangan grc beton",
    "krawangan grc bandung",
    "krawangan grc motif",
    "grc krawangan rumah minimalis",
    "grc krawangan surabaya",
    "menara greenview",
    "menara great eastern 2",
    "menara great eastern 2 address",
    "menara great eastern kl",
    "menara great eastern address",
    "krawangan grc masjid",
    "grc krawangan pagar",
    "grc krawangan bandung",
    "grc krawangan minimalis",
    "grc krawangan semarang",
    "grc krawangan rumah",
    "grc krawangan jogja",
    "grc krawangan adalah",
    "grc krawangan cinere",
    "grc krawangan jakarta",
    "grc krawangan",
    "harga krawangan grc per m2",
    "grc krawangan batik",
    "jasa pembuatan kubah",
    "jasa pembuatan kubah masjid",
    "grc krawangan masjid",
    "grc krawangan terdekat",
    "grc krawangan bekasi",
    "grc krawangan ornamen masjid",
    "bangunan dari grc",
    "bangunan pakai grc",
    "bahan bangunan grc adalah",
    "toko bangunan grc",
    "alat bangunan grc",
    "bangunan dengan grc",
    "bangunan menggunakan grc",
    "bangunan rumah dari grc",
    "harga grc bangunan",
    "grc bahan bangunan",
    "bangunan grc",
    "grc bangunan",
    "",
    "",
    "",
    "",
    "cara pembuatan kubah masjid",
    "jasa pembuat kubah",
    "pembuatan kubah",
    "jasa pembuatan kumbung",
    "jasa pembuatan pembukuan",
    "bangunan GRC",
    "bangunan grc board",
    "grc bangunan adalah",
    "bahan bangunan grc",
    "bahan bangunan grc harga",
    "grc bahan bangunan adalah",
    "grc dalam bangunan",
    "grc untuk bangunan",
    "grc pada bangunan",
    "apa itu grc bangunan",
    "bangunan green building",
    "bangunan groin",
    "bangunan greenhouse",
    "bangunan graha maju",
    "bangunan grid",
    "bangunan gacoan",
    "bangunan green building di indonesia",
    "bangunan green arsitektur",
    "bangunan green building adalah",
    "renovasi masjid",
    "renovasi masjid nabawi",
    "renovasi masjid nabawi dilakukan pada masa khalifah",
    "renovasi masjidil haram",
    "renovasi masjid nabawi pada masa utsman bin affan",
    "renovasi masjid istiqlal",
    "renovasi masjid nabawi pada masa khalifah utsman bin affan",
    "renovasi masjid nabawi dilakukan pada masa khalifah utsman bin affan",
    "renovasi masjid agung kendal",
    "renovasi masjid nabawi terjadi pada masa khalifah",
    "renovasi masjid agung batam",
    "renovasi masjidil haram 2024",
    "renovasi masjid piss ktb",
    "renovasi masjid nabawi utsman bin affan",
    "renovasi masjid agung",
    "renovasi masjid nabawi pertama kali dilakukan di khalifah",
    "renovasi masjid agung surakarta",
    "renovasi masjid raya batam",
    "masjid renovasi",
    "proposal renovasi masjid",
    "proposal pengajuan dana renovasi masjid",
    "proposal renovasi masjid word",
    "contoh proposal renovasi masjid",
    "contoh rab renovasi masjid",
    "spanduk renovasi masjid",
    "proposal renovasi masjid pdf",
    "renovasi masjid cut meutia",
    "renovasi masjid nabawi dilakukan pada masa pemerintahan khalifah",
    "renovasi masjid nabawi terjadi pada masa",
    "renovasi masjid al falah surabaya",
    "renovasi kursi",
    "kubah revit",
    "kubah rumah",
    "renovasi kabah",
    "harga kubah GRC",
    "harga kubah grc per meter",
    "harga kubah grc diameter 4 meter",
    "harga kubah masjid bahan grc",
    "harga kubah grc per meter 2022",
    "rab renovasi masjid",
    "renovasi kubah",
    "renovasi kubah masjid",
    "proposal renovasi kubah masjid",
    "renovasi kubah islamic center",
    "renovasi kuburan",
    "renovasi ka'bah",
    "kubah grc murah",
    "grc kubah harga",
    "harga kubah masjid grc",
    "harga kubah grc diameter 2 meter",
    "harga kubah grc",
    "grc kubah",
  ],
  authors: [{ name: "Cipta Mandiri Perkasa" }],
  creator: "Cipta Mandiri Perkasa",
  publisher: "Cipta Mandiri Perkasa",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  generator: "v0.dev",
}

type BlogPost = {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  imageUrl: string
  category: string
  createdAt: string
  author: {
    name: string
  }
}

export default function BlogPreview() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Fetch blog posts from API
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/blog")
        if (!response.ok) {
          throw new Error("Failed to fetch blog posts")
        }
        const data = await response.json()
        // Only show published posts and limit to 3
        const publishedPosts = data.filter((post: BlogPost & { published: boolean }) => post.published).slice(0, 3)
        setPosts(publishedPosts)
      } catch (error) {
        console.error("Error fetching blog posts:", error)
        toast({
          title: "Error",
          description: "Gagal memuat artikel blog",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [toast])

  return (
    <section id="blog" className="section-padding bg-gray-50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="heading-primary">Blog & Artikel</h2>
          <p className="max-w-3xl mx-auto text-lg text-gray-600">
            Temukan informasi dan inspirasi seputar arsitektur islami dan ornamen masjid.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Memuat artikel...</p>
          </div>
        ) : posts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-2"
              >
                <div className="relative h-48">
                  <Image
                    src={post.imageUrl || "/placeholder.svg"}
                    alt={post.title}
                    fill
                    loading="lazy"
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <div className="flex items-center mr-4">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{formatDate(new Date(post.createdAt))}</span>
                    </div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      <span>{post.author.name}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <Link href={`/blog/${post.slug}`}>
                    <Button variant="link" className="text-primary p-0 flex items-center">
                      Baca Selengkapnya <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">Belum ada artikel blog.</p>
          </div>
        )}

        <div className="mt-10 text-center">
          <Link href="/blog">
            <Button className="rounded-xl px-6 py-3 text-sm font-medium bg-primary hover:bg-primary/90 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1">
              Lihat Semua Artikel
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
