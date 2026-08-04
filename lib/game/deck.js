/* ============================================================
   Deck en runtime: carga las 102 cartas, resuelve elegibilidad
   estructurada y elige la carta de cada turno.

   Alcance F2 (documentado): juega los modos founder y playa.
   El modo ejecutivo (bloque EJ, D6) requiere sistemas que el
   motor v1 no tiene (cargo, patrimonio recurrente) y entra con
   la integración F3. Las condiciones en prosa (`condicion` /
   `trigger` de texto libre) no bloquean la elegibilidad, salvo
   las cartas forzadas (emergencia) que solo entran por su flujo.
   ============================================================ */
import macro from "../../data/cards/01-macro.json" with { type: "json" };
import ejecutivo from "../../data/cards/02-ejecutivo.json" with { type: "json" };
import generales from "../../data/cards/03-generales.json" with { type: "json" };
import emergencia from "../../data/cards/04-emergencia.json" with { type: "json" };
import vertical from "../../data/cards/05-vertical.json" with { type: "json" };
import hq from "../../data/cards/06-hq.json" with { type: "json" };
import equipo from "../../data/cards/07-equipo.json" with { type: "json" };
import financiamiento from "../../data/cards/08-financiamiento.json" with { type: "json" };
import playa from "../../data/cards/09-playa.json" with { type: "json" };
import color from "../../data/cards/10-color.json" with { type: "json" };
import { etapaIdx, rng, TURN_YEARS, runwayMeses } from "../engine/index.js";
import { EDAD_INICIAL } from "./meta.js";

export const ALL_CARDS = [
  ...macro.cartas, ...ejecutivo.cartas, ...generales.cartas, ...emergencia.cartas,
  ...vertical.cartas, ...hq.cartas, ...equipo.cartas, ...financiamiento.cartas,
  ...playa.cartas, ...color.cartas,
];
const BY_ID = new Map(ALL_CARDS.map((c) => [c.id, c]));
export const cardById = (id) => BY_ID.get(id);

export const MACRO_CARDS = macro.cartas;

export function matchTePaso(card, setup) {
  const tp = card.tePaso;
  if (!tp) return false;
  if (tp.verticales?.includes(setup.vertical)) return true;
  if (tp.hqs?.includes(setup.hq)) return true;
  return false;
}

/* Elegibilidad estructurada (campos mecanizados del schema). */
function eligible(card, gs) {
  const g = gs.g;
  const el = card.elegibilidad;
  const year = TURN_YEARS[g.ti];
  const modo = gs.mode; // founder | playa
  if (!el.modos.includes(modo)) return false;
  if (card.forzada) return false; // emergencia: solo por su flujo
  if (card.bloque === "ejecutivo") return false; // D6 llega con F3 (sus triggers son prosa)
  if (g.public && ["F-01", "F-05", "G-14"].includes(card.id)) return false; // ya cotizás: sin IPO/venta temprana
  if (gs.used.has(card.id)) return false;
  if (el.ventana && (year < el.ventana[0] || year > el.ventana[1])) return false;
  if (el.verticales && !el.verticales.includes(gs.setup.vertical)) return false;
  if (el.hqs && !el.hqs.includes(gs.hq)) return false;
  if (el.hqNo && el.hqNo.includes(gs.hq)) return false;
  const eIdx = etapaIdx(g.val);
  if (el.etapaMin != null && eIdx < el.etapaMin) return false;
  if (el.etapaMax != null && eIdx > el.etapaMax) return false;
  const turno = g.ti + 1;
  if (el.turnoMin != null && turno < el.turnoMin) return false;
  if (el.turnoMax != null && turno > el.turnoMax) return false;
  if (el.ovrMin != null && g.ovr < el.ovrMin) return false;
  if (el.patMin != null && g.pat < el.patMin) return false;
  const edad = EDAD_INICIAL + (year - 1993);
  if (el.edadMax != null && edad > el.edadMax) return false;
  return true;
}

/* Plan macro por seed (PRD §9.2): 1-3 cartas macro asignadas a años,
   con peso ×2 si matchean vertical/HQ (TE PASÓ). rs = PRNG del setup. */
