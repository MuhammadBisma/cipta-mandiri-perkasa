"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AlertTriangle, RefreshCw } from "lucide-react"

interface ErrorScheduleModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  errorMessage: string
  onRetry: () => void
}

export function ErrorScheduleModal({ open, onOpenChange, errorMessage, onRetry }: ErrorScheduleModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <DialogTitle className="text-center text-xl">Gagal Menyimpan Jadwal</DialogTitle>
          <DialogDescription className="text-center">
            Terjadi kesalahan saat menyimpan jadwal backup otomatis.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="rounded-md bg-red-50 p-4 border border-red-200">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Detail Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{errorMessage || "Terjadi kesalahan pada server. Silakan coba lagi nanti."}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p className="font-medium mb-2">Kemungkinan penyebab:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Koneksi ke server database terputus</li>
              <li>Izin akses tidak mencukupi</li>
              <li>Server sedang dalam pemeliharaan</li>
              <li>Format data tidak valid</li>
            </ul>
          </div>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={() => onOpenChange(false)}>
            Tutup
          </Button>
          <Button
            type="button"
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white"
            onClick={() => {
              onRetry()
              onOpenChange(false)
            }}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Coba Lagi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
