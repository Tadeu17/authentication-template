/**
 * Database Adapter Interface
 *
 * This interface defines the contract that any database adapter must implement.
 * The template uses this abstraction to remain database-agnostic.
 *
 * To implement a new adapter:
 * 1. Create a new file in lib/db/adapters/
 * 2. Implement the AuthAdapter interface
 * 3. Export your adapter
 * 4. Update lib/db/index.ts to include your adapter
 */

import type { User, CreateUserInput, UpdateUserInput, TokenData, UserForAuth } from './types'

export interface AuthAdapter {
  /**
   * Find a user by their email address
   */
  findUserByEmail(email: string): Promise<UserForAuth | null>

  /**
   * Find a user by their ID
   */
  findUserById(id: string): Promise<User | null>

  /**
   * Create a new user
   */
  createUser(data: CreateUserInput): Promise<User>

  /**
   * Update an existing user
   */
  updateUser(id: string, data: UpdateUserInput): Promise<User>

  /**
   * Check if an email already exists
   */
  emailExists(email: string): Promise<boolean>

  // ============================================
  // Email Verification Token Operations
  // ============================================

  /**
   * Set a verification token for a user
   */
  setVerificationToken(userId: string, token: string, expiresAt: Date): Promise<void>

  /**
   * Get verification token data
   */
  getVerificationToken(token: string): Promise<TokenData | null>

  /**
   * Clear verification token for a user
   */
  clearVerificationToken(userId: string): Promise<void>

  // ============================================
  // Password Reset Token Operations
  // ============================================

  /**
   * Set a password reset token for a user
   */
  setPasswordResetToken(userId: string, token: string, expiresAt: Date): Promise<void>

  /**
   * Get password reset token data
   */
  getPasswordResetToken(token: string): Promise<TokenData | null>

  /**
   * Clear password reset token for a user
   */
  clearPasswordResetToken(userId: string): Promise<void>

  // ============================================
  // Utility Operations
  // ============================================

  /**
   * Mark a user's email as verified
   */
  verifyUserEmail(userId: string): Promise<void>

  /**
   * Update a user's password
   */
  updatePassword(userId: string, passwordHash: string): Promise<void>

  /**
   * Get the adapter name (for display purposes)
   */
  getAdapterName(): string

  /**
   * Check if the adapter is connected/initialized
   */
  isConnected(): Promise<boolean>
}

/**
 * Base class with common utility methods
 * Adapters can extend this for convenience
 */
export abstract class BaseAdapter implements AuthAdapter {
  abstract findUserByEmail(email: string): Promise<UserForAuth | null>
  abstract findUserById(id: string): Promise<User | null>
  abstract createUser(data: CreateUserInput): Promise<User>
  abstract updateUser(id: string, data: UpdateUserInput): Promise<User>
  abstract emailExists(email: string): Promise<boolean>
  abstract setVerificationToken(userId: string, token: string, expiresAt: Date): Promise<void>
  abstract getVerificationToken(token: string): Promise<TokenData | null>
  abstract clearVerificationToken(userId: string): Promise<void>
  abstract setPasswordResetToken(userId: string, token: string, expiresAt: Date): Promise<void>
  abstract getPasswordResetToken(token: string): Promise<TokenData | null>
  abstract clearPasswordResetToken(userId: string): Promise<void>
  abstract getAdapterName(): string
  abstract isConnected(): Promise<boolean>

  async verifyUserEmail(userId: string): Promise<void> {
    await this.updateUser(userId, {
      emailVerified: new Date(),
      emailVerificationToken: null,
      emailVerificationTokenExpiresAt: null,
    })
  }

  async updatePassword(userId: string, passwordHash: string): Promise<void> {
    await this.updateUser(userId, {
      passwordHash,
      passwordResetToken: null,
      passwordResetTokenExpiresAt: null,
    })
  }
}
