/** Ids y clases que comparten los campos del formulario de catering. */

/** Id del control de un campo: `solicitud-invitados`. */
export const idCampo = (campo: string): string => `solicitud-${campo}`;

/** `aria-describedby` de un control: su ayuda y, si lo hay, su error. */
export function descritoPor(
  id: string,
  ayuda?: string,
  error?: string,
): string | undefined {
  const ids = [
    ayuda ? `${id}-ayuda` : null,
    error ? `${id}-error` : null,
  ].filter(Boolean);
  return ids.length ? ids.join(" ") : undefined;
}

/** Ajuste de los campos base de shadcn: 44 px de alto y 16 px de letra (sin zoom en iOS). */
export const claseControl = "h-11 px-3 text-base text-txt md:text-base";

/** Mismo aspecto que `Input` para los controles nativos sin base instalada (`select`). */
export const claseControlNativo =
  "h-11 w-full min-w-0 rounded-lg border border-input bg-transparent px-3 text-base text-txt outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20";