export function planMacro(rs, setup) {
  const macroCount = 1 + Math.floor(rs() * 3);
  const weighted = MACRO_CARDS.map((c) => ({
    c,
    wgt: matchTePaso(c, setup) ? 2 : 1,
  }));
  const plan = {};
  const used = new Set();
  for (let i = 0; i < macroCount; i++) {
    const pool = weighted.filter(
      (x) =>
        !used.has(x.c.id) &&
        TURN_YEARS.some((y) => y >= x.c.elegibilidad.ventana[0] && y <= x.c.elegibilidad.ventana[1] && !plan[y])
    );
    if (!pool.length) break;
    const tot = pool.reduce((a, b) => a + b.wgt, 0);
    let pick = rs() * tot;
    let sel = pool[0];
    for (const p of pool) { pick -= p.wgt; if (pick <= 0) { sel = p; break; } }
    const years = TURN_YEARS.filter(
      (y) => y >= sel.c.elegibilidad.ventana[0] && y <= sel.c.elegibilidad.ventana[1] && !plan[y]
    );
    plan[years[Math.floor(rs() * years.length)]] = sel.c.id;
    used.add(sel.c.id);
  }
  return plan;
}

/* Carta del turno. Prioridad: macro planificada → pool elegible ponderado.
   Pesos: financiamiento ×4 con runway corto · match temático ×2 ·
   color (T5) limitado a 1 cada 3 decisiones. */
export function pickCard(gs) {
  const g = gs.g;
  const year = TURN_YEARS[g.ti];

  if (gs.mode === "founder" && gs.macroPlan[year] && !gs.used.has(gs.macroPlan[year])) {
    const c = cardById(gs.macroPlan[year]);
    gs.used.add(c.id);
    return c;
  }

  const pool = ALL_CARDS.filter((c) => eligible(c, gs));
  const rwMeses = runwayMeses(g);
  const colorOk = gs.decisionesDesdeColor >= 3;
  const wOf = (c) => {
    if (c.tipo === "T5" && !colorOk) return 0.05;
    if (c.bloque === "financiamiento" || c.tipo === "T7") return !g.public && rwMeses < 14 ? 4 : 1;
    if (c.elegibilidad.verticales || c.elegibilidad.hqs || matchTePaso(c, gs.setup)) return 2;
    return 1;
  };
  const elig = pool.filter((c) => wOf(c) > 0 || pool.length < 3);
  const list = elig.length ? elig : pool;
  if (!list.length) return cardById(gs.mode === "playa" ? "P-06" : "G-04"); // fallback siempre jugable
  const tot = list.reduce((a, c) => a + wOf(c), 0);
  let pick = rng(g) * tot;
  let sel = list[0];
  for (const c of list) { pick -= wOf(c); if (pick <= 0) { sel = c; break; } }
  gs.used.add(sel.id);
  if (sel.tipo === "T5") gs.decisionesDesdeColor = 0;
  else gs.decisionesDesdeColor++;
  return sel;
}

/* Cadena de emergencia (runway 0 agotados los rescates del motor).
   E-01 si hubo inversores; E-03 si bootstrap con patrimonio; si no, E-01
   sin la opción de inversores. */
export function pickEmergency(gs) {
  const g = gs.g;
  if (g.rondas > 0 || gs.setup.capital === "vc") return { card: cardById("E-01"), soloSinInversores: false };
  if (g.pat > 0) return { card: cardById("E-03"), soloSinInversores: false };
  return { card: cardById("E-01"), soloSinInversores: true };
}

/* Carta sintética post-exit (la "¿Y ahora qué?" del prototipo). */
export const POST_EXIT_CARD = {
  id: "PX-01",
  bloque: "generales",
  titulo: "¿Y ahora qué?",
  flavor: "Firmaste. La plata está en la cuenta. El lunes te despertaste sin mails urgentes por primera vez en años.",
  tipo: "T3",
  sintetica: true,
  elegibilidad: { modos: ["founder"] },
  opciones: [
    { id: "A", label: "Fundar de nuevo", raw: "comeback: OVR 60 · techo re-sorteado · tu plata banca el arranque", efectos: { special: "comeback" } },
    { id: "B", label: "Retirarte a la playa", raw: "modo playa: que la plata trabaje (o no)", efectos: { special: "playa" } },
  ],
};
