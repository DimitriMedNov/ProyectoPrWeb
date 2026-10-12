import { Contenedor, Icono, type NombreIcono } from "@/components/shared";
import { EscalonadoItem } from "@/components/shared/movimiento";

/** Icono decorativo de cada dato; si llega un texto nuevo se pinta sin icono. */
const ICONO_POR_CHIP: Record<string, NombreIcono> = {
  "Catering para eventos": "party",
  "Opciones vegetarianas y veganas": "leaf",
  "Delivery por apps": "truck",
};

export interface ChipsHeroProps {
  /** Datos informativos: no son enlaces ni botones. */
  chips: readonly string[];
  /** Turno en la entrada escalonada de la portada. */
  orden?: number;
}

/** Franja inferior de la portada con los datos informativos; entra la última en la cascada. */
export function ChipsHero({ chips, orden }: ChipsHeroProps) {
  return (
    <EscalonadoItem orden={orden} data-hero="chips" className="border-t border-line">
      <Contenedor>
        <ul className="grid gap-x-8 gap-y-3 py-5 sm:grid-cols-3">
          {chips.map((chip) => {
            const icono = ICONO_POR_CHIP[chip];
            return (
              <li key={chip} className="flex items-center gap-3 text-label font-medium text-txt">
                {icono ? (
                  <span className="plate inline-flex size-10 shrink-0 items-center justify-center rounded-full">
                    <Icono nombre={icono} className="size-5" />
                  </span>
                ) : null}
                {chip}
              </li>
            );
          })}
        </ul>
      </Contenedor>
    </EscalonadoItem>
  );
}
