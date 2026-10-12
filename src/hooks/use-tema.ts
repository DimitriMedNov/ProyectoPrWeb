import { useCallback, useEffect, useSyncExternalStore } from "react";
import type { PreferenceStore } from "@/application/puertos";
import { useDependencias } from "@/hooks/use-dependencias";

/** Lo que elige la persona. `system` = seguir al sistema operativo. */
export type Tema = "light" | "dark" | "system";
/** Lo que se ve de verdad en pantalla. */
export type TemaResuelto = "light" | "dark";

/**
 * Clave de la preferencia guardada. Vale "light" o "dark"; si no existe, se
 * sigue al sistema. El script en línea del <head> de los 5 HTML lee la MISMA
 * clave: si se cambia aquí, se cambia allí.
 */
export const CLAVE_TEMA = "tema";

/**
 * A qué cambia el interruptor: sistema → el contrario de lo que se ve → el otro
 * → sistema. Así los dos primeros clics siempre cambian la pantalla.
 */
export function siguienteTema(tema: Tema, sistema: TemaResuelto): Tema {
  const contrario: TemaResuelto = sistema === "dark" ? "light" : "dark";
  if (tema === "system") return contrario;
  return tema === contrario ? sistema : "system";
}

const CONSULTA_OSCURO = "(prefers-color-scheme: dark)";

const oyentes = new Set<() => void>();
/** Elección de esta visita cuando el navegador no deja guardar nada. */
let enMemoria: Tema | null = null;

const leerGuardado = (preferences: PreferenceStore): Tema => {
  const valor = preferences.read(CLAVE_TEMA);
  return valor === "light" || valor === "dark" ? valor : "system";
};

function suscribir(avisar: () => void): () => void {
  const consulta = window.matchMedia(CONSULTA_OSCURO);
  // Otra pestaña cambió la preferencia: manda lo guardado, no lo de esta visita.
  const alGuardarFuera = (evento: StorageEvent) => {
    if (evento.key !== null && evento.key !== CLAVE_TEMA) return;
    enMemoria = null;
    avisar();
  };
  oyentes.add(avisar);
  consulta.addEventListener("change", avisar);
  window.addEventListener("storage", alGuardarFuera);
  return () => {
    oyentes.delete(avisar);
    consulta.removeEventListener("change", avisar);
    window.removeEventListener("storage", alGuardarFuera);
  };
}

const sistemaOscuro = (): boolean => window.matchMedia(CONSULTA_OSCURO).matches;

/** Pone la clase `dark` en <html> y avisa al navegador (controles nativos, barra del móvil). */
function aplicar(resuelto: TemaResuelto): void {
  const raiz = document.documentElement;
  raiz.classList.toggle("dark", resuelto === "dark");
  raiz.style.colorScheme = resuelto;
  document.querySelector<HTMLMetaElement>('meta[name="color-scheme"]')?.setAttribute("content", resuelto);
  // El color de la barra del navegador es el fondo de página del tema ya aplicado.
  const fondo = getComputedStyle(raiz).getPropertyValue("--void").trim();
  if (fondo) {
    document
      .querySelector<HTMLMetaElement>('meta[name="theme-color"]')
      ?.setAttribute("content", `rgb(${fondo.split(/\s+/).join(", ")})`);
  }
}

export interface UseTema {
  /** Preferencia elegida: claro, oscuro o sistema. */
  tema: Tema;
  /** Tema que se ve ahora mismo (con `system` ya resuelto). */
  resuelto: TemaResuelto;
  /** Lo que pide el sistema operativo ahora mismo. */
  sistema: TemaResuelto;
  /** Cambia el tema al instante y guarda la preferencia. */
  setTema: (tema: Tema) => void;
}

/**
 * Mecanismo único de tema del front: clase `dark` en <html> + preferencia
 * guardada con el puerto `PreferenceStore`. Sin preferencia sigue al sistema y
 * reacciona si el sistema cambia. Todas las instancias del hook van sincronizadas.
 */
export function useTema(): UseTema {
  const { preferences } = useDependencias();

  const tema = useSyncExternalStore(suscribir, () => enMemoria ?? leerGuardado(preferences));
  const oscuroDelSistema = useSyncExternalStore(suscribir, sistemaOscuro);
  const sistema: TemaResuelto = oscuroDelSistema ? "dark" : "light";
  const resuelto: TemaResuelto = tema === "system" ? sistema : tema;

  useEffect(() => {
    aplicar(resuelto);
  }, [resuelto]);

  const setTema = useCallback(
    (nuevo: Tema) => {
      if (nuevo === "system") preferences.remove(CLAVE_TEMA);
      else preferences.write(CLAVE_TEMA, nuevo);
      // Si no se pudo guardar (modo privado), la elección vale para esta visita.
      enMemoria = leerGuardado(preferences) === nuevo ? null : nuevo;
      aplicar(nuevo === "system" ? (sistemaOscuro() ? "dark" : "light") : nuevo);
      oyentes.forEach((avisar) => avisar());
    },
    [preferences],
  );

  return { tema, resuelto, sistema, setTema };
}
