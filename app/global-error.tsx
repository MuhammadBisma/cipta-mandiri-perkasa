"use client"

import { Button } from "@/components/ui/button"
import { AlertTriangle, Home } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="id">
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
            <div className="flex flex-col items-center text-center">
              <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Kesalahan Sistem</h2>
              <p className="text-gray-600 mb-6">
                Mohon maaf, terjadi kesalahan pada sistem kami. Tim teknis kami sedang bekerja untuk memperbaikinya.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <Button onClick={reset} className="flex-1 bg-blue-600 hover:bg-blue-700">
                  Muat Ulang Aplikasi
                </Button>
                <Button
                  onClick={() => (window.location.href = "/")}
                  variant="outline"
                  className="flex-1 flex items-center justify-center"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Kembali ke Beranda
                </Button>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}