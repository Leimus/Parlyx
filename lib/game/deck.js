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
import ecommerce from "../../data/cards/05-ecommerce.json" with { type: "json" };
import hq from "../../data/cards/06-hq.json" with { type: "json" };
import equipo from "../../data/cards/07-equipo.json" with { type: "json" };
import financiamiento from "../../data/cards/08-financiamiento.json" with { type: "json" };
import playa from "../../data/cards/09-playa.json" with { type: "json" };
import color from "../../data/cards/10-color.json" with { type: "json" };
import { etapaIdx, rng, TURN_YEARS, runwayMeses } from "../engine/index.js";
import { EDAD_INICIAL } from "./meta.js";

export const ALL_CARDS = [
  ...macro.cartas, ...ejecutivo.cartas, ...generales.cartas, ...emergencia.cartas,
  ...ecommerce.cartas, ...hq.cartas, ...equipo.cartas, ...financiamiento.cartas,
  ...playa.cartas, ...color.cartas,
];
const BY_ID = new Map(ALL_CARDS.map((c) => [c.id, c]));
export const cardById = (id) => BY_ID.get(id);

export const MACRO_CARDS = macro.cartas;

export function matchTePaso(card, setup) {
  const tp = card.tePaso;
  if (!tp) return false;
  if (tp.rubros?.includes(setup.rubro)) return true;
  if (tp.hqs?.includes(setup.hq)) return true;
  return false;
}

/* Las tres sillas (SPEC v3 §2). "austero" es la silla B con menos escala:
   no sos dueño y cobrás un sueldo, igual que en el gigante. */
export const sillaDe = (mode) => (mode === "founder" ? "A" : mode === "playa" ? "C" : "B");
export const modoSilla = (mode) => (mode === "austero" ? "corpo" : mode);

/* El beat 2020 es ancla obligatoria en las TRES sillas (SPEC v3 §2.3):
   cambia el texto, nunca la estructura. */
export const BEAT_2020 = { founder: "EC-24", corpo: "EC-26", playa: "P-09" };
const BEAT_IDS = new Set([...Object.values(BEAT_2020), "EC-25"]);

/* Las rampas entre sillas: EC-27 te lleva al gigante, EC-32 te sienta de
   Ángel. Sin ellas, a las sillas B y C solo se llegaba quebrando.
   Estos pesos SON el knob de la distribución del §2.5 (B ya recibe además
   a los que quiebran vía DD-01, por eso pesa menos que la rampa al Ángel). */
const CARTAS_DE_SILLA = new Map([["EC-27", 3], ["EC-32", 6]]);

