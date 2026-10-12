import { motion } from "motion/react";
import { Imagen } from "@/components/shared";
import { EscalonadoItem, useInclinacion } from "@/components/shared/movimiento";
import type { ImagenNoEncontrada } from "@/domain/no-encontrada";
import { cn } from "@/lib/utils";

export interface IlustracionNoEncontradaProps {
  imagen: ImagenNoEncontrada;
  className?: string;
}

/**
 * Imagen decorativa sobre el plato amarillo. El hueco es cuadrado y está reservado.
 * - Entra en el turno 2 de la cascada (con el subtítulo).
 * - Después flota solo la imagen (sube 14 px, 2 veces: `animate-float`); el plato
 *   se queda quieto. Con movimiento reducido no flota.
 * - Con ratón, plato e imagen se hunden e inclinan hacia el cursor (Bencho,
 *   "Tilt card"). Es decorativo: no cambia ninguna acción ni necesita teclado.
 */
export function IlustracionNoEncontrada({ imagen, className }: IlustracionNoEncontradaProps) {
  const { zona, giro } = useInclinacion();
  return (
    <EscalonadoItem orden={2} data-ilustracion className={cn("relative mx-auto aspect-square w-full max-w-xs md:max-w-md", className)} {...zona}>
      <motion.div style={giro} className="relative size-full">
        <div aria-hidden="true" className="plate absolute inset-6 rounded-full md:inset-8" />
        <Imagen
          src={imagen.src}
          alt={imagen.alt}
          width={imagen.width}
          height={imagen.height}
          prioridad
          className="relative size-full object-contain motion-safe:animate-float"
        />
      </motion.div>
    </EscalonadoItem>
  );
}
