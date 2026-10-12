import { useState } from "react";
import { useReducedMotion, type TargetAndTransition } from "motion/react";
import { PILDORA, SIN_GESTOS, muellePildora } from "./movimiento";

export interface PildorasMagneticas {
  /** Recuerda qué píldora se acaba de tocar: de ahí sale el retardo de las demás. */
  tocar: (posicion: number) => void;
  /** Animación de la píldora en esa posición según su estado. */
  animacion: (
    posicion: number,
    marcado: boolean,
    bloqueado: boolean,
  ) => TargetAndTransition;
  /** Props extra de la casilla: sin gestos de escala con movimiento reducido. */
  gestosCasilla: Partial<typeof SIN_GESTOS>;
}

/**
 * Píldoras de complementos (Bencho, "Magnetic select"): la marcada crece, ancha
 * antes que alta; las bloqueadas ceden tamaño; cuanto más lejos de la tocada,
 * más tarde responden. Solo `transform`. Con movimiento reducido, nada.
 */
export function usePildorasMagneticas(): PildorasMagneticas {
  const reducir = useReducedMotion();
  const [origen, setOrigen] = useState(0);

  return {
    tocar: setOrigen,
    gestosCasilla: reducir ? SIN_GESTOS : {},
    animacion: (posicion, marcado, bloqueado) => {
      if (reducir) return { scaleX: 1, scaleY: 1, transition: { duration: 0 } };
      const escala = marcado ? PILDORA.crece : bloqueado ? PILDORA.cede : 1;
      const retardo = Math.abs(posicion - origen) * PILDORA.retardoPorPaso;
      return {
        scaleX: escala,
        scaleY: escala,
        transition: {
          scaleX: muellePildora(PILDORA.ancho, retardo),
          scaleY: muellePildora(PILDORA.alto, retardo),
        },
      };
    },
  };
}
