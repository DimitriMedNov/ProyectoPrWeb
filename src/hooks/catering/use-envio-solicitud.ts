import { useMutation } from "@tanstack/react-query";
import { CATERING } from "@/application/catering";
import type { ResultadoEnvio } from "@/application/catering";
import type { ErroresPorCampo, ValoresFormulario } from "@/domain/catering";
import { MENSAJE_ERROR_RED, MENSAJE_EXITO, sePuedeReintentar, textoDeError } from "@/domain/catering-envio";
import type { ErrorEnvio, SolicitudEnviada } from "@/domain/catering-envio";
import { useCasosDeUso } from "@/hooks/use-dependencias";

export type EstadoEnvio = "inactivo" | "enviando" | "exito" | "error";

export interface OpcionesEnvioSolicitud {
  /** Tras un envío correcto (p. ej. reiniciar el formulario). */
  alExito?: (enviada: SolicitudEnviada) => void;
  /** Cuando hay errores por campo, del cliente o del servidor. */
  alErrorDeValidacion?: (errores: ErroresPorCampo) => void;
}

export interface EnvioSolicitud {
  estado: EstadoEnvio;
  enviando: boolean;
  /** Datos del envío correcto (con el total del servidor) o `null`. */
  enviada: SolicitudEnviada | null;
  /** Texto del aviso de éxito, o `null`. */
  mensajeExito: string | null;
  /** Error tipado (`validacion` | `servidor` | `red`) o `null`. */
  error: ErrorEnvio | null;
  /** Texto completo del error (mensaje + errores por campo), o `null`. */
  textoError: string | null;
  /** `true` con error de servidor o de red; `false` si hay campos que corregir. */
  puedeReintentar: boolean;
  /** Envía. Mientras hay un envío en curso, se ignora. */
  enviar: (valores: ValoresFormulario) => void;
  /** Repite el último envío con los mismos valores. */
  reintentar: () => void;
  /** Borra el resultado (al reabrir el modal). */
  limpiar: () => void;
}

/** Envío de la solicitud de catering (estado de servidor con react-query). */
export function useEnvioSolicitud(opciones: OpcionesEnvioSolicitud = {}): EnvioSolicitud {
  const { enviarSolicitud } = useCasosDeUso(CATERING);

  const mutacion = useMutation<ResultadoEnvio, Error, ValoresFormulario>({
    mutationFn: (valores) => enviarSolicitud(valores),
    onSuccess: (resultado) => {
      if (resultado.ok) opciones.alExito?.(resultado.value);
      else if (resultado.error.tipo === "validacion") opciones.alErrorDeValidacion?.(resultado.error.errores);
    },
  });

  const resultado = mutacion.data;
  const enviada = resultado?.ok ? resultado.value : null;
  // Un fallo inesperado (excepción) se trata como error de red, igual que antes.
  const error: ErrorEnvio | null = mutacion.isError
    ? { tipo: "red", cancelada: false, mensaje: MENSAJE_ERROR_RED }
    : resultado && !resultado.ok
      ? resultado.error
      : null;

  const estado: EstadoEnvio = mutacion.isPending ? "enviando" : error ? "error" : enviada ? "exito" : "inactivo";
  const ultimos = mutacion.variables;

  return {
    estado,
    enviando: mutacion.isPending,
    enviada,
    mensajeExito: enviada ? MENSAJE_EXITO : null,
    error,
    textoError: error ? textoDeError(error) : null,
    puedeReintentar: error !== null && sePuedeReintentar(error) && ultimos !== undefined,
    enviar: (valores) => {
      if (!mutacion.isPending) mutacion.mutate(valores);
    },
    reintentar: () => {
      if (!mutacion.isPending && ultimos) mutacion.mutate(ultimos);
    },
    limpiar: mutacion.reset,
  };
}
