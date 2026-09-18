/**
 * Plugin de Vite hecho a mano (sin dependencias): sustituye marcadores en los
 * HTML por piezas compartidas al compilar y en desarrollo.
 *
 *   <!--#header current="menu"-->
 *   <!--#footer current="index" credit="…" suffix="…"-->
 *   <!--#specials variant="home|menu"-->
 *   <!--#carta-->            categorías de la carta en /menu
 *   <!--#menu-tabs-->        pestañas de categoría de /menu
 *   <!--#packages-->         tarjetas de paquete de /catering
 *   <!--#package-options-->  opciones de paquete del formulario
 *   <!--#addons-->           casillas de complementos del formulario
 *   <!--#colonias-->         opciones del select de colonia
 *
 * El resultado es HTML estático: la página se ve completa sin JavaScript.
 */
import type { Plugin } from "vite";
import {
  carta,
  cateringPackages,
  cateringRules,
  money,
  specials,
  type Category,
  type Dish,
  type Icon,
  type Tag,
} from "../src/data/menu";

type Page = "index" | "menu" | "catering" | "about";

const NAV: { page: Page; href: string; label: string }[] = [
  { page: "index", href: "/", label: "Inicio" },
  { page: "menu", href: "/menu", label: "Menú" },
  { page: "catering", href: "/catering", label: "Catering" },
  { page: "about", href: "/about", label: "Nosotros" },
];

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const icon = (name: Icon | "check" | "menu" | "chile", cls: string) =>
  `<svg class="${cls}" aria-hidden="true"><use href="/icons.svg#${name}" /></svg>`;

const reveal = (delay: number) =>
  delay ? ` data-reveal data-reveal-delay="${delay}"` : " data-reveal";

// ----- Cabecera y pie -----

function header(current: Page | undefined): string {
  const items = NAV.map(({ page, href, label }) =>
    page === current
      ? `          <li><a href="${href}" aria-current="page" class="flex min-h-11 items-center px-4 text-meta font-medium text-arc">${label}</a></li>`
      : `          <li><a href="${href}" class="flex min-h-11 items-center px-4 text-meta text-txt hover:text-arc">${label}</a></li>`,
  ).join("\n");
  return `<header class="site-header">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-2 md:px-10">
        <a href="/" class="flex min-h-11 items-center gap-2.5">
          <img src="/img/logo-120.webp" alt="" width="40" height="40" class="h-10 w-10 rounded-full" />
          <span class="font-display text-body font-semibold text-arc">El Taquito Gordo Feliz</span>
        </a>
        <button
          id="menu-icon"
          type="button"
          class="grid h-11 w-11 place-items-center rounded-full text-txt md:hidden"
          aria-label="Abrir menú"
          aria-controls="navbar"
          aria-expanded="false"
        >
          ${icon("menu", "icon size-6")}
        </button>
        <ul id="navbar" class="flex items-center gap-1">
${items}
        </ul>
      </div>
    </header>`;
}

function footer(current: Page | undefined, credit = "", suffix = ""): string {
  const links = NAV.filter(({ page }) => page !== current)
    .map(({ href, label }) => `          <a href="${href}" class="hit-link px-2 hover:text-ink-txt">${label}</a>`)
    .join("\n");
  return `<footer class="bg-ink py-12 text-center text-label text-ink-mut">
      <div class="mx-auto flex max-w-7xl flex-col items-center gap-3 px-6">
        <nav class="flex flex-wrap justify-center gap-x-4">
${links}
        </nav>
        <p>Avn. San Ramón Norte I, Montes de Ame, Santa Gertrudis Copo y Montebello</p>
        <p class="text-caption">© <span data-year>2026</span> ${esc(credit)}D'mitri Medina Novelo &amp; William Moran Ramírez.${esc(suffix)}</p>
      </div>
    </footer>`;
}

// ----- Menú -----

/** Clases de la imagen según su proporción (el burrito es más ancho que alto). */
const imgClass = (s: (typeof specials)[number], size: "home" | "menu") => {
  const wide = s.image.width > s.image.height;
  if (size === "home") return wide ? "h-28 w-32" : "size-28";
  return wide ? "h-32 w-36" : "size-32";
};

