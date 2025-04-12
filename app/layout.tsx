import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import PageViewTracker from "@/components/analytics/page-view-tracker"
import FloatingContactButton from "@/components/floating-contact-button"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    template: "%s | Cipta Mandiri Perkasa",
    default: "Cipta Mandiri Perkasa - Spesialis Kubah Masjid & Ornamen Islami",
  },
  description:
    "Cipta Mandiri Perkasa adalah perusahaan spesialis pembuatan kubah masjid, mimbar, menara, kerawangan, dan awan kaligrafi dengan kualitas terbaik dan harga terjangkau.",
  keywords: ["kubah masjid", "mimbar masjid", "menara masjid", "kerawangan", "awan kaligrafi", "ornamen islami"],
  authors: [{ name: "Cipta Mandiri Perkasa" }],
  creator: "Cipta Mandiri Perkasa",
  publisher: "Cipta Mandiri Perkasa",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        {/* 🔹 Favicon */}
        <link rel="icon" href="/icons/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />

        {/* 🔹 JSON-LD untuk SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Cipta Mandiri Perkasa",
              url: "https://ciptamandiriperkasa.com",
              logo: "https://ciptamandiriperkasa.com/images/logo.png",
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+6281234567890",
                contactType: "customer service",
              },
            }),
          }}
        />
      </head>

      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
          <PageViewTracker />
          <FloatingContactButton />
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'