import { motion } from "motion/react";
import { Checkbox } from "@/components/animate-ui/components/radix/checkbox";
import { cateringRules } from "@/domain/menu";
import type { FormularioCatering } from "@/hooks/catering/use-formulario-catering";
import { cn } from "@/lib/utils";
import { idCampo } from "./campos";
import { ErrorCampo } from "./error-campo";
import { usePildorasMagneticas } from "./use-pildoras-magneticas";

export interface ComplementosProps {
  formulario: FormularioCatering;
  className?: string;
}

/** Complementos opcionales como píldoras con casilla. Al llegar al máximo, las demás se bloquean. */
export function Complementos({ formulario, className }: ComplementosProps) {
  const id = idCampo("complementos");
  const { bloqueados, ayuda } = formulario.complementos;
  const error = formulario.errores.complementos;
  const pildoras = usePildorasMagneticas();

  return (
    <div
      role="group"
      aria-labelledby={`${id}-titulo`}
      aria-describedby={error ? `${id}-ayuda ${id}-error` : `${id}-ayuda`}
      className={cn("flex min-w-0 flex-col gap-2", className)}
    >
      <p
        id={`${id}-titulo`}
        className="flex items-center gap-2 text-sm leading-none font-medium text-txt"
      >
        Complementos <span className="font-normal text-mut">(opcional)</span>
      </p>
      <div className="flex flex-wrap gap-2">
        {cateringRules.addons.map((complemento, posicion) => {
          const idOpcion = `${id}-${complemento.value}`;
          const marcado = formulario.valores.complementos.includes(
            complemento.value,
          );
          const bloqueado = bloqueados.includes(complemento.value);
          return (
            <motion.label
              key={complemento.value}
              htmlFor={idOpcion}
              initial={false}
              animate={pildoras.animacion(posicion, marcado, bloqueado)}
              className={cn(
                "flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 text-label transition-colors duration-200",
                marcado
                  ? "border-arc bg-panel-2 text-txt"
                  : "border-field bg-panel text-txt",
                bloqueado ? "cursor-not-allowed text-mut" : "cursor-pointer",
              )}
            >
              <Checkbox
                id={idOpcion}
                name="complementos"
                value={complemento.value}
                checked={marcado}
                disabled={bloqueado}
                onCheckedChange={() => {
                  pildoras.tocar(posicion);
                  formulario.alternarComplemento(complemento.value);
                }}
                data-campo="complementos"
                className="border-field"
                {...pildoras.gestosCasilla}
              />
              {complemento.label}
            </motion.label>
          );
        })}
      </div>
      <p
        id={`${id}-ayuda`}
        aria-live="polite"
        className="text-caption text-mut"
      >
        {ayuda}
      </p>
      {error ? <ErrorCampo id={`${id}-error`} mensaje={error} /> : null}
    </div>
  );
}
