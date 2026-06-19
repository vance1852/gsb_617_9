import {
  defineConfig,
  presetUno,
  presetIcons,
  transformerDirectives,
  transformerVariantGroup,
} from "unocss";

const buildScale = (name: string) => {
  const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
  return shades.reduce<Record<string, string>>((acc, s) => {
    acc[s] = `var(--nexa-${name}-${s})`;
    return acc;
  }, {});
};

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
  theme: {
    colors: {
      primary: buildScale("primary"),
      surface: buildScale("surface"),
      success: {
        100: "var(--nexa-success-100, #dcfce7)",
        500: "var(--nexa-success-500)",
        600: "var(--nexa-success-600)",
        700: "var(--nexa-success-700, #15803d)",
      },
      warning: {
        100: "var(--nexa-warning-100, #fef3c7)",
        500: "var(--nexa-warning-500)",
        600: "var(--nexa-warning-600)",
        700: "var(--nexa-warning-700, #b45309)",
      },
      error: {
        100: "var(--nexa-error-100, #fee2e2)",
        500: "var(--nexa-error-500)",
        600: "var(--nexa-error-600)",
        700: "var(--nexa-error-700, #b91c1c)",
      },
      info: {
        100: "var(--nexa-info-100, #dbeafe)",
        500: "var(--nexa-info-500)",
        600: "var(--nexa-info-600)",
        700: "var(--nexa-info-700, #1d4ed8)",
      },
    },
    fontFamily: {
      sans: "var(--nexa-font-sans)",
      mono: "var(--nexa-font-mono)",
    },
  },
  shortcuts: {
    "nexa-transition": "transition-all duration-200 ease-out",
    "nexa-focus-ring":
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
    "nexa-shadow-sm": "shadow-[0_1px_2px_0_rgb(0_0_0_/_0.05)]",
    "nexa-shadow-md":
      "shadow-[0_4px_6px_-1px_rgb(0_0_0_/_0.1),0_2px_4px_-2px_rgb(0_0_0_/_0.1)]",
    "nexa-shadow-lg":
      "shadow-[0_10px_15px_-3px_rgb(0_0_0_/_0.1),0_4px_6px_-4px_rgb(0_0_0_/_0.1)]",
  },
  safelist: [
    "i-mdi-loading",
    "i-mdi-check",
    "i-mdi-close",
    "i-mdi-alert",
    "i-mdi-information",
  ],
});
