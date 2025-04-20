import Script from "next/script"

interface BlogSchemaProps {
  title: string
  description: string
  imageUrl: string
  datePublished: string
  dateModified: string
  authorName: string
  url: string
  content?: string
}

export default function BlogSchema({
  title,
  description,
  imageUrl,
  datePublished,
  dateModified,
  authorName,
  url,
  content,
}: BlogSchemaProps) {
  // Extract headings from content for structured data
  const extractHeadings = (htmlContent: string) => {
    if (!htmlContent) return []

    const headings: { text: string; level: number }[] = []
    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlContent, "text/html")

    // Get all h1 and h2 elements
    const h1Elements = doc.querySelectorAll("h1")
    const h2Elements = doc.querySelectorAll("h2")

    h1Elements.forEach((h1) => {
      headings.push({ text: h1.textContent || "", level: 1 })
    })

    h2Elements.forEach((h2) => {
      headings.push({ text: h2.textContent || "", level: 2 })
    })

    return headings
  }

  // Create article schema with headings
  const articleSchema = {
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
    // Add article body if content is provided
    ...(content && { articleBody: content.replace(/<[^>]*>/g, "") }),
  }

  // Create breadcrumb schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://kubahcmp.id",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: "https://kubahcmp.id/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: title,
        item: url,
      },
    ],
  }

  return (
    <>
      <Script
        id="article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  )
}
