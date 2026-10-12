import type { ReactNode } from "react";
import { MotionConfig } from "motion/react";
import { Cabecera } from "./cabecera";
import { Pie } from "./pie";

export interface ArmazonProps {
  /** La página de la ruta (trae su propio `<main id="main">`). */
  children: ReactNode;
}

/**
 * Armazón común a todas las rutas: enlace de salto, cabecera, página y pie.
 * `MotionConfig reducedMotion="user"`: con movimiento reducido, todo lo que anima
 * Motion (aquí y en las páginas) deja de desplazarse y escalar; solo funde.
 */
export function Armazon({ children }: ArmazonProps) {
  return (
    <MotionConfig reducedMotion="user">
      <div className="flex min-h-svh flex-col">
        <a
          href="#main"
          className="fixed top-3 left-3 z-50 -translate-y-24 rounded-full bg-fill px-5 py-3 font-medium text-on-fill no-underline shadow-raised transition-transform focus-visible:translate-y-0"
        >
          Saltar al contenido
        </a>
        <Cabecera />
        <div className="flex-1">{children}</div>
        <Pie />
      </div>
    </MotionConfig>
  );
}
