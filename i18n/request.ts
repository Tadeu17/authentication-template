import { getRequestConfig } from 'next-intl/server';
import { defaultLocale, type Locale } from './config';

export default getRequestConfig(async () => {
  // For now, use the default locale
  // This can be enhanced with cookie/header-based detection
  const locale: Locale = defaultLocale;

  // Load all message files for the locale
  const [common, auth, errors, validation, dashboard] = await Promise.all([
    import(`./locales/${locale}/common.json`).then(m => m.default),
    import(`./locales/${locale}/auth.json`).then(m => m.default),
    import(`./locales/${locale}/errors.json`).then(m => m.default),
    import(`./locales/${locale}/validation.json`).then(m => m.default),
    import(`./locales/${locale}/dashboard.json`).then(m => m.default),
  ]);

  return {
    locale,
    messages: {
      common,
      auth,
      errors,
      validation,
      dashboard,
    },
  };
});
