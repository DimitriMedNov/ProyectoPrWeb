import { useState } from "react";

/**
 * Dice hacia dónde cambió un número respecto al valor anterior: `true` si subió
 * (o si aún no ha cambiado), `false` si bajó. Sirve para que el contador de la
 * galería ruede hacia arriba al avanzar y hacia abajo al retroceder.
 */
export function useSentido(valor: number): boolean {
  const [previo, setPrevio] = useState(valor);
  const [sube, setSube] = useState(true);
  // Ajuste de estado durante el render (patrón de React para "valor anterior"): sin efecto ni ref.
  if (valor !== previo) {
    setPrevio(valor);
    setSube(valor > previo);
  }
  return sube;
}
