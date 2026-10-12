import { useReducedMotion } from "motion/react";
import { SlidingNumber } from "@/components/animate-ui/primitives/texts/sliding-number";
import type { TotalEstimado as Total } from "@/domain/catering";

export interface TotalEstimadoProps {
  total: Total;
}

/**
 * Total estimado del pie. Con importe, las cifras ruedan al cambiar (Animate UI,
 * `SlidingNumber`); el texto exacto queda para lectores de pantalla. Sin importe
 * ("—") o con movimiento reducido, texto fijo.
 */
export function TotalEstimado({ total }: TotalEstimadoProps) {
  const reducir = useReducedMotion();
  const animar = total.total !== null && !reducir;
  // El símbolo sale del texto que ya formateó el dominio ("$1,280"), no se repite aquí.
  const simbolo = /^\D*/.exec(total.texto)?.[0] ?? "";
  const miles = /\d(\D)\d{3}$/.exec(total.texto)?.[1] ?? ",";

  return (
    <div className="min-w-0">
      <p className="text-caption text-mut">Total estimado</p>
      <p className="text-title font-semibold text-txt" data-total={total.texto}>
        {animar && total.total !== null ? (
          <>
            <span className="sr-only">{total.texto}</span>
            <span
              aria-hidden="true"
              className="inline-flex items-center tabular-nums"
            >
              {simbolo}
              <SlidingNumber number={total.total} thousandSeparator={miles} />
            </span>
          </>
        ) : (
          total.texto
        )}
      </p>
      <p className="text-caption text-mut">{total.detalle}</p>
    </div>
  );
}
