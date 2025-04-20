"use client"

import type React from "react"

interface BlogContentRendererProps {
  content: string
}

const contentStyles = {
  h1: "text-3xl font-bold mt-6 mb-4",
  h2: "text-2xl font-bold mt-5 mb-3",
  h3: "text-xl font-bold mt-4 mb-2",
  p: "my-3",
  ul: "list-disc pl-6 my-3",
  ol: "list-decimal pl-6 my-3",
  li: "mb-1",
  a: "text-blue-600 hover:underline",
  blockquote: "border-l-4 border-gray-300 pl-4 italic my-4",
  img: "max-w-full h-auto my-4 rounded",
}

const BlogContentRenderer: React.FC<BlogContentRendererProps> = ({ content }) => {
  return (
    <div className="blog-content">
      <div dangerouslySetInnerHTML={{ __html: content }} />
      <style jsx>{`
        .blog-content h1 {
          ${contentStyles.h1}
        }
        .blog-content h2 {
          ${contentStyles.h2}
        }
        .blog-content h3 {
          ${contentStyles.h3}
        }
        .blog-content p {
          ${contentStyles.p}
        }
        .blog-content ul {
          ${contentStyles.ul}
        }
        .blog-content ol {
          ${contentStyles.ol}
        }
        .blog-content li {
          ${contentStyles.li}
        }
        .blog-content a {
          ${contentStyles.a}
        }
        .blog-content blockquote {
          ${contentStyles.blockquote}
        }
        .blog-content img {
          ${contentStyles.img}
        }
      `}</style>
    </div>
  )
}

export default BlogContentRenderer
