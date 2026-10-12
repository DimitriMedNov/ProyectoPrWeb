import type { Transition } from "motion/react";
import { CURVA } from "@/components/shared/movimiento/constantes";

/** Fundido del modal, de sus avisos y del cambio entre formulario y éxito (segundos). */
export const FUNDIDO: Transition = { duration: 0.25, ease: CURVA };
export const FUNDIDO_CORTO: Transition = { duration: 0.15, ease: CURVA };

/** Muelle del panel: ~0,4 s. La hoja inferior no rebota para no despegarse del borde. */
export const muellePanel = (hoja: boolean): Transition => ({
  type: "spring",
  duration: 0.4,
  bounce: hoja ? 0 : 0.18,
});

/** Píxeles que sube lo que aparece dentro del modal. */
export const SUBIDA = 12;

/** Quita los gestos de escala que traen las casillas y radios de Animate UI (movimiento reducido). */
export const SIN_GESTOS = {
  whileHover: undefined,
  whileTap: undefined,
} as const;

/**
 * Bencho, "Drag stepper": el control se inclina hacia el lado pulsado
 * (perspectiva 320 px, 4°, escala 0,99) en 0,16 s y vuelve en 0,32 s con una
 * curva que se pasa un poco; el número crece a 1,06.
 */
export const CONTADOR = {
  perspectiva: 320,
  giro: 4,
  hundido: 0.99,
  pulso: 1.06,
  pulsar: { duration: 0.16, ease: "easeOut" },
  soltar: { duration: 0.32, ease: [0.24, 1.34, 0.38, 1] },
} as const satisfies Record<string, number | Transition>;

/**
 * Bencho, "Magnetic select": la opción marcada crece ancha antes que alta (dos
 * muelles de distinta rigidez), las vecinas ceden tamaño y las lejanas llegan
 * 22 ms tarde por paso. Rebote 55 del bloque = razón de amortiguación 0,669.
 * El crecimiento se baja de 1,28 a 1,03 para que quepa en el hueco entre píldoras.
 */
export const PILDORA = {
  crece: 1.03,
  cede: 0.96,
  rigidez: 300,
  ancho: 1.24,
  alto: 0.86,
  amortiguacion: 0.669,
  retardoPorPaso: 0.022,
} as const;

/** Muelle de Bencho (`swing(k)`): amortiguación = 2 × razón × √rigidez, con masa 1. */
export const muellePildora = (factor: number, retardo: number): Transition => {
  const stiffness = PILDORA.rigidez * factor;
  return {
    type: "spring",
    stiffness,
    damping: 2 * PILDORA.amortiguacion * Math.sqrt(stiffness),
    mass: 1,
    delay: retardo,
  };
};
