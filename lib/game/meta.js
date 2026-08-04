/* Metadata de presentación del juego (setup, formatos, logros).
   Los ids coinciden con lib/engine (VERTICALS, CAPITALES) y con el deck. */

export const VERTICALS_META = [
  { id: "saas", label: "SaaS B2B", emoji: "🧩", nota: "el camino sólido" },
  { id: "fintech", label: "Fintech", emoji: "🏦", nota: "el regulador te mira" },
  { id: "ecom", label: "E-commerce", emoji: "🛒", nota: "boom 2020, resaca 2022" },
  { id: "marketplace", label: "Marketplace", emoji: "🔁", nota: "el ganador se lleva todo" },
  { id: "ai", label: "AI / ML", emoji: "🤖", nota: "antes de 2015 nadie te cree" },
  { id: "gaming", label: "Gaming", emoji: "🎮", nota: "vivís de pegarla" },
  { id: "deeptech", label: "Deep tech", emoji: "🔬", nota: "lento, caro, enorme" },
  { id: "crypto", label: "Cripto / Web3", emoji: "⛓️", nota: "x10 o cero" },
];

export const HQS_META = [
  { id: "ba", label: "Buenos Aires", flag: "🇦🇷" },
  { id: "cdmx", label: "CDMX", flag: "🇲🇽" },
  { id: "sp", label: "São Paulo", flag: "🇧🇷" },
  { id: "bog", label: "Bogotá", flag: "🇨🇴" },
  { id: "scl", label: "Santiago", flag: "🇨🇱" },
  { id: "mia", label: "Miami", flag: "🇺🇸" },
];

export const CAPITALES_META = [
  { id: "boot", label: "Bootstrap", narrativa: "Con lo puesto. Cada mes es una decisión.", monto: "USD 15.000", eq: 0 },
  { id: "fff", label: "Friends & Family", narrativa: "La plata del asado. Ahora todos opinan.", monto: "USD 100.000", eq: 8 },
  { id: "vc", label: "Pre-seed VC", narrativa: "Un fondo te firmó. También te puso metas.", monto: "USD 500.000", eq: 15 },
];

export const EMOJIS = ["🚀", "⚡", "🌵", "🐍", "🔥", "🌊", "🦫", "🛰️", "🍋", "🧉", "🪐", "🐙"];
export const COLORS = ["#16C784", "#F0B90B", "#A78BFA", "#3B82F6", "#EA3943", "#EC4899", "#22D3EE", "#F97316"];
export const NOMBRES = ["Zentra", "Kualo", "Nexbi", "Rumbo", "Fintia", "Orbital", "Lumen", "Waira", "Tandem", "Vireo", "Chasqui", "Pampa"];

export const LOGROS_INFO = {
  "💵": "Primer millón de ARR",
  "📈": "ARR 10M",
  "👥": "100 empleados",
  "🌍": "Multi-mercado",
  "🦄": "Unicornio",
  "🔔": "Tocaste la campana",
  "✝": "Casi-muerte superada",
  "🔁": "Comeback",
  "💰": "Exit",
  "🏖": "Modo playa",
};

export const ETAPAS = ["Garage", "Seed", "Serie A", "Serie B", "Serie C", "Gigante"];

/* Edad inicial fija en F2 (el picker 20-25 del PRD §5 queda para F4). */
export const EDAD_INICIAL = 22;

export const ovrTier = (o) => (o >= 90 ? "violeta" : o >= 80 ? "dorado" : o >= 70 ? "plata" : "bronce");

export const fmtUSD = (n) => {
  if (n >= 1e9) return "USD " + (n / 1e9).toFixed(n >= 1e10 ? 0 : 1) + " B";
  if (n >= 1e6) return "USD " + (n / 1e6).toFixed(n >= 1e8 ? 0 : 1) + " M";
  if (n >= 1e3) return "USD " + Math.round(n / 1e3) + " K";
  return "USD " + Math.round(n);
};

export const ERA_NOMBRES = new Map([
  [1993, "Burbuja punto-com"], [1996, "Burbuja punto-com"], [1999, "Burbuja punto-com"],
  [2002, "Invierno nuclear"], [2005, "Recuperación web 2.0"], [2008, "Crisis global"],
  [2011, "Boom mobile y SaaS"], [2014, "Boom mobile y SaaS"], [2017, "Abundancia"],
  [2020, "Shock y fiesta"], [2023, "Era AI"],
]);

export const climaEmoji = (c) => (c === 2 ? "☀️☀️" : c === 1 ? "☀️" : c === 0 ? "⛅" : c === -1 ? "🌧" : "⛈");
