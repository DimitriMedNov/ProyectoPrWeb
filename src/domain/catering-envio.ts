/**
 * Resultado de enviar una solicitud de catering: el éxito y los tipos de error
 * que la pantalla distingue, con sus mensajes literales.
 */
import { CAMPOS_SOLICITUD } from "./catering";
import type { ErroresPorCampo } from "./catering";

export const MENSAJE_EXITO =
  "¡Listo! Tu solicitud pasó todas las validaciones. Como es un proyecto universitario, no se envía a ningún restaurante. 🌮";
export const MENSAJE_ERROR_SERVIDOR = "No pudimos enviar tu solicitud.";
export const MENSAJE_ERROR_RED = "No pudimos conectar. Revisa tu conexión e inténtalo de nuevo.";
export const MENSAJE_REVISA_CAMPOS = "Revisa los campos marcados.";

export interface SolicitudEnviada {
  /** Total recalculado por el servidor; `null` si la respuesta no lo trae. */
  total: number | null;
}

/** Hay campos que corregir. `origen` dice quién los detectó. */
export interface ErrorDeValidacion {
  tipo: "validacion";
  origen: "cliente" | "servidor";
  mensaje: string;
  errores: ErroresPorCampo;
}

/** El servidor respondió con un error sin detalle por campo (415, 413, 400, 5xx…). */
export interface ErrorDeServidor {
  tipo: "servidor";
  estado: number;
  mensaje: string;
}

/** No hubo respuesta: sin conexión o petición cancelada. */
export interface ErrorDeRed {
  tipo: "red";
  cancelada: boolean;
  mensaje: string;
}

export type ErrorEnvio = ErrorDeValidacion | ErrorDeServidor | ErrorDeRed;

/**
 * Texto completo del error, como se mostraba en un solo aviso: el mensaje y,
 * si hay errores por campo, todos sus textos separados por un espacio.
 */
export function textoDeError(error: ErrorEnvio): string {
  if (error.tipo !== "validacion") return error.mensaje;
  const detalle = CAMPOS_SOLICITUD.flatMap((campo) => error.errores[campo] ?? []);
  return [error.mensaje, ...detalle].join(" ");
}

/** ¿Tiene sentido volver a enviar lo mismo? Sí, salvo que haya campos que corregir. */
export const sePuedeReintentar = (error: ErrorEnvio): boolean => error.tipo !== "validacion";
