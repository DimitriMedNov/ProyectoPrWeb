import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useLocation } from "react-router-dom";
import { CURVA, DURACION_FUNDIDO } from "./constantes";

export interface FundidoDeRutaProps {
  /** Las rutas (`<Routes>`). Va DENTRO del armazón: cabecera y pie no se reaniman. */
  children: ReactNode;
}

/**
 * Fundido de entrada (0,3 s, solo opacidad) cada vez que cambia la ruta.
 * - La página nueva se monta al momento (no hay animación de salida): el foco a
 *   `<main id="main">` y el salto a anclas siguen funcionando igual.
 * - Cambiar solo de ancla (`#tacos`) no repite el fundido.
 * - La primera carga y el movimiento reducido no animan.
 */
export function FundidoDeRuta({ children }: FundidoDeRutaProps) {
  const { pathname, key } = useLocation();
  const reducir = useReducedMotion();
  // React Router da la clave "default" solo a la entrada con la que cargó la página.
  const sinAnimar = reducir || key === "default";

  return (
    <motion.div
      key={pathname}
      initial={sinAnimar ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: DURACION_FUNDIDO, ease: CURVA }}
    >
      {children}
    </motion.div>
  );
}
