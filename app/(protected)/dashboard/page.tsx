"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Tabs,
  Tab,
  Snippet,
  Chip,
} from "@heroui/react";
import { useTranslations } from "next-intl";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import {
  LogOut,
  Database,
  Mail,
  Globe,
  AlertCircle,
} from "lucide-react";

/**
 * Dashboard page with setup guides
 * Shows database configuration tabs and email service setup
 */
export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const t = useTranslations("dashboard");
  const tCommon = useTranslations("common");

  // Get environment info from public env vars
  const dbAdapter = process.env.NEXT_PUBLIC_DATABASE_ADAPTER || "memory";
  const emailAdapter = process.env.NEXT_PUBLIC_EMAIL_ADAPTER || "console";

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-page-gradient">
        <p className="text-default-500">{tCommon("loading")}</p>
      </div>
    );
  }

  if (!session) {
    router.push("/login");
    return null;
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <div className="min-h-screen bg-page-gradient">
      {/* Header */}
      <header className="bg-content1 border-b border-divider">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary">Auth Template</h1>
            <p className="text-sm text-default-500">
              {t("welcomeBack", { name: session.user?.name || session.user?.email })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button
              variant="flat"
              color="danger"
              size="sm"
              startContent={<LogOut className="w-4 h-4" />}
              onPress={handleSignOut}
            >
              {t("signOut")}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Status Cards */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {/* Database Status */}
          <Card>
            <CardBody className="flex flex-row items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Database className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-default-500">{t("databaseAdapter")}</p>
                <p className="font-semibold">{dbAdapter.toUpperCase()}</p>
              </div>
              {dbAdapter === "memory" ? (
                <Chip color="warning" size="sm" variant="flat">
                  {t("demoMode")}
                </Chip>
              ) : (
                <Chip color="success" size="sm" variant="flat">
                  {t("connected")}
                </Chip>
              )}
            </CardBody>
          </Card>

          {/* Email Status */}
          <Card>
            <CardBody className="flex flex-row items-center gap-4">
              <div className="p-3 rounded-lg bg-secondary/10">
                <Mail className="w-6 h-6 text-secondary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-default-500">{t("emailAdapter")}</p>
                <p className="font-semibold">{emailAdapter.toUpperCase()}</p>
              </div>
              {emailAdapter === "console" ? (
                <Chip color="warning" size="sm" variant="flat">
                  {t("demoMode")}
                </Chip>
              ) : (
                <Chip color="success" size="sm" variant="flat">
                  {t("configured")}
                </Chip>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Setup Guide */}
        <Card className="mb-8">
          <CardHeader className="pb-0">
            <h2 className="text-xl font-bold">{t("setupGuide")}</h2>
          </CardHeader>
          <CardBody>
            <p className="text-default-500 mb-4">{t("setupGuideDescription")}</p>

            <Tabs aria-label="Database setup guides" color="primary" variant="bordered">
              {/* PostgreSQL Tab */}
              <Tab key="postgresql" title="PostgreSQL">
                <div className="py-4 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-sm font-bold">
                      1
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{t("installPrisma")}</p>
                      <Snippet className="mt-2" size="sm">
                        npm install prisma @prisma/client
                      </Snippet>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-sm font-bold">
                      2
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{t("initPrisma")}</p>
                      <Snippet className="mt-2" size="sm">
                        npx prisma init
                      </Snippet>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-sm font-bold">
                      3
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{t("setEnvVars")}</p>
                      <Snippet className="mt-2" size="sm">
                        DATABASE_URL=postgresql://user:password@localhost:5432/mydb
                      </Snippet>
                      <Snippet className="mt-2" size="sm">
                        DATABASE_ADAPTER=prisma-postgres
                      </Snippet>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-sm font-bold">
                      4
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{t("runMigrations")}</p>
                      <Snippet className="mt-2" size="sm">
                        npx prisma migrate dev
                      </Snippet>
                    </div>
                  </div>
                </div>
              </Tab>

              {/* MySQL Tab */}
              <Tab key="mysql" title="MySQL">
                <div className="py-4 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-sm font-bold">
                      1
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{t("installPrisma")}</p>
                      <Snippet className="mt-2" size="sm">
                        npm install prisma @prisma/client
                      </Snippet>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-sm font-bold">
                      2
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{t("setEnvVars")}</p>
                      <Snippet className="mt-2" size="sm">
                        DATABASE_URL=mysql://user:password@localhost:3306/mydb
                      </Snippet>
                      <Snippet className="mt-2" size="sm">
                        DATABASE_ADAPTER=prisma-mysql
                      </Snippet>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-sm font-bold">
                      3
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{t("runMigrations")}</p>
                      <Snippet className="mt-2" size="sm">
                        npx prisma migrate dev
                      </Snippet>
                    </div>
                  </div>
                </div>
              </Tab>

              {/* SQLite Tab */}
              <Tab key="sqlite" title="SQLite">
                <div className="py-4 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-sm font-bold">
                      1
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{t("installPrisma")}</p>
                      <Snippet className="mt-2" size="sm">
                        npm install prisma @prisma/client
                      </Snippet>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-sm font-bold">
                      2
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{t("setEnvVars")}</p>
                      <Snippet className="mt-2" size="sm">
                        DATABASE_URL=file:./dev.db
                      </Snippet>
                      <Snippet className="mt-2" size="sm">
                        DATABASE_ADAPTER=prisma-sqlite
                      </Snippet>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-sm font-bold">
                      3
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{t("runMigrations")}</p>
                      <Snippet className="mt-2" size="sm">
                        npx prisma migrate dev
                      </Snippet>
                    </div>
                  </div>
                </div>
              </Tab>

              {/* MongoDB Tab */}
              <Tab key="mongodb" title="MongoDB">
                <div className="py-4 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-sm font-bold">
                      1
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{t("installMongoDB")}</p>
                      <Snippet className="mt-2" size="sm">
                        npm install mongodb
                      </Snippet>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-sm font-bold">
                      2
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{t("setEnvVars")}</p>
                      <Snippet className="mt-2" size="sm">
                        MONGODB_URI=mongodb://localhost:27017/mydb
                      </Snippet>
                      <Snippet className="mt-2" size="sm">
                        DATABASE_ADAPTER=mongodb
                      </Snippet>
                    </div>
                  </div>
                </div>
              </Tab>

              {/* Supabase Tab */}
              <Tab key="supabase" title="Supabase">
                <div className="py-4 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-sm font-bold">
                      1
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{t("createSupabaseProject")}</p>
                      <p className="text-sm text-default-500 mt-1">
                        {t("createSupabaseProjectDescription")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-sm font-bold">
                      2
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{t("installPrisma")}</p>
                      <Snippet className="mt-2" size="sm">
                        npm install prisma @prisma/client
                      </Snippet>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-sm font-bold">
                      3
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{t("setEnvVars")}</p>
                      <Snippet className="mt-2" size="sm">
                        DATABASE_URL=postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres
                      </Snippet>
                      <Snippet className="mt-2" size="sm">
                        DATABASE_ADAPTER=supabase
                      </Snippet>
                    </div>
                  </div>
                </div>
              </Tab>

              {/* PlanetScale Tab */}
              <Tab key="planetscale" title="PlanetScale">
                <div className="py-4 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-sm font-bold">
                      1
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{t("createPlanetScaleDB")}</p>
                      <p className="text-sm text-default-500 mt-1">
                        {t("createPlanetScaleDBDescription")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-sm font-bold">
                      2
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{t("installPrisma")}</p>
                      <Snippet className="mt-2" size="sm">
                        npm install prisma @prisma/client
                      </Snippet>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-sm font-bold">
                      3
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{t("setEnvVars")}</p>
                      <Snippet className="mt-2" size="sm">
                        DATABASE_URL=mysql://[user]:[password]@[host]/[database]?ssl={"{}"}
                      </Snippet>
                      <Snippet className="mt-2" size="sm">
                        DATABASE_ADAPTER=planetscale
                      </Snippet>
                    </div>
                  </div>

                  <div className="p-3 bg-warning/10 rounded-lg mt-4">
                    <p className="text-sm text-warning-600 dark:text-warning-400">
                      <AlertCircle className="w-4 h-4 inline mr-2" />
                      {t("planetScaleNote")}
                    </p>
                  </div>
                </div>
              </Tab>
            </Tabs>
          </CardBody>
        </Card>

        {/* Email Service Setup */}
        <Card className="mb-8">
          <CardHeader className="pb-0">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold">{t("emailSetup")}</h2>
            </div>
          </CardHeader>
          <CardBody>
            <p className="text-default-500 mb-4">{t("emailSetupDescription")}</p>

            <Tabs aria-label="Email service setup" color="primary" variant="bordered">
              {/* Resend Tab */}
              <Tab key="resend" title="Resend">
                <div className="py-4 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-sm font-bold">
                      1
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{t("installResend")}</p>
                      <Snippet className="mt-2" size="sm">
                        npm install resend
                      </Snippet>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-sm font-bold">
                      2
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{t("setEnvVars")}</p>
                      <Snippet className="mt-2" size="sm">
                        RESEND_API_KEY=re_xxxxxxxxxxxx
                      </Snippet>
                      <Snippet className="mt-2" size="sm">
                        EMAIL_FROM=noreply@yourdomain.com
                      </Snippet>
                      <Snippet className="mt-2" size="sm">
                        EMAIL_ADAPTER=resend
                      </Snippet>
                    </div>
                  </div>
                </div>
              </Tab>

              {/* SendGrid Tab */}
              <Tab key="sendgrid" title="SendGrid">
                <div className="py-4 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-sm font-bold">
                      1
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{t("installSendGrid")}</p>
                      <Snippet className="mt-2" size="sm">
                        npm install @sendgrid/mail
                      </Snippet>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-sm font-bold">
                      2
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{t("setEnvVars")}</p>
                      <Snippet className="mt-2" size="sm">
                        SENDGRID_API_KEY=SG.xxxxxxxxxxxx
                      </Snippet>
                      <Snippet className="mt-2" size="sm">
                        EMAIL_FROM=noreply@yourdomain.com
                      </Snippet>
                      <Snippet className="mt-2" size="sm">
                        EMAIL_ADAPTER=sendgrid
                      </Snippet>
                    </div>
                  </div>
                </div>
              </Tab>

              {/* Console Tab */}
              <Tab key="console" title="Console (Demo)">
                <div className="py-4">
                  <div className="p-4 bg-warning/10 rounded-lg">
                    <p className="text-sm text-warning-600 dark:text-warning-400">
                      <AlertCircle className="w-4 h-4 inline mr-2" />
                      {t("consoleEmailWarning")}
                    </p>
                  </div>
                  <div className="mt-4">
                    <p className="text-default-500">{t("consoleEmailDescription")}</p>
                    <Snippet className="mt-2" size="sm">
                      EMAIL_ADAPTER=console
                    </Snippet>
                  </div>
                </div>
              </Tab>
            </Tabs>
          </CardBody>
        </Card>

        {/* i18n Setup */}
        <Card>
          <CardHeader className="pb-0">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold">{t("i18nSetup")}</h2>
            </div>
          </CardHeader>
          <CardBody>
            <p className="text-default-500 mb-4">{t("i18nSetupDescription")}</p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-sm font-bold">
                  1
                </div>
                <div className="flex-1">
                  <p className="font-medium">{t("addTranslations")}</p>
                  <p className="text-sm text-default-500 mt-1">
                    {t("addTranslationsDescription")}
                  </p>
                  <Snippet className="mt-2" size="sm">
                    i18n/locales/[lang]/common.json
                  </Snippet>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-sm font-bold">
                  2
                </div>
                <div className="flex-1">
                  <p className="font-medium">{t("updateConfig")}</p>
                  <p className="text-sm text-default-500 mt-1">
                    {t("updateConfigDescription")}
                  </p>
                  <Snippet className="mt-2" size="sm">
                    i18n/config.ts
                  </Snippet>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-sm font-bold">
                  3
                </div>
                <div className="flex-1">
                  <p className="font-medium">{t("setDefaultLocale")}</p>
                  <Snippet className="mt-2" size="sm">
                    DEFAULT_LOCALE=en
                  </Snippet>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </main>
    </div>
  );
}
