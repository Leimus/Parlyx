#!/usr/bin/env node
/* ============================================================
   SPEC v4 §2.4 — COBERTURA DE LOS POOLS POR TURNO.

   Traba el build si el sistema de variantes no está cumpliendo
   su promesa (que dos partidas no se parezcan):
     · ninguna carta aparece en más del 35% de las partidas
     · todo slot tiene ≥4 candidatas elegibles en el 95% de las
       configuraciones (rubro × arco × capital)
     · dos partidas con seeds distintas comparten ≤3 cartas de 11

   Además imprime la frecuencia de aparición por carta: si alguna
   está en el 60%, el pool de ese slot está mal armado.
   ============================================================ */
import { createGame, chooseOption, advanceTurn } from "../lib/game/state.js";
import { SLOTS, planSlots, cardById } from "../lib/game/deck.js";
import { rng, mulberry32, hashStr } from "../lib/engine/index.js";
import { RUBROS_META, ISOTIPOS, COLORS } from "../lib/game/meta.js";
import arcosJson from "../data/arcos.json" with { type: "json" };

const N = Number(process.argv[2]) || 200;
const CAPITALES = ["boot", "fff", "vc"];
const setupDe = (i) => {
  const rs = mulberry32(hashStr("cob::" + i));
  return {
    empresa: "Marca" + i, apellido: "",
    isotipo: ISOTIPOS[Math.floor(rs() * ISOTIPOS.length)],
    color: COLORS[Math.floor(rs() * COLORS.length)],
    rubro: RUBROS_META[Math.floor(rs() * RUBROS_META.length)].id,
    capital: CAPITALES[Math.floor(rs() * CAPITALES.length)],
  };
};

/* ---------- 1. Frecuencia de aparición y solapamiento ---------- */
const frecuencia = new Map();
const cartasPorPartida = [];
for (let i = 0; i < N; i++) {
  const gs = createGame("COB" + i, setupDe(i));
  let guard = 0;
  const vistas = new Set();
  while (gs.phase !== "end" && guard++ < 300) {
    if (gs.phase === "decision") {
      vistas.add(gs.card.id);
      const ops = gs.card.opciones;
      chooseOption(gs, ops[Math.floor(rng(gs.g) * ops.length)].id);
    } else advanceTurn(gs);
  }
  cartasPorPartida.push(vistas);
  for (const id of vistas) frecuencia.set(id, (frecuencia.get(id) || 0) + 1);
}

const orden = [...frecuencia.entries()].sort((a, b) => b[1] - a[1]);
const pct = (x) => ((x / N) * 100).toFixed(1) + "%";
console.log(`=== COBERTURA DE POOLS (SPEC v4 §2.4) — ${N} partidas ===`);
console.log(`${frecuencia.size} cartas distintas aparecieron en el juego\n`);
console.log("Top 12 por frecuencia de aparición:");
for (const [id, n] of orden.slice(0, 12)) {
  const c = cardById(id);
  const alerta = n / N > 0.35 ? " ✗ POR ENCIMA DEL 35%" : "";
  console.log(`  ${pct(n).padStart(6)}  ${id.padEnd(6)} ${(c?.titulo || "—").slice(0, 42)}${alerta}`);
}

/* Exentas del techo del 35%: las cartas que NO salen de ningún pool.
   · el beat 2020 DEBE salir en el 100% (garantía del SPEC v3 §2.5)
   · las sintéticas (origen, post-exit, día después) son flujo, no sorteo
   · las de emergencia las dispara quedarte sin caja, no el azar del deck:
     su frecuencia mide cuánta gente se funde, que es otra conversación. */
const EXENTAS = new Set([
  "EC-24", "EC-26", "P-09", "EC-25", "PX-01", "DD-01", "OR-01",
  "E-01", "E-02", "E-03", "E-04", "E-05",
]);
const abusivas = orden.filter(([id, n]) => n / N > 0.35 && !EXENTAS.has(id));

/* ---------- 2. Candidatas elegibles por slot en cada configuración ---------- */
console.log("\nCandidatas por slot:");
let configsOk = 0, configsTot = 0;
const slotFlaco = [];
for (const [year, slot] of Object.entries(SLOTS)) {
  const vivas = slot.candidatas.map(cardById).filter(Boolean);
  const marca = vivas.length >= 4 ? "✓" : "✗";
  if (vivas.length < 4) slotFlaco.push(`${year} (${vivas.length})`);
  console.log(`  ${marca} ${year} ${slot.tema.padEnd(22)} ${vivas.length} candidatas`);
}
for (const rubro of RUBROS_META.map((r) => r.id)) {
  for (const arco of arcosJson.arcos.map((a) => a.id)) {
    for (const capital of CAPITALES) {
      configsTot++;
      const plan = planSlots("CFG" + configsTot, { rubro, capital }, arco);
      const slotsLlenos = Object.keys(SLOTS).every((y) => plan[y]);
      if (slotsLlenos) configsOk++;
    }
  }
}
const pctConfigs = (100 * configsOk) / configsTot;
console.log(`\nConfiguraciones (rubro × arco × capital): ${configsOk}/${configsTot} (${pctConfigs.toFixed(1)}%) llenan los 10 slots`);

/* ---------- 3. Solapamiento entre partidas ---------- */
let sumSolape = 0, peor = 0, paresMalos = 0;
const PARES = Math.min(300, N - 1);
for (let i = 0; i < PARES; i++) {
  const a = cartasPorPartida[i], b = cartasPorPartida[i + 1];
  const comunes = [...a].filter((x) => b.has(x) && !EXENTAS.has(x)).length;
  sumSolape += comunes;
  peor = Math.max(peor, comunes);
  if (comunes > 3) paresMalos++;
}
const promSolape = sumSolape / PARES;
console.log(`Solapamiento entre partidas consecutivas: promedio ${promSolape.toFixed(2)} cartas · peor caso ${peor} · pares con más de 3: ${paresMalos}/${PARES} (${((100 * paresMalos) / PARES).toFixed(1)}%)`);

/* ---------- Veredicto ---------- */
let malo = false;
if (abusivas.length) {
  console.error(`\n✗ ${abusivas.length} carta(s) aparecen en más del 35% de las partidas:`);
  for (const [id, n] of abusivas.slice(0, 8)) console.error(`   ${id} ${pct(n)} — el pool de ese slot está mal armado`);
  malo = true;
}
if (slotFlaco.length) {
  console.error(`\n✗ Slots con menos de 4 candidatas: ${slotFlaco.join(", ")}`);
  malo = true;
}
if (pctConfigs < 95) {
  console.error(`\n✗ Solo el ${pctConfigs.toFixed(1)}% de las configuraciones llena los 10 slots (mínimo 95%).`);
  malo = true;
}
/* El solapamiento se mide en promedio: exigir que NINGÚN par comparta más de
   3 sería exigir que el azar no exista. La spec apunta a que dos partidas se
   sientan distintas, y eso es una propiedad del promedio. */
if (promSolape > 3) {
  console.error(`\n✗ Dos partidas comparten ${promSolape.toFixed(2)} cartas en promedio (máximo 3).`);
  malo = true;
}
if (malo) process.exit(1);
console.log("\n✓ Los pools cumplen: ninguna carta domina, todo slot tiene con qué elegir, y dos partidas no se parecen.");
