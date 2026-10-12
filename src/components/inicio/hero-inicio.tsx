import { BotonEnlace, Contenedor } from "@/components/shared";
import { Escalonado, EscalonadoItem } from "@/components/shared/movimiento";
import type { HeroInicio as DatosHero } from "@/domain/inicio";
import { ChipsHero } from "./chips-hero";
import { MascotaHero } from "./mascota-hero";

export interface HeroInicioProps {
  hero: DatosHero;
}

/**
 * Portada: texto a la izquierda y mascota sobre el plato a la derecha (una columna en
 * móvil, texto primero) y, abajo, la franja de datos. Con la cabecera ocupa justo el
 * primer pantallazo. Cada bloque marcado con `data-hero` es un paso de la entrada
 * escalonada (Motion, al montar, 0,06 s entre pasos): antetítulo 0, título 1,
 * subtítulo 2, párrafo e imagen 3, acciones 4, chips 5.
 */
export function HeroInicio({ hero }: HeroInicioProps) {
  const idTitulo = `${hero.ancla}-titulo`;
  return (
    <Escalonado
      as="section"
      alVer={false}
      id={hero.ancla}
      aria-labelledby={idTitulo}
      className="relative isolate flex min-h-[calc(100svh-var(--spacing-header))] flex-col overflow-x-clip"
    >
      <Contenedor className="grid flex-1 items-center gap-10 py-section-sm lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
        <div className="flex min-w-0 flex-col items-start">
          <EscalonadoItem as="p" orden={0} data-hero="antetitulo" className="text-body font-semibold text-mut">
            {hero.antetitulo}
          </EscalonadoItem>
          <EscalonadoItem as="h1" orden={1} id={idTitulo} data-hero="titulo" className="gradient-name mt-2 pb-2 text-hero font-bold text-balance">
            {hero.titulo}
          </EscalonadoItem>
          <EscalonadoItem as="p" orden={2} data-hero="subtitulo" className="mt-4 text-title font-medium text-txt text-balance">
            {hero.subtitulo}
          </EscalonadoItem>
          <EscalonadoItem as="p" orden={3} data-hero="parrafo" className="mt-3 max-w-copy text-body text-mut text-pretty">
            {hero.parrafo}
          </EscalonadoItem>
          <EscalonadoItem orden={4} data-hero="acciones" className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2">
            <BotonEnlace to={hero.accionPrincipal.destino}>{hero.accionPrincipal.texto}</BotonEnlace>
            <BotonEnlace to={hero.accionSecundaria.destino} variante="enlace">
              {hero.accionSecundaria.texto}
            </BotonEnlace>
          </EscalonadoItem>
        </div>

        <MascotaHero imagen={hero.imagen} orden={3} />
      </Contenedor>

      <ChipsHero chips={hero.chips} orden={5} />
    </Escalonado>
  );
}
