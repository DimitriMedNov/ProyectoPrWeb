import type { ComponentProps, ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Boton } from "./boton";
import { Icono, type NombreIcono } from "./icono";

/** Bloque gris del tamaño del contenido que está por llegar. El tamaño va en `className`. */
export function Esqueleto({ className, ...props }: ComponentProps<"div">) {
  return <Skeleton aria-hidden="true" className={cn("rounded-control bg-panel-2", className)} {...props} />;
}

export interface EstadoCargandoProps {
  /** Lo que oye el lector de pantalla. */
  etiqueta?: string;
  className?: string;
  /** Los `Esqueleto` con la forma del contenido real. */
  children: ReactNode;
}

/** Envoltorio del estado "cargando": anuncia la carga y agrupa los esqueletos. */
export function EstadoCargando({ etiqueta = "Cargando…", className, children }: EstadoCargandoProps) {
  return (
    <div role="status" aria-busy="true" className={className}>
      <span className="sr-only">{etiqueta}</span>
      {children}
    </div>
  );
}

interface MensajeProps {
  icono: NombreIcono;
  titulo: string;
  texto?: ReactNode;
  className?: string;
  children: ReactNode;
}

function Mensaje({ icono, titulo, texto, className, children }: MensajeProps) {
  return (
    <div className={cn("mx-auto flex w-full max-w-copy flex-col items-center gap-3 px-gutter py-section-sm text-center", className)}>
      <span className="plate grid size-14 place-items-center rounded-full">
        <Icono nombre={icono} className="size-6" />
      </span>
      <p className="text-title font-semibold text-txt">{titulo}</p>
      {texto ? <p className="text-body text-mut">{texto}</p> : null}
      <div className="mt-2 flex flex-wrap items-center justify-center gap-3">{children}</div>
    </div>
  );
}

export interface EstadoVacioProps {
  titulo: string;
  texto?: ReactNode;
  icono?: NombreIcono;
  /** Cómo salir del vacío: un `Boton` o un `BotonEnlace`. Obligatoria. */
  accion: ReactNode;
  className?: string;
}

/** Estado "vacío": qué pasa + una acción para salir. */
export function EstadoVacio({ titulo, texto, icono = "taco", accion, className }: EstadoVacioProps) {
  return (
    <Mensaje icono={icono} titulo={titulo} texto={texto} className={className}>
      {accion}
    </Mensaje>
  );
}

export interface EstadoErrorProps {
  titulo?: string;
  /** Qué pasó, en palabras de la persona. */
  texto: ReactNode;
  onReintentar: () => void;
  etiquetaReintentar?: string;
  /** Otra salida además de reintentar (enlace a inicio…). */
  children?: ReactNode;
  className?: string;
}

/** Estado "error": qué pasó + botón de reintentar. Se anuncia al aparecer. */
export function EstadoError({ titulo = "Algo salió mal", texto, onReintentar, etiquetaReintentar = "Reintentar", children, className }: EstadoErrorProps) {
  return (
    <div role="alert">
      <Mensaje icono="close" titulo={titulo} texto={texto} className={className}>
        <Boton onClick={onReintentar}>{etiquetaReintentar}</Boton>
        {children}
      </Mensaje>
    </div>
  );
}
