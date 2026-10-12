import type { JSX } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/animate-ui/components/radix/dialog";
import { Icono } from "@/components/shared";
import type { SolicitudCatering } from "@/hooks/catering/use-solicitud-catering";
import { FormularioSolicitud } from "./formulario-solicitud";
import { SolicitudEnviada } from "./solicitud-enviada";
import { useMovimientoModal } from "./use-movimiento-modal";

export interface ModalSolicitudProps {
  abierto: boolean;
  onCambioAbierto: (abierto: boolean) => void;
  solicitud: SolicitudCatering;
}

/**
 * Hoja inferior en móvil (94dvh) y diálogo centrado desde 640 px (máx. 92dvh):
 * son las medidas de la ficha, relativas a la ventana, por eso van escritas.
 */
const clasePanel =
  "top-auto bottom-0 left-0 flex h-[94dvh] w-full max-w-none translate-x-0 translate-y-0 flex-col gap-0 overflow-hidden rounded-t-card rounded-b-none p-0 sm:top-[50%] sm:bottom-auto sm:left-[50%] sm:h-auto sm:max-h-[92dvh] sm:max-w-2xl sm:translate-x-[-50%] sm:translate-y-[-50%] sm:rounded-b-card";

/** El foco inicial va al paquete marcado, no al botón de cerrar. */
function alAbrir(evento: Event) {
  const panel = evento.target;
  if (!(panel instanceof HTMLElement)) return;
  const marcado = panel.querySelector<HTMLElement>(
    '[data-campo="catering"][aria-checked="true"]',
  );
  if (marcado) {
    evento.preventDefault();
    marcado.focus();
  }
}

/** Modal de la solicitud de catering. Escape, trampa de foco y devolución del foco los da el diálogo. */
export function ModalSolicitud({
  abierto,
  onCambioAbierto,
  solicitud,
}: ModalSolicitudProps): JSX.Element {
  const { formulario, envio } = solicitud;
  const movimiento = useMovimientoModal();
  const exito =
    envio.estado === "exito" && envio.mensajeExito ? envio.mensajeExito : null;

  return (
    <Dialog open={abierto} onOpenChange={onCambioAbierto}>
      <DialogContent
        showCloseButton={false}
        onOpenAutoFocus={alAbrir}
        className={clasePanel}
        {...movimiento.panel}
      >
        <DialogHeader className="shrink-0 flex-row items-start justify-between gap-3 border-b border-line py-3 pr-2 pl-4 text-left sm:pr-4 sm:pl-6">
          <div className="flex min-w-0 flex-col gap-1 py-1">
            <DialogTitle className="text-title text-txt">
              Solicitud de catering
            </DialogTitle>
            <DialogDescription className="text-label text-mut">
              Paquete:{" "}
              <span className="font-semibold text-txt">
                {formulario.valores.catering}
              </span>
            </DialogDescription>
          </div>
          <DialogClose
            aria-label="Cerrar"
            className="grid size-11 shrink-0 place-items-center rounded-full text-txt hover:bg-panel-2"
          >
            <Icono nombre="close" />
          </DialogClose>
        </DialogHeader>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={exito ? "exito" : "formulario"}
            className="flex min-h-0 flex-1 flex-col"
            {...movimiento.contenido}
          >
            {exito ? (
              <SolicitudEnviada
                mensaje={exito}
                onOtra={envio.limpiar}
                onCerrar={() => onCambioAbierto(false)}
              />
            ) : (
              <FormularioSolicitud solicitud={solicitud} />
            )}
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
