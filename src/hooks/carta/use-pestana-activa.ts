import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import { resolverPestana } from "@/domain/carta";
import type { PestanaPulsada } from "@/domain/carta";

/** Franja fina bajo la cabecera y las pestañas: la sección que la cruza es la activa. */
const FRANJA = "-30% 0px -65% 0px";

/** Sin eventos de scroll durante este tiempo, el desplazamiento hacia la pestaña pulsada terminó. */
const ASIENTO_MS = 150;

/** "#bebidas" → "bebidas"; "" si no hay ancla. */
function idDeAncla(hash: string): string {
  const crudo = hash.replace(/^#/, "");
  try {
    return decodeURIComponent(crudo);
  } catch {
    return crudo;
  }
}

function anclaActual(): string | null {
  if (typeof window === "undefined") return null;
  return idDeAncla(window.location.hash) || null;
}

export interface UsePestanaActiva {
  /** id de la sección activa ("tacos"…), o null mientras ninguna haya cruzado la franja. */
  activa: string | null;
  /** Ref para el contenedor con scroll horizontal de las pestañas (el `<ul>`). */
  listaRef: RefObject<HTMLUListElement | null>;
}

/**
 * Scroll-spy de la carta: observa las secciones cuyo `id` está en `ids` (en el
 * orden de las pestañas) y dice cuál está activa. Además desplaza en
 * horizontal la lista de pestañas para centrar la activa, sin mover la página.
 *
 * Al pulsar una pestaña (clic o Enter en su enlace, o cambio del ancla de la
 * URL) esa queda activa de inmediato y se mantiene mientras su sección cruce
 * la franja, aunque otra anterior en el orden la cruce a la vez (dos columnas).
 *
 * Requisitos de la interfaz: cada sección lleva su `id`, y cada pestaña es un
 * enlace `<a>` con ancla `#id` dentro del elemento de `listaRef`.
 */
export function usePestanaActiva(ids: readonly string[]): UsePestanaActiva {
  // Al cargar con /menu#bebidas, la activa inicial es la del ancla.
  const [marcada, setMarcada] = useState<string | null>(anclaActual);
  const listaRef = useRef<HTMLUListElement | null>(null);
  // La pestaña pulsada sobrevive a un cambio de filtro (si su sección sigue visible).
  const pulsadaRef = useRef<PestanaPulsada | null>(null);
  const anclaLeidaRef = useRef(false);
  // Las secciones cambian al filtrar: la clave evita reobservar si llega otro array con los mismos ids.
  const clave = ids.join("|");

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return undefined;
    const orden = clave ? clave.split("|") : [];
    const enVista = new Set<string>();
    let temporizador: number | undefined;

    const publicar = () => {
      const { activa, pulsada } = resolverPestana(orden, enVista, pulsadaRef.current);
      pulsadaRef.current = pulsada;
      // Si no cruza ninguna (hueco entre secciones) se conserva la última, como antes.
      if (activa) setMarcada(activa);
    };

    // El viaje termina cuando dejan de llegar eventos de scroll; desde ahí, la pulsada
    // solo se suelta cuando el usuario desplaza y su sección no cruza la franja.
    const esperarAsiento = () => {
      window.clearTimeout(temporizador);
      temporizador = window.setTimeout(() => {
        const pulsada = pulsadaRef.current;
        if (pulsada) pulsadaRef.current = { id: pulsada.id, enCamino: false };
      }, ASIENTO_MS);
    };

    const pulsar = (id: string) => {
      if (!orden.includes(id)) return;
      pulsadaRef.current = { id, enCamino: true };
      esperarAsiento();
      publicar();
    };

    const alPulsar = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const lista = listaRef.current;
      if (!lista || !(event.target instanceof Element)) return;
      const enlace = event.target.closest("a");
      if (enlace && lista.contains(enlace)) pulsar(idDeAncla(enlace.hash));
    };
    const alCambiarAncla = () => pulsar(idDeAncla(window.location.hash));
    const alDesplazar = () => {
      const pulsada = pulsadaRef.current;
      if (!pulsada) return;
      if (pulsada.enCamino) esperarAsiento();
      else publicar();
    };

    if (!anclaLeidaRef.current && orden.length > 0) {
      anclaLeidaRef.current = true;
      const inicial = idDeAncla(window.location.hash);
      if (orden.includes(inicial)) pulsadaRef.current = { id: inicial, enCamino: true };
    }
    if (pulsadaRef.current?.enCamino) esperarAsiento();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) enVista.add(entry.target.id);
          else enVista.delete(entry.target.id);
        }
        publicar();
      },
      { rootMargin: FRANJA },
    );

    for (const id of orden) {
      const seccion = document.getElementById(id);
      if (seccion) observer.observe(seccion);
    }
    document.addEventListener("click", alPulsar);
    window.addEventListener("hashchange", alCambiarAncla);
    window.addEventListener("scroll", alDesplazar, { passive: true });
    return () => {
      observer.disconnect();
      document.removeEventListener("click", alPulsar);
      window.removeEventListener("hashchange", alCambiarAncla);
      window.removeEventListener("scroll", alDesplazar);
      window.clearTimeout(temporizador);
    };
  }, [clave]);

  // Una sección que el filtro ocultó no puede seguir marcada.
  const activa = marcada !== null && ids.includes(marcada) ? marcada : null;

  useEffect(() => {
    const lista = listaRef.current;
    if (!lista || !activa) return;
    const pestana = Array.from(lista.querySelectorAll<HTMLAnchorElement>("a")).find((a) => a.hash === `#${activa}`);
    if (!pestana) return;
    const left = pestana.offsetLeft - (lista.clientWidth - pestana.offsetWidth) / 2;
    const sinMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    lista.scrollTo({ left, behavior: sinMovimiento ? "auto" : "smooth" });
  }, [activa]);

  return { activa, listaRef };
}
