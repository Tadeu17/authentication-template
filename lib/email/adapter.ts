/**
 * Email Adapter Interface
 *
 * This interface defines the contract that any email adapter must implement.
 * The template uses this abstraction to remain email-service agnostic.
 *
 * To implement a new adapter:
 * 1. Create a new file in lib/email/adapters/
 * 2. Implement the EmailAdapter interface
 * 3. Export your adapter
 * 4. Update lib/email/index.ts to include your adapter
 */

export interface EmailAdapter {
  /**
   * Send a verification email
   * @param to Recipient email address
   * @param token Verification token
   * @param locale User's locale for translated content
   */
  sendVerificationEmail(to: string, token: string, locale: string): Promise<void>

  /**
   * Send a password reset email
   * @param to Recipient email address
   * @param token Reset token
   * @param locale User's locale for translated content
   */
  sendPasswordResetEmail(to: string, token: string, locale: string): Promise<void>

  /**
   * Get the adapter name (for display purposes)
   */
  getAdapterName(): string

  /**
   * Check if the adapter is properly configured
   */
  isConfigured(): boolean
}

/**
 * Base email content with translations
 */
export interface EmailContent {
  subject: string
  html: string
}

/**
 * Localized content for email templates
 */
export interface LocalizedContent {
  subject: string
  greeting: string
  body: string
  button: string
  expiry: string
  ignore: string
  footer: string
}
