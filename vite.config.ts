import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { sharedHtml } from "./build/html";
import { resolve } from "node:path";

// Sitio estático multipágina (MPA). Cada HTML es un punto de entrada.
export default defineConfig({
  plugins: [sharedHtml(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        catering: resolve(__dirname, "catering.html"),
        about: resolve(__dirname, "about.html"),
        menu: resolve(__dirname, "menu.html"),
      },
    },
  },
});
