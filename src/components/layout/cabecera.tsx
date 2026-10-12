import { ThemeTogglerButton } from "@/components/animate-ui/components/buttons/theme-toggler";
import { Contenedor } from "@/components/shared/seccion";
import { useScrollPasado } from "@/hooks/use-scroll-pasado";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { MenuMovilDiferido } from "./menu-movil-diferido";
import { Navegacion } from "./navegacion";

/**
 * Cabecera pegada arriba: logo, navegación de escritorio (≥768 px), interruptor
 * de tema (siempre visible) y botón del menú móvil (<768 px). Al desplazar la
 * página gana borde y sombra: están en una capa aparte que solo cambia de
 * opacidad (animar la sombra directamente obliga a repintar en cada fotograma).
 */
export function Cabecera() {
  const desplazada = useScrollPasado();

  return (
    <header data-cristal className="sticky top-0 z-40 bg-void/85 backdrop-blur-md">
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 border-b border-line shadow-card transition-opacity duration-200",
          desplazada ? "opacity-100" : "opacity-0",
        )}
      />
      <Contenedor className="flex h-header items-center justify-between gap-2">
        <Logo />
        <div className="flex shrink-0 items-center gap-1">
          <Navegacion disposicion="barra" etiqueta="Principal" className="hidden md:block" />
          <ThemeTogglerButton />
          <div className="md:hidden">
            <MenuMovilDiferido />
          </div>
        </div>
      </Contenedor>
    </header>
  );
}
