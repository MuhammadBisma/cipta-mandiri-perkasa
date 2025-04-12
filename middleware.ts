import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"
import { getIpAddress, trackPageView } from "@/lib/analytics"

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Define paths that are protected (require authentication)
  const isProtectedPath = path.startsWith("/admin")
  const isAuthPath = path === "/login"
  const isApiPath = path.startsWith("/api")

  // Get the token from the cookies
  const token = request.cookies.get("auth_token")?.value

  // Track page view for non-API routes
  if (!isApiPath) {
    try {
      const ipAddress = getIpAddress(request)
      const userAgent = request.headers.get("user-agent")
      const referer = request.headers.get("referer")
      const url = new URL(request.url)
      const queryParams = url.search ? url.search.substring(1) : null

      // Don't await this to avoid slowing down the response
      // We'll track analytics in the background
      trackPageView(
        ipAddress,
        userAgent,
        path,
        null, // pageTitle will be set client-side
        referer,
        queryParams,
      ).catch((error) => {
        console.error("Error tracking page view:", error)
      })
    } catch (error) {
      console.error("Error in analytics middleware:", error)
    }
  }

  // If the path is protected and there's no token, redirect to login
  if (isProtectedPath) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    // Verify the token
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || "fallback_secret")
      await jwtVerify(token, secret)

      // Token is valid, continue to the protected route
      return NextResponse.next()
    } catch (error) {
      // Token is invalid, redirect to login
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  // If the user is already logged in and tries to access login page, redirect to admin dashboard
  if (isAuthPath && token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || "fallback_secret")
      await jwtVerify(token, secret)

      // Token is valid, redirect to admin dashboard
      return NextResponse.redirect(new URL("/admin", request.url))
    } catch (error) {
      // Token is invalid, continue to login page
      return NextResponse.next()
    }
  }

  // For all other routes, continue normally
  return NextResponse.next()
}

// Configure which paths the middleware should run on
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
