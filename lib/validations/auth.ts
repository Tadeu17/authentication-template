import { z } from "zod";

/**
 * Validation schemas for authentication
 *
 * Error codes are included in messages for debugging/tracing.
 * These messages should NOT be shown to users directly - use translated errors.
 */

/**
 * Password validation with complexity requirements
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 */
const passwordSchema = z
  .string()
  .min(8, "[AUTH001] Password must be at least 8 characters")
  .max(128, "[AUTH002] Password must be 128 characters or less")
  .refine(
    (password) => /[A-Z]/.test(password),
    "[AUTH003] Password must contain at least one uppercase letter"
  )
  .refine(
    (password) => /[a-z]/.test(password),
    "[AUTH004] Password must contain at least one lowercase letter"
  )
  .refine(
    (password) => /[0-9]/.test(password),
    "[AUTH005] Password must contain at least one number"
  );

/**
 * Email validation with reasonable length limit
 */
const emailSchema = z
  .string()
  .email("[AUTH006] Invalid email format")
  .max(255, "[AUTH007] Email must be 255 characters or less")
  .toLowerCase();

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: z
    .string()
    .min(1, "[AUTH008] Name is required")
    .max(100, "[AUTH009] Name must be 100 characters or less")
    .trim(),
});

export const loginSchema = z.object({
  email: z.string().email("[AUTH013] Invalid email format").toLowerCase(),
  password: z.string().min(1, "[AUTH014] Password is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
