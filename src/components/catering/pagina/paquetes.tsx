import { CabeceraSeccion, Seccion } from "@/components/shared";
import { Escalonado, EscalonadoItem, Revelar } from "@/components/shared/movimiento";
import type { CateringPackage } from "@/domain/menu";
import { Condiciones } from "./condiciones";
import { PAQUETES_CABECERA } from "./contenido";
import { TarjetaPaquete } from "./tarjeta-paquete";
import type { AlSolicitar } from "./use-modal-solicitud";

export interface PaquetesProps {
  paquetes: readonly CateringPackage[];
  onSolicitar: AlSolicitar;
}

/** Sección `#paquetes`: tarjetas de paquete (1 columna; 3 desde escritorio) y condiciones. */
export function Paquetes({ paquetes, onSolicitar }: PaquetesProps) {
  return (
    <Seccion id="paquetes" fondo="deep" aria-labelledby="paquetes-titulo" claseContenedor="flex flex-col gap-10">
      <CabeceraSeccion idTitulo="paquetes-titulo" acento="jamaica" antetitulo={PAQUETES_CABECERA.antetitulo} titulo={PAQUETES_CABECERA.titulo} texto={PAQUETES_CABECERA.texto} />
      <Escalonado as="ul" paso={0.08} className="grid gap-6 lg:grid-cols-3">
        {paquetes.map((paquete) => (
          <EscalonadoItem as="li" key={paquete.name} className="flex">
            <TarjetaPaquete paquete={paquete} onSolicitar={onSolicitar} />
          </EscalonadoItem>
        ))}
      </Escalonado>
      {/* Después de las tres tarjetas (0 / 0,08 / 0,16 s). */}
      <Revelar retardo={0.24}>
        <Condiciones />
      </Revelar>
    </Seccion>
  );
}
