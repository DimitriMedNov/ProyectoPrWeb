import { configDefaults, defineConfig } from "vitest/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { sharedHtml, sharedInMain } from "./build/html";
import { apiDev } from "./build/api-dev";
import { resolve } from "node:path";

// Sitio estático multipágina (MPA). Cada HTML es un punto de entrada.
export default defineConfig({
  plugins: [sharedHtml(), sharedInMain(), apiDev(), react(), tailwindcss()],
  test: {
    exclude: [
      ...configDefaults.exclude,
      ".claude/**",
      "test-results/**",
      "playwright-report/**",
      "dist/**",
      "node_modules/**",
    ],
  },
  resolve: { alias: { "@": resolve(__dirname, "src") } },
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        catering: resolve(__dirname, "catering.html"),
        about: resolve(__dirname, "about.html"),
        menu: resolve(__dirname, "menu.html"),
        notFound: resolve(__dirname, "404.html"),
      },
    },
  },
});
