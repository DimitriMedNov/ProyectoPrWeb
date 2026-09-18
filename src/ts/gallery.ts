/**
 * Botón de pausa del carrusel de fotos (página About).
 *
 * El avance es una animación CSS; aquí solo se alterna data-paused, que el CSS
 * traduce en animation-play-state. Con prefers-reduced-motion el carrusel no
 * avanza solo y el botón se oculta desde el CSS.
 */
export function initGallery(): void {
  const gallery = document.querySelector<HTMLElement>("[data-gallery]");
  const toggle = gallery?.querySelector<HTMLButtonElement>("[data-gallery-toggle]");
  if (!gallery || !toggle) return;

  toggle.addEventListener("click", () => {
    const paused = gallery.dataset.paused !== "true";
    gallery.dataset.paused = String(paused);
    toggle.textContent = paused ? "Reanudar fotos" : "Pausar fotos";
  });
}
