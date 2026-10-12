import { BotonEnlace } from "@/components/shared";
import { EscalonadoItem } from "@/components/shared/movimiento";
import type { SalidaNoEncontrada } from "@/domain/no-encontrada";

export interface SalidasNoEncontradaProps {
  /** En el orden en que se muestran: primero el botón, después el enlace. */
  salidas: readonly SalidaNoEncontrada[];
}

/** Las dos salidas de la pantalla 404 (turno 4 de la cascada). El chevron del enlace lo pone `BotonEnlace`. */
export function SalidasNoEncontrada({ salidas }: SalidasNoEncontradaProps) {
  return (
    <EscalonadoItem as="nav" orden={4} aria-label="Salidas" className="flex flex-wrap items-center gap-x-6 gap-y-2">
      {salidas.map((salida) => (
        <BotonEnlace key={salida.id} to={salida.destino} variante={salida.variante}>
          {salida.etiqueta}
        </BotonEnlace>
      ))}
    </EscalonadoItem>
  );
}
