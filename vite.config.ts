import { defineConfig } from "vite-plus";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  test: {
    include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    exclude: ["e2e/**", "node_modules/**"],
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  fmt: {
    ignorePatterns: [
      ".agents/**",
      ".impeccable/**",
      "docs/**",
      "deep-twelve/**",
      ".next/**",
      "src/types/api.generated.ts",
    ],
  },
  lint: {
    ignorePatterns: [
      ".agents/**",
      ".impeccable/**",
      "docs/**",
      "deep-twelve/**",
      ".next/**",
      "src/types/api.generated.ts",
    ],
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: { "vite-plus/prefer-vite-plus-imports": "error" },
    options: { typeAware: true, typeCheck: true },
  },
});
