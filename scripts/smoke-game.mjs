#!/usr/bin/env node
/* Smoke test de la capa de juego F2: auto-juega N partidas completas
   a través de lib/game (deck real + motor real) con decisiones
   pseudo-aleatorias deterministas. Falla ante cualquier crash, loop
   infinito o partida sin final. NO valida calibración (eso es F3):
   valida que el core loop siempre termina.

   Uso: node scripts/smoke-game.mjs [N]   (default 300)              */
import { createGame, chooseOption, advanceTurn } from "../lib/game/state.js";
import { rng } from "../lib/engine/index.js";
import { VERTICALS_META, HQS_META, CAPITALES_META, EMOJIS, COLORS, NOMBRES } from "../lib/game/meta.js";
import { hashStr, mulberry32 } from "../lib/engine/prng.js";

const N = parseInt(process.argv[2] || "300", 10);
const finals = {};
const cartasVistas = new Set();
let turnosTot = 0;
let fallas = 0;

for (let i = 0; i < N; i++) {
  const seed = "SMOKE" + i;
  const rs = mulberry32(hashStr(seed + "::autosetup"));
  const setup = {
    empresa: NOMBRES[Math.floor(rs() * NOMBRES.length)],
    apellido: "Test",
    emoji: EMOJIS[Math.floor(rs() * EMOJIS.length)],
    color: COLORS[Math.floor(rs() * COLORS.length)],
    vertical: VERTICALS_META[Math.floor(rs() * VERTICALS_META.length)].id,
    hq: HQS_META[Math.floor(rs() * HQS_META.length)].id,
    capital: CAPITALES_META[Math.floor(rs() * CAPITALES_META.length)].id,
  };
  try {
    const gs = createGame(seed, setup);
    let guard = 0;
    while (gs.phase !== "end" && guard++ < 200) {
      if (gs.phase === "decision") {
        if (!gs.card || !gs.card.opciones?.length) throw new Error("turno sin carta u opciones (ti=" + gs.g.ti + ")");
        cartasVistas.add(gs.card.id);
        const ops = gs.card.opciones;
        const op = ops[Math.floor(rng(gs.g) * ops.length)];
        chooseOption(gs, op.id);
        if (gs.phase !== "resolved") throw new Error("chooseOption no resolvió (carta " + gs.card.id + ")");
      } else {
        advanceTurn(gs);
      }
    }
    if (gs.phase !== "end") throw new Error("partida sin final tras 200 pasos");
    if (!gs.endInfo?.titulo) throw new Error("final sin título");
    if (gs.rows.length === 0) throw new Error("partida sin filas");
    finals[gs.endInfo.key] = (finals[gs.endInfo.key] || 0) + 1;
    turnosTot += gs.rows.length;
  } catch (e) {
    fallas++;
    console.error(`✗ seed ${seed} (${setup.vertical}/${setup.hq}/${setup.capital}): ${e.message}`);
    if (fallas > 5) { console.error("Demasiadas fallas, corto."); break; }
  }
}

console.log(`\n=== SMOKE F2 (${N} partidas auto-jugadas) ===`);
console.log("Finales:", Object.entries(finals).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k}:${((100 * v) / N).toFixed(1)}%`).join(" · "));
console.log(`Filas promedio: ${(turnosTot / (N - fallas)).toFixed(1)} · Cartas distintas vistas: ${cartasVistas.size}/102 (+PX)`);
if (fallas) {
  console.error(`\n✗ ${fallas} partidas fallaron.`);
  process.exit(1);
}
console.log("✓ Todas las partidas terminaron sin errores.");
