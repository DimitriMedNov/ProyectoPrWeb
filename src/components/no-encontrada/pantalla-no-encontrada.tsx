import { useId } from "react";
import { Seccion } from "@/components/shared";
import { Escalonado } from "@/components/shared/movimiento";
import type { ContenidoNoEncontrada } from "@/domain/no-encontrada";
import { IlustracionNoEncontrada } from "./ilustracion-no-encontrada";
import { SalidasNoEncontrada } from "./salidas-no-encontrada";
import { TextoNoEncontrada } from "./texto-no-encontrada";

export interface PantallaNoEncontradaProps {
  contenido: ContenidoNoEncontrada;
}

/**
 * Pantalla de ruta desconocida: sección a pantalla completa, texto y salidas a la
 * izquierda e ilustración a la derecha; en móvil, una sola columna.
 * `Escalonado` lleva la rejilla y marca el inicio de la entrada en cascada.
 */
export function PantallaNoEncontrada({ contenido }: PantallaNoEncontradaProps) {
  const idTitulo = useId();
  return (
    <Seccion aria-labelledby={idTitulo} className="flex min-h-svh items-center">
      <Escalonado className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
        <div className="flex flex-col gap-8">
          <TextoNoEncontrada
            antetitulo={contenido.antetitulo}
            titulo={contenido.titulo}
            subtitulo={contenido.subtitulo}
            parrafo={contenido.parrafo}
            idTitulo={idTitulo}
          />
          <SalidasNoEncontrada salidas={contenido.salidas} />
        </div>
        <IlustracionNoEncontrada imagen={contenido.imagen} />
      </Escalonado>
    </Seccion>
  );
}
