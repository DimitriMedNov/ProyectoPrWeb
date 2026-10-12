/**
 * Datos del sitio usados al compilar (SEO, sitemap). Los textos compartidos con
 * la interfaz viven en src/domain/sitio.ts: aquí solo se reexportan, y se añade
 * lo que depende del entorno de Node.
 */
export { ADDRESS, DISCLAIMER, HOURS, NOT_FOUND, PAGES } from "../src/domain/sitio";

/** URL pública del sitio. Se puede cambiar con la variable de entorno SITE_URL. */
export const SITE_URL = (process.env.SITE_URL ?? "https://taquito.vercel.app").replace(/\/$/, "");
