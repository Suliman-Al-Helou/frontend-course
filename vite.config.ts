import { defineConfig } from "vite-plus";

export default defineConfig({
  fmt: {
    ignorePatterns: [".agents/**", "docs/**", "deep-twelve/**", ".next/**"],
  },
  lint: {
    ignorePatterns: [".agents/**", "docs/**", "deep-twelve/**", ".next/**"],
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: { "vite-plus/prefer-vite-plus-imports": "error" },
    options: { typeAware: true, typeCheck: true },
  },
});
