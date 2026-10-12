import type { ReactNode } from "react";
import type { Container } from "@/application/funcionalidad";
import { ContainerContext } from "./contexto-dependencias";

export interface ProveedorDependenciasProps {
  /** Contenedor ya montado (en `src/main.tsx`; en tests, uno con adaptadores falsos). */
  container: Container;
  children: ReactNode;
}

/** Reparte el contenedor de dependencias a toda la app. */
export function ProveedorDependencias({ container, children }: ProveedorDependenciasProps) {
  return <ContainerContext value={container}>{children}</ContainerContext>;
}
