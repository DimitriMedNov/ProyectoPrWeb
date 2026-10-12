/**
 * Contenidos de la pantalla Nosotros (`/about`): historia, mascota y galería.
 * Antes estaban escritos en `about.html`; aquí son datos tipados, literales.
 * Reglas puras: sin React ni librerías.
 */
import { SITE_NAME } from "./sitio";

/** Imagen con el tamaño reservado para que no salte el layout. */
export interface Imagen {
  src: string;
  width: number;
  height: number;
  alt: string;
}

/** Foto de la galería: además lleva las versiones para `srcset` y `sizes`. */
export interface FotoGaleria extends Imagen {
  /** Nombre corto y estable de la foto; sirve de `key`. */
  id: string;
  srcSet: string;
  sizes: string;
}

export interface EnlaceInterno {
  label: string;
  /** Ruta interna del router. */
  to: string;
}

/** Datos del negocio que cuenta la historia (taquería ficticia). */
export interface DatosNegocio {
  nombre: string;
  /** Tal como se escribe en el texto: "tres años de operación". */
  aniosDeOperacion: string;
  fundadores: readonly [string, string];
  /** Nombres de pila, como aparecen en el último párrafo. */
  fundadoresDePila: readonly [string, string];
}

export interface Historia {
  antetitulo: string;
  /** Primera línea del H1. */
  tituloLinea1: string;
  /** Arranque de la segunda línea, antes del nombre: "es ". */
  tituloLinea2Prefijo: string;
  /** Nombre de la taquería; se pinta con el degradado de marca. */
  tituloNombre: string;
  parrafos: readonly string[];
  accion: EnlaceInterno;
  /** Logo completo sobre el plato amarillo. Carga inmediata (sin `lazy`). */
  mascota: Imagen;
}

export interface Galeria {
  antetitulo: string;
  titulo: string;
  /** `aria-roledescription` de la región. */
  rolRegion: string;
  /** `aria-roledescription` de cada `figure`. */
  rolDiapositiva: string;
  /** `aria-label` del carril enfocable. */
  etiquetaCarril: string;
  etiquetaAnterior: string;
  etiquetaSiguiente: string;
  fotos: readonly FotoGaleria[];
}

export interface ContenidoNosotros {
  negocio: DatosNegocio;
  historia: Historia;
  galeria: Galeria;
}

export const NEGOCIO: DatosNegocio = {
  nombre: SITE_NAME,
  aniosDeOperacion: "tres",
  fundadores: ["D'mitri Medina Novelo", "William Moran Ramírez"],
  fundadoresDePila: ["D'mitri", "William"],
};

/** `sizes` común a todas las fotos de la galería. */
export const GALERIA_SIZES = "(min-width: 1100px) 1024px, calc(100vw - 3rem)";

const FOTOS = "/img/fotos";

function foto(
  id: string,
  ancho: number,
  alto: number,
  alt: string,
  /** Si existe además la versión de 640 px (la foto que ya mide 640 no la repite). */
  conVersion640 = true,
): FotoGaleria {
  const src = `${FOTOS}/${id}-${ancho}.webp`;
  const srcSet = conVersion640 ? `${FOTOS}/${id}-640.webp 640w, ${src} ${ancho}w` : `${src} ${ancho}w`;
  return { id, src, srcSet, sizes: GALERIA_SIZES, width: ancho, height: alto, alt };
}

export const HISTORIA: Historia = {
  antetitulo: "Nuestra historia",
  tituloLinea1: "No es solo un taco,",
  tituloLinea2Prefijo: "es ",
  tituloNombre: NEGOCIO.nombre,
  parrafos: [
    `${NEGOCIO.nombre} es una taquería con ${NEGOCIO.aniosDeOperacion} años de operación, fundada por ${NEGOCIO.fundadores[0]} y ${NEGOCIO.fundadores[1]}. La historia comenzó cuando ambos se conocieron en la universidad y compartieron su amor por la comida mexicana, notando la falta de opciones auténticas en su zona.`,
    "Tras meses desarrollando el concepto y el menú, encontraron el local perfecto y lo decoraron con un estilo alegre y colorido que refleja la cultura mexicana. El menú abarca desde los clásicos tacos de carne asada y al pastor hasta opciones vegetarianas y veganas, además de bebidas como horchata y agua de jamaica.",
    `Desde su apertura, ha sido un éxito en la comunidad. Los clientes destacan la autenticidad de la comida y el ambiente acogedor. ${NEGOCIO.fundadoresDePila[0]} y ${NEGOCIO.fundadoresDePila[1]} están orgullosos de seguir sirviendo tacos deliciosos y difundiendo la cultura mexicana por muchos años más.`,
  ],
  accion: { label: "Haz tu pedido", to: "/catering" },
  mascota: {
    src: `${FOTOS}/logo-full-500.webp`,
    width: 500,
    height: 500,
    alt: `Mascota de ${NEGOCIO.nombre}`,
  },
};

export const GALERIA: Galeria = {
  antetitulo: "Galería",
  titulo: "Así se ve la taquería",
  rolRegion: "carrusel",
  rolDiapositiva: "diapositiva",
  etiquetaCarril: "Fotos de la taquería. Desliza o usa las flechas para ver más.",
  etiquetaAnterior: "Foto anterior",
  etiquetaSiguiente: "Foto siguiente",
  fotos: [
    foto("fachada", 1280, 853, "Fachada del restaurante"),
    foto("restaurant", 640, 400, "Interior del restaurante", false),
    foto("drinks", 1280, 841, "Bebidas mexicanas"),
    foto("food", 800, 600, "Platillos del menú"),
    foto("people", 760, 610, "Clientes disfrutando"),
    foto("tacos", 1024, 683, "Tacos recién hechos"),
  ],
};

export const NOSOTROS: ContenidoNosotros = {
  negocio: NEGOCIO,
  historia: HISTORIA,
  galeria: GALERIA,
};
