// ESLint (flat config): reglas recomendadas de JavaScript y TypeScript.
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist", "node_modules", "assets-src"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // Código que corre en el navegador.
    files: ["src/**/*.ts"],
    languageOptions: { globals: globals.browser },
  },
  {
    // Código que corre en Node: build, función de Vercel, scripts y config.
    files: ["build/**/*.ts", "api/**/*.ts", "tests/**/*.ts", "scripts/**/*.mjs", "*.config.{js,ts}"],
    languageOptions: { globals: globals.node },
  },
);
