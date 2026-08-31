import js from "@eslint/js";
import globals from "globals"
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: [
      "dist/",
      "build/",
      "node_modules/",
      "coverage/"
    ]
  },
  { files: ["**/*.{js,mjs,cjs}"], plugins: { js }, extends: ["js/recommended"], languageOptions: { globals: globals.browser } },
]);
