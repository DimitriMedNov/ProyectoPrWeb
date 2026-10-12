/**
 * Reglas puras del formulario de catering: valores, total estimado, contador
 * de meseras, límite de complementos, fecha mínima y serie para la gráfica.
 * Los datos (paquetes, mínimos, máximos) salen de `menu.ts`; la validación de
 * la solicitud, de `solicitud.ts`.
 */
import { cateringPackages, cateringRules, money } from "./menu";
import type { CateringPackage } from "./menu";
import { validarSolicitud } from "./solicitud";
import type { Solicitud } from "./solicitud";

/** Campo de la solicitud que puede llevar un error. */
export type CampoSolicitud = keyof Solicitud;

/** Nombre del campo trampa antispam: las personas no lo ven; se envía siempre. */
export const CAMPO_TRAMPA = "sitio_web";

/** Todos los campos de la solicitud, en el orden del formulario. */
export const CAMPOS_SOLICITUD = [
  "catering",
  "invitados",
  "fecha",
  "hora",
  "direccion",
  "colonia",
  "cp",
  "meseras",
  "complementos",
  "issue",
  "nombre",
  "apellido",
  "email",
  "telefono",
] as const satisfies readonly CampoSolicitud[];

export type ErroresPorCampo = Partial<Record<CampoSolicitud, string>>;

/** Lo que la persona ha escrito: todo texto, como en los controles del formulario. */
export interface ValoresFormulario {
  catering: string;
  invitados: string;
  fecha: string;
  hora: string;
  direccion: string;
  colonia: string;
  cp: string;
  meseras: string;
  complementos: string[];
  issue: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  /** Campo trampa: debe quedarse vacío. */
  sitio_web: string;
}

/** Campos de texto (todos menos la lista de complementos). */
export type CampoDeTexto = Exclude<keyof ValoresFormulario, "complementos">;

/** Formulario recién abierto o reiniciado: Buffet, 3 meseras, sin complementos. */
export function valoresIniciales(): ValoresFormulario {
  return {
    catering: cateringPackages[0]?.name ?? "",
    invitados: "",
    fecha: "",
    hora: "",
    direccion: "",
    colonia: cateringRules.colonias[0],
    cp: "",
    meseras: String(cateringRules.waitresses.min),
    complementos: [],
    issue: "",
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    sitio_web: "",
  };
}

export const paquetePorNombre = (nombre: string): CateringPackage | undefined =>
  cateringPackages.find((p) => p.name === nombre);

/* ------------------------------ Total estimado ----------------------------- */

/** Texto del total cuando no se puede calcular. */
export const TOTAL_SIN_CALCULAR = "—";

export interface TotalEstimado {
  /** Importe, o `null` si falta el paquete o los invitados no llegan al mínimo. */
  total: number | null;
  /** "$1,280" o "—". */
  texto: string;
  /** "40 invitados × $32" o "$32 por persona · mínimo 20 invitados". */
  detalle: string;
}

/** ¿El texto es un número entero de invitados que llega al mínimo? */
export function invitadosValidos(invitados: string): number | null {
  const n = Number(invitados);
  return Number.isInteger(n) && n >= cateringRules.minGuests ? n : null;
}

/** Total estimado = invitados × precio por persona del paquete elegido. */
export function calcularTotal(paquete: string, invitados: string): TotalEstimado {
  const pkg = paquetePorNombre(paquete);
  if (!pkg) return { total: null, texto: TOTAL_SIN_CALCULAR, detalle: "" };

  const precio = money(pkg.pricePerPerson, 0);
  const n = invitadosValidos(invitados);
  if (n === null) {
    return {
      total: null,
      texto: TOTAL_SIN_CALCULAR,
      detalle: `${precio} por persona · mínimo ${cateringRules.minGuests} invitados`,
    };
  }
  const total = n * pkg.pricePerPerson;
  return { total, texto: money(total, 0), detalle: `${n} invitados × ${precio}` };
}

/* --------------------------------- Meseras --------------------------------- */

export interface EstadoMeseras {
  min: number;
  max: number;
  /** `false` en el mínimo: el botón − queda con `aria-disabled` (no pierde el foco). */
  puedeQuitar: boolean;
  /** `false` en el máximo: el botón + queda con `aria-disabled`. */
  puedeAnadir: boolean;
  /** Aviso para lector de pantalla: "3 meseras". */
  anuncio: string;
}

