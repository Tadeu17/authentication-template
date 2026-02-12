import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Lazy validation to avoid build-time errors
// Flag is set after successful validation to ensure retry on failure
let secretValidated = false;

function validateSecret(): void {
  // Skip if already validated
  if (secretValidated) {
    return;
  }

  const secret = process.env.NEXTAUTH_SECRET;

  if (!secret && process.env.NODE_ENV === "production") {
    throw new Error("NEXTAUTH_SECRET is required in production");
  }

  // Mark as validated only after successful check
  secretValidated = true;
}

/**
 * Route middleware for authentication
 *
 * 1. Protected routes: Redirect unauthenticated users to /login
 * 2. Auth routes: Redirect authenticated users to /dashboard
 */

// Routes that require authentication
const PROTECTED_ROUTES = ["/dashboard"];

// Routes that authenticated users should not access (redirect to /dashboard)
const AUTH_ROUTES = ["/", "/login", "/register", "/forgot-password", "/reset-password", "/verify-email"];

export async function middleware(request: NextRequest) {
  // Validate secret on first request
  validateSecret();

  const { pathname } = request.nextUrl;

  // Get the token (null if not authenticated)
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAuthenticated = !!token;

  // Check if path matches protected routes
  const isProtectedRoute = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // Check if path matches auth routes (exact match only, except verify-email which has subpaths)
  const isAuthRoute = AUTH_ROUTES.some((route) => {
    if (route === "/verify-email") {
      return pathname === route || pathname.startsWith(`${route}/`);
    }
    return pathname === route;
  });

  // Redirect unauthenticated users from protected routes to login
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users from auth routes to dashboard
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Protected routes
    "/dashboard/:path*",
    // Auth routes (redirect authenticated users away)
    "/",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/verify-email/:path*",
  ],
};
