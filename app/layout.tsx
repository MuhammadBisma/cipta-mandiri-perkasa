import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Script from "next/script"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import PageViewTracker from "@/components/analytics/page-view-tracker"
import FloatingContactButton from "@/components/floating-contact-button"
import { Suspense } from "react"
import StructuredData from "@/components/seo/structured-data"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL("https://kubahcmp.id"),
  title: {
    template: "%s | Cipta Mandiri Perkasa",
    default: "Spesialis GRC Kubah Masjid & Ornamen Islami",
  },
  description:
    "Cipta Mandiri Perkasa adalah spesialis kubah masjid, masjid, mimbar, menara, kerawangan, dan kaligrafi dengan kualitas terbaik dan harga terjangkau.",
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
  openGraph: {
    title: "Spesialis GRC Kubah Masjid & Ornamen Islami",
    description: "Cipta Mandiri Perkasa adalah spesialis kubah masjid, masjid, mimbar, menara, kerawangan, dan kaligrafi dengan kualitas terbaik dan harga terjangkau.",
    url: "https://kubahcmp.id",
    siteName: "Cipta Mandiri Perkasa",
    images: [
      {
        url: "https://kubahcmp.id/images/og-image.jpg", 
        width: 1200,
        height: 630,
        alt: "Cipta Mandiri Perkasa",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Spesialis GRC Kubah Masjid & Ornamen Islami",
    description: "Cipta Mandiri Perkasa adalah spesialis kubah masjid, mimbar, menara, kerawangan, dan kaligrafi.",
    images: ["https://kubahcmp.id/images/og-image.jpg"],
  },
  
  authors: [{ name: "Cipta Mandiri Perkasa" }],
  creator: "Cipta Mandiri Perkasa",
  publisher: "Cipta Mandiri Perkasa",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  generator: "v0.dev",
  alternates: {
    canonical: "https://kubahcmp.id",
    languages: {
      "id-ID": "https://kubahcmp.id",
      "en-US": "https://kubahcmp.id/en",
    },
  },
  verification: {
    google: "google-site-verification-code",
    yandex: "yandex-verification-code",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icons/favicon.ico?v=2" sizes="any" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png?v=2" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png?v=2" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png?v=2" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="facebook-domain-verification" content="your-facebook-verification-code" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Cipta Mandiri Perkasa",
              url: "https://kubahcmp.id",
              logo: "https://kubahcmp.id/images/logo.png?v=2",
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+6281386225702",
                contactType: "customer service",
              },
            }),
          }}
        />
      </head>
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-34K32M7LQ3" strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-34K32M7LQ3', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
      {/* Facebook Pixel Code */}
      <Script id="facebook-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', 'your-pixel-id-here');
          fbq('track', 'PageView');
        `}
      </Script>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
          <Suspense fallback={null}>
            <PageViewTracker />
          </Suspense>
          <FloatingContactButton />
          <StructuredData
            type="LocalBusiness"
            title="Cipta Mandiri Perkasa"
            description="Spesialis pembuatan kubah masjid, mimbar, menara, kerawangan, dan ornamen islami dengan kualitas terbaik."
          />
        </ThemeProvider>
      </body>
    </html>
  )
}

import "./globals.css"

import "./globals.css"