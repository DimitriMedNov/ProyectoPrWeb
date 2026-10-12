import type { ComponentProps, ReactNode } from "react";
import { Link, type LinkProps } from "react-router-dom";
import { cn } from "@/lib/utils";
import { botonVariantes, type BotonVariantes } from "./boton-variantes";
import { Icono } from "./icono";

/** La variante `enlace` lleva chevron al final (salvo `sinChevron`). */
function Contenido({ variante, sinChevron, children }: { variante: BotonVariantes["variante"]; sinChevron?: boolean; children: ReactNode }) {
  return (
    <>
      {children}
      {variante === "enlace" && !sinChevron ? <Icono nombre="chevron-right" className="size-4" /> : null}
    </>
  );
}

export interface BotonProps extends ComponentProps<"button">, BotonVariantes {
  sinChevron?: boolean;
}

/** Botón de acción (`<button>`). Para ir a otra página se usa `BotonEnlace`. */
export function Boton({ variante = "primaria", ancho, sinChevron = true, className, type = "button", children, ...props }: BotonProps) {
  return (
    <button type={type} className={cn(botonVariantes({ variante, ancho }), className)} {...props}>
      <Contenido variante={variante} sinChevron={sinChevron}>
        {children}
      </Contenido>
    </button>
  );
}

export interface BotonEnlaceProps extends Omit<LinkProps, "to">, BotonVariantes {
  /** Ruta interna (`/menu`, `/#delivery`). Usa `<Link>`: no recarga la página. */
  to?: LinkProps["to"];
  /** Dirección externa. Usa `<a>`. Se da `to` o `href`, no los dos. */
  href?: string;
  sinChevron?: boolean;
}

/** Enlace con aspecto de botón (primaria, secundaria) o de enlace con chevron. */
export function BotonEnlace({ to, href, variante = "primaria", ancho, sinChevron, className, children, ...props }: BotonEnlaceProps) {
  const clases = cn(botonVariantes({ variante, ancho }), className);
  const contenido = (
    <Contenido variante={variante} sinChevron={sinChevron}>
      {children}
    </Contenido>
  );
  if (to === undefined) {
    return (
      <a href={href} className={clases} {...props}>
        {contenido}
      </a>
    );
  }
  return (
    <Link to={to} className={clases} {...props}>
      {contenido}
    </Link>
  );
}
