import {
  defineConfig,
  presetUno,
  presetIcons,
  presetAttributify,
} from "unocss";

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
  ],
  theme: {
    colors: {
      primary: {
        50: "#f5f3ff",
        100: "#ede9fe",
        200: "#ddd6fe",
        300: "#c4b5fd",
        400: "#a78bfa",
        500: "#8b5cf6",
        600: "#7c3aed",
        700: "#6d28d9",
        800: "#5b21b6",
        900: "#4c1d95",
      },
      surface: {
        0: "#ffffff",
        50: "#f8fafc",
        100: "#f1f5f9",
        200: "#e2e8f0",
        300: "#cbd5e1",
        400: "#94a3b8",
        500: "#64748b",
        600: "#475569",
        700: "#334155",
        800: "#1e293b",
        900: "#0f172a",
      },
      success: {
        500: "#22c55e",
        600: "#16a34a",
      },
      warning: {
        500: "#f59e0b",
        600: "#d97706",
      },
      error: {
        500: "#ef4444",
        600: "#dc2626",
      },
      info: {
        500: "#3b82f6",
        600: "#2563eb",
      },
    },
  },
  shortcuts: {
    "nexa-transition": "transition-all duration-200 ease-in-out",
    "nexa-focus-ring":
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
  },
  safelist: [
    "bg-primary-50",
    "bg-primary-100",
    "text-primary-600",
    "text-primary-700",
    "bg-success-100",
    "text-success-700",
    "bg-error-100",
    "text-error-700",
  ],
});
