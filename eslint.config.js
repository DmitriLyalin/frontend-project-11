import js from "@eslint/js";
import globals from "globals";
import { defineConfig, globalIgnores  } from "eslint/config";

export default defineConfig([
   globalIgnores([".github/*", "node_modules/*", "playwright-report/**", "playwright.config.js"]), { files: ["**/*.{js,mjs,cjs}"], plugins: { js }, extends: ["js/recommended"], languageOptions: { globals: globals.browser } },
]);
