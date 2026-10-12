import { CARTA, crearCasosDeUsoCarta } from "@/application/carta";
import { registerFeature } from "@/application/funcionalidad";
import { carta, specials } from "@/domain/menu";

/** La carta sale de los datos estáticos del dominio; no usa adaptadores. */
export default registerFeature(CARTA, () => crearCasosDeUsoCarta({ especialidades: specials, categorias: carta }));
