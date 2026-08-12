#!/usr/bin/env node
/* Auditoría de LENGUAJE HUMANO (PRD v1.0 §5): pasa humanizar() sobre
   TODOS los raw/labels/textos del deck y falla si queda jerga de motor
   en lo que vería el jugador. Corre en CI. */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { humanizar, JERGA_PROHIBIDA } from "../lib/game/humano.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CARDS_DIR = path.join(__dirname, "..", "data", "cards");

let fugas = 0;
let revisadas = 0;

function check(cardId, opId, campo, texto) {
  if (!texto) return;
  const humano = humanizar(texto, cardId, opId);
  revisadas++;
  for (const re of JERGA_PROHIBIDA) {
    if (re.test(humano)) {
      fugas++;
      console.error(`  ✗ ${cardId}${opId ? "." + opId : ""} ${campo}: "${humano}" ← fuga de jerga (${re})`);
      return;
    }
  }
}

for (const f of fs.readdirSync(CARDS_DIR).filter((x) => x.endsWith(".json")).sort()) {
  const data = JSON.parse(fs.readFileSync(path.join(CARDS_DIR, f), "utf8"));
  if (data.bloque === "ejecutivo") continue; // fuera del pool de juego (F3)
  for (const c of data.cartas) {
    check(c.id, null, "titulo", c.titulo);
    check(c.id, null, "flavor", c.flavor);
    for (const o of c.opciones) {
      check(c.id, o.id, "label", o.label);
      check(c.id, o.id, "raw", o.raw);
      if (o.apuesta) {
        check(c.id, o.id, "gana", o.apuesta.gana.texto);
        check(c.id, o.id, "pierde", o.apuesta.pierde.texto);
      }
    }
  }
}

console.log(`=== LENGUAJE HUMANO ===\n${revisadas} textos auditados · ${fugas} fugas de jerga`);
if (fugas) {
  console.error("✗ La notación de motor no puede llegar a pantalla (PRD v1.0 §5).");
  process.exit(1);
}
console.log("✓ Cero jerga en pantalla. Tu vieja entiende cada carta.");
