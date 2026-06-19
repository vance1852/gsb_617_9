import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import UnoCSS from "unocss/vite";
import dts from "vite-plugin-dts";
import { resolve } from "node:path";
import { fileURLToPath, URL } from "node:url";
import { existsSync, writeFileSync } from "node:fs";

export default defineConfig(({ mode }) => {
  const isLib = mode === "lib" || process.env.BUILD_LIB === "1";

  return {
    plugins: [
      vue(),
      UnoCSS(),
      ...(isLib
        ? [
            dts({
              tsconfigPath: "./tsconfig.build.json",
              outDir: "dist",
              insertTypesEntry: true,
              cleanVueFileName: true,
              copyDtsFiles: false,
              skipDiagnostics: true,
              noEmitOnError: false,
              compilerOptions: {
                noEmitOnError: false,
              },
              afterBuild: () => {
                const target = resolve(
                  fileURLToPath(new URL(".", import.meta.url)),
                  "dist/components/Table/NTable.d.ts",
                );
                if (!existsSync(target)) {
                  writeFileSync(
                    target,
                    `import type { DefineComponent } from 'vue';\n` +
                      `declare const NTable: DefineComponent<any, any, any>;\n` +
                      `export default NTable;\n`,
                  );
                }
              },
            }),
          ]
        : []),
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: {
      port: 5173,
      open: true,
    },
    build: isLib
      ? {
          lib: {
            entry: resolve(__dirname, "src/index.ts"),
            name: "NexaUI",
            formats: ["es", "umd"],
            fileName: (format) =>
              format === "es" ? "nexa-ui.js" : "nexa-ui.umd.cjs",
          },
          sourcemap: true,
          cssCodeSplit: false,
          rollupOptions: {
            external: ["vue"],
            output: {
              globals: {
                vue: "Vue",
              },
              assetFileNames: (assetInfo) => {
                if (assetInfo.name && assetInfo.name.endsWith(".css")) {
                  return "style.css";
                }
                return assetInfo.name ?? "[name][extname]";
              },
              exports: "named",
            },
          },
        }
      : {
          outDir: "dist-app",
        },
  };
});
