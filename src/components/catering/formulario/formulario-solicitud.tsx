import type { FormEvent } from "react";
import { Icono } from "@/components/shared";
import type { SolicitudCatering } from "@/hooks/catering/use-solicitud-catering";
import { Paso } from "./campo";
import { GraficaPaquetes } from "./grafica-paquetes";
import { PasoContacto } from "./paso-contacto";
import { PasoEvento } from "./paso-evento";
import { PasoPaquete } from "./paso-paquete";
import { PieSolicitud } from "./pie-solicitud";
import { useFocoFormulario } from "./use-foco-formulario";

export interface FormularioSolicitudProps {
  solicitud: SolicitudCatering;
}

/** Formulario de la solicitud: cuatro pasos con scroll propio y pie fijo con total y envío. */
export function FormularioSolicitud({ solicitud }: FormularioSolicitudProps) {
  const { formulario, envio } = solicitud;
  const { refFormulario, enfocar } = useFocoFormulario(envio.error);

  // La validación (con sus mensajes por campo) la hace el envío; por eso `noValidate`.
  const alEnviar = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    solicitud.enviar();
  };

  return (
    <form
      ref={refFormulario}
      noValidate
      onSubmit={alEnviar}
      aria-busy={envio.enviando}
      className="flex min-h-0 flex-1 flex-col"
    >
      <div className="flex min-h-0 flex-1 flex-col gap-8 overflow-x-hidden overflow-y-auto overscroll-contain px-4 py-5 sm:px-6">
        <PasoPaquete formulario={formulario} />
        <PasoEvento formulario={formulario} />
        <GraficaPaquetes
          invitados={formulario.valores.invitados}
          elegido={formulario.valores.catering}
          onPedirInvitados={() => enfocar("invitados")}
        />
        <PasoContacto formulario={formulario} />
        <Paso numero={4} titulo="Pago">
          <p className="flex items-start gap-3 rounded-card border border-line bg-panel-2 p-4 text-label text-txt">
            <Icono nombre="card" className="mt-0.5 text-mut" />
            <span>
              No se cobra en línea ni se piden datos de tarjeta. Este es un
              proyecto universitario: tu solicitud se valida, pero no se guarda
              ni se envía a ningún restaurante.
            </span>
          </p>
        </Paso>
      </div>
      <PieSolicitud
        total={formulario.total}
        envio={envio}
        hayCamposConError={Object.keys(formulario.errores).length > 0}
      />
    </form>
  );
}
