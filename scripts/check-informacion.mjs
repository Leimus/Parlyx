#!/usr/bin/env node
/* ============================================================
   SPEC v4 §1 — LA REGLA DE INFORMACIÓN, auditada en CI.

     Se muestra lo que PAGÁS. Se esconde lo que GANÁS.

   Falla el build si la línea que ve el jugador (o.linea, o el
   humanizar(raw) de fallback) contiene:
     · un número de RESULTADO (OVR, ventas %, equipo, valuación…)
     · una consecuencia de largo plazo etiquetada (lo que era TEND)
     · un adjetivo que ORDENA las opciones ("lo mejor", "la sólida")

   Excepción única del §1: las opciones de apuesta explícita
   conservan sus porcentajes — ahí el riesgo declarado ES la
   mecánica. Se auditan igual contra los adjetivos que ordenan.
   ============================================================ */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { humanizar } from "../lib/game/humano.js";

const CARDS_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "data", "cards");

/* Números de beneficio: lo que el jugador NO puede saber antes de elegir. */
const SPOILERS = [
  [/OVR\s*[+-]\s*\d/i, "número de OVR"],
  [/ventas\s*[+-]\s*\d+\s*%/i, "porcentaje de ventas"],
  [/ventas\s*×/i, "multiplicador de ventas"],
  [/equipo\s*[+-]\s*\d/i, "número de equipo"],
  [/(tu marca vale|valuación|múltiplo)/i, "efecto sobre la valuación"],
  [/(te ordena el futuro|te carga los dados|el futuro se te abre|te frena el futuro|te hipoteca)/i, "efecto de largo plazo etiquetado"],
  [/tu plata\s*\+/i, "ganancia de patrimonio"],
  [/\+USD\s*[\d.]+\s*(M|mil)/i, "ganancia en plata"],
  [/tu techo/i, "efecto sobre el techo oculto"],
];

/* Adjetivos que ordenan las opciones por el jugador (§1 los prohíbe
   incluso en las cartas de apuesta). */
const ORDENAN = [
  /\blo mejor\b/i, /\brecomendad[oa]\b/i, /\bla sólida\b/i, /\bla mejor opción\b/i,
  /\bconviene\b/i, /\bóptim[oa]\b/i, /\bla segura\b(?!\s*·)/i,
];

let fallas = 0;
let auditadas = 0;
let conLinea = 0;
let apuestas = 0;

for (const f of fs.readdirSync(CARDS_DIR).filter((x) => x.endsWith(".json")).sort()) {
  const data = JSON.parse(fs.readFileSync(path.join(CARDS_DIR, f), "utf8"));
  if (data.bloque === "ejecutivo") continue; // fuera del pool de juego (F3)
  for (const c of data.cartas) {
    for (const o of c.opciones) {
      const enPantalla = o.linea || humanizar(o.raw, c.id, o.id);
      auditadas++;
      if (o.linea) conLinea++;
      for (const re of ORDENAN) {
        if (re.test(enPantalla)) {
          fallas++;
          console.error(`  ✗ ${c.id}.${o.id}: "${enPantalla}" ← adjetivo que ordena las opciones`);
        }
      }
      if (o.apuesta) { apuestas++; continue; } // §1: la apuesta conserva sus %
      for (const [re, qué] of SPOILERS) {
        if (re.test(enPantalla)) {
          fallas++;
          console.error(`  ✗ ${c.id}.${o.id}: "${enPantalla}" ← ${qué}`);
          break;
        }
      }
    }
  }
}

console.log("=== REGLA DE INFORMACIÓN (SPEC v4 §1) ===");
console.log(`${auditadas} opciones auditadas · ${conLinea} con línea reescrita · ${apuestas} de apuesta (conservan sus %)`);
if (fallas) {
  console.error(`\n✗ ${fallas} opción(es) spoilean el resultado. Se muestra lo que pagás, no lo que ganás.`);
  process.exit(1);
}
console.log("✓ Ninguna opción anuncia lo que vas a ganar. La decisión es una decisión.");
