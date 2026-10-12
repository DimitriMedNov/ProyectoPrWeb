import { Esqueleto, EstadoCargando } from "@/components/shared/estados";
import { Contenedor } from "@/components/shared/seccion";

/**
 * Lo que se ve mientras baja el código de una página (fallback de <Suspense>):
 * la silueta de un encabezado de página con su imagen. Sin `id="main"`: el foco
 * al navegar espera al <main> de la página real.
 */
export function EsqueletoPagina() {
  return (
    <EstadoCargando etiqueta="Cargando página…" className="min-h-svh">
      <Contenedor className="grid items-center gap-10 py-section md:grid-cols-2">
        <div className="flex flex-col gap-4">
          <Esqueleto className="h-5 w-32" />
          <Esqueleto className="h-14 w-full max-w-md" />
          <Esqueleto className="h-14 w-2/3 max-w-xs" />
          <Esqueleto className="h-5 w-full max-w-sm" />
          <div className="mt-2 flex gap-3">
            <Esqueleto className="h-11 w-36 rounded-full" />
            <Esqueleto className="h-11 w-28 rounded-full" />
          </div>
        </div>
        <Esqueleto className="mx-auto aspect-square w-full max-w-sm rounded-full" />
      </Contenedor>
    </EstadoCargando>
  );
}
