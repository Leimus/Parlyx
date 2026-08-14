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
import { pickCard, pickEmergency, planMacro, cardById, matchTePaso, POST_EXIT_CARD, DIA_DESPUES_CARD, sillaDe, modoSilla } from "./deck.js";
import { NOMBRES, ETAPAS, ISOTIPOS, COLORS, RUBROS_META, fmtUSD } from "./meta.js";
import { nuevoContadorEjes, contarDecision, computeMote, lineaSegunFinal } from "./arquetipos.js";
import arcosJson from "../../data/arcos.json" with { type: "json" };

/* Probabilidad de crítico dorado sobre apuestas ganadas (anexo v0.4 §1.1). */
const PROB_CRITICO = 0.05;

/* Retorno de Parlyx fuera de la silla del fundador (SPEC v3 §2.3). Es menor
   que el ×1.35 del motor: en el gigante automatizás una compañía que no es
   tuya, y de ángel cobrás por el consejo, no por la marca. Son los knobs de
   la regla de oro (verificada en smoke-game --parlyx, target 60-70%). */
const MUL_PARLYX_CORPO = 1.35;
const MUL_PARLYX_ANGEL = 1.4;

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
  const g = newGame(seedStr, "ecom", setup.capital); // pivote v1.0: todos comercio; el rubro es sabor
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
    coEmoji: setup.isotipo || setup.emoji, // isotipo SVG propio (PRD v1.0 §6); emoji legacy
    coColor: setup.color,
    pendingPostExit: false,
    retired: false,
    acquihire: false,
    ipoTecnico: false,
    parlyx: null, // { desde, convos, ventas, horas, amortiguado } al activar (PRD v1.0 §4)
    parlyxBeat: null,
    beatParlyx: null, // { year, silla, cardId } — la garantía del §2.5, verificada en CI
    portfolio: null, // las marcas que asesorás como Ángel (silla C, SPEC v3 §2.2)
    contrafactual: null, // { year, con, sin } cuando Parlyx amortiguó un trienio negativo (FIX-PACK §5)
    convosPerdidas: 0,
    senal: null, // susurro del wonderkid (FIX-PACK §2) — nunca el número
    senalDada: false,
    quiebra: null, // { year, escandalo } si la marca cerró (la tabla sigue igual, §7)
    pendingDiaDespues: false,
    pendingValMul: 1,
    arco: arco.id,
    arcoBias,
    ejes: nuevoContadorEjes(),
    decisionesConTag: 0,
    decisionLog: [],
    mote: null,
    moteLinea: null,
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
  gs.pendingDiaDespues = false;
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
      armarPortfolio(gs);
      logro(gs, "🏖");
      break;
    case "angel":
      // Camino voluntario a la silla C (SPEC v3 §2.2): cobrás tu parte y te
      // sentás de Ángel directo, sin pasar por la carta post-exit.
      doSell(gs, 1);
      gs.pendingPostExit = false;
      gs.retired = true;
      gs.mode = "playa";
      armarPortfolio(gs);
      logro(gs, "🏖");
      break;
    case "parlyxActivar":
      gs.parlyx = { desde: year, convos: 0, ventas: 0, horas: 0, amortiguado: null };
      g.prodMul = 1.35; // productividad por empleado (PRD v1.0 §4.2) — knob opcional del motor
      g.caidaMul = 0.6; // amortiguador (FIX-PACK §5): las caídas duelen 40% menos — nunca caés más CON que SIN
      break;
    case "corpo":
      gs.mode = "corpo";
      g.dead = false;
      gs.pendingDiaDespues = false;
      logro(gs, "👔");
      gs.markers.push({ year, m: "↳" });
      break;
    case "austero":
      gs.mode = "austero";
      g.dead = false;
      gs.pendingDiaDespues = false;
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
      // PAT +300K-1M según OVR (E-04) · seguís adentro del gigante (PRD v1.0 §7)
      const monto = Math.max(300000, Math.min(1e6, 300000 + (g.ovr - 50) * 17500));
      g.pat += monto;
      gs.exits.push({ name: gs.coName, val: Math.min(g.val, 2e6) });
      gs.acquihire = true;
      gs.mode = "corpo";
      g.dead = false;
      logro(gs, "👔");
      gs.markers.push({ year, m: "↳" });
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

/* ---------- SILLA C: el Ángel (SPEC v3 §2.2) ----------
   Al retirarte no salís del juego: elegís en qué poner tu plata. Dos marcas
   chicas de otros rubros (una no es un portfolio; tres no entran en la fila
   de la tabla a 390px con la tipografía del §1). Determinístico por seed. */
