import { CabeceraSeccion, Seccion } from "@/components/shared";
import { Escalonado, EscalonadoItem } from "@/components/shared/movimiento";
import { PASOS, PASOS_CABECERA } from "./contenido";

/** Los tres pasos, numerados: en fila desde tableta, en columna en móvil. */
export function ComoFunciona() {
  return (
    <Seccion id="como-funciona" aria-labelledby="como-funciona-titulo" claseContenedor="flex flex-col gap-10">
      <CabeceraSeccion idTitulo="como-funciona-titulo" acento="cilantro" antetitulo={PASOS_CABECERA.antetitulo} titulo={PASOS_CABECERA.titulo} />
      <Escalonado as="ol" paso={0.08} className="grid gap-8 md:grid-cols-3">
        {PASOS.map((paso) => (
          <EscalonadoItem as="li" key={paso.numero} className="flex gap-4 md:flex-col md:items-center md:text-center">
            <span aria-hidden="true" className="flex size-11 shrink-0 items-center justify-center rounded-full bg-fill text-body font-semibold text-on-fill tabular-nums">
              {paso.numero}
            </span>
            <div className="flex flex-col gap-1">
              <h3 className="text-body font-semibold text-txt">{paso.titulo}</h3>
              <p className="text-label text-mut">{paso.texto}</p>
            </div>
          </EscalonadoItem>
        ))}
      </Escalonado>
    </Seccion>
  );
}
