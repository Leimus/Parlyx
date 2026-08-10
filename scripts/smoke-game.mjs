#!/usr/bin/env node
/* Smoke test de la capa de juego F2: auto-juega N partidas completas
   a través de lib/game (deck real + motor real) con decisiones
   pseudo-aleatorias deterministas. Falla ante cualquier crash, loop
   infinito o partida sin final. NO valida calibración (eso es F3):
   valida que el core loop siempre termina.

   Uso: node scripts/smoke-game.mjs [N]   (default 300)              */
import { createGame, chooseOption, advanceTurn } from "../lib/game/state.js";
import { rng } from "../lib/engine/index.js";
import { RUBROS_META, HQS_META, CAPITALES_META, EMOJIS, COLORS, NOMBRES } from "../lib/game/meta.js";
import { hashStr, mulberry32 } from "../lib/engine/prng.js";

const N = parseInt(process.argv.find((a) => !a.startsWith("--") && !a.includes("/")) || "300", 10);
const porArco = process.argv.includes("--arcos");
const modoParlyx = process.argv.includes("--parlyx");
const finals = {};
const porArcoDist = {}; // arco → {final: n, _n: total}
const motes = {};
const cartasVistas = new Set();
let turnosTot = 0;
let criticosTot = 0;
let fallas = 0;

for (let i = 0; i < N; i++) {
  const seed = "SMOKE" + i;
  const rs = mulberry32(hashStr(seed + "::autosetup"));
  const setup = {
    empresa: NOMBRES[Math.floor(rs() * NOMBRES.length)],
    apellido: "Test",
    isotipo: "rombo",
    color: COLORS[Math.floor(rs() * COLORS.length)],
    rubro: RUBROS_META[Math.floor(rs() * RUBROS_META.length)].id,
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
    if (!gs.mote?.nombre) throw new Error("partida sin mote");
    finals[gs.endInfo.key] = (finals[gs.endInfo.key] || 0) + 1;
    motes[gs.mote.nombre] = (motes[gs.mote.nombre] || 0) + 1;
    const pa = (porArcoDist[gs.arco] = porArcoDist[gs.arco] || { _n: 0 });
    pa._n++;
    pa[gs.endInfo.key] = (pa[gs.endInfo.key] || 0) + 1;
    criticosTot += gs.decisionLog.filter((d) => d.win && gs.result?.critico).length ? 1 : 0;
    turnosTot += gs.rows.length;
  } catch (e) {
    fallas++;
    console.error(`✗ seed ${seed} (${setup.rubro}/${setup.hq}/${setup.capital}): ${e.message}`);
    if (fallas > 5) { console.error("Demasiadas fallas, corto."); break; }
  }
}

console.log(`\n=== SMOKE (${N} partidas auto-jugadas) ===`);
console.log("Finales:", Object.entries(finals).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k}:${((100 * v) / N).toFixed(1)}%`).join(" · "));
console.log("Motes:  ", Object.entries(motes).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k}:${((100 * v) / N).toFixed(1)}%`).join(" · "));
console.log(`Filas promedio: ${(turnosTot / (N - fallas)).toFixed(1)} · Cartas distintas vistas: ${cartasVistas.size}/111 (+sintéticas)`);

if (porArco) {
  console.log("\n=== DISTRIBUCIÓN POR ARCO (recalibración v0.3 §12.5) ===");
  const KEYS = ["remar", "pyme", "digna", "escandalo", "ipo", "ipoDown", "uni", "exitG", "exitC", "acquihire", "serial", "playaG", "playaC", "playa0"];
  const quiebra = (d) => (((d.digna || 0) + (d.escandalo || 0)) / d._n) * 100;
  const epico = (d) => (((d.ipo || 0) + (d.ipoDown || 0) + (d.uni || 0) + (d.exitG || 0) + (d.serial || 0)) / d._n) * 100;
  console.log("arco".padEnd(14), "n".padStart(6), "quiebra".padStart(9), "épico".padStart(8), " detalle");
  for (const [arco, d] of Object.entries(porArcoDist).sort((a, b) => b[1]._n - a[1]._n)) {
    const detalle = KEYS.filter((k) => d[k]).map((k) => `${k}:${((100 * d[k]) / d._n).toFixed(0)}%`).join(" ");
    console.log(arco.padEnd(14), String(d._n).padStart(6), quiebra(d).toFixed(1).padStart(8) + "%", epico(d).toFixed(1).padStart(7) + "%", " " + detalle);
  }
}
if (fallas) {
  console.error(`\n✗ ${fallas} partidas fallaron.`);
  process.exit(1);
}
console.log("✓ Todas las partidas terminaron sin errores.");

/* ---- REGLA DE ORO (PRD v1.0 §4.2): activar Parlyx debe ser óptimo en
   ~60-70% de los contextos, NO en el 100%. Cada seed se juega tres veces
   con la misma política (solo cambia la decisión de EC-24) y se compara
   el resultado final (plata del jugador + valor de su parte). ---- */
if (modoParlyx) {
  const score = (gs) => {
    const g = gs.g;
    const parte = !g.dead && (gs.mode === "founder" || gs.retired === false) ? g.val * (g.eq / 100) : 0;
    return g.pat + parte;
  };
  const jugar = (seed, setup, opcionEC24) => {
    const gs = createGame(seed, setup);
    let guard = 0;
    while (gs.phase !== "end" && guard++ < 200) {
      if (gs.phase === "decision") {
        const ops = gs.card.opciones;
        const op = gs.card.id === "EC-24"
          ? ops.find((o) => o.id === opcionEC24) || ops[0]
          : ops[Math.floor(rng(gs.g) * ops.length)];
        chooseOption(gs, op.id);
      } else advanceTurn(gs);
    }
    return gs;
  };
  let conBeat = 0, ganaParlyx = 0;
  const M = Math.min(N, 600);
  for (let i = 0; i < M; i++) {
    const seed = "GOLD" + i;
    const rs = mulberry32(hashStr(seed + "::autosetup"));
    const setup = {
      empresa: NOMBRES[Math.floor(rs() * NOMBRES.length)], apellido: "T",
      isotipo: "rombo", color: COLORS[Math.floor(rs() * COLORS.length)],
      rubro: RUBROS_META[Math.floor(rs() * RUBROS_META.length)].id,
      hq: HQS_META[Math.floor(rs() * HQS_META.length)].id,
      capital: CAPITALES_META[Math.floor(rs() * CAPITALES_META.length)].id,
    };
    const a = jugar(seed, setup, "A"); // responder vos
    if (!a.used.has("EC-24")) continue; // no llegó al beat (quiebra temprana)
    const b = jugar(seed, setup, "B"); // contratar
    const c = jugar(seed, setup, "C"); // activar Parlyx
    conBeat++;
    if (score(c) > Math.max(score(a), score(b))) ganaParlyx++;
  }
  const pct = ((100 * ganaParlyx) / Math.max(1, conBeat)).toFixed(1);
  console.log(`\n=== REGLA DE ORO PARLYX (§4.2) — ${conBeat} contextos ===`);
  console.log(`Activar Parlyx fue óptimo en ${pct}% de los contextos (target 60-70%, jamás 100%)`);
}
