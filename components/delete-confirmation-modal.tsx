"use client"

import type React from "react"

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

interface DeleteConfirmationModalProps {
  title: string
  description: string
  onConfirm: () => Promise<void>
  trigger?: React.ReactNode
}

export default function DeleteConfirmationModal({
  title,
  description,
  onConfirm,
  trigger,
}: DeleteConfirmationModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleConfirm = async () => {
    setIsDeleting(true)
    try {
      await onConfirm()
    } catch (error) {
      console.error("Error during deletion:", error)
    } finally {
      setIsDeleting(false)
      setIsOpen(false)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger ? (
        <div onClick={() => setIsOpen(true)}>{trigger}</div>
      ) : (
        <Button
          variant="outline"
          size="icon"
          className="text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={() => setIsOpen(true)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}

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
          <AlertDialogTitle className="text-center text-xl">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-center">{description}</AlertDialogDescription>
        </AlertDialogHeader>

        <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500" />
            <p className="text-xs text-amber-800">
              Tindakan ini tidak dapat dibatalkan. Data yang dihapus tidak dapat dipulihkan.
            </p>
          </div>
        </div>

        <AlertDialogFooter className="mt-4 flex gap-2 sm:justify-center">
          <AlertDialogCancel asChild>
            <Button variant="outline">Batal</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant="destructive" onClick={handleConfirm} disabled={isDeleting}>
              <Trash2 className="mr-2 h-4 w-4" />
              {isDeleting ? "Menghapus..." : "Hapus"}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}