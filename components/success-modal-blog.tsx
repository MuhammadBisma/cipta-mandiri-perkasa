"use client"

import { useEffect } from "react"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import { motion } from "framer-motion"

interface SuccessModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  onAction?: () => void
  actionLabel?: string
  autoClose?: boolean
  autoCloseDelay?: number
}

export function SuccessModal({
  open,
  onOpenChange,
  title,
  description,
  onAction,
  actionLabel = "Tutup",
  autoClose = false,
  autoCloseDelay = 3000,
}: SuccessModalProps) {
  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    if (open && autoClose) {
      timeoutId = setTimeout(() => {
        onOpenChange(false)
        if (onAction) onAction()
      }, autoCloseDelay)
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [open, autoClose, autoCloseDelay, onOpenChange, onAction])

  const handleAction = () => {
    onOpenChange(false)
    if (onAction) onAction()
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100"
          >
            <CheckCircle className="h-8 w-8 text-green-500" />
          </motion.div>
          <AlertDialogTitle className="text-center text-xl">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-center">{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-center">
          <Button onClick={handleAction} className="bg-primary hover:bg-primary/90">
            {actionLabel}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}