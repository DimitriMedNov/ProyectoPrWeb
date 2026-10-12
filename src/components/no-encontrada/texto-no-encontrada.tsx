import { EscalonadoItem } from "@/components/shared/movimiento";

export interface TextoNoEncontradaProps {
  antetitulo: string;
  titulo: string;
  subtitulo: string;
  parrafo: string;
  /** `id` del H1, para que la sección se nombre con él. */
  idTitulo: string;
}

/**
 * Bloque de texto de la pantalla 404: antetítulo, H1 con degradado, subtítulo y
 * párrafo. Cada línea entra en su turno de la cascada (0, 1, 2 y 3).
 */
export function TextoNoEncontrada({ antetitulo, titulo, subtitulo, parrafo, idTitulo }: TextoNoEncontradaProps) {
  return (
    <div className="flex flex-col gap-4">
      <EscalonadoItem as="p" orden={0} className="text-body font-semibold text-arc">
        {antetitulo}
      </EscalonadoItem>
      {/* pb-1: el degradado recortado al texto no debe cortar las letras que bajan (p, g).
          El degradado va recortado al texto: aquí solo se anima opacidad y posición. */}
      <EscalonadoItem as="h1" orden={1} id={idTitulo} className="gradient-name pb-1 text-hero font-semibold text-balance">
        {titulo}
      </EscalonadoItem>
      <EscalonadoItem as="p" orden={2} className="text-title text-txt">
        {subtitulo}
      </EscalonadoItem>
      <EscalonadoItem as="p" orden={3} className="max-w-copy text-body text-mut">
        {parrafo}
      </EscalonadoItem>
    </div>
  );
}
