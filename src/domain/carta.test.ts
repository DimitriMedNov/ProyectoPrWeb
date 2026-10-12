import { describe, expect, it } from "vitest";
import {
  ETIQUETAS,
  MENSAJE_VACIO,
  OPCIONES_FILTRO,
  cumpleFiltro,
  etiquetasVisibles,
  filtrarCarta,
  pestanasCarta,
  primeraEnVista,
  resolverPestana,
  textoConteo,
  type DatosCarta,
} from "./carta";
import { carta, specials } from "./menu";

const datos: DatosCarta = { especialidades: specials, categorias: carta };

describe("etiquetasVisibles", () => {
  it("vegano no repite vegetariano", () => {
    expect(etiquetasVisibles(["vegetariano", "vegano"])).toEqual(["vegano"]);
    expect(etiquetasVisibles(["vegetariano", "vegano", "picante"])).toEqual(["vegano", "picante"]);
  });

  it("deja lo demás igual y en su orden", () => {
    expect(etiquetasVisibles(["vegetariano"])).toEqual(["vegetariano"]);
    expect(etiquetasVisibles(["picante"])).toEqual(["picante"]);
    expect(etiquetasVisibles([])).toEqual([]);
  });
});

describe("textos", () => {
  it("contador en singular y plural", () => {
    expect(textoConteo(1)).toBe("1 platillo");
    expect(textoConteo(0)).toBe("0 platillos");
    expect(textoConteo(16)).toBe("16 platillos");
  });

  it("opciones del filtro: Todo, Vegetariano, Vegano, Picante", () => {
    expect(OPCIONES_FILTRO.map((o) => [o.valor, o.texto, o.icono])).toEqual([
      ["", "Todo", null],
      ["vegetariano", "Vegetariano", "leaf"],
      ["vegano", "Vegano", "leaf"],
      ["picante", "Picante", "chile"],
    ]);
    expect(ETIQUETAS.picante).toEqual({ icono: "chile", texto: "Picante" });
  });
});

describe("pestanasCarta", () => {
  it("Especialidades fija y una por categoría, con los ids de siempre", () => {
    expect(pestanasCarta(carta).map((p) => [p.titulo, p.ancla])).toEqual([
      ["Especialidades", "#especialidades"],
      ["Tacos", "#tacos"],
      ["Vegetariano y vegano", "#vegetariano"],
      ["Antojitos", "#antojitos"],
      ["Bebidas", "#bebidas"],
      ["Postres", "#postres"],
      ["Para acompañar", "#acompanantes"],
    ]);
  });
});

describe("cumpleFiltro", () => {
  it("sin filtro pasa todo; con filtro, solo si lleva la etiqueta", () => {
    expect(cumpleFiltro({ tags: [] }, "")).toBe(true);
    expect(cumpleFiltro({ tags: [] }, "vegano")).toBe(false);
    expect(cumpleFiltro({ tags: ["vegetariano"] }, "vegano")).toBe(false);
    expect(cumpleFiltro({ tags: ["vegetariano", "vegano"] }, "vegetariano")).toBe(true);
  });
});

describe("filtrarCarta con los datos reales", () => {
  it("Todo: 29 platillos, 6 categorías, 7 pestañas, nada fuera del filtro", () => {
    const r = filtrarCarta(datos, "");
    expect(r.conteo).toBe(29);
    expect(r.textoConteo).toBe("29 platillos");
    expect(r.categorias.map((c) => c.dishes.length)).toEqual([6, 4, 4, 5, 3, 4]);
    expect(r.pestanas).toHaveLength(7);
    expect(r.hayFiltro).toBe(false);
    expect(r.especialidadesFueraDelFiltro).toBe(false);
    expect(r.vacio).toBe(false);
  });

  it("los mismos conteos de antes: Vegetariano 16, Vegano 9, Picante 3", () => {
    expect(filtrarCarta(datos, "vegetariano").conteo).toBe(16);
    expect(filtrarCarta(datos, "vegano").conteo).toBe(9);
    expect(filtrarCarta(datos, "picante").conteo).toBe(3);
  });

  it("una categoría sin platillos visibles desaparece con su pestaña", () => {
    const r = filtrarCarta(datos, "vegano");
    expect(r.categorias.map((c) => c.id)).toEqual(["vegetariano", "bebidas", "acompanantes"]);
    expect(r.pestanas.map((p) => p.id)).toEqual(["especialidades", "vegetariano", "bebidas", "acompanantes"]);
    expect(r.categorias.every((c) => c.dishes.every((d) => d.tags.includes("vegano")))).toBe(true);
  });

  it("las especialidades no desaparecen al filtrar, y se marcan como fuera del filtro", () => {
    const r = filtrarCarta(datos, "picante");
    expect(r.especialidades).toHaveLength(3);
    expect(r.especialidadesFueraDelFiltro).toBe(true);
    expect(r.pestanas[0]?.id).toBe("especialidades");
    expect(r.hayFiltro).toBe(true);
  });

  it("cada platillo lleva sus etiquetas visibles ya calculadas", () => {
    const hongos = filtrarCarta(datos, "").categorias[1]?.dishes[0];
    expect(hongos?.name).toBe("Hongos al ajillo");
    expect(hongos?.tags).toEqual(["vegetariano", "vegano"]);
    expect(hongos?.etiquetas).toEqual(["vegano"]);
  });

  it("no modifica los datos de origen", () => {
    const antes = JSON.stringify(carta);
    filtrarCarta(datos, "picante");
    expect(JSON.stringify(carta)).toBe(antes);
  });
});

