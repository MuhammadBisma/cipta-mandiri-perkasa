import { PrismaClient } from "@prisma/client"

const globalForPrisma = global as unknown as { prisma: PrismaClient }

const isBrowser = typeof window !== "undefined"


export const prisma = isBrowser
  ? (null as unknown as PrismaClient) 
  : globalForPrisma.prisma || new PrismaClient()


if (!isBrowser && process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}

export default prisma
