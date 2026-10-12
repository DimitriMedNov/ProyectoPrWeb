import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Boton } from "@/components/shared";
import type { TotalEstimado } from "@/domain/catering";
import type { EnvioSolicitud } from "@/hooks/catering/use-envio-solicitud";
import { FUNDIDO, FUNDIDO_CORTO, SUBIDA } from "./movimiento";
import { TotalEstimado as Total } from "./total-estimado";

export interface PieSolicitudProps {
  total: TotalEstimado;
  envio: EnvioSolicitud;
  /** Quedan campos marcados con error: mientras sea así se muestra el aviso de validación. */
  hayCamposConError: boolean;
}

/** Pie fijo del modal: aviso de error (región viva), total estimado y botón de envío. */
export function PieSolicitud({
  total,
  envio,
  hayCamposConError,
}: PieSolicitudProps) {
  const { error, enviando } = envio;
  // Con errores por campo, el detalle ya está junto a cada campo: aquí va solo el aviso.
  const avisoValidacion = hayCamposConError ? error?.mensaje : null;
  const textoError =
    error?.tipo === "validacion" ? avisoValidacion : envio.textoError;
  const subida = useReducedMotion() ? 0 : SUBIDA / 2;

  return (
    <div className="flex shrink-0 flex-col gap-3 border-t border-line px-4 py-3 sm:px-6">
      <div aria-live="polite">
        <AnimatePresence initial={false}>
          {textoError ? (
            <motion.div
              key="aviso"
              initial={{ opacity: 0, y: subida }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: FUNDIDO_CORTO }}
              transition={FUNDIDO}
              className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-control border border-arc bg-panel px-4 py-2"
            >
              <p className="flex min-w-0 flex-1 items-start gap-2 text-label font-medium text-arc">
                <span
                  aria-hidden="true"
                  className="grid size-5 shrink-0 place-items-center rounded-full bg-fill text-caption font-bold text-on-fill"
                >
                  !
                </span>
                <span className="min-w-0 flex-1">{textoError}</span>
              </p>
              {envio.puedeReintentar ? (
                <Boton variante="secundaria" onClick={envio.reintentar}>
                  Reintentar
                </Boton>
              ) : null}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
        <Total total={total} />
        <Boton
          type="submit"
          aria-disabled={enviando ? true : undefined}
          aria-busy={enviando ? true : undefined}
        >
          {enviando ? "Enviando…" : "Realizar pedido"}
        </Boton>
      </div>
    </div>
  );
}
