// ESLint (flat config): reglas recomendadas de JavaScript y TypeScript.
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default tseslint.config(
  { ignores: ["dist", "node_modules", "assets-src", ".claude", "test-results", "playwright-report"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // Código que corre en el navegador.
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: { globals: globals.browser },
  },
  {
    // React: reglas de hooks y recarga en caliente.
    files: ["src/**/*.{ts,tsx}"],
    plugins: { "react-hooks": reactHooks, "react-refresh": reactRefresh },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
    },
  },
  {
    // Código de registro (shadcn, Animate UI, Bklit): se copia tal cual viene y se
    // actualiza desde su fuente, así que no se le aplican las reglas estrictas.
    files: ["src/components/ui/**", "src/components/animate-ui/**", "src/components/charts/**", "src/hooks/use-controlled-state.tsx", "src/hooks/use-auto-height.tsx", "src/hooks/use-is-in-view.tsx", "src/lib/get-strict-context.tsx"],
    rules: {
      "react-hooks/refs": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/exhaustive-deps": "off",
      "react-hooks/immutability": "off",
      "react-hooks/purity": "off",
      "react-hooks/static-components": "off",
      "react-refresh/only-export-components": "off",
      "no-useless-assignment": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  {
    // Código que corre en Node: build, función de Vercel, scripts y config.
    files: ["build/**/*.ts", "api/**/*.ts", "tests/**/*.ts", "scripts/**/*.mjs", "*.config.{js,ts}"],
    languageOptions: { globals: globals.node },
  },
);
