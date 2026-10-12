import { Icono, Tarjeta } from "@/components/shared";
import { CONDICIONES } from "./contenido";

/** Reglas del servicio (mínimo de invitados, meseras, complementos y colonias). */
export function Condiciones() {
  return (
    <Tarjeta variante="plana" relleno="amplio" aria-labelledby="condiciones-titulo" role="group" className="flex flex-col gap-6">
      <h3 id="condiciones-titulo" className="text-title font-semibold text-txt">
        Condiciones del servicio
      </h3>
      <dl className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
        {CONDICIONES.map((condicion) => (
          <div key={condicion.id} className="flex min-w-0 flex-col gap-1">
            <dt className="flex items-start gap-3 text-label font-semibold text-txt">
              <Icono nombre={condicion.icono} className="mt-0.5 size-5 shrink-0 text-arc" />
              <span className="min-w-0">{condicion.termino}</span>
            </dt>
            {/* pl-8 = ancho del icono (size-5) + gap-3: el detalle queda alineado con el término. */}
            <dd className="pl-8 text-label text-mut">{condicion.detalle}</dd>
          </div>
        ))}
      </dl>
    </Tarjeta>
  );
}
