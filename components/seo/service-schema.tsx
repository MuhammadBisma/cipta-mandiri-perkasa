import Script from "next/script"

interface ServiceSchemaProps {
  name: string
  description: string
  url: string
  imageUrl?: string
  provider?: string
  areaServed?: string
}

export default function ServiceSchema({
  name,
  description,
  url,
  imageUrl,
  provider = "Cipta Mandiri Perkasa",
  areaServed = "Indonesia",
}: ServiceSchemaProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: name,
    description: description,
    url: url,
    provider: {
      "@type": "Organization",
      name: provider,
      url: "https://kubahcmp.id",
    },
    areaServed: areaServed,
    ...(imageUrl && { image: imageUrl }),
  }

  return (
    <Script
      id={`service-schema-${name.replace(/\s+/g, "-").toLowerCase()}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
