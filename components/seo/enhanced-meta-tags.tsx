import type { Metadata } from "next"

interface EnhancedMetaTagsProps {
  title: string
  description: string
  keywords?: string[]
  ogImage?: string
  ogType?: "website" | "article" | "profile"
  twitterCard?: "summary" | "summary_large_image"
  canonicalUrl?: string
  noIndex?: boolean
  publishedTime?: string
  modifiedTime?: string
  authorName?: string
  locale?: string
}

export function generateEnhancedMetadata({
  title,
  description,
  keywords = [],
  ogImage = "/images/og-image.jpg",
  ogType = "website",
  twitterCard = "summary_large_image",
  canonicalUrl,
  noIndex = false,
  publishedTime,
  modifiedTime,
  authorName = "Cipta Mandiri Perkasa",
  locale = "id_ID",
}: EnhancedMetaTagsProps): Metadata {
  // Base URL for the site
  const baseUrl = "https://kubahcmp.id"

  // Ensure ogImage has absolute URL
  const ogImageUrl = ogImage.startsWith("http") ? ogImage : `${baseUrl}${ogImage}`

  // Canonical URL (default to current path if not provided)
  const canonical = canonicalUrl
    ? canonicalUrl.startsWith("http")
      ? canonicalUrl
      : `${baseUrl}${canonicalUrl}`
    : undefined

  return {
    title: title,
    description: description,
    keywords: keywords,

    // Robots meta tags
    robots: noIndex
      ? {
          index: false,
          follow: true,
          nocache: true,
          googleBot: {
            index: false,
            follow: true,
          },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },

    // Open Graph meta tags
    openGraph: {
      title: title,
      description: description,
      url: canonical,
      siteName: "Cipta Mandiri Perkasa",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: locale,
      type: ogType,
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(authorName &&
        ogType === "article" && {
          authors: [authorName],
        }),
    },

    // Twitter meta tags
    twitter: {
      card: twitterCard,
      title: title,
      description: description,
      images: [ogImageUrl],
      creator: "@ciptamandiriperkasa",
      site: "@ciptamandiriperkasa",
    },

    // Canonical URL
    ...(canonical && { alternates: { canonical } }),

    // Additional meta tags
    authors: [{ name: authorName, url: baseUrl }],
    creator: "Cipta Mandiri Perkasa",
    publisher: "Cipta Mandiri Perkasa",

    // Verification tags
    verification: {
      google: "verification_code_here", // Replace with your Google verification code
      yandex: "verification_code_here", // Replace with your Yandex verification code
      yahoo: "verification_code_here", // Replace with your Yahoo verification code
    },

    // Other meta tags
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
  }
}
