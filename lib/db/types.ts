/**
 * Database types for the authentication template
 * These types are database-agnostic and can be used with any adapter
 */

export interface User {
  id: string
  email: string
  passwordHash: string
  name: string

  // Email verification
  emailVerified: Date | null
  emailVerificationToken: string | null
  emailVerificationTokenExpiresAt: Date | null

  // Password reset
  passwordResetToken: string | null
  passwordResetTokenExpiresAt: Date | null

  createdAt: Date
  updatedAt: Date
}

export interface CreateUserInput {
  email: string
  passwordHash: string
  name: string
  emailVerificationToken?: string
  emailVerificationTokenExpiresAt?: Date
}

export interface UpdateUserInput {
  email?: string
  passwordHash?: string
  name?: string
  emailVerified?: Date | null
  emailVerificationToken?: string | null
  emailVerificationTokenExpiresAt?: Date | null
  passwordResetToken?: string | null
  passwordResetTokenExpiresAt?: Date | null
}

export interface TokenData {
  userId: string
  token: string
  expiresAt: Date
}

/**
 * Partial user returned for authentication (excludes sensitive fields)
 */
export type UserForAuth = Pick<User, 'id' | 'email' | 'name' | 'passwordHash' | 'emailVerified'>

/**
 * Public user data (excludes sensitive fields like passwordHash and tokens)
 */
export type PublicUser = Omit<
  User,
  'passwordHash' | 'emailVerificationToken' | 'emailVerificationTokenExpiresAt' | 'passwordResetToken' | 'passwordResetTokenExpiresAt'
>
