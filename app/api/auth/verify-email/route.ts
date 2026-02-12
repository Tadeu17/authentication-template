export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { getAdapter } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/email";
import { applyRateLimit, RATE_LIMITS, getClientIp, hashIp } from "@/lib/rate-limiter";
import { ERROR_CODES, ERROR_MESSAGES, HTTP_STATUS } from "@/lib/constants";
import { randomUUID } from "crypto";

/**
 * POST /api/auth/verify-email
 * Send or resend verification email
 *
 * Request body: { email }
 * Response: { success: true }
 *
 * Errors:
 * - 400 VALIDATION_ERROR - Missing email
 * - 404 NOT_FOUND - Email not found
 * - 429 RATE_LIMITED - Too many requests
 */
export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting (3 per hour per IP)
    const clientIp = getClientIp(request);
    const ipHash = await hashIp(clientIp);
    const rateLimitResult = applyRateLimit(
      ipHash,
      "verify-email",
      RATE_LIMITS.VERIFICATION_EMAIL
    );
    if (rateLimitResult) {
      console.warn("Verification email rate limited", { ipHash: ipHash.substring(0, 8) });
      return rateLimitResult;
    }

    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.VALIDATION_ERROR,
            message: "Email is required",
          },
        },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    // Get database adapter
    const adapter = await getAdapter();

    // Find user by email
    const user = await adapter.findUserByEmail(email);

    if (!user) {
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.NOT_FOUND,
            message: "Email not found",
          },
        },
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }

    // If already verified, return success (idempotent)
    if (user.emailVerified) {
      return NextResponse.json({ success: true });
    }

    // Generate verification token
    const token = randomUUID();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Update user with token
    await adapter.setVerificationToken(user.id, token, expiresAt);

    // Send verification email
    await sendVerificationEmail(user.email, token, "en");

    console.info("Verification email sent", {
      userId: user.id,
      email: user.email.substring(0, 3) + "***"
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Verification email error", { error, context: "verify-email" });

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

/**
 * GET /api/auth/verify-email?token=xxx
 * Verify email with token
 *
 * Query params: { token }
 * Response: Redirect to /verify-email/success
 *
 * Errors:
 * - 400 VALIDATION_ERROR - Missing token
 * - 400 INVALID_VERIFICATION_TOKEN - Invalid token
 * - 400 VERIFICATION_TOKEN_EXPIRED - Token expired
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.VALIDATION_ERROR,
            message: "Token is required",
          },
        },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    // Get database adapter
    const adapter = await getAdapter();

    // Find user by token
    const tokenData = await adapter.getVerificationToken(token);

    if (!tokenData) {
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.INVALID_VERIFICATION_TOKEN,
            message: ERROR_MESSAGES[ERROR_CODES.INVALID_VERIFICATION_TOKEN],
          },
        },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    // Check if token is expired
    if (tokenData.expiresAt < new Date()) {
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.VERIFICATION_TOKEN_EXPIRED,
            message: ERROR_MESSAGES[ERROR_CODES.VERIFICATION_TOKEN_EXPIRED],
          },
        },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    // Verify email
    await adapter.verifyUserEmail(tokenData.userId);

    console.info("Email verified successfully", { userId: tokenData.userId });

    // Redirect to success page
    return NextResponse.redirect(
      new URL(`/verify-email/success`, request.url)
    );
  } catch (error) {
    console.error("Email verification error", { error, context: "verify-email-get" });

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
