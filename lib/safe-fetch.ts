/**
 * Wrapper untuk fetch API dengan error handling yang lebih baik
 */
export async function safeFetch<T>(
    url: string,
    options?: RequestInit,
  ): Promise<{ data: T | null; error: Error | null }> {
    try {
      const response = await fetch(url, options)
  
      // Cek status HTTP
      if (!response.ok) {
        // Coba parse error message dari response
        let errorMessage: string
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorData.error || `HTTP error ${response.status}`
        } catch (e) {
          errorMessage = `HTTP error ${response.status}`
        }
  
        throw new Error(errorMessage)
      }
  
      // Parse JSON response
      const data = await response.json()
      return { data, error: null }
    } catch (error) {
      console.error("Fetch error:", error)
      return {
        data: null,
        error: error instanceof Error ? error : new Error("Unknown error occurred"),
      }
    }
  }