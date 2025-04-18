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
import { CheckCircle } from "lucide-react"

interface SuccessModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  name: string
}

export function SuccessModal({ open, onOpenChange, name }: SuccessModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <DialogTitle className="text-center text-xl">Pesan Terkirim!</DialogTitle>
          <DialogDescription className="text-center">
            Terima kasih {name}, pesan Anda telah berhasil dikirim. Tim kami akan segera menghubungi Anda.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 text-center text-sm text-gray-500">
          <p>Kami akan membalas pesan Anda melalui email atau telepon dalam waktu 1x24 jam pada hari kerja.</p>
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
