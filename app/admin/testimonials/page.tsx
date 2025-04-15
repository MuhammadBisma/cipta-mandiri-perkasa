"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, Star, RefreshCw, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isApproving, setIsApproving] = useState<string | null>(null)
  const [isRejecting, setIsRejecting] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [approvedTestimonial, setApprovedTestimonial] = useState<any>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/testimonials/admin")
      if (!response.ok) {
        throw new Error("Failed to fetch testimonials")
      }
      const data = await response.json()
      setTestimonials(data)
    } catch (error) {
      console.error("Error fetching testimonials:", error)
      toast({
        title: "Error",
        description: "Gagal memuat data testimonial",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (date: string | Date) => {
    const d = new Date(date)
    return d.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const pendingTestimonials = testimonials.filter((t) => !t.approved)
  const approvedTestimonials = testimonials.filter((t) => t.approved)

  const handleApprove = async (id: string) => {
    setIsApproving(id)
    try {
      const response = await fetch(`/api/testimonials/${id}/approve`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to approve testimonial")
      }

      // Find the approved testimonial to display in the modal
      const testimonial = testimonials.find((t) => t.id === id)
      setApprovedTestimonial(testimonial)
      setShowSuccessModal(true)

      toast({
        title: "Berhasil",
        description: "Testimonial telah disetujui",
      })

      setTestimonials((prevTestimonials) => prevTestimonials.map((t) => (t.id === id ? { ...t, approved: true } : t)))

      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menyetujui testimonial",
        variant: "destructive",
      })
    } finally {
      setIsApproving(null)
    }
  }

  const handleReject = async (id: string) => {
    setIsRejecting(id)
    try {
      const response = await fetch(`/api/testimonials/${id}/reject`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to reject testimonial")
      }

      toast({
        title: "Berhasil",
        description: "Testimonial telah ditolak",
      })

      setTestimonials((prevTestimonials) => prevTestimonials.filter((t) => t.id !== id))

      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menolak testimonial",
        variant: "destructive",
      })
    } finally {
      setIsRejecting(null)
    }
  }

  const handleDelete = async (id: string) => {
    setIsDeleting(id)
    try {
      const response = await fetch(`/api/testimonials/${id}/delete`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to delete testimonial")
      }

      toast({
        title: "Berhasil",
        description: "Testimonial telah dihapus",
      })

      setTestimonials((prevTestimonials) => prevTestimonials.filter((t) => t.id !== id))

      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menghapus testimonial",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(null)
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
    ))
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Testimoni</h1>
          <p className="text-gray-500">Kelola testimoni pelanggan Cipta Mandiri Perkasa</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Memuat Data</CardTitle>
            <CardDescription>Sedang memuat data testimonial...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em]"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Testimoni</h1>
        <p className="text-gray-500">Kelola testimoni pelanggan Cipta Mandiri Perkasa</p>
      </div>

      {pendingTestimonials.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Testimoni Menunggu Persetujuan</CardTitle>
            <CardDescription>{pendingTestimonials.length} testimoni menunggu persetujuan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingTestimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-full overflow-hidden"
              >
                <div className="flex items-start gap-4">
                  <div className="relative h-12 w-12 flex-shrink-0">
                    <Image
                      src={testimonial.imageUrl || "/placeholder.svg"}
                      alt={testimonial.name}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="font-semibold truncate">{testimonial.name}</h3>
                        <p className="text-sm text-gray-500 truncate">{testimonial.position || "Pelanggan"}</p>
                      </div>
                      <div className="flex flex-shrink-0">{renderStars(testimonial.rating)}</div>
                    </div>
                    <div className="mt-2">
                      <p className="text-gray-700 whitespace-normal break-words line-clamp-4">
                        "{testimonial.message}"
                      </p>
                    </div>
                    <div className="mt-3 flex justify-end gap-2">
                      <Button
                        onClick={() => handleApprove(testimonial.id)}
                        variant="outline"
                        className="text-green-600 border-green-600 hover:bg-green-50"
                        disabled={isApproving === testimonial.id}
                      >
                        {isApproving === testimonial.id ? (
                          <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                        ) : (
                          <CheckCircle className="h-4 w-4 mr-1" />
                        )}
                        Setujui
                      </Button>
                      <Button
                        onClick={() => handleReject(testimonial.id)}
                        variant="outline"
                        className="text-red-600 border-red-600 hover:bg-red-50"
                        disabled={isRejecting === testimonial.id}
                      >
                        {isRejecting === testimonial.id ? (
                          <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                        ) : (
                          <XCircle className="h-4 w-4 mr-1" />
                        )}
                        Tolak
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Testimoni Disetujui</CardTitle>
          <CardDescription>Total {approvedTestimonials.length} testimoni disetujui</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {approvedTestimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white border rounded-lg p-4 max-w-full overflow-hidden">
                <div className="flex items-start gap-4">
                  <div className="relative h-12 w-12 flex-shrink-0">
                    <Image
                      src={testimonial.imageUrl || "/placeholder.svg"}
                      alt={testimonial.name}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="font-semibold truncate">{testimonial.name}</h3>
                        <p className="text-sm text-gray-500 truncate">{testimonial.position || "Pelanggan"}</p>
                      </div>
                      <div className="flex flex-shrink-0">{renderStars(testimonial.rating)}</div>
                    </div>
                    <div className="mt-2">
                      <p className="text-gray-700 whitespace-normal break-words line-clamp-4">
                        "{testimonial.message}"
                      </p>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <p className="text-xs text-gray-400">Disetujui pada {formatDate(testimonial.updatedAt)}</p>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 rounded-xl"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Hapus
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Hapus Testimonial</AlertDialogTitle>
                            <AlertDialogDescription>
                              Apakah Anda yakin ingin menghapus testimonial dari {testimonial.name}? Tindakan ini tidak
                              dapat dibatalkan.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(testimonial.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              {isDeleting === testimonial.id ? (
                                <>
                                  <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                                  Menghapus...
                                </>
                              ) : (
                                "Hapus"
                              )}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {approvedTestimonials.length === 0 && (
              <div className="col-span-full py-6 text-center text-gray-500">Belum ada testimoni yang disetujui.</div>
            )}
          </div>
        </CardContent>
      </Card>
      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-500" />
              Testimoni Disetujui
            </DialogTitle>
            <DialogDescription>
              Testimoni dari <span className="font-medium">{approvedTestimonial?.name}</span> telah berhasil disetujui
              dan akan ditampilkan di website.
            </DialogDescription>
          </DialogHeader>

          {approvedTestimonial && (
            <div className="bg-green-50 border border-green-100 rounded-lg p-4 my-2">
              <div className="flex items-start gap-3">
                <div className="relative h-10 w-10 flex-shrink-0">
                  <Image
                    src={approvedTestimonial.imageUrl || "/placeholder.svg"}
                    alt={approvedTestimonial.name}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium">{approvedTestimonial.name}</p>
                  <div className="flex mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < approvedTestimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-700 mt-1 line-clamp-2">"{approvedTestimonial.message}"</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex sm:justify-between gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowSuccessModal(false)
                fetchTestimonials()
              }}
            >
              Segarkan Daftar
            </Button>
            <Button onClick={() => setShowSuccessModal(false)} className="bg-green-600 hover:bg-green-700">
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
