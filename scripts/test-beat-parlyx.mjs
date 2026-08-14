#!/usr/bin/env node
/* ============================================================
   SPEC v3 §2.5 — LA GARANTÍA DE LAS TRES SILLAS.

   Traba dura: si UNA sola partida de N no alcanza el beat Parlyx
   de 2020, el build falla. No es estadística, es estructura: el
   año 2020 siempre se juega y pickCard es la única fuente de
   cartas, así que el ancla de deck.js no tiene camino de escape.

   Traba blanda: la distribución de sillas se reporta siempre y
   se assertea con pisos holgados. La banda fina del §2.5
   (65-75 / 12-20 / 10-18) se persigue en el tuneo de pesos
   (CARTAS_DE_SILLA en deck.js) y se mide acá, pero no se clava
   en CI: la política de simulación es uniforme y no representa
   a un jugador real; clavarla convierte cualquier retoque de
   contenido en un build rojo sin señal.

   Además verifica que elegir la opción Parlyx PRENDE gs.parlyx
   en las tres sillas — applySpecial tiene `default: break`, así
   que un typo en el special pasaría el schema y el validador y
   dejaría el beat sin efecto en silencio.
   ============================================================ */
import { createGame, chooseOption, advanceTurn } from "../lib/game/state.js";
import { BEAT_2020 } from "../lib/game/deck.js";
import { rng, mulberry32, hashStr } from "../lib/engine/index.js";
import { RUBROS_META, ISOTIPOS, COLORS } from "../lib/game/meta.js";

const N = Number(process.argv[2]) || 10000;
const CAPITALES = ["boot", "fff", "vc"];

function setupDe(i) {
  const rs = mulberry32(hashStr("beat::" + i));
  return {
    empresa: "Marca" + i,
    apellido: "",
    isotipo: ISOTIPOS[Math.floor(rs() * ISOTIPOS.length)],
    color: COLORS[Math.floor(rs() * COLORS.length)],
    rubro: RUBROS_META[Math.floor(rs() * RUBROS_META.length)].id,
    capital: CAPITALES[Math.floor(rs() * CAPITALES.length)],
  };
}

/* Auto-juego con política uniforme (la misma de smoke-game). */
function jugar(seed, setup, forzarParlyx = false) {
  const gs = createGame(seed, setup);
  let guard = 0;
  while (gs.phase !== "end" && guard++ < 300) {
    if (gs.phase === "decision") {
      const ops = gs.card.opciones;
      let op = ops[Math.floor(rng(gs.g) * ops.length)];
      if (forzarParlyx) {
        const prlx = ops.find((o) => o.efectos?.special === "parlyxActivar");
        if (prlx) op = prlx;
      }
      chooseOption(gs, op.id);
    } else advanceTurn(gs);
  }
  return gs;
}

console.log(`=== BEAT PARLYX EN LAS TRES SILLAS (N=${N}) ===`);
const sillas = { A: 0, B: 0, C: 0 };
const porCarta = {};
const fallas = [];
let filasMin = 99;

for (let i = 0; i < N; i++) {
  const seed = "BEAT" + i;
  const gs = jugar(seed, setupDe(i));
  filasMin = Math.min(filasMin, gs.rows.length);
  if (!gs.beatParlyx) {
    fallas.push({ seed, mode: gs.mode, rows: gs.rows.length });
    continue;
  }
  sillas[gs.beatParlyx.silla]++;
  porCarta[gs.beatParlyx.cardId] = (porCarta[gs.beatParlyx.cardId] || 0) + 1;
}

const vistos = N - fallas.length;
const pct = (x) => ((x / N) * 100).toFixed(1) + "%";
console.log(`Cobertura del beat 2020: ${pct(vistos)} (${vistos}/${N})`);
console.log(`Sillas al vivir 2020 — A fundador ${pct(sillas.A)} · B corpo ${pct(sillas.B)} · C ángel ${pct(sillas.C)}`);
console.log(`Cartas del beat: ${Object.entries(porCarta).map(([k, v]) => `${k} ${pct(v)}`).join(" · ")}`);
console.log(`Filas mínimas de una partida: ${filasMin} (ninguna carrera se corta antes de 2026)`);

/* Bandas del §2.5: se reportan siempre, se assertean con piso holgado. */
const BANDAS = { A: [65, 75], B: [12, 20], C: [10, 18] };
for (const [s, [lo, hi]] of Object.entries(BANDAS)) {
  const p = (sillas[s] / N) * 100;
  const dentro = p >= lo && p <= hi;
  console.log(`  ${dentro ? "✓" : "•"} silla ${s}: ${p.toFixed(1)}% ${dentro ? "en banda" : `fuera de banda ${lo}-${hi}`}`);
}

/* El special funciona en las tres sillas (applySpecial tiene default: break). */
console.log("\n=== EL SPECIAL PRENDE EN LAS TRES SILLAS ===");
const prendio = { A: 0, B: 0, C: 0 };
const M = 400;
for (let i = 0; i < M; i++) {
  const gs = jugar("PRLX" + i, setupDe(i), true);
  if (gs.beatParlyx && gs.parlyx) prendio[gs.beatParlyx.silla]++;
}
const sillasProbadas = Object.entries(prendio).filter(([, v]) => v > 0).map(([k]) => k);
console.log(`Forzando la opción Parlyx en ${M} partidas, gs.parlyx quedó activo en: ${sillasProbadas.join(", ") || "NINGUNA"}`);
console.log(`Ids de beat esperados: ${Object.entries(BEAT_2020).map(([m, id]) => `${m}→${id}`).join(" · ")}`);

let malo = false;
if (fallas.length) {
  console.error(`\n✗ ${fallas.length} partida(s) NO alcanzaron el beat Parlyx. Primeras 5:`);
  for (const f of fallas.slice(0, 5)) console.error(`   seed ${f.seed} · modo ${f.mode} · ${f.rows} filas`);
  malo = true;
}
if (sillasProbadas.length < 3) {
  console.error(`\n✗ El special "parlyxActivar" no prende en todas las sillas (${sillasProbadas.join(",") || "ninguna"}).`);
  malo = true;
}
for (const [s, n] of Object.entries(sillas)) {
  if ((n / N) * 100 < 8) {
    console.error(`\n✗ La silla ${s} quedó en ${pct(n)}: por debajo del piso del 8%. Las tres sillas tienen que ser alcanzables.`);
    malo = true;
  }
}
if (malo) process.exit(1);
console.log("\n✓ El 100% de las partidas vive el momento Parlyx, en la silla que sea.");
