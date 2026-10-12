/**
 * Las páginas de la app, cada una en su propio trozo de JavaScript.
 * Página nueva: (1) su entrada en PAGES de src/domain/sitio.ts, (2) su HTML en
 * la raíz + entrada en vite.config.ts, (3) una línea en PAGINAS aquí y (4) si
 * tiene imagen en el primer pantallazo, su entrada en ROUTE_IMAGES de build/html.ts.
 */
import { lazy, type ComponentType } from "react";
import { matchPath } from "react-router-dom";
// Las piezas que comparten varias páginas (imagen, tarjeta, precio, entradas en
// cascada…) viajan en el trozo principal: estas dos líneas las atan a él y
// `sharedInMain` (build/html.ts) impide que el empaquetador las descarte. Sin
// ellas salen cinco archivos de menos de 2 kB, cada uno con su petición.
import "@/components/shared";
import "@/components/shared/movimiento";

type Cargador = () => Promise<{ default: ComponentType }>;

export interface PaginaDeRuta {
  /** Patrón de React Router (`*` = cualquier otra ruta). */
  path: string;
  Pagina: ComponentType;
  /** Baja el código de la página. Solo se llama al arrancar, antes del primer render. */
  precargar: () => Promise<void>;
}

/**
 * Una página diferida. Al navegar dentro de la app se carga con `lazy()` (y se ve
 * el esqueleto de <Suspense> mientras baja). La página con la que se abrió el
 * sitio se precarga antes de montar React: se pinta directamente, sin esqueleto.
 */
function pagina(path: string, cargar: Cargador): PaginaDeRuta {
  const Diferida = lazy(cargar);
  let Precargada: ComponentType | null = null;
  return {
    path,
    Pagina: function Pagina() {
      return Precargada ? <Precargada /> : <Diferida />;
    },
    precargar: async () => {
      Precargada = (await cargar()).default;
    },
  };
}

/** En el orden en que se comprueban: la de `*` va al final. */
export const PAGINAS: readonly PaginaDeRuta[] = [
  pagina("/", () => import("@/pages/Inicio")),
  pagina("/menu", () => import("@/pages/Carta")),
  pagina("/catering", () => import("./CateringConConsultas")),
  pagina("/about", () => import("@/pages/Nosotros")),
  pagina("*", () => import("@/pages/NoEncontrada")),
];

/**
 * Baja la página que corresponde a `pathname` (la misma que elegirá <Routes>).
 * La llama `src/main.tsx` una sola vez, antes de montar la app.
 */
export function precargarPagina(pathname: string): Promise<void> {
  const ruta = PAGINAS.find(({ path }) => matchPath({ path, end: true }, pathname));
  return ruta ? ruta.precargar() : Promise.resolve();
}
