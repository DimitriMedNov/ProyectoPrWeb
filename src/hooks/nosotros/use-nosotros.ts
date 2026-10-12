import { NOSOTROS } from "@/domain/nosotros";
import type { ContenidoNosotros } from "@/domain/nosotros";

/**
 * Contenidos de la pantalla Nosotros: historia, mascota y galería.
 * Son datos fijos del dominio (no hay petición), así que no hay estados de
 * carga, vacío ni error: siempre devuelve el mismo objeto.
 */
export function useNosotros(): ContenidoNosotros {
  return NOSOTROS;
}
