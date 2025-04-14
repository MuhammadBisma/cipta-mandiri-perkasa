// Warning: This file should not be imported in client components
// Use analytics-client.ts for client-side analytics functions

// Throw an error if this file is imported in a client component
if (typeof window !== "undefined") {
  console.error(
    "Error: lib/analytics.ts should not be imported in client components. " + "Use lib/analytics-client.ts instead.",
  )
}

// Re-export functions from the server file
export * from "./analytics-server"
