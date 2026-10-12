import { CAMPO_TRAMPA } from "@/domain/catering";
import type { FormularioCatering } from "@/hooks/catering/use-formulario-catering";
import { CampoTexto, Paso } from "./campo";
import { idCampo } from "./campos";

export interface PasoContactoProps {
  formulario: FormularioCatering;
}

/** Paso 3: datos de contacto y el campo trampa antispam (oculto a personas y lectores). */
export function PasoContacto({ formulario }: PasoContactoProps) {
  const idTrampa = idCampo(CAMPO_TRAMPA);

  return (
    <Paso numero={3} titulo="Datos de contacto">
      <div className="grid gap-4 sm:grid-cols-2">
        <CampoTexto
          campo="nombre"
          etiqueta="Nombre"
          formulario={formulario}
          type="text"
          required
          maxLength={200}
          placeholder="Tu nombre"
          autoComplete="given-name"
        />
        <CampoTexto
          campo="apellido"
          etiqueta="Apellido"
          formulario={formulario}
          type="text"
          required
          maxLength={200}
          placeholder="Tu apellido"
          autoComplete="family-name"
        />
        <CampoTexto
          campo="email"
          etiqueta="Email"
          formulario={formulario}
          type="email"
          required
          maxLength={200}
          placeholder="tu@correo.com"
          autoComplete="email"
        />
        <CampoTexto
          campo="telefono"
          etiqueta="Teléfono"
          formulario={formulario}
          type="tel"
          required
          maxLength={30}
          placeholder="Tu número de teléfono"
          autoComplete="tel"
        />
      </div>
      <div className="honeypot" aria-hidden="true">
        <label htmlFor={idTrampa}>No llenes este campo</label>
        <input
          id={idTrampa}
          name={CAMPO_TRAMPA}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={formulario.valores.sitio_web}
          onChange={(evento) =>
            formulario.cambiar(CAMPO_TRAMPA, evento.target.value)
          }
        />
      </div>
    </Paso>
  );
}
