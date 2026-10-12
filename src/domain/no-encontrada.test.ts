import { describe, expect, it } from "vitest";
import { NO_ENCONTRADA, ROBOTS_NO_ENCONTRADA } from "./no-encontrada";
import { pageForPath } from "./sitio";

describe("contenido de NoEncontrada", () => {
  it("conserva los textos de 404.html", () => {
    expect(NO_ENCONTRADA.antetitulo).toBe("Error 404");
    expect(NO_ENCONTRADA.titulo).toBe("Esta página se fue por tacos");
    expect(NO_ENCONTRADA.subtitulo).toBe("No encontramos lo que buscabas.");
    expect(NO_ENCONTRADA.parrafo).toBe(
      "Puede que el enlace esté mal escrito o que la página ya no exista. Desde aquí puedes volver al inicio o ir directo al menú.",
    );
  });

  it("ofrece dos salidas: botón al inicio y enlace al menú, en ese orden", () => {
    expect(NO_ENCONTRADA.salidas.map((s) => [s.etiqueta, s.destino, s.variante])).toEqual([
      ["Volver al inicio", "/", "primaria"],
      ["Ver el menú", "/menu", "enlace"],
    ]);
  });

  it("cada salida lleva a una página que existe", () => {
    for (const salida of NO_ENCONTRADA.salidas) {
      expect(pageForPath(salida.destino), salida.destino).toBeDefined();
    }
  });

  it("la imagen es decorativa y reserva su tamaño", () => {
    expect(NO_ENCONTRADA.imagen).toEqual({
      src: "/img/fotos/logo-full-500.webp",
      width: 500,
      height: 500,
      alt: "",
    });
  });

  it("no se indexa", () => {
    expect(ROBOTS_NO_ENCONTRADA).toBe("noindex");
  });
});
