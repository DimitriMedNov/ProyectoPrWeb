/** Adaptador de `HttpClient` con `fetch`. Único sitio de la app que llama a `fetch`. */
import type { HttpClient } from "../application/puertos";
import { err, ok } from "../domain/result";

export function createFetchHttpClient(baseUrl = ""): HttpClient {
  return {
    async postJson(path, body, options) {
      try {
        const res = await fetch(`${baseUrl}${path}`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(body),
          signal: options?.signal,
        });
        const json: unknown = await res.json().catch(() => ({}));
        return ok({ status: res.status, ok: res.ok, body: json });
      } catch (e) {
        return err({ kind: "network", aborted: e instanceof DOMException && e.name === "AbortError" });
      }
    },
  };
}
