import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

/** A partir de este ancho se ve la navegación de escritorio (`md` de Tailwind). */
const CONSULTA_ESCRITORIO = "(min-width: 48rem)";

export interface UseMenuMovil {
  abierto: boolean;
  /** Lo llama el panel al abrir o cerrar (botón, Escape, clic fuera). */
  cambiar: (abierto: boolean) => void;
  cerrar: () => void;
}

/**
 * Estado del menú móvil. Se cierra solo al cambiar de ruta (el estado guarda en
 * qué navegación se abrió) y al pasar a ancho de escritorio.
 * `abiertoAlMontar`: nace abierto (el menú se monta al pulsar su botón por primera vez).
 */
export function useMenuMovil(abiertoAlMontar = false): UseMenuMovil {
  const { key } = useLocation();
  const [abiertoEn, setAbiertoEn] = useState<string | null>(abiertoAlMontar ? key : null);

  const cerrar = useCallback(() => setAbiertoEn(null), []);
  const cambiar = useCallback((abierto: boolean) => setAbiertoEn(abierto ? key : null), [key]);

  useEffect(() => {
    const consulta = window.matchMedia(CONSULTA_ESCRITORIO);
    const alCambiar = () => {
      if (consulta.matches) setAbiertoEn(null);
    };
    consulta.addEventListener("change", alCambiar);
    return () => consulta.removeEventListener("change", alCambiar);
  }, []);

  return { abierto: abiertoEn === key, cambiar, cerrar };
}
