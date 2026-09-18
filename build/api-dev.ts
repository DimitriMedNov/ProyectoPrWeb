/**
 * En `npm run dev`, sirve /api/solicitud con el mismo archivo que usa Vercel
 * (api/solicitud.ts), para probar el formulario de punta a punta en local.
 * Solo actúa en el servidor de desarrollo; no afecta al build.
 */
import type { IncomingMessage } from "node:http";
import type { Plugin } from "vite";

const leerCuerpo = (req: IncomingMessage) =>
  new Promise<string>((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });

export function apiDev(): Plugin {
  return {
    name: "taquito-api-dev",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/api/solicitud", async (req, res) => {
        if (req.method !== "POST") {
          res.statusCode = 405;
          res.setHeader("allow", "POST");
          res.end();
          return;
        }
        const mod = (await server.ssrLoadModule("/api/solicitud.ts")) as {
          POST: (r: Request) => Promise<Response>;
        };
        const request = new Request(`http://localhost${req.originalUrl ?? req.url}`, {
          method: "POST",
          headers: { "content-type": req.headers["content-type"] ?? "" },
          body: await leerCuerpo(req),
        });
        const response = await mod.POST(request);
        res.statusCode = response.status;
        response.headers.forEach((value, key) => res.setHeader(key, value));
        res.end(await response.text());
      });
    },
  };
}
