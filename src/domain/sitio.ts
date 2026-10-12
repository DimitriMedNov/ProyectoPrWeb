/**
 * Datos del sitio que comparten la interfaz (React) y el build (SEO, sitemap):
 * una sola fuente para nombre, páginas, dirección, horario y aviso.
 * Reglas puras: sin React, sin `process`, sin librerías.
 */

export const SITE_NAME = "El Taquito Gordo Feliz";

export const ADDRESS = "Avn. San Ramón Norte I, Montes de Ame, Santa Gertrudis Copo y Montebello";

/** Horario de ejemplo (la taquería es ficticia). */
export const HOURS = "Abierto todos los días, de 12:00 a 22:00";

/**
 * Aviso en el pie de todas las páginas: es un proyecto universitario sin fines
 * comerciales, para que nadie tome la taquería por un negocio real.
 */
export const DISCLAIMER =
  "Proyecto universitario sin fines comerciales: la taquería, el menú y los precios son ficticios.";

/** Autoría que acompaña al año en el pie: "© <año> " + CREDITS. */
export const CREDITS = "Carpool Venom · D'mitri Medina Novelo & William Moran Ramírez.";

export interface Page {
  /** Nombre del HTML en la raíz, sin extensión. */
  file: string;
  /** Ruta que sirve Vercel (cleanUrls: sin .html) y que declara el router. */
  path: string;
  /** Texto del enlace en la navegación. */
  label: string;
  /** Mismo texto que el `<title>` de su HTML. */
  title: string;
  /** Mismo texto que la `<meta name="description">` de su HTML. */
  description: string;
}

/** Páginas indexables, en el orden de la navegación. */
export const PAGES = [
  {
    file: "index",
    path: "/",
    label: "Inicio",
    title: "El Taquito Gordo Feliz — Taquería",
    description:
      "El Taquito Gordo Feliz: taquería con los tacos más auténticos del centro de la ciudad. Pide en línea o por apps de delivery.",
  },
  {
    file: "menu",
    path: "/menu",
    label: "Menú",
    title: "Menú — El Taquito Gordo Feliz",
    description:
      "Menú de El Taquito Gordo Feliz: especialidades de la casa, tacos, bebidas y opciones vegetarianas y veganas.",
  },
  {
    file: "catering",
    path: "/catering",
    label: "Catering",
    title: "Catering — El Taquito Gordo Feliz",
    description:
      "Servicio de catering de El Taquito Gordo Feliz: buffet, comida formal y cenas temáticas para tu evento.",
  },
  {
    file: "about",
    path: "/about",
    label: "Nosotros",
    title: "Nosotros — El Taquito Gordo Feliz",
    description: "La historia de El Taquito Gordo Feliz, una taquería de tacos auténticos.",
  },
] as const satisfies readonly Page[];

/** Página de ruta desconocida (404.html): sin descripción y sin indexar. */
export const NOT_FOUND = {
  file: "404",
  title: "Página no encontrada — El Taquito Gordo Feliz",
} as const;

/** Quita la barra final ("/menu/" → "/menu"); la raíz se queda en "/". */
export const normalizePath = (pathname: string): string =>
  pathname.length > 1 ? pathname.replace(/\/+$/, "") || "/" : "/";

/** La página indexable que corresponde a una ruta, o `undefined` si no existe. */
export const pageForPath = (pathname: string): Page | undefined => {
  const path = normalizePath(pathname);
  return PAGES.find((p) => p.path === path);
};
