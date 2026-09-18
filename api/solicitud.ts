/**
 * POST /api/solicitud — recibe una solicitud de catering.
 *
 * Función de Vercel con la interfaz web estándar (Request → Response), sin
 * dependencias. En desarrollo la sirve build/api-dev.ts desde el mismo archivo.
 *
 * Valida con las mismas reglas del formulario, recalcula el total con los
 * precios de src/data/menu.ts y registra un resumen en los logs de Vercel.
 * Es un proyecto universitario: la solicitud no se guarda ni se envía a nadie.
 */
import { validarSolicitud } from "../src/lib/solicitud.js";

/** Campo trampa: invisible para personas; los bots que rellenan todo lo llenan. */
const HONEYPOT = "sitio_web";
const MAX_BYTES = 10_000;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });

export async function POST(request: Request): Promise<Response> {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return json({ ok: false, mensaje: "Formato no admitido." }, 415);
  }

  const cuerpo = await request.text();
  if (cuerpo.length > MAX_BYTES) return json({ ok: false, mensaje: "Solicitud demasiado grande." }, 413);

  let datos: unknown;
  try {
    datos = JSON.parse(cuerpo);
  } catch {
    return json({ ok: false, mensaje: "Datos no válidos." }, 400);
  }

  // Un bot rellenó el campo trampa: respuesta de éxito para no darle pistas,
  // pero la solicitud no se procesa.
  const trampa = (datos as Record<string, unknown> | null)?.[HONEYPOT];
  if (typeof trampa === "string" && trampa.trim() !== "") return json({ ok: true });

  const resultado = validarSolicitud(datos);
  if (!resultado.ok) {
    return json({ ok: false, mensaje: "Revisa los campos marcados.", errores: resultado.errores }, 400);
  }

  const { solicitud, total } = resultado;
  // Queda en los logs de la función en Vercel. No se registran email ni teléfono.
  console.log(
    JSON.stringify({
      evento: "solicitud-catering",
      paquete: solicitud.catering,
      invitados: solicitud.invitados,
      fecha: solicitud.fecha,
      colonia: solicitud.colonia,
      total,
    }),
  );

  return json({ ok: true, total });
}
