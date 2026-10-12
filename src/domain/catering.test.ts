import { describe, expect, it } from "vitest";
import {
  alternarComplemento,
  calcularTotal,
  cambiarMeseras,
  estadoComplementos,
  estadoMeseras,
  fechaMinima,
  serieTotalesPorPaquete,
  validarFormulario,
  valoresIniciales,
} from "./catering";
import type { ValoresFormulario } from "./catering";
import { sePuedeReintentar, textoDeError } from "./catering-envio";

const HOY = new Date(2026, 9, 12, 10, 0, 0); // 12 de octubre de 2026, hora local

const completos = (cambios: Partial<ValoresFormulario> = {}): ValoresFormulario => ({
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
  ...cambios,
});

describe("valores iniciales", () => {
  it("empieza en Buffet, 3 meseras, primera colonia y sin complementos", () => {
    const v = valoresIniciales();
    expect(v.catering).toBe("Buffet");
    expect(v.meseras).toBe("3");
    expect(v.colonia).toBe("San Ramón Norte I");
    expect(v.complementos).toEqual([]);
    expect(v.sitio_web).toBe("");
  });
});

describe("total estimado", () => {
  it("multiplica invitados por el precio del paquete", () => {
    expect(calcularTotal("Comida formal", "40")).toEqual({
      total: 1280,
      texto: "$1,280",
      detalle: "40 invitados × $32",
    });
  });

  it("acepta justo el mínimo", () => {
    expect(calcularTotal("Buffet", "20").texto).toBe("$360");
  });

  it.each(["", "19", "20.5", "abc"])("con invitados %j muestra — y el precio por persona", (invitados) => {
    expect(calcularTotal("Comida formal", invitados)).toEqual({
      total: null,
      texto: "—",
      detalle: "$32 por persona · mínimo 20 invitados",
    });
  });

  it("sin paquete conocido no calcula nada", () => {
    expect(calcularTotal("Otro", "40")).toEqual({ total: null, texto: "—", detalle: "" });
  });
});

describe("meseras", () => {
  it("en el mínimo no se puede quitar", () => {
    expect(estadoMeseras("3")).toEqual({ min: 3, max: 7, puedeQuitar: false, puedeAnadir: true, anuncio: "3 meseras" });
    expect(cambiarMeseras("3", -1)).toBe("3");
  });

  it("en el máximo no se puede añadir", () => {
    expect(estadoMeseras("7")).toMatchObject({ puedeQuitar: true, puedeAnadir: false });
    expect(cambiarMeseras("7", 1)).toBe("7");
  });

  it("suma y resta dentro del rango", () => {
    expect(cambiarMeseras("3", 1)).toBe("4");
    expect(cambiarMeseras("5", -1)).toBe("4");
  });

  it("con el campo vacío parte del mínimo y con un valor fuera de rango lo recorta", () => {
    expect(cambiarMeseras("", 1)).toBe("4");
    expect(cambiarMeseras("12", -1)).toBe("7");
  });
});

describe("complementos", () => {
  it("por debajo del máximo no bloquea nada", () => {
    expect(estadoComplementos(["salsa-picante"])).toEqual({
      max: 2,
      lleno: false,
      bloqueados: [],
      ayuda: "Elige hasta 2.",
    });
  });

  it("al llegar al máximo bloquea las casillas sin marcar", () => {
    expect(estadoComplementos(["salsa-picante", "guacamole-extra"])).toEqual({
      max: 2,
      lleno: true,
      bloqueados: ["servilletas-de-lujo", "utensilios-de-lujo"],
      ayuda: "Ya elegiste 2. Quita uno para cambiarlo.",
    });
  });

  it("marca, desmarca y no deja pasar del máximo", () => {
    expect(alternarComplemento([], "salsa-picante")).toEqual(["salsa-picante"]);
    expect(alternarComplemento(["salsa-picante"], "salsa-picante")).toEqual([]);
    expect(alternarComplemento(["salsa-picante", "guacamole-extra"], "utensilios-de-lujo")).toEqual([
      "salsa-picante",
      "guacamole-extra",
    ]);
  });
});

describe("fecha mínima", () => {
  it("es hoy en AAAA-MM-DD con la fecha local", () => {
    expect(fechaMinima(HOY)).toBe("2026-10-12");
    expect(fechaMinima(new Date(2027, 0, 5))).toBe("2027-01-05");
  });
});

describe("validación en el cliente", () => {
  it("acepta un formulario completo y devuelve el total", () => {
    expect(validarFormulario(completos(), HOY)).toEqual({ ok: true, total: 720 });
  });

  it("da los errores por campo con los textos del servidor", () => {
    const r = validarFormulario(completos({ invitados: "5", cp: "12", email: "sin-arroba", nombre: " " }), HOY);
    expect(r).toEqual({
      ok: false,
      errores: {
        invitados: "Mínimo 20 invitados.",
        cp: "El código postal lleva 5 dígitos.",
        email: "Correo no válido.",
        nombre: "Escribe tu nombre.",
      },
    });
  });

  it("no admite una fecha anterior a hoy (fecha local), pero sí hoy", () => {
    expect(validarFormulario(completos({ fecha: "2026-10-11" }), HOY)).toEqual({
      ok: false,
      errores: { fecha: "Elige una fecha a partir de hoy." },
    });
    expect(validarFormulario(completos({ fecha: "2026-10-12" }), HOY).ok).toBe(true);
  });

  it("una fecha vacía es no válida", () => {
    expect(validarFormulario(completos({ fecha: "" }), HOY)).toEqual({
      ok: false,
      errores: { fecha: "Fecha no válida." },
    });
  });
});

describe("serie para la gráfica", () => {
  it("da el total de los 3 paquetes para esos invitados", () => {
    expect(serieTotalesPorPaquete("40")).toEqual([
      { paquete: "Buffet", precioPorPersona: 18, total: 720, totalTexto: "$720" },
      { paquete: "Comida formal", precioPorPersona: 32, total: 1280, totalTexto: "$1,280" },
      { paquete: "Cena temática", precioPorPersona: 42, total: 1680, totalTexto: "$1,680" },
    ]);
  });

  it.each(["", "19", "abc"])("sin invitados válidos (%j) no hay serie", (invitados) => {
    expect(serieTotalesPorPaquete(invitados)).toEqual([]);
  });
});

describe("texto de error", () => {
  it("junta el mensaje con los errores por campo, en el orden del formulario", () => {
    expect(
      textoDeError({
        tipo: "validacion",
        origen: "servidor",
        mensaje: "Revisa los campos marcados.",
        errores: { cp: "El código postal lleva 5 dígitos.", invitados: "Mínimo 20 invitados." },
      }),
    ).toBe("Revisa los campos marcados. Mínimo 20 invitados. El código postal lleva 5 dígitos.");
  });

  it("en servidor y red es solo el mensaje, y esos sí se pueden reintentar", () => {
    const servidor = { tipo: "servidor", estado: 413, mensaje: "Solicitud demasiado grande." } as const;
    expect(textoDeError(servidor)).toBe("Solicitud demasiado grande.");
    expect(sePuedeReintentar(servidor)).toBe(true);
    expect(sePuedeReintentar({ tipo: "validacion", origen: "cliente", mensaje: "x", errores: {} })).toBe(false);
  });
});
