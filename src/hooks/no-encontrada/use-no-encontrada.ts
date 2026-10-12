import { useEffect } from "react";
import { NO_ENCONTRADA, ROBOTS_NO_ENCONTRADA } from "@/domain/no-encontrada";
import type { ContenidoNoEncontrada } from "@/domain/no-encontrada";

/**
 * Contenido de la pantalla de ruta desconocida. Mientras está montada deja
 * `<meta name="robots" content="noindex">` en el `<head>` (404.html ya lo trae;
 * al llegar navegando en cliente no existe y se crea) y lo quita al desmontar,
 * porque las demás rutas sí se indexan.
 */
export function useNoEncontrada(): ContenidoNoEncontrada {
  useEffect(() => {
    let meta = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "robots";
      document.head.append(meta);
    }
    meta.content = ROBOTS_NO_ENCONTRADA;

    const propia = meta;
    return () => propia.remove();
  }, []);

  return NO_ENCONTRADA;
}
