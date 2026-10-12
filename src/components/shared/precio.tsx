import { money } from "@/domain/menu";
import { cn } from "@/lib/utils";

export interface PrecioProps {
  valor: number;
  /** Decimales que se muestran (2 por defecto; 0 para precios por persona). */
  decimales?: number;
  /** Texto pequeño detrás del precio: "por persona". */
  sufijo?: string;
  className?: string;
}

/** Precio con el formato del sitio (`money`) y cifras de ancho fijo. */
export function Precio({ valor, decimales, sufijo, className }: PrecioProps) {
  return (
    <span className={cn("font-semibold text-arc tabular-nums", className)}>
      <data value={valor}>{money(valor, decimales)}</data>
      {sufijo ? <span className="ml-1 text-caption font-normal text-mut">{sufijo}</span> : null}
    </span>
  );
}
