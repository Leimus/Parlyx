/* ============================================================
   TU CARRERA EMPRENDEDORA — Motor puro v1 (sin UI)
   Modelo económico: caja real en USD · empleados por decisión
   Estados: sana → tensa → emergencia · máx 2 rescates
   Uso: node engine.js [nPartidas]  → corre simulación y reporta
   ============================================================ */

/* ---------- BALANCE (todo lo calibrable vive acá) ---------- */
const BAL = {
  // techo oculto: [probAcum, min, rango]
  techo: [[0.35, 68, 9], [0.65, 77, 9], [0.87, 86, 8], [0.97, 94, 4], [1.01, 98, 2]],
  ovrInicial: 50,
  // economía
  margen: { saas: 0.75, fintech: 0.55, ecom: 0.30, marketplace: 0.60, ai: 0.65, gaming: 0.70, deeptech: 0.45, crypto: 0.60 },
  costoEmpleadoPorEtapa: [35000, 55000, 80000, 95000, 105000, 110000], // modo ramen → corporativo
  overheadPorEtapa: [20000, 80000, 400000, 1500000, 3500000, 8000000],
  productividadARRxEmp: 130000,   // ARR por empleado "ideal" (crecer = contratar en serio)
  velocidadContratacion: 0.5,      // fracción del gap que cerrás por trienio
  // crecimiento ARR
  arrSemilla: 50000,
  qualDiv: 26, qualBase: 62,
  wMomentum: 0.28, wClima: 0.25, wTend: 0.08, wQual: 0.5,
  growthMin: 0.55, arrCap: 600e6,
  // cap de crecimiento por trienio según tamaño: [umbralARR, factorMax]
  growthCaps: [[1e6, 6.5], [10e6, 4.2], [100e6, 2.6], [Infinity, 1.7]],
  // financiamiento (dilución por clima de capital)
  dilucion: { euforico: 0.12, abundante: 0.15, selectivo: 0.18, cerrado: 0.24 },
  mesesQueLevanta: 30,             // una ronda te da ~30 meses de burn actual
  umbralLevantar: 12,              // salís a levantar con < 12 meses de caja (más al límite)
  // emergencia
  mesesRescate: 10,                // rescate deja la caja en 10 meses de burn
  dilucionRescate: [0.18, 0.28],   // 1er y 2do rescate
  maxRescates: 2,
  // valuación
  descuentoOVR70: 0.65, descuentoOVR80: 0.85,
  // momentum (probs acumuladas para -3..+3) = volatilidad alrededor de la curva
  momentumDist: [0.10, 0.25, 0.42, 0.58, 0.78, 0.92, 1.01],
  // curva de desarrollo por turno (como la edad en Copero): crecés fuerte joven, declinás al final
  dev: [4, 4, 3, 3, 3, 2, 2, 1, 0, -1, -2],
  declivedesdeTurno: 8, declive: -1,
  // IPO
  ipoVal: 1e9, ipoOVR: 80, ipoDesdeTurno: 6,
};

