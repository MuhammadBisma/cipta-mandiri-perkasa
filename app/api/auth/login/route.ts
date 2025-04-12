import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    // Validate input
    if (!username || !password) {
      return NextResponse.json({ error: "Username dan password diperlukan" }, { status: 400 })
    }

    // Find user in database
    const user = await prisma.user.findUnique({
      where: { username },
    })

    // Check if user exists and password is correct
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json({ error: "Username atau password salah" }, { status: 401 })
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "8h" },
    )

    // Return success response with token
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
      },
      token,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
