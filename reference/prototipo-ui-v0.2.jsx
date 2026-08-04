import { useState, useRef } from "react";

/* ============================================================
   TU CARRERA EMPRENDEDORA · por Parlyx AI — Prototipo v0.2
   Cambios vs v0: economía con altos y bajos (ARR puede caer),
   dificultad real, IPO gateado por OVR 80+ y la partida sigue,
   comeback post-exit, hitos con etiqueta.
   ============================================================ */

/* ---------- PRNG con seed ---------- */
function hashStr(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const randSeed = () => Array.from({ length: 6 }, () => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[Math.floor(Math.random() * 32)]).join("");

/* ---------- Constantes ---------- */
const TURN_YEARS = [1993, 1996, 1999, 2002, 2005, 2008, 2011, 2014, 2017, 2020, 2023];
const VERTICALS = [
  { id: "saas", label: "SaaS B2B", emoji: "🧩", nota: "el camino sólido" },
  { id: "fintech", label: "Fintech", emoji: "🏦", nota: "el regulador te mira" },
  { id: "ecom", label: "E-commerce", emoji: "🛒", nota: "boom 2020, resaca 2022" },
  { id: "marketplace", label: "Marketplace", emoji: "🔁", nota: "el ganador se lleva todo" },
  { id: "ai", label: "AI / ML", emoji: "🤖", nota: "antes de 2015 nadie te cree" },
  { id: "gaming", label: "Gaming", emoji: "🎮", nota: "vivís de pegarla" },
  { id: "deeptech", label: "Deep tech", emoji: "🔬", nota: "lento, caro, enorme" },
  { id: "crypto", label: "Cripto / Web3", emoji: "⛓️", nota: "x10 o cero (nace en 2009)" },
];
const HQS = [
  { id: "ba", label: "Buenos Aires", flag: "🇦🇷" },
  { id: "cdmx", label: "CDMX", flag: "🇲🇽" },
  { id: "sp", label: "São Paulo", flag: "🇧🇷" },
  { id: "bog", label: "Bogotá", flag: "🇨🇴" },
  { id: "scl", label: "Santiago", flag: "🇨🇱" },
  { id: "mia", label: "Miami", flag: "🇺🇸" },
];
const CAPITALES = [
  { id: "boot", label: "Bootstrap", narrativa: "Con lo puesto. Cada mes es una decisión.", monto: "USD 15.000", rw: 6, eq: 0 },
  { id: "fff", label: "Friends & Family", narrativa: "La plata del asado. Ahora todos opinan.", monto: "USD 100.000", rw: 14, eq: 8 },
  { id: "vc", label: "Pre-seed VC", narrativa: "Un fondo te firmó. También te puso metas.", monto: "USD 500.000", rw: 20, eq: 15 },
];
const EMOJIS = ["🚀", "⚡", "🌵", "🐍", "🔥", "🌊", "🦫", "🛰️", "🍋", "🧉", "🪐", "🐙"];
const COLORS = ["#16C784", "#F0B90B", "#A78BFA", "#3B82F6", "#EA3943", "#EC4899", "#22D3EE", "#F97316"];
const NOMBRES = ["Zentra", "Kualo", "Nexbi", "Rumbo", "Fintia", "Orbital", "Lumen", "Waira", "Tandem", "Vireo", "Chasqui", "Pampa"];
const LOGROS_INFO = {
  "💵": "Primer millón de ARR", "📈": "ARR 10M", "👥": "100 empleados", "🌍": "Multi-mercado",
  "🦄": "Unicornio", "🔔": "Tocaste la campana", "✝": "Casi-muerte superada", "🔁": "Comeback", "💰": "Exit",
};

function eraFor(year, vertical) {
  if (year <= 1999) return { clima: year >= 1998 ? "☀️☀️" : "☀️", mult: 6 + (year - 1993) * 2, capital: year >= 1997 ? "eufórico" : "abundante", nombre: "Burbuja punto-com" };
  if (year <= 2002) return { clima: "⛈", mult: 2.5, capital: "cerrado", nombre: "Invierno nuclear" };
  if (year <= 2007) return { clima: "⛅", mult: 5.5, capital: "selectivo", nombre: "Recuperación web 2.0" };
  if (year <= 2009) return { clima: "⛈", mult: 3, capital: "cerrado", nombre: "Crisis global" };
  if (year <= 2015) return { clima: "☀️", mult: 8, capital: "abundante", nombre: "Boom mobile y SaaS" };
  if (year === 2016) return { clima: "🌧", mult: 7, capital: "selectivo", nombre: "Sustito" };
  if (year <= 2019) return { clima: "☀️", mult: 11, capital: "abundante", nombre: "Abundancia" };
  if (year === 2020) return { clima: "⛈→☀️", mult: 12, capital: "cerrado→eufórico", nombre: "Shock y fiesta" };
  if (year === 2021) return { clima: "☀️☀️", mult: 25, capital: "eufórico", nombre: "La plata era gratis" };
  if (year === 2022) return { clima: "⛈", mult: 6, capital: "cerrado", nombre: "Ajuste de tasas" };
  return { clima: vertical === "ai" ? "☀️" : "⛅", mult: vertical === "ai" ? 19 : 7, capital: vertical === "ai" ? "eufórico (AI)" : "selectivo", nombre: "Era AI" };
}
function climaBiasOf(clima) {
  if (clima.includes("☀️☀️")) return 1;
  if (clima.includes("⛈")) return -1.2;
  if (clima.includes("🌧")) return -0.6;
  if (clima.includes("☀️")) return 0.6;
  return 0;
}
function fitVertical(year, v) {
  if (v === "ai") return year < 2014 ? -1 : year >= 2023 ? 2 : 0;
  if (v === "crypto") return year < 2011 ? -1 : year >= 2014 && year <= 2021 ? 1 : 0;
  if (v === "ecom") return year === 2020 ? 2 : year === 2023 ? -1 : 0;
  return 0;
}
const fmtUSD = (n) => {
  if (n >= 1e9) return "USD " + (n / 1e9).toFixed(n >= 1e10 ? 0 : 1) + " B";
  if (n >= 1e6) return "USD " + (n / 1e6).toFixed(n >= 1e8 ? 0 : 1) + " M";
  if (n >= 1e3) return "USD " + Math.round(n / 1e3) + " K";
  return "USD " + Math.round(n);
};
const ETAPAS = ["Garage", "Seed", "Serie A", "Serie B", "Serie C", "Gigante"];
function etapaIdx(val) { if (val >= 1e9) return 5; if (val >= 350e6) return 4; if (val >= 80e6) return 3; if (val >= 15e6) return 2; if (val >= 2e6) return 1; return 0; }
const ovrTier = (o) => (o >= 90 ? "violeta" : o >= 80 ? "dorado" : o >= 70 ? "plata" : "bronce");

/* ---------- Deck (igual v0, con specials nuevos) ---------- */
const CARDS = [
  { id: "M01", macro: true, w: [1996, 1999], tag: {}, t: "La fiesta de fin de milenio", f: "Cualquier cosa que termine en punto-com levanta plata. La tuya también.", o: [
    { l: "Levantar todo lo que den", d: "RW +30m · EQ -20% · ⚑", fx: { rw: 30, eq: -20, flag: "sobrecap" } },
    { l: "Levantar lo justo", d: "RW +14m · EQ -10%", fx: { rw: 14, eq: -10 } },
    { l: "Guardar la ropa", d: "OVR +1 · TEND +1", fx: { ovr: 1, tend: 1 } }] },
  { id: "M02", macro: true, w: [2000, 2002], tag: {}, t: "Se pinchó", f: "El índice tech perdió la mitad en meses. Tus mails a inversores rebotan solos.", o: [
    { l: "Hibernar", d: "RW +6m · OVR -1 · TEND -1", fx: { rw: 6, ovr: -1, tend: -1 } },
    { l: "Comprar competidores muertos", d: "RW -8m · apuesta", fx: { rw: -8 }, bet: { p: 0.55, win: { txt: "Te quedaste con el mercado", fx: { arrMul: 1.4, tend: 2 } }, lose: { txt: "Compraste problemas", fx: { ovr: -2 } } } },
    { l: "Seguir como si nada", d: "30% zafás / 70% casi-muerte", bet: { p: 0.3, win: { txt: "Zafaste de milagro", fx: { ovr: 2 } }, lose: { txt: "✝ Casi te fundís", fx: { rw: -12, marker: "✝" } } } }] },
  { id: "M03", macro: true, w: [2000, 2002], tag: { hq: "ba" }, t: "El país se cae a pedazos", f: "Corralito, cinco presidentes, la calle prendida fuego. Tus clientes locales no pueden ni pagarte.", o: [
    { l: "Facturar afuera ya", d: "RW -4m · TEND +2", fx: { rw: -4, tend: 2, flag: "dolarizado" } },
    { l: "Aguantar con los de siempre", d: "ARR -30% · OVR +1", fx: { arrMul: 0.7, ovr: 1 } },
    { l: "Mudar el HQ a Miami", d: "RW -6m · TEND +1", fx: { rw: -6, tend: 1, marker: "↳" } }] },
  { id: "M04", macro: true, w: [2005, 2008], tag: { vertical: ["gaming", "ecom", "marketplace"] }, t: "Un teléfono sin teclas", f: "Lo presentó un tipo de jean y polera negra. Tu producto quedó viejo en 40 minutos.", o: [
    { l: "Apostar todo a mobile", d: "RW -6m · apuesta", fx: { rw: -6 }, bet: { p: 0.6, win: { txt: "Llegaste primero", fx: { tend: 2, arrMul: 1.3 } }, lose: { txt: "Muy temprano", fx: { ovr: -1 } } } },
    { l: "Esperar a ver si prende", d: "TEND -1", fx: { tend: -1 } },
    { l: "Decir que es una moda", d: "OVR -2 · TEND -1", fx: { ovr: -2, tend: -1 } }] },
  { id: "M07", macro: true, w: [2014, 2017], tag: {}, t: "La palabra de los mil millones", f: "Inventaron un nombre para las startups que valen mil millones. Ahora todos quieren ser eso.", o: [
    { l: "Subirse al relato unicornio", d: "RW +20m · EQ -18% · ⚑", fx: { rw: 20, eq: -18, tend: 1, flag: "presion" } },
    { l: "Nosotros vamos a rentabilidad", d: "OVR +1", fx: { ovr: 1 } },
    { l: "Ni idea, seguir laburando", d: "sin cambios", fx: {} }] },
  { id: "M11", macro: true, w: [2017, 2019], tag: { hqNot: "mia" }, t: "El fondo japonés", f: "Un fondo gigante desembarcó en la región con la billetera abierta. Reparte cheques de nueve cifras.", o: [
    { l: "Tomar el cheque grande", d: "RW +30m · EQ -25% · ⚑", fx: { rw: 30, eq: -25, tend: 1, flag: "presion" } },
    { l: "Usarlo para mejorar otra oferta", d: "RW +18m · EQ -15%", fx: { rw: 18, eq: -15 } },
    { l: "Rechazar (y tuitearlo)", d: "OVR +2 · riesgo", fx: { ovr: 2 }, bet: { p: 0.7, win: { txt: "Personaje del ecosistema", fx: {} }, lose: { txt: "Te la guardaron", fx: { tend: -1 } } } }] },
  { id: "M12", macro: true, w: [2020, 2020], tag: { vertical: ["ecom", "saas"] }, t: "El mundo se encierra", f: "Marzo: se cae todo. Septiembre: tu categoría explota. El mismo año.", o: [
    { l: "Recortar en marzo, contratar en agosto", d: "OVR +2 · TEND +2", fx: { ovr: 2, tend: 2 } },
    { l: "Pánico y layoffs profundos", d: "↓ · RW +8m · TEND -1", fx: { rw: 8, tend: -1, marker: "↓" } },
    { l: "Aguantar sin tocar nada", d: "apuesta", bet: { p: 0.6, win: { txt: "La demanda te encontró entero", fx: { arrMul: 1.5 } }, lose: { txt: "La caja no llegó", fx: { rw: -10 } } } }] },
  { id: "M13", macro: true, w: [2020, 2021], tag: {}, t: "La plata era gratis", f: "Rondas a 100x ARR, term sheets en 48 horas. Nada de esto es normal.", o: [
    { l: "Levantar a valuación absurda", d: "RW +36m · EQ -12% · ⚑", fx: { rw: 36, eq: -12, flag: "inflada" } },
    { l: "Levantar razonable", d: "RW +18m · EQ -12%", fx: { rw: 18, eq: -12 } },
    { l: "Vender la empresa en el pico", d: "exit ×1.5", fx: { special: "sellPeak" } }] },
  { id: "M14", macro: true, w: [2022, 2023], tag: {}, t: "Subieron las tasas", f: "La plata dejó de ser gratis de un día para el otro. Ahora la moda es la eficiencia.", o: [
    { l: "Layoffs quirúrgicos ya", d: "↓ · RW +10m · OVR -1", fx: { rw: 10, ovr: -1, marker: "↓" } },
    { l: "Down round y a seguir", d: "↓ · EQ -15% · RW +14m", fx: { eq: -15, rw: 14, marker: "↓", flagExtra: { inflada: { eq: -7 } } } },
    { l: "Cortar todo menos el producto", d: "ARR -15% · TEND +2", fx: { arrMul: 0.85, tend: 2 } }] },
  { id: "M15", macro: true, w: [2023, 2023], tag: {}, t: "Un chatbot que escribe solo", f: "Salió a fin de año y en dos meses lo usa todo el mundo. Tu producto ahora es pre-AI.", o: [
    { l: "Reconstruir el producto sobre AI", d: "RW -8m · apuesta", fx: { rw: -8 }, bet: { p: 0.65, win: { txt: "Múltiplo AI desbloqueado", fx: { tend: 2, flag: "aiPremium" } }, lose: { txt: "La demo no anduvo", fx: { ovr: -2 } } } },
    { l: "Chapa de AI-powered y a vender", d: "ARR +20% · riesgo", fx: { arrMul: 1.2 }, bet: { p: 0.6, win: { txt: "Nadie preguntó de más", fx: {} }, lose: { txt: "Te descubrieron", fx: { ovr: -2 } } } },
    { l: "Lo nuestro es distinto", d: "TEND -2", fx: { tend: -2 } }] },
  { id: "G01", w: [1993, 1996], t: "El garage", f: "Versión uno. Podés sacarla ya con alambre, o pulirla seis meses más.", o: [
    { l: "Lanzar ya, ver qué pasa", d: "TEND +1 · riesgo chico", fx: { tend: 1, arrMul: 1.1 }, bet: { p: 0.75, win: { txt: "Aprendiste rápido", fx: {} }, lose: { txt: "Papelón chico", fx: { ovr: -1 } } } },
    { l: "Pulir hasta que brille", d: "RW -5m · OVR +1", fx: { rw: -5, ovr: 1 } },
    { l: "10 clientes a mano primero", d: "RW -2m · TEND +2", fx: { rw: -2, tend: 2 } }] },
  { id: "G02", w: [1993, 1999], t: "La facultad", f: "Te faltan ocho materias. Tu vieja pregunta. Tus inversores no.", o: [
    { l: "Terminarla a distancia", d: "RW -2m · OVR +1", fx: { rw: -2, ovr: 1 } },
    { l: "Dejarla (por ahora)", d: "sin cambios", fx: {} },
    { l: "Dejarla con comunicado en redes", d: "50/50", bet: { p: 0.5, win: { txt: "Personaje", fx: { ovr: 1 } }, lose: { txt: "Insoportable", fx: { ovr: -1 } } } }] },
  { id: "G03", w: [1993, 2011], t: "El primer cliente grande", f: "Una empresa enorme quiere tu producto. Condición: exclusividad por tres años.", o: [
    { l: "Firmar la exclusividad", d: "ARR +50% · TEND -2 · ⚑", fx: { arrMul: 1.5, tend: -2, flag: "dependencia" } },
    { l: "Negociar sin exclusividad", d: "50/50", bet: { p: 0.5, win: { txt: "Firmaron igual", fx: { arrMul: 1.3 } }, lose: { txt: "Se cayó el deal", fx: {} } } },
    { l: "Rechazar y diversificar", d: "OVR +1", fx: { ovr: 1, arrMul: 1.05 } }] },
  { id: "G04", t: "Modo crunch", f: "Seis meses a fondo para llegar al lanzamiento. El equipo te sigue. Por ahora.", o: [
    { l: "Crunch total", d: "65% / 35%", bet: { p: 0.65, win: { txt: "Salió la feature clave", fx: { ovr: 2, arrMul: 1.2 } }, lose: { txt: "Burnout", fx: { ovr: -1, tend: -1 } } } },
    { l: "Ritmo sostenible", d: "ARR +10%", fx: { arrMul: 1.1 } }] },
  { id: "G05", minE: 1, t: "Tu cofounder se quiere ir", f: "Está quemado, quiere hacer la suya. Es tu amigo desde los 12.", o: [
    { l: "Comprarle su parte", d: "RW -6m · EQ +8% · OVR -1", fx: { rw: -6, eq: 8, ovr: -1 } },
    { l: "Dejarlo ir con todo", d: "TEND -1", fx: { tend: -1 } },
    { l: "Convencerlo de quedarse", d: "50/50", bet: { p: 0.5, win: { txt: "Se quedó y se recuperó", fx: { tend: 1 } }, lose: { txt: "Se fue igual, y peor", fx: { tend: -2 } } } }] },
  { id: "G06", minE: 1, t: "El CTO estrella", f: "Viene del buscador. Cuesta el doble que vos. Dicen que vale el triple.", o: [
    { l: "Contratarlo", d: "RW -6m · TEND +2", fx: { rw: -6, tend: 2 } },
    { l: "Formar al junior de adentro", d: "RW -1m · TEND +1 (tarda)", fx: { rw: -1, tendSlow: 1 } },
    { l: "Seguir siendo vos el CTO", d: "OVR -1", fx: { ovr: -1 } }] },
  { id: "G08", minE: 1, financing: true, t: "Dos term sheets", f: "El fondo top del Valle y el fondo regional de siempre. Mismo día, distinta letra chica.", o: [
    { l: "El fondo top", d: "RW +20m · EQ -20% · ⚑", fx: { rw: 20, eq: -20, tend: 1, flag: "presion" } },
    { l: "El fondo regional paciente", d: "RW +14m · EQ -15%", fx: { rw: 14, eq: -15 } },
    { l: "No levantar esta vez", d: "OVR +1", fx: { ovr: 1 } }] },
  { id: "G11", minE: 3, t: "Vender un cachito", f: "Un fondo te ofrece comprarte el 4% personal. Tu primera plata real en años.", o: [
    { l: "Vender el 4%", d: "PAT + · EQ -4%", fx: { eq: -4, special: "secondary4" } },
    { l: "Yo cobro cuando cobran todos", d: "OVR +1", fx: { ovr: 1 } },
    { l: "Vender el 8%", d: "PAT ×2 · EQ -8% · TEND -1", fx: { eq: -8, tend: -1, special: "secondary8" } }] },
  { id: "G12", minE: 2, tag: { hqNot: "cdmx" }, t: "México te tira onda", f: "Tres clientes grandes de allá te escriben solos. El mercado es cinco veces el tuyo.", o: [
    { l: "Abrir CDMX en serio", d: "RW -5m · TEND +1 · ARR +20%", fx: { rw: -5, tend: 1, arrMul: 1.2, hito: "🌍" } },
    { l: "Venderles remoto", d: "ARR +10% · riesgo", fx: { arrMul: 1.1 }, bet: { p: 0.6, win: { txt: "Funcionó a distancia", fx: {} }, lose: { txt: "Un local te ganó la plaza", fx: { tend: -1 } } } },
    { l: "Foco en casa", d: "sin cambios", fx: {} }] },
  { id: "G13", minE: 2, tag: { vertical: ["marketplace", "ecom", "gaming"] }, t: "Guerra de precios", f: "Un competidor levantó una fortuna y regala el producto. Literalmente: gratis.", o: [
    { l: "Bancar la quema", d: "RW -8m · 50/50", fx: { rw: -8 }, bet: { p: 0.5, win: { txt: "Se fundió él primero", fx: { arrMul: 1.4 } }, lose: { txt: "Se fundieron los dos un poco", fx: { tend: -1 } } } },
    { l: "Subir precios e ir a premium", d: "ARR -15% · OVR +2", fx: { arrMul: 0.85, ovr: 2, tend: 1 } },
    { l: "Llamarlo a hablar de consolidación", d: "40/60", bet: { p: 0.4, win: { txt: "Fusión: valuación +30%", fx: { arrMul: 1.3 } }, lose: { txt: "Te dijo que no y lo tuiteó", fx: {} } } }] },
  { id: "G14", w: [1996, 2017], minE: 1, maxE: 2, t: "Te quieren comprar temprano", f: "Oferta por toda la empresa. Es plata que te cambia la vida. También es temprano.", o: [
    { l: "Vender", d: "exit ahora", fx: { special: "sellNow" } },
    { l: "Rechazar", d: "TEND +1", fx: { tend: 1 } },
    { l: "Contraofertar el doble", d: "25/75", bet: { p: 0.25, win: { txt: "Aceptaron el doble", fx: { special: "sellDouble" } }, lose: { txt: "Se fueron y no vuelven", fx: {} } } }] },
  { id: "G16", t: "El influencer advisor", f: "Doscientos mil seguidores hablando de negocios. Se ofrece de advisor por el 2%.", o: [
    { l: "Aceptar", d: "EQ -2% · 60/40", fx: { eq: -2 }, bet: { p: 0.6, win: { txt: "Visibilidad real", fx: { ovr: 2 } }, lose: { txt: "Papelón público", fx: { ovr: -1 } } } },
    { l: "Ofrecerle 0,5% y ver", d: "50/50", bet: { p: 0.5, win: { txt: "Aceptó igual", fx: { ovr: 1, eq: -1 } }, lose: { txt: "Te escrachó en un hilo", fx: { ovr: -1 } } } },
    { l: "Rechazar", d: "sin cambios", fx: {} }] },
  { id: "G18", t: "El tweet", f: "Son las 2 AM. Tenés una opinión picante sobre el ecosistema y el pulgar caliente.", o: [
    { l: "Publicar", d: "55/45", bet: { p: 0.55, win: { txt: "Personaje del ecosistema", fx: { ovr: 2 } }, lose: { txt: "Quilombo", fx: { ovr: -2, flag: "manchado" } } } },
    { l: "Guardarlo en borradores", d: "OVR +1", fx: { ovr: 1 } }] },
  { id: "G19", minE: 2, t: "El VP de Ventas", f: "Currículum brillante, sonrisa de cierre. La posición con más varianza del fútbol.", o: [
    { l: "Contratarlo", d: "RW -5m · 55/45", fx: { rw: -5 }, bet: { p: 0.55, win: { txt: "Golazo: ARR +35%", fx: { arrMul: 1.35, tend: 1 } }, lose: { txt: "No vendió nada", fx: { tend: -1 } } } },
    { l: "Promover al mejor vendedor", d: "65/35", bet: { p: 0.65, win: { txt: "Creció con el puesto", fx: { arrMul: 1.15 } }, lose: { txt: "Era mejor vendedor que jefe", fx: {} } } },
    { l: "Seguir vendiendo vos", d: "ARR +5% · OVR -1", fx: { arrMul: 1.05, ovr: -1 } }] },
  { id: "G20", t: "El pivot", f: "Los números no mienten hace dos años. Hay otra puerta, pero es empezar casi de cero.", cond: (g) => g.tendActive <= -1, o: [
    { l: "Pivotear con todo", d: "↳ · ARR -40% · apuesta", fx: { arrMul: 0.6, marker: "↳" }, bet: { p: 0.55, win: { txt: "Techo re-sorteado", fx: { tend: 2, special: "retecho" } }, lose: { txt: "Otra puerta cerrada", fx: { tend: -1 } } } },
    { l: "Pivot suave", d: "60/40", bet: { p: 0.6, win: { txt: "Otro cliente, mismo producto", fx: { arrMul: 1.2 } }, lose: { txt: "Sin efecto", fx: {} } } },
    { l: "Doblar la apuesta en lo que hay", d: "35/65", bet: { p: 0.35, win: { txt: "Era cuestión de tiempo", fx: { arrMul: 1.3 } }, lose: { txt: "No era cuestión de tiempo", fx: { tend: -2 } } } }] },
  { id: "V03", tag: { vertical: ["fintech"] }, minE: 1, t: "Llamó el regulador", f: "Un sobre con membrete del banco central. Quieren conversar sobre tu modelo de negocio.", o: [
    { l: "Contratar al ex regulador", d: "RW -4m · TEND +1", fx: { rw: -4, tend: 1, flag: "blindado" } },
    { l: "Ir con tu abogado de siempre", d: "50/50", bet: { p: 0.5, win: { txt: "Zafaste", fx: {} }, lose: { txt: "Multa", fx: { rw: -6, ovr: -1 } } } },
    { l: "Operar en el gris", d: "ARR +20% · riesgo alto", fx: { arrMul: 1.2 }, bet: { p: 0.6, win: { txt: "Por ahora nadie mira", fx: {} }, lose: { txt: "Clausura parcial", fx: { arrMul: 0.5, ovr: -1 } } } }] },
  { id: "V05", tag: { vertical: ["ecom"] }, t: "La logística se come todo", f: "Vendés como nunca. Perdés plata en cada envío. El Excel no miente, pero vos no lo mirás.", o: [
    { l: "Armar logística propia", d: "RW -8m · TEND +2", fx: { rw: -8, tend: 2 } },
    { l: "Subir el mínimo de compra", d: "ARR -10% · RW +3m", fx: { arrMul: 0.9, rw: 3 } },
    { l: "Después vemos margen", d: "ARR +20% · ⚑", fx: { arrMul: 1.2, flag: "margen" } }] },
  { id: "V07", tag: { vertical: ["marketplace"] }, maxE: 1, t: "El huevo y la gallina", f: "Sin compradores no hay vendedores. Sin vendedores no hay compradores. Bienvenido.", o: [
    { l: "Subsidiar a los vendedores", d: "RW -6m · TEND +2", fx: { rw: -6, tend: 2 } },
    { l: "Hacer de vendedor vos mismo", d: "RW -2m · OVR +1", fx: { rw: -2, ovr: 1 } },
    { l: "Lanzar en una ciudad chica", d: "TEND +1 · ARR -20%", fx: { tend: 1, arrMul: 0.8 } }] },
  { id: "V09", tag: { vertical: ["ai"] }, t: "La demo que alucina", f: "Demo con el cliente más grande de tu vida. Tu modelo inventó un dato. Con confianza.", o: [
    { l: "Reírte y mostrar los guardrails", d: "60/40", bet: { p: 0.6, win: { txt: "Firmaron igual", fx: { ovr: 2, arrMul: 1.2 } }, lose: { txt: "Lo vamos a pensar", fx: {} } } },
    { l: "Culpar al wifi", d: "30/70", bet: { p: 0.3, win: { txt: "Coló", fx: {} }, lose: { txt: "Se dieron cuenta", fx: { ovr: -2 } } } },
    { l: "Posponer y arreglar", d: "RW -4m · TEND +1", fx: { rw: -4, tend: 1 } }] },
  { id: "V12", tag: { vertical: ["gaming"] }, t: "La plataforma cambia las reglas", f: "La tienda se queda con el 30%. Hoy además cambió el algoritmo. Tu tráfico: -60%.", o: [
    { l: "Ir directo al usuario", d: "RW -5m · TEND +2", fx: { rw: -5, tend: 2 } },
    { l: "Pagar ads para recuperar", d: "RW -7m · TEND -1", fx: { rw: -7, tend: -1 } },
    { l: "Protestar públicamente", d: "OVR +1 · nada cambia", fx: { ovr: 1, arrMul: 0.85 } }] },
  { id: "V13", tag: { vertical: ["deeptech"] }, t: "El prototipo no escala", f: "En el laboratorio funciona perfecto. En la fábrica cuesta cinco veces el precio de venta.", o: [
    { l: "Dos años más de I+D", d: "RW -10m · apuesta", fx: { rw: -10 }, bet: { p: 0.55, win: { txt: "Breakthrough", fx: { tend: 3 } }, lose: { txt: "Sigue caro", fx: { tend: -1 } } } },
    { l: "Vender caro a nicho premium", d: "ARR +15% · TEND +1", fx: { arrMul: 1.15, tend: 1 } },
    { l: "Licenciar a un grande", d: "ARR +30% · techo -5", fx: { arrMul: 1.3, special: "techoMinus" } }] },
  { id: "V15", w: [2014, 2023], tag: { vertical: ["crypto"] }, t: "Se cayó el exchange", f: "El más grande del mundo quebró de un día para el otro. Tu industria entera es sospechosa.", o: [
    { l: "Transparencia radical", d: "RW -4m · OVR +2 · TEND +2", fx: { rw: -4, ovr: 2, tend: 2 } },
    { l: "Silencio de radio", d: "50/50", bet: { p: 0.5, win: { txt: "Pasó la tormenta", fx: {} }, lose: { txt: "Te asociaron", fx: { arrMul: 0.6 } } } },
    { l: "Comprar competidores baratos", d: "RW -8m · 50/50", fx: { rw: -8 }, bet: { p: 0.5, win: { txt: "Heredaste el mercado", fx: { tend: 3 } }, lose: { txt: "Compraste problemas", fx: { ovr: -1 } } } }] },
  { id: "H01", tag: { hq: "ba" }, t: "El asado con el inversor", f: "Un fondo local te invita a un asado para conocerse. Acá los term sheets se cocinan a las brasas.", o: [
    { l: "Ir y hablar de negocios", d: "50/50", bet: { p: 0.5, win: { txt: "Term sheet el lunes", fx: { rw: 12, eq: -12 } }, lose: { txt: "Era solo un asado", fx: {} } } },
    { l: "Ir y NO hablar de negocios", d: "TEND +1", fx: { tend: 1 } },
    { l: "Estoy a full, otro día", d: "TEND -1 local", fx: { tend: -1 } }] },
  { id: "H02", tag: { hq: "ba" }, t: "El dólar y vos", f: "Facturás en pesos, gastás en dólares. O al revés. Nunca los dos bien a la vez.", o: [
    { l: "Dolarizar ingresos", d: "RW -3m · TEND +2", fx: { rw: -3, tend: 2, flag: "dolarizado" } },
    { l: "Cobertura criolla", d: "RW -1m · 60/40", fx: { rw: -1 }, bet: { p: 0.6, win: { txt: "Te salvó la próxima devaluación", fx: { rw: 6 } }, lose: { txt: "Costo hundido", fx: {} } } },
    { l: "Que sea lo que Dios quiera", d: "50/50", bet: { p: 0.5, win: { txt: "Licuó tus costos", fx: { rw: 6 } }, lose: { txt: "Licuó tus ingresos", fx: { rw: -6 } } } }] },
  { id: "H07", tag: { hq: "mia" }, t: "Ni gringo ni latino", f: "Para el Valle sos LATAM. Para LATAM sos el que se fue. Para el banco sos un cheque en dólares.", o: [
    { l: "Jugarla de puente", d: "TEND +2 · RW +4m", fx: { tend: 2, rw: 4 } },
    { l: "Ir full mercado US", d: "40/60", bet: { p: 0.4, win: { txt: "Múltiplo yanqui", fx: { arrMul: 1.3, tend: 1 } }, lose: { txt: "Competís con nativos", fx: { tend: -1 } } } },
    { l: "Volverte al pago", d: "OVR +1 · ↳", fx: { ovr: 1, marker: "↳" } }] },
  { id: "T01", maxE: 1, t: "El empleado número uno", f: "Trabaja como socio, cobra como junior. Te pide equity. Tiene razón.", o: [
    { l: "Darle 2% con vesting", d: "EQ -2% · TEND +2", fx: { eq: -2, tend: 2 } },
    { l: "Subirle el sueldo, sin equity", d: "RW -2m · 55/45", fx: { rw: -2 }, bet: { p: 0.55, win: { txt: "Se quedó", fx: {} }, lose: { txt: "Se fue al año", fx: { tend: -1 } } } },
    { l: "Más adelante lo vemos", d: "70% se va", bet: { p: 0.3, win: { txt: "Aguantó", fx: {} }, lose: { txt: "Se fue cuando más lo necesitabas", fx: { tend: -2 } } } }] },
  { id: "T02", minE: 1, t: "Seniors o pibes", f: "Dos seniors caros o cinco juniors con hambre. No hay plata para las dos cosas.", o: [
    { l: "Los dos seniors", d: "RW -5m · TEND +1", fx: { rw: -5, tend: 1 } },
    { l: "Los cinco juniors", d: "RW -3m · TEND +2 (tarda)", fx: { rw: -3, tendSlow: 2 } },
    { l: "Un senior que forme juniors", d: "RW -4m · TEND +1", fx: { rw: -4, tend: 1 } }] },
  { id: "T04", minE: 2, t: "El tóxico que factura", f: "Tu mejor vendedor es el peor compañero. Los números lo aman. El equipo lo odia.", o: [
    { l: "Echarlo igual", d: "ARR -15% · OVR +2 · TEND +2", fx: { arrMul: 0.85, ovr: 2, tend: 2 } },
    { l: "Aislarlo en su isla", d: "50/50", bet: { p: 0.5, win: { txt: "Funcionó la isla", fx: {} }, lose: { txt: "La isla se agrandó", fx: { tend: -1 } } } },
    { l: "Bancarlo por los números", d: "ARR +10% · TEND -2", fx: { arrMul: 1.1, tend: -2 } }] },
  { id: "F01", priorityIPO: true, t: "La campana", f: "Los bancos de inversión te llaman por tu nombre de pila. Salir a bolsa: la meta de todos, el infierno de varios.", o: [
    { l: "Tocar la campana", d: "IPO · la carrera sigue", fx: { special: "ipo" } },
    { l: "Una ronda privada más", d: "EQ -8% · riesgo de ventana", fx: { eq: -8 }, bet: { p: 0.6, win: { txt: "La ventana sigue abierta", fx: { arrMul: 1.2 } }, lose: { txt: "Se cerró la ventana", fx: { tend: -1 } } } },
    { l: "Vender a un estratégico", d: "exit ×1.1", fx: { special: "sellStrategic" } }] },
  { id: "F02", minE: 3, cond: (g) => g.tendActive <= -2, t: "El board te quiere afuera", f: "Estamos pensando que la empresa necesita un CEO con experiencia. Lo dicen mirándote.", o: [
    { l: "Pelear tu silla", d: "50/50", bet: { p: 0.5, win: { txt: "Te quedaste, más fuerte", fx: { ovr: 2, tend: 2 } }, lose: { txt: "Te fueron igual, y peor", fx: { ovr: -2, tend: -2 } } } },
    { l: "Founder & CTO, CEO contratado", d: "OVR -1 · TEND +1", fx: { ovr: -1, tend: 1 } },
    { l: "Irte con tu equity y tu orgullo", d: "↳ · conservás EQ", fx: { marker: "↳", tend: 0 } }] },
];
const EMERGENCY = {
  id: "E01", t: "Se acabó la plata", f: "Quedan dos sueldos en la cuenta. Nadie más lo sabe. Todavía.", o: [
    { l: "Rescate de tus inversores", d: "↓ · RW +12m · EQ -18%", req: "raised", fx: { rw: 12, eq: -18, marker: "↓", hito: "✝" } },
    { l: "Vender los muebles (tu plata)", d: "RW +8m · OVR +1", req: "boot", fx: { rw: 8, ovr: 1, hito: "✝" } },
    { l: "Venta de urgencia", d: "acqui-hire", fx: { special: "acquihire" } },
    { l: "Apostar la caja a un último tiro", d: "25/75", bet: { p: 0.25, win: { txt: "✝ Cliente milagro", fx: { rw: 6, tend: 2, hito: "✝" } }, lose: { txt: "Se terminó", fx: { special: "dead" } } } }],
};
const POSTEXIT = {
  id: "PX", t: "¿Y ahora qué?", f: "Firmaste. La plata está en la cuenta. El lunes te despertaste sin mails urgentes por primera vez en años.", o: [
    { l: "Fundar de nuevo", d: "OVR base 60 · techo re-sorteado · tu plata banca", fx: { special: "comeback" } },
    { l: "Retirarte a la playa", d: "que la plata trabaje (o no)", fx: { special: "playa" } }],
};

/* ---------- Motor ---------- */
function sortearTecho(rs, bias) {
  const r = rs();
  const b = bias || 0;
  if (r < 0.35 - b) return 68 + Math.floor(rs() * 9);
  if (r < 0.65 - b) return 77 + Math.floor(rs() * 9);
  if (r < 0.87) return 86 + Math.floor(rs() * 8);
  if (r < 0.97) return 94 + Math.floor(rs() * 4);
  return 98 + Math.floor(rs() * 2);
}
function newGame(seedStr, setup) {
  const rs = mulberry32(hashStr(seedStr + "::setup"));
  const techo = sortearTecho(rs, 0);
  const macroCount = 1 + Math.floor(rs() * 3);
  const macros = CARDS.filter((c) => c.macro);
  const weighted = macros.map((c) => {
    let wgt = 1;
    if (c.tag?.vertical?.includes(setup.vertical)) wgt = 2;
    if (c.tag?.hq && c.tag.hq === setup.hq) wgt = 2;
    if (c.tag?.hqNot && setup.hq === c.tag.hqNot) wgt = 0.3;
    return { c, wgt };
  });
  const plan = {}; const usedM = new Set();
  for (let i = 0; i < macroCount; i++) {
    const pool = weighted.filter((x) => !usedM.has(x.c.id) && TURN_YEARS.some((y) => y >= x.c.w[0] && y <= x.c.w[1] && !plan[y]));
    if (!pool.length) break;
    const tot = pool.reduce((a, b) => a + b.wgt, 0);
    let pick = rs() * tot; let sel = pool[0];
    for (const p of pool) { pick -= p.wgt; if (pick <= 0) { sel = p; break; } }
    const years = TURN_YEARS.filter((y) => y >= sel.c.w[0] && y <= sel.c.w[1] && !plan[y]);
    plan[years[Math.floor(rs() * years.length)]] = sel.c.id;
    usedM.add(sel.c.id);
  }
  const cap = CAPITALES.find((c) => c.id === setup.capital);
  return {
    seedStr, setup, techo, macroPlan: plan, rngState: hashStr(seedStr + "::play"),
    ti: 0, ovr: 50, ovrPeak: 50, tendQueue: [], tendActive: 0,
    runway: cap.rw, eq: 100 - cap.eq, arr: 0, val: 250000, valPeak: 250000,
    emp: 2, empPeak: 2, pat: 0, raised: cap.id === "vc",
    flags: {}, used: {}, rows: [], hist: [250000],
    logros: {}, markers: [], dead: false, ipo: false, ipoVal: 0, public: false,
    retired: false, exits: [], coName: setup.empresa, coEmoji: setup.emoji, coColor: setup.color, coN: 1,
    endType: null, techoLocal: techo, cashflowPos: false,
  };
}
function rng(g) { const f = mulberry32(g.rngState); const v = f(); g.rngState = (g.rngState + 0x9E3779B9) >>> 0; return v; }
function pickCard(g) {
  const year = TURN_YEARS[g.ti];
  if (g.pendingPostExit) return { ...POSTEXIT, isPost: true };
  if (g.runway <= 0 && !g.public) return { ...EMERGENCY, isEmergency: true };
  if (g.macroPlan[year] && !g.used[g.macroPlan[year]]) { g.used[g.macroPlan[year]] = 1; return CARDS.find((c) => c.id === g.macroPlan[year]); }
  const eIdx = etapaIdx(g.val);
  if (!g.used["F01"] && !g.public && g.val >= 1e9 && g.ovr >= 80 && g.ti >= 6 && !eraFor(year, g.setup.vertical).clima.includes("⛈")) { g.used["F01"] = 1; return CARDS.find((c) => c.priorityIPO); }
  const elig = CARDS.filter((c) => {
    if (c.macro || c.priorityIPO || g.used[c.id]) return false;
    if (c.w && (year < c.w[0] || year > c.w[1])) return false;
    if (c.minE != null && eIdx < c.minE) return false;
    if (c.maxE != null && eIdx > c.maxE) return false;
    if (c.tag?.vertical && !c.tag.vertical.includes(g.setup.vertical)) return false;
    if (c.tag?.hq && c.tag.hq !== g.setup.hq) return false;
    if (c.tag?.hqNot && g.setup.hq === c.tag.hqNot) return false;
    if (c.cond && !c.cond(g)) return false;
    return true;
  });
  if (!elig.length) return CARDS.find((c) => c.id === "G04");
  const wOf = (c) => (c.financing && g.runway < 14 ? 4 : c.tag ? 2 : 1);
  const tot = elig.reduce((a, c) => a + wOf(c), 0);
  let pick = rng(g) * tot;
  for (const c of elig) { pick -= wOf(c); if (pick <= 0) { g.used[c.id] = 1; return c; } }
  g.used[elig[0].id] = 1; return elig[0];
}
function tePaso(card, g) { return !!(card.tag && ((card.tag.vertical && card.tag.vertical.includes(g.setup.vertical)) || (card.tag.hq && card.tag.hq === g.setup.hq))); }
function doSell(g, mult) {
  const v = Math.max(g.val * mult, 2e6);
  g.pat += v * (g.eq / 100);
  g.exits.push({ name: g.coName, val: v });
  g.logros["💰"] = (g.logros["💰"] || 0) + 1;
  g.pendingPostExit = true;
}
function applyFx(g, fx, year) {
  if (!fx) return;
  if (fx.ovr) g.ovr = Math.max(30, Math.min(g.techoLocal, g.ovr + fx.ovr));
  if (fx.tend) g.tendQueue.push({ v: fx.tend, left: 2 });
  if (fx.tendSlow) g.tendQueue.push({ v: fx.tendSlow, left: 3, delay: 1 });
  if (fx.rw) g.runway += fx.rw;
  if (fx.eq) g.eq = Math.max(1, Math.min(100, g.eq + fx.eq));
  if (fx.arrMul) g.arr = Math.max(0, g.arr * fx.arrMul);
  if (fx.pat) g.pat += fx.pat;
  if (fx.flag) g.flags[fx.flag] = true;
  if (fx.flagExtra) { for (const k in fx.flagExtra) if (g.flags[k]) applyFx(g, fx.flagExtra[k], year); }
  if (fx.marker) g.markers.push({ year, m: fx.marker });
  if (fx.hito) g.logros[fx.hito] = (g.logros[fx.hito] || 0) + 1;
  if (fx.special) {
    if (fx.special === "sellNow") doSell(g, 1);
    if (fx.special === "sellDouble") doSell(g, 2);
    if (fx.special === "sellPeak") doSell(g, 1.5);
    if (fx.special === "sellStrategic") doSell(g, 1.1);
    if (fx.special === "acquihire") { g.pat += Math.min(g.val, 2e6) * (g.eq / 100); g.exits.push({ name: g.coName, val: Math.min(g.val, 2e6) }); g.flags.acquihire = true; g.pendingPostExit = true; }
    if (fx.special === "ipo") { g.public = true; g.ipo = true; g.ipoVal = g.val; g.pat += g.val * (g.eq / 100) * 0.2; g.logros["🔔"] = 1; }
    if (fx.special === "dead") g.dead = true;
    if (fx.special === "retecho") g.techoLocal = Math.min(99, g.techoLocal + 6);
    if (fx.special === "techoMinus") g.techoLocal = Math.max(60, g.techoLocal - 5);
    if (fx.special === "secondary4") g.pat += Math.max(2e6, g.val * 0.04);
    if (fx.special === "secondary8") g.pat += Math.max(4e6, g.val * 0.08);
    if (fx.special === "comeback") {
      const rs2 = mulberry32(g.rngState);
      g.coN += 1;
      const nuevos = NOMBRES.filter((n) => n !== g.coName);
      g.coName = nuevos[Math.floor(rs2() * nuevos.length)];
      g.rngState = (g.rngState + 7) >>> 0;
      g.ovr = 60; g.techoLocal = sortearTecho(mulberry32(g.rngState), 0.1); g.rngState = (g.rngState + 13) >>> 0;
      g.arr = 0; g.val = 400000; g.eq = 100; g.emp = 3;
      g.runway = Math.min(30, 10 + Math.floor(g.pat / 400000));
      g.raised = false; g.tendQueue = [{ v: 1, left: 2 }];
      g.logros["🔁"] = (g.logros["🔁"] || 0) + 1;
      g.markers.push({ year, m: "🔁" });
      g.pendingPostExit = false;
    }
    if (fx.special === "playa") { g.retired = true; g.pendingPostExit = false; }
  }
}
function simulateTrienio(g) {
  const year = TURN_YEARS[g.ti];
  const era = eraFor(year, g.setup.vertical);
  let tend = 0;
  g.tendQueue = g.tendQueue.filter((t) => { if (t.delay) { t.delay--; return true; } if (t.left > 0) { tend += t.v; t.left--; return t.left > 0; } return false; });
  g.tendActive = tend;
  const climaBias = climaBiasOf(era.clima);
  if (g.retired) {
    const swing = (rng(g) - 0.42) * 0.6;
    g.pat = Math.max(0, g.pat * (1 + swing));
    g.rows.push({ year, name: "— Playa —", emoji: "🏝", color: "#22D3EE", etapa: "Retiro", ovr: g.ovr, arr: 0, val: 0, playa: true, pat: g.pat, markers: [], hitos: [], down: swing < 0 });
    return 0;
  }
  // momentum con cola negativa real
  const roll = rng(g);
  let base;
  if (roll < 0.10) base = -3; else if (roll < 0.25) base = -2; else if (roll < 0.42) base = -1; else if (roll < 0.58) base = 0; else if (roll < 0.78) base = 1; else if (roll < 0.92) base = 2; else base = 3;
  const declive = g.ti >= 8 ? -1 : 0;
  const fit = fitVertical(year, g.setup.vertical);
  let momentum = Math.max(-3, Math.min(3, base + Math.round(tend * 0.6 + climaBias + fit + declive)));
  g.ovr = Math.max(30, Math.min(g.techoLocal, g.ovr + momentum));
  g.ovrPeak = Math.max(g.ovrPeak, g.ovr);
  // ARR: la calidad manda, y puede CAER
  const prevArr = g.arr;
  if (g.arr === 0) g.arr = 40000 + Math.max(0, momentum) * 30000;
  else {
    const qual = (g.ovr - 62) / 26;
    const growth = qual * 0.5 + momentum * 0.28 + climaBias * 0.25 + tend * 0.08;
    g.arr = Math.min(600e6, g.arr * Math.max(0.55, Math.min(2.4, 1 + growth)));
  }
  // Valuación: los fondos descuentan calidad
  let mult = era.mult * (g.flags.aiPremium && year >= 2023 ? 1.8 : 1);
  if (g.ovr < 70) mult *= 0.65; else if (g.ovr < 80) mult *= 0.85;
  const prevVal = g.val;
  g.val = Math.max(150000, g.arr * mult * (0.5 + g.ovr / 100));
  g.valPeak = Math.max(g.valPeak, g.val);
  g.hist.push(g.val);
  g.emp = Math.max(2, Math.round(g.arr / 140000));
  g.empPeak = Math.max(g.empPeak, g.emp);
  const eIdx = etapaIdx(g.val);
  const cfPos = g.arr > g.emp * 135000 && g.ovr >= 64;
  if (!g.public) {
    if (!cfPos) g.runway -= 7 + eIdx * 2 + (climaBias < 0 ? 4 : 0);
    else g.runway = Math.max(g.runway, 8);
  }
  g.cashflowPos = cfPos;
  if (g.public) g.pat += g.val * (g.eq / 100) * 0.03;
  if (g.arr >= 1e6 && !g.logros["💵"]) g.logros["💵"] = 1;
  if (g.arr >= 10e6 && !g.logros["📈"]) g.logros["📈"] = 1;
  if (g.emp >= 100 && !g.logros["👥"]) g.logros["👥"] = 1;
  if (g.val >= 1e9 && !g.logros["🦄"]) g.logros["🦄"] = 1;
  const prevHitos = new Set(g.rows.flatMap((r) => r.hitos));
  g.rows.push({
    year, name: g.coName, emoji: g.coEmoji, color: g.coColor, etapa: g.public ? "Pública" : ETAPAS[eIdx],
    ovr: g.ovr, arr: g.arr, val: g.val, emp: g.emp,
    markers: g.markers.filter((m) => m.year === year).map((m) => m.m),
    hitos: Object.keys(g.logros).filter((h) => !prevHitos.has(h)),
    down: g.arr < prevArr * 0.98 || g.val < prevVal * 0.9,
  });
  return momentum;
}
function computeEnd(g) {
  if (g.dead) return g.flags.manchado ? { key: "escandalo", titulo: "Saliste en los diarios", emoji: "📰" } : { key: "digna", titulo: "La cerraste bien", emoji: "✝" };
  if (g.public) return g.val >= g.ipoVal * 0.6
    ? { key: "ipo", titulo: "Tocaste la campana", emoji: "🔔" }
    : { key: "ipoDown", titulo: "Tocaste la campana (después sonó otra)", emoji: "🔔" };
  if (g.retired) {
    if (g.pat <= 100000) return { key: "playa0", titulo: "De la playa a LinkedIn", emoji: "📉" };
    if (g.pat >= 20e6) return { key: "playaG", titulo: "Modo playa permanente", emoji: "🏝" };
    return { key: "playaC", titulo: "Exit y a otra cosa", emoji: "💵" };
  }
  if (g.exits.length >= 2 && g.exits[1].val > g.exits[0].val) return { key: "serial", titulo: "El segundo tiempo fue mejor", emoji: "🔁" };
  if (g.exits.length && g.flags.acquihire) return { key: "acquihire", titulo: "Te compraron por el equipo", emoji: "🧲" };
  if (g.exits.length) return g.exits[g.exits.length - 1].val >= 100e6 ? { key: "exitG", titulo: "Exit", emoji: "💰" } : { key: "exitC", titulo: "Exit chico, plata real", emoji: "💵" };
  if (g.valPeak >= 1e9) return { key: "uni", titulo: "Unicornio", emoji: "🦄" };
  if (g.cashflowPos) return { key: "pyme", titulo: "Rentable. Nadie te aplaude, vos cobrás.", emoji: "🧱" };
  return { key: "remar", titulo: "33 años después, seguís remando", emoji: "🚣" };
}

/* ---------- CSS ---------- */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@75..100,400..900&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
:root{--bg:#0A0B0E;--panel:#12141A;--panel2:#171A21;--line:#232833;--ink:#F2F3F5;--dim:#8B93A3;--up:#16C784;--down:#EA3943;--gold:#F0B90B;--viol:#A78BFA;--bronze:#C77B3F}
*{box-sizing:border-box;margin:0;padding:0}
.app{min-height:100vh;background:var(--bg);color:var(--ink);font-family:'Archivo',system-ui,sans-serif;display:flex;justify-content:center}
.col{width:100%;max-width:430px;padding:0 14px 40px}
.mono{font-family:'IBM Plex Mono',ui-monospace,monospace}
.ticker{overflow:hidden;border-bottom:1px solid var(--line);background:var(--panel);height:26px;display:flex;align-items:center}
.tape{display:flex;gap:22px;white-space:nowrap;animation:tape 24s linear infinite;font-family:'IBM Plex Mono',monospace;font-size:11px}
@keyframes tape{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@media (prefers-reduced-motion: reduce){.tape{animation:none}}
.brand{display:flex;align-items:center;justify-content:center;gap:8px;padding:14px 0 6px}
.brand h1{font-size:15px;letter-spacing:.16em;font-weight:800;text-transform:uppercase}
.brand span{color:var(--dim);font-size:11px;letter-spacing:.08em}
.hud{position:sticky;top:0;z-index:5;background:linear-gradient(var(--bg) 88%,transparent);padding:10px 0 6px}
.hudgrid{display:grid;grid-template-columns:64px 1fr 1fr 1fr;gap:8px}
.stat{background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:7px 9px}
.stat .k{font-size:9px;letter-spacing:.12em;color:var(--dim);text-transform:uppercase}
.stat .v{font-family:'IBM Plex Mono',monospace;font-size:14px;font-weight:600;margin-top:2px}
.ovrbox{border-radius:10px;display:flex;flex-direction:column;align-items:center;justify-content:center;font-weight:900}
.ovrbox .n{font-size:26px;line-height:1}
.ovrbox .k{font-size:8px;letter-spacing:.2em;opacity:.75}
.t-bronce{background:linear-gradient(160deg,#3a2a18,#241a10);color:var(--bronze);border:1px solid #4a3620}
.t-plata{background:linear-gradient(160deg,#262b33,#171a20);color:#C7CFDA;border:1px solid #333a45}
.t-dorado{background:linear-gradient(160deg,#3d3006,#241d05);color:var(--gold);border:1px solid #55430c}
.t-violeta{background:linear-gradient(160deg,#2b2151,#191233);color:var(--viol);border:1px solid #40337a}
.pill{display:inline-flex;align-items:center;justify-content:center;min-width:34px;padding:2px 7px;border-radius:7px;font-weight:800;font-size:13px;font-family:'IBM Plex Mono',monospace}
.tabla{background:var(--panel);border:1px solid var(--line);border-radius:14px;overflow:hidden;margin-top:10px}
.thead,.trow{display:grid;grid-template-columns:44px 1fr 44px 72px;gap:6px;padding:7px 12px;align-items:center}
.thead{font-size:9px;letter-spacing:.14em;color:var(--dim);text-transform:uppercase;border-bottom:1px solid var(--line)}
.trow{border-bottom:1px solid #1a1e27;font-size:13px}
.trow:last-child{border-bottom:none}
.trow.ghost{opacity:.32}
.trow.actual{background:var(--panel2)}
.yr{font-family:'IBM Plex Mono',monospace;font-size:12px;color:var(--dim)}
.empresa{display:flex;align-items:center;gap:7px;overflow:hidden;white-space:nowrap}
.logo{width:20px;height:20px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:12px;flex:none}
.arrv{font-family:'IBM Plex Mono',monospace;font-size:11px;color:var(--dim);text-align:right;display:flex;justify-content:flex-end;align-items:center;gap:3px}
.era{display:flex;justify-content:space-between;align-items:center;background:var(--panel2);border:1px solid var(--line);border-radius:10px;padding:8px 12px;margin-top:12px;font-size:11px}
.era b{font-size:12px}
.era .mono{color:var(--dim)}
.card{background:var(--panel);border:1px solid var(--line);border-radius:16px;margin-top:12px;overflow:hidden}
.card .top{padding:14px 16px 4px;display:flex;justify-content:space-between;align-items:flex-start}
.yearbig{font-weight:900;font-size:44px;letter-spacing:-0.02em;line-height:.9;font-stretch:75%}
.tepaso{background:#2C4A9E;color:#DCE6FF;font-size:10px;font-weight:800;letter-spacing:.1em;padding:4px 8px;border-radius:7px}
.card h2{padding:8px 16px 0;font-size:21px;font-weight:800;letter-spacing:-.01em}
.card p.flavor{padding:6px 16px 14px;color:var(--dim);font-size:14px;line-height:1.45}
.opt{display:block;text-align:left;background:var(--panel2);border:1px solid var(--line);border-radius:12px;padding:11px 13px;margin:0 12px 10px;width:calc(100% - 24px);cursor:pointer;color:var(--ink);transition:border-color .15s, transform .1s;font-family:inherit}
.opt:hover{border-color:#3a4353}
.opt:active{transform:scale(.99)}
.opt .l{font-weight:700;font-size:14px;display:flex;gap:8px}
.opt .letra{color:var(--dim);font-family:'IBM Plex Mono',monospace}
.opt .d{color:var(--dim);font-size:12px;margin-top:3px;font-family:'IBM Plex Mono',monospace}
.opt.win{border-color:var(--up);box-shadow:0 0 0 1px var(--up) inset}
.opt.lose{border-color:var(--down);box-shadow:0 0 0 1px var(--down) inset}
.opt.dimmed{opacity:.35}
.result{margin:2px 12px 12px;padding:10px 13px;border-radius:12px;font-size:13px;font-weight:700;animation:pop .35s ease}
.result.good{background:rgba(22,199,132,.12);color:var(--up);border:1px solid rgba(22,199,132,.4)}
.result.bad{background:rgba(234,57,67,.12);color:var(--down);border:1px solid rgba(234,57,67,.4)}
@keyframes pop{from{transform:scale(.96);opacity:0}to{transform:scale(1);opacity:1}}
.btn{display:block;width:100%;border:none;border-radius:999px;padding:14px;font-weight:800;font-size:15px;cursor:pointer;font-family:inherit;letter-spacing:.02em}
.btn.pri{background:var(--ink);color:#0b0b0d}
.btn.sec{background:transparent;color:var(--ink);border:1px solid var(--line)}
.btn+.btn{margin-top:9px}
.setup h2{font-size:24px;font-weight:900;margin:18px 0 4px;letter-spacing:-.01em}
.setup .sub{color:var(--dim);font-size:13px;margin-bottom:14px}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:9px}
.tile{background:var(--panel);border:1px solid var(--line);border-radius:13px;padding:13px;cursor:pointer;transition:border-color .15s}
.tile.on{border-color:var(--ink)}
.tile .e{font-size:20px}
.tile .n{font-weight:800;font-size:14px;margin-top:5px}
.tile .s{color:var(--dim);font-size:11px;margin-top:2px}
.input{width:100%;background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:12px;color:var(--ink);font-family:inherit;font-size:15px;font-weight:700}
.label{font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--dim);margin:14px 0 6px;display:block}
.swatches{display:flex;gap:7px;flex-wrap:wrap}
.sw{width:30px;height:30px;border-radius:9px;cursor:pointer;border:2px solid transparent;display:flex;align-items:center;justify-content:center;font-size:15px}
.sw.on{border-color:var(--ink)}
.capital{background:var(--panel);border:1px solid var(--line);border-radius:13px;padding:13px;cursor:pointer;margin-bottom:9px}
.capital.on{border-color:var(--ink)}
.capital .row{display:flex;justify-content:space-between;align-items:baseline}
.capital .monto{color:var(--up);font-family:'IBM Plex Mono',monospace;font-weight:600}
.capital .nar{color:var(--dim);font-size:12px;margin-top:3px}
.capital .rw{color:var(--dim);font-size:11px;font-family:'IBM Plex Mono',monospace;text-align:right}
.sharecard{background:linear-gradient(170deg,#14161d,#0d0e13);border:1px solid var(--line);border-radius:18px;padding:18px;margin-top:14px}
.sc-head{display:flex;gap:12px;align-items:center}
.sc-stats{display:flex;justify-content:space-between;margin-top:14px;padding:11px 12px;background:var(--panel2);border:1px solid var(--line);border-radius:11px}
.sc-stats div{text-align:center}
.sc-stats .k{font-size:9px;letter-spacing:.12em;color:var(--dim)}
.sc-stats .v{font-family:'IBM Plex Mono',monospace;font-weight:600;font-size:14px;margin-top:2px}
.sc-sec{font-size:10px;letter-spacing:.2em;color:var(--dim);text-align:center;margin:16px 0 8px;text-transform:uppercase}
.tray{display:flex;justify-content:center;gap:8px;flex-wrap:wrap}
.chip{background:var(--panel2);border:1px solid var(--line);border-radius:8px;padding:5px 9px;font-size:12px;font-weight:700}
.hitochips{display:flex;justify-content:center;gap:7px;flex-wrap:wrap}
.hitochip{display:flex;align-items:center;gap:6px;background:var(--panel2);border:1px solid var(--line);border-radius:9px;padding:6px 10px;font-size:12px;font-weight:700}
.hitochip .em{font-size:16px}
.hitochip .xn{color:var(--dim);font-family:'IBM Plex Mono',monospace;font-size:10px}
.finaltxt{text-align:center;font-size:19px;font-weight:900;margin-top:16px;letter-spacing:-.01em}
.sc-foot{display:flex;justify-content:space-between;margin-top:16px;padding-top:12px;border-top:1px solid var(--line);font-size:10px;color:var(--dim)}
.toggle{display:flex;justify-content:center;align-items:center;gap:9px;margin-top:14px;color:var(--dim);font-size:13px}
.sw2{width:40px;height:22px;border-radius:99px;background:var(--panel2);border:1px solid var(--line);position:relative;cursor:pointer}
.sw2 .dot{position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:99px;background:var(--dim);transition:all .15s}
.sw2.on .dot{left:20px;background:var(--up)}
.spark{margin-top:2px}
.mini{color:var(--dim);font-size:11px;text-align:center;margin-top:10px}
.hito-inline{font-size:11px}
.landquote{color:var(--dim);text-align:center;font-size:14px;line-height:1.5;margin:10px 0 22px}
.bigtitle{font-weight:900;font-size:34px;text-align:center;line-height:1.02;letter-spacing:-.02em;margin-top:26px;font-stretch:80%}
.seedbox{display:flex;gap:8px;margin-top:12px}
`;

function Ticker({ clima }) {
  const up = !clima || clima.includes("☀️");
  const syms = ["PLYX", "KUAL", "NXBI", "MELI*", "TECH", "LATM", "SAAS", "FNTX", "ORBT", "WAIR"];
  const items = syms.map((s, i) => {
    const pos = up ? i % 3 !== 0 : i % 3 === 0;
    const n = ((i * 7 + 3) % 40) / 10 + 0.4;
    return <span key={s} style={{ color: pos ? "var(--up)" : "var(--down)" }}>{s} {pos ? "▲" : "▼"}{n.toFixed(1)}%</span>;
  });
  return <div className="ticker"><div className="tape">{items}{items}</div></div>;
}
function Spark({ hist }) {
  const w = 92, h = 22;
  const max = Math.max(...hist), min = Math.min(...hist);
  const pts = hist.map((v, i) => `${(i / (hist.length - 1 || 1)) * w},${h - ((v - min) / (max - min || 1)) * (h - 4) - 2}`).join(" ");
  const upTrend = hist[hist.length - 1] >= hist[0];
  return <svg className="spark" width={w} height={h}><polyline points={pts} fill="none" stroke={upTrend ? "var(--up)" : "var(--down)"} strokeWidth="1.5" /></svg>;
}
function OvrPill({ v }) {
  const t = ovrTier(v);
  const bg = { bronce: "#3a2a18", plata: "#262b33", dorado: "#3d3006", violeta: "#2b2151" }[t];
  const co = { bronce: "var(--bronze)", plata: "#C7CFDA", dorado: "var(--gold)", violeta: "var(--viol)" }[t];
  return <span className="pill" style={{ background: bg, color: co }}>{v}</span>;
}
function Fila({ row }) {
  return (
    <div className="trow">
      <span className="yr">{row.year}</span>
      <span className="empresa">
        <span className="logo" style={{ background: (row.color || "#333") + "22" }}>{row.emoji}</span>
        {row.name} {row.markers.map((m) => <span key={m} style={{ color: m === "🔁" ? "var(--up)" : "var(--down)" }}>{m}</span>)}
        <span className="hito-inline">{row.hitos.join(" ")}</span>
      </span>
      <span style={{ textAlign: "center" }}>{row.playa ? "" : <OvrPill v={row.ovr} />}</span>
      <span className="arrv">{row.playa ? fmtUSD(row.pat) : fmtUSD(row.arr)}{row.down && <span style={{ color: "var(--down)" }}>▼</span>}</span>
    </div>
  );
}

/* ---------- App ---------- */
export default function App() {
  const [screen, setScreen] = useState("landing");
  const [seedStr, setSeedStr] = useState(randSeed());
  const [seedInput, setSeedInput] = useState("");
  const [setup, setSetup] = useState({ empresa: "", apellido: "", emoji: "🚀", color: COLORS[0], vertical: null, hq: null, capital: null });
  const [step, setStep] = useState(0);
  const [g, setG] = useState(null);
  const [card, setCard] = useState(null);
  const [chosen, setChosen] = useState(null);
  const [result, setResult] = useState(null);
  const [momentumTxt, setMomentumTxt] = useState(null);
  const [showName, setShowName] = useState(false);
  const [copied, setCopied] = useState(false);
  const gRef = useRef(null);

  const startGame = (sd) => {
    const game = newGame(sd, setup);
    gRef.current = game;
    setG({ ...game });
    setCard(pickCard(game));
    setChosen(null); setResult(null); setMomentumTxt(null);
    setScreen("game");
  };
  const choose = (idx) => {
    if (chosen != null) return;
    const game = gRef.current;
    const year = TURN_YEARS[game.ti];
    const opt = card.o[idx];
    setChosen(idx);
    applyFx(game, opt.fx, year);
    let res = null;
    if (opt.bet) {
      const win = rng(game) < opt.bet.p;
      const out = win ? opt.bet.win : opt.bet.lose;
      applyFx(game, out.fx, year);
      res = { good: win, txt: out.txt };
    }
    setResult(res);
    setG({ ...game });
  };
  const nextTurn = () => {
    const game = gRef.current;
    if (game.dead) { finish(); return; }
    if (game.pendingPostExit) {
      // quedan turnos → carta ¿y ahora qué? · si no quedan, cerrar
      if (game.ti >= TURN_YEARS.length - 1) { finish(); return; }
      setCard(pickCard(game)); setChosen(null); setResult(null); setG({ ...game });
      return;
    }
    const m = simulateTrienio(game);
    if (game.dead) { finish(); return; }
    game.ti += 1;
    if (game.ti >= TURN_YEARS.length) { finish(); return; }
    setMomentumTxt(m > 1 ? "El mercado te empuja ▲" : m < -1 ? "Viento de frente ▼" : null);
    setCard(pickCard(game));
    setChosen(null); setResult(null);
    setG({ ...game });
  };
  const finish = () => {
    const game = gRef.current;
    while (!game.dead && game.ti < TURN_YEARS.length && game.rows.length < TURN_YEARS.length && (game.retired || game.pendingPostExit)) {
      if (game.pendingPostExit) { game.retired = true; game.pendingPostExit = false; }
      simulateTrienio(game); game.ti += 1;
    }
    if (game.public) game.pat += game.val * (game.eq / 100) * 0.4;
    game.endType = computeEnd(game);
    setG({ ...game });
    setScreen("end");
  };
  const copyResult = () => {
    const game = gRef.current;
    const e = game.endType;
    const txt = `${e.emoji} ${e.titulo}\n${setup.emoji} ${game.coName} · OVR pico ${game.ovrPeak} · Valuación pico ${fmtUSD(game.valPeak)}\nHitos: ${Object.entries(game.logros).map(([k, v]) => (v > 1 ? k + "×" + v : k)).join(" ") || "—"}\nJugá la tuya · Tu Carrera Emprendedora por Parlyx AI · seed ${game.seedStr}`;
    navigator.clipboard && navigator.clipboard.writeText(txt).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1600); });
  };
  const era = g ? eraFor(TURN_YEARS[Math.min(g.ti, 10)], setup.vertical) : eraFor(1999);

  if (screen === "landing") return (
    <div className="app"><style>{css}</style><div className="col">
      <Ticker clima="☀️" />
      <div className="brand"><h1>Tu Carrera Emprendedora</h1><span>por Parlyx AI</span></div>
      <div className="bigtitle">33 años de startup.<br />11 decisiones.</div>
      <p className="landquote">Fundá en 1993, atravesá cada burbuja y cada crash, y terminá tocando la campana… o vendiendo el auto.</p>
      <button className="btn pri" onClick={() => { setSeedStr(randSeed()); setStep(0); setScreen("setup"); }}>Arrancar carrera</button>
      <div className="seedbox">
        <input className="input mono" placeholder="¿Tenés un código? (seed)" maxLength={6} value={seedInput} onChange={(e) => setSeedInput(e.target.value.toUpperCase())} style={{ flex: 1 }} />
        <button className="btn sec" style={{ width: "auto", padding: "0 18px" }} onClick={() => { if (seedInput.length === 6) { setSeedStr(seedInput); setStep(0); setScreen("setup"); } }}>Jugar</button>
      </div>
      <p className="mini">Prototipo v0.2 · sin servidor</p>
    </div></div>
  );

  if (screen === "setup") {
    const steps = [
      <div key="0" className="setup">
        <h2>Tu empresa</h2><p className="sub">La camiseta con la que salís a la cancha.</p>
        <span className="label">Nombre</span>
        <div style={{ display: "flex", gap: 8 }}>
          <input className="input" maxLength={14} value={setup.empresa} placeholder="Zentra" onChange={(e) => setSetup({ ...setup, empresa: e.target.value })} style={{ flex: 1 }} />
          <button className="btn sec" style={{ width: "auto", padding: "0 14px" }} onClick={() => setSetup({ ...setup, empresa: NOMBRES[Math.floor(Math.random() * NOMBRES.length)] })}>🎲</button>
        </div>
        <span className="label">Tu apellido (para la tarjeta)</span>
        <input className="input" maxLength={16} value={setup.apellido} placeholder="Lamedica" onChange={(e) => setSetup({ ...setup, apellido: e.target.value })} />
        <span className="label">Logo</span>
        <div className="swatches">{EMOJIS.map((e) => <div key={e} className={"sw" + (setup.emoji === e ? " on" : "")} style={{ background: "var(--panel)" }} onClick={() => setSetup({ ...setup, emoji: e })}>{e}</div>)}</div>
        <span className="label">Color</span>
        <div className="swatches">{COLORS.map((c) => <div key={c} className={"sw" + (setup.color === c ? " on" : "")} style={{ background: c }} onClick={() => setSetup({ ...setup, color: c })} />)}</div>
      </div>,
      <div key="1" className="setup">
        <h2>El rubro</h2><p className="sub">= tu exposición al ciclo.</p>
        <div className="grid2">{VERTICALS.map((v) => <div key={v.id} className={"tile" + (setup.vertical === v.id ? " on" : "")} onClick={() => setSetup({ ...setup, vertical: v.id })}><div className="e">{v.emoji}</div><div className="n">{v.label}</div><div className="s">{v.nota}</div></div>)}</div>
      </div>,
      <div key="2" className="setup">
        <h2>El HQ</h2><p className="sub">Dónde arrancás. Después el mapa se agranda.</p>
        <div className="grid2">{HQS.map((h) => <div key={h.id} className={"tile" + (setup.hq === h.id ? " on" : "")} onClick={() => setSetup({ ...setup, hq: h.id })}><div className="e">{h.flag}</div><div className="n">{h.label}</div></div>)}</div>
      </div>,
      <div key="3" className="setup">
        <h2>Con cuánto arrancás</h2><p className="sub">= la dificultad.</p>
        {CAPITALES.map((c) => <div key={c.id} className={"capital" + (setup.capital === c.id ? " on" : "")} onClick={() => setSetup({ ...setup, capital: c.id })}>
          <div className="row"><b>{c.label}</b><span className="monto">{c.monto}</span></div>
          <div className="row"><span className="nar">{c.narrativa}</span><span className="rw">{c.rw} meses de caja{c.eq ? ` · -${c.eq}% eq` : ""}</span></div>
        </div>)}
      </div>,
    ];
    const canNext = [setup.empresa.trim().length > 0, !!setup.vertical, !!setup.hq, !!setup.capital][step];
    return (
      <div className="app"><style>{css}</style><div className="col">
        <Ticker clima="☀️" />
        <div className="brand"><h1>Tu Carrera Emprendedora</h1><span>{step + 1}/4</span></div>
        {steps[step]}
        <div style={{ marginTop: 18 }}>
          <button className="btn pri" disabled={!canNext} style={{ opacity: canNext ? 1 : 0.4 }} onClick={() => { if (step < 3) setStep(step + 1); else startGame(seedStr); }}>{step < 3 ? "Siguiente" : "Fundar en 1993 →"}</button>
          <button className="btn sec" onClick={() => (step > 0 ? setStep(step - 1) : setScreen("landing"))}>Volver</button>
        </div>
      </div></div>
    );
  }

  if (screen === "game" && g) {
    const year = TURN_YEARS[g.ti];
    const isTP = card && tePaso(card, g);
    const opts = card?.isEmergency ? card.o.filter((o) => !o.req || (o.req === "raised" && g.raised) || (o.req === "boot" && !g.raised)) : card?.o || [];
    return (
      <div className="app"><style>{css}</style><div className="col">
        <Ticker clima={era.clima} />
        <div className="hud">
          <div className="hudgrid">
            <div className={"ovrbox t-" + ovrTier(g.ovr)}><span className="k">OVR</span><span className="n">{g.ovr}</span></div>
            <div className="stat"><div className="k">{g.public ? "Mkt cap" : "Valuación"}</div><div className="v">{fmtUSD(g.val)}</div><Spark hist={g.hist} /></div>
            <div className="stat"><div className="k">Runway</div><div className="v" style={{ color: g.runway <= 6 && !g.public ? "var(--down)" : "inherit" }}>{g.public ? "—" : g.cashflowPos ? "CF+" : Math.max(0, g.runway) + "m"}</div><div className="k" style={{ marginTop: 4 }}>ARR</div><div className="v" style={{ fontSize: 11 }}>{g.arr ? fmtUSD(g.arr) : "—"}</div></div>
            <div className="stat"><div className="k">Founder</div><div className="v">{g.eq}%</div><div className="k" style={{ marginTop: 4 }}>{g.pat > 0 ? "Patrimonio" : "Equipo"}</div><div className="v" style={{ fontSize: 11 }}>{g.pat > 0 ? fmtUSD(g.pat) : g.emp}</div></div>
          </div>
        </div>
        <div className="era"><span><b>{era.clima}</b> {era.nombre}</span><span className="mono">MÚLTIPLO {era.mult}x · CAPITAL {era.capital.toUpperCase()}</span></div>
        <div className="tabla">
          <div className="thead"><span>Año</span><span>Empresa</span><span style={{ textAlign: "center" }}>OVR</span><span style={{ textAlign: "right" }}>ARR</span></div>
          {TURN_YEARS.map((y, i) => {
            const row = g.rows.find((r) => r.year === y);
            if (row) return <Fila key={y} row={row} />;
            if (i === g.ti) return <div className="trow actual" key={y}><span className="yr">{y}</span><span className="empresa" style={{ color: "var(--dim)" }}>Decidiendo…</span><span style={{ textAlign: "center" }}><OvrPill v={g.ovr} /></span><span className="arrv" /></div>;
            return <div className="trow ghost" key={y}><span className="yr">{y}</span><span /><span /><span /></div>;
          })}
          <div className="trow ghost"><span className="yr">2026</span><span className="empresa">Balance final</span><span /><span /></div>
        </div>
        {momentumTxt && <p className="mini mono" style={{ color: momentumTxt.includes("▲") ? "var(--up)" : "var(--down)" }}>{momentumTxt}</p>}
        {card && <div className="card">
          <div className="top"><span className="yearbig">{year}</span>{card.isEmergency ? <span className="tepaso" style={{ background: "#7A1F27", color: "#FFD9DC" }}>EMERGENCIA</span> : card.isPost ? <span className="tepaso" style={{ background: "#1F5C46", color: "#D7FFE9" }}>EXIT</span> : isTP ? <span className="tepaso">TE PASÓ</span> : null}</div>
          <h2>{card.t}</h2>
          <p className="flavor">{card.f}</p>
          {opts.map((o, i) => {
            const realIdx = card.o.indexOf(o);
            const state = chosen == null ? "" : chosen === realIdx ? (result ? (result.good ? " win" : " lose") : " win") : " dimmed";
            return <button key={i} className={"opt" + state} onClick={() => choose(realIdx)}>
              <span className="l"><span className="letra">{String.fromCharCode(65 + i)}</span>{o.l}</span>
              <span className="d">{o.d}{o.bet ? ` · ${Math.round(o.bet.p * 100)}% / ${Math.round((1 - o.bet.p) * 100)}%` : ""}</span>
            </button>;
          })}
          {result && <div className={"result " + (result.good ? "good" : "bad")}>{result.good ? "▲ " : "▼ "}{result.txt}</div>}
          {chosen != null && <div style={{ padding: "0 12px 14px" }}><button className="btn pri" onClick={nextTurn}>Continuar →</button></div>}
        </div>}
      </div></div>
    );
  }

  if (screen === "end" && g) {
    const e = g.endType;
    const trayectoria = [...new Set(g.rows.filter((r) => !r.playa).map((r) => r.etapa))];
    return (
      <div className="app"><style>{css}</style><div className="col">
        <Ticker clima={e.key === "digna" || e.key === "escandalo" || e.key === "playa0" ? "⛈" : "☀️"} />
        <div className="brand"><h1>Carrera finalizada</h1><span>Compartí tu carrera</span></div>
        <div className="tabla">
          <div className="thead"><span>Año</span><span>Empresa</span><span style={{ textAlign: "center" }}>OVR</span><span style={{ textAlign: "right" }}>ARR</span></div>
          {g.rows.map((row) => <Fila key={row.year} row={row} />)}
        </div>
        <div className="sharecard">
          <div className="sc-head">
            <div className={"ovrbox t-" + ovrTier(g.ovrPeak)} style={{ width: 72, height: 72 }}><span className="k">OVR PICO</span><span className="n">{g.ovrPeak}</span></div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", gap: 7, alignItems: "center", flexWrap: "wrap" }}>
                <span className="logo" style={{ background: setup.color + "33", width: 26, height: 26, fontSize: 15 }}>{setup.emoji}</span>
                <b style={{ fontSize: 19 }}>{g.exits.length && g.coN > 1 ? g.exits[0].name + " → " + g.coName : g.coName}</b>
                <span>{HQS.find((h) => h.id === setup.hq)?.flag}</span>
                <span className="chip">{VERTICALS.find((v) => v.id === setup.vertical)?.label}</span>
              </div>
              <div className="mono" style={{ color: "var(--dim)", fontSize: 12, marginTop: 5 }}>VALUACIÓN PICO <b style={{ color: "var(--up)" }}>{fmtUSD(g.valPeak)}</b></div>
              {showName && setup.apellido && <div style={{ color: "var(--dim)", fontSize: 12, marginTop: 2 }}>Fundada por {setup.apellido}</div>}
            </div>
          </div>
          <div className="sc-stats">
            <div><div className="k">AÑOS</div><div className="v">{g.rows.length * 3}</div></div>
            <div><div className="k">ARR PICO</div><div className="v">{fmtUSD(Math.max(...g.rows.map((r) => r.arr || 0), 0))}</div></div>
            <div><div className="k">EQUIPO PICO</div><div className="v">{g.empPeak}</div></div>
            <div><div className="k">FOUNDER</div><div className="v">{g.eq}%</div></div>
          </div>
          <div className="sc-sec">Trayectoria</div>
          <div className="tray">{trayectoria.map((t) => <span className="chip" key={t}>{t}</span>)}</div>
          {Object.keys(g.logros).length > 0 && <><div className="sc-sec">Hitos</div>
            <div className="hitochips">{Object.entries(g.logros).map(([k, v]) => <span className="hitochip" key={k}><span className="em">{k}</span>{LOGROS_INFO[k] || ""}{v > 1 && <span className="xn">×{v}</span>}</span>)}</div></>}
          <div className="finaltxt">{e.emoji} {e.titulo}</div>
          {g.pat > 0 && <p className="mini mono">Patrimonio personal: {fmtUSD(g.pat)}</p>}
          <div className="sc-foot"><span>Jugá la tuya · <b style={{ color: "var(--ink)" }}>Tu Carrera Emprendedora</b> por Parlyx AI</span><span className="mono">seed {g.seedStr}</span></div>
        </div>
        <div className="toggle"><span>Mostrar mi nombre</span><div className={"sw2" + (showName ? " on" : "")} onClick={() => setShowName(!showName)}><div className="dot" /></div></div>
        <div style={{ marginTop: 16 }}>
          <button className="btn pri" onClick={copyResult}>{copied ? "✓ Copiado" : "Copiar resultado"}</button>
          <button className="btn sec" onClick={() => { startGame(g.seedStr); }}>Revancha (misma seed)</button>
          <button className="btn sec" onClick={() => { setSeedStr(randSeed()); setStep(0); setScreen("setup"); }}>Nueva partida</button>
        </div>
      </div></div>
    );
  }
  return null;
}
