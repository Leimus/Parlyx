/* ============================================================
   Schema Zod del deck — fuente de verdad estructural de las cartas.

   Principio de conversión (docs/deck-lote-*.md → data/cards/*.json):
   - Todo lo que sigue la notación estándar del deck (OVR, TEND, RW,
     EQ, ARR, PAT, ⚑, apuestas %/%) se estructura en `efectos`/`apuesta`.
   - Todo efecto narrativo aún no mecanizado por el motor (modo
     ejecutivo, techo re-sorteado, "PAT -todo", etc.) va en `special`
     y/o `notas`, y el texto EXACTO del .md se preserva en `raw` de
     cada opción: la conversión no pierde información.
   - Los .md siguen siendo la fuente de verdad del CONTENIDO; estos
     JSON son la forma ejecutable. Cambios de contenido se hacen en
     los .md y se re-convierten (o en ambos, a la vez).
   ============================================================ */
import { z } from "zod";

export const VERTICAL_IDS = ["saas", "fintech", "ecom", "marketplace", "ai", "gaming", "deeptech", "crypto"];
/* Rubros del pivote e-commerce (PRD v1.0 §2): sabores, no mecánicas. */
export const RUBRO_IDS = ["moda", "deco", "mate", "tecno", "belleza", "alimentos"];
export const HQ_IDS = ["ba", "cdmx", "sp", "bog", "scl", "mia"];
export const MODOS = ["founder", "ejecutivo", "playa"];
export const TIPOS = ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9"];
export const BLOQUES = [
  "macro", "ejecutivo", "generales", "emergencia", "ecommerce",
  "hq", "equipo", "financiamiento", "playa", "color",
];
/* Conteo por bloque. El pivote v1.0 reemplaza la capa de verticales tech
   (16) por la capa e-commerce (25): deck de 111 cartas. */
export const CARTAS_POR_BLOQUE = {
  macro: 15, ejecutivo: 12, generales: 20, emergencia: 5, ecommerce: 25,
  hq: 8, equipo: 8, financiamiento: 5, playa: 8, color: 5,
};
export const MARKERS = ["↳", "↓", "✝", "🔁"];

const Vertical = z.enum(VERTICAL_IDS);
const HQ = z.enum(HQ_IDS);

/* Efectos determinísticos con la notación estándar del deck.
   Convención de unidades:
   - ovr/tend/tendLenta: puntos enteros o medios (la política proxy usa -0.5)
   - rw: meses (±)
   - eq: puntos de equity (± — positivo = recuperás, como G-05 A)
   - arrMul: multiplicador (ARR +30% → 1.3 · ARR -40% → 0.6)
   - pat: USD absolutos (PAT +500K → 500000)
   - patMul / patPct: multiplicador (PAT ×2 → 2) / fracción (PAT -30% → -0.3)
   - valMul: multiplicador de valuación del trienio (valuación ×2 → 2)
   - multMul: multiplicador del múltiplo de era del trienio (múltiplo -20% → 0.8)
   - cargo: delta de cargo ejecutivo (-1 = subís en el organigrama)
   - flags/quitaFlags: ⚑ que se prenden/apagan
   - marker: marcador de fila (↳ ↓ ✝ 🔁) · hito: emoji de logro */
const Efectos = z
  .object({
    ovr: z.number().optional(),
    tend: z.number().optional(),
    tendLenta: z.number().optional(),
    rw: z.number().optional(),
    eq: z.number().optional(),
    arrMul: z.number().positive().optional(),
    pat: z.number().optional(),
    patMul: z.number().optional(),
    patPct: z.number().min(-1).max(1).optional(),
    valMul: z.number().positive().optional(),
    multMul: z.number().positive().optional(),
    cargo: z.number().int().optional(),
    techoDelta: z.number().int().optional(),
    flags: z.array(z.string()).optional(),
    quitaFlags: z.array(z.string()).optional(),
    marker: z.enum(MARKERS).optional(),
    hito: z.string().optional(),
    /* Efecto narrativo no mecanizado (entraEjecutivo, comeback, cambiaHQ,
       sellNow, ipo, retechear, patTodo, …). Detalle en notas/raw. */
    special: z.string().optional(),
  })
  .strict();

