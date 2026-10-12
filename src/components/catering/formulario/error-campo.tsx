import { motion } from "motion/react";
import { FUNDIDO } from "./movimiento";

export interface ErrorCampoProps {
  /** Id al que apunta el `aria-describedby` del control. */
  id: string;
  mensaje: string;
  className?: string;
}

/**
 * Mensaje de error de un campo: aparece con un fundido (sin animar la altura).
 * Sin `cn()`: tailwind-merge toma `text-caption` y `text-arc` por el mismo grupo y borra el tamaño.
 */
export function ErrorCampo({ id, mensaje, className }: ErrorCampoProps) {
  return (
    <motion.p
      id={id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={FUNDIDO}
      className={`text-caption font-medium text-arc ${className ?? ""}`}
    >
      {mensaje}
    </motion.p>
  );
}
