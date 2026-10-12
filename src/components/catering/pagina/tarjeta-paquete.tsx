import { motion } from "motion/react";
import { Boton, Icono, Pildora, Precio, Tarjeta } from "@/components/shared";
import { useInclinacion } from "@/components/shared/movimiento";
import type { CateringPackage } from "@/domain/menu";
import type { AlSolicitar } from "./use-modal-solicitud";

export interface TarjetaPaqueteProps {
  paquete: CateringPackage;
  onSolicitar: AlSolicitar;
}

/**
 * "Tilt card" de Bencho rebajado para una tarjeta con texto y botón: 4° en vez
 * de 10°, y sin hundido (la tarjeta ya sube con `elevar`).
 */
const INCLINACION_PAQUETE = { grados: 4, hundido: 0 } as const;

/**
 * Paquete de catering: precio por persona, lo que incluye y botón para solicitarlo.
 * Sube 4 px con cursor o foco dentro (`elevar`, CSS) y se inclina cediendo bajo
 * el ratón (Motion, en el envoltorio): cada movimiento vive en un elemento distinto.
 */
export function TarjetaPaquete({ paquete, onSolicitar }: TarjetaPaqueteProps) {
  const destacado = paquete.featuredLabel !== undefined;
  const inclinacion = useInclinacion(INCLINACION_PAQUETE);
  return (
    <div {...inclinacion.zona} className="flex w-full">
      <motion.div style={inclinacion.giro} className="flex w-full print:transform-none!">
        <Tarjeta variante={destacado ? "destacada" : "base"} relleno="amplio" elevar className="relative flex h-full w-full flex-col gap-6 overflow-visible">
          {paquete.featuredLabel ? (
            <Pildora tono="marca" className="absolute top-0 right-6 -translate-y-1/2">
              {paquete.featuredLabel}
            </Pildora>
          ) : null}
          <div className="flex flex-col gap-3">
            <span className="plate flex size-12 items-center justify-center rounded-control">
              <Icono nombre={paquete.icon} className="size-6" />
            </span>
            <div className="flex flex-col gap-1">
              <h3 className="text-title font-semibold text-txt">{paquete.name}</h3>
              <p className="text-label text-mut">{paquete.summary}</p>
            </div>
          </div>
          <p className="text-display">
            <Precio valor={paquete.pricePerPerson} decimales={0} sufijo="/ persona" />
          </p>
          <ul className="flex flex-1 flex-col gap-3 border-t border-line pt-6">
            {paquete.features.map((caracteristica) => (
              <li key={caracteristica} className="flex items-start gap-3 text-label text-txt">
                <Icono nombre="check" className="mt-0.5 size-4 text-arc" />
                {caracteristica}
              </li>
            ))}
          </ul>
          <Boton variante={destacado ? "primaria" : "secundaria"} ancho="completo" onClick={(evento) => onSolicitar(paquete.name, evento.currentTarget)}>
            Elegir {paquete.name}
          </Boton>
        </Tarjeta>
      </motion.div>
    </div>
  );
}
