import { Textarea } from "@/components/ui/textarea";
import { cateringRules } from "@/domain/menu";
import type { FormularioCatering } from "@/hooks/catering/use-formulario-catering";
import { cn } from "@/lib/utils";
import { Campo, CampoTexto, Paso } from "./campo";
import { claseControlNativo, descritoPor, idCampo } from "./campos";
import { Complementos } from "./complementos";
import { ContadorMeseras } from "./contador-meseras";

export interface PasoEventoProps {
  formulario: FormularioCatering;
}

/** Paso 2: invitados, fecha, hora, lugar, meseras, complementos y comentarios. */
export function PasoEvento({ formulario }: PasoEventoProps) {
  const { valores, errores } = formulario;
  const idColonia = idCampo("colonia");
  const idNotas = idCampo("issue");
  const minimo = cateringRules.minGuests;

  return (
    <Paso numero={2} titulo="Tu evento">
      <div className="grid gap-4 sm:grid-cols-2">
        <CampoTexto
          campo="invitados"
          etiqueta="Invitados"
          ayuda={`Mínimo ${minimo}`}
          formulario={formulario}
          type="number"
          inputMode="numeric"
          min={minimo}
          required
          placeholder={String(minimo)}
        />
        <ContadorMeseras formulario={formulario} />
        <CampoTexto
          campo="fecha"
          etiqueta="Fecha"
          formulario={formulario}
          type="date"
          min={formulario.fechaMinima}
          required
        />
        <CampoTexto
          campo="hora"
          etiqueta="Hora"
          formulario={formulario}
          type="time"
          required
        />
        <CampoTexto
          campo="direccion"
          etiqueta="Dirección del evento"
          formulario={formulario}
          claseCampo="sm:col-span-2"
          type="text"
          required
          maxLength={200}
          placeholder="Calle, número y referencias"
          autoComplete="street-address"
        />
        <Campo id={idColonia} etiqueta="Colonia" error={errores.colonia}>
          <select
            id={idColonia}
            name="colonia"
            data-campo="colonia"
            value={valores.colonia}
            onChange={(evento) =>
              formulario.cambiar("colonia", evento.target.value)
            }
            aria-invalid={errores.colonia ? true : undefined}
            aria-describedby={descritoPor(
              idColonia,
              undefined,
              errores.colonia,
            )}
            className={claseControlNativo}
          >
            {cateringRules.colonias.map((colonia) => (
              <option key={colonia} value={colonia}>
                {colonia}
              </option>
            ))}
          </select>
        </Campo>
        <CampoTexto
          campo="cp"
          etiqueta="Código postal"
          ayuda="5 dígitos"
          formulario={formulario}
          type="text"
          inputMode="numeric"
          pattern="[0-9]{5}"
          maxLength={5}
          required
          placeholder="97000"
          autoComplete="postal-code"
        />
        <Complementos formulario={formulario} className="sm:col-span-2" />
        <Campo
          id={idNotas}
          etiqueta="Comentarios adicionales"
          opcional
          error={errores.issue}
          className="sm:col-span-2"
        >
          <Textarea
            id={idNotas}
            name="issue"
            data-campo="issue"
            rows={3}
            maxLength={1000}
            placeholder="Alergias, temática, peticiones especiales…"
            value={valores.issue}
            onChange={(evento) =>
              formulario.cambiar("issue", evento.target.value)
            }
            aria-invalid={errores.issue ? true : undefined}
            aria-describedby={descritoPor(idNotas, undefined, errores.issue)}
            className={cn("min-h-24 px-3 text-base text-txt md:text-base")}
          />
        </Campo>
      </div>
    </Paso>
  );
}
