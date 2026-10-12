import { Link } from "react-router-dom";
import { Icono, Seccion, Tarjeta, type NombreIcono } from "@/components/shared";
import { Revelar } from "@/components/shared/movimiento";
import { PASO_TARJETAS } from "./movimiento-carta";

interface Salida {
  to: string;
  icono: NombreIcono;
  titulo: string;
  texto: string;
  enlace: string;
}

const SALIDAS: readonly Salida[] = [
  {
    to: "/catering",
    icono: "party",
    titulo: "¿Es para un evento?",
    texto: "Buffet, comida formal o cena temática, con precio por persona.",
    enlace: "Ver paquetes de catering",
  },
  {
    to: "/#delivery",
    icono: "truck",
    titulo: "¿Lo quieres en casa?",
    texto: "Pide por tu app de delivery favorita.",
    enlace: "Ver apps de delivery",
  },
];

/** Dos tarjetas-enlace de salida: catering y delivery. Toda la tarjeta es clicable. */
export function CierreCarta() {
  return (
    <Seccion aria-label="Otras formas de pedir">
      <ul className="grid gap-6 md:grid-cols-2">
        {SALIDAS.map((salida, posicion) => (
          <Revelar as="li" key={salida.to} retardo={posicion * PASO_TARJETAS} className="min-w-0">
            <Link to={salida.to} className="group block h-full rounded-card no-underline">
              <Tarjeta elevar relleno="amplio" className="flex h-full flex-col items-start gap-3 group-hover:border-field motion-safe:group-focus-visible:-translate-y-1">
                <span className="plate grid size-12 place-items-center rounded-full">
                  <Icono nombre={salida.icono} />
                </span>
                <h2 className="text-title font-semibold text-txt">{salida.titulo}</h2>
                <p className="text-body text-mut">{salida.texto}</p>
                <span className="mt-auto inline-flex min-h-11 items-center gap-1 text-body font-medium text-arc underline-offset-4 group-hover:underline">
                  {salida.enlace}
                  <Icono nombre="chevron-right" className="size-4" />
                </span>
              </Tarjeta>
            </Link>
          </Revelar>
        ))}
      </ul>
    </Seccion>
  );
}
