import { describe, expect, it } from "vitest";
import { NOT_FOUND, PAGES, normalizePath, pageForPath } from "./sitio";

describe("páginas del sitio", () => {
  it("encuentra la página de cada ruta, con o sin barra final", () => {
    expect(pageForPath("/")?.file).toBe("index");
    expect(pageForPath("/menu")?.file).toBe("menu");
    expect(pageForPath("/catering/")?.file).toBe("catering");
    expect(pageForPath("/about")?.label).toBe("Nosotros");
  });

  it("no inventa página para una ruta desconocida", () => {
    expect(pageForPath("/no-existe")).toBeUndefined();
    expect(pageForPath("/menu/tacos")).toBeUndefined();
  });

  it("normaliza la barra final sin tocar la raíz", () => {
    expect(normalizePath("/")).toBe("/");
    expect(normalizePath("/menu/")).toBe("/menu");
    expect(normalizePath("/menu")).toBe("/menu");
  });

  it("conserva el orden de la navegación y el título de 404", () => {
    expect(PAGES.map((p) => p.label)).toEqual(["Inicio", "Menú", "Catering", "Nosotros"]);
    expect(NOT_FOUND.title).toBe("Página no encontrada — El Taquito Gordo Feliz");
  });
});
