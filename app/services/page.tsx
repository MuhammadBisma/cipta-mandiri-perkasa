import React from "react"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { KubahIcon, MimbarIcon, MenaraIcon, KerawanganIcon, KaligrafiIcon, MasjidIcon, OrnamentIcon } from "@/components/icons"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"


export const metadata: Metadata = {
  title: "Layanan - Cipta Mandiri Perkasa",
  description:
    "Layanan pembuatan kubah masjid, mimbar, menara, kerawangan, dan awan kaligrafi dengan kualitas terbaik.",
}

// Service data with slugs
export const services = [
  {
    slug: "masjid",
    icon: MasjidIcon,
    title: "Masjid",
    description:
      "Jasa pembangunan masjid lengkap dengan desain arsitektur islami yang indah dan fungsional, dari perencanaan hingga konstruksi.",
    image: "/masjid/masjid1.webp?height=300&width=400",
    fullDescription: `
      Cipta Mandiri Perkasa menyediakan layanan pembangunan masjid secara lengkap, mulai dari konsultasi awal, perencanaan, desain, hingga konstruksi. Kami memahami bahwa masjid bukan hanya tempat ibadah, tetapi juga pusat kegiatan sosial dan pendidikan bagi masyarakat muslim.

      Tim arsitek dan insinyur kami berpengalaman dalam merancang masjid dengan memperhatikan aspek fungsional, estetika, dan nilai-nilai islami. Kami juga memastikan bahwa setiap masjid yang kami bangun memenuhi standar keamanan dan kenyamanan bagi jamaah.

      Kami menawarkan berbagai pilihan desain masjid, dari gaya tradisional hingga modern, yang dapat disesuaikan dengan kebutuhan dan anggaran Anda. Setiap proyek masjid yang kami kerjakan selalu memperhatikan detail ornamen islami yang menjadi ciri khas Cipta Mandiri Perkasa.
    `,
    features: [
      "Konsultasi dan perencanaan komprehensif",
      "Desain arsitektur islami yang indah dan fungsional",
      "Konstruksi berkualitas dengan material terbaik",
      "Ornamen islami yang detail dan autentik",
      "Manajemen proyek profesional",
      "Garansi struktur bangunan",
    ],
    gallery: [
      "/masjid/masjid2.webp?height=600&width=800",
      "/masjid/masjid3.webp?height=600&width=800",
      "/masjid/masjid4.webp?height=600&width=800",
    ],
    faq: [
      {
        question: "Berapa lama waktu yang dibutuhkan untuk membangun sebuah masjid?",
        answer:
          "Waktu pembangunan masjid bervariasi tergantung pada ukuran dan kompleksitas desain. Untuk masjid ukuran sedang, biasanya membutuhkan waktu 8-12 bulan dari perencanaan hingga selesai konstruksi.",
      },
      {
        question: "Apakah Cipta Mandiri Perkasa menyediakan layanan renovasi masjid?",
        answer:
          "Ya, kami juga menyediakan layanan renovasi masjid, baik renovasi total maupun parsial seperti penggantian kubah, mimbar, atau ornamen lainnya.",
      },
      {
        question: "Bagaimana proses pembangunan masjid dilakukan?",
        answer:
          "Proses dimulai dengan konsultasi awal untuk memahami kebutuhan Anda, dilanjutkan dengan perencanaan dan desain, pengurusan izin, konstruksi, finishing, dan terakhir serah terima bangunan.",
      },
    ],
  },
  {
    slug: "kubah",
    icon: KubahIcon,
    title: "Kubah Masjid",
    description:
      "Pembuatan kubah masjid dengan berbagai ukuran dan desain, menggunakan material berkualitas tinggi dan tahan lama.",
    image: "/kubah/kubah1.webp?height=300&width=400",
    fullDescription: `
      Kubah masjid adalah salah satu elemen arsitektur yang paling ikonik dalam bangunan masjid. Cipta Mandiri Perkasa menyediakan layanan pembuatan kubah masjid dengan berbagai ukuran dan desain, menggunakan material berkualitas tinggi seperti enamel, stainless steel, dan titanium gold.
      
      Kubah masjid kami dirancang dengan memperhatikan aspek estetika, ketahanan, dan kemudahan pemasangan. Setiap kubah dibuat dengan presisi tinggi untuk memastikan kualitas dan keindahan yang maksimal. Proses produksi menggunakan teknologi modern yang dikombinasikan dengan keahlian pengrajin berpengalaman.
      
      Kami juga menawarkan layanan konsultasi untuk membantu Anda memilih desain dan material yang sesuai dengan kebutuhan dan anggaran Anda. Tim kami akan memberikan rekomendasi terbaik berdasarkan lokasi, iklim, dan gaya arsitektur masjid Anda.
    `,
    features: [
      "Berbagai pilihan material: enamel, stainless steel, titanium gold",
      "Desain kustom sesuai permintaan",
      "Tahan karat dan cuaca ekstrem",
      "Garansi hingga 10 tahun",
      "Pemasangan cepat dan profesional",
      "Perawatan dan pemeliharaan berkala",
    ],
    gallery: [
      "/kubah/kubah2.webp?height=600&width=800",
      "/kubah/kubah3.webp?height=600&width=800",
      "/kubah/kubah4.webp?height=600&width=800",
    ],
    faq: [
      {
        question: "Berapa lama waktu produksi kubah masjid?",
        answer:
          "Waktu produksi kubah masjid bervariasi tergantung pada ukuran dan kompleksitas desain. Untuk kubah ukuran sedang, biasanya membutuhkan waktu 2-4 minggu untuk produksi dan 1-2 hari untuk pemasangan.",
      },
      {
        question: "Apakah kubah masjid tahan terhadap cuaca ekstrem?",
        answer:
          "Ya, kubah masjid kami dirancang untuk tahan terhadap cuaca ekstrem seperti hujan deras, panas terik, dan angin kencang. Material yang kami gunakan juga tahan karat dan memiliki daya tahan yang tinggi.",
      },
      {
        question: "Bagaimana cara merawat kubah masjid agar tetap indah?",
        answer:
          "Untuk merawat kubah masjid, cukup bersihkan secara berkala dengan air bersih dan lap kering. Hindari penggunaan bahan kimia keras yang dapat merusak lapisan kubah. Kami juga menawarkan layanan perawatan berkala untuk memastikan kubah tetap dalam kondisi prima.",
      },
    ],
  },
  {
    slug: "mimbar",
    icon: MimbarIcon,
    title: "Mimbar Masjid",
    description:
      "Mimbar masjid dengan desain elegan dan ukiran yang indah, dibuat dari kayu pilihan dan dikerjakan oleh pengrajin berpengalaman.",
    image: "/mimbar/mimbar1.webp?height=300&width=400",
    fullDescription: `
      Mimbar masjid adalah tempat khatib menyampaikan khutbah kepada jamaah. Cipta Mandiri Perkasa menyediakan layanan pembuatan mimbar masjid dengan desain elegan dan ukiran yang indah, dibuat dari kayu pilihan seperti jati, mahoni, dan sonokeling.
      
      Setiap mimbar masjid kami dikerjakan oleh pengrajin berpengalaman dengan teknik ukir tradisional yang dipadukan dengan teknologi modern. Proses pengerjaan dilakukan dengan teliti untuk memastikan kualitas dan keindahan yang maksimal.
      
      Kami menawarkan berbagai pilihan desain mimbar, dari klasik hingga kontemporer, yang dapat disesuaikan dengan gaya arsitektur masjid Anda. Setiap detail ukiran dirancang dengan memperhatikan nilai-nilai estetika dan simbolisme islami.
    `,
    features: [
      "Berbagai pilihan kayu: jati, mahoni, sonokeling",
      "Ukiran kustom dengan motif islami",
      "Finishing berkualitas tinggi",
      "Konstruksi kokoh dan tahan lama",
      "Desain ergonomis untuk kenyamanan khatib",
      "Perawatan mudah dan tahan rayap",
    ],
    gallery: [
      "/mimbar/mimbar2.webp?height=600&width=800",
      "/mimbar/mimbar3.webp?height=600&width=800",
      "/mimbar/mimbar4.webp?height=600&width=800",
    ],
    faq: [
      {
        question: "Berapa lama waktu pembuatan mimbar masjid?",
        answer:
          "Waktu pembuatan mimbar masjid bervariasi tergantung pada kompleksitas desain dan ukiran. Untuk mimbar dengan ukiran sedang, biasanya membutuhkan waktu 3-4 minggu.",
      },
      {
        question: "Apakah mimbar masjid bisa dibuat sesuai dengan desain khusus?",
        answer:
          "Ya, kami menerima pesanan mimbar masjid dengan desain khusus sesuai keinginan Anda. Tim desainer kami akan membantu mewujudkan konsep mimbar yang Anda inginkan.",
      },
      {
        question: "Bagaimana cara merawat mimbar masjid agar tetap awet?",
        answer:
          "Untuk merawat mimbar masjid, bersihkan debu secara rutin dengan kain lembut dan hindari terkena air berlebih. Aplikasikan minyak kayu atau politur secara berkala untuk menjaga keindahan dan ketahanan kayu.",
      },
    ],
  },
  {
    slug: "menara",
    icon: MenaraIcon,
    title: "Menara Masjid",
    description:
      "Menara masjid dengan berbagai model dan ketinggian, dirancang dengan memperhatikan aspek estetika dan keamanan.",
    image: "/menara/menara1.webp?height=300&width=400",
    fullDescription: `
      Menara masjid atau minaret adalah struktur tinggi yang biasanya menjadi bagian dari masjid. Cipta Mandiri Perkasa menyediakan layanan pembuatan menara masjid dengan berbagai model dan ketinggian, dirancang dengan memperhatikan aspek estetika dan keamanan.
      
      Menara masjid kami dibuat dengan struktur yang kokoh dan tahan gempa, menggunakan material berkualitas tinggi seperti beton bertulang, baja, atau komposit. Setiap menara dilengkapi dengan sistem penangkal petir untuk keamanan maksimal.
      
      Kami menawarkan berbagai pilihan desain menara, dari gaya klasik Timur Tengah hingga desain modern kontemporer. Tim arsitek kami akan membantu Anda memilih desain yang sesuai dengan arsitektur masjid dan lingkungan sekitarnya.
    `,
    features: [
      "Struktur kokoh dan tahan gempa",
      "Sistem penangkal petir terintegrasi",
      "Berbagai pilihan desain: klasik, modern, kontemporer",
      "Material berkualitas tinggi",
      "Perhitungan struktur oleh ahli berpengalaman",
      "Perawatan dan pemeliharaan berkala",
    ],
    gallery: [
      "/menara/menara2.webp?height=600&width=800",
      "/menara/menara3.webp?height=600&width=800",
      "/menara/menara4.webp?height=600&width=800",
    ],
    faq: [
      {
        question: "Berapa tinggi maksimal menara masjid yang bisa dibuat?",
        answer:
          "Tinggi maksimal menara masjid yang kami buat bervariasi tergantung pada kondisi tanah, peraturan daerah, dan anggaran. Secara umum, kami dapat membangun menara dengan ketinggian hingga 30-40 meter.",
      },
      {
        question: "Apakah menara masjid aman dari bahaya petir?",
        answer:
          "Ya, setiap menara masjid yang kami bangun dilengkapi dengan sistem penangkal petir yang terintegrasi untuk memastikan keamanan struktur dan jamaah masjid.",
      },
      {
        question: "Berapa lama waktu pembangunan menara masjid?",
        answer:
          "Waktu pembangunan menara masjid bervariasi tergantung pada ketinggian dan kompleksitas desain. Untuk menara dengan ketinggian sedang (15-20 meter), biasanya membutuhkan waktu 2-3 bulan dari perencanaan hingga selesai konstruksi.",
      },
    ],
  },
  {
    slug: "kerawangan",
    icon: KerawanganIcon,
    title: "Kerawangan",
    description: "Kerawangan dengan motif islami yang indah, cocok untuk dekorasi interior dan eksterior masjid.",
    image: "/kerawangan/kerawangan1.webp?height=300&width=400",
    fullDescription: `
      Kerawangan adalah ornamen berlubang dengan motif islami yang biasa digunakan sebagai dekorasi masjid. Cipta Mandiri Perkasa menyediakan layanan pembuatan kerawangan dengan berbagai motif dan material, cocok untuk dekorasi interior dan eksterior masjid.
      
      Kerawangan kami dibuat dengan teknik presisi tinggi menggunakan teknologi CNC (Computer Numerical Control) untuk menghasilkan detail yang indah dan rapi. Setiap kerawangan dirancang dengan memperhatikan nilai estetika dan simbolisme islami.
      
      Kami menawarkan berbagai pilihan material untuk kerawangan, seperti GRC (Glassfiber Reinforced Concrete), aluminium, dan kuningan. Setiap material memiliki karakteristik dan keunggulan tersendiri, yang dapat disesuaikan dengan kebutuhan dan anggaran Anda.
    `,
    features: [
      "Berbagai pilihan material: GRC, aluminium, kuningan",
      "Motif geometris dan kaligrafi islami",
      "Presisi tinggi dengan teknologi CNC",
      "Tahan lama dan mudah dibersihkan",
      "Pemasangan profesional",
      "Desain kustom sesuai permintaan",
    ],
    gallery: [
      "/kerawangan/kerawangan2.webp?height=600&width=800",
      "/kerawangan/kerawangan3.webp?height=600&width=800",
      "/kerawangan/kerawangan4.webp?height=600&width=800",
    ],
    faq: [
      {
        question: "Apa perbedaan material GRC, aluminium, dan kuningan untuk kerawangan?",
        answer:
          "GRC lebih ekonomis dan cocok untuk area interior, aluminium ringan dan tahan karat sehingga cocok untuk eksterior, sedangkan kuningan memberikan tampilan mewah dengan warna keemasan namun memerlukan perawatan lebih intensif.",
      },
      {
        question: "Apakah kerawangan bisa dibuat dengan motif kustom?",
        answer:
          "Ya, kami menerima pesanan kerawangan dengan motif kustom sesuai keinginan Anda. Tim desainer kami akan membantu mewujudkan konsep motif yang Anda inginkan.",
      },
      {
        question: "Bagaimana cara merawat kerawangan agar tetap indah?",
        answer:
          "Untuk merawat kerawangan, bersihkan debu secara rutin dengan kuas lembut atau vacuum cleaner. Untuk kerawangan eksterior, bersihkan dengan air bersih secara berkala untuk menghilangkan kotoran dan debu.",
      },
    ],
  },
  {
    slug: "ornamen", 
    icon: OrnamentIcon,
    title: "Ornamen Masjid",
    description: "Berbagai ornamen masjid berkualitas tinggi untuk memperindah tempat ibadah Anda.",
    image: "/ornamen/ornamen1.webp?height=300&width=400",
    fullDescription: `
      Ornamen masjid adalah elemen dekoratif yang memperindah bangunan masjid. Cipta Mandiri Perkasa menyediakan berbagai ornamen masjid berkualitas tinggi, dibuat dengan teknik khusus untuk menghasilkan karya yang indah dan bermakna.
      
      Ornamen masjid kami dikerjakan oleh ahli berpengalaman dengan teknik tradisional yang dipadukan dengan teknologi modern. Setiap karya dirancang dengan memperhatikan nilai estetika dan simbolisme islami.
      
      Kami menawarkan berbagai pilihan material untuk ornamen masjid seperti kuningan, aluminium, dan kayu ukir. Setiap material memberikan karakter berbeda yang dapat disesuaikan dengan kebutuhan masjid Anda.
    `,
    features: [
      "Berbagai motif ornamen islami",
      "Material pilihan: kuningan, aluminium, kayu ukir",
      "Pengerjaan presisi dengan detail tinggi",
      "Finishing tahan lama dan anti karat",
      "Desain kustom sesuai permintaan",
      "Pemasangan profesional",
    ],
    gallery: [
      "/ornamen/ornamen2.webp?height=600&width=800",
      "/ornamen/ornamen3.webp?height=600&width=800",
      "/ornamen/ornamen4.webp?height=600&width=800",
    ],
    faq: [
      {
        question: "Apa saja jenis ornamen masjid yang tersedia?",
        answer: "Kami menyediakan berbagai ornamen seperti kaligrafi, mihrab, lampu hias, dan dekorasi geometris islami."
      },
      {
        question: "Berapa lama proses pembuatan ornamen masjid?",
        answer: "Waktu pengerjaan bervariasi tergantung kompleksitas, biasanya 2-4 minggu untuk ornamen standar."
      },
      {
        question: "Apakah bisa dipasang di masjid yang sudah berdiri?",
        answer: "Ya, tim kami akan menyesuaikan metode pemasangan dengan struktur bangunan yang ada."
      }
    ]
  },
  {
    slug: "kaligrafi",
    icon: KaligrafiIcon,
    title: "Awan Kaligrafi",
    description:
      "Awan kaligrafi dengan tulisan ayat-ayat Al-Quran, dibuat dengan teknik khusus untuk menghasilkan karya yang indah dan bermakna.",
    image: "/kaligrafi/kaligrafi1.webp?height=300&width=400",
    fullDescription: `
      Awan kaligrafi adalah ornamen berbentuk awan yang berisi tulisan kaligrafi ayat-ayat Al-Quran. Cipta Mandiri Perkasa menyediakan layanan pembuatan awan kaligrafi dengan berbagai desain dan ukuran, dibuat dengan teknik khusus untuk menghasilkan karya yang indah dan bermakna.
      
      Awan kaligrafi kami dikerjakan oleh kaligrafer berpengalaman dengan teknik tradisional yang dipadukan dengan teknologi modern. Setiap karya dirancang dengan memperhatikan keindahan tulisan dan makna ayat yang dipilih.
      
      Kami menawarkan berbagai pilihan material untuk awan kaligrafi, seperti kuningan, aluminium, dan akrilik. Setiap material memberikan kesan dan tampilan yang berbeda, yang dapat disesuaikan dengan interior masjid Anda.
    `,
    features: [
      "Kaligrafi ayat-ayat Al-Quran pilihan",
      "Berbagai gaya khat: Tsuluts, Naskhi, Diwani, Kufi",
      "Material berkualitas: kuningan, aluminium, akrilik",
      "Finishing dengan lapisan anti karat",
      "Desain kustom sesuai permintaan",
      "Pemasangan profesional",
    ],
    gallery: [
      "/kaligrafi/kaligrafi2.webp?height=600&width=800",
      "/kaligrafi/kaligrafi3.webp?height=600&width=800",
      "/kaligrafi/kaligrafi4.webp?height=600&width=800",
    ],
    faq: [
      {
        question: "Ayat Al-Quran apa saja yang biasa digunakan untuk awan kaligrafi?",
        answer:
          "Ayat-ayat yang sering digunakan antara lain Ayat Kursi, Asmaul Husna, Surat Al-Fatihah, dan ayat-ayat pilihan lainnya. Anda juga bisa memilih ayat tertentu sesuai keinginan.",
      },
      {
        question: "Berapa ukuran awan kaligrafi yang tersedia?",
        answer:
          "Kami menyediakan awan kaligrafi dengan berbagai ukuran, mulai dari 1 meter hingga 10 meter, tergantung pada kebutuhan dan ruang yang tersedia di masjid Anda.",
      },
      {
        question: "Apakah awan kaligrafi bisa dipasang di luar ruangan?",
        answer:
          "Ya, untuk pemasangan di luar ruangan, kami merekomendasikan penggunaan material aluminium atau kuningan dengan lapisan pelindung khusus untuk mencegah kerusakan akibat cuaca.",
      },
    ],
  },
]

export default function ServicesPage() {
  return (
    <>
    <Navbar/>
    <main className="pt-24">
      <section className="py-12 md:py-16 bg-primary text-white">
        <div className="container">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Layanan Kami</h1>
          <p className="text-lg text-white/80 max-w-3xl">
            Kami menyediakan berbagai layanan pembuatan ornamen islami dengan kualitas terbaik dan harga terjangkau.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.slug}
                className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-2"
              >
                <div className="relative h-48">
                <Image
                  src={service.image || "/placeholder.svg"} 
                  alt={service.title} 
                  fill
                  className="object-cover"
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL="data:image/svg+xml;base64,..."
                />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    {React.createElement(service.icon, { className: "h-10 w-10 text-primary" })}
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
        </div>
      </section>
    </main>
    <Footer/>
    </>
  )
}
