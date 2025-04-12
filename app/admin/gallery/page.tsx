import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Edit, Trash, Eye } from "lucide-react"
import prisma from "@/lib/db"
import { formatDate } from "@/lib/utils"

export default async function GalleryPage() {
  const galleryItems = await prisma.gallery.findMany({
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
          <h1 className="text-3xl font-bold">Galeri</h1>
          <p className="text-gray-500">Kelola galeri foto Cipta Mandiri Perkasa</p>
        </div>
        <Link href="/admin/gallery/new">
          <Button className="bg-primary rounded-xl">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Foto
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Foto</CardTitle>
          <CardDescription>Total {galleryItems.length} foto</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative h-48">
                  <Image src={item.imageUrl || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-500 mb-2">Kategori: {item.category}</p>
                  <p className="text-xs text-gray-400 mb-3">
                    Ditambahkan oleh {item.author.name} pada {formatDate(item.createdAt)}
                  </p>
                  <div className="flex justify-end gap-2">
                    <Link href={`/gallery/${item.id}`} target="_blank">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      title="Lihat"
                      className="rounded-xl border-gray-300 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Lihat
                    </Button>
                    </Link>
                    <Link href={`/admin/gallery/edit/${item.id}`}>
                      <Button 
                      variant="outline" 
                      size="sm" 
                      title="Edit"
                      className="rounded-xl border-gray-300 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200"
                        >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </Link>
                    <Link href={`/admin/gallery/delete/${item.id}`}>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        title="Hapus"
                        className="rounded-xl bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:text-red-700 transition-colors duration-200"
                      >
                        <Trash className="h-4 w-4 mr-1" />
                        Hapus
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
            {galleryItems.length === 0 && (
              <div className="col-span-full py-6 text-center text-gray-500">
                Belum ada foto di galeri. Klik "Tambah Foto" untuk menambahkan foto baru.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
