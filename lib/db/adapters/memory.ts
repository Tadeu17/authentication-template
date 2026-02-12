/**
 * In-Memory Database Adapter
 *
 * This adapter stores all data in memory, making it perfect for:
 * - Demo mode / testing the template
 * - Development without database setup
 * - Unit testing
 *
 * WARNING: All data is lost when the server restarts!
 * Do NOT use this in production.
 */

import { v4 as uuid } from 'uuid'
import { BaseAdapter } from '../adapter'
import type { User, CreateUserInput, UpdateUserInput, TokenData, UserForAuth } from '../types'

// In-memory store
const users = new Map<string, User>()
const emailIndex = new Map<string, string>() // email -> userId
const verificationTokenIndex = new Map<string, string>() // token -> userId
const passwordResetTokenIndex = new Map<string, string>() // token -> userId

export class MemoryAdapter extends BaseAdapter {
  getAdapterName(): string {
    return 'In-Memory (Demo Mode)'
  }

  async isConnected(): Promise<boolean> {
    return true // Always connected
  }

  async findUserByEmail(email: string): Promise<UserForAuth | null> {
    const normalizedEmail = email.toLowerCase()
    const userId = emailIndex.get(normalizedEmail)
    if (!userId) return null

    const user = users.get(userId)
    if (!user) return null

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      passwordHash: user.passwordHash,
      emailVerified: user.emailVerified,
    }
  }

  async findUserById(id: string): Promise<User | null> {
    return users.get(id) || null
  }

  async createUser(data: CreateUserInput): Promise<User> {
    const id = uuid()
    const now = new Date()
    const normalizedEmail = data.email.toLowerCase()

    const user: User = {
      id,
      email: normalizedEmail,
      passwordHash: data.passwordHash,
      name: data.name,
      emailVerified: null,
      emailVerificationToken: data.emailVerificationToken || null,
      emailVerificationTokenExpiresAt: data.emailVerificationTokenExpiresAt || null,
      passwordResetToken: null,
      passwordResetTokenExpiresAt: null,
      createdAt: now,
      updatedAt: now,
    }

    users.set(id, user)
    emailIndex.set(normalizedEmail, id)

    if (data.emailVerificationToken) {
      verificationTokenIndex.set(data.emailVerificationToken, id)
    }

    return user
  }

  async updateUser(id: string, data: UpdateUserInput): Promise<User> {
    const user = users.get(id)
    if (!user) {
      throw new Error(`User not found: ${id}`)
    }

    // Handle email change
    if (data.email && data.email !== user.email) {
      emailIndex.delete(user.email)
      emailIndex.set(data.email.toLowerCase(), id)
    }

    // Handle verification token change
    if (data.emailVerificationToken !== undefined) {
      // Remove old token if exists
      if (user.emailVerificationToken) {
        verificationTokenIndex.delete(user.emailVerificationToken)
      }
      // Add new token if provided
      if (data.emailVerificationToken) {
        verificationTokenIndex.set(data.emailVerificationToken, id)
      }
    }

    // Handle password reset token change
    if (data.passwordResetToken !== undefined) {
      // Remove old token if exists
      if (user.passwordResetToken) {
        passwordResetTokenIndex.delete(user.passwordResetToken)
      }
      // Add new token if provided
      if (data.passwordResetToken) {
        passwordResetTokenIndex.set(data.passwordResetToken, id)
      }
    }

    const updatedUser: User = {
      ...user,
      ...data,
      email: data.email ? data.email.toLowerCase() : user.email,
      updatedAt: new Date(),
    }

    users.set(id, updatedUser)
    return updatedUser
  }

  async emailExists(email: string): Promise<boolean> {
    return emailIndex.has(email.toLowerCase())
  }

  async setVerificationToken(userId: string, token: string, expiresAt: Date): Promise<void> {
    const user = users.get(userId)
    if (!user) {
      throw new Error(`User not found: ${userId}`)
    }

    // Remove old token if exists
    if (user.emailVerificationToken) {
      verificationTokenIndex.delete(user.emailVerificationToken)
    }

    user.emailVerificationToken = token
    user.emailVerificationTokenExpiresAt = expiresAt
    user.updatedAt = new Date()

    verificationTokenIndex.set(token, userId)
    users.set(userId, user)
  }

  async getVerificationToken(token: string): Promise<TokenData | null> {
    const userId = verificationTokenIndex.get(token)
    if (!userId) return null

    const user = users.get(userId)
    if (!user || !user.emailVerificationTokenExpiresAt) return null

    return {
      userId,
      token,
      expiresAt: user.emailVerificationTokenExpiresAt,
    }
  }

  async clearVerificationToken(userId: string): Promise<void> {
    const user = users.get(userId)
    if (!user) return

    if (user.emailVerificationToken) {
      verificationTokenIndex.delete(user.emailVerificationToken)
    }

    user.emailVerificationToken = null
    user.emailVerificationTokenExpiresAt = null
    user.updatedAt = new Date()
    users.set(userId, user)
  }

  async setPasswordResetToken(userId: string, token: string, expiresAt: Date): Promise<void> {
    const user = users.get(userId)
    if (!user) {
      throw new Error(`User not found: ${userId}`)
    }

    // Remove old token if exists
    if (user.passwordResetToken) {
      passwordResetTokenIndex.delete(user.passwordResetToken)
    }

    user.passwordResetToken = token
    user.passwordResetTokenExpiresAt = expiresAt
    user.updatedAt = new Date()

    passwordResetTokenIndex.set(token, userId)
    users.set(userId, user)
  }

  async getPasswordResetToken(token: string): Promise<TokenData | null> {
    const userId = passwordResetTokenIndex.get(token)
    if (!userId) return null

    const user = users.get(userId)
    if (!user || !user.passwordResetTokenExpiresAt) return null

    return {
      userId,
      token,
      expiresAt: user.passwordResetTokenExpiresAt,
    }
  }

  async clearPasswordResetToken(userId: string): Promise<void> {
    const user = users.get(userId)
    if (!user) return

    if (user.passwordResetToken) {
      passwordResetTokenIndex.delete(user.passwordResetToken)
    }

    user.passwordResetToken = null
    user.passwordResetTokenExpiresAt = null
    user.updatedAt = new Date()
    users.set(userId, user)
  }

  // ============================================
  // Test Utilities (only for testing)
  // ============================================

  /**
   * Clear all data - useful for tests
   */
  static clear(): void {
    users.clear()
    emailIndex.clear()
    verificationTokenIndex.clear()
    passwordResetTokenIndex.clear()
  }

  /**
   * Get user count - useful for tests
   */
  static getUserCount(): number {
    return users.size
  }
}

// Export singleton instance
export const memoryAdapter = new MemoryAdapter()
