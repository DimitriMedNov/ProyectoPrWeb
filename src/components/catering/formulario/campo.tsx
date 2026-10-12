import type { ComponentProps, ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CampoDeTexto } from "@/domain/catering";
import type { FormularioCatering } from "@/hooks/catering/use-formulario-catering";
import { cn } from "@/lib/utils";
import { claseControl, descritoPor, idCampo } from "./campos";
import { ErrorCampo } from "./error-campo";

export interface PasoProps {
  numero: number;
  titulo: string;
  children: ReactNode;
}

/** Sección numerada del formulario ("Paso 2: Tu evento"). */
export function Paso({ numero, titulo, children }: PasoProps) {
  return (
    <fieldset className="m-0 min-w-0 border-0 p-0">
      <legend className="mb-4 flex items-center gap-3 p-0 text-title font-semibold text-txt">
        <span
          aria-hidden="true"
          className="grid size-8 shrink-0 place-items-center rounded-full border border-line bg-panel-2 text-label"
        >
          {numero}
        </span>
        <span>
          <span className="sr-only">Paso {numero}: </span>
          {titulo}
        </span>
      </legend>
      {children}
    </fieldset>
  );
}

export interface CampoProps {
  id: string;
  etiqueta: string;
  opcional?: boolean;
  ayuda?: string;
  error?: string;
  className?: string;
  children: ReactNode;
}

/** Etiqueta + control + ayuda + error de un campo. */
export function Campo({
  id,
  etiqueta,
  opcional,
  ayuda,
  error,
  className,
  children,
}: CampoProps) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      <Label htmlFor={id} className="text-txt">
        {etiqueta}
        {opcional ? (
          <span className="font-normal text-mut">(opcional)</span>
        ) : null}
      </Label>
      {children}
      {ayuda ? (
        <p id={`${id}-ayuda`} className="text-caption text-mut">
          {ayuda}
        </p>
      ) : null}
      {error ? <ErrorCampo id={`${id}-error`} mensaje={error} /> : null}
    </div>
  );
}

/** Campos de texto que se validan (todos menos la trampa antispam). */
export type CampoEscrito = Exclude<CampoDeTexto, "sitio_web">;

export interface CampoTextoProps extends Omit<
  ComponentProps<"input">,
  "id" | "name" | "value" | "onChange"
> {
  campo: CampoEscrito;
  etiqueta: string;
  ayuda?: string;
  formulario: FormularioCatering;
  /** Clases del envoltorio (ancho en la rejilla). */
  claseCampo?: string;
}

/** `Input` conectado al formulario: valor, cambio, error y descripciones. */
export function CampoTexto({
  campo,
  etiqueta,
  ayuda,
  formulario,
  claseCampo,
  className,
  ...props
}: CampoTextoProps) {
  const id = idCampo(campo);
  const error = formulario.errores[campo];
  return (
    <Campo
      id={id}
      etiqueta={etiqueta}
      ayuda={ayuda}
      error={error}
      className={claseCampo}
    >
      <Input
        id={id}
        name={campo}
        data-campo={campo}
        value={formulario.valores[campo]}
        onChange={(evento) => formulario.cambiar(campo, evento.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={descritoPor(id, ayuda, error)}
        className={cn(claseControl, className)}
        {...props}
      />
    </Campo>
  );
}
