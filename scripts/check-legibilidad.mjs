#!/usr/bin/env node
/* ============================================================
   AUDITORÍA DE LEGIBILIDAD (SPEC v3 §1) — corre en CI.
   Dos trabas, las dos automáticas (la spec exige herramienta,
   no ojo):
     1. Ningún font-size por debajo de MIN_PX en toda la app
        (globals.css + estilos inline de los .tsx).
     2. Todo par texto/fondo declarado cumple su ratio WCAG
        (≥4.5:1 general · ≥7:1 en texto secundario).
   ============================================================ */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const MIN_PX = 13;

/* ---------- contraste WCAG 2.1 ---------- */
const canal = (h) => {
  h = h.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
};
const lineal = (c) => (c /= 255) <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
const lum = (h) => { const [r, g, b] = canal(h); return 0.2126 * lineal(r) + 0.7152 * lineal(g) + 0.0722 * lineal(b); };
export const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

/* ---------- tokens de :root ---------- */
const css = readFileSync(join(ROOT, "app/globals.css"), "utf8");
const tokens = {};
for (const m of css.matchAll(/--([a-z0-9-]+):\s*(#[0-9a-fA-F]{3,8})\s*;/g)) tokens[m[1]] = m[2].toLowerCase();
const T = (n) => {
  const v = tokens[n];
  if (!v) { console.error(`✗ token --${n} no encontrado en :root`); process.exit(1); }
  return v;
};

/* Pares reales de texto sobre superficie. Cada entrada es lo que
   un ojo ve en pantalla, no una combinación teórica. */
const PARES = [
  ["ink", "bg", 4.5, "texto principal sobre fondo"],
  ["ink", "panel", 4.5, "texto principal sobre panel"],
  ["ink", "panel2", 4.5, "texto principal sobre panel2"],
  ["dim", "bg", 7, "texto secundario sobre fondo"],
  ["dim", "panel", 7, "texto secundario sobre panel"],
  ["dim", "panel2", 7, "texto secundario sobre panel2"],
  ["up", "bg", 4.5, "verde mercado sobre fondo"],
  ["up", "panel", 4.5, "verde mercado sobre panel"],
  ["down", "bg", 4.5, "rojo mercado sobre fondo"],
  ["down", "panel", 4.5, "rojo mercado sobre panel"],
  ["gold", "bg", 4.5, "dorado sobre fondo"],
  ["viol", "bg", 4.5, "violeta sobre fondo"],
  ["viol", "panel", 4.5, "violeta sobre panel"],
];

/* Las píldoras de OVR son número oscuro sobre fondo saturado:
   se auditan los DOS extremos de cada gradiente. */
const PILL_INK = "#101014";
const PILDORAS = [
  ["bronce", "pill-bronce-a", "pill-bronce-b"],
  ["plata", "pill-plata-a", "pill-plata-b"],
  ["dorado", "pill-dorado-a", "pill-dorado-b"],
  ["violeta", "pill-viol-a", "pill-viol-b"],
];

let fallas = 0;
console.log("=== CONTRASTE (SPEC v3 §1) ===");
for (const [fg, bgN, min, desc] of PARES) {
  const r = ratio(T(fg), T(bgN));
  const ok = r >= min;
  if (!ok) fallas++;
  console.log(`${ok ? "✓" : "✗"} ${r.toFixed(2).padStart(6)}:1  (min ${min})  ${desc}`);
}
for (const [nombre, a, b] of PILDORAS) {
  const [ra, rb] = [ratio(PILL_INK, T(a)), ratio(PILL_INK, T(b))];
  const ok = ra >= 4.5 && rb >= 4.5;
  if (!ok) fallas++;
  console.log(`${ok ? "✓" : "✗"} ${Math.min(ra, rb).toFixed(2).padStart(6)}:1  (min 4.5)  píldora ${nombre} (peor extremo del gradiente)`);
}

/* ---------- tamaños de fuente ---------- */
console.log(`\n=== TIPOGRAFÍA (mínimo absoluto ${MIN_PX}px) ===`);
const FUENTES = ["app/globals.css", "app/Game.tsx", "app/not-found.tsx"];
const chicas = [];
for (const rel of FUENTES) {
  const txt = readFileSync(join(ROOT, rel), "utf8");
  const lineas = txt.split("\n");
  lineas.forEach((linea, i) => {
    // CSS: font-size: 12px  ·  JSX: fontSize: 12  |  fontSize: "12px"
    for (const m of linea.matchAll(/font-size:\s*([\d.]+)px/g)) chicas.push([rel, i + 1, +m[1], linea.trim()]);
    for (const m of linea.matchAll(/fontSize:\s*"?([\d.]+)(?:px)?"?/g)) chicas.push([rel, i + 1, +m[1], linea.trim()]);
    // el atributo SVG fontSize={11} también es texto en pantalla
    for (const m of linea.matchAll(/fontSize=\{?"?([\d.]+)"?\}?/g)) chicas.push([rel, i + 1, +m[1], linea.trim()]);
  });
}
const bajo = chicas.filter(([, , px]) => px < MIN_PX);
const vistos = new Set();
for (const [rel, ln, px, linea] of bajo) {
  const k = `${rel}:${ln}:${px}`;
  if (vistos.has(k)) continue;
  vistos.add(k);
  fallas++;
  console.log(`✗ ${px}px  ${rel}:${ln}  ${linea.slice(0, 90)}`);
}
console.log(
  `${bajo.length ? "✗" : "✓"} ${chicas.length} declaraciones de tamaño auditadas · ` +
  `${vistos.size} por debajo de ${MIN_PX}px · mínimo hallado ${Math.min(...chicas.map((c) => c[2]))}px`
);

if (fallas) {
  console.error(`\n✗ LEGIBILIDAD: ${fallas} falla(s). La spec v3 §1 no se negocia.`);
  process.exit(1);
}
console.log("\n✓ Legibilidad OK: contraste y tipografía dentro de la spec v3 §1.");
