import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CURVA } from "@/components/shared/movimiento/constantes";
import { cn } from "@/lib/utils";
import { useSentido } from "./use-sentido";

/** Segundos. Respuesta a una acción: dentro de los 150–250 ms de las interacciones. */
const DURACION_RUEDA = 0.25;
/** Retardo por posición (desde la derecha), como el acarreo de un cuentakilómetros. */
const PASO_RUEDA = 0.04;
const ES_CIFRA = /\d/;

export interface ContadorGaleriaProps {
  /** Texto completo: "1 / 6". Es lo que se anuncia. */
  contador: string;
  /** Foto actual desde 0: decide hacia dónde rueda la cifra. */
  indice: number;
  className?: string;
}

/**
 * Contador de la galería (Bencho, "Like": la cuenta que rueda). Solo rueda la
 * cifra que cambia: entra desde abajo al avanzar y desde arriba al retroceder.
 * - El texto que se anuncia (`aria-live`) va aparte y entero; las ruedas son decorativas.
 * - Con movimiento reducido no hay ruedas: el texto cambia sin más.
 */
export function ContadorGaleria({ contador, indice, className }: ContadorGaleriaProps) {
  const reducir = useReducedMotion();
  const sube = useSentido(indice);
  const caracteres = contador.split("");

  return (
    <div className={cn("min-w-16 text-center text-meta text-mut tabular-nums", className)}>
      <p aria-live="polite" className="sr-only">
        {contador}
      </p>
      <span aria-hidden="true" data-contador-visible className="inline-flex justify-center whitespace-pre">
        {reducir
          ? contador
          : caracteres.map((caracter, posicion) => {
              // Lugares contados desde la derecha: una cifra nueva delante no cambia las claves de las demás.
              const lugar = caracteres.length - 1 - posicion;
              if (!ES_CIFRA.test(caracter)) return <span key={`s${lugar}`}>{caracter}</span>;
              return (
                <span key={`r${lugar}`} className="relative inline-flex overflow-hidden">
                  <AnimatePresence initial={false} mode="popLayout">
                    <motion.span
                      key={caracter}
                      className="inline-block"
                      initial={{ y: sube ? "100%" : "-100%", opacity: 0 }}
                      animate={{ y: "0%", opacity: 1 }}
                      exit={{ y: sube ? "-100%" : "100%", opacity: 0 }}
                      transition={{ duration: DURACION_RUEDA, ease: CURVA, delay: lugar * PASO_RUEDA }}
                    >
                      {caracter}
                    </motion.span>
                  </AnimatePresence>
                </span>
              );
            })}
      </span>
    </div>
  );
}
