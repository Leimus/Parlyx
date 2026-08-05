/* ============================================================
   Capa de juego F2: máquina de estados del core loop sobre el
   motor REAL (lib/engine, intacto — el golden de CI lo prueba)
   y el deck REAL (data/cards vía lib/game/deck).

   setup → turn(1..11) → resolve → (emergencia|post-exit)? → end

   La economía de cada trienio es simulateTrienio() del motor.
   Las cartas aplican efectos con la MISMA semántica que el
   motor usa para decisionesFx (ovr/tend/cashM/arrMul) más los
   campos extra del deck (eq, pat, flags, techo, markers) que
   el motor todavía no modela. Nada de esto toca lib/engine.
   ============================================================ */
import {
  newGame, simulateTrienio, computeEnd, clampOvr, burnMensual, runwayMeses,
  etapaIdx, sortearTecho, rng, hashStr, mulberry32, TURN_YEARS, eraFor,
} from "../engine/index.js";
import { pickCard, pickEmergency, planMacro, cardById, matchTePaso, POST_EXIT_CARD } from "./deck.js";
import { NOMBRES, ETAPAS, fmtUSD } from "./meta.js";
import { nuevoContadorEjes, contarDecision, computeMote } from "./arquetipos.js";
import arcosJson from "../../data/arcos.json" with { type: "json" };

/* Probabilidad de crítico dorado sobre apuestas ganadas (anexo v0.4 §1.1). */
const PROB_CRITICO = 0.05;

/* ---------- Arcos narrativos (PRD v0.3 §5 — sesgan, no dictan) ---------- */
function sortearArco(rs) {
  const r = rs();
  let acc = 0;
  for (const a of arcosJson.arcos) {
    acc += a.prob;
    if (r < acc) return a;
  }
  return arcosJson.arcos[arcosJson.arcos.length - 1];
}

function buildArcoBias(arco, rs) {
  const bias = new Array(TURN_YEARS.length).fill(0);
  for (const f of arco.fases || []) {
    for (let t = f.desde; t <= f.hasta && t <= bias.length; t++) bias[t - 1] = f.bias;
  }
  if (arco.crash) {
    const [d, h] = arco.crash.ventana;
    const t = d + Math.floor(rs() * (h - d + 1));
    bias[t - 1] = arco.crash.bias;
  }
  if (arco.alternancia) {
    const { periodo, bias: b } = arco.alternancia;
    for (let t = 0; t < bias.length; t++) bias[t] = Math.floor(t / periodo) % 2 === 0 ? b : -b;
  }
  return bias;
}

/* Mecanizaciones puntuales que el JSON deja en raw (factores de venta). */
const SELL_FACTOR = { sellNow: 1, sellPeak: 1.5, sellStrategic: 1.1, exitDecente: 1 };
const SELL_OVERRIDE = { "G-14:C": 2 }; // "aceptan, Exit ×2"
const CAMBIA_HQ = { "M-03": "mia", "H-07": "ba" };

export function createGame(seedStr, setup) {
  const g = newGame(seedStr, setup.vertical, setup.capital);
  const rs = mulberry32(hashStr(seedStr + "::macro"));
  const rsArco = mulberry32(hashStr(seedStr + "::arco"));
  const arco = sortearArco(rsArco);
  const arcoBias = buildArcoBias(arco, rsArco);
  if (arco.techoMax) g.techo = Math.min(g.techo, arco.techoMax);
  const gs = {
    seedStr, setup,
    g,
    hq: setup.hq,
    mode: "founder",
    macroPlan: planMacro(rs, setup),
    used: new Set(),
    decisionesDesdeColor: 3,
    flags: new Set(),
    markers: [],
    logros: {},
    rows: [],
    hist: [g.val],
    exits: [],
    coN: 1,
    coName: setup.empresa,
    coEmoji: setup.emoji,
    coColor: setup.color,
    pendingPostExit: false,
    retired: false,
    acquihire: false,
    ipoTecnico: false,
    pendingValMul: 1,
    arco: arco.id,
    arcoBias,
    ejes: nuevoContadorEjes(),
    decisionesConTag: 0,
    decisionLog: [],
    mote: null,
    casi: null,
    card: null,
    chosen: null,
    result: null,
    momentum: null,
    phase: "decision", // decision | resolved | end
    endInfo: null,
  };
  gs.card = pickCard(gs);
  return gs;
}

