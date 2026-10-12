import type { ComponentProps, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export interface ContenedorProps extends ComponentProps<"div"> {
  /** `texto` estrecha a ancho de lectura. */
  ancho?: "pagina" | "texto";
}

/** Centra el contenido con el margen lateral del sitio (16 px a 320, 40 px en escritorio). */
export function Contenedor({ ancho = "pagina", className, ...props }: ContenedorProps) {
  return <div className={cn("mx-auto w-full px-gutter", ancho === "pagina" ? "max-w-page" : "max-w-copy", className)} {...props} />;
}

const seccionVariantes = cva("w-full", {
  variants: {
    fondo: {
      ninguno: "",
      deep: "bg-deep",
      panel: "bg-panel",
      ink: "surface-ink",
    },
    aire: {
      normal: "py-section",
      compacto: "py-section-sm",
      ninguno: "",
    },
  },
  defaultVariants: { fondo: "ninguno", aire: "normal" },
});

export interface SeccionProps extends ComponentProps<"section">, VariantProps<typeof seccionVariantes> {
  /** Ancho del contenedor interior. */
  ancho?: ContenedorProps["ancho"];
  /** Clases del contenedor interior (rejilla, columnas…). */
  claseContenedor?: string;
}

/** Banda de página: `<section>` a todo el ancho + contenedor centrado dentro. */
export function Seccion({ fondo, aire, ancho, claseContenedor, className, children, ...props }: SeccionProps) {
  return (
    <section className={cn(seccionVariantes({ fondo, aire }), className)} {...props}>
      <Contenedor ancho={ancho} className={claseContenedor}>
        {children}
      </Contenedor>
    </section>
  );
}

const antetituloVariantes = cva("block text-body font-semibold", {
  variants: {
    acento: {
      arc: "text-arc",
      maiz: "text-acc-maiz",
      cilantro: "text-acc-cilantro",
      jamaica: "text-acc-jamaica",
      mut: "text-mut",
    },
  },
  defaultVariants: { acento: "arc" },
});

export interface CabeceraSeccionProps extends VariantProps<typeof antetituloVariantes> {
  /** Línea pequeña de color encima del título. */
  antetitulo?: string;
  titulo: ReactNode;
  /** Párrafo de apoyo debajo del título. */
  texto?: ReactNode;
  /** Nivel del encabezado: 1 solo una vez por página. */
  nivel?: 1 | 2 | 3;
  /** `id` del encabezado, para `aria-labelledby` de la sección. */
  idTitulo?: string;
  alineacion?: "centro" | "inicio";
  className?: string;
  /** Lo que vaya debajo (enlace, botones). */
  children?: ReactNode;
}

/** Cabecera de sección: antetítulo, título y texto. */
export function CabeceraSeccion({ antetitulo, titulo, texto, acento, nivel = 2, idTitulo, alineacion = "centro", className, children }: CabeceraSeccionProps) {
  const Titulo = `h${nivel}` as const;
  const centrado = alineacion === "centro";
  return (
    <header className={cn("flex flex-col gap-2", centrado ? "items-center text-center" : "items-start text-left", className)}>
      {antetitulo ? <p className={antetituloVariantes({ acento })}>{antetitulo}</p> : null}
      <Titulo id={idTitulo} className={cn("font-semibold text-txt", nivel === 1 ? "text-hero" : "text-headline md:text-display")}>
        {titulo}
      </Titulo>
      {texto ? <p className="max-w-copy text-body text-mut">{texto}</p> : null}
      {children}
    </header>
  );
}
