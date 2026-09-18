/**
 * Página de menú: filtro por etiqueta (vegetariano, vegano, picante) y
 * pestañas de categoría que marcan la sección visible.
 *
 * Mejora progresiva: sin JavaScript el menú se ve completo, las pestañas son
 * anclas normales y el filtro no aparece (nace con el atributo hidden).
 */

/** Muestra solo los platillos con la etiqueta elegida; "" muestra todos. */
function initMenuFilter(): void {
  const bar = document.querySelector<HTMLElement>("[data-menu-filter]");
  if (!bar) return;

  const buttons = Array.from(bar.querySelectorAll<HTMLButtonElement>("[data-filter]"));
  const dishes = Array.from(document.querySelectorAll<HTMLElement>("[data-dish]"));
  const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-menu-section]"));
  const count = bar.querySelector<HTMLElement>("[data-menu-count]");
  const empty = document.querySelector<HTMLElement>("[data-menu-empty]");

  const apply = (tag: string) => {
    let visible = 0;
    dishes.forEach((dish) => {
      const match = !tag || (dish.dataset.tags ?? "").split(" ").includes(tag);
      dish.hidden = !match;
      if (match) visible += 1;
    });

    // Una categoría sin platillos visibles se oculta junto con su pestaña.
    sections.forEach((section) => {
      const hasDishes = section.querySelector("[data-dish]:not([hidden])") !== null;
      section.hidden = !hasDishes;
      const tab = document.querySelector<HTMLElement>(`.menu-tab[href="#${section.id}"]`);
      tab?.closest("li")?.toggleAttribute("hidden", !hasDishes);
    });

    buttons.forEach((btn) => btn.setAttribute("aria-pressed", String(btn.dataset.filter === tag)));
    if (empty) empty.hidden = visible > 0;
    if (count) count.textContent = `${visible} ${visible === 1 ? "platillo" : "platillos"}`;
  };

  buttons.forEach((btn) => btn.addEventListener("click", () => apply(btn.dataset.filter ?? "")));
  bar.hidden = false;
}

/** Marca la pestaña de la categoría que ocupa la parte alta de la pantalla. */
function initScrollSpy(): void {
  const list = document.querySelector<HTMLElement>("[data-menu-tabs]");
  if (!list || typeof IntersectionObserver === "undefined") return;

  const tabs = Array.from(list.querySelectorAll<HTMLAnchorElement>(".menu-tab"));
  const byId = new Map(tabs.map((tab) => [tab.hash.slice(1), tab]));

  const setActive = (id: string) => {
    tabs.forEach((tab) => tab.removeAttribute("aria-current"));
    const tab = byId.get(id);
    if (!tab) return;
    tab.setAttribute("aria-current", "true");
    // En móvil las pestañas se desplazan en horizontal: trae la activa a la vista
    // sin mover la página en vertical.
    const left = tab.offsetLeft - (list.clientWidth - tab.offsetWidth) / 2;
    list.scrollTo({ left, behavior: "smooth" });
  };

  // Con la carta a dos columnas pueden cruzar la franja dos categorías a la vez:
  // gana la primera en el orden de las pestañas.
  const inView = new Set<string>();
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) inView.add(entry.target.id);
        else inView.delete(entry.target.id);
      });
      const first = tabs.find((tab) => inView.has(tab.hash.slice(1)));
      if (first) setActive(first.hash.slice(1));
    },
    // Una franja fina bajo la barra y las pestañas: la sección que la cruza es la activa.
    { rootMargin: "-30% 0px -65% 0px" },
  );

  document.querySelectorAll<HTMLElement>("[data-menu-section]").forEach((s) => observer.observe(s));
}

initMenuFilter();
initScrollSpy();
