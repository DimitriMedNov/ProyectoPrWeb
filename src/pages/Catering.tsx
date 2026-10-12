import { useEffect, useState, type ComponentType } from "react";
import type { ModalSolicitudProps } from "@/components/catering/formulario";
import { ComoFunciona, HeroCatering, Paquetes, Ventajas, useModalSolicitud } from "@/components/catering/pagina";
import { cateringPackages } from "@/domain/menu";
import { useSolicitudCatering } from "@/hooks/catering/use-solicitud-catering";

/**
 * El modal (formulario, gráfica, casillas) va en su propio trozo de JavaScript:
 * no hace falta para pintar la página. Se baja solo un momento después de
 * cargarla, o al pulsar "Solicitar" si aún no llegó.
 */
const cargarModal = () => import("@/components/catering/formulario");
/** Margen para no competir con la descarga y el pintado de la propia página. */
const ESPERA_PRECARGA_MS = 2500;

/** Ruta `/catering`: página de paquetes + modal de solicitud (uno solo para todos los botones). */
export default function Catering() {
  const solicitud = useSolicitudCatering();
  const modal = useModalSolicitud(solicitud.alAbrir);
  // El modal se monta la primera vez que se abre y ya no se desmonta. Sin `lazy()`
  // + <Suspense>: React retiene 300 ms lo que sale de un fallback, y el modal
  // tiene que abrirse en cuanto se pulsa.
  const [Modal, setModal] = useState<ComponentType<ModalSolicitudProps> | null>(null);

  useEffect(() => {
    const espera = window.setTimeout(() => void cargarModal().catch(() => undefined), ESPERA_PRECARGA_MS);
    return () => window.clearTimeout(espera);
  }, []);

  useEffect(() => {
    if (!modal.abierto || Modal) return undefined;
    let vigente = true;
    void cargarModal().then(
      (modulo) => {
        if (vigente) setModal(() => modulo.ModalSolicitud);
      },
      () => undefined,
    );
    return () => {
      vigente = false;
    };
  }, [modal.abierto, Modal]);

  return (
    <main id="main">
      <HeroCatering onSolicitar={modal.solicitar} />
      <Ventajas />
      <Paquetes paquetes={cateringPackages} onSolicitar={modal.solicitar} />
      <ComoFunciona />
      {Modal && <Modal abierto={modal.abierto} onCambioAbierto={modal.cambiarAbierto} solicitud={solicitud} />}
    </main>
  );
}
