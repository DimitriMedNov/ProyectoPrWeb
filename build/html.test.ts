import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { HERO_CATERING } from "../src/components/catering/pagina/contenido";
import { HERO_INICIO } from "../src/domain/inicio";
import { NO_ENCONTRADA } from "../src/domain/no-encontrada";
import { HISTORIA } from "../src/domain/nosotros";
import { inlineableFontCss, isUnknownRoute, ROUTE_IMAGES, routeImagePreload, sharedHtml } from "./html";
import { NOT_FOUND, PAGES } from "./site";

// Ejecuta el plugin como lo haría Vite sobre un HTML de una página concreta.
const transform = (html: string, page = "menu") => {
  const hook = sharedHtml().transformIndexHtml as unknown as {
    handler: (html: string, ctx: { filename: string }) => string;
  };
  return hook.handler(html, { filename: `/proyecto/${page}.html` });
};

const leer = (file: string) => readFileSync(resolve(__dirname, "..", `${file}.html`), "utf8");

describe("plugin de HTML compartido", () => {
  it("añade canonical y vuelve absoluta la imagen para compartir", () => {
    const html = transform('<head><meta property="og:image" content="/og.png" /></head>');
    expect(html).toContain('<link rel="canonical" href="https://taquito.vercel.app/menu" />');
    expect(html).toContain('<meta property="og:url" content="https://taquito.vercel.app/menu" />');
    expect(html).toContain('content="https://taquito.vercel.app/og.png"');
  });

  it("no añade canonical ni og:url a la página 404", () => {
    const html = transform(leer("404"), "404");
    expect(html).not.toContain('rel="canonical"');
    expect(html).not.toContain("og:url");
  });

  it("enlaza Inter con preconnect antes de la hoja principal", () => {
    const html = transform(leer("index"), "index");
    const fuente = html.indexOf("https://fonts.googleapis.com/css2?family=Inter");
    expect(html).toContain('<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />');
    expect(fuente).toBeGreaterThan(-1);
    expect(fuente).toBeLessThan(html.indexOf('href="/src/styles/main.css"'));
  });

  it("adelanta la imagen principal de cada ruta, y nada en la carta", () => {
    const html = transform(leer("catering"), "catering");
    expect(html).toContain(
      '<link rel="preload" as="image" href="/img/fotos/food-800.webp" imagesrcset="/img/fotos/food-640.webp 640w, /img/fotos/food-720.webp 720w, /img/fotos/food-800.webp 800w" imagesizes="(min-width: 1280px) 33rem, (min-width: 1024px) 41vw, 92vw" fetchpriority="high" />',
    );
    expect(transform(leer("index"), "index")).toContain(
      '<link rel="preload" as="image" href="/img/mascota-surf.webp" imagesrcset="/img/mascota-surf-720.webp 720w, /img/mascota-surf.webp 955w" imagesizes="(min-width: 1024px) 34rem, (min-width: 420px) 24rem, 92vw" fetchpriority="high" />',
    );
    expect(transform(leer("404"), "404")).toContain('<link rel="preload" as="image" href="/img/fotos/logo-full-500.webp" fetchpriority="high" />');
    expect(transform(leer("about"), "about")).toContain(
      '<link rel="preload" as="image" href="/img/fotos/logo-full-500.webp" media="(min-width: 640px)" fetchpriority="high" />',
    );
    expect(transform(leer("menu"), "menu")).not.toContain('rel="preload"');
    expect(routeImagePreload("no-existe")).toBe("");
  });

  it("precarga las mismas imágenes que pinta cada pantalla", () => {
    expect(ROUTE_IMAGES.index.href).toBe(HERO_INICIO.imagen.src);
    expect(ROUTE_IMAGES.index.srcset).toBe(HERO_INICIO.imagen.srcSet);
    expect(ROUTE_IMAGES.about.href).toBe(HISTORIA.mascota.src);
    expect(ROUTE_IMAGES["404"].href).toBe(NO_ENCONTRADA.imagen.src);
    expect(ROUTE_IMAGES.catering.href).toBe(HERO_CATERING.foto.src);
    expect(ROUTE_IMAGES.catering.srcset).toBe(HERO_CATERING.foto.srcSet);
    // `sizes` está escrito en el componente: si cambia allí, hay que cambiarlo en ROUTE_IMAGES.
    const hero = readFileSync(resolve(__dirname, "../src/components/catering/pagina/hero-catering.tsx"), "utf8");
    expect(hero).toContain(`sizes="${ROUTE_IMAGES.catering.sizes}"`);
    const mascota = readFileSync(resolve(__dirname, "../src/components/inicio/mascota-hero.tsx"), "utf8");
    expect(mascota).toContain(`SIZES_MASCOTA = "${ROUTE_IMAGES.index.sizes}"`);
  });

  it("solo mete en el HTML reglas @font-face de Google Fonts con swap", () => {
    const regla = (extra = "") =>
      `/* latin */\n@font-face {\n  font-family: 'Inter';\n  font-weight: 400;\n  font-display: swap;\n  src: url(https://fonts.gstatic.com/s/inter/v20/abc-DEF_1.woff2) format('woff2');${extra}\n}\n`;
    const css = inlineableFontCss(regla() + regla());
    expect(css).toMatch(/^@font-face\{[^}]+\}@font-face\{[^}]+\}$/);
    expect(css).not.toContain("/*");
    expect(css).not.toContain("\n");
    expect(inlineableFontCss("")).toBeNull();
    expect(inlineableFontCss("<html>Error</html>")).toBeNull();
    expect(inlineableFontCss(regla() + "body { display: none }")).toBeNull();
    expect(inlineableFontCss(regla().replace("fonts.gstatic.com", "otro.example"))).toBeNull();
    expect(inlineableFontCss(regla().replace("font-display: swap;", ""))).toBeNull();
    expect(inlineableFontCss(regla("</style><script>alert(1)</script>"))).toBeNull();
  });

  it("genera el sitemap con las 4 páginas indexables", () => {
    const emitted: { fileName: string; source: string }[] = [];
    const generate = sharedHtml().generateBundle as unknown as (this: { emitFile: (f: (typeof emitted)[number]) => void }) => void;
    generate.call({ emitFile: (f) => emitted.push(f) });
    expect(emitted).toHaveLength(1);
    expect(emitted[0].fileName).toBe("sitemap.xml");
    for (const p of PAGES) expect(emitted[0].source).toContain(`<loc>https://taquito.vercel.app${p.path}</loc>`);
    expect(emitted[0].source.match(/<url>/g)).toHaveLength(PAGES.length);
  });

  it("manda las rutas desconocidas a 404 sin tocar páginas, /api ni archivos", () => {
    const html = "text/html,application/xhtml+xml";
    expect(isUnknownRoute("/no-existe", html)).toBe(true);
    expect(isUnknownRoute("/menu/tacos?x=1", html)).toBe(true);
    for (const p of PAGES) expect(isUnknownRoute(p.path, html)).toBe(false);
    expect(isUnknownRoute("/menu/", html)).toBe(false);
    expect(isUnknownRoute("/404", html)).toBe(false);
    expect(isUnknownRoute("/api/solicitud", html)).toBe(false);
    expect(isUnknownRoute("/img/logo-120.webp", html)).toBe(false);
    expect(isUnknownRoute("/src/main.tsx", html)).toBe(false);
    expect(isUnknownRoute("/no-existe", "*/*")).toBe(false);
  });
});

describe("los HTML de la raíz", () => {
  it("llevan el mismo título y descripción que src/domain/sitio.ts", () => {
    for (const p of PAGES) {
      const html = leer(p.file);
      expect(html).toContain(`<title>${p.title}</title>`);
      expect(html.replace(/\s+/g, " ")).toContain(`name="description" content="${p.description}"`);
    }
    expect(leer(NOT_FOUND.file)).toContain(`<title>${NOT_FOUND.title}</title>`);
  });

  it("montan la app de React y no dejan marcadores del plugin anterior", () => {
    for (const file of [...PAGES.map((p) => p.file), NOT_FOUND.file]) {
      const html = leer(file);
      expect(html).toContain('<div id="root"></div>');
      expect(html).toContain('<script type="module" src="/src/main.tsx"></script>');
      expect(html).toContain("<noscript>");
      expect(html).not.toContain("<!--#");
    }
  });
});
