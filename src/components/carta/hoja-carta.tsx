import { AnimatePresence, motion } from "motion/react";
import { Boton, EstadoVacio, Icono, Imagen, Seccion } from "@/components/shared";
import type { CategoriaVisible } from "@/domain/carta";
import { CategoriaCarta } from "./categoria-carta";
import { Revelar } from "@/components/shared/movimiento";
import { TRANSICION_FILTRO } from "./movimiento-carta";

export interface HojaCartaProps {
  categorias: readonly CategoriaVisible[];
  /** Ningún platillo cumple el filtro. */
  vacio: boolean;
  mensajeVacio: string;
  /** Vuelve a "Todo": la salida del estado vacío. */
  onQuitarFiltro: () => void;
}

/** "La carta": hoja con marco doble, como un menú impreso, con las categorías a dos columnas. */
export function HojaCarta({ categorias, vacio, mensajeVacio, onQuitarFiltro }: HojaCartaProps) {
  const claveLayout = categorias.map((categoria) => `${categoria.id}:${categoria.dishes.length}`).join("|");
  return (
    <Seccion fondo="deep" aria-labelledby="la-carta-titulo">
      <div className="mx-auto max-w-5xl rounded-card border border-line bg-panel p-1.5 shadow-raised sm:p-2">
        <div className="rounded-control border border-line px-4 py-8 sm:px-8 md:px-12 md:py-12">
          <Revelar as="header" className="flex flex-col items-center gap-2 text-center">
            <Imagen src="/img/logo-120.webp" alt="" width={56} height={56} className="size-14 rounded-full" />
            <h2 id="la-carta-titulo" className="text-headline font-semibold text-txt md:text-display">
              La carta
            </h2>
            <p className="text-body text-mut">Precios por pieza u orden. Salsas de la casa incluidas.</p>
            <ul aria-label="Significado de los iconos" className="flex flex-wrap justify-center gap-x-5 gap-y-1 text-meta text-mut">
              <li className="flex items-center gap-1.5">
                <Icono nombre="leaf" className="size-4 text-acc-cilantro" />
                Vegetariano o vegano
              </li>
              <li className="flex items-center gap-1.5">
                <Icono nombre="chile" className="size-4 text-arc" />
                Picante
              </li>
            </ul>
          </Revelar>
          {vacio ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={TRANSICION_FILTRO}>
              <EstadoVacio titulo={mensajeVacio} icono="utensils" accion={<Boton onClick={onQuitarFiltro}>Quitar filtro</Boton>} />
            </motion.div>
          ) : (
            <div className="relative mt-10 grid gap-x-12 gap-y-12 md:grid-cols-2">
              <AnimatePresence initial={false} mode="popLayout">
                {categorias.map((categoria) => (
                  <CategoriaCarta key={categoria.id} categoria={categoria} claveLayout={claveLayout} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </Seccion>
  );
}
