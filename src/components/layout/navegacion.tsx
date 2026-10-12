import { NavLink } from "react-router-dom";
import { PAGES } from "@/domain/sitio";
import { cn } from "@/lib/utils";

export interface NavegacionProps {
  /** `barra` = fila de la cabecera en escritorio; `lista` = columna del menú móvil. */
  disposicion: "barra" | "lista";
  /** Nombre de la navegación para lectores de pantalla. */
  etiqueta: string;
  /** Se llama al pulsar cualquier enlace (el menú móvil se cierra). */
  onNavegar?: () => void;
  className?: string;
}

/**
 * Enlaces principales, en el orden de `PAGES`. `NavLink` marca la página actual
 * con `aria-current="page"`; en una ruta desconocida no marca ninguna.
 * En la barra los enlaces van a 12 px: el anillo de foco ocupa 6 px (3 de hueco + 3 de
 * trazo) y así no se monta sobre la píldora roja de la página actual que tenga al lado.
 */
export function Navegacion({ disposicion, etiqueta, onNavegar, className }: NavegacionProps) {
  const barra = disposicion === "barra";
  return (
    <nav aria-label={etiqueta} className={className}>
      <ul className={cn("flex", barra ? "items-center gap-3" : "flex-col")}>
        {PAGES.map((pagina) => (
          <li key={pagina.path}>
            <NavLink
              to={pagina.path}
              end
              onClick={onNavegar}
              className={({ isActive }) =>
                cn(
                  "flex min-h-11 items-center no-underline transition-colors",
                  barra ? "rounded-full px-4 text-meta" : "border-b border-line px-1 py-3 text-title",
                  isActive ? "font-semibold" : "font-medium text-txt hover:text-arc",
                  isActive && (barra ? "bg-fill text-on-fill" : "text-arc"),
                )
              }
            >
              {pagina.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
