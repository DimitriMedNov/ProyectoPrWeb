import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const tarjetaVariantes = cva("gap-0 rounded-card border py-0 text-body text-txt ring-0", {
  variants: {
    variante: {
      base: "border-line bg-panel shadow-card",
      suave: "border-transparent bg-panel-2",
      destacada: "border-chile bg-panel shadow-raised",
      plana: "border-line bg-panel",
    },
    relleno: {
      ninguno: "",
      normal: "p-6",
      amplio: "p-6 md:p-8",
    },
    /** Sube 4 px al pasar el cursor o al recibir el foco dentro (solo `transform`). */
    elevar: {
      true: "transition-transform duration-200 motion-safe:hover:-translate-y-1 motion-safe:focus-within:-translate-y-1",
      false: "",
    },
  },
  defaultVariants: { variante: "base", relleno: "normal", elevar: false },
});

export interface TarjetaProps extends Omit<ComponentProps<"div">, "size">, VariantProps<typeof tarjetaVariantes> {}

/** Tarjeta base del sitio (sobre `Card` de shadcn, con los tokens del proyecto). */
export function Tarjeta({ variante, relleno, elevar, className, ...props }: TarjetaProps) {
  return <Card className={cn(tarjetaVariantes({ variante, relleno, elevar }), className)} {...props} />;
}
