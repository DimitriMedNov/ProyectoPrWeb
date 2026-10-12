/**
 * Contenido de la pantalla de ruta desconocida (404): los mismos textos, salidas
 * e imagen que traía `404.html`. Datos puros: sin React y sin librerías.
 */

/** Una salida de la pantalla: a dónde lleva y cómo se presenta. */
export interface SalidaNoEncontrada {
  /** Identificador estable (sirve de `key`). */
  id: "inicio" | "menu";
  /** Texto visible. El chevron "›" del enlace es decorativo y lo dibuja el componente. */
  etiqueta: string;
  /** Ruta interna de destino (para `<Link to>`). */
  destino: string;
  /** "primaria" = botón; "enlace" = enlace con chevron. */
  variante: "primaria" | "enlace";
}

/** Imagen con su tamaño reservado, para que no salte el layout. */
export interface ImagenNoEncontrada {
  src: string;
  width: number;
  height: number;
  /** Vacío: la imagen es decorativa. */
  alt: string;
}

export interface ContenidoNoEncontrada {
  antetitulo: string;
  titulo: string;
  subtitulo: string;
  parrafo: string;
  /** En el orden en que se muestran: primero el botón, después el enlace. */
  salidas: readonly SalidaNoEncontrada[];
  imagen: ImagenNoEncontrada;
}

export const NO_ENCONTRADA = {
  antetitulo: "Error 404",
  titulo: "Esta página se fue por tacos",
  subtitulo: "No encontramos lo que buscabas.",
  parrafo:
    "Puede que el enlace esté mal escrito o que la página ya no exista. Desde aquí puedes volver al inicio o ir directo al menú.",
  salidas: [
    { id: "inicio", etiqueta: "Volver al inicio", destino: "/", variante: "primaria" },
    { id: "menu", etiqueta: "Ver el menú", destino: "/menu", variante: "enlace" },
  ],
  imagen: { src: "/img/fotos/logo-full-500.webp", width: 500, height: 500, alt: "" },
} as const satisfies ContenidoNoEncontrada;

/** Valor de `<meta name="robots">` de esta pantalla: los buscadores no la indexan. */
export const ROBOTS_NO_ENCONTRADA = "noindex";
