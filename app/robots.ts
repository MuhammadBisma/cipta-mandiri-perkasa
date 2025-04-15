import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/", "/login", "/register", "/dashboard"],
    },
    sitemap: "https://kubahcmp.id/sitemap.xml",
    host: "https://kubahcmp.id",
  }
}
