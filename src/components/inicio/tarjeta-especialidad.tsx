import { useId } from "react";
import { BotonEnlace, ImagenDiferida, Tarjeta } from "@/components/shared";
import type { EspecialidadPortada } from "@/domain/inicio";
import { cn } from "@/lib/utils";

export interface TarjetaEspecialidadProps {
  especialidad: EspecialidadPortada;
  className?: string;
}

/**
 * Tarjeta de especialidad: foto sobre el plato, nombre, descripción, precio y botón.
 * Sube 4 px con el cursor encima o el foco dentro (`Tarjeta elevar`, solo `transform`).
 */
export function TarjetaEspecialidad({ especialidad, className }: TarjetaEspecialidadProps) {
  const idNombre = useId();
  const { imagen } = especialidad;
  return (
    <Tarjeta relleno="amplio" elevar className={cn("h-full items-center text-center", className)}>
      <div className="plate flex size-36 shrink-0 items-center justify-center rounded-full shadow-card">
        <ImagenDiferida
          src={imagen.src}
          alt={imagen.alt}
          width={imagen.width}
          height={imagen.height}
          prioridad={imagen.carga === "eager"}
          className={cn("object-contain", especialidad.apaisada ? "w-28" : "w-24")}
        />
      </div>
      <h3 id={idNombre} className="mt-6 text-title font-semibold text-txt">
        {especialidad.nombre}
      </h3>
      <p className="mt-2 text-label text-mut text-pretty">{especialidad.descripcion}</p>
      <p className="mt-auto pt-5 text-headline font-semibold text-arc">{especialidad.precio}</p>
      <BotonEnlace to={especialidad.accion.destino} variante="secundaria" aria-describedby={idNombre} className="mt-4">
        {especialidad.accion.texto}
      </BotonEnlace>
    </Tarjeta>
  );
}
