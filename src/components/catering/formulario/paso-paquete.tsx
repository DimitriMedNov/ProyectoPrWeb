import { useReducedMotion } from "motion/react";
import { useCallback, useRef } from "react";
import type { KeyboardEvent } from "react";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/animate-ui/components/radix/radio-group";
import { Icono } from "@/components/shared";
import { cateringPackages, money } from "@/domain/menu";
import type { FormularioCatering } from "@/hooks/catering/use-formulario-catering";
import { cn } from "@/lib/utils";
import { Paso } from "./campo";
import { idCampo } from "./campos";
import { ErrorCampo } from "./error-campo";
import { SIN_GESTOS } from "./movimiento";

export interface PasoPaqueteProps {
  formulario: FormularioCatering;
}

const FLECHAS = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];

/**
 * Radix selecciona al mover el foco solo si la flecha sigue pulsada, y mueve el foco un
 * instante después de la pulsación: con un toque muy corto la tecla ya se soltó y el foco
 * cambia sin seleccionar. Aquí la flecha queda anotada hasta que llega el foco, así cada
 * flecha mueve el foco y selecciona, como en un grupo de radio nativo.
 */
function useSeleccionConFlechas(elegir: (nombre: string) => void) {
  const flechaPendiente = useRef(false);
  const alPulsarTecla = useCallback((evento: KeyboardEvent<HTMLElement>) => {
    if (FLECHAS.includes(evento.key)) flechaPendiente.current = true;
  }, []);
  const alSoltarPendiente = useCallback(() => {
    flechaPendiente.current = false;
  }, []);
  const alEnfocar = useCallback(
    (nombre: string) => {
      if (!flechaPendiente.current) return;
      flechaPendiente.current = false;
      elegir(nombre);
    },
    [elegir],
  );
  return { alPulsarTecla, alSoltarPendiente, alEnfocar };
}

/** Paso 1: el paquete, como tarjetas de opción única (las flechas cambian de paquete). */
export function PasoPaquete({ formulario }: PasoPaqueteProps) {
  const id = idCampo("catering");
  const error = formulario.errores.catering;
  // Con movimiento reducido el radio no crece ni se encoge al pasar el cursor o pulsarlo.
  const gestos = useReducedMotion() ? SIN_GESTOS : {};
  const flechas = useSeleccionConFlechas(formulario.elegirPaquete);

  return (
    <Paso numero={1} titulo="Elige tu paquete">
      <RadioGroup
        name="catering"
        required
        value={formulario.valores.catering}
        onValueChange={formulario.elegirPaquete}
        onKeyDown={flechas.alPulsarTecla}
        onPointerDown={flechas.alSoltarPendiente}
        aria-label="Paquete"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className="grid gap-3 sm:grid-cols-3"
      >
        {cateringPackages.map((paquete, posicion) => {
          const idOpcion = `${id}-${posicion}`;
          const marcado = paquete.name === formulario.valores.catering;
          return (
            <label
              key={paquete.name}
              htmlFor={idOpcion}
              className={cn(
                "flex min-h-11 min-w-0 cursor-pointer items-center gap-3 rounded-card border bg-panel p-4 sm:flex-col sm:items-start",
                marcado ? "border-arc" : "border-field",
              )}
            >
              <Icono nombre={paquete.icon} className="size-6 text-arc" />
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="text-label font-semibold text-txt">
                  {paquete.name}
                </span>
                <span className="text-caption text-mut">
                  {money(paquete.pricePerPerson, 0)} / persona
                </span>
              </span>
              <RadioGroupItem
                id={idOpcion}
                value={paquete.name}
                data-campo="catering"
                onFocus={() => flechas.alEnfocar(paquete.name)}
                className="size-5 border-field"
                {...gestos}
              />
            </label>
          );
        })}
      </RadioGroup>
      {error ? (
        <ErrorCampo id={`${id}-error`} mensaje={error} className="mt-2" />
      ) : null}
    </Paso>
  );
}
