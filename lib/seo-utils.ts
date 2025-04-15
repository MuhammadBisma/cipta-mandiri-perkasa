/**
 * Utility functions for SEO optimization
 */

/**
 * Generates a canonical URL
 * @param path - The path part of the URL
 * @param domain - The domain (defaults to kubahcmp.id)
 * @returns The full canonical URL
 */
export function getCanonicalUrl(path: string, domain = "https://kubahcmp.id"): string {
    // Ensure path starts with a slash
    const normalizedPath = path.startsWith("/") ? path : `/${path}`
    return `${domain}${normalizedPath}`
  }
  
  /**
   * Creates a slug from a string
   * @param text - The text to convert to a slug
   * @returns A URL-friendly slug
   */
  export function createSlug(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with a single hyphen
      .trim()
  }
  
  /**
   * Extracts keywords from content
   * @param content - The content to extract keywords from
   * @param additionalKeywords - Additional keywords to include
   * @returns An array of keywords
   */
  export function extractKeywords(content: string, additionalKeywords: string[] = []): string[] {
    // Simple keyword extraction - in a real app, this would be more sophisticated
    const words = content
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter((word) => word.length > 3)
      .filter((word, index, self) => self.indexOf(word) === index)
      .slice(0, 10)
  
    return [...words, ...additionalKeywords]
  }
  
  /**
   * Generates a meta description from content
   * @param content - The content to generate a description from
   * @param maxLength - The maximum length of the description
   * @returns A meta description
   */
  export function generateMetaDescription(content: string, maxLength = 160): string {
    // Remove HTML tags if present
    const plainText = content.replace(/<[^>]*>/g, "")
  
    // Truncate to maxLength and add ellipsis if needed
    if (plainText.length <= maxLength) {
      return plainText
    }
  
    // Try to cut at a sentence or word boundary
    let truncated = plainText.substring(0, maxLength)
    const lastPeriod = truncated.lastIndexOf(".")
    const lastSpace = truncated.lastIndexOf(" ")
  
    if (lastPeriod > maxLength * 0.7) {
      // If we have a period in the latter part of the text, cut there
      truncated = truncated.substring(0, lastPeriod + 1)
    } else if (lastSpace > 0) {
      // Otherwise cut at the last space
      truncated = truncated.substring(0, lastSpace)
    }
  
    return truncated + "..."
  }
  
  /**
   * Formats a date for SEO (ISO format)
   * @param date - The date to format
   * @returns An ISO formatted date string
   */
  export function formatDateForSEO(date: Date): string {
    return date.toISOString()
  }
  