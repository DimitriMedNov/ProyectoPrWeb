import { describe, expect, it } from "vitest";
import { DELIVERY_INICIO, HERO_INICIO, MENU_INICIO, especialidadesDePortada } from "./inicio";
import { specials } from "./menu";
import type { Special } from "./menu";
import { PAGES } from "./sitio";

const platillo = (name: string, price: number, width: number, height: number): Special => ({
  name,
  description: `Descripción de ${name}`,
  price,
  tags: [],
  image: { src: `/photos/${name}.png`, alt: `Foto de ${name}`, width, height },
  highlights: [],
});

describe("especialidadesDePortada", () => {
  it("muestra las tres especialidades del catálogo, en su orden y con su precio", () => {
    const tarjetas = especialidadesDePortada(specials);
    expect(tarjetas.map((t) => [t.nombre, t.precio])).toEqual([
      ["El Taco-Liz", "$2.35"],
      ["El Burrito-Sabanero", "$4.00"],
      ["El Nacho-licious", "$4.25"],
    ]);
  });

  it("no filtra ni reordena: una tarjeta por platillo, en el orden recibido", () => {
    const catalogo = [platillo("B", 3, 10, 10), platillo("A", 1, 10, 10), platillo("C", 2, 10, 10)];
    expect(especialidadesDePortada(catalogo).map((t) => t.nombre)).toEqual(["B", "A", "C"]);
    expect(especialidadesDePortada([])).toEqual([]);
  });

  it("conserva descripción e imagen exactas y carga la imagen en diferido", () => {
    const [taco] = especialidadesDePortada(specials);
    expect(taco?.descripcion).toBe(specials[0]?.description);
    expect(taco?.imagen).toEqual({
      src: "/photos/rsz_11rsz_1taco2.png",
      alt: "Taco El Taco-Liz",
      width: 128,
      height: 128,
      carga: "lazy",
    });
  });

  it("marca como apaisada solo la foto más ancha que alta", () => {
    expect(especialidadesDePortada(specials).map((t) => t.apaisada)).toEqual([false, true, false]);
    const [cuadrada, alta] = especialidadesDePortada([platillo("X", 1, 50, 50), platillo("Y", 1, 40, 50)]);
    expect(cuadrada?.apaisada).toBe(false);
    expect(alta?.apaisada).toBe(false);
  });

  it("cada tarjeta lleva el botón «Pedir ahora» hacia Catering", () => {
    for (const t of especialidadesDePortada(specials)) {
      expect(t.accion).toEqual({ texto: "Pedir ahora", destino: "/catering" });
    }
  });
});

describe("contenidos de la portada", () => {
  it("todos los enlaces apuntan a rutas que existen en el sitio", () => {
    const rutas = PAGES.map((p) => p.path);
    const destinos = [
      HERO_INICIO.accionPrincipal.destino,
      HERO_INICIO.accionSecundaria.destino,
      MENU_INICIO.enlace.destino,
    ];
    for (const d of destinos) expect(rutas).toContain(d);
  });

  it("las anclas de sección son home, menu y delivery", () => {
    expect([HERO_INICIO.ancla, MENU_INICIO.ancla, DELIVERY_INICIO.ancla]).toEqual(["home", "menu", "delivery"]);
  });

  it("la mascota carga de inmediato y los logotipos en diferido", () => {
    expect(HERO_INICIO.imagen.carga).toBe("eager");
    expect(DELIVERY_INICIO.imagen.carga).toBe("lazy");
  });
});
