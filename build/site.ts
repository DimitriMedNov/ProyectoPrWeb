/** Datos del sitio usados al compilar (SEO, sitemap, datos estructurados). */

/** URL pública del sitio. Se puede cambiar con la variable de entorno SITE_URL. */
export const SITE_URL = (process.env.SITE_URL ?? "https://taquito.vercel.app").replace(/\/$/, "");

/** Páginas indexables, con la ruta que sirve Vercel (cleanUrls: sin .html). */
export const PAGES = [
  { file: "index", path: "/" },
  { file: "menu", path: "/menu" },
  { file: "catering", path: "/catering" },
  { file: "about", path: "/about" },
] as const;

export const ADDRESS = "Avn. San Ramón Norte I, Montes de Ame, Santa Gertrudis Copo y Montebello";

/** Horario de ejemplo (la taquería es ficticia). */
export const HOURS = "Abierto todos los días, de 12:00 a 22:00";

/**
 * Aviso en el pie de todas las páginas: es un proyecto universitario sin fines
 * comerciales, para que nadie tome la taquería por un negocio real.
 */
export const DISCLAIMER =
  "Proyecto universitario sin fines comerciales: la taquería, el menú y los precios son ficticios.";
