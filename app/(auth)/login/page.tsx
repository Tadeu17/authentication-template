"use client";

import { useState, Suspense, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { Button, Input, Card, CardBody, CardHeader, addToast } from "@heroui/react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

/**
 * Displays registration success and error messages from URL params
 * Separated to isolate useSearchParams in its own Suspense boundary
 */
function LoginMessages() {
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");
  const resetSuccess = searchParams.get("resetSuccess");
  const error = searchParams.get("error");
  const t = useTranslations("auth.login");
  const tVerification = useTranslations("auth.verification");

  return (
    <>
      {/* Registration Success Message */}
      {registered && (
        <div className="mb-4 rounded-lg alert-success p-3 text-sm">
          {t("successMessage")}
        </div>
      )}

      {/* Password Reset Success Message */}
      {resetSuccess && (
        <div className="mb-4 rounded-lg alert-success p-3 text-sm">
          {tVerification("passwordResetSuccess")}
        </div>
      )}

      {/* NextAuth Error Message */}
      {error && (
        <div className="mb-4 rounded-lg alert-error p-3 text-sm">
          {t("errorMessage")}
        </div>
      )}
    </>
  );
}

/**
 * Login form component
 * Separated from messages to prevent re-renders when searchParams change
 */
function LoginForm() {
  const router = useRouter();
  const t = useTranslations("auth.login");
  const tErrors = useTranslations("errors");
  const tVerification = useTranslations("auth.verification");

  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [emailNotVerified, setEmailNotVerified] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const [isResending, setIsResending] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = useCallback(
    async (data: LoginInput) => {
      setIsLoading(true);
      setServerError(null);
      setEmailNotVerified(false);

      try {
        const result = await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        if (result?.error) {
          // Check if error is EMAIL_NOT_VERIFIED
          if (result.error === "EMAIL_NOT_VERIFIED") {
            setEmailNotVerified(true);
            setUserEmail(data.email);
            setServerError(null);
          } else {
            // NextAuth returns generic errors, display user-friendly message
            setServerError(t("invalidCredentials"));
          }
          setIsLoading(false);
          return;
        }

        if (result?.ok) {
          // Redirect to dashboard on success
          router.push("/dashboard");
          router.refresh();
        }
      } catch (error) {
        console.error("Login error:", error);
        setServerError(t("unexpectedError"));
        setIsLoading(false);
      }
    },
    [router, t]
  );

  const handleResendVerification = async () => {
    setIsResending(true);

    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail }),
      });

      if (response.ok) {
        addToast({
          title: tVerification("emailSent", { email: userEmail }),
          color: "success",
        });
      } else {
        addToast({
          title: tErrors("sendEmailFailed"),
          color: "danger",
        });
      }
    } catch {
      addToast({
        title: tErrors("unexpectedError"),
        color: "danger",
      });
    } finally {
      setIsResending(false);
    }
  };

  const togglePasswordVisibility = useCallback(() => {
    setIsPasswordVisible((prev) => !prev);
  }, []);

  return (
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
        autoComplete="email"
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
        autoComplete="current-password"
        endContent={
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
            aria-label={isPasswordVisible ? t("hidePassword") : t("showPassword")}
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

      {/* Server Error */}
      {serverError && (
        <div className="rounded-lg alert-error p-3 text-sm">{serverError}</div>
      )}

      {/* Email Not Verified Error */}
      {emailNotVerified && (
        <div className="rounded-lg alert-warning p-3 text-sm space-y-2">
          <p className="font-medium">{tVerification("notVerified")}</p>
          <p>{tVerification("notVerifiedDescription")}</p>
          <Button
            size="sm"
            color="primary"
            variant="flat"
            onPress={handleResendVerification}
            isLoading={isResending}
          >
            {tVerification("resendEmail")}
          </Button>
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

      {/* Forgot Password Link */}
      <div className="text-center">
        <Link
          href="/forgot-password"
          className="text-sm text-primary hover:underline"
        >
          {tVerification("forgotPasswordLink")}
        </Link>
      </div>

      {/* Registration Link */}
      <p className="text-center text-sm text-caption">
        {t("noAccount")}{" "}
        <Link href="/register" className="text-primary hover:underline">
          {t("registerLink")}
        </Link>
      </p>
    </form>
  );
}

/**
 * Login page content
 * Combines messages (with Suspense) and form components
 */
function LoginPageContent() {
  const t = useTranslations("auth.login");
  const tCommon = useTranslations("common");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-page-gradient px-4 py-12 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-primary">Auth Template</h1>
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col gap-1 px-6 pt-6">
          <h1 className="text-2xl font-bold text-heading">{t("title")}</h1>
          <p className="text-sm text-caption">{t("subtitle")}</p>
        </CardHeader>
        <CardBody className="px-6 pb-6">
          {/* Messages in separate Suspense to prevent form re-renders */}
          <Suspense
            fallback={
              <div className="text-center text-caption">{tCommon("loading")}</div>
            }
          >
            <LoginMessages />
          </Suspense>
          {/* Form is outside Suspense to maintain state independently */}
          <LoginForm />
        </CardBody>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return <LoginPageContent />;
}
