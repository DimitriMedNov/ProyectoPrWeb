/**
 * Reglas puras de la pantalla Carta (/menu): filtro por etiqueta, etiquetas
 * visibles de cada platillo, pestañas de categoría y texto del contador.
 * Los datos (platillos, precios, textos) siguen en ./menu.
 */
import type { Category, Dish, Icon, Special, Tag } from "./menu";

/** Filtro elegido; "" es "Todo" (mismo valor vacío que usaba la interfaz anterior). */
export type FiltroCarta = Tag | "";

export const SIN_FILTRO: FiltroCarta = "";

/** Icono de una etiqueta: hoja o chile (no están en `Icon` de ./menu, que son los de categoría). */
export type IconoEtiqueta = "leaf" | "chile";

export interface InfoEtiqueta {
  icono: IconoEtiqueta;
  texto: string;
}

/** Texto e icono de cada etiqueta de platillo. */
export const ETIQUETAS: Record<Tag, InfoEtiqueta> = {
  vegetariano: { icono: "leaf", texto: "Vegetariano" },
  vegano: { icono: "leaf", texto: "Vegano" },
  picante: { icono: "chile", texto: "Picante" },
};

export interface OpcionFiltro {
  valor: FiltroCarta;
  texto: string;
  /** "Todo" no lleva icono. */
  icono: IconoEtiqueta | null;
}

/** Los 4 botones de "Mostrar:", en su orden. */
export const OPCIONES_FILTRO: readonly OpcionFiltro[] = [
  { valor: SIN_FILTRO, texto: "Todo", icono: null },
  { valor: "vegetariano", texto: ETIQUETAS.vegetariano.texto, icono: ETIQUETAS.vegetariano.icono },
  { valor: "vegano", texto: ETIQUETAS.vegano.texto, icono: ETIQUETAS.vegano.icono },
  { valor: "picante", texto: ETIQUETAS.picante.texto, icono: ETIQUETAS.picante.icono },
];

export const MENSAJE_VACIO = "No hay platillos con ese filtro.";

export const ID_ESPECIALIDADES = "especialidades";

/** Vegano implica vegetariano: si lleva las dos, "vegetariano" no se repite. */
export function etiquetasVisibles(tags: readonly Tag[]): Tag[] {
  return tags.filter((t) => !(t === "vegetariano" && tags.includes("vegano")));
}

/** Un platillo pasa el filtro si no hay filtro o si su lista de etiquetas lo incluye. */
export function cumpleFiltro(platillo: Pick<Dish, "tags">, filtro: FiltroCarta): boolean {
  return filtro === "" || platillo.tags.includes(filtro);
}

/** "1 platillo" / "N platillos" (contador para lector de pantalla). */
export function textoConteo(n: number): string {
  return `${n} ${n === 1 ? "platillo" : "platillos"}`;
}

export interface PestanaCarta {
  /** id de la sección en la página (el mismo de antes: "tacos", "bebidas"…). */
  id: string;
  titulo: string;
  /** Ancla del enlace: "#tacos". */
  ancla: string;
}

/** Pestañas: "Especialidades" fija y luego una por categoría, en su orden. */
export function pestanasCarta(categorias: readonly Pick<Category, "id" | "title">[]): PestanaCarta[] {
  return [{ id: ID_ESPECIALIDADES, title: "Especialidades" }, ...categorias].map((c) => ({
    id: c.id,
    titulo: c.title,
    ancla: `#${c.id}`,
  }));
}

/** Platillo de la carta listo para pintar. */
export interface PlatilloVisible extends Dish {
  /** Etiquetas a mostrar, ya sin "vegetariano" repetido. */
  etiquetas: Tag[];
}

export interface CategoriaVisible {
  id: string;
  title: string;
  note: string;
  icon: Icon;
  dishes: PlatilloVisible[];
}

export interface DatosCarta {
  especialidades: readonly Special[];
  categorias: readonly Category[];
}

