import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { getAdapter } from "@/lib/db";
import { loginSchema } from "@/lib/validations/auth";

/**
 * NextAuth.js configuration for authentication template
 * Uses Credentials provider for email/password authentication
 * JWT strategy for sessions
 *
 * This configuration uses the database adapter pattern to remain
 * database-agnostic. The actual database operations are handled
 * by the configured adapter (memory, PostgreSQL, MySQL, etc.)
 */
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        // Validate input
        const result = loginSchema.safeParse(credentials);
        if (!result.success) {
          throw new Error("Invalid email or password");
        }

        const { email, password } = result.data;

        // Get database adapter
        const adapter = await getAdapter();

        // Find user by email
        const user = await adapter.findUserByEmail(email);

        if (!user) {
          throw new Error("Invalid email or password");
        }

        // Verify password
        const isPasswordValid = await compare(password, user.passwordHash);

        if (!isPasswordValid) {
          throw new Error("Invalid email or password");
        }

        // Check if email is verified
        if (!user.emailVerified) {
          throw new Error("EMAIL_NOT_VERIFIED");
        }

        // Return user object (will be stored in JWT)
        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    // Session persists for 30 days (in seconds)
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      // Add custom fields to JWT token
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }

      // Refresh user data from database when session is updated
      if (trigger === "update" && token.id) {
        const adapter = await getAdapter();
        const dbUser = await adapter.findUserById(token.id as string);
        if (dbUser) {
          token.name = dbUser.name;
        }
      }

      return token;
    },
    async session({ session, token }) {
      // Add custom fields to session
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
};
