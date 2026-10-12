import { use } from "react";
import { ContainerContext } from "@/app/contexto-dependencias";
import type { Container, Feature } from "@/application/funcionalidad";
import type { Dependencies } from "@/application/puertos";

function useContainer(): Container {
  const container = use(ContainerContext);
  if (!container) throw new Error("Falta <ProveedorDependencias> por encima de este componente.");
  return container;
}

/** Adaptadores genéricos (HTTP, preferencias) vistos por su puerto. */
export function useDependencias(): Dependencies {
  return useContainer().deps;
}

/** Casos de uso de una funcionalidad, ya conectados a sus adaptadores. */
export function useCasosDeUso<T>(feature: Feature<T>): T {
  return useContainer().useCases(feature);
}
