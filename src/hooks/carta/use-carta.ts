import { useCallback, useMemo, useState } from "react";
import { CARTA } from "@/application/carta";
import { SIN_FILTRO } from "@/domain/carta";
import type { CartaVisible, FiltroCarta, OpcionFiltro } from "@/domain/carta";
import { useCasosDeUso } from "@/hooks/use-dependencias";

export interface UseCarta {
  /** Filtro actual; "" es "Todo" (el de entrada). */
  filtro: FiltroCarta;
  hayFiltro: boolean;
  /** Los 4 botones de "Mostrar:" (`valor`, `texto`, `icono`). Activo: `valor === filtro`. */
  opciones: readonly OpcionFiltro[];
  cambiarFiltro: (filtro: FiltroCarta) => void;
  /** Vuelve a "Todo": la acción para salir del estado vacío. */
  limpiarFiltro: () => void;
  /** Lo que se pinta: especialidades, categorías, pestañas, vacío y su mensaje. */
  carta: CartaVisible;
  conteo: number;
  /** "N platillos" / "1 platillo", para la región `aria-live`. */
  textoConteo: string;
}

/**
 * Estado del filtro de la carta. El filtro vive solo en memoria (la interfaz
 * anterior tampoco lo llevaba a la URL): al recargar vuelve a "Todo".
 */
export function useCarta(): UseCarta {
  const { verCarta, opcionesDeFiltro } = useCasosDeUso(CARTA);
  const [filtro, setFiltro] = useState<FiltroCarta>(SIN_FILTRO);

  const carta = useMemo(() => verCarta(filtro), [verCarta, filtro]);
  const opciones = useMemo(() => opcionesDeFiltro(), [opcionesDeFiltro]);
  const cambiarFiltro = useCallback((nuevo: FiltroCarta) => setFiltro(nuevo), []);
  const limpiarFiltro = useCallback(() => setFiltro(SIN_FILTRO), []);

  return {
    filtro,
    hayFiltro: carta.hayFiltro,
    opciones,
    cambiarFiltro,
    limpiarFiltro,
    carta,
    conteo: carta.conteo,
    textoConteo: carta.textoConteo,
  };
}
