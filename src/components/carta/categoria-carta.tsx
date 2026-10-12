import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { EtiquetaPlatillo, Icono, Precio } from "@/components/shared";
import { CLASE_IMPRESION, CURVA, DURACION_ENTRADA, SUBIDA_CASCADA } from "@/components/shared/movimiento/constantes";
import { useAparicion } from "@/components/shared/movimiento/use-aparicion";
import type { CategoriaVisible, PlatilloVisible } from "@/domain/carta";
import { cn } from "@/lib/utils";
import { TRANSICION_FILTRO, TRANSICION_RECOLOCAR } from "./movimiento-carta";

export interface CategoriaCartaProps {
  categoria: CategoriaVisible;
  /** Cambia solo cuando cambia lo que se ve: Motion mide posiciones entonces, no en cada render. */
  claveLayout: string;
}

/**
 * Una categoría de la carta: icono sobre plato, título, nota, línea roja y sus platillos.
 * Se revela entera al entrar en pantalla (un observador por categoría, no por platillo).
 * Al filtrar: la que sale se funde, las que quedan se recolocan con `transform`.
 * La subida va en el `div` de dentro para que el ancla (`id`) no se mueva.
 */
export function CategoriaCarta({ categoria, claveLayout }: CategoriaCartaProps) {
  const reducir = useReducedMotion();
  const { ref, visible } = useAparicion<HTMLElement>(true);
  const idTitulo = `${categoria.id}-titulo`;

  return (
    <motion.section
      ref={ref}
      id={categoria.id}
      aria-labelledby={idTitulo}
      layout="position"
      layoutDependency={claveLayout}
      initial="oculto"
      animate={visible ? "visible" : "oculto"}
      exit="fuera"
      variants={{
        oculto: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: DURACION_ENTRADA, ease: CURVA } },
        fuera: { opacity: 0, transition: TRANSICION_FILTRO },
      }}
      transition={{ layout: TRANSICION_RECOLOCAR }}
      className={cn("min-w-0 scroll-mt-32", CLASE_IMPRESION)}
    >
      <motion.div
        variants={{
          oculto: { y: reducir ? 0 : SUBIDA_CASCADA },
          visible: { y: 0, transition: { duration: DURACION_ENTRADA, ease: CURVA } },
          fuera: { y: 0 },
        }}
        className={CLASE_IMPRESION}
      >
        <header className="flex items-center gap-3 border-b-2 border-chile pb-3">
          <span className="plate grid size-11 shrink-0 place-items-center rounded-full">
            <Icono nombre={categoria.icon} />
          </span>
          <div className="min-w-0">
            <h3 id={idTitulo} className="text-title font-semibold text-txt">
              {categoria.title}
            </h3>
            <p className="text-meta text-mut">{categoria.note}</p>
          </div>
        </header>
        <ul className="relative divide-y divide-line">
          <AnimatePresence initial={false} mode="popLayout">
            {categoria.dishes.map((platillo) => (
              <FilaPlatillo key={platillo.name} platillo={platillo} claveLayout={claveLayout} />
            ))}
          </AnimatePresence>
        </ul>
      </motion.div>
    </motion.section>
  );
}

export interface FilaPlatilloProps {
  platillo: PlatilloVisible;
  claveLayout: string;
}

/** Nombre, línea de puntos y precio; debajo la descripción y las etiquetas. */
export function FilaPlatillo({ platillo, claveLayout }: FilaPlatilloProps) {
  return (
    <motion.li
      layout="position"
      layoutDependency={claveLayout}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ ...TRANSICION_FILTRO, layout: TRANSICION_RECOLOCAR }}
      className={cn("flex flex-col gap-1.5 py-4", CLASE_IMPRESION)}
    >
      <div className="flex items-baseline gap-3">
        <h4 className="min-w-0 text-body font-semibold text-txt">{platillo.name}</h4>
        <span aria-hidden="true" className="min-w-4 flex-1 border-b border-dotted border-field" />
        <Precio valor={platillo.price} className="shrink-0 text-txt" />
      </div>
      <p className="text-meta text-mut">{platillo.description}</p>
      {platillo.etiquetas.length > 0 ? (
        <ul aria-label="Etiquetas" className="flex flex-wrap gap-2 pt-0.5">
          {platillo.etiquetas.map((tag) => (
            <li key={tag}>
              <EtiquetaPlatillo tag={tag} />
            </li>
          ))}
        </ul>
      ) : null}
    </motion.li>
  );
}
