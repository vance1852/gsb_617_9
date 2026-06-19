import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import UnoCSS from "unocss/vite";
import dts from "vite-plugin-dts";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    vue(),
    UnoCSS(),
    dts({
      tsconfigPath: "./tsconfig.json",
      outDir: "dist",
      insertTypesEntry: true,
      exclude: [
        "src/**/*.test.ts",
        "src/App.vue",
        "src/main.ts",
        "src/counter.ts",
        "src/typescript.svg",
      ],
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "NexaUI",
      fileName: "nexa-ui",
      formats: ["es", "umd"],
    },
    rollupOptions: {
      external: ["vue", "@vueuse/motion"],
      output: {
        exports: "named",
        globals: {
          vue: "Vue",
          "@vueuse/motion": "VueUseMotion",
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === "style.css" || assetInfo.name?.endsWith(".css"))
            return "style.css";
          return assetInfo.name!;
        },
      },
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: [],
  },
});
