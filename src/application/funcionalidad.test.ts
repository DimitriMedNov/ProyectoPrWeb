import { describe, expect, it } from "vitest";
import { ok } from "../domain/result";
import { createContainer, defineFeature, registerFeature } from "./funcionalidad";
import type { Dependencies } from "./puertos";

const deps: Dependencies = {
  http: { postJson: async () => ok({ status: 200, ok: true, body: {} }) },
  preferences: { read: () => null, write: () => undefined, remove: () => undefined },
};

describe("contenedor de funcionalidades", () => {
  const SALUDO = defineFeature<{ saludar: () => string }>("saludo");

  it("entrega los casos de uso construidos con los adaptadores", () => {
    const container = createContainer(deps, [registerFeature(SALUDO, () => ({ saludar: () => "hola" }))]);
    expect(container.useCases(SALUDO).saludar()).toBe("hola");
    expect(container.deps).toBe(deps);
  });

  it("falla con un mensaje claro si la funcionalidad no está registrada", () => {
    expect(() => createContainer(deps, []).useCases(SALUDO)).toThrow(/sin registrar: saludo/);
  });

  it("no admite dos funcionalidades con el mismo nombre", () => {
    const m = registerFeature(SALUDO, () => ({ saludar: () => "hola" }));
    expect(() => createContainer(deps, [m, m])).toThrow(/dos veces/);
  });
});
