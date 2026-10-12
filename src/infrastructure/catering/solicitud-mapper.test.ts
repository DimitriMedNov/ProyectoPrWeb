import { describe, expect, it } from "vitest";
import type { HttpClient } from "../../application/puertos";
import { valoresIniciales } from "../../domain/catering";
import { err, ok } from "../../domain/result";
import { aErrorDeRed, aResultadoEnvio, aSolicitudDto } from "./solicitud-mapper";
import { crearSolicitudesHttp } from "./solicitudes-http";

const valores = { ...valoresIniciales(), invitados: "40", complementos: ["salsa-picante"], sitio_web: "" };

describe("mapper de la solicitud", () => {
  it("manda todos los campos como texto, complementos como arreglo y el campo trampa", () => {
    const dto = aSolicitudDto(valores);
    expect(dto).toEqual(valores);
    expect(dto.invitados).toBe("40");
    expect(dto.meseras).toBe("3");
    expect(dto).toHaveProperty("sitio_web", "");
    expect(dto.complementos).not.toBe(valores.complementos);
  });

  it("200 con ok:true es éxito con el total", () => {
    expect(aResultadoEnvio({ status: 200, ok: true, body: { ok: true, total: 720 } })).toEqual(ok({ total: 720 }));
  });

  it("200 con ok:true sin total (campo trampa) es éxito sin total", () => {
    expect(aResultadoEnvio({ status: 200, ok: true, body: { ok: true } })).toEqual(ok({ total: null }));
  });

  it("400 con errores es error de validación por campo", () => {
    const r = aResultadoEnvio({
      status: 400,
      ok: false,
      body: {
        ok: false,
        mensaje: "Revisa los campos marcados.",
        errores: { cp: "El código postal lleva 5 dígitos.", desconocido: "x", fecha: 3 },
      },
    });
    expect(r).toEqual(
      err({
        tipo: "validacion",
        origen: "servidor",
        mensaje: "Revisa los campos marcados.",
        errores: { cp: "El código postal lleva 5 dígitos." },
      }),
    );
  });

  it.each([
    [415, "Formato no admitido."],
    [413, "Solicitud demasiado grande."],
    [400, "Datos no válidos."],
  ])("%i sin errores es error de servidor con su mensaje", (status, mensaje) => {
    expect(aResultadoEnvio({ status, ok: false, body: { ok: false, mensaje } })).toEqual(
      err({ tipo: "servidor", estado: status, mensaje }),
    );
  });

  it("sin JSON reconocible usa el mensaje por defecto", () => {
    expect(aResultadoEnvio({ status: 500, ok: false, body: {} })).toEqual(
      err({ tipo: "servidor", estado: 500, mensaje: "No pudimos enviar tu solicitud." }),
    );
    expect(aResultadoEnvio({ status: 200, ok: true, body: "hola" })).toEqual(
      err({ tipo: "servidor", estado: 200, mensaje: "No pudimos enviar tu solicitud." }),
    );
  });

  it("sin respuesta es error de red", () => {
    expect(aErrorDeRed({ kind: "network", aborted: false })).toEqual(
      err({ tipo: "red", cancelada: false, mensaje: "No pudimos conectar. Revisa tu conexión e inténtalo de nuevo." }),
    );
  });
});

describe("adaptador HTTP de solicitudes", () => {
  it("hace POST a /api/solicitud con el DTO y traduce la respuesta", async () => {
    const llamadas: { path: string; body: unknown }[] = [];
    const http: HttpClient = {
      postJson: async (path, body) => {
        llamadas.push({ path, body });
        return ok({ status: 200, ok: true, body: { ok: true, total: 720 } });
      },
    };
    await expect(crearSolicitudesHttp(http).enviar(valores)).resolves.toEqual(ok({ total: 720 }));
    expect(llamadas).toEqual([{ path: "/api/solicitud", body: aSolicitudDto(valores) }]);
  });

  it("traduce el fallo de red", async () => {
    const http: HttpClient = { postJson: async () => err({ kind: "network", aborted: true }) };
    const r = await crearSolicitudesHttp(http).enviar(valores);
    expect(r).toMatchObject({ ok: false, error: { tipo: "red", cancelada: true } });
  });
});
