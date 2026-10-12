/**
 * Cálculo de la galería deslizable de Nosotros: qué foto se ve según el
 * desplazamiento del carril, a dónde hay que desplazar para ver la foto n, y
 * los textos que salen del índice. Funciones puras: sin DOM ni React.
 *
 * Cada foto ocupa el ancho visible completo del carril, así que la foto actual
 * es `desplazamiento / ancho visible`, redondeado.
 */

/** Deja el índice dentro de `0 … total - 1` (0 si no hay fotos). */
export function limitarIndice(indice: number, total: number): number {
  if (!Number.isFinite(indice) || total <= 0) return 0;
  return Math.min(total - 1, Math.max(0, Math.round(indice)));
}

/**
 * Índice (desde 0) de la foto visible.
 * @param desplazamiento `scrollLeft` del carril, en px.
 * @param anchoVista `clientWidth` del carril, en px.
 */
export function indiceDesdeDesplazamiento(desplazamiento: number, anchoVista: number, total: number): number {
  if (!(anchoVista > 0)) return 0;
  return limitarIndice(desplazamiento / anchoVista, total);
}

/** `scrollLeft` (px) que deja a la vista la foto `indice`, ya limitado. */
export function desplazamientoParaIndice(indice: number, anchoVista: number, total: number): number {
  if (!(anchoVista > 0)) return 0;
  return limitarIndice(indice, total) * anchoVista;
}

export interface EstadoGaleria {
  /** Índice desde 0 de la foto visible. */
  indice: number;
  total: number;
  /** Texto del contador: "1 / 6". */
  contador: string;
  /** No hay foto anterior: el botón "anterior" va con `aria-disabled`. */
  esPrimera: boolean;
  /** No hay foto siguiente: el botón "siguiente" va con `aria-disabled`. */
  esUltima: boolean;
}

export function estadoGaleria(indice: number, total: number): EstadoGaleria {
  const i = limitarIndice(indice, total);
  return {
    indice: i,
    total,
    contador: `${i + 1} / ${total}`,
    esPrimera: i <= 0,
    esUltima: i >= total - 1,
  };
}

/** `aria-label` de cada diapositiva: "2 de 6". `posicion` empieza en 1. */
export function etiquetaDiapositiva(posicion: number, total: number): string {
  return `${posicion} de ${total}`;
}
