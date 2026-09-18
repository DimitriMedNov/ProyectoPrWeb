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
