"use client";

import { useTheme } from "next-themes";
import { Button } from "@heroui/react";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

/**
 * Simple theme toggle button for public pages
 * Toggles between light and dark mode
 */
export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const t = useTranslations("common");

  // Avoid hydration mismatch - this pattern is recommended by next-themes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        isIconOnly
        variant="flat"
        size="sm"
        className="min-h-11 min-w-11 rounded-full bg-default-100 dark:bg-default-200"
        aria-label={t("toggleTheme")}
      >
        <Sun className="w-5 h-5" />
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      isIconOnly
      variant="flat"
      size="sm"
      className="min-h-11 min-w-11 rounded-full bg-default-100 dark:bg-default-200"
      aria-label={isDark ? t("switchToLight") : t("switchToDark")}
      onPress={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <Sun className="w-5 h-5 text-warning" /> : <Moon className="w-5 h-5 text-primary" />}
    </Button>
  );
}
