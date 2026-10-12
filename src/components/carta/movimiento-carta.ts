import { CURVA } from "@/components/shared/movimiento/constantes";

/** Segundos. Respuesta a una acción (filtrar, cambiar de pestaña): 0,15–0,25 s. */
export const DURACION_FILTRO = 0.22;

/** Fundido de lo que entra o sale al cambiar de filtro. */
export const TRANSICION_FILTRO = { duration: DURACION_FILTRO, ease: CURVA } as const;

/** Recolocación (solo `transform`) de lo que se queda cuando algo sale. */
export const TRANSICION_RECOLOCAR = { duration: 0.25, ease: CURVA } as const;

/** Retardo entre tarjetas reveladas en fila: 0 / 0,08 / 0,16 s. */
export const PASO_TARJETAS = 0.08;

/** `layoutId` del resaltado que viaja de una pestaña a otra. */
export const ID_RESALTADO_PESTANA = "carta-pestana-activa";
