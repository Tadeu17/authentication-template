export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcrypt";
import { getAdapter } from "@/lib/db";
import { ERROR_CODES, ERROR_MESSAGES, HTTP_STATUS } from "@/lib/constants";
import { applyRateLimit, RATE_LIMITS, getClientIp, hashIp } from "@/lib/rate-limiter";

/**
 * POST /api/auth/reset-password
 * Reset password with token
 *
 * Request body: { token, password }
 * Response: { success: true }
 *
 * Errors:
 * - 400 VALIDATION_ERROR - Missing required fields
 * - 400 INVALID_RESET_TOKEN - Invalid token
 * - 400 RESET_TOKEN_EXPIRED - Token expired
 */
export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting (5 per hour per IP)
    const clientIp = getClientIp(request);
    const ipHash = await hashIp(clientIp);
    const rateLimitResult = applyRateLimit(
      ipHash,
      "reset-password",
      RATE_LIMITS.PASSWORD_RESET
    );
    if (rateLimitResult) {
      console.warn("Password reset rate limited", { ipHash: ipHash.substring(0, 8) });
      return rateLimitResult;
    }

    const body = await request.json();
    const { token, password } = body;

    if (!token || !password) {
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.VALIDATION_ERROR,
            message: "Token and password are required",
          },
        },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    // Validate password length
    if (password.length < 8) {
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.VALIDATION_ERROR,
            message: "Password must be at least 8 characters",
          },
        },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    // Get database adapter
    const adapter = await getAdapter();

    // Find user by token
    const tokenData = await adapter.getPasswordResetToken(token);

    if (!tokenData) {
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.INVALID_RESET_TOKEN,
            message: ERROR_MESSAGES[ERROR_CODES.INVALID_RESET_TOKEN],
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
            code: ERROR_CODES.RESET_TOKEN_EXPIRED,
            message: ERROR_MESSAGES[ERROR_CODES.RESET_TOKEN_EXPIRED],
          },
        },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    // Hash new password
    const passwordHash = await hash(password, 12);

    // Update password and clear reset token
    await adapter.updatePassword(tokenData.userId, passwordHash);

    console.info("Password reset successfully", { userId: tokenData.userId });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Password reset error", { error, context: "reset-password" });

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