/* Crítico dorado (anexo §1.1): duplica los efectos numéricos de la rama
   ganada. Flags, markers, hitos y specials no se duplican. */
function duplicarEfectos(ef) {
  const d = { ...ef };
  for (const k of ["ovr", "tend", "tendLenta", "rw", "eq", "pat", "patPct", "techoDelta", "cargo"]) {
    if (d[k]) d[k] *= 2;
  }
  for (const k of ["arrMul", "patMul", "valMul", "multMul"]) {
    if (d[k]) d[k] = 1 + (d[k] - 1) * 2;
  }
  return d;
}

function logro(gs, emoji) {
  gs.logros[emoji] = (gs.logros[emoji] || 0) + 1;
}

function doSell(gs, mult) {
  const g = gs.g;
  const v = Math.max(g.val * mult, 2e6);
  g.pat += v * (g.eq / 100);
  gs.exits.push({ name: gs.coName, val: v });
  logro(gs, "💰");
  gs.pendingPostExit = true;
}

function doComeback(gs, year) {
  const g = gs.g;
  gs.coN += 1;
  const pool = NOMBRES.filter((n) => n !== gs.coName);
  gs.coName = pool[Math.floor(rng(g) * pool.length)];
  g.ovr = 60;
  g.ovrPeak = Math.max(g.ovrPeak, 60);
  // techo re-sorteado con +10% de probabilidad en tramos altos (PRD §11.4)
  g.techo = sortearTecho(Math.min(0.999, rng(g) + 0.1), rng(g));
  g.arr = 0;
  g.val = 400000;
  g.eq = 100;
  g.emp = 3;
  g.public = false;
  g.dead = false;
  g.rondas = 0;
  g.rescates = 0;
  g.estado = "sana";
  g.tendQueue = [{ v: 1, left: 2 }];
  const meses = Math.min(30, 10 + Math.floor(g.pat / 400000));
  g.cash = Math.max(100000, meses * burnMensual(g));
  gs.pendingPostExit = false;
  gs.retired = false;
  gs.mode = "founder";
  logro(gs, "🔁");
  gs.markers.push({ year, m: "🔁" });
}

function applyEfectos(gs, ef, year, ctx) {
  if (!ef) return;
  const g = gs.g;
  if (ef.ovr) g.ovr = clampOvr(g, g.ovr + ef.ovr);
  if (ef.tend) g.tendQueue.push({ v: ef.tend, left: 2 });
  if (ef.tendLenta) g.tendQueue.push({ v: ef.tendLenta, left: 2, delay: 1 });
  if (ef.rw) g.cash += ef.rw * burnMensual(g); // misma semántica que cashM del motor
  if (ef.eq) g.eq = Math.max(1, Math.min(100, g.eq + ef.eq));
  if (ef.arrMul) g.arr *= ef.arrMul;
  if (ef.pat) g.pat += ef.pat;
  if (ef.patMul) g.pat = Math.max(0, g.pat * ef.patMul);
  if (ef.patPct) g.pat = Math.max(0, g.pat * (1 + ef.patPct));
  if (ef.valMul) gs.pendingValMul *= ef.valMul;
  if (ef.multMul) gs.pendingValMul *= ef.multMul; // múltiplo de era del trienio ≈ valuación del trienio
  if (ef.techoDelta) g.techo = Math.max(60, Math.min(99, g.techo + ef.techoDelta));
  if (ef.flags) for (const f of ef.flags) gs.flags.add(f);
  if (ef.quitaFlags) for (const f of ef.quitaFlags) gs.flags.delete(f);
  if (ef.marker) gs.markers.push({ year, m: ef.marker });
  if (ef.hito) logro(gs, ef.hito);
  if (ef.special) applySpecial(gs, ef.special, year, ctx);
}

