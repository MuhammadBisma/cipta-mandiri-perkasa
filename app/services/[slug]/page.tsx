// app/services/[slug]/page.tsx
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowLeft, HelpCircle } from "lucide-react"
import { services } from "../page"
import ServiceCalculator, { type ServiceType } from "@/components/sections/service-calculator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import Breadcrumbs from "@/components/seo/breadcrumbs"
import StructuredData from "@/components/seo/structured-data"
import FAQSchema from "@/components/seo/faq-schema"
import ServiceSchema from "@/components/seo/service-schema"
import CanonicalUrl from "@/components/seo/canonical-url"

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params
  const service = services.find((service) => service.slug === resolvedParams.slug)

  if (!service) {
    return {
      title: "Layanan Tidak Ditemukan - Cipta Mandiri Perkasa",
    }
  }

  return {
    title: `${service.title} - Cipta Mandiri Perkasa`,
    description: service.description,
    keywords: [
      `${service.title}`,
      `${service.title} masjid`,
      `${service.title} islami`,
      `${service.title} murah`,
      `${service.title} berkualitas`,
      `jasa pembuatan ${service.title}`,
      `harga ${service.title}`,
      `desain ${service.title}`,
      `model ${service.title}`,
      `${service.title} modern`,
      `${service.title} klasik`,
      `${service.title} minimalis`,
      `${service.title} GRC`,
    ],
    openGraph: {
      title: `${service.title} - Cipta Mandiri Perkasa`,
      description: service.description,
      url: `https://kubahcmp.id/services/${service.slug}`,
      images: [
        {
          url: service.image,
          width: 1200,
          height: 630,
          alt: service.title,
        },
      ],
      type: "website",
    },
    alternates: {
      canonical: `https://kubahcmp.id/services/${service.slug}`,
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
  const validServiceTypes: ServiceType[] = ["masjid", "kubah", "mimbar", "menara", "kerawangan", "kaligrafi", "ornamen"]
  return validServiceTypes.includes(slug as ServiceType)
}

export default async function ServicePage({ params }: Props) {
  const resolvedParams = await params
  const service = services.find((service) => service.slug === resolvedParams.slug)

  if (!service || !isValidServiceType(service.slug)) {
    notFound()
  }

  return (
    <>
      <Navbar />
      <CanonicalUrl path={`/services/${service?.slug}`} />
      <StructuredData
        type="Service"
        title={`${service.title} - Cipta Mandiri Perkasa`}
        description={service.description}
        imageUrl={service.image}
      />
      <ServiceSchema
        name={service.title}
        description={service.description}
        url={`https://kubahcmp.id/services/${service.slug}`}
        imageUrl={service.image}
      />
      <FAQSchema faqs={service.faq} />

      <main className="pt-24">
        <section className="py-12 md:py-16 bg-primary text-white">
          <div className="container">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <Breadcrumbs
                  customItems={[
                    { label: "Layanan", href: "/services" },
                    { label: service.title, href: `/services/${service.slug}` },
                  ]}
                  className="mb-4 text-white/80"
                />
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{service.title}</h1>
                <p className="text-lg text-white/80 max-w-3xl">{service.description}</p>
              </div>
              <Link href="/services">
                <Button
                  variant="outline"
                  className="rounded-xl bg-white text-primary hover:bg-white/90 hover:text-primary/90 transition-colors"
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
                <Image
                  src={service.image || "/placeholder.svg"}
                  alt={service.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
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
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
                <Link href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer">
                  <Button className="bg-green-600 hover:bg-green-700 rounded-[12px] px-6 py-3 text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 sm:h-5 sm:w-5 mr-2"
                      viewBox="0 0 32 32"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M16 0C7.2 0 0 6.9 0 15.3c0 2.7.7 5.3 2.1 7.5L0 32l9.4-2.4c2 .5 4 .8 6.1.8 8.8 0 16-6.9 16-15.3S24.8 0 16 0zm0 28.4c-1.8 0-3.5-.3-5.1-.8l-.4-.1-5.6 1.4 1.5-5.3-.3-.4c-1.3-1.9-2-4.2-2-6.6 0-6.6 5.6-11.9 12.5-11.9s12.5 5.3 12.5 11.9-5.6 11.9-12.5 11.9zm6.8-8.8c-.4-.2-2.5-1.2-2.9-1.3-.4-.2-.6-.2-.8.2-.2.4-.9 1.3-1.1 1.5-.2.2-.4.2-.8 0-.4-.2-1.5-.5-2.9-1.7-1.1-.9-1.8-2-2-2.3-.2-.3 0-.5.1-.7.1-.1.3-.4.5-.6.1-.2.1-.4.2-.6 0-.2 0-.5-.1-.7-.2-.2-.8-1.9-1.1-2.6-.3-.7-.6-.6-.8-.6-.2 0-.4 0-.6 0s-.6.1-.9.4c-.3.3-1.2 1.1-1.2 2.6s1.3 3 1.5 3.2c.2.2 2.5 3.9 6 5.4.8.3 1.5.5 2 .6.8.2 1.6.2 2.2.1.7-.1 2.5-1 2.9-2 .4-1 .4-1.8.3-2 0-.2-.3-.3-.7-.5z" />
                    </svg>
                    <span>Konsultasi Gratis via WA</span>
                  </Button>
                </Link>
                <Link href="/gallery">
                  <Button
                    variant="outline"
                    className="border-primary bg-primary text-white hover:bg-blue hover:text-white rounded-[12px]"
                  >
                    Lihat Portofolio
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
