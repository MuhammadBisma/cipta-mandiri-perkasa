"use client"

import { useRef } from "react"
import Image from "next/image"
import { CheckCircle } from "lucide-react"
import { motion, useInView } from "framer-motion"

const timelineItems = [
  {
    year: "2010",
    title: "Awal Mula",
    description:
      "Cipta Mandiri Perkasa didirikan dengan visi menjadi perusahaan terdepan dalam pembuatan kubah masjid dan ornamen islami.",
  },
  {
    year: "2012",
    title: "Proyek Pertama",
    description:
      "Menyelesaikan proyek kubah masjid pertama di Jawa Tengah yang mendapatkan apresiasi dari masyarakat sekitar.",
  },
  {
    year: "2015",
    title: "Ekspansi Bisnis",
    description: "Memperluas layanan dengan menambahkan pembuatan mimbar, menara, dan kerawangan.",
  },
  {
    year: "2016",
    title: "Pembukaan Workshop Baru",
    description: "Membuka workshop produksi yang lebih besar untuk mengakomodasi peningkatan permintaan pasar.",
  },
  {
    year: "2018",
    title: "Inovasi Teknologi",
    description: "Mengadopsi teknologi modern dalam proses produksi untuk meningkatkan kualitas dan efisiensi.",
  },
  {
    year: "2020",
    title: "Pencapaian 300 Proyek",
    description: "Berhasil menyelesaikan lebih dari 300 proyek kubah masjid di seluruh Indonesia.",
  },
  {
    year: "2022",
    title: "Ekspansi Regional",
    description:
      "Mulai menerima dan mengerjakan proyek-proyek di negara tetangga seperti Malaysia dan Brunei Darussalam.",
  },
  {
    year: "2023",
    title: "Pencapaian Baru",
    description:
      "Telah menyelesaikan lebih dari 500 proyek di seluruh Indonesia dan mulai menerima proyek internasional.",
  },
  {
    year: "2024",
    title: "Inovasi Berkelanjutan",
    description:
      "Mengembangkan material kubah yang lebih tahan lama dan ramah lingkungan sebagai komitmen terhadap keberlanjutan.",
  },
]

export default function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.2 })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  return (
    <section id="about" className="section-padding bg-white" ref={ref}>
      <div className="container">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="heading-primary">Tentang Kami</h2>
          <p className="max-w-3xl mx-auto text-lg text-gray-600">
            Cipta Mandiri Perkasa adalah perusahaan spesialis dalam pembuatan kubah masjid dan ornamen islami dengan
            pengalaman lebih dari 10 tahun.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="heading-secondary">Visi & Misi</h3>
            <div className="mb-6">
              <h4 className="text-xl font-semibold mb-2 text-primary">Visi</h4>
              <p className="text-gray-600">
                Menjadi perusahaan terdepan dalam pembuatan kubah masjid dan ornamen islami yang berkualitas tinggi,
                inovatif, dan terpercaya di Indonesia.
              </p>
            </div>
            <div className="mb-6">
              <h4 className="text-xl font-semibold mb-2 text-primary">Misi</h4>
              <motion.ul
                className="space-y-3"
                variants={containerVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
              >
                {[
                  "Menghasilkan produk berkualitas tinggi dengan harga yang terjangkau",
                  "Memberikan pelayanan terbaik dan profesional kepada pelanggan",
                  "Berinovasi dalam desain dan teknologi produksi",
                  "Berkontribusi dalam pengembangan arsitektur islami di Indonesia",
                ].map((item, index) => (
                  <motion.li key={index} className="flex items-start" variants={itemVariants}>
                    <CheckCircle className="h-5 w-5 text-secondary mr-2 mt-1 flex-shrink-0" />
                    <span className="text-gray-600">{item}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </motion.div>
          <motion.div
            className="relative h-[400px] rounded-lg overflow-hidden shadow-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Image
              src="/about.webp?height=800&width=600"
              alt="Tim Cipta Mandiri Perkasa"
              fill
              className="object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          </motion.div>
        </div>

        <div>
          <motion.h3
            className="heading-secondary text-center mb-8"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Perjalanan Kami
          </motion.h3>
          <div className="relative">
            {/* Timeline Line - Continuous vertical line connecting all items */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-primary via-secondary to-primary"></div>

            {/* Timeline Items */}
            <div className="space-y-12">
            {timelineItems.map((item, index) => (
              <motion.div
                key={index}
                className={`relative flex items-center ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              >
                <div className={`flex-1 ${index % 2 === 0 ? "md:pr-12" : "md:pl-12"} ${index % 2 !== 0 ? "md:pr-12" : "md:pl-12"} pl-12`}>
                  <div
                    className={`bg-white p-6 rounded-lg shadow-md border-l-4 ${
                      index % 2 === 0 ? "md:text-right border-primary" : "border-secondary"
                    } hover:shadow-lg transition-shadow duration-300 relative`}
                  >
                    {/* Connecting line from card to timeline */}
                    <div
                      className={`absolute top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r ${
                        index % 2 === 0
                          ? "right-0 translate-x-full from-primary to-transparent md:w-12"
                          : "left-0 -translate-x-full from-transparent to-secondary md:w-12"
                      } hidden md:block`}
                    ></div>

                    <span className="text-secondary font-bold">{item.year}</span>
                    <h4 className="text-xl font-semibold mb-2">{item.title}</h4>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>

                {/* Timeline Dot with connecting lines */}
                <motion.div
                  className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 -translate-y-1/2 top-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center shadow-md z-10"
                  whileHover={{ scale: 1.2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="w-4 h-4 rounded-full bg-white"></div>
                </motion.div>

                <div className="flex-1 hidden md:block"></div>
              </motion.div>
            ))}
          </div>
          </div>
        </div>
      </div>
    </section>
  )
}
