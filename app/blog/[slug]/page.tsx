import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Calendar, User, Tag, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import prisma from "@/lib/db"
import { formatDate } from "@/lib/utils"
import SocialShareButtons from "@/components/blog/social-share-buttons"
import BlogSidebar from "@/components/blog/blog-sidebar"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import Breadcrumbs from "@/components/seo/breadcrumbs"
import StructuredData from "@/components/seo/structured-data"
import CanonicalUrl from "@/components/seo/canonical-url"
import { extractKeywords, generateMetaDescription } from "@/lib/seo-utils"

type Props = {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await prisma.blogPost.findUnique({
    where: {
      slug: params.slug,
    },
  })

  if (!post) {
    return {
      title: "Artikel Tidak Ditemukan",
    }
  }

  // Extract keywords from content
  const contentText = post.content.replace(/<[^>]*>/g, "")
  const extractedKeywords = extractKeywords(contentText) // Removed the number parameter

  // Generate meta description if excerpt is empty
  const description = post.excerpt || generateMetaDescription(contentText)

  return {
    title: `${post.title} - Cipta Mandiri Perkasa`,
    description: description,
    keywords: [...extractedKeywords, post.category, "artikel kubah masjid", "blog ornamen islami"],
    openGraph: {
      title: post.title,
      description: description,
      url: `https://kubahcmp.id/blog/${post.slug}`,
      images: [post.imageUrl],
      type: "article",
      publishedTime: post.createdAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: ["Cipta Mandiri Perkasa"],
      tags: [post.category, ...extractedKeywords.slice(0, 5)],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: description,
      images: [post.imageUrl],
    },
    alternates: {
      canonical: `https://kubahcmp.id/blog/${post.slug}`,
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const post = await prisma.blogPost.findUnique({
    where: {
      slug: params.slug,
      published: true,
    },
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
  })

  if (!post) {
    notFound()
  }

  // Get related posts (same category, excluding current post)
  const relatedPosts = await prisma.blogPost.findMany({
    where: {
      category: post.category,
      published: true,
      NOT: {
        id: post.id,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 3,
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
  })

  return (
    <>
      <Navbar />
      <CanonicalUrl path={`/blog/${post.slug}`} />
      <StructuredData
        type="Article"
        title={post.title}
        description={post.excerpt}
        imageUrl={post.imageUrl}
        datePublished={post.createdAt.toISOString()}
        dateModified={post.updatedAt.toISOString()}
        authorName={post.author?.name}
      />

      <main className="pt-24">
        <div className="container py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="w-full lg:w-2/3">
              <Breadcrumbs
                customItems={[
                  { label: "Blog", href: "/blog" },
                  { label: post.title, href: `/blog/${post.slug}` },
                ]}
                className="mb-4"
              />

              <Link href="/blog">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-blue-500 rounded-xl mb-6 text-white hover:bg-blue-600"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Blog
                </Button>
              </Link>
              <article className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative h-[300px] md:h-[400px]">
                  <Image
                    src={post.imageUrl || "/placeholder.svg"}
                    alt={post.title}
                    fill
                    className="object-cover"
                    loading="eager"
                    priority
                    sizes="(max-width: 768px) 100vw, 66vw"
                  />
                  <div className="absolute top-4 right-4 bg-primary text-white text-xs font-semibold py-1 px-2 rounded">
                    {post.category}
                  </div>
                </div>

                <div className="p-6 md:p-8">
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">{post.title}</h1>

                  <div className="flex flex-wrap items-center text-sm text-gray-500 mb-6">
                    <div className="flex items-center mr-4 mb-2">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{formatDate(new Date(post.createdAt))}</span>
                    </div>
                    <div className="flex items-center mr-4 mb-2">
                      <User className="h-4 w-4 mr-1" />
                      <span>{post.author?.name}</span>
                    </div>
                    <div className="flex items-center mb-2">
                      <Tag className="h-4 w-4 mr-1" />
                      <span>{post.category}</span>
                    </div>
                  </div>

                  <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />

                  <div className="mt-8 pt-6 border-t">
                    <SocialShareButtons title={post.title} slug={post.slug} />
                  </div>
                </div>
              </article>

              {relatedPosts.length > 0 && (
                <div className="mt-12">
                  <h2 className="text-2xl font-bold mb-6">Artikel Terkait</h2>
                  <div className="grid md:grid-cols-3 gap-6">
                    {relatedPosts.map((relatedPost) => (
                      <div
                        key={relatedPost.id}
                        className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-2"
                      >
                        <div className="relative h-40">
                          <Image
                            src={relatedPost.imageUrl || "/placeholder.svg"}
                            alt={relatedPost.title}
                            fill
                            className="object-cover"
                            loading="lazy"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 20vw"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold mb-2 line-clamp-2">{relatedPost.title}</h3>
                          <Link href={`/blog/${relatedPost.slug}`}>
                            <Button variant="link" className="text-primary p-0 flex items-center">
                              Baca Selengkapnya
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="w-full lg:w-1/3">
              <BlogSidebar />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}