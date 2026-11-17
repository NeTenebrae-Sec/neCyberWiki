import js from "@eslint/js"
import tseslint from "typescript-eslint"
import astro from "eslint-plugin-astro"

export default tseslint.config(
  {
    ignores: [
      "dist/",
      "node_modules/",
      ".astro/",
      ".agents/",
      ".playwright-mcp/",
      "content/",
      "EJEMPLOS/",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  {
    rules: {
      "no-empty": ["error", { allowEmptyCatch: true }],
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  {
    files: ["scripts/**/*.mjs", "tests/**/*.mjs", "*.config.mjs", "*.config.js"],
    languageOptions: {
      globals: {
        console: "readonly",
        process: "readonly",
      },
    },
  },
)
