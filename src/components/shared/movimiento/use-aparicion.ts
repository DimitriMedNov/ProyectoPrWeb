import { useEffect, useRef, useState, type RefObject } from "react";

/** Se dispara un poco antes del borde inferior, con un 5 % del elemento dentro. */
const MARGEN = "0px 0px -12% 0px";
const UMBRAL = 0.05;
/** Seguro: si el observador no avisó y el elemento ya está en pantalla, se muestra. */
const SEGURO_MS = 2500;

export interface Aparicion<T extends Element> {
  ref: RefObject<T | null>;
  /** `true` desde que el elemento entró en pantalla (o desde el inicio si `alVer` es falso). */
  visible: boolean;
}

/**
 * Dice cuándo debe aparecer un elemento: al entrar en pantalla, una sola vez.
 * Nunca lo deja oculto: sin `IntersectionObserver` aparece ya, a los 2,5 s se
 * comprueba a mano si está en pantalla, y antes de imprimir se muestra.
 */
export function useAparicion<T extends Element>(alVer: boolean): Aparicion<T> {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(() => !alVer || typeof IntersectionObserver === "undefined");

  useEffect(() => {
    const el = ref.current;
    if (visible || !el) return undefined;
    const mostrar = () => setVisible(true);

    const observador = new IntersectionObserver(
      (entradas) => {
        if (entradas.some((entrada) => entrada.isIntersecting)) mostrar();
      },
      { rootMargin: MARGEN, threshold: UMBRAL },
    );
    observador.observe(el);

    const seguro = window.setTimeout(() => {
      const caja = el.getBoundingClientRect();
      if (caja.top < window.innerHeight && caja.bottom > 0) mostrar();
    }, SEGURO_MS);
    window.addEventListener("beforeprint", mostrar);

    return () => {
      observador.disconnect();
      window.clearTimeout(seguro);
      window.removeEventListener("beforeprint", mostrar);
    };
  }, [visible]);

  return { ref, visible };
}
