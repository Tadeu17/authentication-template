import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  // Mark optional database/email packages as external to prevent build errors
  // These packages are only needed when their respective adapters are used
  serverExternalPackages: [
    'mongodb',
    '@prisma/client',
    'prisma',
    'resend',
    '@sendgrid/mail',
  ],
};

export default withNextIntl(nextConfig);
