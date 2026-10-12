import type { PointerEvent } from "react";
import { useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from "motion/react";

/** Valores del bloque "Tilt card" de Bencho: 10° de giro, 14 px de hundido, 800 px de profundidad. */
const GRADOS = 10;
const HUNDIDO = 14;
const PROFUNDIDAD = 800;
/**
 * El muelle de Bencho (k = 0,16 y amortiguación 0,72 por fotograma a 60 fps)
 * pasado a las unidades de Motion: rigidez = k × 60², amortiguación = −ln(0,72) × 60.
 */
const MUELLE = { stiffness: 576, damping: 20, mass: 1 } as const;

const acotar = (valor: number) => Math.min(1, Math.max(-1, valor));

export interface OpcionesInclinacion {
  /** Giro máximo, en grados, con el cursor en el borde. Por defecto 10 (el del bloque). */
  grados?: number;
  /** Cuánto se hunde, en px, mientras el cursor está encima. Por defecto 14; 0 = no se hunde. */
  hundido?: number;
}

export interface Inclinacion {
  /** Props del elemento que escucha el cursor (da la profundidad a su hijo). */
  zona: {
    onPointerMove: (evento: PointerEvent<HTMLElement>) => void;
    onPointerLeave: () => void;
    onPointerCancel: () => void;
    style: { perspective: number };
  };
  /** Estilo del hijo que se inclina. Solo `transform`. */
  giro: { rotateX: MotionValue<number>; rotateY: MotionValue<number>; z: MotionValue<number> };
}

/**
 * Respuesta al cursor (Bencho, "Tilt card"): lo que está debajo del puntero se
 * hunde y se inclina cediendo bajo él, y vuelve solo a su sitio al salir. Solo con
 * ratón: en pantallas táctiles y con movimiento reducido no hace nada.
 * Uso: `{...zona}` en el elemento que escucha y `style={giro}` en un `motion.*` hijo.
 */
export function useInclinacion({ grados = GRADOS, hundido = HUNDIDO }: OpcionesInclinacion = {}): Inclinacion {
  const reducir = useReducedMotion();
  const x = useSpring(useMotionValue(0), MUELLE);
  const y = useSpring(useMotionValue(0), MUELLE);
  const dentro = useSpring(useMotionValue(0), MUELLE);
  const rotateX = useTransform(y, (valor) => -valor * grados);
  const rotateY = useTransform(x, (valor) => valor * grados);
  const z = useTransform(dentro, (valor) => -hundido * valor);

  const seguir = (evento: PointerEvent<HTMLElement>) => {
    if (reducir || evento.pointerType !== "mouse") return;
    const caja = evento.currentTarget.getBoundingClientRect();
    x.set(acotar(((evento.clientX - caja.left) / caja.width) * 2 - 1));
    y.set(acotar(((evento.clientY - caja.top) / caja.height) * 2 - 1));
    dentro.set(1);
  };
  const soltar = () => {
    x.set(0);
    y.set(0);
    dentro.set(0);
  };

  return {
    zona: { onPointerMove: seguir, onPointerLeave: soltar, onPointerCancel: soltar, style: { perspective: PROFUNDIDAD } },
    giro: { rotateX, rotateY, z },
  };
}
