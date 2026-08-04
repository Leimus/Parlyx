#!/usr/bin/env node
/* ============================================================
   Validación del deck (data/cards/*.json) contra el schema Zod
   + chequeos cruzados de integridad. Corre en CI (npm test).

   Uso:
     node scripts/validate-cards.mjs            → valida todo el deck
     node scripts/validate-cards.mjs --file F   → valida un solo archivo
                                                  (sin chequeos globales)
   ============================================================ */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { CardFile, CARTAS_POR_BLOQUE } from "../lib/cards/schema.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CARDS_DIR = path.join(__dirname, "..", "data", "cards");

const args = process.argv.slice(2);
const fileArgIdx = args.indexOf("--file");
const singleFile = fileArgIdx >= 0 ? args[fileArgIdx + 1] : null;

/* Marcas reales usadas como personajes = violación de la regla dura #2 del
   PRD §15. Lista acotada a arquetipos sensibles; usos cotidianos legítimos
   del propio .md (WhatsApp como medio, Excel, LinkedIn) no están acá. */
const MARCAS_PROHIBIDAS = [
  "Amazon", "Google", "Apple", "Microsoft", "OpenAI", "ChatGPT", "Meta ", "Facebook",
  "Mercado Libre", "MercadoLibre", "Nubank", "Rappi", "Globant", "SoftBank", "Softbank",
  "Lehman", "FTX", "Binance", "Sequoia", "a16z", "Y Combinator", "Uber", "Airbnb",
  "Stripe", "Netflix", "Tesla", "SpaceX", "Musk", "Bezos", "Jobs", "Zuckerberg", "Galperin",
];

let errores = 0;
let advertencias = 0;
const err = (msg) => { errores++; console.error("  ✗ " + msg); };
const warn = (msg) => { advertencias++; console.warn("  ⚠ " + msg); };

function validarArchivo(filePath) {
  const nombre = path.basename(filePath);
  let json;
  try {
    json = JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (e) {
    err(`${nombre}: JSON inválido — ${e.message}`);
    return null;
  }
  const parsed = CardFile.safeParse(json);
  if (!parsed.success) {
    for (const issue of parsed.error.issues.slice(0, 20)) {
      err(`${nombre}: ${issue.path.join(".")} — ${issue.message}`);
    }
    if (parsed.error.issues.length > 20) err(`${nombre}: … y ${parsed.error.issues.length - 20} issues más`);
    return null;
  }
  const data = parsed.data;

  const esperadas = CARTAS_POR_BLOQUE[data.bloque];
  if (data.cartas.length !== esperadas) {
    err(`${nombre}: bloque "${data.bloque}" tiene ${data.cartas.length} cartas, se esperan ${esperadas}`);
  }

  for (const carta of data.cartas) {
    const ctx = `${nombre} › ${carta.id}`;
    if (carta.bloque !== data.bloque) err(`${ctx}: bloque "${carta.bloque}" ≠ bloque del archivo "${data.bloque}"`);
    if (carta.elegibilidad.ventana && carta.elegibilidad.ventana[0] > carta.elegibilidad.ventana[1]) {
      err(`${ctx}: ventana invertida [${carta.elegibilidad.ventana}]`);
    }
    const ids = carta.opciones.map((o) => o.id);
    if (new Set(ids).size !== ids.length) err(`${ctx}: opciones con id repetido (${ids})`);
    const texto = JSON.stringify(carta);
    for (const marca of MARCAS_PROHIBIDAS) {
      if (texto.includes(marca)) warn(`${ctx}: posible marca real "${marca.trim()}" (regla dura #2, PRD §15) — revisar`);
    }
  }
  return data;
}

console.log("=== VALIDACIÓN DEL DECK ===");

if (singleFile) {
  const data = validarArchivo(path.resolve(singleFile));
  if (data) console.log(`  ✓ ${path.basename(singleFile)}: ${data.cartas.length} cartas OK (bloque ${data.bloque})`);
  if (errores) { console.error(`\n${errores} errores.`); process.exit(1); }
  process.exit(0);
}

if (!fs.existsSync(CARDS_DIR)) {
  console.error("No existe " + CARDS_DIR);
  process.exit(1);
}
const archivos = fs.readdirSync(CARDS_DIR).filter((f) => f.endsWith(".json")).sort();
if (!archivos.length) {
  console.error("No hay archivos de cartas en " + CARDS_DIR);
  process.exit(1);
}

const todas = [];
const porBloque = {};
for (const f of archivos) {
  const data = validarArchivo(path.join(CARDS_DIR, f));
  if (!data) continue;
  console.log(`  ✓ ${f}: ${data.cartas.length} cartas (bloque ${data.bloque})`);
  porBloque[data.bloque] = (porBloque[data.bloque] || 0) + data.cartas.length;
  todas.push(...data.cartas);
}

/* --- Chequeos globales --- */
const ids = todas.map((c) => c.id);
const dup = ids.filter((id, i) => ids.indexOf(id) !== i);
if (dup.length) err(`IDs duplicados en el deck: ${[...new Set(dup)].join(", ")}`);

const idSet = new Set(ids);
for (const carta of todas) {
  for (const op of carta.opciones) {
    for (const g of [op.goto, op.apuesta?.gana?.goto, op.apuesta?.pierde?.goto]) {
      if (g && !idSet.has(g)) err(`${carta.id} opción ${op.id}: goto "${g}" no existe en el deck`);
    }
  }
}

for (const [bloque, esperadas] of Object.entries(CARTAS_POR_BLOQUE)) {
  if ((porBloque[bloque] || 0) !== esperadas) {
    err(`Bloque "${bloque}": ${porBloque[bloque] || 0} cartas, se esperan ${esperadas}`);
  }
}

const TOTAL = Object.values(CARTAS_POR_BLOQUE).reduce((a, b) => a + b, 0);
console.log(`\nTotal: ${todas.length}/${TOTAL} cartas · ${errores} errores · ${advertencias} advertencias`);
if (todas.length !== TOTAL) err(`El deck tiene ${todas.length} cartas, deben ser ${TOTAL}`);

if (errores) process.exit(1);
console.log("✓ Deck válido.");
