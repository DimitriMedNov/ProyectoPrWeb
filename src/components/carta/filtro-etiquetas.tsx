import { motion } from "motion/react";
import { Icono } from "@/components/shared";
import type { FiltroCarta, IconoEtiqueta, OpcionFiltro } from "@/domain/carta";
import { cn } from "@/lib/utils";
import { useImanFiltro } from "./use-iman-filtro";

/** Color del icono de cada filtro: hoja verde, chile rojo. */
const COLOR_ICONO: Record<IconoEtiqueta, string> = {
  leaf: "text-acc-cilantro",
  chile: "text-arc",
};

export interface FiltroEtiquetasProps {
  opciones: readonly OpcionFiltro[];
  filtro: FiltroCarta;
  onFiltro: (filtro: FiltroCarta) => void;
}

/**
 * "Mostrar:" + un botón por opción. Solo uno activo a la vez (`aria-pressed`).
 * El elegido se hincha y aparta a los demás (Bencho, "Magnetic select").
 */
export function FiltroEtiquetas({ opciones, filtro, onFiltro }: FiltroEtiquetasProps) {
  const iman = useImanFiltro(opciones.findIndex((opcion) => opcion.valor === filtro));

  return (
    <div role="group" aria-labelledby="carta-filtro" className="-mx-gutter flex min-w-0 items-center md:justify-center">
      {/* py-1 / -my-1: sitio para que el botón elegido crezca sin que la fila tenga scroll vertical. */}
      <div className="scrollbar-none -my-1 flex items-center gap-2 overflow-x-auto px-gutter py-1">
        <span id="carta-filtro" className="shrink-0 text-label text-mut">
          Mostrar:
        </span>
        {opciones.map((opcion, posicion) => (
          <motion.button
            key={opcion.valor}
            type="button"
            aria-pressed={opcion.valor === filtro}
            onClick={() => onFiltro(opcion.valor)}
            initial={false}
            animate={iman(posicion)}
            // min-h-12 (48 px) y no min-h-11: las no elegidas se encogen hasta 0,96 y 48 × 0,96 = 46 px,
            // así el área pulsable nunca baja de 44 px, ni en el rebote del muelle.
            className="inline-flex min-h-12 shrink-0 items-center gap-1.5 rounded-full border border-field bg-panel px-4 text-label font-medium whitespace-nowrap text-txt transition-colors hover:border-arc aria-pressed:border-arc aria-pressed:bg-arc/10"
          >
            {opcion.icono ? <Icono nombre={opcion.icono} className={cn("size-4", COLOR_ICONO[opcion.icono])} /> : null}
            {opcion.texto}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
