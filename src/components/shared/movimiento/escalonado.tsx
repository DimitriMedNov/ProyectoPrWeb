import { Children, useContext, useMemo, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { CLASE_IMPRESION, CURVA, DURACION_ENTRADA, PASO_CASCADA, SUBIDA_CASCADA, ETIQUETAS_MOVIMIENTO, type EtiquetaMovimiento } from "./constantes";
import { ContextoEscalonado, ContextoOrden } from "./contexto-escalonado";
import type { PropsBaseMovimiento } from "./revelar";
import { useAparicion } from "./use-aparicion";

export interface EscalonadoProps extends PropsBaseMovimiento {
  as?: EtiquetaMovimiento;
  /** Segundos antes del primer elemento. */
  retardo?: number;
  /** Segundos entre un elemento y el siguiente. Por defecto 0,06. */
  paso?: number;
  /** `true` (por defecto): arranca al entrar en pantalla. `false`: arranca al montarse. */
  alVer?: boolean;
  children?: ReactNode;
}

/**
 * Contenedor de una cascada. No se anima él: avisa a sus `EscalonadoItem`
 * (a cualquier profundidad) de cuándo empezar. Cada hijo directo recibe su
 * posición (0, 1, 2…), que es el orden por defecto de los elementos que contiene.
 */
export function Escalonado({ as = "div", retardo = 0, paso = PASO_CASCADA, alVer = true, children, ...props }: EscalonadoProps) {
  const { ref, visible } = useAparicion<HTMLDivElement>(alVer);
  const configuracion = useMemo(() => ({ paso, retardo }), [paso, retardo]);
  const Etiqueta = ETIQUETAS_MOVIMIENTO[as];

  return (
    <Etiqueta ref={ref} initial="oculto" animate={visible ? "visible" : "oculto"} {...props}>
      <ContextoEscalonado value={configuracion}>
        {Children.map(children, (hijo, posicion) => (
          <ContextoOrden value={posicion}>{hijo}</ContextoOrden>
        ))}
      </ContextoEscalonado>
    </Etiqueta>
  );
}

export interface EscalonadoItemProps extends PropsBaseMovimiento {
  as?: EtiquetaMovimiento;
  /** Turno en la cascada (0 = primero). Sin él, la posición de su hijo directo en `Escalonado`. */
  orden?: number;
  children?: ReactNode;
}

/**
 * Un elemento de la cascada: fundido + sube 20 px, con `orden × paso` de espera.
 * Con movimiento reducido solo hay fundido. Fuera de un `Escalonado` no se anima.
 */
export function EscalonadoItem({ as = "div", orden, className, children, ...props }: EscalonadoItemProps) {
  const reducir = useReducedMotion();
  const { paso, retardo } = useContext(ContextoEscalonado);
  const posicion = useContext(ContextoOrden);
  const Etiqueta = ETIQUETAS_MOVIMIENTO[as];

  return (
    <Etiqueta
      variants={{
        oculto: { opacity: 0, y: reducir ? 0 : SUBIDA_CASCADA },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: DURACION_ENTRADA, ease: CURVA, delay: retardo + (orden ?? posicion) * paso },
        },
      }}
      className={cn(CLASE_IMPRESION, className)}
      {...props}
    >
      {children}
    </Etiqueta>
  );
}
