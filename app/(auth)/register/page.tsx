"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Card, CardBody, CardHeader } from "@heroui/react";
import { Eye, EyeOff, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

/**
 * Registration page for new users
 * Creates a new account with email, password, and name
 *
 * Features:
 * - Client-side validation with Zod
 * - Real-time error display
 * - Duplicate email error handling
 * - Mobile-first responsive design
 */
export default function RegisterPage() {
  const t = useTranslations("auth.register");
  const tLogin = useTranslations("auth.login");
  const tVerification = useTranslations("auth.verification");
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    setServerError(null);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle specific error codes
        if (result.error?.code === "EMAIL_EXISTS") {
          setServerError(t("emailExists"));
        } else {
          setServerError(result.error?.message || t("registrationFailed"));
        }
        return;
      }

      // Registration successful, show verification message
      setUserEmail(data.email);
      setRegistrationSuccess(true);
    } catch (error) {
      console.error("Registration error:", error);
      setServerError(tLogin("unexpectedError"));
    } finally {
      setIsLoading(false);
    }
  };

  // Show success message after registration
  if (registrationSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-page-gradient px-4 py-12 relative">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <Card className="w-full max-w-md">
          <CardBody className="text-center py-8">
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-success" />
            </div>

            <h1 className="text-2xl font-bold mb-2">{tVerification("checkEmail")}</h1>
            <p className="text-default-500 mb-6">
              {tVerification("checkEmailDescription", { email: userEmail })}
            </p>

            <Button
              as={Link}
              href="/login"
              color="primary"
              size="lg"
              fullWidth
            >
              {tVerification("backToLogin")}
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-page-gradient px-4 py-12 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col gap-1 px-6 pt-6">
          <h1 className="text-2xl font-bold text-heading">{t("title")}</h1>
          <p className="text-sm text-caption">
            {t("subtitle")}
          </p>
        </CardHeader>
        <CardBody className="px-6 pb-6">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {/* Email */}
            <Input
              {...register("email")}
              type="email"
              label={t("email")}
              placeholder={t("emailPlaceholder")}
              isInvalid={!!errors.email}
              errorMessage={errors.email?.message}
              isDisabled={isLoading}
              isRequired
            />

            {/* Password */}
            <Input
              {...register("password")}
              type={isPasswordVisible ? "text" : "password"}
              label={t("password")}
              placeholder={t("passwordPlaceholder")}
              isInvalid={!!errors.password}
              errorMessage={errors.password?.message}
              isDisabled={isLoading}
              isRequired
              endContent={
                <button
                  type="button"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
                  aria-label={isPasswordVisible ? tLogin("hidePassword") : tLogin("showPassword")}
                  aria-pressed={isPasswordVisible}
                >
                  {isPasswordVisible ? (
                    <EyeOff className="w-5 h-5 text-disabled" />
                  ) : (
                    <Eye className="w-5 h-5 text-disabled" />
                  )}
                </button>
              }
            />

            {/* Name */}
            <Input
              {...register("name")}
              type="text"
              label={t("name")}
              placeholder={t("namePlaceholder")}
              description={t("nameDescription")}
              isInvalid={!!errors.name}
              errorMessage={errors.name?.message}
              isDisabled={isLoading}
              isRequired
            />

            {/* Server Error */}
            {serverError && (
              <div className="rounded-lg alert-error p-3 text-sm">
                {serverError}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              color="primary"
              isLoading={isLoading}
              className="mt-2"
              size="lg"
            >
              {t("submit")}
            </Button>

            {/* Login Link */}
            <p className="text-center text-sm text-caption">
              {t("hasAccount")}{" "}
              <Link href="/login" className="text-primary hover:underline">
                {t("loginLink")}
              </Link>
            </p>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
