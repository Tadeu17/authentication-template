import type { Config } from "tailwindcss";
import { heroui } from "@heroui/react";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      addCommonColors: true,
      themes: {
        light: {
          colors: {
            background: "#ffffff",
            foreground: "#11181C",
            // Surface colors for cards, sidebars, etc.
            content1: "#ffffff", // Card backgrounds
            content2: "#f4f4f5", // Subtle backgrounds (gray-100)
            content3: "#e4e4e7", // Borders, dividers
            content4: "#d4d4d8", // Disabled backgrounds
            // Default colors (used by many components)
            default: {
              50: "#fafafa",
              100: "#f4f4f5",
              200: "#e4e4e7",
              300: "#d4d4d8",
              400: "#a1a1aa",
              500: "#71717a",
              600: "#52525b",
              700: "#3f3f46",
              800: "#27272a",
              900: "#18181b",
              foreground: "#11181C",
              DEFAULT: "#d4d4d8",
            },
            // Brand colors
            primary: {
              50: "#e6f4fc",
              100: "#c2e4f8",
              200: "#9ad3f4",
              300: "#6dc0ef",
              400: "#47b1eb",
              500: "#3B82F6", // Main brand blue
              600: "#2563EB",
              700: "#1D4ED8",
              800: "#1E40AF",
              900: "#1E3A8A",
              DEFAULT: "#3B82F6",
              foreground: "#ffffff",
            },
            // Secondary color (purple accent)
            secondary: {
              50: "#faf5ff",
              100: "#f3e8ff",
              200: "#e9d5ff",
              300: "#d8b4fe",
              400: "#c084fc",
              500: "#a855f7",
              600: "#9333ea",
              700: "#7c3aed",
              800: "#6b21a8",
              900: "#581c87",
              DEFAULT: "#8B5CF6",
              foreground: "#ffffff",
            },
            // Focus ring color (brand blue)
            focus: "#3B82F6",
          },
        },
        dark: {
          colors: {
            background: "#111827", // gray-900
            foreground: "#f3f4f6", // gray-100
            // Surface colors for cards, sidebars, etc.
            content1: "#1f2937", // gray-800 - Card backgrounds
            content2: "#374151", // gray-700 - Subtle backgrounds
            content3: "#4b5563", // gray-600 - Borders, dividers
            content4: "#6b7280", // gray-500 - Disabled backgrounds
            // Default colors (used by many components)
            default: {
              50: "#18181b",
              100: "#27272a",
              200: "#3f3f46",
              300: "#52525b",
              400: "#71717a",
              500: "#a1a1aa",
              600: "#d4d4d8",
              700: "#e4e4e7",
              800: "#f4f4f5",
              900: "#fafafa",
              foreground: "#f3f4f6",
              DEFAULT: "#3f3f46",
            },
            // Brand colors
            primary: {
              50: "#1E3A8A",
              100: "#1E40AF",
              200: "#1D4ED8",
              300: "#2563EB",
              400: "#3B82F6",
              500: "#60A5FA", // Lighter for dark mode
              600: "#93C5FD",
              700: "#BFDBFE",
              800: "#DBEAFE",
              900: "#EFF6FF",
              DEFAULT: "#60A5FA",
              foreground: "#111827",
            },
            // Secondary color (purple accent)
            secondary: {
              50: "#581c87",
              100: "#6b21a8",
              200: "#7c3aed",
              300: "#9333ea",
              400: "#a855f7",
              500: "#c084fc", // Lighter for dark mode
              600: "#d8b4fe",
              700: "#e9d5ff",
              800: "#f3e8ff",
              900: "#faf5ff",
              DEFAULT: "#A78BFA",
              foreground: "#111827",
            },
            // Focus ring color (brand blue, lighter for dark mode)
            focus: "#60A5FA",
          },
        },
      },
      layout: {
        // Consistent border radius
        radius: {
          small: "0.375rem", // 6px
          medium: "0.5rem", // 8px
          large: "0.75rem", // 12px
        },
      },
    }),
  ],
};

export default config;
