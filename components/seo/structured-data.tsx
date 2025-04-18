import Script from "next/script"

// Pastikan interface StructuredDataProps memiliki properti 'type' dengan tipe yang benar
type StructuredDataType = "WebPage" | "Article" | "Product" | "Service" | "Organization" | "LocalBusiness" | "FAQPage"

interface StructuredDataProps {
  type: StructuredDataType
  title: string
  description: string
  imageUrl?: string
  datePublished?: string
  dateModified?: string
  authorName?: string
  organizationName?: string
  url?: string
  breadcrumbs?: Array<{ name: string; item: string }>
}

export default function StructuredData({
  type,
  title,
  description,
  imageUrl,
  datePublished,
  dateModified,
  authorName,
  organizationName = "Cipta Mandiri Perkasa",
  url,
  breadcrumbs,
}: StructuredDataProps) {
  let structuredData = {}

  switch (type) {
    case "WebPage":
      structuredData = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: title,
        description: description,
        url: url || "https://kubahcmp.id",
        ...(imageUrl && { image: imageUrl }),
      }
      break
    case "Article":
      structuredData = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: title,
        description: description,
        image: imageUrl,
        datePublished: datePublished,
        dateModified: dateModified || datePublished,
        author: {
          "@type": "Person",
          name: authorName || "Admin",
        },
        publisher: {
          "@type": "Organization",
          name: organizationName,
          logo: {
            "@type": "ImageObject",
            url: "https://kubahcmp.id/logo.png",
          },
        },
      }
      break
    case "Product":
      structuredData = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: title,
        description: description,
        image: imageUrl,
        offers: {
          "@type": "Offer",
          price: "",
          priceCurrency: "IDR",
          availability: "https://schema.org/InStock",
        },
      }
      break
    case "Service":
      structuredData = {
        "@context": "https://schema.org",
        "@type": "Service",
        name: title,
        description: description,
        provider: {
          "@type": "Organization",
          name: organizationName,
          url: "https://kubahcmp.id",
        },
        ...(imageUrl && { image: imageUrl }),
      }
      break
    case "Organization":
      structuredData = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: organizationName || title,
        url: url || "https://kubahcmp.id",
        logo: "https://kubahcmp.id/logo.png",
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+6281234567890",
          contactType: "customer service",
        },
        sameAs: [
          "https://facebook.com/ciptamandiriperkasa",
          "https://instagram.com/ciptamandiriperkasa",
          "https://youtube.com/ciptamandiriperkasa",
        ],
      }
      break
    case "LocalBusiness":
      structuredData = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: organizationName || title,
        image: imageUrl || "https://kubahcmp.id/logo.png",
        url: url || "https://kubahcmp.id",
        telephone: "+6281234567890",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Kp.pisang, batu, Jl. Raya Tambelang No.RT.02",
          addressLocality: "Kertamukti, Kec. Cibitung, Kabupaten Bekasi",
          postalCode: "17520",
          addressCountry: "ID",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: "-6.2153456",
          longitude: "107.0882966",
        },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            opens: "08:00",
            closes: "17:00",
          },
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Saturday"],
            opens: "09:00",
            closes: "15:00",
          },
        ],
      }
      break
    case "FAQPage":
      structuredData = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: breadcrumbs || [],
      }
      break
    default:
      structuredData = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: title,
        description: description,
      }
  }

  return (
    <Script
      id={`structured-data-${type}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}