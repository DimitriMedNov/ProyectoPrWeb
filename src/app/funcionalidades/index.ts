/**
 * Índice de funcionalidades. NO se edita: recoge solo cada archivo de esta
 * carpeta. Para registrar una pantalla se crea `src/app/funcionalidades/<pantalla>.ts`
 * con `export default registerFeature(CLAVE, (deps) => ({ ...casos de uso }))`.
 */
import type { FeatureModule } from "@/application/funcionalidad";

const files = import.meta.glob<FeatureModule<unknown>>(["./*.ts", "!./index.ts", "!./*.test.ts"], {
  eager: true,
  import: "default",
});

export const featureModules: readonly FeatureModule<unknown>[] = Object.values(files);
