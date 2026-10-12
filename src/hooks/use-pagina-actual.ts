import { useLocation } from "react-router-dom";
import { pageForPath, type Page } from "@/domain/sitio";

/** Página indexable de la ruta en curso; `undefined` en una ruta desconocida (404). */
export function usePaginaActual(): Page | undefined {
  const { pathname } = useLocation();
  return pageForPath(pathname);
}
