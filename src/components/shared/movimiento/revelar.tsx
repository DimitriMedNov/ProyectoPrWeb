import type { ReactNode } from "react";
import { useReducedMotion, type HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";
import { CLASE_IMPRESION, CURVA, DURACION_ENTRADA, SUBIDA_REVELAR, ETIQUETAS_MOVIMIENTO, type EtiquetaMovimiento } from "./constantes";
import { useAparicion } from "./use-aparicion";

export type PropsBaseMovimiento = Omit<HTMLMotionProps<"div">, "initial" | "animate" | "exit" | "variants" | "transition" | "whileInView" | "viewport" | "ref" | "children">;

export interface RevelarProps extends PropsBaseMovimiento {
  /** Etiqueta HTML que se dibuja. Por defecto `div`. */
  as?: EtiquetaMovimiento;
  /** Segundos de espera desde que entra en pantalla. */
  retardo?: number;
  children?: ReactNode;
}

/**
 * Aparece (fundido + sube 28 px) la primera vez que entra en pantalla.
 * Con movimiento reducido solo hay fundido. Ocupa su sitio desde el principio:
 * no mueve el resto de la página.
 */
export function Revelar({ as = "div", retardo = 0, className, children, ...props }: RevelarProps) {
  const reducir = useReducedMotion();
  const { ref, visible } = useAparicion<HTMLDivElement>(true);
  const Etiqueta = ETIQUETAS_MOVIMIENTO[as];
  const oculto = { opacity: 0, y: reducir ? 0 : SUBIDA_REVELAR };

  return (
    <Etiqueta
      ref={ref}
      initial={oculto}
      animate={visible ? { opacity: 1, y: 0 } : oculto}
      transition={{ duration: DURACION_ENTRADA, ease: CURVA, delay: retardo }}
      className={cn(CLASE_IMPRESION, className)}
      {...props}
    >
      {children}
    </Etiqueta>
  );
}
