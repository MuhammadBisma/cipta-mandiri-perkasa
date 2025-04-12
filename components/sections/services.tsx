import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { KubahIcon, MimbarIcon, MenaraIcon, KerawanganIcon, KaligrafiIcon, MasjidIcon, OrnamentIcon } from "@/components/icons"

const services = [
  {
    icon: <MasjidIcon className="h-10 w-10 text-primary" />,
    title: "Masjid",
    description:
      "Jasa pembangunan masjid lengkap dengan desain arsitektur islami yang indah dan fungsional, dari perencanaan hingga konstruksi.",
    image: "/masjid/masjid5.webp?height=300&width=400",
    slug: "masjid",
  },
  {
    icon: <KubahIcon className="h-10 w-10 text-primary" />,
    title: "Kubah Masjid",
    description:
      "Pembuatan kubah masjid dengan berbagai ukuran dan desain, menggunakan material berkualitas tinggi dan tahan lama.",
    image: "/kubah/kubah5.webp?height=300&width=400",
    slug: "kubah",
  },
  {
    icon: <MimbarIcon className="h-10 w-10 text-primary" />,
    title: "Mimbar Masjid",
    description:
      "Mimbar masjid dengan desain elegan dan ukiran yang indah, dibuat dari kayu pilihan dan dikerjakan oleh pengrajin berpengalaman.",
    image: "/mimbar/mimbar5.webp?height=300&width=400",
    slug: "mimbar",
  },
  {
    icon: <MenaraIcon className="h-10 w-10 text-primary" />,
    title: "Menara Masjid",
    description:
      "Menara masjid dengan berbagai model dan ketinggian, dirancang dengan memperhatikan aspek estetika dan keamanan.",
    image: "/menara/menara5.webp?height=300&width=400",
    slug: "menara",
  },
  {
    icon: <KerawanganIcon className="h-10 w-10 text-primary" />,
    title: "Kerawangan",
    description: "Kerawangan dengan motif islami yang indah, cocok untuk dekorasi interior dan eksterior masjid.",
    image: "/kerawangan/kerawangan5.webp?height=300&width=400",
    slug: "kerawangan",
  },
  {
    icon: <KaligrafiIcon className="h-10 w-10 text-primary" />,
    title: "Awan Kaligrafi",
    description:
      "Awan kaligrafi dengan tulisan ayat-ayat Al-Quran, dibuat dengan teknik khusus untuk menghasilkan karya yang indah dan bermakna.",
    image: "/kaligrafi/kaligrafi5.webp?height=300&width=400",
    slug: "kaligrafi",
  },
  {
    icon: <OrnamentIcon className="h-10 w-10 text-primary" />,
    title: "Ornamen Masjid",
    description:
      "Berbagai ornamen masjid berkualitas tinggi untuk memperindah tempat ibadah Anda.",
    image: "/ornamen/ornamen5.webp?height=300&width=400",
    slug: "ornamen",
  },
]

export default function Services() {
  return (
    <section id="services" className="section-padding bg-gray-50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="heading-primary">Layanan Kami</h2>
          <p className="max-w-3xl mx-auto text-lg text-gray-600">
            Kami menyediakan berbagai layanan pembuatan ornamen islami dengan kualitas terbaik dan harga terjangkau.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-2"
            >
              <div className="relative h-48">
                <Image src={service.image || "/placeholder.svg"} alt={service.title} fill className="object-cover" />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  {service.icon}
                  <h3 className="text-xl font-semibold">{service.title}</h3>
                </div>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <Link href={`/services/${service.slug}`}>
                  <Button variant="link" className="text-primary p-0 flex items-center">
                    Selengkapnya <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/services">
            <Button className="btn-primary rounded-xl">Lihat Semua Layanan</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
