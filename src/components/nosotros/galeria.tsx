import type { Galeria as DatosGaleria } from "@/domain/nosotros";
import { etiquetaDiapositiva } from "@/domain/nosotros-galeria";
import { useGaleria } from "@/hooks/nosotros/use-galeria";
import { CabeceraSeccion, ImagenDiferida, Seccion } from "@/components/shared";
import { Revelar } from "@/components/shared/movimiento";
import { ControlesGaleria } from "./controles-galeria";

const ID_TITULO = "galeria-titulo";
/** Segundos que espera la región tras la cabecera al revelarse. */
const RETARDO_REGION = 0.1;

export interface GaleriaProps {
  galeria: DatosGaleria;
}

/**
 * Galería deslizable: una foto por vista, con encaje foto a foto, botones y contador.
 * Cabecera y región se revelan al entrar en pantalla. El desplazamiento del carril
 * es del CSS (`scroll-smooth` + `motion-reduce:scroll-auto`): aquí no se anima.
 * Cada foto se pide al acercarse: la primera con la sección, las demás al ir pasando.
 */
export function Galeria({ galeria }: GaleriaProps) {
  const { fotos } = galeria;
  const { carrilRef, indice, contador, esPrimera, esUltima, anterior, siguiente } = useGaleria(fotos.length);

  return (
    <Seccion fondo="deep" claseContenedor="flex flex-col items-center gap-8 md:gap-10">
      <Revelar>
        <CabeceraSeccion antetitulo={galeria.antetitulo} titulo={galeria.titulo} acento="maiz" idTitulo={ID_TITULO} />
      </Revelar>

      <Revelar
        retardo={RETARDO_REGION}
        role="region"
        aria-roledescription={galeria.rolRegion}
        aria-labelledby={ID_TITULO}
        className="flex w-full max-w-5xl flex-col items-center gap-5"
      >
        <div
          ref={carrilRef}
          tabIndex={0}
          role="group"
          aria-label={galeria.etiquetaCarril}
          className="scrollbar-none flex w-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-smooth rounded-card bg-panel shadow-raised motion-reduce:scroll-auto"
        >
          {fotos.map((foto, posicion) => (
            <figure
              key={foto.id}
              aria-roledescription={galeria.rolDiapositiva}
              aria-label={etiquetaDiapositiva(posicion + 1, fotos.length)}
              className="m-0 shrink-0 basis-full snap-start"
            >
              <ImagenDiferida
                src={foto.src}
                srcSet={foto.srcSet}
                sizes={foto.sizes}
                width={foto.width}
                height={foto.height}
                alt={foto.alt}
                className="aspect-video w-full object-cover"
              />
            </figure>
          ))}
        </div>

        <ControlesGaleria
          contador={contador}
          indice={indice}
          esPrimera={esPrimera}
          esUltima={esUltima}
          etiquetaAnterior={galeria.etiquetaAnterior}
          etiquetaSiguiente={galeria.etiquetaSiguiente}
          onAnterior={anterior}
          onSiguiente={siguiente}
        />
      </Revelar>
    </Seccion>
  );
}
