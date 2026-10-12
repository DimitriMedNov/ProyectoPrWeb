import { useEnvioSolicitud } from "./use-envio-solicitud";
import type { EnvioSolicitud } from "./use-envio-solicitud";
import { useFormularioCatering } from "./use-formulario-catering";
import type { FormularioCatering } from "./use-formulario-catering";

export interface SolicitudCatering {
  formulario: FormularioCatering;
  envio: EnvioSolicitud;
  /** Envía los valores actuales del formulario. */
  enviar: () => void;
  /** Al abrir el modal: borra el resultado anterior y, si se indica, marca ese paquete. */
  alAbrir: (paquete?: string) => void;
}

/**
 * Formulario + envío ya conectados: tras un envío correcto el formulario se
 * reinicia; con errores por campo, se marcan en el formulario sin borrarlo.
 */
export function useSolicitudCatering(): SolicitudCatering {
  const formulario = useFormularioCatering();
  const envio = useEnvioSolicitud({
    alExito: formulario.reiniciar,
    alErrorDeValidacion: formulario.ponerErrores,
  });

  return {
    formulario,
    envio,
    enviar: () => envio.enviar(formulario.valores),
    alAbrir: (paquete) => {
      envio.limpiar();
      if (paquete) formulario.elegirPaquete(paquete);
    },
  };
}
