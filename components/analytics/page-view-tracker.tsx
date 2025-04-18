"use client"

import { useEffect, useRef } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import {
  trackPageViewViaAPI,
  updatePageViewDurationViaAPI,
  sendPageViewDurationViaBeacon,
} from "@/lib/analytics-client"

interface PageViewTrackerProps {
  blogPostId?: string
  galleryId?: string
}

export default function PageViewTracker({ blogPostId, galleryId }: PageViewTrackerProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const pageViewId = useRef<string | null>(null)
  const startTime = useRef<number>(Date.now())
  const hasTracked = useRef<boolean>(false)

  useEffect(() => {
    // Reset tracking state when path changes
    hasTracked.current = false
    startTime.current = Date.now()
    pageViewId.current = null

    // Function to track page view
    const trackPageView = async () => {
      if (!pathname || hasTracked.current) return

      try {
        hasTracked.current = true

        // Get the page title
        const pageTitle = document.title

        // Get the referrer
        const referrer = document.referrer

        // Get query parameters
        const queryParamsString = searchParams.toString()

        // Send the page view data to the API using our client-safe function
        const data = await trackPageViewViaAPI(
          pathname,
          pageTitle,
          referrer,
          queryParamsString || null,
          blogPostId,
          galleryId,
        )

        if (data && data.result && data.result.pageView) {
          pageViewId.current = data.result.pageView.id
        }
      } catch (error) {
        console.error("Error tracking page view:", error)
        // Tidak perlu throw error di sini, cukup log saja
        // Ini mencegah error di komponen ini mengganggu rendering aplikasi
      }
    }

    // Track the page view
    trackPageView().catch((err) => {
      console.error("Failed to track page view:", err)
      // Tangkap error dari async function untuk mencegah unhandled promise rejection
    })

    // Function to update page view duration
    const updateDuration = async () => {
      if (!pageViewId.current) return

      try {
        const duration = Math.floor((Date.now() - startTime.current) / 1000)
        await updatePageViewDurationViaAPI(pageViewId.current, duration)
      } catch (error) {
        console.error("Error updating page view duration:", error)
        // Tidak perlu throw error di sini
      }
    }

    // Update duration when the component unmounts or when the path changes
    return () => {
      updateDuration().catch((err) => {
        console.error("Failed to update duration:", err)
      })
    }
  }, [pathname, searchParams, blogPostId, galleryId])

  // Also update duration when the user is about to leave the page
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (!pageViewId.current) return

      const duration = Math.floor((Date.now() - startTime.current) / 1000)

      // Use our client-safe function to send the beacon
      try {
        sendPageViewDurationViaBeacon(pageViewId.current, duration)
      } catch (error) {
        console.error("Error sending beacon:", error)
        // Tidak perlu throw error di sini
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload", handleBeforeUnload)EventListener("beforeunload', handleBeforeUnload)
    }
  }, [])

  // This component doesn't render anything
  return null
}