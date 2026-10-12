import { useEffect, useRef } from "react";
import { Boton, Icono } from "@/components/shared";

export interface SolicitudEnviadaProps {
  mensaje: string;
  onOtra: () => void;
  onCerrar: () => void;
}

/** Estado de éxito del envío: el aviso (recibe el foco para que se lea) y dos salidas. */
export function SolicitudEnviada({
  mensaje,
  onOtra,
  onCerrar,
}: SolicitudEnviadaProps) {
  const refAviso = useRef<HTMLDivElement>(null);

  useEffect(() => {
    refAviso.current?.focus();
  }, []);

  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-6 overflow-y-auto px-4 py-10 text-center sm:px-6">
      <div
        ref={refAviso}
        role="status"
        tabIndex={-1}
        className="flex max-w-copy flex-col items-center gap-4 outline-none"
      >
        <span className="plate grid size-14 place-items-center rounded-full">
          <Icono nombre="check" className="size-6" />
        </span>
        <p className="text-body text-txt">{mensaje}</p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Boton variante="secundaria" onClick={onOtra}>
          Hacer otra solicitud
        </Boton>
        <Boton onClick={onCerrar}>Cerrar</Boton>
      </div>
    </div>
  );
}