export interface CartaVisible {
  filtro: FiltroCarta;
  hayFiltro: boolean;
  /**
   * Especialidades de la casa: se muestran SIEMPRE, con cualquier filtro.
   * No llevan etiquetas, así que no se puede afirmar que cumplan el filtro.
   */
  especialidades: readonly Special[];
  /**
   * true cuando hay un filtro puesto y las especialidades se muestran sin
   * cumplirlo (no cuentan en `conteo`). La interfaz debe decirlo.
   */
  especialidadesFueraDelFiltro: boolean;
  /** Categorías con al menos un platillo visible; cada una solo con sus platillos visibles. */
  categorias: CategoriaVisible[];
  /** Pestañas visibles: Especialidades siempre + las categorías que quedan. */
  pestanas: PestanaCarta[];
  /** Platillos que cumplen el filtro. Sin filtro incluye las especialidades. */
  conteo: number;
  textoConteo: string;
  /** Ningún platillo de la carta cumple el filtro. */
  vacio: boolean;
  mensajeVacio: string;
}

/**
 * Qué se ve con un filtro.
 * - Sin filtro: todo (especialidades + carta).
 * - Con filtro: de la carta, solo los platillos cuya lista de etiquetas lo
 *   incluye; una categoría sin platillos visibles desaparece con su pestaña.
 * - Las especialidades no desaparecen nunca (mejora aprobada): como no tienen
 *   etiquetas, con filtro se muestran aparte, marcadas como fuera del filtro,
 *   y no se suman al conteo (el conteo con filtro es el mismo de antes).
 */
export function filtrarCarta(datos: DatosCarta, filtro: FiltroCarta): CartaVisible {
  const hayFiltro = filtro !== SIN_FILTRO;

  const categorias: CategoriaVisible[] = datos.categorias
    .map((c) => ({
      id: c.id,
      title: c.title,
      note: c.note,
      icon: c.icon,
      dishes: c.dishes
        .filter((d) => cumpleFiltro(d, filtro))
        .map((d) => ({ ...d, etiquetas: etiquetasVisibles(d.tags) })),
    }))
    .filter((c) => c.dishes.length > 0);

  const enCarta = categorias.reduce((n, c) => n + c.dishes.length, 0);
  const especialidadesQueCumplen = datos.especialidades.filter((s) => cumpleFiltro(s, filtro)).length;
  const conteo = enCarta + especialidadesQueCumplen;

  return {
    filtro,
    hayFiltro,
    especialidades: datos.especialidades,
    especialidadesFueraDelFiltro: hayFiltro && especialidadesQueCumplen < datos.especialidades.length,
    categorias,
    pestanas: pestanasCarta(categorias),
    conteo,
    textoConteo: textoConteo(conteo),
    vacio: enCarta === 0,
    mensajeVacio: MENSAJE_VACIO,
  };
}

/**
 * Scroll-spy: de las secciones que cruzan la franja, gana la primera en el
 * orden de las pestañas (con la carta a dos columnas pueden cruzar dos a la vez).
 * Devuelve null si no cruza ninguna.
 */
export function primeraEnVista(orden: readonly string[], enVista: ReadonlySet<string>): string | null {
  return orden.find((id) => enVista.has(id)) ?? null;
}

/** Pestaña que el usuario pulsó (clic, Enter o cambio de ancla en la URL). */
export interface PestanaPulsada {
  id: string;
  /** true mientras la página todavía se desplaza hacia su sección. */
  enCamino: boolean;
}

export interface PestanaResuelta {
  /** La pestaña a marcar, o null si no hay pulsada vigente ni sección en la franja. */
  activa: string | null;
  /** La pulsada si sigue mandando; null si se soltó. */
  pulsada: PestanaPulsada | null;
}

/**
 * Scroll-spy con pestaña pulsada: la pulsada manda sobre "gana la primera en
 * el orden" mientras va de camino o mientras su sección cruza la franja. Se
 * suelta si el filtro la ocultó (ya no está en `orden`) o si, ya asentada, su
 * sección no cruza la franja; entonces vuelve la regla normal.
 */
export function resolverPestana(
  orden: readonly string[],
  enVista: ReadonlySet<string>,
  pulsada: PestanaPulsada | null,
): PestanaResuelta {
  const vigente = pulsada !== null && orden.includes(pulsada.id) && (pulsada.enCamino || enVista.has(pulsada.id));
  if (vigente) return { activa: pulsada.id, pulsada };
  return { activa: primeraEnVista(orden, enVista), pulsada: null };
}
