#!/usr/bin/env node
/* ============================================================
   Simulador headless — QA de balanceo (PRD §16/§17)

   Uso:
     node scripts/sim.mjs [N]                  → reporte (default 10000)
     node scripts/sim.mjs [N] --check          → + compara contra el golden
                                                 (tests/golden-sim.json) y
                                                 falla si la lógica cambió
     node scripts/sim.mjs [N] --strict-targets → falla fuera de targets §17
     node scripts/sim.mjs 10000 --update-golden→ regenera el golden

   El golden es la traba de la regla dura #1: CUALQUIER cambio en la
   lógica económica (lib/engine/ o data/balance.json / data/eras.json)
   cambia la distribución exacta y rompe --check. Si el cambio es
   intencional (recalibración F3), correr --update-golden y commitear
   el nuevo golden junto con el cambio, verificando targets §17.

   NOTA: el motor v1 usa una política proxy (politicaFx) y HOY no
   cumple §17 (p.ej. "grande" da ~28% vs target 8-12%). Es esperado:
   la recalibración contra targets es F3, después de integrar el deck
   real (paso 3 del CLAUDE.md). Por eso CI usa --check (golden) y no
   --strict-targets todavía.
   ============================================================ */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { runOne } from "../lib/engine/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GOLDEN_PATH = path.join(__dirname, "..", "tests", "golden-sim.json");

const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith("--")));
const N = parseInt(args.find((a) => !a.startsWith("--")) || "10000", 10);

/* Targets §17 del PRD, restringidos a los finales que el motor v1 modela.
   (ejecutivo / playa / comeback / macro llegan con el deck real en F2-F3). */
const TARGETS = {
  quiebra: { min: 25, max: 30 },
  pyme: { min: 20, max: 25 },
  grande: { min: 8, max: 12 },
  unicornio: { min: 7, max: 9 },
  ipo: { min: 3, max: 5 },
};
const OVR_PEAK_TARGET = { min: 73, max: 77 }; // FIX-PACK §1 (antes 74-78 en §17)
const EMERG_MAX = 1.2;

function pct(n, t) { return ((100 * n) / t).toFixed(1) + "%"; }

const dist = {};
let emergTot = 0, rescTot = 0, ovrPeakTot = 0, rondasTot = 0;
let pico80 = 0, pico85 = 0, pico90 = 0, pico95 = 0, racha3 = 0;
const ejemplos = {};
for (let i = 0; i < N; i++) {
  const { end, g } = runOne("SIM" + i);
  dist[end] = (dist[end] || 0) + 1;
  emergTot += g.emergencias; rescTot += g.rescates; ovrPeakTot += g.ovrPeak; rondasTot += g.rondas;
  if (g.ovrPeak >= 80) pico80++;
  if (g.ovrPeak >= 85) pico85++;
  if (g.ovrPeak >= 90) pico90++;
  if (g.ovrPeak >= 95) pico95++;
  if (g.rachaMax >= 3) racha3++;
  if (!ejemplos[end]) ejemplos[end] = { ovrSerie: g.ovrSerie, arrSerie: g.arrSerie, vertical: g.vertical };
}

/* --- Reporte (mismo formato que reference/engine-v1.original.js) --- */
console.log("=== DISTRIBUCIÓN DE FINALES (" + N + " partidas) ===");
const targets = { quiebra: "25-30%", pyme: "20-25%", remando: "(resto chico)", grande: "8-12%", unicornio: "7-9%", ipo: "3-5%", ipo_caida: "(parte del ipo)" };
for (const k of ["quiebra", "remando", "pyme", "grande", "unicornio", "ipo", "ipo_caida"]) {
  console.log(k.padEnd(12), pct(dist[k] || 0, N).padStart(7), "  target:", targets[k] || "-");
}
console.log("\nEmergencias promedio/partida:", (emergTot / N).toFixed(2), " (target ≤ 1.2)");
console.log("Rescates promedio/partida:  ", (rescTot / N).toFixed(2));
console.log("Rondas promedio/partida:    ", (rondasTot / N).toFixed(2));
console.log("OVR pico promedio:          ", (ovrPeakTot / N).toFixed(1), " (target 73-77)");
console.log("\n=== OVR PICO — el techo es una pendiente (FIX-PACK §1) ===");
console.log("pico ≥ 80:", pct(pico80, N).padStart(7), "  target: 20-26%");
console.log("pico ≥ 85:", pct(pico85, N).padStart(7), "  target: 12-16%");
console.log("pico ≥ 90:", pct(pico90, N).padStart(7), "  target: 5-8%");
console.log("pico ≥ 95:", pct(pico95, N).padStart(7), "  target: 1.5-3%");
console.log("racha 3+: ", pct(racha3, N).padStart(7), "  target: ≥30% (FIX-PACK §3)");
console.log("\n=== EJEMPLOS DE CURVAS OVR (altos y bajos) ===");
for (const k in ejemplos) console.log(k.padEnd(10), ejemplos[k].vertical.padEnd(12), ejemplos[k].ovrSerie.join(" → "));

