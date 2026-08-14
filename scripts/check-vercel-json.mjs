/* Traba de CI: vercel.json contra el esquema de Vercel.
 *
 * Vercel valida este archivo ANTES de compilar y rechaza cualquier propiedad
 * que no conozca. El deploy falla con un error que no se parece a un error de
 * build —el proyecto compila local sin drama— así que la rotura es silenciosa:
 * producción se queda clavada en el commit anterior y nada avisa.
 *
 * Pasó de verdad (ago-2026): una clave "comment" por regla, puesta para
 * documentar el porqué de cada header, dejó producción 14h atrás mientras
 * cada push nuevo fallaba. El razonamiento vive en el README; acá vive la traba.
 */
import { readFileSync } from "node:fs";

const RUTA = new URL("../vercel.json", import.meta.url);

/* Solo lo que este proyecto usa. Si algún día hace falta redirects/rewrites/
   crons, se agregan acá a propósito y con la forma verificada, no de prepo. */
const RAIZ = new Set(["$schema", "headers"]);
const REGLA = new Set(["source", "headers", "has", "missing"]);
const HEADER = new Set(["key", "value"]);

const errores = [];
const revisar = (obj, permitidas, donde) => {
  for (const k of Object.keys(obj)) {
    if (!permitidas.has(k)) {
      errores.push(
        `${donde}: propiedad "${k}" fuera del esquema de Vercel. ` +
          `El deploy va a fallar antes de compilar. Permitidas: ${[...permitidas].join(", ")}.`,
      );
    }
  }
};

let cfg;
try {
  cfg = JSON.parse(readFileSync(RUTA, "utf8"));
} catch (e) {
  console.error("=== VERCEL.JSON ===");
  console.error(`✗ No es JSON válido: ${e.message}`);
  process.exit(1);
}

revisar(cfg, RAIZ, "raíz");

for (const [i, regla] of (cfg.headers ?? []).entries()) {
  const donde = `headers[${i}]`;
  revisar(regla, REGLA, donde);
  if (typeof regla.source !== "string" || !regla.source.startsWith("/")) {
    errores.push(`${donde}: "source" tiene que ser una ruta que arranque con "/".`);
  }
  /* Sin regex a propósito: una ruta literal no se puede interpretar mal.
     Los patrones de path-to-regexp de Vercel no se pueden probar desde acá. */
  if (typeof regla.source === "string" && /[()*?+[\]{}|]/.test(regla.source)) {
    errores.push(
      `${donde}: "source" (${regla.source}) usa patrones. Este repo los evita: ` +
        `no se pueden verificar sin desplegar. Usá rutas literales.`,
    );
  }
  for (const [j, h] of (regla.headers ?? []).entries()) {
    revisar(h, HEADER, `${donde}.headers[${j}]`);
  }
}

console.log("=== VERCEL.JSON ===");
if (errores.length) {
  for (const e of errores) console.error(`✗ ${e}`);
  console.error(
    "\nCorregí vercel.json. El razonamiento de cada regla va en el README, no en el JSON.",
  );
  process.exit(1);
}
const n = (cfg.headers ?? []).length;
console.log(`✓ vercel.json OK: ${n} regla${n === 1 ? "" : "s"} de headers, rutas literales, sin claves fuera del esquema.`);
