import { createContext } from "react";
import type { Container } from "@/application/funcionalidad";

/** Contexto del contenedor. Se lee con los hooks de `@/hooks/use-dependencias`. */
export const ContainerContext = createContext<Container | null>(null);
