import { CabeceraSeccion, ImagenDiferida, Seccion } from "@/components/shared";
import { Revelar } from "@/components/shared/movimiento";
import type { SeccionDeliveryInicio } from "@/domain/inicio";

export interface DeliveryInicioProps {
  delivery: SeccionDeliveryInicio;
}

/**
 * Sección de delivery: tablero claro con la imagen de logotipos (sigue claro en modo
 * oscuro; no es clicable) y el texto al lado. En móvil, uno debajo del otro.
 * Cabecera, tablero y texto (0,08 s después) se revelan al entrar en pantalla (Motion).
 */
export function DeliveryInicio({ delivery }: DeliveryInicioProps) {
  const idTitulo = `${delivery.ancla}-titulo`;
  const { imagen } = delivery;
  return (
    <Seccion id={delivery.ancla} fondo="deep" aria-labelledby={idTitulo}>
      <Revelar data-revelar="cabecera">
        <CabeceraSeccion antetitulo={delivery.antetitulo} titulo={delivery.titulo} acento="maiz" idTitulo={idTitulo} />
      </Revelar>
      <div className="mt-10 grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
        <Revelar data-revelar="tablero" className="rounded-card border border-line bg-board p-5 shadow-card sm:p-8">
          <ImagenDiferida
            src={imagen.src}
            alt={imagen.alt}
            width={imagen.width}
            height={imagen.height}
            prioridad={imagen.carga === "eager"}
            className="w-full"
          />
        </Revelar>
        <Revelar retardo={0.08} data-revelar="texto" className="flex flex-col gap-3">
          <h3 className="text-title font-semibold text-txt">{delivery.subtitulo}</h3>
          <p className="max-w-copy text-body text-mut text-pretty">{delivery.parrafo}</p>
        </Revelar>
      </div>
    </Seccion>
  );
}
