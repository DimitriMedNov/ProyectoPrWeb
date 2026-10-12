import { cva, type VariantProps } from "class-variance-authority";

/**
 * Estilo único de todo lo que se pulsa. Lo usan `Boton` (<button>) y
 * `BotonEnlace` (<Link>/<a>). Alto mínimo de 44 px en todas las variantes.
 * Respuesta al pulsar: los botones se encogen un 3 % (solo `scale`); el enlace
 * empuja su chevron. Con movimiento reducido no hay ni una cosa ni la otra.
 */
export const botonVariantes = cva(
  "inline-flex min-h-11 items-center justify-center gap-2 text-body font-medium no-underline transition-[background-color,border-color,color,opacity,scale] duration-200 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50",
  {
    variants: {
      variante: {
        primaria: "rounded-full bg-fill px-6 py-2.5 text-on-fill shadow-card hover:bg-fill/85 hover:shadow-raised active:scale-97 motion-reduce:active:scale-100",
        secundaria: "rounded-full border border-line bg-panel-2 px-6 py-2.5 text-txt hover:border-field active:scale-97 motion-reduce:active:scale-100",
        enlace: "gap-1 text-arc underline-offset-4 hover:underline [&>svg]:transition-transform [&>svg]:duration-200 motion-safe:hover:[&>svg]:translate-x-0.5",
      },
      ancho: {
        auto: "",
        completo: "w-full",
      },
    },
    defaultVariants: { variante: "primaria", ancho: "auto" },
  },
);

export type BotonVariantes = VariantProps<typeof botonVariantes>;
