import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@/lib/supabase/middleware"
import { hasSupabaseEnv } from "@/lib/supabase/env"

// List of admin emails - must match the one in admin-login-form.tsx and admin-auth.ts
const ADMIN_EMAILS = ["admin@outsoor.com"]

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request,
  })

  if (!hasSupabaseEnv()) {
    return response
  }

  const supabase = createMiddlewareClient(request, response)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  const protectedRoutes = ["/dashboard"]
  const authRoutes = ["/login", "/signup"]
  const adminRoutes = ["/admin"]
  const adminLoginRoute = "/admin/login"

  const isAuthenticated = !!user
  const isAdmin = isAuthenticated && ADMIN_EMAILS.includes(user?.email?.toLowerCase() || "")

  // Allow access to admin login page for everyone
  if (pathname === adminLoginRoute) {
    // If already logged in as admin, redirect to admin panel
    if (isAdmin) {
      return NextResponse.redirect(new URL("/admin", request.url))
    }
    // Otherwise, allow access to login page
    return response
  }

  // Redirect authenticated users away from auth pages
  if (
    authRoutes.some((route) => pathname.startsWith(route)) &&
    isAuthenticated
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Redirect unauthenticated users away from protected pages
  if (
    protectedRoutes.some((route) => pathname.startsWith(route)) &&
    !isAuthenticated
  ) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Protect admin routes - require both authentication and admin role
  if (adminRoutes.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
    if (!isAdmin) {
      // Redirect non-admin users to dashboard
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|public|logos|images).*)",
  ],
}
