import type { Icon } from "@/domain/menu";
import { cn } from "@/lib/utils";

/** Símbolos de `public/icons.svg`: los de platillos (`Icon` del dominio) y los de interfaz. */
export type NombreIcono =
  | Icon
  | "menu"
  | "close"
  | "check"
  | "minus"
  | "plus"
  | "pause"
  | "play"
  | "user"
  | "calendar"
  | "card"
  | "chile"
  | "chevron-left"
  | "chevron-right";

export interface IconoProps {
  nombre: NombreIcono;
  /** Tamaño y color con clases (`size-4 text-arc`). Por defecto 20 px y el color del texto. */
  className?: string;
  /** Solo si el icono va SIN texto al lado y no está dentro de un botón ya etiquetado. */
  etiqueta?: string;
}

/** Icono del sprite del proyecto. Decorativo salvo que reciba `etiqueta`. */
export function Icono({ nombre, className, etiqueta }: IconoProps) {
  return (
    <svg
      className={cn("inline-block size-5 shrink-0", className)}
      role={etiqueta ? "img" : undefined}
      aria-label={etiqueta}
      aria-hidden={etiqueta ? undefined : true}
      focusable="false"
    >
      <use href={`/icons.svg#${nombre}`} />
    </svg>
  );
}
