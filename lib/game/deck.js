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
import slots from "../../data/cards/11-slots.json" with { type: "json" };
import { etapaIdx, rng, TURN_YEARS, runwayMeses, mulberry32, hashStr } from "../engine/index.js";
import { EDAD_INICIAL } from "./meta.js";

export const ALL_CARDS = [
  ...macro.cartas, ...ejecutivo.cartas, ...generales.cartas, ...emergencia.cartas,
  ...ecommerce.cartas, ...hq.cartas, ...equipo.cartas, ...financiamiento.cartas,
  ...playa.cartas, ...color.cartas, ...slots.cartas,
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

/* Variantes del beat 2020 por rubro (SPEC v4 §2.2: el ancla es fija, el
   texto cambia). Regla dura verificada en CI: TODA carta que pueda salir
   como beat de 2020 ofrece exactamente una opción para activar Parlyx. */
export const VARIANTES_2020 = {};

const BEAT_IDS = new Set([
  ...Object.values(BEAT_2020),
  ...Object.values(VARIANTES_2020).flatMap((v) => Object.values(v)),
  "EC-25",
]);

/* Las rampas entre sillas: EC-27 te lleva al gigante, EC-32 te sienta de
   Ángel. Sin ellas, a las sillas B y C solo se llegaba quebrando.
   Estos pesos SON el knob de la distribución del §2.5 (B ya recibe además
   a los que quiebran vía DD-01, por eso pesa menos que la rampa al Ángel).
   Recalibrados con la SPEC v4: al pasar los 11 turnos a slots, las rampas
   dejaron de competir contra ~70 cartas del pool general y compiten contra
   las 8-14 de su slot, así que el mismo peso las volvía dominantes. */
const CARTAS_DE_SILLA = new Map([["EC-27", 1.7], ["EC-32", 2.6]]);

/* ============================================================
   SPEC v4 §2 — VARIANTES POR TURNO
   Cada uno de los 11 turnos tiene un pool temático de candidatas
   y la seed elige una al empezar la partida. Mismo momento
   narrativo, historia distinta: con 4-6 por slot, dos partidas
   no se parecen. El 2020 no está acá: es ancla de las tres
   sillas y no se sortea nunca.
   ============================================================ */
export const SLOTS = {
  1993: { tema: "El origen", candidatas: ["S-01", "S-02", "S-03", "S-04", "EC-01"], resto: ["G-01", "G-02", "T-01"] },
  1996: { tema: "Primer crecimiento", candidatas: ["S-05", "S-06", "S-07", "S-08", "S-09", "S-33"], resto: ["G-03", "M-01", "T-01", "G-04"] },
  1999: { tema: "Internet aparece", candidatas: ["S-10", "S-11", "S-12", "S-13", "S-34", "EC-02"], resto: ["G-16", "C-05", "M-01"] },
  2002: { tema: "La crisis", candidatas: ["S-14", "S-15", "S-16", "M-03", "EC-03"], resto: ["M-02", "G-10", "EC-13", "EC-17", "H-02"] },
  2005: { tema: "Profesionalizar", candidatas: ["S-17", "S-18", "S-19", "S-35", "EC-04", "EC-22"], resto: ["G-05", "G-06", "T-02", "EC-12", "EC-21", "H-01", "C-02", "EC-32"] },
  2008: { tema: "El golpe global", candidatas: ["S-20", "S-21", "S-22", "S-36", "M-05", "EC-23"], resto: ["G-08", "G-15", "EC-10", "EC-11", "EC-18", "H-05", "F-04", "C-03", "EC-27"] },
  2011: { tema: "Todo en el bolsillo", candidatas: ["S-23", "S-24", "S-38", "EC-05", "EC-14", "M-06"], resto: ["G-18", "G-20", "T-07", "T-08", "H-03", "H-06", "EC-27", "EC-32", "C-04"] },
  2014: { tema: "Marketplace", candidatas: ["S-25", "S-26", "S-27", "S-39", "EC-06"], resto: ["M-07", "M-08", "G-12", "G-14", "EC-15", "EC-19", "T-03", "H-04", "H-08", "F-01"] },
  2017: { tema: "La era social", candidatas: ["S-28", "S-29", "S-37", "EC-07", "EC-08", "EC-09"], resto: ["M-09", "M-11", "G-07", "G-09", "G-13", "EC-16", "EC-20", "T-04", "T-06", "F-03", "F-05", "C-01"] },
  2023: { tema: "El tiempo recuperado", candidatas: ["S-30", "S-31", "S-32", "S-40", "M-15"], resto: ["M-10", "M-12", "M-13", "M-14", "G-11", "G-17", "G-19", "T-05", "F-02", "H-07"] },
};

/* Qué tono favorece cada arco (§2.3): sesga, nunca prohíbe. */
const ARCO_TONO = {
  promesa: "crecimiento",
  meteoro: "crecimiento",
  desierto: "resistencia",
  artesano: "resistencia",
  montanarusa: null,
  ninguno: null,
};

/* Plan de slots por seed: determinístico, así el desafío por seed sigue
   funcionando. `evitar` son las cartas de las últimas 2 partidas guardadas
   en el dispositivo: se despriorizan, nunca se prohíben (§2.3). */
export function planSlots(seedStr, setup, arcoId, evitar = new Set()) {
  const rs = mulberry32(hashStr(seedStr + "::slots"));
  const tonoArco = ARCO_TONO[arcoId] || null;
  const plan = {};
  const yaElegidas = new Set();
  for (const [year, slot] of Object.entries(SLOTS)) {
    // `candidatas` es el núcleo temático del slot; `resto` son las cartas del
    // deck viejo que encajan en ese momento de la historia. Sin el resto, los
    // 11 turnos planificados dejarían ~70 cartas sin sortearse nunca.
    const nucleo = slot.candidatas.map(cardById).filter(Boolean);
    const resto = (slot.resto || []).map(cardById).filter(Boolean);
    const pool = [...nucleo, ...resto].filter((c) => !yaElegidas.has(c.id));
    if (!pool.length) continue;
    const esNucleo = new Set(nucleo.map((c) => c.id));
    const peso = (c) => {
      // el núcleo temático pesa más: el slot tiene que sonar a su época
      // Las rampas entre sillas conservan su peso adentro del slot: de ellas
      // depende la distribución del SPEC v3 §2.5, y con los 11 turnos
      // planificados ya no pasan por el sorteo general.
      let w = CARTAS_DE_SILLA.get(c.id) ?? (esNucleo.has(c.id) ? 1 : 0.55);
      if (tonoArco && c.tono === tonoArco) w *= 2; // el arco sesga
      if (c.tePaso?.rubros?.includes(setup.rubro)) w *= 2.5; // el rubro también
      if (evitar.has(c.id)) w *= 0.15; // anti-repetición local
      return w;
    };
    const tot = pool.reduce((a, c) => a + peso(c), 0);
    let pick = rs() * tot;
    let sel = pool[0];
    for (const c of pool) { pick -= peso(c); if (pick <= 0) { sel = c; break; } }
    plan[year] = sel.id;
    yaElegidas.add(sel.id);
  }
  return plan;
}

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
  if (card.bloque === "slots") return false; // §2: las candidatas entran SOLO por su slot
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

  // SPEC v4 §2: la carta del slot de este año, elegida por la seed al empezar.
  // Solo en la silla del fundador: corpo y ángel tienen sus propios pools.
  if (gs.mode === "founder" && gs.slotPlan?.[year] && !gs.used.has(gs.slotPlan[year])) {
    const c = cardById(gs.slotPlan[year]);
    if (c) {
      gs.used.add(c.id);
      gs.slotsVistos.push(c.id);
      return c;
    }
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
