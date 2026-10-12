import { useEffect, useRef, useState } from "react";

/** Abre el modal desde un botón: paquete a preseleccionar (o ninguno) y el botón pulsado. */
export type AlSolicitar = (paquete: string | undefined, disparador: HTMLElement) => void;

export interface ModalSolicitudEstado {
  abierto: boolean;
  /** Para `onCambioAbierto` del modal (Escape, X, clic en el fondo). */
  cambiarAbierto: (abierto: boolean) => void;
  solicitar: AlSolicitar;
}

/**
 * Estado abierto/cerrado del modal de solicitud. Como se abre por estado (sin
 * disparador del diálogo), recuerda el botón que lo abrió y le devuelve el
 * foco al cerrar.
 */
export function useModalSolicitud(alAbrir: (paquete?: string) => void): ModalSolicitudEstado {
  const [abierto, setAbierto] = useState(false);
  const disparador = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const elemento = disparador.current;
    if (abierto || !elemento) return undefined;
    // Un turno después: el diálogo ya soltó la trampa de foco.
    const turno = window.setTimeout(() => {
      disparador.current = null;
      if (elemento.isConnected) elemento.focus();
    }, 0);
    return () => window.clearTimeout(turno);
  }, [abierto]);

  return {
    abierto,
    cambiarAbierto: setAbierto,
    solicitar: (paquete, origen) => {
      disparador.current = origen;
      alAbrir(paquete);
      setAbierto(true);
    },
  };
}
