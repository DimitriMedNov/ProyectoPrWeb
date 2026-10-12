import { createContext } from "react";
import { PASO_CASCADA } from "./constantes";

export interface ConfiguracionEscalonado {
  /** Segundos entre un elemento y el siguiente. */
  paso: number;
  /** Segundos antes del primero. */
  retardo: number;
}

export const ContextoEscalonado = createContext<ConfiguracionEscalonado>({ paso: PASO_CASCADA, retardo: 0 });

/** Posición del hijo directo de `Escalonado` dentro del que está cada elemento. */
export const ContextoOrden = createContext(0);
