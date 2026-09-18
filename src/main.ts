import { initMenu } from "./ts/menu";
import { initGallery } from "./ts/gallery";
import "./ts/reveal";
import "./ts/menu-page";

// Año dinámico en el footer (todas las páginas).
function initYear(): void {
  document.querySelectorAll<HTMLElement>("[data-year]").forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });
}

initMenu();
initYear();
initGallery();
