import type { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Badge } from "@/components/ui/badge";
import type { Tag } from "@/domain/menu";
import { cn } from "@/lib/utils";
import { Icono, type NombreIcono } from "./icono";

const pildoraVariantes = cva("h-auto gap-1.5 rounded-full border px-3 py-1 text-caption font-medium", {
  variants: {
    tono: {
      neutro: "border-transparent bg-panel-2 text-mut",
      contorno: "border-line bg-transparent text-txt",
      marca: "border-transparent bg-fill text-on-fill",
      cilantro: "border-acc-cilantro/40 bg-acc-cilantro/10 text-txt",
      chile: "border-arc/40 bg-arc/10 text-txt",
    },
  },
  defaultVariants: { tono: "neutro" },
});

export interface PildoraProps extends VariantProps<typeof pildoraVariantes> {
  icono?: NombreIcono;
  /** Clases del icono (color de acento). */
  claseIcono?: string;
  className?: string;
  children: ReactNode;
}

/** Píldora de dato: ingrediente, característica, insignia. No es interactiva. */
export function Pildora({ tono, icono, claseIcono, className, children }: PildoraProps) {
  return (
    <Badge variant="secondary" className={cn(pildoraVariantes({ tono }), className)}>
      {icono ? <Icono nombre={icono} className={cn("size-3.5", claseIcono)} /> : null}
      {children}
    </Badge>
  );
}

const ETIQUETAS: Record<Tag, { texto: string; icono: NombreIcono; tono: "cilantro" | "chile"; claseIcono: string }> = {
  vegetariano: { texto: "Vegetariano", icono: "leaf", tono: "cilantro", claseIcono: "text-acc-cilantro" },
  vegano: { texto: "Vegano", icono: "leaf", tono: "cilantro", claseIcono: "text-acc-cilantro" },
  picante: { texto: "Picante", icono: "chile", tono: "chile", claseIcono: "text-arc" },
};

export interface EtiquetaPlatilloProps {
  tag: Tag;
  className?: string;
}

/** Etiqueta de platillo: vegetariano y vegano en verde cilantro, picante en rojo. */
export function EtiquetaPlatillo({ tag, className }: EtiquetaPlatilloProps) {
  const { texto, icono, tono, claseIcono } = ETIQUETAS[tag];
  return (
    <Pildora tono={tono} icono={icono} claseIcono={claseIcono} className={className}>
      {texto}
    </Pildora>
  );
}
