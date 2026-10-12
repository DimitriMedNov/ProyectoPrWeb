import { useCallback, useMemo, useRef, useState } from "react";
import type { RefCallback } from "react";
import { desplazamientoParaIndice, estadoGaleria, indiceDesdeDesplazamiento } from "@/domain/nosotros-galeria";
import type { EstadoGaleria } from "@/domain/nosotros-galeria";

/** Espera tras el último evento de scroll antes de actualizar el contador. */
const ESPERA_SCROLL_MS = 80;

export interface UseGaleria extends EstadoGaleria {
  /**
   * `ref` del carril (el elemento con `overflow-x` y `scroll-snap`). El hook
   * escucha su scroll y el cambio de tamaño de la ventana, y limpia al desmontar.
   */
  carrilRef: RefCallback<HTMLElement>;
  /** Va a la foto anterior. No hace nada en la primera. */
  anterior: () => void;
  /** Va a la foto siguiente. No hace nada en la última. */
  siguiente: () => void;
  /** Va a la foto `indice` (desde 0); fuera de rango se queda en el extremo. */
  irA: (indice: number) => void;
}

/**
 * Galería deslizable: el desplazamiento y el encaje foto a foto son CSS
 * (`scroll-snap`), y dedo, trackpad y flechas del teclado los resuelve el
 * navegador sobre el carril enfocable. Este hook solo añade lo que antes hacía
 * `initGallery`: saber qué foto se ve (para el contador y los extremos) y mover
 * el carril desde los botones.
 *
 * El movimiento usa `scrollTo` sin `behavior`: si es suave o instantáneo lo
 * decide el CSS del carril (`scroll-behavior`), que es donde se respeta
 * `prefers-reduced-motion`.
 *
 * @param total Número de fotos.
 */
export function useGaleria(total: number): UseGaleria {
  const carril = useRef<HTMLElement | null>(null);
  const [indice, setIndice] = useState(0);

  const carrilRef = useCallback<RefCallback<HTMLElement>>(
    (elemento) => {
      carril.current = elemento;
      if (!elemento) return undefined;

      const sincronizar = () => setIndice(indiceDesdeDesplazamiento(elemento.scrollLeft, elemento.clientWidth, total));

      // El contador se actualiza cuando el desplazamiento se detiene.
      let temporizador = 0;
      const alDesplazar = () => {
        window.clearTimeout(temporizador);
        temporizador = window.setTimeout(sincronizar, ESPERA_SCROLL_MS);
      };

      elemento.addEventListener("scroll", alDesplazar, { passive: true });
      window.addEventListener("resize", sincronizar);
      sincronizar();

      return () => {
        window.clearTimeout(temporizador);
        elemento.removeEventListener("scroll", alDesplazar);
        window.removeEventListener("resize", sincronizar);
        carril.current = null;
      };
    },
    [total],
  );

  const irA = useCallback(
    (destino: number) => {
      const elemento = carril.current;
      if (!elemento) return;
      elemento.scrollTo({ left: desplazamientoParaIndice(destino, elemento.clientWidth, total) });
    },
    [total],
  );

  /** Parte de la foto que se ve ahora mismo en el carril, no del contador (que va 80 ms por detrás). */
  const mover = useCallback(
    (delta: number) => {
      const elemento = carril.current;
      if (!elemento) return;
      irA(indiceDesdeDesplazamiento(elemento.scrollLeft, elemento.clientWidth, total) + delta);
    },
    [irA, total],
  );

  const estado = useMemo(() => estadoGaleria(indice, total), [indice, total]);
  const { esPrimera, esUltima } = estado;

  const anterior = useCallback(() => {
    if (!esPrimera) mover(-1);
  }, [esPrimera, mover]);

  const siguiente = useCallback(() => {
    if (!esUltima) mover(1);
  }, [esUltima, mover]);

  return { ...estado, carrilRef, anterior, siguiente, irA };
}
