/**
 * Catering: puerto de salida y caso de uso "enviar solicitud".
 * El adaptador vive en `src/infrastructure/catering/` y se conecta en
 * `src/app/funcionalidades/catering.ts`.
 */
import { validarFormulario } from "../../domain/catering";
import type { ValoresFormulario } from "../../domain/catering";
import { MENSAJE_REVISA_CAMPOS } from "../../domain/catering-envio";
import type { ErrorEnvio, SolicitudEnviada } from "../../domain/catering-envio";
import { err } from "../../domain/result";
import type { Result } from "../../domain/result";
import { defineFeature } from "../funcionalidad";

export type ResultadoEnvio = Result<SolicitudEnviada, ErrorEnvio>;

export interface OpcionesEnvio {
  signal?: AbortSignal;
}

/** Puerto: a dónde se mandan las solicitudes de catering. */
export interface SolicitudesApi {
  enviar(valores: ValoresFormulario, opciones?: OpcionesEnvio): Promise<ResultadoEnvio>;
}

export type EnviarSolicitud = (valores: ValoresFormulario, opciones?: OpcionesEnvio) => Promise<ResultadoEnvio>;

/**
 * Caso de uso: valida en el cliente y, si todo está bien, envía. Con campos
 * inválidos no se hace ninguna petición.
 */
export function crearEnviarSolicitud(api: SolicitudesApi, ahora: () => Date = () => new Date()): EnviarSolicitud {
  return async (valores, opciones) => {
    const validacion = validarFormulario(valores, ahora());
    if (!validacion.ok) {
      return err({
        tipo: "validacion",
        origen: "cliente",
        mensaje: MENSAJE_REVISA_CAMPOS,
        errores: validacion.errores,
      });
    }
    return api.enviar(valores, opciones);
  };
}

export interface CateringUseCases {
  enviarSolicitud: EnviarSolicitud;
}

export const CATERING = defineFeature<CateringUseCases>("catering");
