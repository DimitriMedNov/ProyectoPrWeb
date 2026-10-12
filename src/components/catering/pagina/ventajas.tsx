import { Icono, Seccion, Tarjeta } from "@/components/shared";
import { Escalonado, EscalonadoItem } from "@/components/shared/movimiento";
import { VENTAJAS } from "./contenido";

/** Las cuatro ventajas del servicio: 1 columna en móvil, 2 en tableta, 4 en escritorio. */
export function Ventajas() {
  return (
    <Seccion aire="ninguno" aria-label="Ventajas del servicio" className="pb-section">
      <Escalonado as="ul" paso={0.06} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {VENTAJAS.map((ventaja) => (
          <EscalonadoItem as="li" key={ventaja.id} className="flex">
            <Tarjeta elevar className="flex w-full flex-col items-start gap-3">
              <span className="plate flex size-12 items-center justify-center rounded-full">
                <Icono nombre={ventaja.icono} className="size-6" />
              </span>
              <div className="flex flex-col gap-1">
                <h2 className="text-body font-semibold text-txt">{ventaja.titulo}</h2>
                <p className="text-label text-mut">{ventaja.texto}</p>
              </div>
            </Tarjeta>
          </EscalonadoItem>
        ))}
      </Escalonado>
    </Seccion>
  );
}