describe("filtrarCarta: caso vacío", () => {
  const soloCarne: DatosCarta = {
    especialidades: specials,
    categorias: [
      { id: "tacos", title: "Tacos", note: "", icon: "taco", dishes: [{ name: "Asada", description: "", price: 1, tags: [] }] },
    ],
  };

  it("sin platillos que cumplan: vacío, con su mensaje, y las especialidades siguen", () => {
    const r = filtrarCarta(soloCarne, "vegano");
    expect(r.vacio).toBe(true);
    expect(r.mensajeVacio).toBe("No hay platillos con ese filtro.");
    expect(r.mensajeVacio).toBe(MENSAJE_VACIO);
    expect(r.conteo).toBe(0);
    expect(r.textoConteo).toBe("0 platillos");
    expect(r.categorias).toEqual([]);
    expect(r.pestanas.map((p) => p.id)).toEqual(["especialidades"]);
    expect(r.especialidades).toHaveLength(3);
  });

  it("una especialidad con etiqueta sí cuenta para el filtro", () => {
    const [primera, ...resto] = specials;
    if (!primera) throw new Error("faltan especialidades");
    const r = filtrarCarta({ ...soloCarne, especialidades: [{ ...primera, tags: ["picante"] }, ...resto] }, "picante");
    expect(r.conteo).toBe(1);
    expect(r.textoConteo).toBe("1 platillo");
    expect(r.especialidadesFueraDelFiltro).toBe(true);
  });
});

describe("primeraEnVista", () => {
  const orden = ["especialidades", "tacos", "vegetariano"];

  it("si cruzan dos, gana la primera en el orden de las pestañas", () => {
    expect(primeraEnVista(orden, new Set(["vegetariano", "tacos"]))).toBe("tacos");
  });

  it("null si no cruza ninguna", () => {
    expect(primeraEnVista(orden, new Set())).toBeNull();
    expect(primeraEnVista(orden, new Set(["otra"]))).toBeNull();
  });
});

describe("resolverPestana", () => {
  const orden = ["especialidades", "tacos", "vegetariano", "antojitos", "bebidas"];

  it("sin pulsada, la regla normal: gana la primera en el orden", () => {
    expect(resolverPestana(orden, new Set(["vegetariano", "tacos"]), null)).toEqual({ activa: "tacos", pulsada: null });
    expect(resolverPestana(orden, new Set(), null)).toEqual({ activa: null, pulsada: null });
  });

  it("la pulsada gana a su vecina de la izquierda cuando las dos cruzan la franja", () => {
    const pulsada = { id: "vegetariano", enCamino: false };
    expect(resolverPestana(orden, new Set(["tacos", "vegetariano"]), pulsada)).toEqual({ activa: "vegetariano", pulsada });
  });

  it("de camino manda aunque su sección aún no cruce la franja", () => {
    const pulsada = { id: "bebidas", enCamino: true };
    expect(resolverPestana(orden, new Set(["especialidades"]), pulsada)).toEqual({ activa: "bebidas", pulsada });
    expect(resolverPestana(orden, new Set(), pulsada)).toEqual({ activa: "bebidas", pulsada });
  });

  it("ya asentada, se suelta cuando su sección sale de la franja y vuelve la regla normal", () => {
    const pulsada = { id: "vegetariano", enCamino: false };
    expect(resolverPestana(orden, new Set(["antojitos", "bebidas"]), pulsada)).toEqual({ activa: "antojitos", pulsada: null });
    expect(resolverPestana(orden, new Set(), pulsada)).toEqual({ activa: null, pulsada: null });
  });

  it("se suelta si el filtro ocultó su sección, aunque vaya de camino", () => {
    const visibles = ["especialidades", "tacos"];
    expect(resolverPestana(visibles, new Set(["tacos"]), { id: "bebidas", enCamino: true })).toEqual({
      activa: "tacos",
      pulsada: null,
    });
  });
});
