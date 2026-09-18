/**
 * Validación de una solicitud de catering, compartida por el servidor
 * (api/solicitud.ts). Replica las reglas del formulario (required, min, max,
 * pattern) para no aceptar en el servidor nada que el formulario rechace, ni
 * rechazar nada que acepte.
 *
 * Nota: las importaciones relativas llevan ".js" porque en Vercel este archivo
 * se ejecuta como ES module ya transpilado; TypeScript y Vite lo resuelven al .ts.
 */
import { cateringPackages, cateringRules } from "../data/menu.js";

export interface Solicitud {
  catering: string;
  invitados: number;
  fecha: string;
  hora: string;
  direccion: string;
  colonia: string;
  cp: string;
  meseras: number;
  complementos: string[];
  issue: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
}

export type Resultado =
  | { ok: true; solicitud: Solicitud; total: number }
  | { ok: false; errores: Partial<Record<keyof Solicitud, string>> };

const MAX_TEXTO = 200;
const MAX_COMENTARIO = 1000;

const texto = (v: unknown) => (typeof v === "string" ? v.trim() : "");
const entero = (v: unknown) => {
  const n = typeof v === "number" ? v : Number(texto(v));
  return Number.isInteger(n) ? n : NaN;
};

/** Fecha real en formato AAAA-MM-DD (como la envía <input type="date">). */
const esFecha = (s: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().startsWith(s);
};

export function validarSolicitud(input: unknown): Resultado {
  const raw = (typeof input === "object" && input !== null ? input : {}) as Record<string, unknown>;
  const errores: Partial<Record<keyof Solicitud, string>> = {};

  const s: Solicitud = {
    catering: texto(raw.catering),
    invitados: entero(raw.invitados),
    fecha: texto(raw.fecha),
    hora: texto(raw.hora),
    direccion: texto(raw.direccion),
    colonia: texto(raw.colonia),
    cp: texto(raw.cp),
    meseras: entero(raw.meseras),
    complementos: Array.isArray(raw.complementos) ? raw.complementos.map(texto) : [],
    issue: texto(raw.issue),
    nombre: texto(raw.nombre),
    apellido: texto(raw.apellido),
    email: texto(raw.email),
    telefono: texto(raw.telefono),
  };

  const paquete = cateringPackages.find((p) => p.name === s.catering);
  if (!paquete) errores.catering = "Elige un paquete.";

  if (!(s.invitados >= cateringRules.minGuests)) {
    errores.invitados = `Mínimo ${cateringRules.minGuests} invitados.`;
  }
  if (!esFecha(s.fecha)) errores.fecha = "Fecha no válida.";
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(s.hora)) errores.hora = "Hora no válida.";
  if (!s.direccion || s.direccion.length > MAX_TEXTO) errores.direccion = "Escribe la dirección del evento.";
  if (!(cateringRules.colonias as readonly string[]).includes(s.colonia)) errores.colonia = "Elige una colonia.";
  if (!/^[0-9]{5}$/.test(s.cp)) errores.cp = "El código postal lleva 5 dígitos.";

  const { min, max } = cateringRules.waitresses;
  if (!(s.meseras >= min && s.meseras <= max)) errores.meseras = `De ${min} a ${max} meseras.`;

  const validos = cateringRules.addons.map((a) => a.value as string);
  const unicos = new Set(s.complementos);
  if (
    unicos.size !== s.complementos.length ||
    s.complementos.length > cateringRules.maxAddons ||
    s.complementos.some((c) => !validos.includes(c))
  ) {
    errores.complementos = `Elige hasta ${cateringRules.maxAddons} complementos.`;
  }

  if (s.issue.length > MAX_COMENTARIO) errores.issue = `Máximo ${MAX_COMENTARIO} caracteres.`;
  if (!s.nombre || s.nombre.length > MAX_TEXTO) errores.nombre = "Escribe tu nombre.";
  if (!s.apellido || s.apellido.length > MAX_TEXTO) errores.apellido = "Escribe tu apellido.";
  // Misma idea que <input type="email">: algo@algo, sin espacios.
  if (!/^[^\s@]+@[^\s@]+$/.test(s.email) || s.email.length > MAX_TEXTO) errores.email = "Correo no válido.";
  if (!s.telefono || s.telefono.length > 30) errores.telefono = "Escribe tu teléfono.";

  if (Object.keys(errores).length || !paquete) return { ok: false, errores };
  return { ok: true, solicitud: s, total: s.invitados * paquete.pricePerPerson };
}