/* Elegibilidad estructurada (campos mecanizados del schema). */
function eligible(card, gs) {
  const g = gs.g;
  const el = card.elegibilidad;
  const year = TURN_YEARS[g.ti];
  const modo = modoSilla(gs.mode); // founder | corpo | playa
  if (!el.modos.includes(modo)) return false;
  if (card.forzada) return false; // emergencia: solo por su flujo
  if (card.bloque === "ejecutivo") return false; // D6 llega con F3 (sus triggers son prosa)
  if (g.public && ["F-01", "F-05", "G-14"].includes(card.id)) return false; // ya cotizás: sin IPO/venta temprana
  if (gs.used.has(card.id)) return false;
  if (BEAT_IDS.has(card.id)) return false; // beats anclados: entran solo por su ancla
  if (el.ventana && (year < el.ventana[0] || year > el.ventana[1])) return false;
  if (el.rubros && !el.rubros.includes(gs.setup.rubro)) return false;
  if (el.hqs && !el.hqs.includes(gs.hq)) return false;
  if (el.hqNo && el.hqNo.includes(gs.hq)) return false;
  const eIdx = etapaIdx(g.val);
  if (el.etapaMin != null && eIdx < el.etapaMin) return false;
  if (el.etapaMax != null && eIdx > el.etapaMax) return false;
  const turno = g.ti + 1;
  if (el.turnoMin != null && turno < el.turnoMin) return false;
  if (el.turnoMax != null && turno > el.turnoMax) return false;
  // Early game (PRD v0.3 §8): nada de term sheets antes del turno 3 Y etapa Seed
  if ((card.bloque === "financiamiento" || card.tipo === "T7") && (turno < 3 || eIdx < 1)) return false;
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
        TURN_YEARS.some((y) => y !== 2020 && y >= x.c.elegibilidad.ventana[0] && y <= x.c.elegibilidad.ventana[1] && !plan[y])
    );
    if (!pool.length) break;
    const tot = pool.reduce((a, b) => a + b.wgt, 0);
    let pick = rs() * tot;
    let sel = pool[0];
    for (const p of pool) { pick -= p.wgt; if (pick <= 0) { sel = p; break; } }
    const years = TURN_YEARS.filter(
      (y) => y !== 2020 && y >= sel.c.elegibilidad.ventana[0] && y <= sel.c.elegibilidad.ventana[1] && !plan[y]
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

  // Turno 1 es SIEMPRE "El Origen" (PRD v0.3 §8)
  if (g.ti === 0 && gs.mode === "founder" && !gs.used.has("OR-01")) {
    gs.used.add("OR-01");
    return ORIGEN_CARD;
  }

  // EL BEAT 2020, ANCLADO EN LAS TRES SILLAS (SPEC v3 §2.3).
  // La condición es !gs.beatParlyx (no `used`): así es imposible que se
  // dispare dos veces, e imposible que no se dispare — 2020 siempre se
  // juega, y pickCard es la única fuente de cartas. De ahí sale la
  // garantía del 100% que verifica scripts/test-beat-parlyx.mjs.
  if (year === 2020 && !gs.beatParlyx) {
    const id = BEAT_2020[modoSilla(gs.mode)];
    gs.used.add(id);
    gs.beatParlyx = { year, silla: sillaDe(gs.mode), cardId: id };
    return cardById(id);
  }
  // 2023 = "El tiempo que recuperaste", solo si activaste Parlyx siendo fundador.
  if (year === 2023 && gs.mode === "founder" && gs.parlyx && !gs.used.has("EC-25")) {
    gs.used.add("EC-25");
    return cardById("EC-25");
  }

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
    // Las dos rampas entre sillas (SPEC v3 §2): son los únicos caminos
    // voluntarios a corpo y a ángel, y la distribución objetivo del §2.5
    // depende de que aparezcan. Este peso ES el knob de tuneo de sillas.
    if (CARTAS_DE_SILLA.has(c.id)) return CARTAS_DE_SILLA.get(c.id);
    if (c.bloque === "financiamiento" || c.tipo === "T7") return !g.public && rwMeses < 14 ? 4 : 1;
    if (c.elegibilidad.verticales || c.elegibilidad.hqs || matchTePaso(c, gs.setup)) return 2;
    return 1;
  };
  const elig = pool.filter((c) => wOf(c) > 0 || pool.length < 3);
  const list = elig.length ? elig : pool;
  // Fallback siempre jugable, uno por silla (un corpo de 8 turnos agota sus
  // cartas y no puede caer en una carta de fundador).
  if (!list.length) {
    const m = modoSilla(gs.mode);
    return cardById(m === "playa" ? "P-06" : m === "corpo" ? "EC-28" : "G-04");
  }
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

/* Turno 1 garantizado (PRD v0.3 §8 + pivote v1.0): el origen de toda marca. */
export const ORIGEN_CARD = {
  id: "OR-01",
  bloque: "generales",
  titulo: "El Origen",
  flavor: "Tenés un laburo estable y una idea que no te deja dormir: tu propia marca. Es 1993: un local, un catálogo y fe.",
  tipo: "T3",
  sintetica: true,
  elegibilidad: { modos: ["founder"] },
  opciones: [
    { id: "A", label: "Renunciar y abrir el local", raw: "3 meses menos de caja · sin red, con hambre", efectos: { rw: -3, tend: 2 } },
    { id: "B", label: "Arrancar los fines de semana", raw: "sin riesgo · el envión llega más tarde", efectos: { tendLenta: 1 } },
    { id: "C", label: "Seguir empleado y vender de noche", raw: "+3 meses de caja · dormís poco", efectos: { rw: 3, tend: 1 } },
  ],
};

/* La quiebra no es un final: es un capítulo (PRD v1.0 §7). */
export const DIA_DESPUES_CARD = {
  id: "DD-01",
  bloque: "generales",
  titulo: "El día después",
  flavor: "La marca cerró. Dormiste doce horas por primera vez en años. A la mañana, tres caminos sobre la mesa.",
  tipo: "T3",
  sintetica: true,
  elegibilidad: { modos: ["founder"] },
  opciones: [
    { id: "A", label: "El gigante del e-commerce regional te ficha", raw: "sueldo grande, oficina con vista · la tabla sigue con su camiseta", efectos: { special: "corpo" } },
    { id: "B", label: "Refundar con lo aprendido", raw: "misma cancha, más cicatrices · arrancás con OVR 60", efectos: { special: "comeback" } },
    { id: "C", label: "Un laburo tranquilo y años de reflexión", raw: "la vida sigue, más despacio · la tabla también", efectos: { special: "austero" } },
  ],
};

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
