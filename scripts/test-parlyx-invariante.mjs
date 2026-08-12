#!/usr/bin/env node
/* ============================================================
   Test del invariante Parlyx (FIX-PACK §5.1):
   "nunca caés más CON Parlyx que sin él".

   Con los knobs opcionales del motor activos (prodMul=1.35,
   caidaMul=0.6), partiendo del MISMO estado y con los MISMOS
   rolls (mismo rngState), las ventas del trienio con Parlyx
   deben ser SIEMPRE ≥ que sin Parlyx — en cada trienio de
   cada carrera, incluidas las de crisis (2001, 2008, 2022).

   Corre en npm test junto al golden. Falla = build roto.
   ============================================================ */
import { newGame, simulateTrienio, politicaFx, TURN_YEARS, VERTICALS } from "../lib/engine/index.js";
import { hashStr, mulberry32 } from "../lib/engine/prng.js";

const N = 2000;
let trienios = 0, amortiguados = 0, violaciones = 0;

for (let i = 0; i < N; i++) {
  const seed = "INV" + i;
  const vertical = VERTICALS[Math.floor(mulberry32(hashStr(seed))() * VERTICALS.length)];
  const caps = ["boot", "fff", "vc"];
  const capital = caps[Math.floor(mulberry32(hashStr(seed + "c"))() * 3)];

  // Una carrera CON los knobs de Parlyx activos desde el arranque…
  const g = newGame(seed, vertical, capital);
  g.prodMul = 1.35;
  g.caidaMul = 0.6;

  while (g.ti < TURN_YEARS.length && !g.dead) {
    const fx = politicaFx(g); // consume rng de g — la sombra clona DESPUÉS
    // …y en cada trienio, la rama fantasma sin Parlyx desde el mismo estado.
    const sombra = JSON.parse(JSON.stringify(g));
    delete sombra.prodMul;
    delete sombra.caidaMul;
    const prevArr = g.arr;
    simulateTrienio(g, fx);
    simulateTrienio(sombra, fx);
    trienios++;
    if (g.arr < sombra.arr - 1e-9) {
      violaciones++;
      if (violaciones <= 5) {
        console.error(`✗ seed=${seed} año=${TURN_YEARS[sombra.ti - 1]} arrPrev=${Math.round(prevArr)} con=${Math.round(g.arr)} sin=${Math.round(sombra.arr)}`);
      }
    }
    if (prevArr > 0 && g.arr < prevArr && g.arr > sombra.arr) amortiguados++;
  }
}

console.log(`[parlyx-invariante] ${trienios} trienios comparados en ${N} carreras (con knobs vs sin, mismos rolls).`);
console.log(`[parlyx-invariante] Trienios negativos amortiguados: ${amortiguados} (el amortiguador trabaja).`);
if (violaciones > 0) {
  console.error(`[parlyx-invariante] ✗ ${violaciones} violaciones: hubo trienios donde CON Parlyx cayó más que SIN. Invariante roto (FIX-PACK §5).`);
  process.exit(1);
}
if (amortiguados === 0) {
  console.error("[parlyx-invariante] ✗ Ningún trienio amortiguado en " + N + " carreras: caidaMul no está teniendo efecto.");
  process.exit(1);
}
console.log("[parlyx-invariante] ✓ Invariante sólido: nunca caés más CON Parlyx que sin él.");
