/* ============================================================
   La Vitrina (PRD v0.3 §9 + anexo §1.3): 12 copas coleccionables
   + los 8 arquetipos. Las que no ganaste se ven en silueta gris:
   cada hueco es una razón para volver. Persistencia local segura
   (localStorage puede no existir en sandbox/SSR).
   ============================================================ */

import { aprendizajesDePartida } from "./aprendizajes.js";

export const COPAS = [
  { id: "millon", nombre: "Primer Millón", detalle: "ARR 1M por primera vez" },
  { id: "decena", nombre: "La Decena", detalle: "ARR 10M" },
  { id: "cien", nombre: "Los Cien", detalle: "100 empleados" },
  { id: "unicornio", nombre: "Copa Unicornio", detalle: "Valuación 1.000M" },
  { id: "campana", nombre: "La Campana", detalle: "Tocaste la campana" },
  { id: "salvavidas", nombre: "El Salvavidas", detalle: "Sobreviviste una casi-muerte" },
  { id: "desierto", nombre: "Copa del Desierto", detalle: "Caíste y terminaste arriba" },
  { id: "martillo", nombre: "El Martillo", detalle: "Echaste al tóxico que facturaba" },
  { id: "exit", nombre: "Copa del Exit", detalle: "Vendiste una empresa" },
  { id: "segundo", nombre: "El Segundo Tiempo", detalle: "Comeback jugado" },
  { id: "remador", nombre: "Remador de Oro", detalle: "33 años sin fundirte" },
  { id: "reposera", nombre: "La Reposera", detalle: "Te retiraste a la playa" },
];

/* Las cartas de las últimas 2 partidas, para que el sorteo de slots las
   deje para más adelante (§2.3: despriorizar, nunca prohibir). */
export function cartasRecientes() {
  const v = cargarVitrina();
  return new Set((v.ultimas || []).flat());
}

/* Qué copas ganó ESTA partida (gs ya terminado). */
export function copasDePartida(gs) {
  const g = gs.g;
  const ganadas = new Set();
  if (gs.logros["💵"]) ganadas.add("millon");
  if (gs.logros["📈"]) ganadas.add("decena");
  if (gs.logros["👥"]) ganadas.add("cien");
  if (gs.logros["🦄"]) ganadas.add("unicornio");
  if (gs.logros["🔔"]) ganadas.add("campana");
  if ((gs.logros["✝"] || 0) > 0 || g.rescates > 0) ganadas.add("salvavidas");
  if (gs.logros["💰"]) ganadas.add("exit");
  if (gs.logros["🔁"]) ganadas.add("segundo");
  if (gs.logros["🏖"]) ganadas.add("reposera");
  if (gs.rows.length >= 11 && !g.dead) ganadas.add("remador");
  if (gs.decisionLog.some((d) => d.cardId === "T-04" && d.opId === "A") && !g.dead) ganadas.add("martillo");
  const huboValle = gs.rows.some((r) => r.down);
  const finalArriba = ["ipo", "uni", "exitG", "pyme", "playaG", "serial"].includes(gs.endInfo?.key);
  if (huboValle && finalArriba) ganadas.add("desierto");
  return ganadas;
}

/* ---------- Persistencia local (segura ante sandbox/SSR) ---------- */
const KEY = "tce_vitrina_v1";

function store() {
  try {
    if (typeof window === "undefined" || !window.localStorage) return null;
    return window.localStorage;
  } catch {
    return null;
  }
}

export function cargarVitrina() {
  try {
    const raw = store()?.getItem(KEY);
    if (raw) {
      const v = JSON.parse(raw);
      return {
        copas: v.copas || [], arquetipos: v.arquetipos || [], partidas: v.partidas || 0,
        setup: v.setup || null,
        // SPEC v4 §2.3 — cartas de las últimas 2 partidas (anti-repetición)
        ultimas: v.ultimas || [],
        // SPEC v4 §3 — aprendizajes desbloqueados
        aprendizajes: v.aprendizajes || [],
      };
    }
  } catch { /* sin persistencia */ }
  return { copas: [], arquetipos: [], partidas: 0, setup: null, ultimas: [], aprendizajes: [] };
}

export function guardarVitrina(vitrina) {
  try {
    store()?.setItem(KEY, JSON.stringify(vitrina));
  } catch { /* sin persistencia */ }
}

/* Suma lo de esta partida a la colección. Devuelve la vitrina nueva. */
export function actualizarVitrina(gs) {
  const v = cargarVitrina();
  // §3: los aprendizajes que dejó esta partida se suman al diario
  const nuevosAp = aprendizajesDePartida(gs, v.aprendizajes || []);
  const aprendizajes = [...new Set([...(v.aprendizajes || []), ...nuevosAp.map((a) => a.id)])];
  const copas = new Set(v.copas);
  for (const c of copasDePartida(gs)) copas.add(c);
  const arquetipos = new Set(v.arquetipos);
  if (gs.mote && gs.mote.id !== "enigma") arquetipos.add(gs.mote.id);
  // §2.3: guardamos las cartas de esta partida para despriorizarlas en las
  // próximas. Solo las últimas 2 partidas: la tercera ya puede repetir.
  const cartasDeEsta = [...new Set(gs.decisionLog.map((d) => d.cardId))];
  const ultimas = [cartasDeEsta, ...(v.ultimas || [])].slice(0, 2);
  const nueva = {
    copas: [...copas],
    arquetipos: [...arquetipos],
    partidas: v.partidas + 1,
    setup: gs.setup,
    ultimas,
    aprendizajes,
  };
  guardarVitrina(nueva);
  return { ...nueva, nuevosAprendizajes: nuevosAp };
}
