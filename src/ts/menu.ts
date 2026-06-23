/**
 * Menú móvil + sombra del header al hacer scroll.
 *
 * Reemplaza al main.js original, que tenía dos bugs:
 *  1. window.onscroll hacía toggle del menú en cada scroll (parpadeaba).
 *  2. Si la página no tenía #menu-icon / .navbar, lanzaba TypeError y
 *     rompía todo el JS. Aquí salimos temprano si no existen.
 */
export function initMenu(): void {
  const menuBtn = document.querySelector<HTMLButtonElement>("#menu-icon");
  const navbar = document.querySelector<HTMLElement>("#navbar");
  const header = document.querySelector<HTMLElement>("header");

  if (menuBtn && navbar) {
    const close = () => {
      navbar.classList.remove("is-open");
      menuBtn.setAttribute("aria-expanded", "false");
    };

    menuBtn.addEventListener("click", () => {
      const isOpen = navbar.classList.toggle("is-open");
      menuBtn.setAttribute("aria-expanded", String(isOpen));
    });

    // Cerrar el menú al pulsar un enlace o la tecla Escape.
    navbar.querySelectorAll("a").forEach((link) => link.addEventListener("click", close));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
  }

  if (header) {
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }
}
