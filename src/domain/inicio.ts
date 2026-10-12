// Contenidos de la portada (ruta "/") y regla de qué especialidades se muestran en ella.
// Textos, destinos e imágenes son los mismos de la interfaz anterior (index.html y
// specialsHome de build/html.ts). Aquí no hay React ni clases de estilo.
import { money } from "./menu";
import type { Special } from "./menu";

/** Enlace interno: `destino` es una ruta propia del sitio (se pinta con `<Link>`). */
export interface EnlaceInicio {
  texto: string;
  destino: string;
}

export interface ImagenInicio {
  src: string;
  /** Versiones del mismo archivo en otros anchos (`srcset`), si las hay. */
  srcSet?: string;
  alt: string;
  width: number;
  height: number;
  /** "eager" si está en el primer pantallazo; "lazy" en el resto. */
  carga: "eager" | "lazy";
}

/** Tarjeta de especialidad lista para pintar. */
export interface EspecialidadPortada {
  /** Nombre del platillo; es único y sirve de `key`. */
  nombre: string;
  descripcion: string;
  /** Precio ya formateado, p. ej. "$2.35". */
  precio: string;
  imagen: ImagenInicio;
  /** La foto es más ancha que alta: la interfaz le da una caja más ancha. */
  apaisada: boolean;
  accion: EnlaceInicio;
}

export interface HeroInicio {
  ancla: string;
  antetitulo: string;
  titulo: string;
  subtitulo: string;
  parrafo: string;
  accionPrincipal: EnlaceInicio;
  accionSecundaria: EnlaceInicio;
  /** Informativos, no clicables. */
  chips: readonly string[];
  imagen: ImagenInicio;
}

export interface SeccionMenuInicio {
  ancla: string;
  antetitulo: string;
  titulo: string;
  enlace: EnlaceInicio;
}

export interface SeccionDeliveryInicio {
  ancla: string;
  antetitulo: string;
  titulo: string;
  /** Imagen única con los logotipos; no hay enlaces a ninguna app. */
  imagen: ImagenInicio;
  subtitulo: string;
  parrafo: string;
}

const RUTA_CARTA = "/menu";
const RUTA_CATERING = "/catering";

export const HERO_INICIO: HeroInicio = {
  ancla: "home",
  antetitulo: "Bienvenido a",
  titulo: "El Taquito Gordo Feliz",
  subtitulo: "Tu próximo taco está a un clic de distancia",
  parrafo: "Tacos auténticos en el centro de la ciudad. Pide en línea o por apps de delivery.",
  accionPrincipal: { texto: "Pedir ahora", destino: RUTA_CATERING },
  accionSecundaria: { texto: "Ver el menú", destino: RUTA_CARTA },
  chips: ["Catering para eventos", "Opciones vegetarianas y veganas", "Delivery por apps"],
  imagen: {
    src: "/img/mascota-surf.webp",
    srcSet: "/img/mascota-surf-720.webp 720w, /img/mascota-surf.webp 955w",
    alt: "Mascota de El Taquito Gordo Feliz surfeando",
    width: 955,
    height: 879,
    carga: "eager",
  },
};

export const MENU_INICIO: SeccionMenuInicio = {
  ancla: "menu",
  antetitulo: "Pide ahora",
  titulo: "Nuestro menú",
  enlace: { texto: "Ver el menú completo", destino: RUTA_CARTA },
};

export const DELIVERY_INICIO: SeccionDeliveryInicio = {
  ancla: "delivery",
  antetitulo: "Recíbelo en casa",
  titulo: "Pide por apps de delivery",
  imagen: {
    src: "/img/delivery-apps.webp",
    alt: "Logotipos de apps de delivery: ChowNow, Uber Eats, Instacart, Grubhub, Gopuff, Postmates y DoorDash, entre otras",
    width: 1281,
    height: 661,
    carga: "lazy",
  },
  subtitulo: "Disfruta tu comida sin salir de casa",
  parrafo:
    "Pedir tacos de El Taquito Gordo Feliz por apps de delivery es una gran opción: ofrecemos tacos auténticos y deliciosos hechos con ingredientes de calidad. Disfruta nuestra comida desde tu hogar con un servicio cómodo y confiable, sigue tu pedido en tiempo real y recíbelo siempre fresco y caliente.",
};

/**
 * Especialidades que se muestran en la portada: todas las del catálogo, en el orden del
 * catálogo (la misma regla que `specialsHome` de la interfaz anterior), cada una con su
 * precio a dos decimales y el botón "Pedir ahora" hacia Catering.
 */
export function especialidadesDePortada(catalogo: readonly Special[]): EspecialidadPortada[] {
  return catalogo.map((s) => ({
    nombre: s.name,
    descripcion: s.description,
    precio: money(s.price),
    imagen: { ...s.image, carga: "lazy" },
    apaisada: s.image.width > s.image.height,
    accion: { texto: "Pedir ahora", destino: RUTA_CATERING },
  }));
}
