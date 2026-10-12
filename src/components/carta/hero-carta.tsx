import { BotonEnlace, Seccion } from "@/components/shared";
import { Escalonado, EscalonadoItem } from "@/components/shared/movimiento";

/**
 * Cabecera de la carta: título de la página y las dos salidas (evento, delivery).
 * Entra en cascada al montarse: antetítulo, H1, subtítulo y botones (0–3).
 * El color va en un hijo y el tamaño en el padre: `cn` borra uno si van juntos.
 */
export function HeroCarta() {
  return (
    <Seccion aire="compacto" aria-labelledby="carta-titulo">
      <Escalonado as="header" alVer={false} className="flex flex-col items-center gap-2 text-center">
        <EscalonadoItem as="p" orden={0} className="text-body font-semibold">
          <span className="text-arc">Menú</span>
        </EscalonadoItem>
        <EscalonadoItem as="h1" orden={1} id="carta-titulo" className="text-hero font-semibold">
          <span className="gradient-name">Lo que sale de nuestra cocina</span>
        </EscalonadoItem>
        <EscalonadoItem as="p" orden={2} className="max-w-copy text-body">
          <span className="text-mut">
            Tacos de trompo y de parrilla, antojitos yucatecos, aguas frescas del día y opciones vegetarianas y veganas.
          </span>
        </EscalonadoItem>
        <EscalonadoItem orden={3} className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <BotonEnlace to="/catering">Pedir para un evento</BotonEnlace>
          <BotonEnlace to="/#delivery" variante="enlace">
            Pedir por apps de delivery
          </BotonEnlace>
        </EscalonadoItem>
      </Escalonado>
    </Seccion>
  );
}
