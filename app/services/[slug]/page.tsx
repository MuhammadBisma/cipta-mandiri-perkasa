// app/services/[slug]/page.tsx
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowLeft, HelpCircle } from "lucide-react"
import { services } from "../page"
import ServiceCalculator, { ServiceType } from "@/components/sections/service-calculator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"

type Props = {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = services.find((service) => service.slug === params.slug)

  if (!service) {
    return {
      title: "Layanan Tidak Ditemukan - Cipta Mandiri Perkasa",
    }
  }

  return {
    title: `${service.title} - Cipta Mandiri Perkasa`,
    description: service.description,
    openGraph: {
      title: `${service.title} - Cipta Mandiri Perkasa`,
      description: service.description,
      images: [
        {
          url: service.image,
          width: 1200,
          height: 630,
          alt: service.title,
        },
      ],
    },
  }
}

export async function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug,
  }))
}

// Validate service slugs match the expected types
function isValidServiceType(slug: string): slug is ServiceType {
  const validServiceTypes: ServiceType[] = [
    "masjid",
    "kubah",
    "mimbar",
    "menara",
    "kerawangan",
    "kaligrafi",
    "ornamen"
  ]
  return validServiceTypes.includes(slug as ServiceType)
}

export default function ServicePage({ params }: Props) {
  const service = services.find((service) => service.slug === params.slug)

  if (!service || !isValidServiceType(service.slug)) {
    notFound()
  }

  return (
    <>
      <Navbar/>
      <main className="pt-24">
        <section className="py-12 md:py-16 bg-primary text-white">
          <div className="container">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{service.title}</h1>
                <p className="text-lg text-white/80 max-w-3xl">{service.description}</p>
              </div>
              <Link href="/services">
                <Button
                  variant="outline"
                  className="bg-transparent border-white text-white hover:bg-white hover:text-primary"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Layanan
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
              <div className="relative h-[400px] rounded-lg overflow-hidden shadow-lg">
                <Image src={service.image || "/placeholder.svg"} alt={service.title} fill className="object-cover" />
              </div>
              <div>
                <h2 className="heading-secondary">Tentang {service.title}</h2>
                <div className="prose prose-lg max-w-none text-gray-600 mb-6">
                  {service.fullDescription.split("\n\n").map((paragraph, index) => (
                    <p key={index} className="mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
                <h3 className="text-xl font-semibold mb-4 text-primary">Fitur & Keunggulan</h3>
                <ul className="space-y-3">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-secondary mr-2 mt-1 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mb-16">
              <h2 className="heading-secondary text-center mb-8">Galeri {service.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {service.gallery.map((image, index) => (
                  <div key={index} className="relative h-64 rounded-lg overflow-hidden shadow-md">
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${service.title} ${index + 1}`}
                      fill
                      className="object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-16">
              <h2 className="heading-secondary text-center mb-8">Kalkulator Estimasi Biaya {service.title}</h2>
              <ServiceCalculator serviceType={service.slug} />
            </div>

            <div className="mb-16">
              <h2 className="heading-secondary text-center mb-8">Pertanyaan Umum</h2>
              <div className="max-w-3xl mx-auto">
                <Accordion type="single" collapsible className="w-full">
                  {service.faq.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">
                        <div className="flex items-start">
                          <HelpCircle className="h-5 w-5 text-primary mr-2 mt-1 flex-shrink-0" />
                          <span>{item.question}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600 pl-7">{item.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>

            <div className="mt-16 text-center">
              <h2 className="heading-secondary text-center mb-6">Tertarik dengan Layanan Kami?</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
                Konsultasikan kebutuhan Anda dengan tim kami untuk mendapatkan solusi terbaik dan penawaran harga yang
                kompetitif.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="btn-primary">Konsultasi Gratis</Button>
                <Link href="/#gallery">
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                    Lihat Portofolio
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer/>
    </>
  )
}