import { useEffect, useRef, useState } from "react";
import {
  useAnimate,
  useReducedMotion,
  type TargetAndTransition,
} from "motion/react";
import { CONTADOR } from "./movimiento";

type Lado = -1 | 0 | 1;

export interface GestosBoton {
  onPointerDown: () => void;
  onPointerUp: () => void;
  onPointerLeave: () => void;
  onPointerCancel: () => void;
}

export interface ContadorVivo {
  /** Envoltorio del número: da un pulso cada vez que el valor cambia. */
  refValor: React.RefObject<HTMLDivElement | null>;
  /** Animación del grupo: se inclina hacia el botón pulsado. */
  inclinacion: TargetAndTransition;
  perspectiva: number | undefined;
  /** Gestos de puntero de cada botón; en el límite (`aria-disabled`) no inclinan. */
  quitar: GestosBoton;
  anadir: GestosBoton;
}

/**
 * Respuesta del contador (Bencho, "Drag stepper"): el grupo se inclina hacia el
 * lado pulsado y el número da un pulso al cambiar. Con movimiento reducido no hace nada.
 * No cambia el valor: eso sigue siendo cosa de `cambiarMeseras`.
 */
export function useContadorVivo(
  valor: string,
  puedeQuitar: boolean,
  puedeAnadir: boolean,
): ContadorVivo {
  const reducir = useReducedMotion();
  const [lado, setLado] = useState<Lado>(0);
  const [refValor, animar] = useAnimate<HTMLDivElement>();
  const anterior = useRef(valor);

  useEffect(() => {
    if (anterior.current === valor) return undefined;
    anterior.current = valor;
    if (reducir || !refValor.current) return undefined;
    const pulso = animar(
      refValor.current,
      { scale: [CONTADOR.pulso, 1] },
      CONTADOR.soltar,
    );
    return () => pulso.stop();
  }, [valor, reducir, animar, refValor]);

  const soltar = () => setLado(0);
  const pulsado = !reducir && lado !== 0;
  const gestos = (cual: -1 | 1, activo: boolean): GestosBoton => ({
    onPointerDown: () => setLado(activo ? cual : 0),
    onPointerUp: soltar,
    onPointerLeave: soltar,
    onPointerCancel: soltar,
  });

  return {
    refValor,
    perspectiva: reducir ? undefined : CONTADOR.perspectiva,
    inclinacion: pulsado
      ? {
          rotateY: lado * CONTADOR.giro,
          scale: CONTADOR.hundido,
          transition: CONTADOR.pulsar,
        }
      : { rotateY: 0, scale: 1, transition: CONTADOR.soltar },
    quitar: gestos(-1, puedeQuitar),
    anadir: gestos(1, puedeAnadir),
  };
}
