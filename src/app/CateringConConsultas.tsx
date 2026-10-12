/**
 * Ruta `/catering` con su proveedor de react-query. Es la única pantalla con
 * estado de servidor (el envío de la solicitud), así que la librería viaja en el
 * trozo de esta ruta y no en el que cargan todas las páginas.
 * Otra pantalla que necesite react-query se envuelve igual, con este mismo cliente.
 */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Catering from "@/pages/Catering";

/** Un solo cliente para toda la vida de la app (no se crea en cada render). */
const queryClient = new QueryClient();

export default function CateringConConsultas() {
  return (
    <QueryClientProvider client={queryClient}>
      <Catering />
    </QueryClientProvider>
  );
}
