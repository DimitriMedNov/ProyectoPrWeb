/**
 * Textos de la página de catering (lo que no es dato del dominio). Las cifras
 * (mínimo de invitados, rango de meseras) salen de `cateringRules`.
 */
import { cateringRules } from "@/domain/menu";
import type { Icon } from "@/domain/menu";

export const HERO_CATERING = {
  antetitulo: "Servicio de catering",
  tituloInicio: "Llevamos el sabor de la taquería a ",
  tituloAcento: "tu evento",
  texto:
    "Bodas, cumpleaños, eventos de empresa o reuniones familiares. Elige un paquete, personaliza el menú y nosotros nos encargamos del resto: montaje, servicio y limpieza.",
  botonSolicitar: "Solicitar catering",
  enlacePaquetes: "Ver paquetes",
  foto: {
    src: "/img/fotos/food-800.webp",
    srcSet: "/img/fotos/food-640.webp 640w, /img/fotos/food-720.webp 720w, /img/fotos/food-800.webp 800w",
    alt: "Mesa con platillos de catering",
    width: 800,
    height: 600,
  },
} as const;

export interface Ventaja {
  id: string;
  icono: Icon;
  titulo: string;
  texto: string;
}

const { min: meserasMin, max: meserasMax } = cateringRules.waitresses;

export const VENTAJAS: readonly Ventaja[] = [
  { id: "menus", icono: "utensils", titulo: "Menús personalizados", texto: "Opciones vegetarianas y veganas incluidas." },
  { id: "meseras", icono: "cloche", titulo: "Meseras profesionales", texto: `De ${meserasMin} a ${meserasMax} personas según tu evento.` },
  { id: "montaje", icono: "truck", titulo: "Montaje y limpieza", texto: "Llegamos, montamos y dejamos todo impecable." },
  { id: "cobertura", icono: "pin", titulo: "Cobertura local", texto: "San Ramón, Montes de Ame, Copo y Montebello." },
];

export const PAQUETES_CABECERA = {
  antetitulo: "Elige el tuyo",
  titulo: "Paquetes de catering",
  texto: `Haz clic en un paquete para solicitarlo. Precios por persona, mínimo ${cateringRules.minGuests} invitados.`,
} as const;

export interface Condicion {
  id: string;
  icono: Icon | "user" | "plus";
  termino: string;
  detalle: string;
}

/** Reglas del servicio tal como las aplica el formulario (`cateringRules`). */
export const CONDICIONES: readonly Condicion[] = [
  { id: "invitados", icono: "user", termino: "Invitados", detalle: `Mínimo ${cateringRules.minGuests}.` },
  { id: "meseras", icono: "cloche", termino: "Meseras", detalle: `De ${meserasMin} a ${meserasMax}.` },
  {
    id: "complementos",
    icono: "plus",
    termino: `Complementos (hasta ${cateringRules.maxAddons})`,
    detalle: cateringRules.addons.map((a) => a.label).join(", ") + ".",
  },
  { id: "colonias", icono: "pin", termino: "Colonias", detalle: cateringRules.colonias.join(", ") + "." },
];

export interface Paso {
  numero: number;
  titulo: string;
  texto: string;
}

export const PASOS_CABECERA = { antetitulo: "Sencillo", titulo: "Cómo funciona" } as const;

export const PASOS: readonly Paso[] = [
  { numero: 1, titulo: "Elige un paquete", texto: "Selecciona el que mejor se adapte a tu evento." },
  { numero: 2, titulo: "Llena el formulario", texto: "Cuéntanos fecha, lugar y número de invitados." },
  { numero: 3, titulo: "Nosotros nos encargamos", texto: "Confirmamos y montamos todo el día del evento." },
];
