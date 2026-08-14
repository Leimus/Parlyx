/* ============================================================
   SPEC v4 §3 — EL DIARIO DE APRENDIZAJES

   Si le escondemos los resultados al jugador (§1), hay que premiar
   la experiencia. Al terminar cada partida se desbloquean 1-3
   aprendizajes en lenguaje humano, según lo que REALMENTE vivió, y
   quedan guardados en el dispositivo junto a la vitrina.

   Regla dura: CERO mecánica de ventaja. No dan bonus ni hacen el
   juego más fácil. Es conocimiento del jugador, no del personaje:
   la próxima partida la juega mejor porque ahora sabe, no porque
   el motor le regale nada.
   ============================================================ */
import { mulberry32, hashStr } from "../engine/prng.js";

/* 24 aprendizajes. Cada uno con su condición sobre la partida
   terminada — se desbloquea solo si lo viviste de verdad. */
export const APRENDIZAJES = [
  { id: "exclusividad", texto: "Firmar exclusividad con un cliente grande te ata las manos cuando el mercado cambia.",
    cuando: (gs) => gs.flags.has("atado_proveedor") || gs.decisionLog.some((d) => d.cardId === "S-07" && d.opId === "A") },
  { id: "equity_crisis", texto: "En año de crisis, ceder un pedazo de tu empresa sale carísimo: te valúan por el peor momento.",
    cuando: (gs) => gs.decisionLog.some((d) => [2002, 2008].includes(d.year) && ["M-05", "G-08", "S-33"].includes(d.cardId)) },
  { id: "caja_es_tiempo", texto: "La caja no es plata: es la cantidad de decisiones que todavía podés tomar.",
    cuando: (gs) => gs.g.rescates > 0 || gs.markers.some((m) => m.m === "✝") },
  { id: "cliente_unico", texto: "Un cliente que es la mitad de tu facturación no es un cliente: es tu jefe.",
    cuando: (gs) => gs.decisionLog.some((d) => ["S-06", "G-03"].includes(d.cardId) && d.opId === "A") },
  { id: "precio_confianza", texto: "El precio se olvida; que le hayas sostenido el precio en la mala, no.",
    cuando: (gs) => gs.decisionLog.some((d) => d.cardId === "S-15" && d.opId === "B") },
  { id: "internet_temprano", texto: "Las tecnologías que parecen un juguete se vuelven la cancha entera. Casi siempre.",
    cuando: (gs) => gs.decisionLog.some((d) => ["S-10", "EC-02", "S-34"].includes(d.cardId)) },
  { id: "internet_tarde", texto: "El costo de ignorar un cambio no se paga el año que lo ignorás. Se paga cinco años después.",
    cuando: (gs) => gs.decisionLog.some((d) => ["S-10", "S-23", "S-30"].includes(d.cardId) && d.opId === "C") },
  { id: "primer_empleado", texto: "Tomar a alguien en blanco cuesta más de lo que parece y vale más de lo que cuesta.",
    cuando: (gs) => gs.decisionLog.some((d) => d.cardId === "S-05" && d.opId === "A") },
  { id: "cuello_botella", texto: "Si todas las decisiones pasan por vos, tu empresa crece hasta donde llega tu semana.",
    cuando: (gs) => gs.decisionLog.some((d) => d.cardId === "S-18" && d.opId === "C") },
  { id: "marca_propia", texto: "Vender lo de otro te da caja hoy. Ponerle tu nombre te da negocio mañana.",
    cuando: (gs) => gs.decisionLog.some((d) => ["S-09", "S-02"].includes(d.cardId)) },
  { id: "comision_sube", texto: "Al dueño de la cancha siempre le queda subir la comisión. Y a vos, haberte hecho una cancha propia.",
    cuando: (gs) => gs.decisionLog.some((d) => ["S-25", "EC-06"].includes(d.cardId)) },
  { id: "publicidad_alquiler", texto: "La publicidad se alquila. La comunidad se construye. Solo una de las dos te sigue perteneciendo si dejás de pagar.",
    cuando: (gs) => gs.decisionLog.some((d) => d.cardId === "S-29") },
  { id: "reseña_publica", texto: "Una queja contestada en público, y bien, vende más que diez felicitaciones.",
    cuando: (gs) => gs.decisionLog.some((d) => d.cardId === "S-28" && d.opId === "A") },
  { id: "quiebra", texto: "Fundirse no es el final de la historia. Es el capítulo donde aprendés qué parte era tuya de verdad.",
    cuando: (gs) => !!gs.quiebra },
  { id: "comeback", texto: "La segunda empresa arranca con menos plata y con algo que la primera no tenía: vos, sabiendo.",
    cuando: (gs) => gs.coN > 1 },
  { id: "exit", texto: "Vender es fácil de decidir el día que te lo ofrecen. Difícil, el lunes siguiente a la mañana.",
    cuando: (gs) => gs.exits.length > 0 },
  { id: "parlyx_si", texto: "Automatizar no es reemplazar gente: es dejar de perder las conversaciones que llegan cuando no estás.",
    cuando: (gs) => !!gs.parlyx },
  { id: "parlyx_no", texto: "Las conversaciones que no respondés no desaparecen: se las lleva otro.",
    cuando: (gs) => !gs.parlyx && gs.convosPerdidas > 100 },
  { id: "techo", texto: "Cada marca tiene un techo que no se ve. Se descubre chocándolo, no calculándolo.",
    cuando: (gs) => gs.g.ovrPeak >= gs.g.techo - 3 },
  { id: "racha", texto: "Las rachas existen, para los dos lados. El error es creer que la buena era mérito y la mala, mala suerte.",
    cuando: (gs) => (gs.g.rachaP || 0) >= 3 },
  { id: "socio", texto: "Al socio se lo elige por cómo discute, no por lo que sabe.",
    cuando: (gs) => gs.decisionLog.some((d) => ["G-05", "G-02", "G-17", "T-01"].includes(d.cardId)) },
  { id: "crisis_oportunidad", texto: "En la crisis se compran los metros cuadrados que en la bonanza no te vende nadie.",
    cuando: (gs) => gs.decisionLog.some((d) => d.cardId === "S-36" && d.opId === "A") },
  { id: "corpo", texto: "Adentro de una empresa grande, la carrera se decide en los pasillos tanto como en los números.",
    cuando: (gs) => gs.mode === "corpo" || gs.acquihire },
  { id: "angel", texto: "Aconsejar es más fácil que decidir. Por eso el consejo vale menos de lo que uno cree cuando lo da.",
    cuando: (gs) => gs.mode === "playa" && !!gs.portfolio },
];

