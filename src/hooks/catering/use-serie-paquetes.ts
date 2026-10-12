import { useMemo } from "react";
import { serieTotalesPorPaquete } from "@/domain/catering";
import type { PuntoSeriePaquetes } from "@/domain/catering";

export interface SeriePaquetes {
  /** Un punto por paquete (Buffet, Comida formal, Cena temática) con su total. */
  serie: PuntoSeriePaquetes[];
  /** `false` mientras los invitados no sean un entero que llegue al mínimo: estado vacío. */
  hayDatos: boolean;
}

/** Serie de barras: total de cada paquete para los invitados escritos en el formulario. */
export function useSeriePaquetes(invitados: string): SeriePaquetes {
  return useMemo(() => {
    const serie = serieTotalesPorPaquete(invitados);
    return { serie, hayDatos: serie.length > 0 };
  }, [invitados]);
}
