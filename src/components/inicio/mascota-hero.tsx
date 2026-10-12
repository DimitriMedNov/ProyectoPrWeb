import { motion } from "motion/react";
import { Imagen } from "@/components/shared";
import { EscalonadoItem, useInclinacion } from "@/components/shared/movimiento";
import type { ImagenInicio } from "@/domain/inicio";

export interface MascotaHeroProps {
  imagen: ImagenInicio;
  /** Turno en la entrada escalonada de la portada. */
  orden: number;
}

/**
 * Ancho al que se pinta la mascota: 34rem en dos columnas, 24rem como tope en una y,
 * por debajo, la ventana menos los márgenes. `ROUTE_IMAGES` (`build/html.ts`) lo repite.
 */
const SIZES_MASCOTA = "(min-width: 1024px) 34rem, (min-width: 420px) 24rem, 92vw";

/**
 * Mascota sobre el plato amarillo. El hueco es cuadrado y está reservado.
 * - Entra en su turno de la cascada (Motion).
 * - Flota solo la imagen (CSS `animate-float`: 14 px, 2 veces; no con movimiento reducido).
 * - Con ratón, plato y mascota se hunden e inclinan hacia el cursor (Bencho,
 *   "Tilt card"); el aro punteado se queda quieto y da la referencia. Es decorativo:
 *   no cambia ninguna acción, no hace nada al tacto ni con movimiento reducido.
 */
export function MascotaHero({ imagen, orden }: MascotaHeroProps) {
  const { zona, giro } = useInclinacion();
  return (
    <EscalonadoItem orden={orden} data-hero="imagen" className="relative mx-auto aspect-square w-full max-w-sm lg:max-w-xl" {...zona}>
      <div aria-hidden="true" className="absolute inset-0 rounded-full border border-dashed border-line" />
      <motion.div style={giro} className="relative size-full">
        <div aria-hidden="true" className="plate absolute inset-5 rounded-full shadow-raised sm:inset-8" />
        <Imagen
          src={imagen.src}
          srcSet={imagen.srcSet}
          sizes={imagen.srcSet ? SIZES_MASCOTA : undefined}
          alt={imagen.alt}
          width={imagen.width}
          height={imagen.height}
          prioridad={imagen.carga === "eager"}
          className="relative size-full animate-float object-contain"
        />
      </motion.div>
    </EscalonadoItem>
  );
}
