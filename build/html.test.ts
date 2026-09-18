import { describe, expect, it } from "vitest";
import { carta, specials } from "../src/data/menu";
import { sharedHtml } from "./html";

// Ejecuta el plugin como lo haría Vite sobre un HTML de una página concreta.
const transform = (html: string, page = "menu") => {
  const hook = sharedHtml().transformIndexHtml as unknown as {
    handler: (html: string, ctx: { filename: string }) => string;
  };
  return hook.handler(html, { filename: `/proyecto/${page}.html` });
};

describe("plugin de HTML compartido", () => {
  it("marca la página actual en la navegación y no la repite en el pie", () => {
    const html = transform('<!--#header current="menu"--><!--#footer current="menu"-->');
    expect(html).toContain('href="/menu" aria-current="page"');
    const pie = html.slice(html.indexOf("<footer"));
    expect(pie).not.toContain('href="/menu"');
    expect(pie).toContain("Proyecto universitario");
  });

  it("genera todos los platillos de la carta con su precio", () => {
    const html = transform("<!--#carta-->");
    const total = carta.reduce((n, c) => n + c.dishes.length, 0);
    expect(html.match(/class="carta-item"/g)).toHaveLength(total);
    expect(html).toContain("$2.50");
  });

  it("no repite la etiqueta Vegetariano en un platillo vegano", () => {
    const html = transform("<!--#carta-->");
    const hongos = html.slice(html.indexOf("Hongos al ajillo"), html.indexOf("</li>", html.indexOf("Hongos al ajillo")));
    expect(hongos).toContain("Vegano");
    expect(hongos).not.toContain("Vegetariano");
  });

  it("genera las especialidades desde los datos", () => {
    const html = transform('<!--#specials variant="home"-->');
    for (const s of specials) expect(html).toContain(s.name);
  });

  it("añade canonical y vuelve absoluta la imagen para compartir", () => {
    const html = transform('<head><meta property="og:image" content="/og.png" /></head>');
    expect(html).toContain('<link rel="canonical" href="https://taquito.vercel.app/menu" />');
    expect(html).toContain('content="https://taquito.vercel.app/og.png"');
  });

  it("falla con un marcador desconocido en vez de dejarlo en la página", () => {
    expect(() => transform("<!--#inventado-->")).toThrow(/marcador desconocido/);
  });
});
