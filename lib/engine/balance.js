/* Carga de data/balance.json — el objeto BAL, único lugar de tuneo económico.
   growthCaps usa null para representar Infinity (JSON no lo soporta): acá se revive. */
import balanceJson from "../../data/balance.json" with { type: "json" };

const { _comentario, ...raw } = balanceJson;

export const BAL = {
  ...raw,
  growthCaps: raw.growthCaps.map(([umbral, f]) => [umbral === null ? Infinity : umbral, f]),
};