function applySpecial(gs, special, year, ctx) {
  const g = gs.g;
  if (special in SELL_FACTOR) {
    doSell(gs, SELL_OVERRIDE[ctx] ?? SELL_FACTOR[special]);
    return;
  }
  switch (special) {
    case "ipo":
    case "ipoTecnico":
      if (!g.public) {
        g.public = true;
        g.ipoVal = g.val;
        g.pat += g.val * (g.eq / 100) * 0.2;
        // el logro 🔔 lo suma el hito de la carta o autoLogros (no acá: evita el doble conteo)
        if (special === "ipoTecnico") gs.ipoTecnico = true;
      }
      break;
    case "patTodo":
      g.pat = 0;
      break;
    case "cambiaHQ": {
      const dest = CAMBIA_HQ[ctx.split(":")[0]];
      if (dest) gs.hq = dest;
      gs.markers.push({ year, m: "↳" });
      break;
    }
    case "retechear":
      g.techo = Math.min(99, g.techo + 6);
      break;
    case "habilitaRetiro":
      gs.flags.add("retiro_habilitado");
      break;
    case "comeback":
      doComeback(gs, year);
      break;
    case "playa":
      gs.retired = true;
      gs.mode = "playa";
      gs.pendingPostExit = false;
      logro(gs, "🏖");
      break;
    case "salidaConEquity":
      // F-02 C: te vas conservando el equity — en F2 lo tratamos como
      // venta secundaria al valor actual y elección post-exit.
      doSell(gs, 1);
      gs.markers.push({ year, m: "↳" });
      break;
    case "finalCerrasteBien":
      g.dead = true;
      break;
    case "finalTeCompraronPorElEquipo": {
      // PAT +300K-1M según OVR (E-04)
      const monto = Math.max(300000, Math.min(1e6, 300000 + (g.ovr - 50) * 17500));
      g.pat += monto;
      gs.exits.push({ name: gs.coName, val: Math.min(g.val, 2e6) });
      gs.acquihire = true;
      g.dead = true;
      break;
    }
    // Especiales de modo ejecutivo / flavor sin mecánica en F2:
    case "modoInversor":
    case "spinOff":
    default:
      break;
  }
}

/* El jugador elige una opción de la carta actual. */
export function chooseOption(gs, opId) {
  if (gs.phase !== "decision") return;
  const card = gs.card;
  const op = card.opciones.find((o) => o.id === opId);
  if (!op) return;
  const g = gs.g;
  const year = TURN_YEARS[Math.min(g.ti, TURN_YEARS.length - 1)];
  const ctx = `${card.id}:${op.id}`;
  gs.chosen = opId;
  gs.decisionesConTag += contarDecision(gs.ejes, card.id, op.id) > 0 ? 1 : 0;
  applyEfectos(gs, op.efectos, year, ctx);
  let goto = op.goto || null;
  let result = null;
  let win = null;
  if (op.apuesta) {
    win = rng(g) < op.apuesta.p;
    const rama = win ? op.apuesta.gana : op.apuesta.pierde;
    // Crítico dorado: 5% de las apuestas ganadas con efectos → ×2 (nunca hay crítico malo)
    const critico = win && rama.efectos && rng(g) < PROB_CRITICO;
    applyEfectos(gs, critico ? duplicarEfectos(rama.efectos) : rama.efectos, year, ctx);
    if (rama.goto) goto = rama.goto;
    result = { good: win, critico, texto: rama.texto || (win ? "Salió bien" : "Salió mal") };
  }
  gs.result = result;
  gs.decisionLog.push({ cardId: card.id, opId: op.id, year, win });

  // Cadena forzada (emergencia E-01→E-02/E-04/E-05): la siguiente carta
  // reemplaza a la actual en el mismo turno, sin simular en el medio.
  if (goto) {
    const next = cardById(goto);
    if (next) {
      gs.used.add(next.id);
      // pequeña pausa visual: el goto se muestra tras "Continuar"
      gs.gotoNext = next;
    }
  }
  // En emergencia: si la opción repuso caja, la empresa revive.
  if (card.bloque === "emergencia" && g.dead && g.cash > 0) {
    g.dead = false;
    g.estado = "rescatada";
  }
  gs.phase = "resolved";
}

