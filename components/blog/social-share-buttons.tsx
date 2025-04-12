"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Facebook, Twitter, Linkedin, Link2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SocialShareButtonsProps {
  title: string
  slug: string
}

export default function SocialShareButtons({ title, }: SocialShareButtonsProps) {
  const [url, setUrl] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    // Set the URL when component mounts (client-side only)
    setUrl(window.location.href)
  }, [])

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url)
    toast({
      title: "Link disalin!",
      description: "Link artikel telah disalin ke clipboard.",
    })
  }

  const shareOnFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      "_blank",
      "width=600,height=400",
    )
  }

  const shareOnTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      "_blank",
      "width=600,height=400",
    )
  }

  const shareOnLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      "_blank",
      "width=600,height=400",
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-gray-700">Bagikan artikel:</span>
      <Button
        variant="outline"
        size="sm"
        className="rounded-full bg-blue-500 text-white hover:bg-blue-600 border-none"
        onClick={shareOnFacebook}
      >
        <Facebook className="h-4 w-4 mr-2" />
        Facebook
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="rounded-full bg-sky-500 text-white hover:bg-sky-600 border-none"
        onClick={shareOnTwitter}
      >
        <Twitter className="h-4 w-4 mr-2" />
        Twitter
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="rounded-full bg-blue-700 text-white hover:bg-blue-800 border-none"
        onClick={shareOnLinkedIn}
      >
        <Linkedin className="h-4 w-4 mr-2" />
        LinkedIn
      </Button>
      <Button variant="outline" size="sm" className="rounded-full" onClick={handleCopyLink}>
        <Link2 className="h-4 w-4 mr-2" />
        Salin Link
      </Button>
    </div>
  )
}