export const TOTAL_APRENDIZAJES = APRENDIZAJES.length;

/* Qué aprendizajes desbloqueó ESTA partida (máximo 3, priorizando los
   que el jugador todavía no tiene: cada partida tiene que dejar algo).

   El orden se mezcla con la seed de la partida: si cortáramos siempre los
   3 primeros del array, los últimos de la lista serían inalcanzables en la
   práctica (medido: 21 de 24 en 300 partidas, y los 3 que faltaban eran
   los del final). */
export function aprendizajesDePartida(gs, yaTenidos = []) {
  const tenidos = new Set(yaTenidos);
  const rs = mulberry32(hashStr((gs.seedStr || "") + "::aprendizajes"));
  const candidatos = APRENDIZAJES.filter((a) => {
    try { return a.cuando(gs); } catch { return false; }
  })
    .map((a) => ({ a, k: rs() }))
    .sort((x, y) => x.k - y.k)
    .map((x) => x.a);
  const nuevos = candidatos.filter((a) => !tenidos.has(a.id));
  // Si todo lo que viviste ya lo sabías, se repite uno: el diario nunca
  // queda vacío, pero no infla el contador.
  const elegidos = (nuevos.length ? nuevos : candidatos).slice(0, 3);
  return elegidos.map((a) => ({ id: a.id, texto: a.texto, nuevo: !tenidos.has(a.id) }));
}
