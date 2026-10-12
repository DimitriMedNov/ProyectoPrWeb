import { Link } from "react-router-dom";
import { Icono } from "@/components/shared/icono";
import { Contenedor } from "@/components/shared/seccion";
import { ADDRESS, CREDITS, HOURS, PAGES, SITE_NAME } from "@/domain/sitio";
import { useAnioActual } from "@/hooks/use-anio-actual";
import { usePaginaActual } from "@/hooks/use-pagina-actual";
import { AvisoFicticio } from "./aviso-ficticio";

/**
 * Pie: enlaces a las demás páginas (todas menos la actual; en una ruta
 * desconocida, las cuatro), dirección, horario, aviso de proyecto ficticio y
 * créditos con el año en curso.
 */
export function Pie() {
  const anio = useAnioActual();
  const actual = usePaginaActual();
  const enlaces = PAGES.filter((pagina) => pagina.path !== actual?.path);

  return (
    <footer className="surface-ink">
      <Contenedor className="flex flex-col gap-10 py-section-sm">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="flex flex-col gap-4">
            <p className="font-display text-title font-semibold">{SITE_NAME}</p>
            <address className="flex flex-col gap-2 text-label text-ink-txt not-italic">
              <span className="flex items-start gap-2">
                <Icono nombre="pin" className="mt-0.5 size-4 text-ink-mut" />
                {ADDRESS}
              </span>
              <span className="flex items-start gap-2">
                <Icono nombre="utensils" className="mt-0.5 size-4 text-ink-mut" />
                {HOURS}
              </span>
            </address>
          </div>
          <nav aria-label="Pie de página">
            <p className="text-caption font-semibold text-ink-mut">Ir a</p>
            <ul className="mt-1 flex flex-wrap gap-x-6 md:flex-col">
              {enlaces.map((pagina) => (
                <li key={pagina.path}>
                  <Link to={pagina.path} className="inline-flex min-h-11 min-w-11 items-center text-label text-ink-txt underline-offset-4 hover:underline">
                    {pagina.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <AvisoFicticio />
        <p className="border-t border-ink-mut/30 pt-6 text-caption text-ink-mut">
          © {anio} {CREDITS}
        </p>
      </Contenedor>
    </footer>
  );
}
