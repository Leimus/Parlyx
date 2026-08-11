/* ============================================================
   TU CARRERA EMPRENDEDORA — Motor puro v1 (módulo importable)
   Refactor 1:1 de reference/engine-v1.original.js — MISMA LÓGICA.
   Modelo económico: caja real en USD · empleados por decisión
   Estados: sana → tensa → emergencia · máx 2 rescates

   REGLA DURA: no cambiar la lógica económica sin correr
   `npm run sim` y comparar contra targets del PRD §17.
   Todo el tuneo vive en data/balance.json (BAL).
   ============================================================ */
import { hashStr, mulberry32 } from "./prng.js";
import { BAL } from "./balance.js";
import { TURN_YEARS, eraFor, climaBias, fitVertical } from "./world.js";

export { BAL, TURN_YEARS, eraFor, climaBias, fitVertical, hashStr, mulberry32 };

/* ---------- Estado inicial ---------- */
export const VERTICALS = ["saas", "fintech", "ecom", "marketplace", "ai", "gaming", "deeptech", "crypto"];
export const CAPITALES = { boot: { cash: 15000, eq: 0 }, fff: { cash: 100000, eq: 8 }, vc: { cash: 500000, eq: 15 } };

export function sortearTecho(r1, r2) {
  for (const [p, min, rango] of BAL.techo) if (r1 < p) return min + Math.floor(r2 * rango);
  return 75;
}

export function newGame(seedStr, vertical, capital) {
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
    rachaP: 0, rachaN: 0, rachaMax: 0,
  };
}

export function rng(g) {
  const f = mulberry32(g.rngState);
  const v = f();
  g.rngState = (g.rngState + 0x9e3779b9) >>> 0;
  return v;
}

/* ---------- Economía de un trienio ---------- */
export function burnMensual(g) {
  const eIdx = etapaIdx(g.val);
  const gastosAnual = g.emp * BAL.costoEmpleadoPorEtapa[Math.min(eIdx, 5)] + BAL.overheadPorEtapa[Math.min(eIdx, 5)];
  const ingresosAnual = g.arr * (BAL.margen[g.vertical] || 0.6);
  return Math.max(0, (gastosAnual - ingresosAnual) / 12);
}

export function etapaIdx(val) {
  if (val >= 1e9) return 5;
  if (val >= 350e6) return 4;
  if (val >= 80e6) return 3;
  if (val >= 15e6) return 2;
  if (val >= 2e6) return 1;
  return 0;
}

export function runwayMeses(g) {
  const b = burnMensual(g);
  return b <= 0 ? Infinity : g.cash / b;
}

