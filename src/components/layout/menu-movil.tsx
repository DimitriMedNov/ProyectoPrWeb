import { useRef } from "react";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/animate-ui/components/radix/sheet";
import { Icono } from "@/components/shared/icono";
import { HOURS } from "@/domain/sitio";
import { useMenuMovil } from "@/hooks/use-menu-movil";
import { BOTON_ICONO } from "./menu-movil-estilos";
import { Navegacion } from "./navegacion";

/** Entrada del panel: 0,25 s, misma curva que `--ease-spring`. Solo `transform` y `opacity`. */
const TRANSICION_PANEL = { duration: 0.25, ease: [0.32, 0.72, 0, 1] } as const;

export interface MenuMovilProps {
  /** `true` si se monta porque ya pulsaron su botón (ver `menu-movil-diferido.tsx`): nace abierto. */
  abiertoAlMontar?: boolean;
}

/**
 * Menú de navegación para móvil (<768 px): botón en la cabecera + panel lateral
 * (Sheet de Animate UI sobre Radix Dialog). Radix cierra con Escape y al pulsar
 * fuera, atrapa el foco y lo devuelve al botón; el hook cierra al navegar.
 */
export function MenuMovil({ abiertoAlMontar = false }: MenuMovilProps) {
  const { abierto, cambiar, cerrar } = useMenuMovil(abiertoAlMontar);
  // Al cerrar, Radix devuelve el foco al botón. Si se cerró por pulsar un enlace,
  // el foco tiene que quedarse en el <main> de la página nueva.
  const porEnlace = useRef(false);
  const alNavegar = () => {
    porEnlace.current = true;
    cerrar();
  };
  const alDevolverFoco = (evento: Event) => {
    if (!porEnlace.current) return;
    porEnlace.current = false;
    const main = document.getElementById("main");
    if (!main?.hasAttribute("tabindex")) return;
    evento.preventDefault();
    main.focus({ preventScroll: true });
  };

  return (
    <Sheet open={abierto} onOpenChange={cambiar}>
      <SheetTrigger className={BOTON_ICONO} aria-label={abierto ? "Cerrar menú" : "Abrir menú"}>
        <Icono nombre={abierto ? "close" : "menu"} className="size-6" />
      </SheetTrigger>
      <SheetContent
        side="right"
        showCloseButton={false}
        aria-describedby={undefined}
        onCloseAutoFocus={alDevolverFoco}
        transition={TRANSICION_PANEL}
        className="w-4/5 max-w-xs gap-0 border-line bg-void text-txt shadow-overlay"
      >
        <SheetHeader className="flex-row items-center justify-between gap-2 border-b border-line py-2 pr-2 pl-5">
          <SheetTitle className="text-body font-semibold text-txt">Menú</SheetTitle>
          <SheetClose className={BOTON_ICONO} aria-label="Cerrar menú">
            <Icono nombre="close" className="size-6" />
          </SheetClose>
        </SheetHeader>
        <Navegacion disposicion="lista" etiqueta="Principal" onNavegar={alNavegar} className="px-4 pt-2" />
        <p className="mt-auto px-5 py-6 text-label text-mut">{HOURS}</p>
      </SheetContent>
    </Sheet>
  );
}
