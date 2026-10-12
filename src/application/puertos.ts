/**
 * Puertos genéricos: lo que la aplicación necesita de fuera, dicho como
 * interfaz. Los implementan los adaptadores de `src/infrastructure` y se crean
 * en el composition root (`src/main.tsx`). Los puertos propios de una pantalla
 * van en `src/application/<pantalla>/`.
 */
import type { Result } from "../domain/result";

/** Respuesta HTTP ya leída. `body` es lo que venga: se estrecha con un mapper. */
export interface HttpResponse {
  status: number;
  /** `true` si el código es 2xx. */
  ok: boolean;
  /** JSON de la respuesta; `{}` si no traía JSON válido. */
  body: unknown;
}

/** No hubo respuesta: sin conexión, petición cancelada, etc. */
export interface NetworkError {
  kind: "network";
  aborted: boolean;
}

export interface HttpClient {
  postJson(path: string, body: unknown, options?: { signal?: AbortSignal }): Promise<Result<HttpResponse, NetworkError>>;
}

/** Preferencias guardadas en el dispositivo (p. ej. el tema elegido). */
export interface PreferenceStore {
  read(key: string): string | null;
  write(key: string, value: string): void;
  remove(key: string): void;
}

/** Adaptadores genéricos que el composition root entrega a toda la app. */
export interface Dependencies {
  http: HttpClient;
  preferences: PreferenceStore;
}
