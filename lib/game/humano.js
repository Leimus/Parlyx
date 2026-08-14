/* ============================================================
   LENGUAJE HUMANO (PRD v1.0 §5): la notación de motor no existe
   para el jugador. Este módulo traduce los `raw` del deck viejo
   (RW/TEND/EQ/ARR/PAT/⚑) a consecuencias en palabras, en render.
   La capa e-commerce nueva ya está escrita en humano de origen.
   El test: tu vieja que tiene un local entiende cada carta.
   Auditado por scripts/check-lenguaje.mjs (cero fugas de jerga).
   ============================================================ */

/* Overrides por opción para los casos donde la regex queda torpe
   (encadenamientos de emergencia, specials narrativos). */
const OVERRIDES = {
  "E-01:A": "ver qué dicen los que pusieron plata",
  "E-01:B": "ver si la oferta de compra sigue en pie",
  "E-02:C": "cerrar con la frente alta (OVR +1)",
  "E-03:C": "cerrar antes de endeudarte",
  "E-04:C": "cerrar por tu cuenta",
  "M-13:C": "vendés la empresa en el mejor momento posible (×1.5)",
  "G-14:A": "vendés la empresa: plata que te cambia la vida",
  "F-01:A": "salís a la bolsa: el final soñado 🔔",
  "F-01:C": "vendés a un grande sin el riesgo del mercado (×1.1)",
  "F-02:C": "te vas con tu parte y tu orgullo · se abre otra vida",
  "F-05:B": "pasás · OVR +1 cuando pase la moda",
  "EJ-01:A": "entrás al gigante como VP · tu marca sigue sin vos al mando",
};

