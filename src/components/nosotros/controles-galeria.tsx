import { motion, useReducedMotion } from "motion/react";
import { Icono, type NombreIcono } from "@/components/shared";
import { cn } from "@/lib/utils";
import { ContadorGaleria } from "./contador-galeria";

/** Muelle con un poco de rebote: el botón se encoge al pulsar y vuelve pasándose apenas de su tamaño. */
const MUELLE = { type: "spring", stiffness: 520, damping: 18, mass: 0.6 } as const;
const ENCOGIDO = 0.9;
/** Píxeles que se asoma la flecha hacia donde va la galería. */
const EMPUJE = 3;

interface BotonFlechaProps {
  etiqueta: string;
  icono: NombreIcono;
  /** -1: hacia la izquierda; 1: hacia la derecha. */
  sentido: -1 | 1;
  /** En el extremo: se ve al 40 % y no hace nada, pero conserva el foco. */
  inactivo: boolean;
  onPulsar: () => void;
}

/**
 * Flecha de la galería. Respuesta al pulsar (Bencho, "Like": apretar, pasarse y
 * asentar): el botón se encoge y la flecha se asoma hacia su lado. En el extremo
 * y con movimiento reducido no se mueve.
 */
function BotonFlecha({ etiqueta, icono, sentido, inactivo, onPulsar }: BotonFlechaProps) {
  const reducir = useReducedMotion();
  const responde = !inactivo && !reducir;
  return (
    <motion.button
      type="button"
      aria-label={etiqueta}
      aria-disabled={inactivo}
      onClick={onPulsar}
      whileTap={responde ? "pulsado" : undefined}
      variants={{ pulsado: { scale: ENCOGIDO } }}
      transition={MUELLE}
      className={cn(
        "inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-panel-2 text-txt transition-[background-color,opacity]",
        inactivo ? "cursor-default opacity-40" : "hover:bg-void",
      )}
    >
      <motion.span variants={{ pulsado: { x: sentido * EMPUJE } }} transition={MUELLE} className="inline-flex">
        <Icono nombre={icono} />
      </motion.span>
    </motion.button>
  );
}

export interface ControlesGaleriaProps {
  /** Texto del contador: "1 / 6". */
  contador: string;
  /** Foto actual desde 0 (para el sentido en que rueda el contador). */
  indice: number;
  esPrimera: boolean;
  esUltima: boolean;
  etiquetaAnterior: string;
  etiquetaSiguiente: string;
  onAnterior: () => void;
  onSiguiente: () => void;
  className?: string;
}

/** Píldora de navegación de la galería: anterior, contador y siguiente. */
export function ControlesGaleria({
  contador,
  indice,
  esPrimera,
  esUltima,
  etiquetaAnterior,
  etiquetaSiguiente,
  onAnterior,
  onSiguiente,
  className,
}: ControlesGaleriaProps) {
  return (
    <div className={cn("flex items-center justify-center gap-1 rounded-full border border-line bg-panel p-1.5 shadow-card", className)}>
      <BotonFlecha etiqueta={etiquetaAnterior} icono="chevron-left" sentido={-1} inactivo={esPrimera} onPulsar={onAnterior} />
      <ContadorGaleria contador={contador} indice={indice} />
      <BotonFlecha etiqueta={etiquetaSiguiente} icono="chevron-right" sentido={1} inactivo={esUltima} onPulsar={onSiguiente} />
    </div>
  );
}
