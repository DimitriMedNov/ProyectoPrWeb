import type { RefObject } from "react";
import { motion } from "motion/react";
import { Contenedor } from "@/components/shared";
import type { FiltroCarta, OpcionFiltro, PestanaCarta } from "@/domain/carta";
import { FiltroEtiquetas } from "./filtro-etiquetas";
import { ID_RESALTADO_PESTANA, TRANSICION_RECOLOCAR } from "./movimiento-carta";

export interface BarraCategoriasProps {
  pestanas: readonly PestanaCarta[];
  /** id de la sección a la vista, o null. */
  activa: string | null;
  /** Ref del `<ul>` con scroll horizontal (lo usa el scroll-spy para centrar la activa). */
  listaRef: RefObject<HTMLUListElement | null>;
  opciones: readonly OpcionFiltro[];
  filtro: FiltroCarta;
  onFiltro: (filtro: FiltroCarta) => void;
  /** "16 platillos": se anuncia al cambiar el filtro. */
  textoConteo: string;
}

/**
 * Barra pegada bajo la cabecera: pestañas (enlaces a las anclas de la página,
 * no paneles) y el filtro "Mostrar:".
 */
export function BarraCategorias({ pestanas, activa, listaRef, opciones, filtro, onFiltro, textoConteo }: BarraCategoriasProps) {
  return (
    <div className="sticky top-header z-30 border-y border-line bg-void/85 backdrop-blur-md">
      <Contenedor className="flex flex-col gap-1 py-2">
        <nav aria-label="Categorías del menú" className="-mx-gutter min-w-0">
          <ul ref={listaRef} className="scrollbar-none relative flex gap-2 overflow-x-auto px-gutter md:justify-center">
            {pestanas.map((pestana) => (
              <li key={pestana.id} className="shrink-0">
                <a
                  href={pestana.ancla}
                  aria-current={pestana.id === activa ? "true" : undefined}
                  className="relative isolate inline-flex min-h-11 items-center rounded-full bg-panel-2 px-4 text-label font-medium whitespace-nowrap text-txt no-underline transition-colors hover:bg-line/40 aria-[current=true]:text-void"
                >
                  {/* Un solo resaltado para toda la lista: Motion lo desliza de la pestaña anterior a esta. */}
                  {pestana.id === activa ? (
                    <motion.span
                      layoutId={ID_RESALTADO_PESTANA}
                      aria-hidden="true"
                      transition={TRANSICION_RECOLOCAR}
                      className="absolute inset-0 -z-10 rounded-full bg-txt"
                    />
                  ) : null}
                  {pestana.titulo}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <FiltroEtiquetas opciones={opciones} filtro={filtro} onFiltro={onFiltro} />
        <p className="sr-only" aria-live="polite">
          {textoConteo}
        </p>
      </Contenedor>
    </div>
  );
}