const Rama = z
  .object({
    texto: z.string().optional(),
    efectos: Efectos.optional(),
    goto: z.string().optional(),
  })
  .strict();

const Apuesta = z
  .object({
    p: z.number().gt(0).lt(1), // probabilidad de "gana" (la píldora verde)
    gana: Rama,
    pierde: Rama,
  })
  .strict();

const Opcion = z
  .object({
    id: z.enum(["A", "B", "C", "D"]),
    label: z.string().min(1).max(60),
    /* Texto EXACTO de efectos del .md (después de la flecha →). */
    raw: z.string().min(1),
    efectos: Efectos.optional(),
    apuesta: Apuesta.optional(),
    goto: z.string().optional(), // encadenamiento E-01 → E-02/E-04/E-05
    condicion: z.string().optional(), // gate a nivel opción ("solo si OVR ≥ 75")
    notas: z.string().optional(),
  })
  .strict();

const Rubro = z.enum(RUBRO_IDS);

const TePaso = z
  .object({
    todos: z.boolean().optional(),
    verticales: z.array(Vertical).optional(),
    rubros: z.array(Rubro).optional(),
    hqs: z.array(HQ).optional(),
    nota: z.string().optional(), // "bendición para AI, amenaza para el resto"
  })
  .strict();

const Elegibilidad = z
  .object({
    modos: z.array(z.enum(MODOS)).min(1),
    ventana: z.tuple([z.number().int().min(1993).max(2026), z.number().int().min(1993).max(2026)]).optional(),
    verticales: z.array(Vertical).optional(),
    rubros: z.array(Rubro).optional(),
    hqs: z.array(HQ).optional(),
    hqNo: z.array(HQ).optional(),
    /* Etapas por valuación: 0 Garage · 1 Seed · 2 Serie A · 3 Serie B · 4 Serie C · 5 Gigante */
    etapaMin: z.number().int().min(0).max(5).optional(),
    etapaMax: z.number().int().min(0).max(5).optional(),
    turnoMin: z.number().int().min(1).max(11).optional(),
    turnoMax: z.number().int().min(1).max(11).optional(),
    edadMax: z.number().int().optional(),
    ovrMin: z.number().int().optional(),
    patMin: z.number().optional(),
    cargoMin: z.number().int().optional(), // ejecutivo: 1 = CEO … 6 = VP raso
    cargoMax: z.number().int().optional(),
    flagsRequeridos: z.array(z.string()).optional(),
    trigger: z.string().optional(), // "RW = 0", "desde E-01", "aceptaste una adquisición"…
    condicion: z.string().optional(), // condición libre aún no mecanizada
  })
  .strict();

export const Card = z
  .object({
    id: z.string().regex(/^(M|EJ|G|E|EC|H|T|F|P|C)-\d{2}$/),
    bloque: z.enum(BLOQUES),
    titulo: z.string().min(1).max(60),
    flavor: z.string().min(1),
    tipo: z.enum(TIPOS),
    forzada: z.boolean().optional(), // T4/T7 forzadas (emergencia)
    reactiva: z.boolean().optional(), // cartas reactivas entre turnos (EJ-01)
    tePaso: TePaso.optional(),
    elegibilidad: Elegibilidad,
    opciones: z.array(Opcion).min(2).max(4), // 4 solo para "El tiempo que recuperaste" (PRD v1.0 §4.2)
    notas: z.string().optional(), // notas de diseño del .md (cursivas)
  })
  .strict();

export const CardFile = z
  .object({
    bloque: z.enum(BLOQUES),
    fuente: z.string(), // qué .md y sección origina este archivo
    cartas: z.array(Card).min(1),
  })
  .strict();

export function validateCardFile(json) {
  return CardFile.parse(json);
}
