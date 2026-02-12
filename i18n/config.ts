/**
 * Internationalization Configuration
 *
 * This file defines the supported locales and the default locale.
 * To add a new language:
 * 1. Add the locale code to the `locales` array below
 * 2. Create translation files in i18n/locales/{locale}/
 * 3. The locale will be automatically available
 */

export const locales = ['en', 'pt'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

/**
 * Locale display names for language selector
 */
export const localeNames: Record<Locale, string> = {
  en: 'English',
  pt: 'Português',
};

/**
 * Get the locale from the request or use default
 */
export function getLocale(): Locale {
  // For now, return default locale
  // This can be enhanced with cookie/header detection
  return defaultLocale;
}
