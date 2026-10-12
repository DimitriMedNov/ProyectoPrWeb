/**
 * Resultado tipado (patrón Result): una operación que puede fallar devuelve el
 * éxito o el error como dato, en vez de lanzar una excepción suelta.
 */
export type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

export const ok = <T>(value: T): Result<T, never> => ({ ok: true, value });
export const err = <E>(error: E): Result<never, E> => ({ ok: false, error });
