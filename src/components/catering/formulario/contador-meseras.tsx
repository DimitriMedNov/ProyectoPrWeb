import { motion } from "motion/react";
import { Input } from "@/components/ui/input";
import { Icono } from "@/components/shared";
import type { FormularioCatering } from "@/hooks/catering/use-formulario-catering";
import { cn } from "@/lib/utils";
import { Campo } from "./campo";
import { claseControl, descritoPor, idCampo } from "./campos";
import { useContadorVivo } from "./use-contador-vivo";

const claseBoton =
  "grid size-11 shrink-0 place-items-center rounded-full border border-field bg-panel text-txt hover:bg-panel-2 aria-disabled:cursor-not-allowed aria-disabled:opacity-50";

export interface ContadorMeserasProps {
  formulario: FormularioCatering;
}

/** Meseras: campo numérico con botones − y +. En el límite quedan con `aria-disabled` y conservan el foco. */
export function ContadorMeseras({ formulario }: ContadorMeserasProps) {
  const id = idCampo("meseras");
  const { min, max, puedeQuitar, puedeAnadir, anuncio } = formulario.meseras;
  const ayuda = `De ${min} a ${max}`;
  const error = formulario.errores.meseras;
  const { refValor, inclinacion, perspectiva, quitar, anadir } =
    useContadorVivo(formulario.valores.meseras, puedeQuitar, puedeAnadir);

  return (
    <Campo id={id} etiqueta="Meseras" ayuda={ayuda} error={error}>
      <motion.div
        animate={inclinacion}
        style={{ transformPerspective: perspectiva }}
        className="flex w-fit items-center gap-2"
      >
        <button
          {...quitar}
          type="button"
          aria-label="Quitar una mesera"
          aria-disabled={!puedeQuitar}
          onClick={() => formulario.cambiarMeseras(-1)}
          className={claseBoton}
        >
          <Icono nombre="minus" className="size-4" />
        </button>
        <div ref={refValor}>
          <Input
            id={id}
            name="meseras"
            data-campo="meseras"
            type="number"
            inputMode="numeric"
            min={min}
            max={max}
            value={formulario.valores.meseras}
            onChange={(evento) =>
              formulario.cambiar("meseras", evento.target.value)
            }
            aria-invalid={error ? true : undefined}
            aria-describedby={descritoPor(id, ayuda, error)}
            className={cn(claseControl, "w-20 text-center")}
          />
        </div>
        <button
          {...anadir}
          type="button"
          aria-label="Añadir una mesera"
          aria-disabled={!puedeAnadir}
          onClick={() => formulario.cambiarMeseras(1)}
          className={claseBoton}
        >
          <Icono nombre="plus" className="size-4" />
        </button>
        <span className="sr-only" aria-live="polite">
          {anuncio}
        </span>
      </motion.div>
    </Campo>
  );
}
