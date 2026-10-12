import { useSyncExternalStore } from "react";

/** Por debajo del punto de corte `sm` de Tailwind (640 px) el modal es una hoja inferior. */
const CONSULTA = "(max-width: 639.98px)";

function suscribir(avisar: () => void): () => void {
  const consulta = window.matchMedia(CONSULTA);
  consulta.addEventListener("change", avisar);
  return () => consulta.removeEventListener("change", avisar);
}

/** `true` cuando el modal se muestra como hoja inferior (móvil). */
export function useHojaInferior(): boolean {
  return useSyncExternalStore(
    suscribir,
    () => window.matchMedia(CONSULTA).matches,
    () => false,
  );
}
