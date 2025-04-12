import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Edit, Trash, Eye } from "lucide-react"
import prisma from "@/lib/db"
import { formatDate } from "@/lib/utils"

export default async function BlogPage() {
  // Fetch blog posts from database
  const posts = await prisma.blogPost.findMany({
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Blog</h1>
          <p className="text-gray-500">Kelola artikel blog Cipta Mandiri Perkasa</p>
        </div>
        <Link href="/admin/blog/new">
          <Button className="bg-primary rounded-xl">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Artikel
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Artikel</CardTitle>
          <CardDescription>Total {posts.length} artikel</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Judul</th>
                  <th className="text-left py-3 px-4">Kategori</th>
                  <th className="text-left py-3 px-4">Penulis</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Tanggal</th>
                  <th className="text-right py-3 px-4">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{post.title}</td>
                    <td className="py-3 px-4">{post.category}</td>
                    <td className="py-3 px-4">{post.author.name}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${post.published ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                      >
                        {post.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="py-3 px-4">{formatDate(post.createdAt)}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/blog/${post.slug}`} target="_blank">
                          <Button 
                          variant="outline" 
                          size="icon" 
                          title="Lihat"
                          className="rounded-xl border-gray-300 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/blog/edit/${post.id}`}>
                          <Button 
                          variant="outline" 
                          size="icon" 
                          title="Edit"
                          className="rounded-xl border-gray-300 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/blog/delete/${post.id}`}>
                          <Button 
                          variant="outline" 
                          size="icon" 
                          title="Hapus"
                          className="rounded-xl bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:text-red-700 transition-colors duration-200">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
                {posts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-gray-500">
                      Belum ada artikel blog. Klik "Tambah Artikel" untuk membuat artikel baru.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
