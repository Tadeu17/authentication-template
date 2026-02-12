import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * NextAuth.js API route handler
 * Handles all authentication requests:
 * - POST /api/auth/signin
 * - POST /api/auth/signout
 * - GET /api/auth/session
 * - GET /api/auth/csrf
 */
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
