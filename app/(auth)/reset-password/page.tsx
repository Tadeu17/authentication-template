"use client";

import { useState, Suspense, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Card, CardBody, CardHeader } from "@heroui/react";
import { z } from "zod";
import { Eye, EyeOff, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { addToast } from "@heroui/react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

// Schema factory with translated messages
function createResetPasswordSchema(tValidation: (key: string) => string) {
  return z
    .object({
      password: z.string().min(8, tValidation("passwordTooShort")),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: tValidation("passwordMismatch"),
      path: ["confirmPassword"],
    });
}

type ResetPasswordInput = z.infer<ReturnType<typeof createResetPasswordSchema>>;

/**
 * Reset Password Form Component
 * Separated to isolate useSearchParams in its own Suspense boundary
 */
function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const t = useTranslations("auth.passwordReset");
  const tErrors = useTranslations("errors");
  const tValidation = useTranslations("validation");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  // Create schema with translated messages
  const resetPasswordSchema = useMemo(
    () => createResetPasswordSchema(tValidation),
    [tValidation]
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    if (!token) {
      addToast({
        title: t("invalidToken"),
        color: "danger",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password: data.password,
        }),
      });

      if (response.ok) {
        setResetSuccess(true);
        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push("/login?resetSuccess=true");
        }, 2000);
      } else {
        const errorData = await response.json();
        addToast({
          title: errorData.error?.message || t("invalidToken"),
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

  // If no token, show error
  if (!token) {
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
            <h1 className="text-2xl font-bold mb-2 text-error">
              {t("invalidToken")}
            </h1>
            <p className="text-default-500 mb-6">{t("requestNew")}</p>

            <Button
              as={Link}
              href="/forgot-password"
              color="primary"
              size="lg"
              fullWidth
            >
              {t("requestNew")}
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  // If reset successful, show success message
  if (resetSuccess) {
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

            <h1 className="text-2xl font-bold mb-2">{t("success")}</h1>
            <p className="text-default-500 mb-6">{t("successDescription")}</p>

            <Button as={Link} href="/login" color="primary" size="lg" fullWidth>
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
              {...register("password")}
              type={showPassword ? "text" : "password"}
              label={t("newPassword")}
              placeholder={t("passwordPlaceholder")}
              isInvalid={!!errors.password}
              errorMessage={errors.password?.message}
              isRequired
              endContent={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="focus:outline-none"
                  aria-label={
                    showPassword
                      ? t("hidePassword")
                      : t("showPassword")
                  }
                >
                  {showPassword ? (
                    <EyeOff className="text-default-400 w-5 h-5" aria-hidden="true" />
                  ) : (
                    <Eye className="text-default-400 w-5 h-5" aria-hidden="true" />
                  )}
                </button>
              }
            />

            <Input
              {...register("confirmPassword")}
              type={showConfirmPassword ? "text" : "password"}
              label={t("confirmPassword")}
              placeholder={t("passwordPlaceholder")}
              isInvalid={!!errors.confirmPassword}
              errorMessage={
                errors.confirmPassword?.message || t("passwordMismatch")
              }
              isRequired
              endContent={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="focus:outline-none"
                  aria-label={
                    showConfirmPassword
                      ? t("hidePassword")
                      : t("showPassword")
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="text-default-400 w-5 h-5" aria-hidden="true" />
                  ) : (
                    <Eye className="text-default-400 w-5 h-5" aria-hidden="true" />
                  )}
                </button>
              }
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
            <Button as={Link} href="/login" variant="light" size="sm">
              {t("backToLogin")}
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

/**
 * Reset Password Page
 * Allows users to set a new password with a reset token
 */
export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">Loading...</div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
