/**
 * Casos de uso de la pantalla Carta (/menu). Los datos son estáticos (no hay
 * API), así que no hay puerto de salida: el caso de uso recibe los datos de la
 * carta al montarse (src/app/funcionalidades/carta.ts).
 */
import { OPCIONES_FILTRO, filtrarCarta } from "../../domain/carta";
import type { CartaVisible, DatosCarta, FiltroCarta, OpcionFiltro } from "../../domain/carta";
import { defineFeature } from "../funcionalidad";

export interface CartaUseCases {
  /** Acción "elegir un filtro": qué se ve con él (categorías, pestañas, conteo, vacío). */
  verCarta(filtro: FiltroCarta): CartaVisible;
  /** Los botones de "Mostrar:". */
  opcionesDeFiltro(): readonly OpcionFiltro[];
}

export const CARTA = defineFeature<CartaUseCases>("carta");

export function crearCasosDeUsoCarta(datos: DatosCarta): CartaUseCases {
  return {
    verCarta: (filtro) => filtrarCarta(datos, filtro),
    opcionesDeFiltro: () => OPCIONES_FILTRO,
  };
}
