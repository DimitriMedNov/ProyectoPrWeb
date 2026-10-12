/**
 * Registro de funcionalidades: cada pantalla declara aquí (en su carpeta
 * `src/application/<pantalla>/`) la clave de sus casos de uso, y el composition
 * root los monta. Así una pantalla nueva no edita archivos de otra.
 */
import type { Dependencies } from "./puertos";

/** Clave tipada de los casos de uso de una funcionalidad. */
export interface Feature<T> {
  readonly name: string;
  /** Solo para que TypeScript recuerde el tipo; nunca tiene valor. */
  readonly __type?: T;
}

export const defineFeature = <T>(name: string): Feature<T> => ({ name });

/** Cómo se construyen los casos de uso de una funcionalidad con los adaptadores. */
export interface FeatureModule<T> {
  feature: Feature<T>;
  create: (deps: Dependencies) => T;
}

export const registerFeature = <T>(feature: Feature<T>, create: (deps: Dependencies) => T): FeatureModule<T> => ({
  feature,
  create,
});

/** Lo que reparte el proveedor: adaptadores genéricos + casos de uso por funcionalidad. */
export interface Container {
  deps: Dependencies;
  useCases<T>(feature: Feature<T>): T;
}

export function createContainer(deps: Dependencies, modules: readonly FeatureModule<unknown>[]): Container {
  const built = new Map<string, unknown>();
  for (const m of modules) {
    if (built.has(m.feature.name)) throw new Error(`Funcionalidad registrada dos veces: ${m.feature.name}`);
    built.set(m.feature.name, m.create(deps));
  }
  return {
    deps,
    useCases<T>(feature: Feature<T>): T {
      if (!built.has(feature.name)) {
        throw new Error(
          `Funcionalidad sin registrar: ${feature.name}. Falta src/app/funcionalidades/${feature.name}.ts`,
        );
      }
      return built.get(feature.name) as T;
    },
  };
}
