import { useCallback, useSyncExternalStore } from "react";

function suscribir(avisar: () => void): () => void {
  window.addEventListener("scroll", avisar, { passive: true });
  return () => window.removeEventListener("scroll", avisar);
}

/** `true` cuando la página se ha desplazado más de `umbral` píxeles (sombra de la cabecera). */
export function useScrollPasado(umbral = 10): boolean {
  const leer = useCallback(() => window.scrollY > umbral, [umbral]);
  return useSyncExternalStore(suscribir, leer);
}