function specialsHome(): string {
  return specials
    .map((s, i) => {
      const extra =
        i === 2 ? " sm:col-span-2 sm:mx-auto sm:w-1/2 lg:col-span-1 lg:w-auto" : "";
      return `          <article class="panel lift flex flex-col items-center px-6 pt-8 pb-8 text-center${extra}"${reveal(i * 0.08)}>
            <div class="plate grid size-36 place-items-center rounded-full">
              <img src="${s.image.src}" alt="${esc(s.image.alt)}" width="${s.image.width}" height="${s.image.height}" class="${imgClass(s, "home")} object-contain" loading="lazy" />
            </div>
            <h3 class="mt-6 text-title font-semibold text-txt">${esc(s.name)}</h3>
            <p class="mt-2 text-meta text-mut">${esc(s.description)}</p>
            <span class="mt-4 text-headline font-semibold text-arc">${money(s.price)}</span>
            <a href="/catering" class="btn-secondary mt-5">Pedir ahora</a>
          </article>`;
    })
    .join("\n\n");
}

function specialsMenu(): string {
  return specials
    .map(
      (s, i) => `          <article data-dish data-tags="${s.tags.join(" ")}" class="panel lift flex flex-col p-6 sm:flex-row sm:items-center sm:gap-6 lg:flex-col lg:items-stretch lg:gap-0"${reveal(i * 0.08)}>
            <div class="plate mx-auto grid size-40 shrink-0 place-items-center rounded-full sm:mx-0 lg:mx-auto">
              <img src="${s.image.src}" alt="${esc(s.image.alt)}" width="${s.image.width}" height="${s.image.height}" class="${imgClass(s, "menu")} object-contain" loading="lazy" />
            </div>
            <div class="mt-6 flex flex-1 flex-col sm:mt-0 lg:mt-6">
              <div class="flex items-baseline justify-between gap-4">
                <h3 class="text-title font-semibold text-txt">${esc(s.name)}</h3>
                <span class="text-title font-semibold text-arc">${money(s.price)}</span>
              </div>
              <p class="mt-2 text-body text-mut">${esc(s.description)}</p>
              <ul class="mt-4 flex flex-wrap gap-2" aria-label="Lleva">
${s.highlights.map((h) => `                <li class="chip">${esc(h)}</li>`).join("\n")}
              </ul>
            </div>
          </article>`,
    )
    .join("\n\n");
}

const TAGS: Record<Tag, { icon: "leaf" | "chile"; color: string; label: string }> = {
  vegetariano: { icon: "leaf", color: "text-acc-cilantro", label: "Vegetariano" },
  vegano: { icon: "leaf", color: "text-acc-cilantro", label: "Vegano" },
  picante: { icon: "chile", color: "text-arc", label: "Picante" },
};

function cartaItem(d: Dish): string {
  // Vegano implica vegetariano: no se repite la etiqueta.
  const shown = d.tags.filter((t) => !(t === "vegetariano" && d.tags.includes("vegano")));
  const tags = shown.length
    ? `\n                  <p class="carta-tags">${shown
        .map((t) => `<span class="inline-flex items-center gap-1">${icon(TAGS[t].icon, `icon size-3.5 ${TAGS[t].color}`)}${TAGS[t].label}</span>`)
        .join("")}</p>`
    : "";
  return `                <li class="carta-item" data-dish data-tags="${d.tags.join(" ")}">
                  <div class="carta-line">
                    <h4 class="carta-name">${esc(d.name)}</h4>
                    <span class="carta-leader" aria-hidden="true"></span>
                    <span class="carta-price">${money(d.price)}</span>
                  </div>
                  <p class="carta-desc">${esc(d.description)}</p>${tags}
                </li>`;
}

function cartaCategory(c: Category): string {
  return `            <section id="${c.id}" class="carta-cat menu-section" data-menu-section aria-labelledby="${c.id}-titulo">
              <header class="carta-head">
                <span class="plate grid size-10 shrink-0 place-items-center rounded-full">${icon(c.icon, "icon size-5")}</span>
                <div>
                  <h3 id="${c.id}-titulo" class="text-title font-semibold text-txt">${esc(c.title)}</h3>
                  <p class="text-meta text-mut">${esc(c.note)}</p>
                </div>
              </header>
              <ul>
${c.dishes.map(cartaItem).join("\n")}
              </ul>
            </section>`;
}

const cartaHtml = () => carta.map(cartaCategory).join("\n");

