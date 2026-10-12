import { AnimatePresence, motion } from "motion/react";
import { CabeceraSeccion, Imagen, Pildora, Precio, Seccion, Tarjeta } from "@/components/shared";
import { Revelar } from "@/components/shared/movimiento";
import { ID_ESPECIALIDADES } from "@/domain/carta";
import type { Special } from "@/domain/menu";
import { PASO_TARJETAS, TRANSICION_FILTRO } from "./movimiento-carta";

export interface EspecialidadesProps {
  especialidades: readonly Special[];
  /** Hay un filtro puesto y estas tarjetas se muestran sin cumplirlo. */
  fueraDelFiltro: boolean;
}

/** Las especialidades de la casa. Se ven siempre, con cualquier filtro. */
export function Especialidades({ especialidades, fueraDelFiltro }: EspecialidadesProps) {
  return (
    <Seccion id={ID_ESPECIALIDADES} aria-labelledby="especialidades-titulo" className="scroll-mt-28">
      <Revelar>
        <CabeceraSeccion antetitulo="Especialidades de la casa" titulo="Los platillos de la casa" idTitulo="especialidades-titulo">
          {/* Solo se funde: aparece al poner un filtro y se va al quitarlo. */}
          <AnimatePresence initial={false}>
            {fueraDelFiltro ? (
              <motion.p
                key="aviso"
                role="note"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={TRANSICION_FILTRO}
                className="rounded-control bg-panel-2 px-4 py-2 text-meta text-mut"
              >
                Las especialidades no llevan etiquetas; el filtro no las oculta.
              </motion.p>
            ) : null}
          </AnimatePresence>
        </CabeceraSeccion>
      </Revelar>
      <ul className="mt-10 grid gap-6 lg:grid-cols-3">
        {especialidades.map((especialidad, posicion) => (
          <Revelar as="li" key={especialidad.name} retardo={posicion * PASO_TARJETAS} className="min-w-0">
            <TarjetaEspecialidad especialidad={especialidad} />
          </Revelar>
        ))}
      </ul>
    </Seccion>
  );
}

export interface TarjetaEspecialidadProps {
  especialidad: Special;
}

/** Imagen sobre plato, nombre y precio en la misma línea, descripción e ingredientes. */
export function TarjetaEspecialidad({ especialidad }: TarjetaEspecialidadProps) {
  const { name, description, price, image, highlights } = especialidad;
  return (
    <Tarjeta elevar className="flex h-full flex-col gap-5 sm:flex-row sm:items-center lg:flex-col lg:items-stretch">
      <span className="plate mx-auto grid size-36 shrink-0 place-items-center rounded-full sm:mx-0 lg:mx-auto">
        <Imagen src={image.src} alt={image.alt} width={image.width} height={image.height} className="max-h-28 w-auto object-contain" />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h3 className="text-title font-semibold text-txt">{name}</h3>
          <span className="text-title">
            <Precio valor={price} />
          </span>
        </div>
        <p className="text-meta text-mut">{description}</p>
        <ul aria-label="Lleva" className="mt-auto flex flex-wrap gap-2">
          {highlights.map((ingrediente) => (
            <li key={ingrediente}>
              <Pildora>{ingrediente}</Pildora>
            </li>
          ))}
        </ul>
      </div>
    </Tarjeta>
  );
}
