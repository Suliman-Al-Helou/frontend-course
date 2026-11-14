import { defineConfig } from "vite-plus";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  fmt: {
    ignorePatterns: [".agents/**", ".impeccable/**", "docs/**", "deep-twelve/**", ".next/**"],
  },
  lint: {
    ignorePatterns: [".agents/**", ".impeccable/**", "docs/**", "deep-twelve/**", ".next/**"],
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: { "vite-plus/prefer-vite-plus-imports": "error" },
    options: { typeAware: true, typeCheck: true },
  },
});
