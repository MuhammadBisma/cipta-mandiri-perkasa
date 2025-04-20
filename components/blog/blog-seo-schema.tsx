import Script from "next/script"

interface BlogSeoSchemaProps {
  title: string
  description: string
  content: string
  imageUrl: string
  authorName: string
  datePublished: string
  dateModified: string
  url: string
  category?: string
}

export default function BlogSeoSchema({
  title,
  description,
  content,
  imageUrl,
  authorName,
  datePublished,
  dateModified,
  url,
  category = "Artikel",
}: BlogSeoSchemaProps) {
  // Extract keywords from content
  const plainContent = content.replace(/<[^>]*>/g, "")

  // Create schema data
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: description,
    image: imageUrl,
    datePublished: datePublished,
    dateModified: dateModified,
    author: {
      "@type": "Person",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: "Cipta Mandiri Perkasa",
      logo: {
        "@type": "ImageObject",
        url: "https://kubahcmp.id/images/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    articleBody: plainContent.substring(0, 500), // Limit for schema
    articleSection: category,
  }

  return (
    <Script
      id="blog-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  )
}
