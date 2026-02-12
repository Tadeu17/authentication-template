export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { getAdapter } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/email";
import { applyRateLimit, RATE_LIMITS, getClientIp, hashIp } from "@/lib/rate-limiter";
import { ERROR_CODES, ERROR_MESSAGES, HTTP_STATUS } from "@/lib/constants";
import { randomUUID } from "crypto";

/**
 * POST /api/auth/forgot-password
 * Request password reset email
 *
 * Request body: { email }
 * Response: { success: true }
 *
 * Note: Always returns success even if email doesn't exist (security best practice)
 *
 * Errors:
 * - 400 VALIDATION_ERROR - Missing email
 * - 429 RATE_LIMITED - Too many requests (5 per hour per IP)
 */
export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting (5 per hour per IP)
    const clientIp = getClientIp(request);
    const ipHash = await hashIp(clientIp);
    const rateLimitResult = applyRateLimit(
      ipHash,
      "forgot-password",
      RATE_LIMITS.PASSWORD_RESET
    );
    if (rateLimitResult) {
      console.warn("Forgot password rate limited", { ipHash: ipHash.substring(0, 8) });
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

    // If user doesn't exist, still return success (don't reveal if email exists)
    if (!user) {
      console.info("Password reset requested for non-existent email", {
        email: email.substring(0, 3) + "***"
      });
      return NextResponse.json({ success: true });
    }

    // Generate reset token
    const token = randomUUID();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Update user with token
    await adapter.setPasswordResetToken(user.id, token, expiresAt);

    // Send password reset email
    await sendPasswordResetEmail(user.email, token, "en");

    console.info("Password reset email sent", {
      userId: user.id,
      email: user.email.substring(0, 3) + "***"
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Forgot password error", { error, context: "forgot-password" });

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
