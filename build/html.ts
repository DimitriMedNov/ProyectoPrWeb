/**
 * Plugin de Vite hecho a mano (sin dependencias). El contenido de las páginas
 * lo pinta React; aquí queda solo lo que tiene que estar en el HTML servido:
 *
 * - Inter (Google Fonts) antes de la hoja principal: en desarrollo, enlazada;
 *   al compilar, sus reglas `@font-face` van dentro del HTML (`fetchFontCss`),
 *   así el primer pintado no espera a un servidor de terceros;
 * - `og:image` con URL absoluta;
 * - `canonical` y `og:url` en las 4 páginas indexables (no en 404);
 * - `sitemap.xml` al compilar;
 * - la imagen principal de cada ruta, adelantada con `<link rel="preload">`;
 * - en `npm run dev` y `npm run preview`, una ruta desconocida sirve 404.html,
 *   igual que hace Vercel (las rutas limpias `/menu`, `/catering`, `/about` las
 *   resuelve Vite a su `.html`).
 */
import { basename } from "node:path";
import type { IncomingMessage, ServerResponse } from "node:http";
import type { Plugin } from "vite";
import { NOT_FOUND, PAGES, SITE_URL } from "./site";

const FONT_CSS_URL = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap";
const FONT_FILES_PRECONNECT = '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />';

/** Inter enlazada (en paralelo con la hoja principal), con preconnect a Google Fonts. */
const FONT_LINKS = `<link rel="preconnect" href="https://fonts.googleapis.com" />
    ${FONT_FILES_PRECONNECT}
    <link rel="stylesheet" href="${FONT_CSS_URL}" />
    `;

/** Google Fonts responde según el navegador: con este recibe woff2 y `unicode-range`. */
const FONT_USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";
/** Solo reglas `@font-face` con `font-display: swap` y archivos de fonts.gstatic.com. */
const FONT_FACE = /^@font-face\{[^{}<>]*font-display:\s*swap;[^{}<>]*src:\s*url\(https:\/\/fonts\.gstatic\.com\/[\w./-]+\)[^{}<>]*\}$/;

/**
 * Deja la hoja de Google Fonts lista para ir dentro de un `<style>`: sin
 * comentarios ni saltos. Devuelve `null` si no es exactamente lo esperado (lo que
 * llega de la red no se copia al HTML sin comprobarlo).
 */
