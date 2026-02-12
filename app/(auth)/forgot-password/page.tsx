"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Card, CardBody, CardHeader } from "@heroui/react";
import { z } from "zod";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { addToast } from "@heroui/react";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email format"),
});

type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

/**
 * Forgot Password Page
 * Allows users to request a password reset email
 */
export default function ForgotPasswordPage() {
  const t = useTranslations("auth.passwordReset");
  const tErrors = useTranslations("errors");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setEmailSent(true);
      } else {
        const errorData = await response.json();
        addToast({
          title: errorData.error?.message || tErrors("sendEmailFailed"),
          color: "danger",
        });
      }
    } catch {
      addToast({
        title: tErrors("unexpectedError"),
        color: "danger",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (emailSent) {
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

            <h1 className="text-2xl font-bold mb-2">{t("emailSent")}</h1>
            <p className="text-default-500 mb-6">{t("emailSentDescription")}</p>

            <Button
              as={Link}
              href="/login"
              color="primary"
              size="lg"
              fullWidth
            >
              {t("backToLogin")}
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-page-gradient p-4 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col items-center pb-0 pt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-6">Auth Template</h1>
        </CardHeader>

        <CardBody>
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold mb-2">{t("title")}</h1>
            <p className="text-default-500">{t("description")}</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              {...register("email")}
              type="email"
              label={t("email")}
              placeholder={t("emailPlaceholder")}
              isInvalid={!!errors.email}
              errorMessage={errors.email?.message}
              isRequired
            />

            <Button
              type="submit"
              color="primary"
              size="lg"
              fullWidth
              isLoading={isSubmitting}
              aria-busy={isSubmitting}
            >
              {t("resetButton")}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Button
              as={Link}
              href="/login"
              variant="light"
              size="sm"
              startContent={<ArrowLeft className="w-4 h-4" />}
            >
              {t("backToLogin")}
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
