import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "../api/solicitud";

const url = "http://localhost/api/solicitud";
const post = (body: string, type = "application/json") =>
  POST(new Request(url, { method: "POST", headers: { "content-type": type }, body }));

const valida = {
  catering: "Buffet",
  invitados: "25",
  fecha: "2999-01-01",
  hora: "19:30",
  direccion: "Calle 2",
  colonia: "Montes de Ame",
  cp: "97100",
  meseras: "3",
  complementos: [],
  issue: "",
  nombre: "Luis",
  apellido: "Canul",
  email: "luis@correo.com",
  telefono: "9991112222",
  sitio_web: "",
};

describe("POST /api/solicitud", () => {
  afterEach(() => vi.restoreAllMocks());

  it("responde 200 con el total recalculado y no registra datos de contacto", async () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    const res = await post(JSON.stringify(valida));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, total: 25 * 18 });
    const registrado = String(log.mock.calls[0]?.[0]);
    expect(registrado).not.toContain("luis@correo.com");
    expect(registrado).not.toContain("9991112222");
  });

  it("responde 400 con los errores por campo", async () => {
    const res = await post(JSON.stringify({ ...valida, invitados: "5" }));
    expect(res.status).toBe(400);
    expect((await res.json()).errores).toHaveProperty("invitados");
  });

  it("da un ok falso a los bots que rellenan el campo trampa", async () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    const res = await post(JSON.stringify({ sitio_web: "http://spam" }));
    expect(await res.json()).toEqual({ ok: true });
    expect(log).not.toHaveBeenCalled();
  });

  it("rechaza lo que no es JSON y el JSON roto", async () => {
    expect((await post("a=b", "application/x-www-form-urlencoded")).status).toBe(415);
    expect((await post("{roto")).status).toBe(400);
  });

  it("rechaza cuerpos demasiado grandes", async () => {
    const res = await post(JSON.stringify({ ...valida, issue: "x".repeat(20_000) }));
    expect(res.status).toBe(413);
  });
});
