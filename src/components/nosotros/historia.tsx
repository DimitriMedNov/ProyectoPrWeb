import type { Historia as DatosHistoria } from "@/domain/nosotros";
import { BotonEnlace, CabeceraSeccion, ImagenDiferida, Seccion } from "@/components/shared";
import { Escalonado, EscalonadoItem } from "@/components/shared/movimiento";

export interface HistoriaProps {
  historia: DatosHistoria;
}

/**
 * Historia de la taquería: texto a la izquierda y la mascota sobre el plato amarillo a la derecha.
 * Entra en cascada al montarse: antetítulo (0), H1 (1), párrafos e imagen (2) y botón (3).
 * Después flota solo la mascota (sube 14 px, 2 veces); con movimiento reducido no flota.
 * La mascota no lleva prioridad: en móvil queda debajo del primer pantallazo y competiría con
 * el JavaScript que pinta el título. En pantallas anchas ya la adelanta el HTML (`ROUTE_IMAGES`).
 */
export function Historia({ historia }: HistoriaProps) {
  const { mascota } = historia;
  return (
    <Seccion aria-labelledby="historia-titulo">
      <Escalonado
        alVer={false}
        className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-16 xl:grid-cols-[minmax(0,1fr)_22rem]"
      >
        <div className="flex min-w-0 flex-col items-start gap-6">
          {/* El turno 0 trae la cabecera (antetítulo); el texto del H1 espera dentro su turno 1. */}
          <EscalonadoItem orden={0}>
            <CabeceraSeccion
              nivel={1}
              idTitulo="historia-titulo"
              alineacion="inicio"
              acento="cilantro"
              antetitulo={historia.antetitulo}
              titulo={
                <EscalonadoItem as="span" orden={1} className="block text-balance text-headline md:text-display">
                  <span className="sm:block">{historia.tituloLinea1}</span>{" "}
                  <span className="sm:block">
                    {historia.tituloLinea2Prefijo}
                    <span className="gradient-name">{historia.tituloNombre}</span>
                  </span>
                </EscalonadoItem>
              }
            />
          </EscalonadoItem>
          <EscalonadoItem orden={2} className="flex max-w-copy flex-col gap-4 text-body text-mut">
            {historia.parrafos.map((parrafo) => (
              <p key={parrafo}>{parrafo}</p>
            ))}
          </EscalonadoItem>
          <EscalonadoItem orden={3}>
            <BotonEnlace to={historia.accion.to}>{historia.accion.label}</BotonEnlace>
          </EscalonadoItem>
        </div>

        <EscalonadoItem orden={2} className="relative mx-auto aspect-square w-full max-w-xs sm:max-w-sm lg:max-w-md">
          <div aria-hidden="true" className="plate absolute inset-4 rounded-full shadow-card" />
          <ImagenDiferida
            src={mascota.src}
            alt={mascota.alt}
            width={mascota.width}
            height={mascota.height}
            className="relative size-full object-contain motion-safe:animate-float"
          />
        </EscalonadoItem>
      </Escalonado>
    </Seccion>
  );
}
