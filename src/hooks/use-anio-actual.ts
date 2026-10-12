/** Año en curso, para la línea de copyright del pie. */
export function useAnioActual(): number {
  return new Date().getFullYear();
}
