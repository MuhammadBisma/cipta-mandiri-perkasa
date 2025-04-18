import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileSearch, Home } from "lucide-react"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"

export default function NotFound() {
  return (
    <>
      <Navbar />
      <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 px-4 py-20">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
          <div className="flex flex-col items-center text-center">
            <FileSearch className="h-16 w-16 text-blue-500 mb-4" />
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Halaman Tidak Ditemukan</h2>
            <p className="text-gray-600 mb-6">
              Mohon maaf, halaman yang Anda cari tidak ditemukan atau telah dipindahkan.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <Link href="/" className="w-full">
                <Button className="w-full flex items-center justify-center">
                  <Home className="mr-2 h-4 w-4" />
                  Kembali ke Beranda
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}