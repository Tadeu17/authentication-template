export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcrypt";
import { getAdapter } from "@/lib/db";
import { registerSchema } from "@/lib/validations/auth";
import { applyRateLimit, RATE_LIMITS, getClientIp, hashIp } from "@/lib/rate-limiter";
import { sendVerificationEmail } from "@/lib/email";
import { randomUUID } from "crypto";
import { ERROR_CODES, ERROR_MESSAGES, HTTP_STATUS } from "@/lib/constants";

/**
 * POST /api/auth/register
 * Create a new user account
 *
 * Request body: { email, password, name }
 * Response: { id, email, name, createdAt }
 *
 * Errors:
 * - 400 VALIDATION_ERROR - Invalid input
 * - 409 EMAIL_EXISTS - Email already registered
 */
export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting (5 attempts per hour per IP)
    const clientIp = getClientIp(request);
    const ipHash = await hashIp(clientIp);
    const rateLimitResult = applyRateLimit(ipHash, "register", RATE_LIMITS.REGISTRATION);
    if (rateLimitResult) {
      console.warn("Registration rate limited", { ipHash: ipHash.substring(0, 8) });
      return rateLimitResult;
    }

    const body = await request.json();

    // Validate request body
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.VALIDATION_ERROR,
            message: ERROR_MESSAGES[ERROR_CODES.VALIDATION_ERROR],
            details: result.error.format(),
          },
        },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    const { email, password, name } = result.data;

    // Get database adapter
    const adapter = await getAdapter();

    // Check if email already exists
    const emailExists = await adapter.emailExists(email);
    if (emailExists) {
      return NextResponse.json(
        {
          error: {
            code: "EMAIL_EXISTS",
            message: "Email already in use",
          },
        },
        { status: HTTP_STATUS.CONFLICT }
      );
    }

    // Hash password with bcrypt (cost factor 12)
    const passwordHash = await hash(password, 12);

    // Generate email verification token
    const verificationToken = randomUUID();
    const verificationExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user in database
    const user = await adapter.createUser({
      email,
      passwordHash,
      name,
      emailVerificationToken: verificationToken,
      emailVerificationTokenExpiresAt: verificationExpiresAt,
    });

    // Send verification email
    try {
      await sendVerificationEmail(user.email, verificationToken, "en");
      console.info("Verification email sent on registration", {
        userId: user.id,
        email: user.email.substring(0, 3) + "***"
      });
    } catch (emailError) {
      // Log error but don't fail registration
      console.error("Failed to send verification email", {
        error: emailError,
        userId: user.id
      });
    }

    return NextResponse.json(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
        message: "VERIFICATION_EMAIL_SENT",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error", { error, context: "register" });

    return NextResponse.json(
      {
        error: {
          code: ERROR_CODES.INTERNAL_ERROR,
          message: ERROR_MESSAGES[ERROR_CODES.INTERNAL_ERROR],
        },
      },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}
