import { PrismaClient } from "@prisma/client"

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices

// Add a check to prevent instantiation in the browser
const globalForPrisma = global as unknown as { prisma: PrismaClient }

// Check if we're in a browser environment
const isBrowser = typeof window !== "undefined"

// Only create the PrismaClient if we're not in a browser
export const prisma = isBrowser
  ? (null as unknown as PrismaClient) // Return null cast as PrismaClient when in browser
  : globalForPrisma.prisma || new PrismaClient()

// Only set the global prisma instance if we're not in a browser and not in production
if (!isBrowser && process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}

export default prisma
