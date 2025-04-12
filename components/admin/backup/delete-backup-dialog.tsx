"use client"

import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Trash2, AlertTriangle } from "lucide-react"
import { motion } from "framer-motion"

interface DeleteBackupDialogProps {
  backupName: string
  backupSize: string
  backupDate: string
  onConfirm: () => void
  onCancel: () => void
}

export default function DeleteBackupDialog({
  backupName,
  backupSize,
  backupDate,
  onConfirm,
  onCancel,
}: DeleteBackupDialogProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleConfirm = () => {
    setIsOpen(false)
    onConfirm()
  }

  const handleCancel = () => {
    setIsOpen(false)
    onCancel()
  }

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="text-red-500 hover:text-red-600 hover:bg-red-50"
        onClick={() => setIsOpen(true)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100"
            >
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </motion.div>
            <AlertDialogTitle className="text-center text-xl">Konfirmasi Penghapusan Backup</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Apakah Anda yakin ingin menghapus backup berikut?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="my-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="grid gap-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-500">Nama:</span>
                <span className="text-sm font-semibold">{backupName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-500">Ukuran:</span>
                <span className="text-sm">{backupSize}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-500">Tanggal:</span>
                <span className="text-sm">{backupDate}</span>
              </div>
            </div>
          </div>

          <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500" />
              <p className="text-xs text-amber-800">
                Tindakan ini tidak dapat dibatalkan. Backup yang dihapus tidak dapat dipulihkan.
              </p>
            </div>
          </div>

          <AlertDialogFooter className="mt-4 flex gap-2 sm:justify-center">
            <AlertDialogCancel asChild>
              <Button variant="outline" onClick={handleCancel}>
                Batal
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button variant="destructive" onClick={handleConfirm}>
                <Trash2 className="mr-2 h-4 w-4" />
                Hapus Backup
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
