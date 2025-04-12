import type { Metadata } from "next"
import Navbar from "@/components/layout/navbar"
import Hero from "@/components/sections/hero"
import About from "@/components/sections/about"
import Services from "@/components/sections/services"
import Gallery from "@/components/sections/gallery"
import Testimonials from "@/components/sections/testimonials"
import Contact from "@/components/sections/contact"
import BlogPreview from "@/components/sections/blog-preview"
import Footer from "@/components/layout/footer"

export const metadata: Metadata = {
  title: "Cipta Mandiri Perkasa - Spesialis Kubah Masjid & Ornamen Islami",
  description:
    "Cipta Mandiri Perkasa adalah perusahaan spesialis pembuatan kubah masjid, mimbar, menara, kerawangan, dan awan kaligrafi dengan kualitas terbaik dan harga terjangkau.",
  openGraph: {
    title: "Cipta Mandiri Perkasa - Spesialis Kubah Masjid & Ornamen Islami",
    description:
      "Cipta Mandiri Perkasa adalah perusahaan spesialis pembuatan kubah masjid, mimbar, menara, kerawangan, dan awan kaligrafi dengan kualitas terbaik dan harga terjangkau.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Cipta Mandiri Perkasa",
      },
    ],
    type: "website",
  },
}

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Gallery />
      <BlogPreview />
      <Testimonials />
      <Contact />
      <Footer />
    </main>
  )
}