function armarPortfolio(gs) {
  if (gs.portfolio) return;
  const g = gs.g;
  const rubros = RUBROS_META.filter((r) => r.id !== gs.setup.rubro);
  const nombres = NOMBRES.filter((n) => n !== gs.coName);
  const marcas = [];
  for (let i = 0; i < 2; i++) {
    const n = nombres.splice(Math.floor(rng(g) * nombres.length), 1)[0] || "Rumbo";
    marcas.push({
      name: n,
      emoji: ISOTIPOS[Math.floor(rng(g) * ISOTIPOS.length)],
      color: COLORS[Math.floor(rng(g) * COLORS.length)],
      rubro: rubros[Math.floor(rng(g) * rubros.length)].id,
      peso: 0.5,
      tend: 0,
    });
  }
  gs.portfolio = marcas;
}

/* Fila de la tabla para el año recién simulado (o de playa). */
const MODO_ROW = {
  playa: { name: "— Playa —", emoji: "🏝", color: "#22D3EE", etapa: "Ángel" },
  corpo: { name: "El gigante", emoji: "📦", color: "#F0B90B", etapa: "Corpo" },
  austero: { name: "Vida tranquila", emoji: "🌿", color: "#A8B0BE", etapa: "Retiro" },
};

function pushRow(gs, year, prevArr, prevVal) {
  const g = gs.g;
  let alt = MODO_ROW[gs.mode];
  // El Ángel muestra en la tabla la marca de su portfolio que va mejor:
  // la silla C recupera identidad visual en vez de decir "— Playa —".
  if (alt && gs.mode === "playa" && gs.portfolio?.length) {
    const mejor = gs.portfolio.reduce((a, b) => (b.tend > a.tend ? b : a));
    alt = { name: mejor.name, emoji: mejor.emoji, color: mejor.color, etapa: "Ángel" };
  }
  const prevHitos = new Set(gs.rows.flatMap((r) => r.hitos));
  gs.rows.push({
    year,
    name: alt ? alt.name : gs.coName,
    emoji: alt ? alt.emoji : gs.coEmoji,
    color: alt ? alt.color : gs.coColor,
    etapa: alt ? alt.etapa : g.public ? "Pública" : ETAPAS[etapaIdx(g.val)],
    ovr: g.ovr,
    arr: alt ? 0 : g.arr,
    val: g.val,
    emp: g.emp,
    pat: g.pat,
    playa: !!alt,
    markers: gs.markers.filter((m) => m.year === year).map((m) => m.m),
    hitos: Object.keys(gs.logros).filter((h) => !prevHitos.has(h)),
    down: alt ? g.pat < (prevVal ?? g.pat) : g.arr < prevArr * 0.98 || g.val < prevVal * 0.9,
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

/* Trienio fuera de la silla del fundador (sillas B y C).
   El motor económico (simulateTrienio) modela una empresa que operás vos:
   acá no hay empresa, así que la economía vive en esta función — en
   lib/game/, NUNCA en lib/engine/. Por eso el golden queda intacto. */
function playaTurn(gs, year) {
  const g = gs.g;
  const prev = g.pat;
  // Parlyx rinde en las tres sillas: en B escala la compañía, en C hace
  // despegar a las marcas que asesorás (SPEC v3 §2.3). Fuera de la silla
  // del fundador el retorno es menor: no sos dueño de lo que automatizás.
  // Estos dos números son knobs de la regla de oro (target 60-70%).
  const mulPrlx = gs.parlyx ? (gs.mode === "playa" ? MUL_PARLYX_ANGEL : MUL_PARLYX_CORPO) : 1;
  if (gs.mode === "corpo") {
    // Sueldo + stock del gigante: crece estable, escala con tu nivel
    g.pat += (400000 + g.ovr * 6000) * mulPrlx;
    g.ovr = clampOvr(g, g.ovr + (rng(g) < 0.5 ? 1 : 0));
  } else if (gs.mode === "austero") {
    g.pat += 60000 * mulPrlx; // laburo tranquilo: se vive, se ahorra poco
  } else {
    // Ángel: cada marca del portfolio tiene su propio swing y tu patrimonio
    // se mueve con el promedio. Podés fundirte igual (regla vigente).
    armarPortfolio(gs);
    // El consejo que diste en 2020 sigue rindiendo (P-09 A).
    const bono = gs.flags.has("ahijado_salvado") ? 0.025 : 0;
    let total = 0;
    for (const m of gs.portfolio) {
      const swing = (rng(g) - 0.42 + bono) * 0.6 * mulPrlx;
      m.tend = swing;
      total += swing;
    }
    const promedio = total / gs.portfolio.length;
    const doble = gs.flags.has("doble_apuesta") ? 1.1 : 1;
    g.pat = Math.max(0, g.pat * (1 + promedio * doble));
    if (gs.flags.has("tren_de_vida")) g.pat = Math.max(0, g.pat * 0.85);
  }
  // Los números de Parlyx también corren fuera de la silla del fundador,
  // con la base de cada silla (si no, convos se calcularía sobre el arr
  // stale de la marca vendida o quebrada y el IMPACTO mentiría).
  if (gs.parlyx) acumularParlyx(gs, basePrlx(gs));
  pushRow(gs, year, 0, prev);
  g.ti++;
}

/* Base de conversaciones por silla: los números que dice la propia carta. */
function basePrlx(gs) {
  const g = gs.g;
  if (gs.mode === "founder") return Math.max(40, Math.round(g.arr / 2500));
  if (gs.mode === "playa") return (gs.portfolio?.length || 2) * 900;
  return 40000; // el gigante: el número del texto de EC-26
}

function acumularParlyx(gs, convos) {
  const ventas = Math.round(convos * 0.38);
  const horas = Math.round((convos * 4) / 60);
  gs.parlyx.convos += convos;
  gs.parlyx.ventas += ventas;
  gs.parlyx.horas += horas;
  gs.parlyxBeat = `🤖 Parlyx detectó ${convos.toLocaleString("es-AR")} conversaciones con intención de compra → ${ventas.toLocaleString("es-AR")} ventas → ${horas.toLocaleString("es-AR")}h recuperadas`;
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

  // La quiebra no es un final: es un capítulo (PRD v1.0 §7)
  if (g.dead) {
    if (g.ti >= TURN_YEARS.length) return finishGame(gs);
    if (!gs.quiebra) {
      gs.quiebra = {
        year: TURN_YEARS[Math.max(0, g.ti - 1)],
        escandalo: gs.flags.has("manchado_redes") || gs.flags.has("manchado_crypto"),
      };
    }
    gs.card = DIA_DESPUES_CARD;
    gs.used.add("DD-01");
    gs.chosen = null;
    gs.result = null;
    gs.phase = "decision";
    gs.pendingDiaDespues = true;
    return;
  }

  // Post-exit: elegir camino sin gastar el trienio.
  // Gate de retiro (SPEC v3 §2.4): no antes del turno 4 — a los 3 años de
  // arrancar, retirarse no es una historia. El patrimonio mínimo también
  // cuenta, y G-11:A ("habilitaRetiro") por fin sirve para algo.
  if (gs.pendingPostExit) {
    if (g.ti >= TURN_YEARS.length - 1) return finishGame(gs);
    const puedeRetirarse = g.ti >= 3 && (g.pat >= 500000 || gs.flags.has("retiro_habilitado"));
    gs.card = puedeRetirarse
      ? POST_EXIT_CARD
      : { ...POST_EXIT_CARD, opciones: POST_EXIT_CARD.opciones.filter((o) => o.id !== "B") };
    gs.chosen = null;
    gs.result = null;
    gs.phase = "decision";
    return;
  }

  // Revivir en la emergencia del ÚLTIMO trienio no habilita un año 12:
  // si los 11 turnos ya corrieron, la carrera terminó (bug del smoke 40k).
  if (g.ti >= TURN_YEARS.length) return finishGame(gs);

  const year = TURN_YEARS[g.ti];

  // SPEC v3 §2: las tres sillas juegan turno a turno. Antes corpo y austero
  // fast-forwardeaban todos los años sin repartir una sola carta — por eso
  // el 13% de las partidas nunca veía 2020. Ese atajo murió acá.
  if (gs.mode !== "founder") {
    playaTurn(gs, year);
  } else {
    const prevArr = g.arr;
    const prevVal = g.val;
    const wasPublic = g.public;
    // ECONOMÍA REAL — motor intacto; el arco solo sesga el momentum (aditivo)
    const bias = gs.arcoBias[g.ti] || 0;
    const fx = bias ? { momentumBias: bias } : null;
    // Contrafactual sin-Parlyx (FIX-PACK §5): el motor es determinístico, la
    // rama fantasma con la misma seed es gratis. Mismos rolls, sin los knobs.
    let sombra = null;
    if (gs.parlyx && g.arr > 0) {
      sombra = JSON.parse(JSON.stringify(g));
      delete sombra.prodMul;
      delete sombra.caidaMul;
    }
    const m = simulateTrienio(g, fx);
    if (gs.pendingValMul !== 1) {
      g.val *= gs.pendingValMul;
      g.valPeak = Math.max(g.valPeak, g.val);
      gs.pendingValMul = 1;
    }
    gs.momentum = m;
    // Trienio negativo con Parlyx activo → mostrar cuánto amortiguó (§5.2):
    // "Ventas -19%. Sin automatizar: -34%." La caída es del mercado.
    gs.contrafactual = null;
    if (sombra) {
      simulateTrienio(sombra, fx);
      const con = Math.round((g.arr / prevArr - 1) * 100);
      const sin = Math.round((sombra.arr / prevArr - 1) * 100);
      if (con < 0 && sin < con) {
        gs.contrafactual = { year, con, sin };
        const peor = gs.parlyx.amortiguado;
        if (!peor || sin - con < peor.sin - peor.con) gs.parlyx.amortiguado = { year, con, sin };
      }
    }
    autoLogros(gs, wasPublic);
    // Parlyx como recurso estratégico (PRD v1.0 §4.2): números del motor,
    // proporcionales a tu tamaño. Si no lo activaste, el casi lo recuerda.
    if (gs.parlyx) {
      acumularParlyx(gs, basePrlx(gs));
    } else {
      gs.parlyxBeat = null;
      if (year >= 2020) gs.convosPerdidas += Math.max(30, Math.round(g.arr / 4000));
    }
    pushRow(gs, year, prevArr, prevVal);
    gs.hist.push(g.val);
    // La señal del wonderkid (FIX-PACK §2): un susurro en los turnos 2-3 si
    // el techo sorteado es élite. Techo bajo = silencio. Nunca el número.
    gs.senal = null;
    if (!gs.senalDada) {
      if (gs.rows.length === 2 && g.techo >= 94) {
        gs.senal = "Un mayorista te dijo que nunca vio rotar un producto así.";
      } else if (gs.rows.length === 3 && g.techo >= 86) {
        gs.senal = "Hay algo distinto en esta marca. La gente vuelve.";
      }
      if (gs.senal) gs.senalDada = true;
    }

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
  // Años sueltos que quedan cuando la carrera termina con un post-exit
  // pendiente (las sillas B y C ya juegan turno a turno, no caen acá).
  while (!g.dead && g.ti < TURN_YEARS.length && (gs.retired || gs.pendingPostExit)) {
    if (gs.pendingPostExit) {
      gs.retired = true;
      gs.mode = "playa";
      gs.pendingPostExit = false;
      armarPortfolio(gs);
      logro(gs, "🏖");
    }
    playaTurn(gs, TURN_YEARS[g.ti]);
  }
  if (g.public) g.pat += g.val * (g.eq / 100) * 0.4;
  gs.endInfo = computeEndGame(gs);
  gs.mote = computeMote(gs.ejes, gs.decisionesConTag);
  gs.moteLinea = lineaSegunFinal(gs.mote, gs.endInfo?.key); // §7: la línea no contradice al final
  gs.casi = computeCasi(gs);
  gs.card = null;
  gs.phase = "end";
}

/* La línea del casi (anexo §1.2): toda carrera termina mostrando qué
   estuvo cerca. El near-miss es el anzuelo del replay. */
export function computeCasi(gs) {
  const g = gs.g;
  const k = gs.endInfo?.key;
  if (!gs.parlyx && gs.convosPerdidas > 100) {
    return `Dejaste ${gs.convosPerdidas.toLocaleString("es-AR")} conversaciones sin responder. Alguien las hubiera vendido.`;
  }
  if (g.dead || gs.quiebra) {
    const cruz = gs.markers.find((m) => m.m === "✝");
    const year = gs.quiebra?.year ?? (cruz ? cruz.year : gs.rows.length ? gs.rows[gs.rows.length - 1].year : 2026);
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
  if (gs.mode === "corpo") {
    return g.pat >= 10e6
      ? { key: "corpoEstrella", titulo: "El empleado mejor pago de LATAM", emoji: "👔" }
      : { key: "corpo", titulo: "Terminaste manejando el barco de otro", emoji: "👔" };
  }
  if (gs.quiebra && gs.mode === "austero") {
    return gs.quiebra.escandalo
      ? { key: "escandalo", titulo: "Saliste en los diarios", emoji: "📰" }
      : { key: "digna", titulo: "La cerraste bien", emoji: "✝" };
  }
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
  const era = eraFor(year, "ecom");
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
    racha: g.rachaP || 0, // 🔥×N en el HUD (FIX-PACK §3): el jugador siente la racha
    silla: sillaDe(gs.mode), // A fundador · B corpo · C ángel (SPEC v3 §2)
    modo: gs.mode,
    portfolio: gs.portfolio,
  };
}

/* El sustantivo del bloque IMPACTO cambia con la silla (SPEC v3 §2.3). */
export function impactoSujeto(gs) {
  const s = sillaDe(gs.mode);
  return s === "B" ? "la compañía" : s === "C" ? "las marcas que asesoraste" : "tu marca";
}

export { sillaDe, modoSilla };

export function cardTePaso(gs) {
  return gs.card && !gs.card.sintetica ? matchTePaso(gs.card, { vertical: gs.setup.vertical, hq: gs.hq }) : false;
}

export { TURN_YEARS };
