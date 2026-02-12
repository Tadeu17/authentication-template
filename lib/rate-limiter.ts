/**
 * Simple in-memory rate limiter for MVP
 *
 * For production, replace with Redis-based solution for:
 * - Distributed rate limiting across multiple instances
 * - Persistence across deployments
 * - Better memory management
 */

import { NextResponse } from "next/server";
import { getClientIP, hashIP } from "./ip-hash";

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

interface RateLimitConfig {
  /** Maximum number of requests allowed in the window */
  limit: number;
  /** Time window in seconds */
  windowSeconds: number;
}

// In-memory store for rate limits
// Key format: `${identifier}:${endpoint}`
const rateLimitStore = new Map<string, RateLimitEntry>();

// Track last cleanup time for lazy cleanup approach
let lastCleanupTime = Date.now();
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Lazy cleanup of expired entries.
 * Called during rate limit checks instead of using setInterval.
 * This avoids memory leaks in serverless environments where intervals
 * continue running even when no requests are made.
 */
function cleanupExpiredEntries(): void {
  const now = Date.now();

  // Only cleanup if enough time has passed since last cleanup
  if (now - lastCleanupTime < CLEANUP_INTERVAL_MS) {
    return;
  }

  lastCleanupTime = now;

  const entries = Array.from(rateLimitStore.entries());
  for (const [key, entry] of entries) {
    if (entry.resetAt < now) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * Predefined rate limit configurations
 */
export const RATE_LIMITS = {
  /** Registration: 5 attempts per hour per IP */
  REGISTRATION: { limit: 5, windowSeconds: 3600 },

  /** Login: 10 attempts per 15 minutes per IP */
  LOGIN: { limit: 10, windowSeconds: 900 },

  /** Password reset request: 5 per hour per IP */
  PASSWORD_RESET: { limit: 5, windowSeconds: 3600 },

  /** Verification email: 3 per hour per IP */
  VERIFICATION_EMAIL: { limit: 3, windowSeconds: 3600 },

  /** General API: 100 requests per minute */
  GENERAL: { limit: 100, windowSeconds: 60 },
} as const;

/**
 * Check if a request should be rate limited
 *
 * @param identifier - Unique identifier (session ID, IP hash, etc.)
 * @param endpoint - Endpoint name for namespacing
 * @param config - Rate limit configuration
 * @returns Object with allowed status and remaining requests
 */
export function checkRateLimit(
  identifier: string,
  endpoint: string,
  config: RateLimitConfig
): { allowed: boolean; remaining: number; resetAt: number } {
  // Lazy cleanup of expired entries (runs at most once per CLEANUP_INTERVAL_MS)
  cleanupExpiredEntries();

  const key = `${identifier}:${endpoint}`;
  const now = Date.now();

  const entry = rateLimitStore.get(key);

  // No existing entry or window expired - create new entry
  if (!entry || entry.resetAt < now) {
    const resetAt = now + config.windowSeconds * 1000;
    rateLimitStore.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: config.limit - 1, resetAt };
  }

  // Check if limit exceeded
  if (entry.count >= config.limit) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  // Increment counter
  entry.count++;
  return { allowed: true, remaining: config.limit - entry.count, resetAt: entry.resetAt };
}

/**
 * Rate limit error response
 */
export function rateLimitResponse(resetAt: number): NextResponse {
  const retryAfter = Math.ceil((resetAt - Date.now()) / 1000);

  return NextResponse.json(
    {
      error: {
        code: "RATE_LIMITED",
        message: "Too many requests. Please try again later.",
        retryAfter,
      },
    },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfter),
        "X-RateLimit-Reset": String(Math.ceil(resetAt / 1000)),
      },
    }
  );
}

/**
 * Helper to apply rate limiting in API routes
 *
 * @example
 * ```typescript
 * const rateLimitResult = applyRateLimit(ipHash, "register", RATE_LIMITS.REGISTRATION);
 * if (rateLimitResult) return rateLimitResult; // Returns 429 response
 * ```
 */
export function applyRateLimit(
  identifier: string,
  endpoint: string,
  config: RateLimitConfig
): NextResponse | null {
  const result = checkRateLimit(identifier, endpoint, config);

  if (!result.allowed) {
    return rateLimitResponse(result.resetAt);
  }

  return null;
}

/**
 * Get client IP from request (wrapper for convenience)
 * @deprecated Use getClientIP from @/lib/ip-hash instead
 */
export function getClientIp(request: Request): string {
  return getClientIP(request.headers);
}

/**
 * Hash IP address (wrapper for convenience)
 * @deprecated Use hashIP from @/lib/ip-hash instead (synchronous version)
 */
export async function hashIp(ip: string): Promise<string> {
  return hashIP(ip);
}

/**
 * Clear all rate limit entries.
 * Only available in development/test environments.
 * Used by E2E tests to prevent rate limiting across test runs.
 */
export function clearRateLimits(): boolean {
  if (process.env.NODE_ENV === "production") {
    return false;
  }
  rateLimitStore.clear();
  return true;
}