export function simulateTrienio(g, decisionesFx) {
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
  // sesgo de arco narrativo (v0.3 §5): aditivo y opcional — con 0 u omitido,
  // la matemática es EXACTAMENTE la original (el golden de CI lo verifica)
  const arcoBias = (decisionesFx && decisionesFx.momentumBias) || 0;
  // momentum
  const roll = rng(g);
  let base = 3;
  for (let i = 0; i < BAL.momentumDist.length; i++) if (roll < BAL.momentumDist[i]) { base = i - 3; break; }
  const declive = g.ti >= BAL.declivedesdeTurno ? BAL.declive : 0;
  // rachas (FIX-PACK §3): 2 trienios seguidos con momentum >0 cargan el 3° con +1
  // (y las malas rachas, con -1). "Estás en llama" / "no levanta".
  const rachaBias = (g.rachaP >= 2 ? 1 : 0) - (g.rachaN >= 2 ? 1 : 0);
  let momentum = Math.max(-3, Math.min(3, base + Math.round(tend * 0.6 + climaBias(era.clima) + fitVertical(year, g.vertical) + declive + arcoBias + rachaBias)));
  if (momentum > 0) { g.rachaP = (g.rachaP || 0) + 1; g.rachaN = 0; }
  else if (momentum < 0) { g.rachaN = (g.rachaN || 0) + 1; g.rachaP = 0; }
  else { g.rachaP = 0; g.rachaN = 0; }
  if (g.rachaP > (g.rachaMax || 0)) g.rachaMax = g.rachaP;
  // el techo es una PENDIENTE (FIX-PACK §1): el talento no solo llega más
  // alto — crece más rápido. talentFactor multiplica la curva dev. El tramo
  // élite (techo > talentKink) suma pendiente extra: una recta sola no puede
  // dar a la vez pico≥80 en 20-26% y pico≥95 en 1.5-3% (verificado en sweep).
  const talento = BAL.talentBase != null
    ? BAL.talentBase + (g.techo - BAL.talentPivote) / BAL.talentDiv +
      (BAL.talentDiv2 ? Math.max(0, g.techo - BAL.talentKink) / BAL.talentDiv2 : 0)
    : 1;
  g.ovr = clampOvr(g, g.ovr + momentum + Math.round(BAL.dev[Math.min(g.ti, BAL.dev.length - 1)] * talento));
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
    // amortiguador opcional (Parlyx, FIX-PACK §5): caídaConParlyx = caídaBase × g.caidaMul.
    // Sin setear, la matemática es la original. Invariante: nunca caés más CON que SIN.
    if (factor < 1 && g.caidaMul) factor = 1 - (1 - factor) * g.caidaMul;
    if (g.ovr > 75 && factor > 1) factor *= 1 + (g.ovr - 75) / 90; // la élite compone distinto
    g.arr = Math.min(BAL.arrCap, g.arr * factor);
  }
  // empleados: persiguen la productividad ideal con lag (decisión implícita de contratar)
  // g.prodMul (opcional, default 1): productividad por empleado — Parlyx activado = ×1.35
  // (PRD v1.0 §4.2). Sin setear, la matemática es EXACTAMENTE la original.
  const empTarget = Math.max(2, g.arr / (BAL.productividadARRxEmp * (g.prodMul || 1)));
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
  if (g.ovr < 70) mult *= BAL.descuentoOVR70;
  else if (g.ovr < 80) mult *= BAL.descuentoOVR80;
  g.val = Math.max(150000, g.arr * mult * (0.5 + g.ovr / 100));
  g.valPeak = Math.max(g.valPeak, g.val);
  // IPO
  if (!g.public && g.val >= BAL.ipoVal && g.ovr >= BAL.ipoOVR && g.ti >= BAL.ipoDesdeTurno && era.clima > -2) {
    g.public = true;
    g.ipoVal = g.val;
    g.pat += g.val * (g.eq / 100) * 0.2;
  }
  g.ovrSerie.push(g.ovr);
  g.arrSerie.push(Math.round(g.arr));
  g.ti++;
  return momentum;
}

export function clampOvr(g, v) {
  return Math.max(30, Math.min(g.techo, v));
}

/* ---------- Política de decisión para la sim (jugador promedio) ---------- */
/* Aproxima el efecto agregado de las cartas: cada turno una decisión con
   efectos típicos del deck, elegida al azar con leve sesgo racional. */
export function politicaFx(g) {
  const r = rng(g);
  if (r < 0.25) return { tend: 1, cashM: -3 };            // invertir en futuro
  if (r < 0.45) return { ovr: 1, cashM: -2 };             // mejora directa con costo
  if (r < 0.60) return { arrMul: 1.15, tend: -0.5 };      // atajo comercial
  if (r < 0.72) return {};                                 // conservador
  if (r < 0.86) return rng(g) < 0.55 ? { ovr: 2, arrMul: 1.15 } : { ovr: -1, tend: -1 }; // apuesta
  return { tend: -1, arrMul: 1.25 };                       // crecer sucio
}

/* ---------- Finales ---------- */
export function computeEnd(g) {
  if (g.dead) return "quiebra";
  if (g.public) return g.val >= g.ipoVal * 0.6 ? "ipo" : "ipo_caida";
  if (g.valPeak >= 1e9) return "unicornio";
  if (g.valPeak >= 100e6) return "grande";
  if (g.cfPositivo) return "pyme";
  return "remando";
}

/* ---------- Una partida completa con la política proxy ---------- */
export function runOne(seedStr) {
  const vertical = VERTICALS[Math.floor(mulberry32(hashStr(seedStr))() * VERTICALS.length)];
  const caps = ["boot", "fff", "vc"];
  const capital = caps[Math.floor(mulberry32(hashStr(seedStr + "c"))() * 3)];
  const g = newGame(seedStr, vertical, capital);
  while (g.ti < TURN_YEARS.length && !g.dead) simulateTrienio(g, politicaFx(g));
  return { end: computeEnd(g), g };
}
