import { useReducedMotion, type TargetAndTransition } from "motion/react";

/**
 * Bloque "Magnetic select" de Bencho, pasado de un racimo de círculos de 44 px
 * a una fila de píldoras: la opción elegida se hincha y aparta a las demás.
 *
 * Valores de Bencho con `pull = 0` y `bounce = 55`:
 * - `room` = 44 × (1,16 − 1) / 2 ≈ 3,5 px: lo que la elegida crece por cada lado.
 *   Las píldoras miden ~110 px de ancho, así que ese mismo hueco es escala 1,06.
 * - `aura`: empuje de más. Bencho usa 3 px; aquí 1 px, porque la fila solo deja
 *   8 px hasta el texto "Mostrar:".
 * - `cower` = 0,04: lo que se encogen las vecinas, menos cuanto más lejos.
 * - En una fila la dirección del empuje se reduce a un signo (izquierda o derecha).
 */
const ESCALA_ELEGIDA = 1.06;
const HUECO = 3.5;
const AURA = 1;
const ENCOGE = 0.04;
/** Caída del efecto con la distancia: exp(−(lejos − 1) / 2,8). */
const ALCANCE = 2.8;
/** Amortiguación relativa: 0,9 − 0,48 × bounce. */
const ZETA = 0.9 - 0.48 * 0.55;
/** Segundos de espera por cada puesto de distancia: la onda sale de la elegida. */
const ESPERA = 0.022;

const muelle = (rigidez: number, masa: number, espera: number) => ({
  type: "spring" as const,
  stiffness: rigidez,
  damping: 2 * Math.sqrt(rigidez * masa) * ZETA,
  mass: masa,
  delay: espera,
});

const QUIETO: TargetAndTransition = { x: 0, scaleX: 1, scaleY: 1, transition: { duration: 0 } };

/**
 * Devuelve, para cada posición de la fila, hacia dónde va su botón según cuál
 * está elegida. Solo `transform`. Con movimiento reducido no hay nada.
 */
export function useImanFiltro(elegida: number): (posicion: number) => TargetAndTransition {
  const reducir = useReducedMotion();

  return (posicion) => {
    if (reducir || elegida < 0) return QUIETO;
    const lejos = Math.abs(posicion - elegida);
    const esElegida = lejos === 0;
    const caida = esElegida ? 0 : Math.exp(-(lejos - 1) / ALCANCE);
    const escala = esElegida ? ESCALA_ELEGIDA : 1 - ENCOGE * caida;
    const rigidez = 300 + 280 * (1 - Math.min(lejos, 3) / 4);
    const espera = lejos * ESPERA;

    return {
      x: esElegida ? 0 : Math.sign(posicion - elegida) * (HUECO + AURA),
      scaleX: escala,
      scaleY: escala,
      transition: {
        x: muelle(rigidez, 0.9, espera),
        scaleX: muelle(rigidez * 1.24, 0.8, espera),
        scaleY: muelle(rigidez * 0.86, 0.95, espera),
      },
    };
  };
}
