import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

// This route should be protected in production
// Only accessible by existing admins
export async function POST(request: Request) {
  try {
    const { username, password, name, role = "ADMIN" } = await request.json()

    // Validate input
    if (!username || !password || !name) {
      return NextResponse.json({ error: "Semua field harus diisi" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { username },
    })

    if (existingUser) {
      return NextResponse.json({ error: "Username sudah digunakan" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        name,
        role,
      },
    })

    // Return success response (without password)
    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        username: newUser.username,
        name: newUser.name,
        role: newUser.role,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