/* ---------- PRNG ---------- */
function hashStr(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function mulberry32(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

/* ---------- Mundo ---------- */
const TURN_YEARS = [1993, 1996, 1999, 2002, 2005, 2008, 2011, 2014, 2017, 2020, 2023];
function eraFor(year, vertical) {
  if (year <= 1999) return { clima: year >= 1998 ? 2 : 1, mult: 6 + (year - 1993) * 2, capital: year >= 1997 ? "euforico" : "abundante" };
  if (year <= 2002) return { clima: -2, mult: 2.5, capital: "cerrado" };
  if (year <= 2007) return { clima: 0, mult: 5.5, capital: "selectivo" };
  if (year <= 2009) return { clima: -2, mult: 3, capital: "cerrado" };
  if (year <= 2015) return { clima: 1, mult: 8, capital: "abundante" };
  if (year === 2016) return { clima: -1, mult: 7, capital: "selectivo" };
  if (year <= 2019) return { clima: 1, mult: 11, capital: "abundante" };
  if (year === 2020) return { clima: -2, mult: 12, capital: "cerrado" };
  if (year === 2021) return { clima: 2, mult: 25, capital: "euforico" };
  if (year === 2022) return { clima: -2, mult: 6, capital: "cerrado" };
  return vertical === "ai" ? { clima: 1, mult: 19, capital: "euforico" } : { clima: 0, mult: 7, capital: "selectivo" };
}
const climaBias = (c) => (c === 2 ? 1 : c === 1 ? 0.6 : c === -1 ? -0.6 : c === -2 ? -1.2 : 0);
function fitVertical(year, v) {
  if (v === "ai") return year < 2014 ? -1 : year >= 2023 ? 2 : 0;
  if (v === "crypto") return year < 2011 ? -1 : year >= 2014 && year <= 2021 ? 1 : 0;
  if (v === "ecom") return year === 2020 ? 2 : year === 2023 ? -1 : 0;
  return 0;
}

/* ---------- Estado inicial ---------- */
const VERTICALS = ["saas", "fintech", "ecom", "marketplace", "ai", "gaming", "deeptech", "crypto"];
const CAPITALES = { boot: { cash: 15000, eq: 0 }, fff: { cash: 100000, eq: 8 }, vc: { cash: 500000, eq: 15 } };

function sortearTecho(r1, r2) { for (const [p, min, rango] of BAL.techo) if (r1 < p) return min + Math.floor(r2 * rango); return 75; }

function newGame(seedStr, vertical, capital) {
  const rs = mulberry32(hashStr(seedStr + "::setup"));
  const cap = CAPITALES[capital];
  return {
    seedStr, vertical, rngState: hashStr(seedStr + "::play"),
    ti: 0, ovr: BAL.ovrInicial, ovrPeak: BAL.ovrInicial,
    techo: sortearTecho(rs(), rs()), tendQueue: [],
    cash: cap.cash, eq: 100 - cap.eq, arr: 0, emp: 2,
    val: 250000, valPeak: 250000, empPeak: 2, pat: 0,
    rescates: 0, emergencias: 0, estado: "sana",
    public: false, ipoVal: 0, dead: false, exits: [],
    rondas: 0, cfPositivo: false, ovrSerie: [], arrSerie: [],
  };
}
function rng(g) { const f = mulberry32(g.rngState); const v = f(); g.rngState = (g.rngState + 0x9E3779B9) >>> 0; return v; }

/* ---------- Economía de un trienio ---------- */
function burnMensual(g) {
  const eIdx = etapaIdx(g.val);
  const gastosAnual = g.emp * BAL.costoEmpleadoPorEtapa[Math.min(eIdx, 5)] + BAL.overheadPorEtapa[Math.min(eIdx, 5)];
  const ingresosAnual = g.arr * (BAL.margen[g.vertical] || 0.6);
  return Math.max(0, (gastosAnual - ingresosAnual) / 12);
}
function etapaIdx(val) { if (val >= 1e9) return 5; if (val >= 350e6) return 4; if (val >= 80e6) return 3; if (val >= 15e6) return 2; if (val >= 2e6) return 1; return 0; }
function runwayMeses(g) { const b = burnMensual(g); return b <= 0 ? Infinity : g.cash / b; }

function simulateTrienio(g, decisionesFx) {
  const year = TURN_YEARS[g.ti];
  const era = eraFor(year, g.vertical);
  // tendencia
  let tend = 0;
  g.tendQueue = g.tendQueue.filter((t) => { if (t.delay) { t.delay--; return true; } tend += t.v; t.left--; return t.left > 0; });
  // efectos de la carta jugada este turno (simplificados en sim)
  if (decisionesFx) {
    if (decisionesFx.ovr) g.ovr = clampOvr(g, g.ovr + decisionesFx.ovr);
    if (decisionesFx.tend) g.tendQueue.push({ v: decisionesFx.tend, left: 2 });
    if (decisionesFx.cashM) g.cash += decisionesFx.cashM * burnMensual(g); // efectos "en meses" → USD al burn actual
    if (decisionesFx.arrMul) g.arr *= decisionesFx.arrMul;
  }
  // momentum
  const roll = rng(g);
  let base = 3; for (let i = 0; i < BAL.momentumDist.length; i++) if (roll < BAL.momentumDist[i]) { base = i - 3; break; }
  const declive = g.ti >= BAL.declivedesdeTurno ? BAL.declive : 0;
  let momentum = Math.max(-3, Math.min(3, base + Math.round(tend * 0.6 + climaBias(era.clima) + fitVertical(year, g.vertical) + declive)));
  g.ovr = clampOvr(g, g.ovr + momentum + BAL.dev[Math.min(g.ti, BAL.dev.length - 1)]);
  g.ovrPeak = Math.max(g.ovrPeak, g.ovr);
  // ARR
  if (g.arr === 0) g.arr = BAL.arrSemilla * (1 + Math.max(0, momentum) * 0.5);
  else {
    const qual = (g.ovr - BAL.qualBase) / BAL.qualDiv;
    const growth = qual * BAL.wQual + momentum * BAL.wMomentum + climaBias(era.clima) * BAL.wClima + tend * BAL.wTend;
    let capMax = 1.7;
    for (const [umbral, f] of BAL.growthCaps) if (g.arr < umbral) { capMax = f; break; }
    // el factor crece con la calidad: growth>0 escala hacia el cap, growth<0 achica
    let factor = growth >= 0 ? 1 + growth * (capMax - 1) : Math.max(BAL.growthMin, 1 + growth);
    if (g.ovr > 75 && factor > 1) factor *= 1 + (g.ovr - 75) / 90; // la élite compone distinto
    g.arr = Math.min(BAL.arrCap, g.arr * factor);
  }
  // empleados: persiguen la productividad ideal con lag (decisión implícita de contratar)
  const empTarget = Math.max(2, g.arr / BAL.productividadARRxEmp);
  g.emp = Math.max(2, Math.round(g.emp + (empTarget - g.emp) * BAL.velocidadContratacion));
  g.empPeak = Math.max(g.empPeak, g.emp);
  // caja: año por año, con ventana de levantar y rescate intra-trienio
  if (!g.public) {
    for (let a = 0; a < 3 && !g.dead; a++) {
      const eI = Math.min(etapaIdx(g.val), 5);
      const gastosA = g.emp * BAL.costoEmpleadoPorEtapa[eI] + BAL.overheadPorEtapa[eI];
      const flujoAnual = g.arr * (BAL.margen[g.vertical] || 0.6) - gastosA;
      g.cfPositivo = flujoAnual > 0;
      g.cash += flujoAnual;
      // política de financiamiento: salir a levantar antes de morir, si el mercado da
      if (!g.cfPositivo && runwayMeses(g) < BAL.umbralLevantar && era.capital !== "cerrado" && g.ovr >= 45) {
        const dil = BAL.dilucion[era.capital];
        g.cash += Math.max(burnMensual(g) * BAL.mesesQueLevanta, 200000);
        g.eq = Math.max(1, g.eq * (1 - dil));
        g.rondas++;
      }
      // emergencia
      if (g.cash <= 0) {
        g.emergencias++;
        if (g.rescates >= BAL.maxRescates) { g.dead = true; }
        else {
          const dil = BAL.dilucionRescate[g.rescates];
          g.rescates++;
          g.eq = Math.max(1, g.eq * (1 - dil));
          g.cash = Math.max(burnMensual(g) * BAL.mesesRescate, 100000);
          g.estado = "rescatada";
        }
      }
    }
  }
  // valuación
  let mult = era.mult;
  if (g.ovr < 70) mult *= BAL.descuentoOVR70; else if (g.ovr < 80) mult *= BAL.descuentoOVR80;
  g.val = Math.max(150000, g.arr * mult * (0.5 + g.ovr / 100));
  g.valPeak = Math.max(g.valPeak, g.val);
  // IPO
  if (!g.public && g.val >= BAL.ipoVal && g.ovr >= BAL.ipoOVR && g.ti >= BAL.ipoDesdeTurno && era.clima > -2) {
    g.public = true; g.ipoVal = g.val; g.pat += g.val * (g.eq / 100) * 0.2;
  }
  g.ovrSerie.push(g.ovr); g.arrSerie.push(Math.round(g.arr));
  g.ti++;
  return momentum;
}
function clampOvr(g, v) { return Math.max(30, Math.min(g.techo, v)); }

/* ---------- Política de decisión para la sim (jugador promedio) ---------- */
/* Aproxima el efecto agregado de las cartas: cada turno una decisión con
   efectos típicos del deck, elegida al azar con leve sesgo racional. */
function politicaFx(g) {
  const r = rng(g);
  if (r < 0.25) return { tend: 1, cashM: -3 };            // invertir en futuro
  if (r < 0.45) return { ovr: 1, cashM: -2 };             // mejora directa con costo
  if (r < 0.60) return { arrMul: 1.15, tend: -0.5 };      // atajo comercial
  if (r < 0.72) return {};                                 // conservador
  if (r < 0.86) return rng(g) < 0.55 ? { ovr: 2, arrMul: 1.15 } : { ovr: -1, tend: -1 }; // apuesta
  return { tend: -1, arrMul: 1.25 };                       // crecer sucio
}

/* ---------- Finales ---------- */
function computeEnd(g) {
  if (g.dead) return "quiebra";
  if (g.public) return g.val >= g.ipoVal * 0.6 ? "ipo" : "ipo_caida";
  if (g.valPeak >= 1e9) return "unicornio";
  if (g.valPeak >= 100e6) return "grande";
  if (g.cfPositivo) return "pyme";
  return "remando";
}

/* ---------- Simulador ---------- */
function runOne(seedStr) {
  const vertical = VERTICALS[Math.floor(mulberry32(hashStr(seedStr))() * VERTICALS.length)];
  const caps = ["boot", "fff", "vc"];
  const capital = caps[Math.floor(mulberry32(hashStr(seedStr + "c"))() * 3)];
  const g = newGame(seedStr, vertical, capital);
  while (g.ti < TURN_YEARS.length && !g.dead) simulateTrienio(g, politicaFx(g));
  return { end: computeEnd(g), g };
}
function pct(n, t) { return ((100 * n) / t).toFixed(1) + "%"; }

function main() {
  const N = parseInt(process.argv[2] || "10000", 10);
  const dist = {}; let emergTot = 0, rescTot = 0, ovrPeakTot = 0, rondasTot = 0;
  let maxSeguidas = 0; const ejemplos = {};
  for (let i = 0; i < N; i++) {
    const { end, g } = runOne("SIM" + i);
    dist[end] = (dist[end] || 0) + 1;
    emergTot += g.emergencias; rescTot += g.rescates; ovrPeakTot += g.ovrPeak; rondasTot += g.rondas;
    if (!ejemplos[end]) ejemplos[end] = { ovrSerie: g.ovrSerie, arrSerie: g.arrSerie, vertical: g.vertical };
  }
  console.log("=== DISTRIBUCIÓN DE FINALES (" + N + " partidas) ===");
  const targets = { quiebra: "25-30%", pyme: "20-25%", remando: "(resto chico)", grande: "8-12%", unicornio: "7-9%", ipo: "3-5%", ipo_caida: "(parte del ipo)" };
  for (const k of ["quiebra", "remando", "pyme", "grande", "unicornio", "ipo", "ipo_caida"]) {
    console.log(k.padEnd(12), pct(dist[k] || 0, N).padStart(7), "  target:", targets[k] || "-");
  }
  console.log("\nEmergencias promedio/partida:", (emergTot / N).toFixed(2), " (target ≤ 1.2)");
  console.log("Rescates promedio/partida:  ", (rescTot / N).toFixed(2));
  console.log("Rondas promedio/partida:    ", (rondasTot / N).toFixed(2));
  console.log("OVR pico promedio:          ", (ovrPeakTot / N).toFixed(1), " (target 74-78)");
  console.log("\n=== EJEMPLOS DE CURVAS OVR (altos y bajos) ===");
  for (const k in ejemplos) console.log(k.padEnd(10), ejemplos[k].vertical.padEnd(12), ejemplos[k].ovrSerie.join(" → "));
}
main();
