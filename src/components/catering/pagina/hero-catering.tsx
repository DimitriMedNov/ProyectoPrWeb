import { Boton, BotonEnlace, CabeceraSeccion, Imagen, Seccion } from "@/components/shared";
import { Revelar } from "@/components/shared/movimiento";
import { HERO_CATERING } from "./contenido";
import type { AlSolicitar } from "./use-modal-solicitud";

export interface HeroCateringProps {
  onSolicitar: AlSolicitar;
}

/** Hero: texto y acciones a la izquierda, foto 4:3 a la derecha (debajo en móvil). Entran el texto y, un poco después, la foto. */
export function HeroCatering({ onSolicitar }: HeroCateringProps) {
  const { foto } = HERO_CATERING;
  return (
    <Seccion aria-labelledby="catering-titulo" claseContenedor="grid items-center gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-16">
      <Revelar className="min-w-0">
        <CabeceraSeccion
          nivel={1}
          idTitulo="catering-titulo"
          alineacion="inicio"
          antetitulo={HERO_CATERING.antetitulo}
          titulo={
            <>
              {HERO_CATERING.tituloInicio}
              <span className="text-arc">{HERO_CATERING.tituloAcento}</span>
            </>
          }
          texto={HERO_CATERING.texto}
          className="gap-4"
        >
          <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-2">
            <Boton onClick={(evento) => onSolicitar(undefined, evento.currentTarget)}>{HERO_CATERING.botonSolicitar}</Boton>
            <BotonEnlace to="#paquetes" variante="enlace">
              {HERO_CATERING.enlacePaquetes}
            </BotonEnlace>
          </div>
        </CabeceraSeccion>
      </Revelar>
      <Revelar retardo={0.12} className="min-w-0">
        <Imagen
          src={foto.src}
          srcSet={foto.srcSet}
          sizes="(min-width: 1280px) 33rem, (min-width: 1024px) 41vw, 92vw"
          alt={foto.alt}
          width={foto.width}
          height={foto.height}
          prioridad
          className="aspect-4/3 w-full rounded-card object-cover shadow-raised"
        />
      </Revelar>
    </Seccion>
  );
}
