import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

/** Las páginas se cargan con `lazy()`: el destino puede tardar un instante en existir. */
const ESPERA_MAXIMA_MS = 3000;

/** Ejecuta `accion` cuando exista el elemento con ese id; devuelve la limpieza. */
function cuandoExista(id: string, accion: (el: HTMLElement) => void): () => void {
  const ahora = document.getElementById(id);
  if (ahora) {
    accion(ahora);
    return () => undefined;
  }
  const observer = new MutationObserver(() => {
    const el = document.getElementById(id);
    if (!el) return;
    parar();
    accion(el);
  });
  const timer = window.setTimeout(() => observer.disconnect(), ESPERA_MAXIMA_MS);
  function parar() {
    observer.disconnect();
    window.clearTimeout(timer);
  }
  observer.observe(document.body, { childList: true, subtree: true });
  return parar;
}

const idDelAncla = (hash: string): string => {
  try {
    return decodeURIComponent(hash.slice(1));
  } catch {
    return hash.slice(1);
  }
};

/** Decisión tomada para una ubicación concreta (ver el efecto). */
interface Visita {
  firma: string;
  primera: boolean;
  cambioDeRuta: boolean;
}

/**
 * Al cambiar de ruta: va arriba o al ancla (`/#delivery`, `/menu#tacos`…) y
 * mueve el foco a `<main id="main">`, como hacía cada carga de página.
 * - Primera carga: solo va al ancla (el navegador no la encuentra porque React
 *   aún no pintó); el foco no se toca.
 * - Atrás/adelante: el navegador restaura la posición; solo se mueve el foco.
 * - Cambio de ancla en la misma ruta: se desplaza y el foco no se toca.
 */
export function useDesplazamientoAlNavegar(): void {
  const { pathname, hash, key } = useLocation();
  const tipo = useNavigationType();
  const anterior = useRef<string | null>(null);
  const visita = useRef<Visita | null>(null);

  useEffect(() => {
    // Qué clase de visita es se decide una sola vez por ubicación. Si el efecto
    // se repite para la misma (StrictMode lo monta, limpia y vuelve a montar),
    // se reutiliza la decisión: si no, la segunda pasada ya no sería "primera
    // carga" y, tras haber limpiado la espera de la primera, nadie iría al ancla.
    const firma = `${key}|${pathname}|${hash}`;
    if (visita.current?.firma !== firma) {
      const primera = anterior.current === null;
      visita.current = { firma, primera, cambioDeRuta: !primera && anterior.current !== pathname };
      anterior.current = pathname;
    }
    const { primera, cambioDeRuta } = visita.current;

    const limpiezas: (() => void)[] = [];
    const id = idDelAncla(hash);

    if (primera) {
      if (id) limpiezas.push(cuandoExista(id, (el) => el.scrollIntoView()));
    } else if (tipo !== "POP") {
      if (id) {
        // Entre rutas, salto directo; dentro de la misma, el que marque el CSS.
        limpiezas.push(
          cuandoExista(id, (el) => el.scrollIntoView({ behavior: cambioDeRuta ? "instant" : "auto" })),
        );
      } else if (cambioDeRuta) {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      }
    }

    if (cambioDeRuta) {
      limpiezas.push(
        cuandoExista("main", (main) => {
          if (!main.hasAttribute("tabindex")) main.setAttribute("tabindex", "-1");
          main.focus({ preventScroll: true });
        }),
      );
    }

    return () => limpiezas.forEach((limpiar) => limpiar());
  }, [pathname, hash, key, tipo]);
}
