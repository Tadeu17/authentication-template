/**
 * Email Adapter Factory
 *
 * This module provides a factory function to get the appropriate email adapter
 * based on environment configuration.
 *
 * Set the EMAIL_ADAPTER environment variable to choose an adapter:
 * - "console" (default) - Logs emails to console for demo/testing
 * - "resend" - Uses Resend email service (requires: pnpm install resend)
 * - "sendgrid" - Uses SendGrid email service (requires: pnpm install @sendgrid/mail)
 *
 * To use a non-console adapter:
 * 1. Install the required package (see above)
 * 2. Set EMAIL_ADAPTER environment variable
 * 3. Uncomment the corresponding case in getEmailAdapter() below
 */

import type { EmailAdapter } from './adapter'

// Adapter type enum
export type EmailAdapterType = 'console' | 'resend' | 'sendgrid'

// Singleton instance
let adapterInstance: EmailAdapter | null = null

/**
 * Get the email adapter based on environment configuration.
 * Uses singleton pattern to ensure only one adapter instance exists.
 *
 * NOTE: To enable additional adapters, uncomment their case blocks below
 * after installing the required packages.
 */
export async function getEmailAdapter(): Promise<EmailAdapter> {
  if (adapterInstance) {
    return adapterInstance
  }

  const adapterType = (process.env.EMAIL_ADAPTER || 'console') as EmailAdapterType

  switch (adapterType) {
    case 'console': {
      const { consoleEmailAdapter } = await import('./adapters/console')
      adapterInstance = consoleEmailAdapter
      break
    }

    // Uncomment after installing: pnpm install resend
    // case 'resend': {
    //   const { resendEmailAdapter } = await import('./adapters/resend')
    //   adapterInstance = resendEmailAdapter
    //   break
    // }

    // Uncomment after installing: pnpm install @sendgrid/mail
    // case 'sendgrid': {
    //   const { sendgridEmailAdapter } = await import('./adapters/sendgrid')
    //   adapterInstance = sendgridEmailAdapter
    //   break
    // }

    default:
      // Fall back to console adapter if unknown or adapter not enabled
      console.warn(`Email adapter "${adapterType}" is not enabled. Using console adapter.`)
      console.warn('See lib/email/index.ts for instructions on enabling additional adapters.')
      const { consoleEmailAdapter } = await import('./adapters/console')
      adapterInstance = consoleEmailAdapter
  }

  return adapterInstance
}

/**
 * Get the current adapter type from environment
 */
export function getEmailAdapterType(): EmailAdapterType {
  return (process.env.EMAIL_ADAPTER || 'console') as EmailAdapterType
}

/**
 * Check if running in console mode (no actual emails sent)
 */
export function isConsoleMode(): boolean {
  return getEmailAdapterType() === 'console'
}

/**
 * Reset the adapter instance (useful for testing)
 */
export function resetEmailAdapter(): void {
  adapterInstance = null
}

// Convenience functions that use the adapter
/**
 * Send verification email using the configured adapter
 */
export async function sendVerificationEmail(
  to: string,
  token: string,
  locale: string = 'en'
): Promise<void> {
  const adapter = await getEmailAdapter()
  await adapter.sendVerificationEmail(to, token, locale)
}

/**
 * Send password reset email using the configured adapter
 */
export async function sendPasswordResetEmail(
  to: string,
  token: string,
  locale: string = 'en'
): Promise<void> {
  const adapter = await getEmailAdapter()
  await adapter.sendPasswordResetEmail(to, token, locale)
}

// Re-export types
export type { EmailAdapter, EmailContent, LocalizedContent } from './adapter'
