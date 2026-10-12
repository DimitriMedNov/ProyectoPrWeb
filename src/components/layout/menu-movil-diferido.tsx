import { useEffect, useState, type ComponentType } from "react";
import { Icono } from "@/components/shared/icono";
import type { MenuMovilProps } from "./menu-movil";
import { BOTON_ICONO } from "./menu-movil-estilos";

/**
 * El panel del menú móvil (Sheet de Animate UI sobre Radix Dialog) va en su propio
 * trozo de JavaScript: no hace falta para pintar la cabecera. Se baja solo un
 * momento después de cargar la página, o al pulsar el botón si aún no llegó.
 */
const cargarMenu = () => import("./menu-movil");
/** Margen para no competir con la descarga y el pintado de la propia página. */
const ESPERA_PRECARGA_MS = 2500;

/**
 * Botón del menú móvil. Hasta la primera pulsación es un botón sencillo, igual al
 * disparador real (mismas clases, icono y atributos de un diálogo cerrado). Al
 * pulsarlo se monta el menú completo, ya abierto, y desde ahí todo lo lleva él.
 * Sin `lazy()` + <Suspense>: React retiene 300 ms lo que sale de un fallback, y
 * el panel tiene que abrirse en cuanto se pulsa.
 */
export function MenuMovilDiferido() {
  const [Menu, setMenu] = useState<ComponentType<MenuMovilProps> | null>(null);

  useEffect(() => {
    const espera = window.setTimeout(() => void cargarMenu().catch(() => undefined), ESPERA_PRECARGA_MS);
    return () => window.clearTimeout(espera);
  }, []);

  if (Menu) return <Menu abiertoAlMontar />;

  const abrir = () => {
    // Si la descarga falla (sin red), el botón sigue ahí: otra pulsación lo reintenta.
    void cargarMenu().then(
      (modulo) => setMenu(() => modulo.MenuMovil),
      () => undefined,
    );
  };
  return (
    <button type="button" className={BOTON_ICONO} aria-label="Abrir menú" aria-haspopup="dialog" aria-expanded={false} data-state="closed" onClick={abrir}>
      <Icono nombre="menu" className="size-6" />
    </button>
  );
}
