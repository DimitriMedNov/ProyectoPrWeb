/** Adaptador del puerto `SolicitudesApi` sobre `HttpClient` (no llama a `fetch` directo). */
import type { SolicitudesApi } from "../../application/catering";
import type { HttpClient } from "../../application/puertos";
import { aErrorDeRed, aResultadoEnvio, aSolicitudDto } from "./solicitud-mapper";

export const RUTA_SOLICITUD = "/api/solicitud";

export function crearSolicitudesHttp(http: HttpClient): SolicitudesApi {
  return {
    async enviar(valores, opciones) {
      const respuesta = await http.postJson(RUTA_SOLICITUD, aSolicitudDto(valores), { signal: opciones?.signal });
      return respuesta.ok ? aResultadoEnvio(respuesta.value) : aErrorDeRed(respuesta.error);
    },
  };
}
