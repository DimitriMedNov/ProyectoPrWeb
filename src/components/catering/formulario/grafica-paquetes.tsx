import { useId, useMemo } from "react";
import { Bar } from "@/components/charts/bar";
import { BarChart } from "@/components/charts/bar-chart";
import { Boton } from "@/components/shared";
import { useSeriePaquetes } from "@/hooks/catering/use-serie-paquetes";

/** Sin márgenes laterales: cada barra queda sobre su columna de la lista de totales. */
const MARGEN = { top: 8, right: 0, bottom: 0, left: 0 };
/** Separación mínima para que Bklit redondee las dos series apiladas, no solo la última. */
const SEPARACION = 0.01;

export interface GraficaPaquetesProps {
  /** Invitados tal como están escritos en el formulario. */
  invitados: string;
  /** Nombre del paquete marcado: su barra va resaltada. */
  elegido: string;
  /** Acción del estado vacío: llevar el foco al campo de invitados. */
  onPedirInvitados: () => void;
}

/**
 * Barras con el total de los 3 paquetes para los invitados escritos. La barra
 * del paquete elegido usa otra serie (otro color) y lleva la palabra "Elegido".
 * La lista de debajo da los mismos totales como texto.
 */
export function GraficaPaquetes({
  invitados,
  elegido,
  onPedirInvitados,
}: GraficaPaquetesProps) {
  const idTitulo = useId();
  const { serie, hayDatos } = useSeriePaquetes(invitados);
  const datos = useMemo(
    () =>
      serie.map((punto) => ({
        paquete: punto.paquete,
        elegido: punto.paquete === elegido ? punto.total : 0,
        otros: punto.paquete === elegido ? 0 : punto.total,
      })),
    [serie, elegido],
  );

  return (
    <figure
      aria-labelledby={idTitulo}
      className="m-0 flex min-w-0 flex-col gap-3 rounded-card border border-line bg-panel p-4"
    >
      <figcaption id={idTitulo} className="text-label font-semibold text-txt">
        Total de cada paquete con tus invitados
      </figcaption>
      {hayDatos ? (
        <div className="flex min-h-40 flex-col gap-2">
          <div aria-hidden="true">
            <BarChart
              data={datos}
              xDataKey="paquete"
              stacked
              aspectRatio="3 / 1"
              margin={MARGEN}
            >
              <Bar
                dataKey="elegido"
                fill="var(--chart-1)"
                stackGap={SEPARACION}
              />
              <Bar
                dataKey="otros"
                fill="var(--chart-5)"
                stackGap={SEPARACION}
              />
            </BarChart>
          </div>
          <ul className="m-0 grid list-none grid-cols-3 gap-2 p-0 text-center">
            {serie.map((punto) => (
              <li
                key={punto.paquete}
                className="flex min-w-0 flex-col items-center gap-0.5"
              >
                <span className="text-caption text-mut">{punto.paquete}</span>
                <span className="text-label font-semibold text-txt">
                  {punto.totalTexto}
                </span>
                {punto.paquete === elegido ? (
                  <span className="text-caption font-medium text-arc">
                    Elegido
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="flex min-h-40 flex-col items-center justify-center gap-3 text-center">
          <p className="text-label text-mut">
            Escribe el número de invitados para comparar el total de los tres
            paquetes.
          </p>
          <Boton variante="secundaria" onClick={onPedirInvitados}>
            Escribir invitados
          </Boton>
        </div>
      )}
    </figure>
  );
}
