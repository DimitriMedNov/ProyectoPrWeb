import { useCallback, useEffect, useRef } from "react";
import type { RefObject } from "react";
import { CAMPOS_SOLICITUD } from "@/domain/catering";
import type { CampoSolicitud } from "@/domain/catering";
import type { ErrorEnvio } from "@/domain/catering-envio";

export interface FocoFormulario {
  refFormulario: RefObject<HTMLFormElement | null>;
  /** Lleva el foco al control de ese campo (en grupos, a la opción marcada o a la primera disponible). */
  enfocar: (campo: CampoSolicitud) => void;
}

/**
 * Foco dentro del formulario: al montarse va al paquete marcado y, cuando un
 * envío vuelve con errores por campo, al primer campo con error.
 */
export function useFocoFormulario(error: ErrorEnvio | null): FocoFormulario {
  const refFormulario = useRef<HTMLFormElement>(null);

  const enfocar = useCallback((campo: CampoSolicitud) => {
    const formulario = refFormulario.current;
    if (!formulario) return;
    const marcado = formulario.querySelector<HTMLElement>(
      `[data-campo="${campo}"][aria-checked="true"]`,
    );
    const destino =
      marcado ??
      formulario.querySelector<HTMLElement>(
        `[data-campo="${campo}"]:not(:disabled)`,
      );
    destino?.focus();
  }, []);

  useEffect(() => {
    enfocar("catering");
  }, [enfocar]);

  useEffect(() => {
    if (error?.tipo === "validacion") {
      const primero = CAMPOS_SOLICITUD.find((campo) => error.errores[campo]);
      if (primero) enfocar(primero);
    }
  }, [error, enfocar]);

  return { refFormulario, enfocar };
}
