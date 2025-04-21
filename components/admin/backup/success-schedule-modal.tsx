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
import { CheckCircle, Calendar } from "lucide-react"

interface SuccessScheduleModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  frequency: string
  time: string
}

export function SuccessScheduleModal({ open, onOpenChange, frequency, time }: SuccessScheduleModalProps) {
  const getFrequencyText = (freq: string) => {
    switch (freq) {
      case "HOURLY":
        return "setiap jam"
      case "DAILY":
        return "setiap hari"
      case "WEEKLY":
        return "setiap minggu"
      case "MONTHLY":
        return "setiap bulan"
      default:
        return freq.toLowerCase()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <DialogTitle className="text-center text-xl">Jadwal Backup Tersimpan!</DialogTitle>
          <DialogDescription className="text-center">
            Jadwal backup otomatis telah berhasil dikonfigurasi dan akan berjalan {getFrequencyText(frequency)}{" "}
            {time && `pada pukul ${time}`}.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 text-center text-sm text-gray-500">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-primary" />
            <p className="font-medium text-primary">Backup Terjadwal Aktif</p>
          </div>
          <p>
            Sistem akan secara otomatis membuat backup database sesuai jadwal yang telah Anda tetapkan. Anda dapat
            mengubah jadwal ini kapan saja.
          </p>
        </div>
        <DialogFooter className="sm:justify-center">
          <Button
            type="button"
            className="bg-primary hover:bg-primary/90 text-white"
            onClick={() => onOpenChange(false)}
          >
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