/* Fila de la tabla para el año recién simulado (o de playa). */
function pushRow(gs, year, prevArr, prevVal) {
  const g = gs.g;
  const prevHitos = new Set(gs.rows.flatMap((r) => r.hitos));
  gs.rows.push({
    year,
    name: gs.mode === "playa" ? "— Playa —" : gs.coName,
    emoji: gs.mode === "playa" ? "🏝" : gs.coEmoji,
    color: gs.mode === "playa" ? "#22D3EE" : gs.coColor,
    etapa: gs.mode === "playa" ? "Retiro" : g.public ? "Pública" : ETAPAS[etapaIdx(g.val)],
    ovr: g.ovr,
    arr: gs.mode === "playa" ? 0 : g.arr,
    val: g.val,
    emp: g.emp,
    pat: g.pat,
    playa: gs.mode === "playa",
    markers: gs.markers.filter((m) => m.year === year).map((m) => m.m),
    hitos: Object.keys(gs.logros).filter((h) => !prevHitos.has(h)),
    down: gs.mode === "playa" ? g.pat < (prevVal ?? g.pat) : g.arr < prevArr * 0.98 || g.val < prevVal * 0.9,
  });
}

function autoLogros(gs, wasPublic) {
  const g = gs.g;
  if (g.arr >= 1e6 && !gs.logros["💵"]) logro(gs, "💵");
  if (g.arr >= 10e6 && !gs.logros["📈"]) logro(gs, "📈");
  if (g.emp >= 100 && !gs.logros["👥"]) logro(gs, "👥");
  if (g.val >= 1e9 && !gs.logros["🦄"]) logro(gs, "🦄");
  if (g.public && !wasPublic && !gs.logros["🔔"]) logro(gs, "🔔");
  if (g.rescates > 0 && (gs.logros["✝"] || 0) < g.rescates) {
    gs.markers.push({ year: TURN_YEARS[Math.min(g.ti, 10)], m: "✝" });
    gs.logros["✝"] = g.rescates;
  }
}

/* Trienio de playa: el patrimonio flota, sin empresa. */
function playaTurn(gs, year) {
  const g = gs.g;
  const swing = (rng(g) - 0.42) * 0.6;
  const prev = g.pat;
  g.pat = Math.max(0, g.pat * (1 + swing));
  if (gs.flags.has("tren_de_vida")) g.pat = Math.max(0, g.pat * 0.85);
  pushRow(gs, year, 0, prev);
  g.ti++;
}

/* Avanza tras el reveal: simula el trienio (motor real) y arma el turno
   siguiente, o dispara emergencia / post-exit / final. */
