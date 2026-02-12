/**
 * IP Address Hashing Utility
 *
 * Provides one-way hashing for IP addresses to enable abuse detection
 * while maintaining user privacy. The hash is salted and cannot be
 * reversed to obtain the original IP address.
 *
 * Used for:
 * - Rate limiting
 * - Abuse detection
 */

import { createHash } from "crypto";

// Lazy initialization to avoid build-time errors
// Uses singleton pattern - salt is resolved once on first use
let resolvedSalt: string | null = null;

/**
 * Get the effective salt for IP hashing, validating on first use.
 * Thread-safe: salt is assigned atomically after validation.
 */
function getEffectiveSalt(): string {
  // Return existing salt if already resolved
  if (resolvedSalt !== null) {
    return resolvedSalt;
  }

  // Validate and resolve
  const salt = process.env.IP_HASH_SALT;

  if (!salt) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("IP_HASH_SALT environment variable is required in production");
    }
    console.warn("IP_HASH_SALT not set - using default salt (not safe for production)");
  }

  // Assign salt - use default only in development
  resolvedSalt = salt || "auth-template-default-salt-dev-only";
  return resolvedSalt;
}

/**
 * Hash an IP address for privacy-preserving storage
 *
 * Uses SHA-256 with a salt to create a one-way hash.
 * The same IP will always produce the same hash (for comparison),
 * but the hash cannot be reversed to find the original IP.
 *
 * @param ip The IP address to hash
 * @returns A hex-encoded SHA-256 hash of the salted IP
 */
export function hashIP(ip: string): string {
  // Normalize the IP address (trim whitespace, lowercase)
  const normalizedIP = ip.trim().toLowerCase();

  // Create salted hash
  const hash = createHash("sha256")
    .update(`${getEffectiveSalt()}:${normalizedIP}`)
    .digest("hex");

  return hash;
}

/**
 * Extract client IP from request headers
 *
 * Checks common proxy headers in order of preference:
 * 1. x-forwarded-for (most common in reverse proxies)
 * 2. x-real-ip (nginx)
 * 3. Falls back to a placeholder if no IP found
 *
 * @param headers Request headers object
 * @returns The client IP address or a fallback value
 */
export function getClientIP(headers: Headers): string {
  // x-forwarded-for can contain multiple IPs; take the first (client)
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    const ips = forwardedFor.split(",");
    const clientIP = ips[0]?.trim();
    if (clientIP) {
      return clientIP;
    }
  }

  // Try x-real-ip header
  const realIP = headers.get("x-real-ip");
  if (realIP) {
    return realIP.trim();
  }

  // Fallback - in production behind a proxy, we should always have an IP
  // This fallback ensures the system doesn't break in development
  return "unknown-ip";
}

/**
 * Get hashed client IP from request headers
 *
 * Convenience function that combines getClientIP and hashIP
 *
 * @param headers Request headers object
 * @returns Hashed IP address
 */
export function getHashedClientIP(headers: Headers): string {
  const ip = getClientIP(headers);
  return hashIP(ip);
}