export function inlineableFontCss(css: string): string | null {
  const rules = css
    .replace(/\/\*[^*]*\*\//g, "")
    .split("}")
    .map((rule) => rule.replace(/\s+/g, " ").replace(/\s*([{;])\s*/g, "$1").trim())
    .filter(Boolean)
    .map((rule) => `${rule}}`);
  return rules.length > 0 && rules.every((rule) => FONT_FACE.test(rule)) ? rules.join("") : null;
}

/**
 * Pide a Google Fonts las reglas de Inter para meterlas en el HTML. Si no hay
 * red, tarda más de 5 s o la respuesta no es la esperada, devuelve `null` y el
 * build sigue con la hoja enlazada, como en desarrollo.
 */
export async function fetchFontCss(): Promise<string | null> {
  try {
    const res = await fetch(FONT_CSS_URL, { headers: { "user-agent": FONT_USER_AGENT }, signal: AbortSignal.timeout(5000) });
    return res.ok ? inlineableFontCss(await res.text()) : null;
  } catch {
    return null;
  }
}

/** Inter antes de la hoja principal: enlazada, o con sus reglas dentro del HTML si se pudieron traer. */
const fontHead = (fontCss: string | null) =>
  fontCss ? `${FONT_FILES_PRECONNECT}\n    <style data-font="inter">${fontCss}</style>\n    ` : FONT_LINKS;

/** canonical + og:url, y og:image absoluta (los rastreadores no resuelven rutas relativas). */
function seoHead(html: string, file: string, fontCss: string | null): string {
  html = html.replace('<link rel="stylesheet" href="/src/styles/main.css" />', (m) => fontHead(fontCss) + m);
  html = html.replace('content="/og.png"', `content="${SITE_URL}/og.png"`);
  const head = [routeImagePreload(file)];
  const page = PAGES.find((p) => p.file === file);
  if (page) {
    const url = `${SITE_URL}${page.path}`;
    head.push(`<link rel="canonical" href="${url}" />`, `<meta property="og:url" content="${url}" />`);
  }
  const extra = head.filter(Boolean);
  return extra.length ? html.replace(/[ \t]*<\/head>/, () => `${extra.map((tag) => `    ${tag}\n`).join("")}  </head>`) : html;
}

function sitemap(): string {
  const today = new Date().toISOString().slice(0, 10);
  const urls = PAGES.map(
    (p) => `  <url><loc>${SITE_URL}${p.path}</loc><lastmod>${today}</lastmod></url>`,
  ).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

/**
 * ¿Esta petición es una navegación a una ruta que no existe? Solo documentos
 * HTML sin extensión; nunca `/api/*` ni los módulos internos de Vite.
 */
export function isUnknownRoute(url: string, accept = ""): boolean {
  const path = url.split(/[?#]/)[0].replace(/\/+$/, "") || "/";
  if (!accept.includes("text/html")) return false;
  if (path.startsWith("/api/") || path === "/api" || path.startsWith("/@") || path.startsWith("/src/")) return false;
  if (/\.[\w-]+$/.test(path)) return false;
  return !PAGES.some((p) => p.path === path || `/${p.file}` === path) && path !== `/${NOT_FOUND.file}`;
}

type Next = (err?: unknown) => void;

/** Reescribe las rutas desconocidas a /404.html (con código 404, como Vercel). */
const notFoundFallback = (req: IncomingMessage, res: ServerResponse, next: Next) => {
  if ((req.method === "GET" || req.method === "HEAD") && req.url && isUnknownRoute(req.url, req.headers.accept)) {
    req.url = `/${NOT_FOUND.file}.html`;
    // Vite y sirv responden 200 al servir el archivo: se fija el 404 al escribir.
    const writeHead = res.writeHead.bind(res) as (...args: unknown[]) => ServerResponse;
    res.writeHead = ((status: number, ...rest: unknown[]) =>
      writeHead(status === 200 ? 404 : status, ...rest)) as typeof res.writeHead;
    const end = res.end.bind(res) as (...args: unknown[]) => ServerResponse;
    res.end = ((...args: unknown[]) => {
      if (!res.headersSent && res.statusCode === 200) res.statusCode = 404;
      return end(...args);
    }) as typeof res.end;
  }
  next();
};

export function sharedHtml(): Plugin {
  let building = false;
  /** Reglas de Inter traídas al compilar; `null` = se enlaza la hoja de Google Fonts. */
  let fontCss: string | null = null;
  return {
    name: "taquito-shared-html",
    configResolved(config) {
      building = config.command === "build";
    },
    async buildStart() {
      if (!building) return;
      fontCss = await fetchFontCss();
      if (!fontCss) this.warn("No se pudo traer la hoja de Inter de Google Fonts: se deja enlazada (bloquea el primer pintado).");
    },
    transformIndexHtml: {
      order: "pre",
      handler: (html, ctx) => seoHead(html, basename(ctx.filename, ".html"), fontCss),
    },
    configureServer(server) {
      server.middlewares.use(notFoundFallback);
    },
    configurePreviewServer(server) {
      server.middlewares.use(notFoundFallback);
    },
    generateBundle() {
      this.emitFile({ type: "asset", fileName: "sitemap.xml", source: sitemap() });
    },
  };
}

/** Imagen del primer pantallazo de una ruta. Mismos `srcset` y `sizes` que su `<img>`. */
export interface RouteImage {
  href: string;
  srcset?: string;
  sizes?: string;
  /** Consulta de medios: la precarga solo se hace donde la imagen cae en el primer pantallazo. */
  media?: string;
}

/**
 * Imagen que adelanta cada HTML (clave: nombre del archivo sin extensión). Sin
 * esto el navegador no sabe que existe hasta que React pinta la página. Repiten
 * las del contenido de cada pantalla; `build/html.test.ts` falla si dejan de
 * coincidir. La carta no tiene imagen en el primer pantallazo.
 */
export const ROUTE_IMAGES: Readonly<Record<string, RouteImage>> = {
  index: {
    href: "/img/mascota-surf.webp",
    srcset: "/img/mascota-surf-720.webp 720w, /img/mascota-surf.webp 955w",
    sizes: "(min-width: 1024px) 34rem, (min-width: 420px) 24rem, 92vw",
  },
  catering: {
    href: "/img/fotos/food-800.webp",
    srcset: "/img/fotos/food-640.webp 640w, /img/fotos/food-720.webp 720w, /img/fotos/food-800.webp 800w",
    sizes: "(min-width: 1280px) 33rem, (min-width: 1024px) 41vw, 92vw",
  },
  // Por debajo de 640 px la mascota queda bajo el texto, fuera del primer pantallazo: adelantarla
  // solo le quitaría ancho de banda al JavaScript que pinta el título.
  about: { href: "/img/fotos/logo-full-500.webp", media: "(min-width: 640px)" },
  "404": { href: "/img/fotos/logo-full-500.webp" },
};

/** `<link rel="preload">` de la imagen principal de `file`, o cadena vacía si no tiene. */
export function routeImagePreload(file: string): string {
  const image = ROUTE_IMAGES[file];
  if (!image) return "";
  const srcset = image.srcset ? ` imagesrcset="${image.srcset}"` : "";
  const sizes = image.sizes ? ` imagesizes="${image.sizes}"` : "";
  const media = image.media ? ` media="${image.media}"` : "";
  return `<link rel="preload" as="image" href="${image.href}"${srcset}${sizes}${media} fetchpriority="high" />`;
}

/** Módulos que `src/app/paginas.tsx` importa solo para que viajen en el trozo principal. */
const SHARED_IN_MAIN = /\/src\/components\/shared\/(movimiento\/)?index\.ts$/;

/**
 * Las piezas que comparten varias páginas (imagen, tarjeta, precio, entradas en
 * cascada…) se quedan en el trozo principal. Sin esto el empaquetador descarta
 * esos `import` sin uso y reparte las piezas en cinco archivos de menos de 2 kB,
 * cada uno con su petición en la carga de la página.
 */
export function sharedInMain(): Plugin {
  return {
    name: "taquito-shared-in-main",
    apply: "build",
    transform: (_code, id) => (SHARED_IN_MAIN.test(id.split("?")[0]) ? { moduleSideEffects: "no-treeshake" } : null),
  };
}