/* --- Golden --- */
const snapshot = { n: N, dist, emergTot, rescTot, ovrPeakTot, rondasTot };

if (flags.has("--update-golden")) {
  fs.mkdirSync(path.dirname(GOLDEN_PATH), { recursive: true });
  fs.writeFileSync(GOLDEN_PATH, JSON.stringify(snapshot, null, 2) + "\n");
  console.log("\n[golden] Actualizado " + path.relative(process.cwd(), GOLDEN_PATH) + " (N=" + N + ").");
}

if (flags.has("--check")) {
  console.log("\n=== CHECK GOLDEN (regla dura #1: la lógica económica no cambió) ===");
  if (!fs.existsSync(GOLDEN_PATH)) {
    console.error("[golden] FALTA " + GOLDEN_PATH + ". Generalo con: npm run sim:golden");
    process.exit(1);
  }
  const golden = JSON.parse(fs.readFileSync(GOLDEN_PATH, "utf8"));
  if (golden.n !== N) {
    console.error(`[golden] El golden fue generado con N=${golden.n} y esta corrida usa N=${N}. Corré con N=${golden.n}.`);
    process.exit(1);
  }
  const diffs = [];
  for (const key of ["emergTot", "rescTot", "ovrPeakTot", "rondasTot"]) {
    if (golden[key] !== snapshot[key]) diffs.push(`${key}: golden=${golden[key]} actual=${snapshot[key]}`);
  }
  const finales = new Set([...Object.keys(golden.dist), ...Object.keys(dist)]);
  for (const f of finales) {
    if ((golden.dist[f] || 0) !== (dist[f] || 0)) diffs.push(`dist.${f}: golden=${golden.dist[f] || 0} actual=${dist[f] || 0}`);
  }
  if (diffs.length) {
    console.error("[golden] ✗ LA DISTRIBUCIÓN CAMBIÓ — la lógica económica no es la validada:");
    for (const d of diffs) console.error("  · " + d);
    console.error("Si el cambio es intencional (recalibración de BAL), corré `npm run sim:golden`,");
    console.error("verificá targets §17 y commiteá el golden junto con el cambio.");
    process.exit(1);
  }
  console.log("[golden] ✓ Distribución idéntica al golden (N=" + N + "). Lógica económica intacta.");
}

/* --- Targets §17 --- */
const strict = flags.has("--strict-targets");
console.log("\n=== TARGETS PRD §17 (" + (strict ? "ESTRICTO" : "informativo hasta recalibración F3") + ") ===");
let fallas = 0;
for (const [final, t] of Object.entries(TARGETS)) {
  const p = (100 * (dist[final] || 0)) / N;
  const ok = p >= t.min && p <= t.max;
  if (!ok) fallas++;
  console.log(`${ok ? "✓" : "✗"} ${final.padEnd(12)} ${p.toFixed(1).padStart(5)}%  target ${t.min}-${t.max}%`);
}
{
  const ovrProm = ovrPeakTot / N;
  const ok = ovrProm >= OVR_PEAK_TARGET.min && ovrProm <= OVR_PEAK_TARGET.max;
  if (!ok) fallas++;
  console.log(`${ok ? "✓" : "✗"} ${"ovr_pico".padEnd(12)} ${ovrProm.toFixed(1).padStart(6)}  target ${OVR_PEAK_TARGET.min}-${OVR_PEAK_TARGET.max}`);
}
{
  const em = emergTot / N;
  const ok = em <= EMERG_MAX;
  if (!ok) fallas++;
  console.log(`${ok ? "✓" : "✗"} ${"emergencias".padEnd(12)} ${em.toFixed(2).padStart(6)}  target ≤ ${EMERG_MAX}`);
}
if (strict && fallas > 0) {
  console.error(`\n[targets] ✗ ${fallas} métricas fuera de target §17.`);
  process.exit(1);
}
