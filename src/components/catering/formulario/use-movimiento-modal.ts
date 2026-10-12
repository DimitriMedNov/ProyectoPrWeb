import { useReducedMotion, type HTMLMotionProps } from "motion/react";
import { FUNDIDO, FUNDIDO_CORTO, SUBIDA, muellePanel } from "./movimiento";
import { useHojaInferior } from "./use-hoja-inferior";

type Animacion = Pick<
  HTMLMotionProps<"div">,
  "initial" | "animate" | "exit" | "transition"
>;

export interface MovimientoModal {
  /** Panel del diálogo: fundido 0,25 s + muelle 0,4 s; en móvil sube desde abajo. */
  panel: Animacion;
  /** Cambio entre el formulario y la pantalla de éxito. */
  contenido: Animacion;
}

/** Animaciones del modal. Solo `opacity` y `transform`; con movimiento reducido, solo fundido. */
export function useMovimientoModal(): MovimientoModal {
  const reducir = useReducedMotion();
  const hoja = useHojaInferior();

  if (reducir) {
    const fundido: Animacion = {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: FUNDIDO,
    };
    return {
      panel: fundido,
      contenido: { ...fundido, transition: FUNDIDO_CORTO },
    };
  }

  const fuera = hoja
    ? { opacity: 0, y: "100%", scale: 1 }
    : { opacity: 0, y: SUBIDA * 2, scale: 0.96 };
  return {
    panel: {
      initial: fuera,
      animate: { opacity: 1, y: 0, scale: 1 },
      exit: { ...fuera, transition: FUNDIDO },
      transition: { default: muellePanel(hoja), opacity: FUNDIDO },
    },
    contenido: {
      initial: { opacity: 0, y: SUBIDA },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, transition: FUNDIDO_CORTO },
      transition: FUNDIDO,
    },
  };
}
