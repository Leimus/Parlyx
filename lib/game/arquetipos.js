/* ============================================================
   Perfil de Founder (PRD v0.3 §2): 4 ejes medidos con los tags
   de data/tags-ejes.json sobre las decisiones que ya existen.
   El eje con señal más fuerte define el arquetipo (8 + Enigma).
   ============================================================ */
import tagsJson from "../../data/tags-ejes.json" with { type: "json" };

export const TAGS = tagsJson.tags;

export const EJES = ["capital", "motor", "gestion", "riesgo"];

/* Polo A / Polo B por eje (el orden importa para el cálculo). */
const POLOS = {
  capital: ["diluidor", "dueño"],
  motor: ["ventas", "producto"],
  gestion: ["delegador", "pulpo"],
  riesgo: ["apostador", "arquitecto"],
};

/* Los 8 arquetipos + El Enigma. El escudo es un "ticker" propio —
   estética bursátil del juego (D4): tu forma de fundar cotiza. */
/* Cada arquetipo tiene 2 líneas (FIX-PACK §7): `linea` para finales buenos
   y `lineaModesta` para el resto — el mote nunca contradice al final. */
export const ARQUETIPOS = {
  "capital:diluidor": { id: "financiero", nombre: "El Financiero", ticker: "$FIN", linea: "Nunca pusiste un peso tuyo y siempre tuviste caja. Respeto.", lineaModesta: "Levantaste plata como nadie. Convertirla en negocio era la parte difícil." },
  "capital:dueño": { id: "dueno", nombre: "El Dueño", ticker: "$DUE", linea: "100% tuyo o nada. Más lento, pero nadie te dice qué hacer.", lineaModesta: "Nunca cediste un punto. El precio fue ir más lento que todos." },
  "motor:ventas": { id: "ventas", nombre: "El Animal de Ventas", ticker: "$VTA", linea: "Vendés hielo en la Antártida. El producto ya te va a alcanzar.", lineaModesta: "Vendés lo que sea. Esta vez el mercado no compró la historia completa." },
  "motor:producto": { id: "artesano", nombre: "El Artesano", ticker: "$ART", linea: "Producto impecable, caja justa. Tus clientes te aman; tu contador, menos.", lineaModesta: "El producto era impecable. El negocio, no tanto." },
  "gestion:delegador": { id: "timonel", nombre: "El Timonel", ticker: "$TIM", linea: "Leés el clima antes que nadie. Vendiste en el pico y compraste en el valle.", lineaModesta: "Leés el clima antes que nadie. Ejecutarlo es otra historia." },
  "gestion:pulpo": { id: "pulpo", nombre: "El Pulpo", ticker: "$PUL", linea: "Vendés, programás, respondés los DMs a las 2 AM. Y aun así, funcionó.", lineaModesta: "Hiciste todo vos. Literalmente todo. Quizás ese fue el tema." },
  "riesgo:apostador": { id: "apostador", nombre: "El Apostador", ticker: "$APO", linea: "Cara o cruz con la empresa entera. A veces sale cara.", lineaModesta: "Cara o cruz con la empresa entera. Esta vez salió cruz." },
  "riesgo:arquitecto": { id: "arquitecto", nombre: "El Arquitecto", ticker: "$ARQ", linea: "Cada decisión, un ladrillo. Aburrido de ver, imposible de voltear.", lineaModesta: "Cada decisión, un ladrillo. Al edificio le faltó un piso." },
};
export const ENIGMA = { id: "enigma", nombre: "El Enigma", ticker: "$???", linea: "Jugaste sin dejar huella. Nadie sabe cómo fundás — y eso también es una forma.", lineaModesta: "Jugaste sin dejar huella. Nadie sabe cómo fundás — y eso también es una forma." };

export const TODOS_ARQUETIPOS = [...Object.values(ARQUETIPOS), ENIGMA];

/* Finales donde la carrera "salió bien" — el resto usa la línea modesta. */
const FINALES_BUENOS = new Set(["ipo", "uni", "serial", "exitG", "exitC", "playaG", "playaC", "corpoEstrella"]);

export function lineaSegunFinal(arquetipo, endKey) {
  if (!arquetipo) return "";
  return FINALES_BUENOS.has(endKey) ? arquetipo.linea : arquetipo.lineaModesta || arquetipo.linea;
}

/* Bajado de 6 a 4 en el pivote v1.0 (bug §8.2): con la capa e-commerce
   taggeada completa y careers que siempre llegan a 2026, 4 decisiones
   con tag son señal real. Target: El Enigma < 3% de las partidas. */
export const MIN_DECISIONES_CON_TAG = 4;

export function nuevoContadorEjes() {
  const c = {};
  for (const eje of EJES) c[eje] = { a: 0, b: 0 };
  return c;
}

/* Suma los tags de una decisión (cardId + opId) al contador. */
export function contarDecision(ejes, cardId, opId) {
  const ops = TAGS[cardId];
  if (!ops || !ops[opId]) return 0;
  for (const tag of ops[opId]) {
    const [eje, polo] = tag.split(":");
    if (!POLOS[eje]) continue;
    if (polo === POLOS[eje][0]) ejes[eje].a++;
    else ejes[eje].b++;
  }
  return ops[opId].length;
}

/* El mote: eje con la señal más fuerte. La fuerza se normaliza por
   √total para que un eje con muchas observaciones (riesgo aparece en
   más cartas) no tape a uno con pocas pero consistentes. Mínimo 2
   observaciones por eje para calificar. */
export function computeMote(ejes, decisionesConTag) {
  if (decisionesConTag < MIN_DECISIONES_CON_TAG) return ENIGMA;
  let mejor = null;
  for (const eje of EJES) {
    const { a, b } = ejes[eje];
    const total = a + b;
    if (total < 2) continue;
    const fuerza = Math.abs(a - b) / Math.sqrt(total);
    if (!mejor || fuerza > mejor.fuerza || (fuerza === mejor.fuerza && total > mejor.total)) {
      mejor = { eje, polo: a >= b ? POLOS[eje][0] : POLOS[eje][1], fuerza, total };
    }
  }
  // Empate perfecto con señal suficiente ≠ Enigma: se desempata por el eje
  // con más observaciones (El Enigma queda solo para partidas casi sin tags).
  if (!mejor) return ENIGMA;
  return ARQUETIPOS[`${mejor.eje}:${mejor.polo}`] || ENIGMA;
}
