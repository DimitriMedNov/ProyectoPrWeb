import { motion } from "motion/react";

/** Misma curva que `--ease` de la hoja de estilos (entrada suave, salida larga). */
export const CURVA = [0.28, 0.11, 0.32, 1] as const;

/** Segundos. Entradas de sección: 0,5 s como mucho; fundido entre rutas: 0,3 s. */
export const DURACION_ENTRADA = 0.5;
export const DURACION_FUNDIDO = 0.3;
/** Retardo entre un elemento y el siguiente en una cascada. */
export const PASO_CASCADA = 0.06;

/** Píxeles que sube el contenido al aparecer (0 con movimiento reducido). */
export const SUBIDA_REVELAR = 28;
export const SUBIDA_CASCADA = 20;

/** Lo animado nunca se queda oculto ni desplazado al imprimir. */
export const CLASE_IMPRESION = "print:transform-none! print:opacity-100!";

const ETIQUETAS = {
  div: motion.div,
  section: motion.section,
  article: motion.article,
  header: motion.header,
  footer: motion.footer,
  nav: motion.nav,
  figure: motion.figure,
  ul: motion.ul,
  ol: motion.ol,
  li: motion.li,
  p: motion.p,
  span: motion.span,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
} as const;

/** Etiquetas HTML que pueden animar `Revelar`, `Escalonado` y `EscalonadoItem` (prop `as`). */
export type EtiquetaMovimiento = keyof typeof ETIQUETAS;

/**
 * Componente de Motion de cada etiqueta. Todas comparten las props que usamos
 * (clase, estilo, animación), así que se tipan como la de `div`.
 */
export const ETIQUETAS_MOVIMIENTO = ETIQUETAS as unknown as Record<EtiquetaMovimiento, typeof motion.div>;
