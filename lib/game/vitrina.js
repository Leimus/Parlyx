/* ============================================================
   La Vitrina (PRD v0.3 §9 + anexo §1.3): 12 copas coleccionables
   + los 8 arquetipos. Las que no ganaste se ven en silueta gris:
   cada hueco es una razón para volver. Persistencia local segura
   (localStorage puede no existir en sandbox/SSR).
   ============================================================ */

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
      return { copas: v.copas || [], arquetipos: v.arquetipos || [], partidas: v.partidas || 0, setup: v.setup || null };
    }
  } catch { /* sin persistencia */ }
  return { copas: [], arquetipos: [], partidas: 0, setup: null };
}

export function guardarVitrina(vitrina) {
  try {
    store()?.setItem(KEY, JSON.stringify(vitrina));
  } catch { /* sin persistencia */ }
}

/* Suma lo de esta partida a la colección. Devuelve la vitrina nueva. */
export function actualizarVitrina(gs) {
  const v = cargarVitrina();
  const copas = new Set(v.copas);
  for (const c of copasDePartida(gs)) copas.add(c);
  const arquetipos = new Set(v.arquetipos);
  if (gs.mote && gs.mote.id !== "enigma") arquetipos.add(gs.mote.id);
  const nueva = {
    copas: [...copas],
    arquetipos: [...arquetipos],
    partidas: v.partidas + 1,
    setup: gs.setup,
  };
  guardarVitrina(nueva);
  return nueva;
}
