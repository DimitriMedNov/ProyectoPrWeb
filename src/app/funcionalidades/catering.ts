/** Registro de Catering: conecta el caso de uso con su adaptador HTTP. */
import { CATERING, crearEnviarSolicitud } from "@/application/catering";
import { registerFeature } from "@/application/funcionalidad";
import { crearSolicitudesHttp } from "@/infrastructure/catering/solicitudes-http";

export default registerFeature(CATERING, (deps) => ({
  enviarSolicitud: crearEnviarSolicitud(crearSolicitudesHttp(deps.http)),
}));
