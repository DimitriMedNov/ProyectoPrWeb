/**
 * DTO y mapper de `POST /api/solicitud`: traduce entre lo que viaja por HTTP y
 * los tipos de dominio. Lo que devuelve la API no sale de este archivo.
 */
import type { ResultadoEnvio } from "../../application/catering";
import type { HttpResponse, NetworkError } from "../../application/puertos";
import { CAMPOS_SOLICITUD } from "../../domain/catering";
import type { ErroresPorCampo, ValoresFormulario } from "../../domain/catering";
import { MENSAJE_ERROR_RED, MENSAJE_ERROR_SERVIDOR } from "../../domain/catering-envio";
import { err, ok } from "../../domain/result";

/** Cuerpo de la petición: todos los campos como texto y `complementos` como arreglo. */
export interface SolicitudDto {
  catering: string;
  invitados: string;
  fecha: string;
  hora: string;
  direccion: string;
  colonia: string;
  cp: string;
  meseras: string;
  complementos: string[];
  issue: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  sitio_web: string;
}

/** Cuerpo de la respuesta, tal como lo manda `api/solicitud.ts`. */
export interface RespuestaSolicitudDto {
  ok?: boolean;
  total?: number;
  mensaje?: string;
  errores?: Record<string, string>;
}

export function aSolicitudDto(valores: ValoresFormulario): SolicitudDto {
  return {
    catering: valores.catering,
    invitados: valores.invitados,
    fecha: valores.fecha,
    hora: valores.hora,
    direccion: valores.direccion,
    colonia: valores.colonia,
    cp: valores.cp,
    meseras: valores.meseras,
    complementos: [...valores.complementos],
    issue: valores.issue,
    nombre: valores.nombre,
    apellido: valores.apellido,
    email: valores.email,
    telefono: valores.telefono,
    sitio_web: valores.sitio_web,
  };
}

const esObjeto = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);

/** Estrecha el JSON recibido: lo que no tenga el tipo esperado se descarta. */
export function aRespuestaDto(body: unknown): RespuestaSolicitudDto {
  if (!esObjeto(body)) return {};
  const dto: RespuestaSolicitudDto = {};
  if (typeof body.ok === "boolean") dto.ok = body.ok;
  if (typeof body.total === "number" && Number.isFinite(body.total)) dto.total = body.total;
  if (typeof body.mensaje === "string") dto.mensaje = body.mensaje;
  if (esObjeto(body.errores)) {
    const errores: Record<string, string> = {};
    for (const [campo, texto] of Object.entries(body.errores)) {
      if (typeof texto === "string") errores[campo] = texto;
    }
    dto.errores = errores;
  }
  return dto;
}

/** `errores` del servidor → errores por campo del formulario (solo campos conocidos). */
export function aErroresPorCampo(errores: Record<string, string> | undefined): ErroresPorCampo {
  const porCampo: ErroresPorCampo = {};
  if (!errores) return porCampo;
  for (const campo of CAMPOS_SOLICITUD) {
    const texto = errores[campo];
    if (texto) porCampo[campo] = texto;
  }
  return porCampo;
}

export function aResultadoEnvio(respuesta: HttpResponse): ResultadoEnvio {
  const dto = aRespuestaDto(respuesta.body);
  if (respuesta.ok && dto.ok === true) return ok({ total: dto.total ?? null });

  const mensaje = dto.mensaje ?? MENSAJE_ERROR_SERVIDOR;
  const errores = aErroresPorCampo(dto.errores);
  if (Object.keys(errores).length > 0) return err({ tipo: "validacion", origen: "servidor", mensaje, errores });
  return err({ tipo: "servidor", estado: respuesta.status, mensaje });
}

export function aErrorDeRed(error: NetworkError): ResultadoEnvio {
  return err({ tipo: "red", cancelada: error.aborted, mensaje: MENSAJE_ERROR_RED });
}
