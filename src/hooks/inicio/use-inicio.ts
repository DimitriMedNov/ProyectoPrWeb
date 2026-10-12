import { DELIVERY_INICIO, HERO_INICIO, MENU_INICIO, especialidadesDePortada } from "@/domain/inicio";
import type {
  EspecialidadPortada,
  HeroInicio,
  SeccionDeliveryInicio,
  SeccionMenuInicio,
} from "@/domain/inicio";
import { specials } from "@/domain/menu";

export interface ContenidoInicio {
  hero: HeroInicio;
  menu: SeccionMenuInicio & { especialidades: readonly EspecialidadPortada[] };
  delivery: SeccionDeliveryInicio;
}

// Los datos vienen compilados (import estático): se calculan una vez y la referencia es
// estable entre renders. No hay estados de cargando, vacío ni error.
const CONTENIDO: ContenidoInicio = {
  hero: HERO_INICIO,
  menu: { ...MENU_INICIO, especialidades: especialidadesDePortada(specials) },
  delivery: DELIVERY_INICIO,
};

/** Contenido de la portada listo para pintar. */
export function useInicio(): ContenidoInicio {
  return CONTENIDO;
}
