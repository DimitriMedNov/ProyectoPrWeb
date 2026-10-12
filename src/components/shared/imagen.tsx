import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export interface ImagenProps extends Omit<ComponentProps<"img">, "loading" | "width" | "height" | "alt"> {
  src: string;
  /** Texto alternativo. Cadena vacía si la imagen es decorativa. */
  alt: string;
  /** Tamaño real del archivo: reserva el hueco y evita saltos de layout. */
  width: number;
  height: number;
  /** `true` solo en la imagen del primer pantallazo: se carga ya y con prioridad. */
  prioridad?: boolean;
}

/** `<img>` con tamaño reservado. Fuera del primer pantallazo se carga al acercarse. */
export function Imagen({ prioridad = false, className, alt, ...props }: ImagenProps) {
  return (
    <img
      alt={alt}
      loading={prioridad ? "eager" : "lazy"}
      fetchPriority={prioridad ? "high" : undefined}
      decoding="async"
      className={cn("h-auto max-w-full", className)}
      {...props}
    />
  );
}
