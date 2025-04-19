"use client"

import { useRef } from "react"
import Image from "next/image"
import { CheckCircle } from "lucide-react"
import { motion, useInView } from "framer-motion"

const timelineItems = [
  {
    year: "2010",
    title: "Awal Mula",
    description: "Cipta Mandiri Perkasa didirikan dengan visi menjadi perusahaan terdepan dalam pembuatan kubah masjid dan ornamen islami.",
  },
  {
    year: "2012",
    title: "Proyek Pertama",
    description: "Menyelesaikan proyek kubah masjid pertama di Jawa Tengah yang mendapatkan apresiasi dari masyarakat sekitar.",
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
    description: "Mulai menerima dan mengerjakan proyek-proyek di negara tetangga seperti Malaysia dan Brunei Darussalam.",
  },
  {
    year: "2023",
    title: "Pencapaian Baru",
    description: "Telah menyelesaikan lebih dari 500 proyek di seluruh Indonesia dan mulai menerima proyek internasional.",
  },
  {
    year: "2024",
    title: "Inovasi Berkelanjutan",
    description: "Mengembangkan material kubah yang lebih tahan lama dan ramah lingkungan sebagai komitmen terhadap keberlanjutan.",
  },
]

export default function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.2 })

  // Animation variants
  const animationVariants = {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.2,
        },
      },
    },
    item: {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" },
      },
    },
    fadeInUp: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    },
    fadeInLeft: {
      hidden: { opacity: 0, x: -30 },
      visible: { opacity: 1, x: 0 },
    },
    fadeInRight: {
      hidden: { opacity: 0, x: 30 },
      visible: { opacity: 1, x: 0 },
    },
    scaleIn: {
      hidden: { opacity: 0, scale: 0.9 },
      visible: { opacity: 1, scale: 1 },
    }
  }

  // Transition settings
  const transition = {
    duration: 0.8,
    ease: "easeOut"
  }

  return (
    <section id="about" className="section-padding bg-white" ref={ref}>
      <div className="container">
        {/* Header Section */}
        <motion.div
          className="text-center mb-8 md:mb-12"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={animationVariants.fadeInUp}
          transition={transition}
        >
          <h2 className="heading-primary">Tentang Kami</h2>
          <p className="max-w-3xl mx-auto text-base md:text-lg text-gray-600 px-4 md:px-0">
            Cipta Mandiri Perkasa adalah perusahaan spesialis dalam pembuatan kubah masjid dan ornamen islami dengan
            pengalaman lebih dari 10 tahun.
          </p>
        </motion.div>

        {/* Vision & Mission Section */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-12 md:mb-16 px-4 md:px-0">
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={animationVariants.fadeInLeft}
            transition={{ ...transition, delay: 0.2 }}
          >
            <h3 className="heading-secondary">Visi & Misi</h3>
            <div className="mb-4 md:mb-6">
              <h4 className="text-lg md:text-xl font-semibold mb-2 text-primary">Visi</h4>
              <p className="text-gray-600 text-sm md:text-base">
                Menjadi perusahaan terdepan dalam pembuatan kubah masjid dan ornamen islami yang berkualitas tinggi,
                inovatif, dan terpercaya di Indonesia.
              </p>
            </div>
            <div className="mb-4 md:mb-6">
              <h4 className="text-lg md:text-xl font-semibold mb-2 text-primary">Misi</h4>
              <motion.ul
                className="space-y-2 md:space-y-3"
                variants={animationVariants.container}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
              >
                {[
                  "Menghasilkan produk berkualitas tinggi dengan harga yang terjangkau",
                  "Memberikan pelayanan terbaik dan profesional kepada pelanggan",
                  "Berinovasi dalam desain dan teknologi produksi",
                  "Berkontribusi dalam pengembangan arsitektur islami di Indonesia",
                ].map((item, index) => (
                  <motion.li 
                    key={index} 
                    className="flex items-start" 
                    variants={animationVariants.item}
                  >
                    <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-secondary mr-2 mt-0.5 md:mt-1 flex-shrink-0" />
                    <span className="text-gray-600 text-sm md:text-base">{item}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </motion.div>
          
          <motion.div
            className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden shadow-md md:shadow-lg"
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={animationVariants.scaleIn}
            transition={{ ...transition, delay: 0.4 }}
          >
            <Image
              src="/about.webp?height=800&width=600"
              alt="Tim Cipta Mandiri Perkasa"
              fill
              className="object-cover"
              loading="lazy"
              priority={false}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
          </motion.div>
        </div>

        {/* Timeline Section - Fully Responsive */}
        <div className="px-4 md:px-0">
          <motion.h3
            className="heading-secondary text-center mb-8 md:mb-12 lg:mb-16"
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={animationVariants.fadeInUp}
            transition={{ ...transition, delay: 0.6 }}
          >
            Perjalanan Kami
          </motion.h3>
          
          <div className="relative max-w-5xl mx-auto">
            {/* Mobile Timeline (Stacked) */}
            <div className="md:hidden space-y-6">
              {timelineItems.map((item, index) => (
                <motion.div
                  key={index}
                  className="relative"
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  variants={animationVariants.fadeInUp}
                  transition={{ ...transition, delay: 0.1 + index * 0.1 }}
                >
                  <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-primary relative">
                    <div className="absolute -left-[15px] top-1/2 transform -translate-y-1/2 w-4 h-4 rounded-full bg-primary" />
                    <div className="text-secondary font-bold text-xs mb-1">{item.year}</div>
                    <h4 className="text-base font-semibold mb-1">{item.title}</h4>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Desktop Timeline (Alternating) */}
            <div className="hidden md:block">
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gray-200" />
              <div className="space-y-12 pt-8">
                {timelineItems.map((item, index) => {
                  const isEven = index % 2 === 0;
                  return (
                    <motion.div
                      key={index}
                      className={`relative flex ${isEven ? "justify-start" : "justify-end"}`}
                      initial="hidden"
                      animate={isInView ? "visible" : "hidden"}
                      variants={animationVariants.fadeInUp}
                      transition={{ ...transition, delay: 0.1 + index * 0.1 }}
                    >
                      <div className={`w-[45%] ${isEven ? "pr-8" : "pl-8"}`}>
                        <motion.div 
                          className={`bg-white p-5 md:p-6 rounded-lg md:rounded-xl shadow-sm md:shadow-md border-l-4 ${
                            isEven ? "border-primary" : "border-secondary"
                          } hover:shadow-md transition-all duration-300 relative`}
                          whileHover={{ y: -5 }}
                        >
                          <div className={`absolute -top-6 ${isEven ? "right-0" : "left-0"} text-secondary font-bold text-xs md:text-sm`}>
                            {item.year}
                          </div>
                          <div className={`absolute top-1/2 h-0.5 w-6 ${
                            isEven 
                              ? "right-0 translate-x-full bg-primary" 
                              : "left-0 -translate-x-full bg-secondary"
                          }`} />
                          <div className={`absolute top-1/2 w-3 h-3 rounded-full ${
                            isEven 
                              ? "right-0 translate-x-[calc(100%+18px)] bg-primary" 
                              : "left-0 -translate-x-[calc(100%+18px)] bg-secondary"
                          }`} />
                          <h4 className="text-base md:text-lg font-semibold mb-1 md:mb-2">{item.title}</h4>
                          <p className="text-gray-600 text-sm md:text-base">{item.description}</p>
                        </motion.div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}