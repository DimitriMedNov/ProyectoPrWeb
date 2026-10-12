import { useMemo, useReducer, useState } from "react";
import {
  alternarComplemento,
  calcularTotal,
  cambiarMeseras,
  estadoComplementos,
  estadoMeseras,
  fechaMinima,
  valoresIniciales,
} from "@/domain/catering";
import type {
  CampoDeTexto,
  ErroresPorCampo,
  EstadoComplementos,
  EstadoMeseras,
  TotalEstimado,
  ValoresFormulario,
} from "@/domain/catering";

interface Estado {
  valores: ValoresFormulario;
  errores: ErroresPorCampo;
}

type Accion =
  | { tipo: "cambiar"; campo: CampoDeTexto; valor: string }
  | { tipo: "paso-meseras"; paso: number }
  | { tipo: "alternar-complemento"; valor: string }
  | { tipo: "poner-errores"; errores: ErroresPorCampo }
  | { tipo: "reiniciar" };

const estadoInicial = (): Estado => ({ valores: valoresIniciales(), errores: {} });

/** Quita el error de un campo cuando la persona lo vuelve a tocar. */
function sinError(errores: ErroresPorCampo, campo: keyof ValoresFormulario): ErroresPorCampo {
  if (campo === "sitio_web" || !(campo in errores)) return errores;
  const resto = { ...errores };
  delete resto[campo];
  return resto;
}

function reducir(estado: Estado, accion: Accion): Estado {
  switch (accion.tipo) {
    case "cambiar":
      return {
        valores: { ...estado.valores, [accion.campo]: accion.valor },
        errores: sinError(estado.errores, accion.campo),
      };
    case "paso-meseras":
      return {
        valores: { ...estado.valores, meseras: cambiarMeseras(estado.valores.meseras, accion.paso) },
        errores: sinError(estado.errores, "meseras"),
      };
    case "alternar-complemento":
      return {
        valores: { ...estado.valores, complementos: alternarComplemento(estado.valores.complementos, accion.valor) },
        errores: sinError(estado.errores, "complementos"),
      };
    case "poner-errores":
      return { ...estado, errores: accion.errores };
    case "reiniciar":
      return estadoInicial();
  }
}

export interface FormularioCatering {
  valores: ValoresFormulario;
  /** Error por campo (vacío si no hay). */
  errores: ErroresPorCampo;
  /** Total estimado en vivo: importe, texto ("$1,280" o "—") y detalle. */
  total: TotalEstimado;
  /** Mínimo, máximo, si cada botón está activo y aviso "N meseras". */
  meseras: EstadoMeseras;
  /** Máximo, casillas bloqueadas y texto de ayuda. */
  complementos: EstadoComplementos;
  /** `min` del campo de fecha: hoy, fecha local. */
  fechaMinima: string;
  cambiar: (campo: CampoDeTexto, valor: string) => void;
  elegirPaquete: (nombre: string) => void;
  /** −1 quita una mesera, 1 añade una. En el extremo no hace nada. */
  cambiarMeseras: (paso: -1 | 1) => void;
  alternarComplemento: (valor: string) => void;
  ponerErrores: (errores: ErroresPorCampo) => void;
  /** Vuelve al formulario recién abierto: Buffet, 3 meseras, sin complementos, sin errores. */
  reiniciar: () => void;
}

/** Estado del formulario de catering. Las reglas viven en `@/domain/catering`. */
export function useFormularioCatering(): FormularioCatering {
  const [estado, despachar] = useReducer(reducir, undefined, estadoInicial);
  const [minimo] = useState(() => fechaMinima(new Date()));

  const acciones = useMemo(
    () => ({
      cambiar: (campo: CampoDeTexto, valor: string) => despachar({ tipo: "cambiar", campo, valor }),
      elegirPaquete: (nombre: string) => despachar({ tipo: "cambiar", campo: "catering", valor: nombre }),
      cambiarMeseras: (paso: -1 | 1) => despachar({ tipo: "paso-meseras", paso }),
      alternarComplemento: (valor: string) => despachar({ tipo: "alternar-complemento", valor }),
      ponerErrores: (errores: ErroresPorCampo) => despachar({ tipo: "poner-errores", errores }),
      reiniciar: () => despachar({ tipo: "reiniciar" }),
    }),
    [],
  );

  const { valores, errores } = estado;
  return {
    valores,
    errores,
    total: calcularTotal(valores.catering, valores.invitados),
    meseras: estadoMeseras(valores.meseras),
    complementos: estadoComplementos(valores.complementos),
    fechaMinima: minimo,
    ...acciones,
  };
}
