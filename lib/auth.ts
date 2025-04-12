import { cookies } from "next/headers"
import { jwtVerify } from "jose"

export type UserSession = {
  id: string
  username: string
  name: string
  role: string
}

export async function getSession(): Promise<UserSession | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")

  if (!token) {
    return null
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "fallback_secret")
    const { payload } = await jwtVerify(token.value, secret)

    return {
      id: payload.id as string,
      username: payload.username as string,
      name: payload.name as string,
      role: payload.role as string,
    }
  } catch (error) {
    return null
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession()
  return session !== null
}