/** Pestañas de /menu: especialidades y luego una por categoría de la carta. */
const menuTabs = () =>
  [{ id: "especialidades", title: "Especialidades" }, ...carta]
    .map((c) => `          <li><a class="menu-tab" href="#${c.id}">${esc(c.title)}</a></li>`)
    .join("\n");

// ----- Catering -----

function packages(): string {
  return cateringPackages
    .map((p, i) => {
      const featured = Boolean(p.featuredLabel);
      const badge = featured
        ? `\n              <span class="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-fill px-3 py-1 text-caption font-semibold text-on-fill">${esc(p.featuredLabel!)}</span>`
        : "";
      return `            <article class="panel lift package-card${featured ? " is-featured" : ""}"${reveal(i * 0.08)}>${badge}
              <div class="plate mb-5 grid size-16 place-items-center rounded-2xl">${icon(p.icon, "icon size-9")}</div>
              <h3 class="text-title font-semibold text-txt">${esc(p.name)}</h3>
              <p class="mt-1 text-meta text-mut">${esc(p.summary)}</p>
              <p class="mt-4"><span class="text-headline font-semibold text-arc">${money(p.pricePerPerson, 0)}</span><span class="text-label text-mut"> / persona</span></p>
              <ul class="mt-4 flex-1 space-y-2 text-meta text-mut">
${p.features.map((f) => `                <li class="flex gap-2">${icon("check", "icon mt-0.5 text-arc")} ${esc(f)}</li>`).join("\n")}
              </ul>
              <button type="button" class="${featured ? "btn-primary" : "btn-secondary"} mt-6" data-open-modal data-package="${esc(p.name)}">Elegir ${esc(p.name)}</button>
            </article>`;
    })
    .join("\n\n");
}

function packageOptions(): string {
  return cateringPackages
    .map(
      (p, i) => `              <label class="pkg-option">
                <input class="sr-only" type="radio" name="catering" value="${esc(p.name)}" data-price="${p.pricePerPerson}" required${i === 0 ? " checked" : ""} />
                <span class="pkg-card">
                  <span class="plate grid size-11 place-items-center rounded-xl">${icon(p.icon, "icon size-6")}</span>
                  <span class="mt-3 block text-meta font-semibold text-txt">${esc(p.name)}</span>
                  <span class="block text-label text-mut">${money(p.pricePerPerson, 0)} / persona</span>
                  ${icon("check", "pkg-check icon size-5")}
                </span>
              </label>`,
    )
    .join("\n");
}

const addons = () =>
  cateringRules.addons
    .map(
      (a) => `              <label class="choice-chip">
                <input class="sr-only" type="checkbox" name="complementos" value="${a.value}" />
                <span>${icon("check", "chip-check icon size-4")}${esc(a.label)}</span>
              </label>`,
    )
    .join("\n");

const colonias = () =>
  cateringRules.colonias.map((c) => `                  <option value="${esc(c)}">${esc(c)}</option>`).join("\n");

// ----- Plugin -----

const DIRECTIVE = /<!--#([\w-]+)((?:\s+[\w-]+="[^"]*")*)\s*-->/g;

function render(name: string, attrs: Record<string, string>): string {
  const current = attrs.current as Page | undefined;
  switch (name) {
    case "header":
      return header(current);
    case "footer":
      return footer(current, attrs.credit, attrs.suffix);
    case "specials":
      return attrs.variant === "menu" ? specialsMenu() : specialsHome();
    case "carta":
      return cartaHtml();
    case "menu-tabs":
      return menuTabs();
    case "packages":
      return packages();
    case "package-options":
      return packageOptions();
    case "addons":
      return addons();
    case "colonias":
      return colonias();
    default:
      throw new Error(`build/html.ts: marcador desconocido <!--#${name}-->`);
  }
}

export function sharedHtml(): Plugin {
  return {
    name: "taquito-shared-html",
    transformIndexHtml: {
      order: "pre",
      handler: (html) =>
        html.replace(DIRECTIVE, (_, name: string, rawAttrs: string) => {
          const attrs = Object.fromEntries(
            [...rawAttrs.matchAll(/([\w-]+)="([^"]*)"/g)].map((m) => [m[1], m[2]]),
          );
          return render(name, attrs);
        }),
    },
  };
}
