// Client-safe analytics functions that don't use Prisma

// Function to track a page view via API
export async function trackPageViewViaAPI(
    path: string,
    pageTitle: string | null,
    referrer: string | null,
    queryParams: string | null,
    blogPostId?: string,
    galleryId?: string,
  ) {
    try {
      const response = await fetch("/api/analytics/page-view", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          path,
          pageTitle,
          referrer,
          queryParams,
          blogPostId,
          galleryId,
        }),
      })
  
      if (!response.ok) {
        throw new Error(`Failed to track page view: ${response.status}`)
      }
  
      return await response.json()
    } catch (error) {
      console.error("Error tracking page view via API:", error)
      return null
    }
  }
  
  // Function to update page view duration via API
  export async function updatePageViewDurationViaAPI(pageViewId: string, duration: number) {
    try {
      const response = await fetch("/api/analytics/page-view", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pageViewId,
          duration,
        }),
      })
  
      if (!response.ok) {
        throw new Error(`Failed to update page view duration: ${response.status}`)
      }
  
      return await response.json()
    } catch (error) {
      console.error("Error updating page view duration via API:", error)
      return null
    }
  }
  
  // Function to send page view duration via beacon API
  export function sendPageViewDurationViaBeacon(pageViewId: string, duration: number) {
    try {
      const data = JSON.stringify({
        pageViewId,
        duration,
      })
  
      // Use the sendBeacon API for more reliable tracking on page unload
      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/analytics/page-view", data)
      } else {
        // Fallback to fetch if sendBeacon is not available
        fetch("/api/analytics/page-view", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: data,
          keepalive: true, // This helps ensure the request completes even if the page is unloading
        }).catch((error) => {
          console.error("Error sending page view duration via fetch:", error)
        })
      }
    } catch (error) {
      console.error("Error sending page view duration via beacon:", error)
    }
  }
  