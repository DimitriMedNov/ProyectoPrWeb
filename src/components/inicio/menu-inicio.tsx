import { BotonEnlace, CabeceraSeccion, Seccion } from "@/components/shared";
import { Revelar } from "@/components/shared/movimiento";
import type { ContenidoInicio } from "@/hooks/inicio/use-inicio";
import { TarjetaEspecialidad } from "./tarjeta-especialidad";

/** Segundos entre una tarjeta y la siguiente al revelarse (0 / 0,08 / 0,16). */
const PASO_TARJETAS = 0.08;

export interface MenuInicioProps {
  menu: ContenidoInicio["menu"];
}

/**
 * Sección "Nuestro menú": cabecera con enlace a la carta y las especialidades en rejilla
 * de 1 / 2 / 3 columnas; en 2 columnas la última va centrada a media anchura.
 * Cabecera y tarjetas se revelan al entrar en pantalla (Motion).
 */
export function MenuInicio({ menu }: MenuInicioProps) {
  const idTitulo = `${menu.ancla}-titulo`;
  return (
    <Seccion id={menu.ancla} aria-labelledby={idTitulo}>
      <Revelar data-revelar="cabecera">
        <CabeceraSeccion antetitulo={menu.antetitulo} titulo={menu.titulo} idTitulo={idTitulo}>
          <BotonEnlace to={menu.enlace.destino} variante="enlace">
            {menu.enlace.texto}
          </BotonEnlace>
        </CabeceraSeccion>
      </Revelar>
      <ul className="mt-10 grid gap-6 sm:grid-cols-4 lg:grid-cols-3">
        {menu.especialidades.map((especialidad, posicion) => (
          <Revelar
            as="li"
            retardo={posicion * PASO_TARJETAS}
            key={especialidad.nombre}
            data-revelar="tarjeta"
            className="sm:col-span-2 sm:last:odd:col-start-2 lg:col-span-1 lg:last:odd:col-start-auto"
          >
            <TarjetaEspecialidad especialidad={especialidad} />
          </Revelar>
        ))}
      </ul>
    </Seccion>
  );
}
