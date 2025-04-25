import type { ReactNode } from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Script from "next/script"
import { Suspense } from "react"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import PageViewTracker from "@/components/analytics/page-view-tracker"
import FloatingContactButton from "@/components/floating-contact-button"
import StructuredData from "@/components/seo/structured-data"
import ErrorBoundary from "@/components/error-boundary"
import LoadingIndicator from "@/components/loading-indicator"
import "@/lib/init-cron"

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
  adjustFontFallback: false,
  preload: true 
})

export const metadata: Metadata = {
  metadataBase: new URL("https://kubahcmp.id"),
  title: {
    template: "%s | Cipta Mandiri Perkasa",
    default: "Spesialis GRC Kubah Masjid & Ornamen Islami",
  },
  description: "Cipta Mandiri Perkasa adalah spesialis kubah masjid, masjid, mimbar, menara, kerawangan, dan kaligrafi dengan kualitas terbaik dan harga terjangkau.",
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
    description: "Cipta Mandiri Perkasa adalah spesialis pembuatan kubah masjid, masjid, mimbar, menara, kerawangan, dan kaligrafi dengan kualitas terbaik dan harga terjangkau.",
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
  generator: "Next.js",
  alternates: {
    canonical: "https://kubahcmp.id",
    languages: {
      "id-ID": "https://kubahcmp.id",
    },
  },
  verification: {
    google: "OF64XOunM58TdYUSGjWdl5U_v9zv7qhMPZgW-P-rApk",
    yandex: "yandex-verification-code",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/icons/favicon.ico' },
      { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180' },
    ],
  },
  manifest: '/site.webmanifest',
  other: {
    'msapplication-TileColor': '#ffffff',
    'theme-color': '#ffffff',
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning className={inter.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="facebook-domain-verification" content="your-facebook-verification-code" />
        <meta name="google-site-verification" content="OF64XOunM58TdYUSGjWdl5U_v9zv7qhMPZgW-P-rApk" />
        <link rel="canonical" href="https://kubahcmp.id" />
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Cipta Mandiri Perkasa",
              url: "https://kubahcmp.id",
              logo: "https://kubahcmp.id/images/logo.png",
              sameAs: [
                "https://facebook.com/yourpage",
                "https://instagram.com/yourprofile",
                "https://youtube.com/yourchannel"
              ],
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+6281386225702",
                contactType: "customer service",
                areaServed: "Indonesia",
                availableLanguage: ["Indonesian"]
              },
            }),
          }}
        />
      </head>

      {/* Analytics Scripts */}
      <Script 
        src="https://www.googletagmanager.com/gtag/js?id=G-34K32M7LQ3" 
        strategy="afterInteractive" 
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-34K32M7LQ3');
          gtag('config', 'AW-YOUR_CONVERSION_ID');
        `}
      </Script>
      
      {/* Facebook Pixel */}
      <Script id="facebook-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s){
            if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window,document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', 'YOUR_PIXEL_ID');
            fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        <img 
          height="1" 
          width="1" 
          src="https://www.facebook.com/tr?id=YOUR_PIXEL_ID&ev=PageView&noscript=1"
          alt="Facebook Pixel Fallback"
        />
      </noscript>

      <body className={`${inter.className} antialiased`}>
        <ThemeProvider 
          attribute="class" 
          defaultTheme="light" 
          enableSystem 
          disableTransitionOnChange
        >
          <ErrorBoundary fallback={<div>Something went wrong. Please refresh the page.</div>}>
            <Suspense fallback={<LoadingIndicator />}>
              {children}
              
              <PageViewTracker />
              <FloatingContactButton />
              
              <StructuredData
              type="LocalBusiness"
              title="Cipta Mandiri Perkasa"
              description="Spesialis GRC Kubah Masjid & Ornamen Islami"
              imageUrl="/images/logo.png"
              sameAs={[
                "https://facebook.com/ciptamandiriperkasa",
                "https://instagram.com/ciptamandiriperkasa"
              ]}
              address={{
                streetAddress: "Jl. Raya Tambelang No.RT.02",
                addressLocality: "Kertamukti, Bekasi",
                postalCode: "17520",
                addressCountry: "ID"
              }}
            />
            </Suspense>
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  )
}