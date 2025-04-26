import Script from "next/script"

type StructuredDataType = 
  | "WebPage" 
  | "Article" 
  | "Product" 
  | "Service" 
  | "Organization" 
  | "LocalBusiness" 
  | "FAQPage"
  | "BreadcrumbList"

interface Address {
  streetAddress: string
  addressLocality: string
  addressRegion?: string
  postalCode: string
  addressCountry: string
}

interface GeoCoordinates {
  latitude: string
  longitude: string
}

interface OpeningHours {
  dayOfWeek: string[]
  opens: string
  closes: string
}

interface BreadcrumbItem {
  name: string
  item: string
}

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
  breadcrumbs?: BreadcrumbItem[]
  sameAs?: string[]
  address?: Address
  geo?: GeoCoordinates
  openingHours?: OpeningHours[]
  price?: string
  priceCurrency?: string
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
  url = "https://kubahcmp.id",
  breadcrumbs,
  sameAs,
  address,
  geo,
  openingHours,
  price,
  priceCurrency = "IDR",
}: StructuredDataProps) {
  const getStructuredData = () => {
    const baseData = {
      "@context": "https://schema.org",
      "@type": type,
      name: title,
      description,
      ...(imageUrl && { image: imageUrl }),
      ...(url && { url }),
    }

    switch (type) {
      case "WebPage":
        return {
          ...baseData,
          "@type": "WebPage",
        }

      case "Article":
        return {
          ...baseData,
          "@type": "Article",
          headline: title,
          datePublished,
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
              url: `${url}/images/logo-baru.png`,
            },
          },
        }

      case "Product":
        return {
          ...baseData,
          "@type": "Product",
          offers: {
            "@type": "Offer",
            price,
            priceCurrency,
            availability: "https://schema.org/InStock",
            ...(url && { url }),
          },
        }

      case "Service":
        return {
          ...baseData,
          "@type": "Service",
          provider: {
            "@type": "Organization",
            name: organizationName,
            url,
          },
        }

      case "Organization":
        return {
          ...baseData,
          "@type": "Organization",
          name: organizationName || title,
          logo: `${url}/images/logo-baru.png`,
          contactPoint: {
            "@type": "ContactPoint",
            telephone: "+6281386225702",
            contactType: "customer service",
            areaServed: "Indonesia",
            availableLanguage: ["Indonesian"],
          },
          sameAs: sameAs || [
            "https://facebook.com/ciptamandiriperkasa",
            "https://instagram.com/ciptamandiriperkasa",
          ],
        }

      case "LocalBusiness":
        return {
          ...baseData,
          "@type": "LocalBusiness",
          telephone: "+6281386225702",
          address: address ? {
            "@type": "PostalAddress",
            ...address,
          } : {
            "@type": "PostalAddress",
            streetAddress: "Kp.pisang, batu, Jl. Raya Tambelang No.RT.02",
            addressLocality: "Kertamukti, Kec. Cibitung, Kabupaten Bekasi",
            postalCode: "17520",
            addressCountry: "ID",
          },
          geo: geo || {
            "@type": "GeoCoordinates",
            latitude: "-6.2153456",
            longitude: "107.0882966",
          },
          openingHoursSpecification: openingHours || [
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

      case "FAQPage":
        return {
          ...baseData,
          "@type": "FAQPage",
          mainEntity: (breadcrumbs || []).map(item => ({
            "@type": "Question",
            name: item.name,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.item,
            },
          })),
        }

      case "BreadcrumbList":
        return {
          ...baseData,
          "@type": "BreadcrumbList",
          itemListElement: (breadcrumbs || []).map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: `${url}${item.item}`,
          })),
        }

      default:
        return baseData
    }
  }

  return (
    <Script
      id={`structured-data-${type}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(getStructuredData()) }}
    />
  )
}