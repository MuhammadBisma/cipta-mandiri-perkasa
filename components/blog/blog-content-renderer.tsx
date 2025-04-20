"use client"

import { useEffect } from "react"

interface BlogContentRendererProps {
  content: string
  title: string
  className?: string
}

export default function BlogContentRenderer({ content, title, className = "" }: BlogContentRendererProps) {
  // Fungsi untuk menambahkan atribut ke gambar untuk lazy loading
  useEffect(() => {
    const images = document.querySelectorAll(".blog-content img")
    images.forEach((img) => {
      img.setAttribute("loading", "lazy")
      if (!img.getAttribute("alt")) {
        img.setAttribute("alt", title)
      }
    })

    // Tambahkan ID ke heading untuk anchor links
    const headings = document.querySelectorAll(".blog-content h2, .blog-content h3")
    headings.forEach((heading) => {
      const text = heading.textContent || ""
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")

      heading.setAttribute("id", id)
    })
  }, [content, title])

  return (
    <div
      className={`blog-content prose prose-lg max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}
