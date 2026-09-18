import { describe, expect, it } from "vitest";
import { validarSolicitud } from "./solicitud";

// "Hoy" fijo para que los tests de fechas no dependan del día en que corren.
const HOY = new Date("2026-09-18T12:00:00Z");

const valida = {
  catering: "Comida formal",
  invitados: "40",
  fecha: "2026-10-10",
  hora: "14:00",
  direccion: "Calle 1",
  colonia: "Montebello",
  cp: "97000",
  meseras: "4",
  complementos: ["guacamole-extra"],
  issue: "",
  nombre: "Ana",
  apellido: "Pérez",
  email: "ana@correo.com",
  telefono: "9990000000",
};

const errores = (cambios: Record<string, unknown>) => {
  const r = validarSolicitud({ ...valida, ...cambios }, HOY);
  return r.ok ? {} : r.errores;
};

describe("validarSolicitud", () => {
  it("acepta una solicitud válida y calcula el total con el precio del paquete", () => {
    const r = validarSolicitud(valida, HOY);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.total).toBe(40 * 32);
  });

  it("recalcula el total en el servidor e ignora uno enviado por el navegador", () => {
    const r = validarSolicitud({ ...valida, total: 1 }, HOY);
    expect(r.ok && r.total).toBe(1280);
  });

  it("rechaza paquetes que no existen", () => {
    expect(errores({ catering: "Gratis" })).toHaveProperty("catering");
  });

  it("exige al menos 20 invitados y un número entero", () => {
    expect(errores({ invitados: "19" })).toHaveProperty("invitados");
    expect(errores({ invitados: "20.5" })).toHaveProperty("invitados");
    expect(errores({ invitados: "20" })).not.toHaveProperty("invitados");
  });

  it("rechaza fechas que no existen", () => {
    expect(errores({ fecha: "2026-02-30" })).toHaveProperty("fecha");
    expect(errores({ fecha: "10/10/2026" })).toHaveProperty("fecha");
  });

  it("rechaza fechas pasadas, con un día de margen por la zona horaria", () => {
    expect(errores({ fecha: "2026-09-16" })).toHaveProperty("fecha");
    expect(errores({ fecha: "2026-09-17" })).not.toHaveProperty("fecha");
    expect(errores({ fecha: "2026-09-18" })).not.toHaveProperty("fecha");
  });

  it("valida hora, colonia y código postal como el formulario", () => {
    expect(errores({ hora: "25:00" })).toHaveProperty("hora");
    expect(errores({ colonia: "Otra" })).toHaveProperty("colonia");
    expect(errores({ cp: "1234" })).toHaveProperty("cp");
    expect(errores({ cp: "abcde" })).toHaveProperty("cp");
  });

  it("limita las meseras a 3–7", () => {
    expect(errores({ meseras: "2" })).toHaveProperty("meseras");
    expect(errores({ meseras: "8" })).toHaveProperty("meseras");
    expect(errores({ meseras: "7" })).not.toHaveProperty("meseras");
  });

  it("acepta hasta 2 complementos conocidos, sin repetir", () => {
    expect(errores({ complementos: [] })).not.toHaveProperty("complementos");
    expect(errores({ complementos: ["salsa-picante", "guacamole-extra", "servilletas-de-lujo"] })).toHaveProperty(
      "complementos",
    );
    expect(errores({ complementos: ["guacamole-extra", "guacamole-extra"] })).toHaveProperty("complementos");
    expect(errores({ complementos: ["caviar"] })).toHaveProperty("complementos");
  });

  it("exige los datos de contacto", () => {
    const e = errores({ nombre: " ", apellido: "", email: "sin-arroba", telefono: "" });
    expect(Object.keys(e)).toEqual(expect.arrayContaining(["nombre", "apellido", "email", "telefono"]));
  });

  it("no revienta con entradas que no son objetos", () => {
    expect(validarSolicitud(null, HOY).ok).toBe(false);
    expect(validarSolicitud("hola", HOY).ok).toBe(false);
  });
});
