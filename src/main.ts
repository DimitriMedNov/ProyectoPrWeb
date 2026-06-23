import "./styles/main.css";
import { initMenu } from "./ts/menu";

// Año dinámico en el footer (todas las páginas).
function initYear(): void {
  document.querySelectorAll<HTMLElement>("[data-year]").forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });
}

initMenu();
initYear();
