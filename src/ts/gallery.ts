/**
 * Galería deslizable de la página About.
 *
 * El desplazamiento y el encaje por foto son CSS (scroll-snap): sin JavaScript
 * la galería se recorre igual con el dedo, el trackpad o el teclado. Aquí solo
 * se añaden los botones anterior/siguiente y el contador "2 / 6". Los botones
 * usan aria-disabled en los extremos para no perder el foco.
 */
export function initGallery(): void {
  const gallery = document.querySelector<HTMLElement>("[data-gallery]");
  const track = gallery?.querySelector<HTMLElement>("[data-gallery-track]");
  const controls = gallery?.querySelector<HTMLElement>("[data-gallery-controls]");
  const prev = gallery?.querySelector<HTMLButtonElement>("[data-gallery-prev]");
  const next = gallery?.querySelector<HTMLButtonElement>("[data-gallery-next]");
  const status = gallery?.querySelector<HTMLElement>("[data-gallery-status]");
  if (!track || !controls || !prev || !next || !status) return;

  const total = track.children.length;
  const current = () => Math.round(track.scrollLeft / track.clientWidth);

  const sync = () => {
    const i = current();
    status.textContent = `${i + 1} / ${total}`;
    prev.setAttribute("aria-disabled", String(i <= 0));
    next.setAttribute("aria-disabled", String(i >= total - 1));
  };

  const go = (delta: number) => {
    const target = Math.min(total - 1, Math.max(0, current() + delta));
    track.scrollTo({ left: target * track.clientWidth });
  };

  prev.addEventListener("click", () => prev.getAttribute("aria-disabled") !== "true" && go(-1));
  next.addEventListener("click", () => next.getAttribute("aria-disabled") !== "true" && go(1));

  // El contador se actualiza cuando el desplazamiento se detiene.
  let timer = 0;
  track.addEventListener(
    "scroll",
    () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(sync, 80);
    },
    { passive: true },
  );
  window.addEventListener("resize", sync);

  controls.hidden = false;
  sync();
}
