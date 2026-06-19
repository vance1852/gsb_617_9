import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import UnoCSS from "unocss/vite";
import dts from "vite-plugin-dts";
import { resolve } from "path";
import { rmSync, writeFileSync, existsSync, mkdirSync } from "fs";

const nTableDts = `import type { DefineComponent } from "vue";

export interface NTableColumn<T = any> {
  key: keyof T & string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  resizable?: boolean;
  width?: string;
}

export interface NTableProps<T extends Record<string, unknown> = Record<string, unknown>> {
  data: T[];
  columns: NTableColumn<T>[];
  striped?: boolean;
  compact?: boolean;
  stickyHeader?: boolean;
  virtualScroll?: boolean;
  rowHeight?: number;
  visibleRows?: number;
  pageSize?: number;
  currentPage?: number;
}

declare const NTable: DefineComponent<NTableProps<any>>;

export { NTable };
export default NTable;
`;

function postBuildFix() {
  return {
    name: "post-build-fix",
    closeBundle() {
      const testDtsFiles = [
        "dist/components/Avatar/NAvatar.test.d.ts",
        "dist/components/Badge/NBadge.test.d.ts",
        "dist/components/Breadcrumb/NBreadcrumb.test.d.ts",
        "dist/components/Button/NButton.test.d.ts",
        "dist/components/Card/NCard.test.d.ts",
        "dist/components/Input/NInput.test.d.ts",
        "dist/components/Modal/NModal.test.d.ts",
        "dist/components/Skeleton/NSkeleton.test.d.ts",
        "dist/components/Table/NTable.test.d.ts",
        "dist/components/Tabs/NTabs.test.d.ts",
        "dist/components/Toast/NToast.test.d.ts",
      ];
      const extraFiles = [
        "dist/App.d.ts",
        "dist/counter.d.ts",
        "dist/main.d.ts",
        "dist/vite.svg",
        "dist/vite-env.d.ts",
      ];
      [...testDtsFiles, ...extraFiles].forEach((f) => {
        try {
          rmSync(resolve(__dirname, f), { force: true });
        } catch {}
      });

      const tableDir = resolve(__dirname, "dist/components/Table");
      if (!existsSync(tableDir)) mkdirSync(tableDir, { recursive: true });
      writeFileSync(resolve(tableDir, "NTable.d.ts"), nTableDts, "utf-8");
    },
  };
}

export default defineConfig(({ command }) => {
  const isLibBuild = command === "build";

  return {
    plugins: [
      vue(),
      UnoCSS(),
      ...(isLibBuild
        ? [
            dts({
              tsconfigPath: "./tsconfig.json",
              outDir: "dist",
              entryRoot: "src",
              insertTypesEntry: true,
              cleanVueFileName: true,
            }),
            postBuildFix(),
          ]
        : []),
    ],
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
    },
    server: {
      port: 5173,
      open: true,
    },
    build: isLibBuild
      ? {
          lib: {
            entry: resolve(__dirname, "src/index.ts"),
            name: "NexaUI",
            cssFileName: "style",
            fileName: (format) => {
              if (format === "es") return "nexa-ui.js";
              if (format === "umd") return "nexa-ui.umd.cjs";
              return `nexa-ui.${format}`;
            },
            formats: ["es", "umd"],
          },
          cssCodeSplit: false,
          rollupOptions: {
            external: ["vue", "@vueuse/motion"],
            output: {
              exports: "named",
              globals: {
                vue: "Vue",
                "@vueuse/motion": "VueUseMotion",
              },
            },
          },
          outDir: "dist",
          emptyOutDir: true,
        }
      : {
          outDir: "dist-demo",
        },
    test: {
      globals: true,
      environment: "jsdom",
      css: true,
    },
  };
});
