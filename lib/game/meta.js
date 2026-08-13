/* Metadata de presentación del juego (setup, formatos, logros).
   Los ids coinciden con lib/engine (VERTICALS, CAPITALES) y con el deck. */

/* Rubros del pivote e-commerce (PRD v1.0 §2): sabores, no mecánicas. */
export const RUBROS_META = [
  { id: "moda", label: "Moda", nota: "la percha no perdona" },
  { id: "deco", label: "Deco & Hogar", nota: "todos quieren esa lámpara" },
  { id: "mate", label: "Mate & Regionales", nota: "lo nuestro, bien hecho" },
  { id: "tecno", label: "Tecnología", nota: "cables, fundas y fe" },
  { id: "belleza", label: "Belleza", nota: "frascos que prometen" },
  { id: "alimentos", label: "Alimentos", nota: "rico o nada" },
];

/* Los 12 isotipos de marca (SVG propios, §6 — el color los tiñe). */
export const ISOTIPOS = ["rombo", "ola", "rayo", "hoja", "estrella", "luna", "sol", "montana", "gota", "llama", "flor", "ancla"];

/* Placeholders con voz: marcas ficticias que rotan en el input. */
export const MARCAS_PLACEHOLDER = ["Pampa Viva", "Doña Petra", "La Yunta", "Cardo", "Ñandú", "Alfajoria", "Ruda", "Punto Sur", "Barro", "Matecito"];

export const HQS_META = [
  { id: "ba", label: "Buenos Aires", flag: "🇦🇷" },
  { id: "cdmx", label: "CDMX", flag: "🇲🇽" },
  { id: "sp", label: "São Paulo", flag: "🇧🇷" },
  { id: "bog", label: "Bogotá", flag: "🇨🇴" },
  { id: "scl", label: "Santiago", flag: "🇨🇱" },
  { id: "mia", label: "Miami", flag: "🇺🇸" },
];

export const CAPITALES_META = [
  { id: "boot", label: "Los ahorros", narrativa: "Lo que juntaste, a la mesa. Cada mes es una decisión.", monto: "USD 15.000", eq: 0, detalle: "6 meses de caja" },
  { id: "fff", label: "El préstamo familiar", narrativa: "La plata del asado. Ahora todos opinan.", monto: "USD 100.000", eq: 8, detalle: "14 meses de caja · cedés el 8%" },
  { id: "vc", label: "El socio capitalista", narrativa: "Pone plata, pide resultados. Y los pide ya.", monto: "USD 500.000", eq: 15, detalle: "20 meses de caja · cedés el 15%" },
];

export const EMOJIS = ["🚀", "⚡", "🌵", "🐍", "🔥", "🌊", "🦫", "🛰️", "🍋", "🧉", "🪐", "🐙"];
export const COLORS = ["#16C784", "#F0B90B", "#A78BFA", "#3B82F6", "#EA3943", "#EC4899", "#22D3EE", "#F97316"];
export const NOMBRES = ["Pampa Viva", "Cardo", "La Yunta", "Ruda", "Barro", "Ñandú", "Punto Sur", "Waira", "Chasqui", "Lumen", "Rumbo", "Tandem"];

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

/* Versión sin prefijo para la columna de Ventas de la tabla (SPEC v3 §1):
   a 16px de nombre de marca, los 3 caracteres de "USD" son la diferencia
   entre que el nombre entre o se corte. El encabezado ya dice "Ventas". */
export const fmtCompacto = (n) => {
  if (n >= 1e9) return (n / 1e9).toFixed(n >= 1e10 ? 0 : 1) + "B";
  if (n >= 1e6) return (n / 1e6).toFixed(n >= 1e8 ? 0 : 1) + "M";
  if (n >= 1e3) return Math.round(n / 1e3) + "K";
  return String(Math.round(n));
};

export const ERA_NOMBRES = new Map([
  [1993, "Burbuja punto-com"], [1996, "Burbuja punto-com"], [1999, "Burbuja punto-com"],
  [2002, "Invierno nuclear"], [2005, "Recuperación web 2.0"], [2008, "Crisis global"],
  [2011, "Boom mobile y SaaS"], [2014, "Boom mobile y SaaS"], [2017, "Abundancia"],
  [2020, "Shock y fiesta"], [2023, "Era AI"],
]);

export const climaEmoji = (c) => (c === 2 ? "☀️☀️" : c === 1 ? "☀️" : c === 0 ? "⛅" : c === -1 ? "🌧" : "⛈");

/* ---------- MARCOS DE ÉPOCA (SPEC v3 §3) ----------
   La carta de decisión se renderiza con la estética del medio por el que
   uno se enteraba de las cosas en cada era. Es el reloj narrativo del
   juego. Con los 11 años de TURN_YEARS esto da 5 marcos y 4 transiciones
   (1999, 2008, 2014, 2023). El HUD y la tabla NUNCA cambian: son lo que
   unifica todo. */
export const MARCOS = [
  { id: "diario", hasta: 1998, cartel: "1993 · el mundo llega en papel" },
  { id: "crt", hasta: 2007, cartel: "1999 · llegó internet" },
  { id: "laptop", hasta: 2013, cartel: "2008 · la web se hizo grande" },
  { id: "movil", hasta: 2020, cartel: "2014 · todo en el bolsillo" },
  { id: "chat", hasta: 2026, cartel: "2021 · todo es conversación" },
];
export const marcoDe = (y) => (MARCOS.find((m) => y <= m.hasta) || MARCOS[MARCOS.length - 1]).id;
export const cartelDe = (y) => (MARCOS.find((m) => y <= m.hasta) || MARCOS[MARCOS.length - 1]).cartel;