export function advanceTurn(gs) {
  if (gs.phase !== "resolved") return;
  const g = gs.g;

  // Encadenamiento forzado dentro del mismo turno (emergencias)
  if (gs.gotoNext) {
    gs.card = gs.gotoNext;
    gs.gotoNext = null;
    gs.chosen = null;
    gs.result = null;
    gs.phase = "decision";
    return;
  }

  // Emergencia sin salida → final
  if (g.dead) return finishGame(gs);

  // Post-exit: elegir camino sin gastar el trienio
  if (gs.pendingPostExit) {
    if (g.ti >= TURN_YEARS.length - 1) return finishGame(gs);
    gs.card = POST_EXIT_CARD;
    gs.chosen = null;
    gs.result = null;
    gs.phase = "decision";
    return;
  }

  const year = TURN_YEARS[g.ti];

  if (gs.mode === "playa") {
    playaTurn(gs, year);
  } else {
    const prevArr = g.arr;
    const prevVal = g.val;
    const wasPublic = g.public;
    // ECONOMÍA REAL — motor intacto; el arco solo sesga el momentum (aditivo)
    const bias = gs.arcoBias[g.ti] || 0;
    const m = simulateTrienio(g, bias ? { momentumBias: bias } : null);
    if (gs.pendingValMul !== 1) {
      g.val *= gs.pendingValMul;
      g.valPeak = Math.max(g.valPeak, g.val);
      gs.pendingValMul = 1;
    }
    gs.momentum = m;
    autoLogros(gs, wasPublic);
    pushRow(gs, year, prevArr, prevVal);
    gs.hist.push(g.val);

    // Muerte con los rescates del motor agotados → cadena E (última salida)
    if (g.dead) {
      const { card, soloSinInversores } = pickEmergency(gs);
      gs.used.add(card.id);
      gs.card = soloSinInversores
        ? { ...card, opciones: card.opciones.filter((o) => o.id !== "A") }
        : card;
      gs.chosen = null;
      gs.result = null;
      gs.phase = "decision";
      return;
    }
  }

  if (g.ti >= TURN_YEARS.length) return finishGame(gs);

  gs.card = pickCard(gs);
  gs.chosen = null;
  gs.result = null;
  gs.phase = "decision";
}

export function finishGame(gs) {
  const g = gs.g;
  // Trienios restantes en retiro corren solos
  while (!g.dead && g.ti < TURN_YEARS.length && (gs.retired || gs.pendingPostExit)) {
    if (gs.pendingPostExit) {
      gs.retired = true;
      gs.mode = "playa";
      gs.pendingPostExit = false;
      logro(gs, "🏖");
    }
    playaTurn(gs, TURN_YEARS[g.ti]);
  }
  if (g.public) g.pat += g.val * (g.eq / 100) * 0.4;
  gs.endInfo = computeEndGame(gs);
  gs.mote = computeMote(gs.ejes, gs.decisionesConTag);
  gs.casi = computeCasi(gs);
  gs.card = null;
  gs.phase = "end";
}

/* La línea del casi (anexo §1.2): toda carrera termina mostrando qué
   estuvo cerca. El near-miss es el anzuelo del replay. */
export function computeCasi(gs) {
  const g = gs.g;
  const k = gs.endInfo?.key;
  if (g.dead) {
    const cruz = gs.markers.find((m) => m.m === "✝");
    const year = cruz ? cruz.year : gs.rows.length ? gs.rows[gs.rows.length - 1].year : 2026;
    return `Con una decisión distinta en ${year}, esta historia era otra.`;
  }
  if (!["ipo", "ipoDown", "uni", "serial"].includes(k) && g.valPeak >= 6e8 && g.valPeak < 1e9) {
    return `Tu pico quedó a ${Math.round((1 - g.valPeak / 1e9) * 100)}% del unicornio.`;
  }
  if (k === "playa0") return `Llegaste a la playa con plata. Te fuiste con una historia.`;
  if (g.ovrPeak >= g.techo) return `Tocaste tu techo oculto (${g.techo}). Poquísimas carreras lo logran.`;
  if (g.techo - g.ovrPeak <= 4) return `Tu techo oculto era ${g.techo}. Te quedaste a ${g.techo - g.ovrPeak}.`;
  return `Tu techo oculto era ${g.techo}. Llegaste a ${g.ovrPeak}.`;
}