export function estadoMeseras(valor: string): EstadoMeseras {
  const { min, max } = cateringRules.waitresses;
  const n = Number(valor);
  return { min, max, puedeQuitar: !(n <= min), puedeAnadir: !(n >= max), anuncio: `${valor} meseras` };
}

/** Pulsar − (paso −1) o + (paso 1). En el extremo no cambia nada. */
export function cambiarMeseras(valor: string, paso: number): string {
  const { min, max, puedeQuitar, puedeAnadir } = estadoMeseras(valor);
  if (paso < 0 ? !puedeQuitar : !puedeAnadir) return valor;
  const siguiente = (Number(valor) || min) + paso;
  return String(Math.min(max, Math.max(min, siguiente)));
}

/* ------------------------------- Complementos ------------------------------ */

export interface EstadoComplementos {
  max: number;
  /** Ya se eligió el máximo. */
  lleno: boolean;
  /** Valores de las casillas que quedan deshabilitadas (las no marcadas, al llegar al máximo). */
  bloqueados: string[];
  /** "Elige hasta 2." o "Ya elegiste 2. Quita uno para cambiarlo." */
  ayuda: string;
}

export function estadoComplementos(seleccionados: readonly string[]): EstadoComplementos {
  const max = cateringRules.maxAddons;
  const lleno = seleccionados.length >= max;
  return {
    max,
    lleno,
    bloqueados: lleno
      ? cateringRules.addons.map((a) => a.value as string).filter((v) => !seleccionados.includes(v))
      : [],
    ayuda: lleno ? `Ya elegiste ${max}. Quita uno para cambiarlo.` : `Elige hasta ${max}.`,
  };
}

/** Marca o desmarca un complemento. Una casilla bloqueada no se puede marcar. */
export function alternarComplemento(seleccionados: readonly string[], valor: string): string[] {
  if (seleccionados.includes(valor)) return seleccionados.filter((v) => v !== valor);
  if (estadoComplementos(seleccionados).lleno) return [...seleccionados];
  return [...seleccionados, valor];
}

/* ---------------------------------- Fecha ---------------------------------- */

/** Hoy en AAAA-MM-DD según la fecha local del dispositivo: el `min` del campo de fecha. */
export function fechaMinima(hoy: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${hoy.getFullYear()}-${pad(hoy.getMonth() + 1)}-${pad(hoy.getDate())}`;
}

/* -------------------------- Validación en el cliente ------------------------ */

export type ValidacionFormulario = { ok: true; total: number } | { ok: false; errores: ErroresPorCampo };

/**
 * Valida antes de enviar con las mismas reglas del servidor (`validarSolicitud`)
 * y, como hacía el `min` del campo de fecha, no admite una fecha anterior a hoy
 * según la fecha local del dispositivo.
 */
export function validarFormulario(valores: ValoresFormulario, hoy: Date): ValidacionFormulario {
  const resultado = validarSolicitud(valores, hoy);
  const errores: ErroresPorCampo = resultado.ok ? {} : { ...resultado.errores };
  if (!errores.fecha && valores.fecha.trim() < fechaMinima(hoy)) {
    errores.fecha = "Elige una fecha a partir de hoy.";
  }
  if (resultado.ok && !errores.fecha) return { ok: true, total: resultado.total };
  return { ok: false, errores };
}

/* --------------------------------- Gráfica --------------------------------- */

export interface PuntoSeriePaquetes {
  paquete: string;
  precioPorPersona: number;
  total: number;
  /** Total ya con formato: "$1,280". */
  totalTexto: string;
}

/**
 * Serie para barras: el total de cada paquete con ese número de invitados.
 * Vacía si los invitados no son un entero que llegue al mínimo (no hay nada
 * real que graficar).
 */
export function serieTotalesPorPaquete(invitados: string): PuntoSeriePaquetes[] {
  const n = invitadosValidos(invitados);
  if (n === null) return [];
  return cateringPackages.map((p) => {
    const total = n * p.pricePerPerson;
    return { paquete: p.name, precioPorPersona: p.pricePerPerson, total, totalTexto: money(total, 0) };
  });
}
