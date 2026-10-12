import { useCallback, useState } from "react";
import type { RefCallback } from "react";

/**
 * Distancia a la que un elemento ya cuenta como "cerca". Corta a propósito: con el
 * `loading="lazy"` del navegador (unos 1250 px en Chrome) las imágenes de la sección
 * siguiente se piden al cargar la página y le quitan ancho de banda al primer pantallazo.
 */
const MARGEN = "200px";

/** `scrollMargin` aún no está en los tipos del DOM de TypeScript. */
interface OpcionesObservador extends IntersectionObserverInit {
  scrollMargin?: string;
}

const hayObservador = () => typeof IntersectionObserver !== "undefined";

/**
 * `scrollMargin` agranda la ventana y también cada carril con scroll por el que pasa el
 * elemento; `rootMargin`, solo la ventana. Se usa uno u otro, nunca los dos: en la
 * ventana se suman (medido en Chromium: 200 + 200 se comporta como 400).
 */
const opciones = (): OpcionesObservador =>
  "scrollMargin" in IntersectionObserver.prototype ? { scrollMargin: MARGEN } : { rootMargin: MARGEN };

export interface UseCercaDeVentana<T extends Element> {
  /** `ref` del elemento que se vigila. Al desmontarlo, el observador se desconecta. */
  ref: RefCallback<T>;
  /** `true` desde que el elemento queda a menos de 200 px de la ventana; ya no vuelve a `false`. */
  cerca: boolean;
}

/**
 * Avisa cuando un elemento se acerca a la ventana (IntersectionObserver, una sola vez).
 * Dentro de un carril con scroll horizontal también cuenta el vecino del que se ve
 * (`scrollMargin`); donde el navegador no lo admite, el vecino avisa al empezar a asomar.
 * Sin IntersectionObserver, `cerca` es `true` desde el principio.
 */
export function useCercaDeVentana<T extends Element>(): UseCercaDeVentana<T> {
  const [cerca, setCerca] = useState(() => !hayObservador());

  const ref = useCallback<RefCallback<T>>((elemento) => {
    if (!elemento || !hayObservador()) return undefined;
    const observador = new IntersectionObserver((entradas) => {
      if (!entradas.some((entrada) => entrada.isIntersecting)) return;
      setCerca(true);
      observador.disconnect();
    }, opciones());
    observador.observe(elemento);
    return () => observador.disconnect();
  }, []);

  return { ref, cerca };
}