/* Share en primera persona con seed-desafío (anexo §1.7). */
export function shareDesafio(gs, url) {
  const g = gs.g;
  const añoIPO = gs.rows.find((r) => r.etapa === "Pública")?.year;
  const añoMuerte = gs.rows.length ? gs.rows[gs.rows.length - 1].year : 2026;
  const FRASES = {
    ipo: `Toqué la campana en ${añoIPO} 🔔`,
    ipoDown: `Toqué la campana en ${añoIPO} y después sonó otra 🔔📉`,
    uni: `Llegué a unicornio 🦄`,
    serial: `Mi segunda empresa superó a la primera 🔁`,
    exitG: `Vendí por ${fmtUSD(gs.exits[gs.exits.length - 1]?.val || g.valPeak)} 💰`,
    exitC: `Vendí mi empresa y cobré 💵`,
    acquihire: `Me compraron por el equipo 🧲`,
    digna: `Me fundí en ${añoMuerte} y la cerré bien ✝`,
    escandalo: `Me fundí y salí en los diarios 📰`,
    pyme: `Construí una PyME rentable que nadie aplaude 🧱`,
    remar: `Remé 33 años y acá sigo 🚣`,
    playaG: `Modo playa permanente 🏝`,
    playaC: `Hice mi exit y me fui a la playa 💵`,
    playa0: `Me retiré rico y me fundí en la playa 📉`,
  };
  const frase = FRASES[gs.endInfo?.key] || `Terminé mi carrera con OVR pico ${g.ovrPeak}`;
  return `${frase}. Dice que soy ${gs.mote?.nombre || "un misterio"}. ¿La sacás mejor que yo?\n${url}`;
}

/* Finales del PRD §12 (los que el alcance F2 puede alcanzar). */
export function computeEndGame(gs) {
  const g = gs.g;
  if (gs.acquihire) return { key: "acquihire", titulo: "Te compraron por el equipo", emoji: "🧲" };
  if (g.dead) {
    return gs.flags.has("manchado_redes") || gs.flags.has("manchado_crypto")
      ? { key: "escandalo", titulo: "Saliste en los diarios", emoji: "📰" }
      : { key: "digna", titulo: "La cerraste bien", emoji: "✝" };
  }
  if (g.public) {
    const sano = g.val >= g.ipoVal * 0.6;
    const ast = gs.ipoTecnico ? "*" : "";
    return sano
      ? { key: "ipo", titulo: `Tocaste la campana${ast}`, emoji: "🔔" }
      : { key: "ipoDown", titulo: `Tocaste la campana${ast} (después sonó otra)`, emoji: "🔔" };
  }
  if (gs.retired) {
    if (g.pat <= 100000) return { key: "playa0", titulo: "De la playa a LinkedIn", emoji: "📉" };
    if (g.pat >= 20e6) return { key: "playaG", titulo: "Modo playa permanente", emoji: "🏝" };
    return { key: "playaC", titulo: "Exit y a otra cosa", emoji: "💵" };
  }
  if (gs.exits.length >= 2 && gs.exits[1].val > gs.exits[0].val)
    return { key: "serial", titulo: "El segundo tiempo fue mejor", emoji: "🔁" };
  if (gs.exits.length)
    return gs.exits[gs.exits.length - 1].val >= 100e6
      ? { key: "exitG", titulo: "Exit", emoji: "💰" }
      : { key: "exitC", titulo: "Exit chico, plata real", emoji: "💵" };
  if (g.valPeak >= 1e9) return { key: "uni", titulo: "Unicornio", emoji: "🦄" };
  if (g.cfPositivo) return { key: "pyme", titulo: "Rentable. Nadie te aplaude, vos cobrás.", emoji: "🧱" };
  return { key: "remar", titulo: "33 años después, seguís remando", emoji: "🚣" };
}

/* Helpers de presentación usados por la UI */
export function hudData(gs) {
  const g = gs.g;
  const year = TURN_YEARS[Math.min(g.ti, TURN_YEARS.length - 1)];
  const era = eraFor(year, gs.setup.vertical);
  return {
    year,
    era,
    ovr: g.ovr,
    val: g.val,
    arr: g.arr,
    eq: Math.round(g.eq),
    emp: g.emp,
    pat: g.pat,
    public: g.public,
    cfPositivo: g.cfPositivo,
    runway: g.public || g.cfPositivo ? Infinity : Math.max(0, Math.round(runwayMeses(g))),
  };
}

export function cardTePaso(gs) {
  return gs.card && !gs.card.sintetica ? matchTePaso(gs.card, { vertical: gs.setup.vertical, hq: gs.hq }) : false;
}

export { TURN_YEARS };
