import { describe, expect, it } from "vitest";
import { valoresIniciales } from "../../domain/catering";
import type { ValoresFormulario } from "../../domain/catering";
import { ok } from "../../domain/result";
import { crearEnviarSolicitud } from "./index";
import type { SolicitudesApi } from "./index";

const HOY = () => new Date(2026, 9, 12, 10, 0, 0);

const completos: ValoresFormulario = {
  ...valoresIniciales(),
  invitados: "40",
  fecha: "2026-11-20",
  hora: "14:30",
  direccion: "Calle 1 #23",
  cp: "97000",
  nombre: "Ana",
  apellido: "Pérez",
  email: "ana@correo.com",
  telefono: "9991234567",
};

function apiFalsa() {
  const recibidos: ValoresFormulario[] = [];
  const api: SolicitudesApi = {
    enviar: async (valores) => {
      recibidos.push(valores);
      return ok({ total: 720 });
    },
  };
  return { api, recibidos };
}

describe("caso de uso: enviar solicitud", () => {
  it("con el formulario válido envía tal cual y devuelve el resultado del puerto", async () => {
    const { api, recibidos } = apiFalsa();
    await expect(crearEnviarSolicitud(api, HOY)(completos)).resolves.toEqual(ok({ total: 720 }));
    expect(recibidos).toEqual([completos]);
  });

  it("con campos inválidos no envía y devuelve los errores por campo", async () => {
    const { api, recibidos } = apiFalsa();
    const r = await crearEnviarSolicitud(api, HOY)({ ...completos, invitados: "3", telefono: "" });
    expect(r).toEqual({
      ok: false,
      error: {
        tipo: "validacion",
        origen: "cliente",
        mensaje: "Revisa los campos marcados.",
        errores: { invitados: "Mínimo 20 invitados.", telefono: "Escribe tu teléfono." },
      },
    });
    expect(recibidos).toEqual([]);
  });
});
