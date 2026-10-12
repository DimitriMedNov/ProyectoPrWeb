import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { NOT_FOUND, pageForPath } from "@/domain/sitio";

/**
 * Al navegar en cliente, pone el `<title>` y la description de la ruta, con los
 * mismos textos que su HTML. En una ruta desconocida quita la description
 * (404.html no la tiene).
 */
export function useMetadatosDePagina(): void {
  const { pathname } = useLocation();

  useEffect(() => {
    const page = pageForPath(pathname);
    document.title = page?.title ?? NOT_FOUND.title;

    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!page) {
      meta?.remove();
      return;
    }
    if (meta) {
      meta.content = page.description;
      return;
    }
    const created = document.createElement("meta");
    created.name = "description";
    created.content = page.description;
    document.head.append(created);
  }, [pathname]);
}
