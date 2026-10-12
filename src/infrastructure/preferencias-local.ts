/**
 * Adaptador de `PreferenceStore` con `localStorage`. Si el navegador lo bloquea
 * (modo privado, cookies desactivadas) no revienta: lee `null` y no guarda.
 */
import type { PreferenceStore } from "../application/puertos";

export function createLocalPreferenceStore(): PreferenceStore {
  return {
    read(key) {
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    },
    write(key, value) {
      try {
        localStorage.setItem(key, value);
      } catch {
        // Sin almacenamiento disponible: la preferencia dura solo esta visita.
      }
    },
    remove(key) {
      try {
        localStorage.removeItem(key);
      } catch {
        // Igual que arriba.
      }
    },
  };
}
