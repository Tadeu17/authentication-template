"use client";

import { Card, CardBody, CardHeader, Button } from "@heroui/react";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

/**
 * Email verification success page
 * Shown after user clicks verification link and email is verified
 */
export default function VerifyEmailSuccessPage() {
  const t = useTranslations("auth.verification");

  return (
    <div className="min-h-screen flex items-center justify-center bg-page-gradient p-4 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col items-center pb-0 pt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-6">Auth Template</h1>
        </CardHeader>

        <CardBody className="text-center py-8">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-success" aria-hidden="true" />
          </div>

          <h1 className="text-2xl font-bold mb-2">{t("verified")}</h1>
          <p className="text-default-500 mb-6">{t("verifiedDescription")}</p>

          <Button as={Link} href="/login" color="primary" size="lg" fullWidth>
            {t("backToLogin")}
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
