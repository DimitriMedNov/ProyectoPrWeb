import { Imagen } from "./imagen";
import type { ImagenProps } from "./imagen";
import { useCercaDeVentana } from "./use-cerca-de-ventana";

export interface ImagenDiferidaProps extends ImagenProps {
  /** `true` = no espera: se comporta como `Imagen` con `prioridad` (primer pantallazo). */
  prioridad?: boolean;
}

/** Imagen transparente con la misma proporción que la real: guarda el hueco sin pedir nada a la red. */
const hueco = (ancho: number, alto: number) =>
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${ancho}' height='${alto}'/%3E`;

/**
 * `Imagen` que no pide su archivo hasta que se acerca a la ventana. El `<img>` está en la
 * página desde el principio, con su `alt`, su tamaño y sus clases: el hueco no cambia y el
 * lector de pantalla la encuentra igual; solo `src`, `srcset` y `sizes` llegan después.
 * Para lo que queda debajo del primer pantallazo.
 */
export function ImagenDiferida({ src, srcSet, sizes, width, height, prioridad = false, ...props }: ImagenDiferidaProps) {
  const { ref, cerca } = useCercaDeVentana<HTMLImageElement>();
  const cargar = prioridad || cerca;
  return (
    <Imagen
      ref={ref}
      src={cargar ? src : hueco(width, height)}
      srcSet={cargar ? srcSet : undefined}
      sizes={cargar ? sizes : undefined}
      width={width}
      height={height}
      prioridad={prioridad}
      {...props}
    />
  );
}
