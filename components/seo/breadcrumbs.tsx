import Link from "next/link"
import { ChevronRight } from "lucide-react"
import Script from "next/script"

interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbsProps {
  customItems?: BreadcrumbItem[]
  className?: string
}

export default function Breadcrumbs({ customItems, className = "" }: BreadcrumbsProps) {
  // Default items always start with Home
  const items: BreadcrumbItem[] = [{ label: "Beranda", href: "/" }]

  // Add custom items if provided
  if (customItems && customItems.length > 0) {
    items.push(...customItems)
  }

  // Generate structured data for breadcrumbs
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: `https://kubahcmp.id${item.href}`,
    })),
  }

  return (
    <>
      <Script
        id="breadcrumbs-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <nav aria-label="Breadcrumb" className={`text-sm ${className}`}>
        <ol className="flex flex-wrap items-center">
          {items.map((item, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />}
              {index === items.length - 1 ? (
                <span aria-current="page" className="font-medium">
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className="hover:underline">
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}
