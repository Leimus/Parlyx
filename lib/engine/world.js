/* Mundo: años de turno, eras (desde data/eras.json), clima y fit de vertical.
   Misma semántica que engine-v1.js — eraFor ahora lee la tabla por año. */
import erasJson from "../../data/eras.json" with { type: "json" };

export const TURN_YEARS = [1993, 1996, 1999, 2002, 2005, 2008, 2011, 2014, 2017, 2020, 2023];

const ERAS_BY_YEAR = new Map(erasJson.map((row) => [row.year, row]));

export function eraFor(year, vertical) {
  const row = ERAS_BY_YEAR.get(year);
  if (!row) throw new Error(`Sin era definida para el año ${year}`);
  const src = vertical === "ai" && row.ai ? row.ai : row;
  return { clima: src.clima, mult: src.mult, capital: src.capital };
}

export const climaBias = (c) => (c === 2 ? 1 : c === 1 ? 0.6 : c === -1 ? -0.6 : c === -2 ? -1.2 : 0);

export function fitVertical(year, v) {
  if (v === "ai") return year < 2014 ? -1 : year >= 2023 ? 2 : 0;
  if (v === "crypto") return year < 2011 ? -1 : year >= 2014 && year <= 2021 ? 1 : 0;
  if (v === "ecom") return year === 2020 ? 2 : year === 2023 ? -1 : 0;
  return 0;
}
