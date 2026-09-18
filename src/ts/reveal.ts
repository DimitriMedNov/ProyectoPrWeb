/**
 * Revela los bloques [data-reveal] cuando entran en pantalla.
 *
 * El elemento nace visible y aquí solo se oculta si podemos garantizar que
 * volverá a mostrarse: sin IntersectionObserver o con movimiento reducido no
 * se toca nada, y un plazo de seguridad lo muestra todo aunque el observador
 * no llegue a dispararse. data-reveal-delay (en segundos) escalona tarjetas.
 *
 * Se ejecuta al importarse para poder cargarlo en cualquier página sin tocar
 * su script de entrada.
 */
const FAILSAFE = 2500;

function initReveal(): void {
  const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
  if (!nodes.length) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced || typeof IntersectionObserver === "undefined") return;

  const show = (node: HTMLElement) => {
    node.dataset.hidden = "false";
  };

  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        show(entry.target as HTMLElement);
        observer.unobserve(entry.target);
      }),
    { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
  );

  nodes.forEach((node) => {
    node.dataset.hidden = "true";
    const delay = node.dataset.revealDelay;
    node.style.transitionDelay = delay ? `${delay}s` : "";
    observer.observe(node);
  });

  window.setTimeout(() => {
    nodes.forEach(show);
    observer.disconnect();
  }, FAILSAFE);
}

initReveal();