const REGLAS = [
  // Runway → caja
  [/RW \+(\d+)m/g, "+$1 meses de caja"],
  [/RW -(\d+)m/g, "$1 meses menos de caja"],
  // Equity → tu parte
  [/EQ \+(\d+)%( \(recuperás\))?/g, "recuperás el $1% de tu empresa"],
  [/EQ -(\d+)%( \(dilución baja: el múltiplo te protege\))?/g, "cedés el $1% de tu empresa"],
  [/EQ 0%/g, "sin ceder nada de tu empresa"],
  // ARR → ventas
  [/ARR \+(\d+)%/g, "ventas +$1%"],
  [/ARR -(\d+)%/g, "ventas -$1%"],
  [/ARR estable/g, "ventas estables"],
  [/\bARR\b/g, "ventas"],
  // Tendencia → consecuencia cualitativa
  [/TEND \+3/g, "el futuro se te abre enorme"],
  [/TEND \+2/g, "te carga los dados del futuro"],
  [/TEND \+1/g, "te ordena el futuro"],
  [/TEND -1/g, "te frena el futuro"],
  [/TEND -2/g, "te hipoteca el futuro"],
  [/TEND ±2 según resultados/g, "el futuro depende de cómo te vaya"],
  // Patrimonio → tu plata / tu bolsillo
  [/PAT \+(\d+(?:\.\d+)?)M\b/g, "+USD $1 M a tu bolsillo"],
  [/PAT \+(\d+)K-1M según OVR/g, "entre USD $1 mil y 1 M a tu bolsillo, según tu nivel"],
  [/PAT \+(\d+)K(\/trienio)?/g, "+USD $1 mil a tu bolsillo$2"],
  [/PAT ×([\d.]+)(\/trienio)?/g, "tu plata ×$1$2"],
  [/PAT \+(\d+)%/g, "tu plata +$1%"],
  [/PAT -(\d+)%/g, "tu plata -$1%"],
  [/PAT -todo/g, "ponés hasta el último peso tuyo"],
  [/PAT financia el arranque \(RW inicial = PAT\/burn\)/g, "tu plata banca el arranque"],
  [/PAT según (el )?exit/g, "cobrás según la venta"],
  [/PAT según valuación y EQ/g, "cobrás tu parte de la venta"],
  [/\bPAT\b/g, "tu plata"],
  // Flags: mecánica invisible — se borran de pantalla
  [/ ?·? ?⚑ ?[\wáéíóúñ_]+( \([^)]*\))?/g, ""],
  // Valuación / múltiplos → tu marca vale
  [/valuación ×2 este trienio/g, "tu marca vale el doble este tramo"],
  [/valuación \+(\d+)%/g, "tu marca vale $1% más"],
  [/valuación -(\d+)% por flag/g, "tu marca vale menos por cada mancha que arrastres"],
  [/múltiplo AI \(×2\.5\)/g, "tu marca pasa a valer ×2.5"],
  [/múltiplo -(\d+)% este trienio/g, "tu marca vale $1% menos este tramo"],
  [/múltiplo -(\d+)%/g, "tu marca vale $1% menos"],
  [/múltiplo \+(\d+)%/g, "tu marca vale $1% más"],
  [/valuación pico ×1\.3 en el papel/g, "tu marca vale ×1.3 en el papel"],
  [/valuación \+20%/g, "tu marca vale 20% más"],
  [/la valuación se cae/g, "tu marca vale menos"],
  // Jerga de inversión → castellano
  [/term sheets? mejorad?os?/gi, "mejores ofertas de inversión"],
  [/term sheets? de élite/gi, "las mejores ofertas de inversión"],
  [/term sheets?/gi, "ofertas de inversión"],
  [/down round/gi, "te valúan menos que antes"],
  [/inside round/gi, "rescate de tus propios inversores"],
  [/venture debt/gi, "plata prestada"],
  [/due diligence/gi, "la revisación de los números"],
  [/runway/gi, "caja"],
  [/\bequity\b/gi, "tu parte"],
  [/cash-flow positivo/gi, "ganando plata"],
  [/spin-off con (\d+)% tuyo/g, "un negocio nuevo con el $1% tuyo"],
  [/techo re-sorteado( \+10% tramos altos)?/g, "tu techo se vuelve a sortear (más alto)"],
  [/techo de OVR -(\d+)( mientras no salgas)?/g, "tu techo baja $1$2"],
  [/entra modo ejecutivo · Cargo #(\d+)/g, "entrás al mundo corporativo"],
  [/modo ejecutivo/g, "el mundo corporativo"],
  [/Cargo -1/g, "ascendés"],
  [/Cargo \+1 \(bajás\)/g, "bajás un escalón"],
  [/comeback:/g, "volvés a empezar:"],
  [/OVR inicial (\d+)/g, "arrancás con OVR $1"],
  [/exit ×2/gi, "la venta, al doble"],
  [/final Exit chico/g, "vendés la empresa"],
  [/final Exit grande/g, "la venta grande"],
  [/final IPO técnico/g, "salís a la bolsa por la ventana"],
  [/habilita retiro \(gate [^)]+\)/g, "se abre la puerta del retiro"],
  [/habilita (el )?final [«"“]?([^»"”·]+)[»"”]?/g, "se abre el final: $2"],
  [/trienios?/g, "tramo"],
  /* Restos de jerga tecno del deck pre-pivote (SPEC v3): con el flavor a
     17px quedaron a la vista. Son términos que el comercio no usa. */
  [/\bfeatures?\b/gi, "novedad"],
  [/\bburnout\b/gi, "te quemás"],
  [/\bel growth\b/gi, "el crecimiento"],
  [/\bgrowth\b/gi, "crecimiento"],
  [/board complicado/gi, "los que pusieron plata, incómodos"],
  [/dormido en el board/gi, "dormido en la reunión"],
  [/con el board/gi, "con los que pusieron plata"],
  [/\bel board\b/gi, "los que pusieron plata"],
  [/\bboard\b/gi, "los que pusieron plata"],
  [/\bpipelines?\b/gi, "las ventas en curso"],
  [/\bchurn\b/gi, "la gente que se va"],
  [/\bpitch(es)?\b/gi, "el discurso de venta"],
  // Limpieza de separadores huérfanos
  [/ · ·/g, " ·"],
  [/·\s*$/g, ""],
  [/^\s*·\s*/g, ""],
  [/\s{2,}/g, " "],
];

export function humanizar(raw, cardId, opId) {
  if (cardId && opId && OVERRIDES[`${cardId}:${opId}`]) return OVERRIDES[`${cardId}:${opId}`];
  if (!raw) return "";
  let s = raw;
  for (const [re, rep] of REGLAS) s = s.replace(re, rep);
  return s.trim();
}

/* Tokens de jerga que NO pueden llegar a pantalla (auditoría). */
export const JERGA_PROHIBIDA = [
  /RW [+-]?\d/, /TEND [+-]?\d/, /EQ [+-]\d/, /\bARR\b/, /\bPAT\b/, /⚑/,
  /arrMul/, /term sheet/i, /down round/i, /runway/i, /\bequity\b/i, /trienio/,
  /* SPEC v3: jerga tecno que sobrevivió al pivote a comercio. Se vigilan
     solo los campos que humanizar() controla (raw y textos de apuesta);
     los títulos y flavors con "CTO"/"founder" son prosa de contenido y
     van con revisión del owner, no con un regex. */
  /\bfeatures?\b/i, /\bburnout\b/i, /\bchurn\b/i, /\bpipeline\b/i,
];
