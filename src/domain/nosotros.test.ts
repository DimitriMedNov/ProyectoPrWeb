import { describe, expect, it } from "vitest";
import { GALERIA, GALERIA_SIZES, HISTORIA, NOSOTROS } from "./nosotros";
import {
  desplazamientoParaIndice,
  estadoGaleria,
  etiquetaDiapositiva,
  indiceDesdeDesplazamiento,
  limitarIndice,
} from "./nosotros-galeria";

describe("contenidos de Nosotros", () => {
  it("conserva los tres párrafos de la historia, literales", () => {
    expect(HISTORIA.parrafos).toEqual([
      "El Taquito Gordo Feliz es una taquería con tres años de operación, fundada por D'mitri Medina Novelo y William Moran Ramírez. La historia comenzó cuando ambos se conocieron en la universidad y compartieron su amor por la comida mexicana, notando la falta de opciones auténticas en su zona.",
      "Tras meses desarrollando el concepto y el menú, encontraron el local perfecto y lo decoraron con un estilo alegre y colorido que refleja la cultura mexicana. El menú abarca desde los clásicos tacos de carne asada y al pastor hasta opciones vegetarianas y veganas, además de bebidas como horchata y agua de jamaica.",
      "Desde su apertura, ha sido un éxito en la comunidad. Los clientes destacan la autenticidad de la comida y el ambiente acogedor. D'mitri y William están orgullosos de seguir sirviendo tacos deliciosos y difundiendo la cultura mexicana por muchos años más.",
    ]);
  });

  it("conserva título, botón y mascota", () => {
    expect(HISTORIA.antetitulo).toBe("Nuestra historia");
    expect(`${HISTORIA.tituloLinea1} ${HISTORIA.tituloLinea2Prefijo}${HISTORIA.tituloNombre}`).toBe(
      "No es solo un taco, es El Taquito Gordo Feliz",
    );
    expect(HISTORIA.accion).toEqual({ label: "Haz tu pedido", to: "/catering" });
    expect(HISTORIA.mascota).toEqual({
      src: "/img/fotos/logo-full-500.webp",
      width: 500,
      height: 500,
      alt: "Mascota de El Taquito Gordo Feliz",
    });
  });

  it("conserva las 6 fotos con su orden, tamaño, alt y srcset", () => {
    expect(GALERIA.fotos.map((f) => [f.src, f.width, f.height, f.alt, f.srcSet])).toEqual([
      ["/img/fotos/fachada-1280.webp", 1280, 853, "Fachada del restaurante", "/img/fotos/fachada-640.webp 640w, /img/fotos/fachada-1280.webp 1280w"],
      ["/img/fotos/restaurant-640.webp", 640, 400, "Interior del restaurante", "/img/fotos/restaurant-640.webp 640w"],
      ["/img/fotos/drinks-1280.webp", 1280, 841, "Bebidas mexicanas", "/img/fotos/drinks-640.webp 640w, /img/fotos/drinks-1280.webp 1280w"],
      ["/img/fotos/food-800.webp", 800, 600, "Platillos del menú", "/img/fotos/food-640.webp 640w, /img/fotos/food-800.webp 800w"],
      ["/img/fotos/people-760.webp", 760, 610, "Clientes disfrutando", "/img/fotos/people-640.webp 640w, /img/fotos/people-760.webp 760w"],
      ["/img/fotos/tacos-1024.webp", 1024, 683, "Tacos recién hechos", "/img/fotos/tacos-640.webp 640w, /img/fotos/tacos-1024.webp 1024w"],
    ]);
    expect(GALERIA.fotos.every((f) => f.sizes === GALERIA_SIZES)).toBe(true);
    expect(GALERIA_SIZES).toBe("(min-width: 1100px) 1024px, calc(100vw - 3rem)");
    expect(new Set(GALERIA.fotos.map((f) => f.id)).size).toBe(6);
  });

  it("conserva los textos de la galería", () => {
    expect(NOSOTROS.galeria).toMatchObject({
      antetitulo: "Galería",
      titulo: "Así se ve la taquería",
      rolRegion: "carrusel",
      rolDiapositiva: "diapositiva",
      etiquetaCarril: "Fotos de la taquería. Desliza o usa las flechas para ver más.",
      etiquetaAnterior: "Foto anterior",
      etiquetaSiguiente: "Foto siguiente",
    });
  });
});

describe("cálculo de la galería", () => {
  it("saca el índice del desplazamiento, redondeando a la foto más cercana", () => {
    expect(indiceDesdeDesplazamiento(0, 800, 6)).toBe(0);
    expect(indiceDesdeDesplazamiento(800, 800, 6)).toBe(1);
    expect(indiceDesdeDesplazamiento(1199, 800, 6)).toBe(1);
    expect(indiceDesdeDesplazamiento(1200, 800, 6)).toBe(2);
    expect(indiceDesdeDesplazamiento(4000, 800, 6)).toBe(5);
    // Anchos con decimales (zoom del navegador).
    expect(indiceDesdeDesplazamiento(1599.5, 799.75, 6)).toBe(2);
  });

  it("no se sale de los límites ni devuelve NaN", () => {
    expect(indiceDesdeDesplazamiento(-300, 800, 6)).toBe(0);
    expect(indiceDesdeDesplazamiento(99999, 800, 6)).toBe(5);
    expect(indiceDesdeDesplazamiento(0, 0, 6)).toBe(0);
    expect(indiceDesdeDesplazamiento(500, 0, 6)).toBe(0);
    expect(indiceDesdeDesplazamiento(500, 800, 0)).toBe(0);
    expect(limitarIndice(Number.NaN, 6)).toBe(0);
    expect(limitarIndice(-1, 6)).toBe(0);
    expect(limitarIndice(6, 6)).toBe(5);
    expect(limitarIndice(3, 6)).toBe(3);
  });

  it("calcula el desplazamiento de la foto n, limitado", () => {
    expect(desplazamientoParaIndice(0, 800, 6)).toBe(0);
    expect(desplazamientoParaIndice(3, 800, 6)).toBe(2400);
    expect(desplazamientoParaIndice(-1, 800, 6)).toBe(0);
    expect(desplazamientoParaIndice(9, 800, 6)).toBe(4000);
    expect(desplazamientoParaIndice(2, 0, 6)).toBe(0);
  });

  it("da contador y extremos", () => {
    expect(estadoGaleria(0, 6)).toEqual({ indice: 0, total: 6, contador: "1 / 6", esPrimera: true, esUltima: false });
    expect(estadoGaleria(2, 6)).toEqual({ indice: 2, total: 6, contador: "3 / 6", esPrimera: false, esUltima: false });
    expect(estadoGaleria(5, 6)).toEqual({ indice: 5, total: 6, contador: "6 / 6", esPrimera: false, esUltima: true });
    expect(estadoGaleria(0, 1)).toMatchObject({ esPrimera: true, esUltima: true });
  });

  it("etiqueta cada diapositiva", () => {
    expect(etiquetaDiapositiva(1, 6)).toBe("1 de 6");
    expect(etiquetaDiapositiva(6, 6)).toBe("6 de 6");
  });
});
