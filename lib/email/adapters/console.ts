/**
 * Console Email Adapter
 *
 * This adapter logs emails to the console instead of sending them.
 * Perfect for:
 * - Demo mode / testing the template
 * - Development without email setup
 * - Debugging email content
 *
 * WARNING: This adapter does NOT send actual emails!
 * In production, users will NOT receive verification or password reset emails.
 * Only use this for development or when you have an alternative verification method.
 */

import type { EmailAdapter } from '../adapter'
import { getVerificationEmailContent } from '../templates/verification'
import { getPasswordResetEmailContent } from '../templates/password-reset'

export class ConsoleEmailAdapter implements EmailAdapter {
  getAdapterName(): string {
    return 'Console (Demo Mode)'
  }

  isConfigured(): boolean {
    return true // Always configured since it's just logging
  }

  async sendVerificationEmail(to: string, token: string, locale: string): Promise<void> {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const verifyUrl = `${baseUrl}/api/auth/verify-email?token=${token}`
    const content = getVerificationEmailContent(locale, verifyUrl)

    console.log('\n' + '='.repeat(60))
    console.log('📧 VERIFICATION EMAIL (Console Mode)')
    console.log('='.repeat(60))
    console.log(`To: ${to}`)
    console.log(`Subject: ${content.subject}`)
    console.log(`Locale: ${locale}`)
    console.log('-'.repeat(60))
    console.log(`Verification URL: ${verifyUrl}`)
    console.log(`Token: ${token}`)
    console.log('='.repeat(60) + '\n')
  }

  async sendPasswordResetEmail(to: string, token: string, locale: string): Promise<void> {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const resetUrl = `${baseUrl}/reset-password?token=${token}`
    const content = getPasswordResetEmailContent(locale, resetUrl)

    console.log('\n' + '='.repeat(60))
    console.log('📧 PASSWORD RESET EMAIL (Console Mode)')
    console.log('='.repeat(60))
    console.log(`To: ${to}`)
    console.log(`Subject: ${content.subject}`)
    console.log(`Locale: ${locale}`)
    console.log('-'.repeat(60))
    console.log(`Reset URL: ${resetUrl}`)
    console.log(`Token: ${token}`)
    console.log('='.repeat(60) + '\n')
  }
}

export const consoleEmailAdapter = new ConsoleEmailAdapter()
