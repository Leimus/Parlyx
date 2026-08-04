# Tu Carrera Emprendedora · por Parlyx AI

Minijuego web viral estilo Copero/Remar: simulás una carrera de founder **1993 → 2026**,
11 decisiones trienales, tarjeta final compartible para Twitter/X. Castellano rioplatense.
Marketing de [Parlyx AI](https://parlyx.ai).

**Fuente de verdad del producto:** [`docs/PRD-v0.2.md`](docs/PRD-v0.2.md) (decisiones D1-D6 cerradas).

## Estructura

```
app/                  → Next.js (output: export) — SPA estática, sin backend de gameplay
lib/engine/           → motor económico puro (refactor 1:1 de engine-v1, misma lógica)
lib/cards/schema.mjs  → schema Zod del deck
data/cards/*.json     → las 102 cartas (convertidas de docs/deck-lote-*.md)
data/eras.json        → tabla de eras/múltiplos por año 1993-2026
data/balance.json     → BAL: el ÚNICO lugar de tuneo económico
scripts/sim.mjs       → simulador headless + test de CI (golden + targets §17)
scripts/validate-cards.mjs → validación Zod + integridad del deck
tests/golden-sim.json → snapshot exacto de la distribución (N=10000)
docs/                 → PRD, deck en .md, convenciones de conversión
reference/            → engine-v1 original intacto + prototipo UI (solo referencia)
```

## Comandos

```bash
npm run dev            # dev server
npm run build          # build estático → out/
npm test               # validación del deck + sim con golden check
npm run sim            # simulador: node scripts/sim.mjs [N] [--check|--strict-targets]
npm run sim:golden     # regenerar el golden (SOLO tras una recalibración intencional)
npm run validate:cards # validar el deck solo
```

## Reglas duras (no negociables)

1. **No cambiar la lógica económica** (`lib/engine/`, `data/balance.json`, `data/eras.json`)
   **sin correr la simulación**: `npm run sim -- 10000 --check`. El golden de
   `tests/golden-sim.json` rompe CI ante cualquier cambio de distribución. Si el cambio es
   una recalibración intencional: tunear SOLO `data/balance.json`, verificar targets del
   PRD §17 y commitear el nuevo golden junto con el cambio.
2. **Cero marcas reales** — arquetipos con perífrasis (PRD §15).
3. **Voseo rioplatense** en todo el copy del juego.
4. **Sin backend de gameplay** — seed determinística en la URL; única pieza server: og:image (F4).
5. **Mobile-first 390px**, dark theme, estética "startupera bursátil" (PRD §14).

## Estado (2026-08)

- ✅ Motor v1 como módulo puro — salida verificada **idéntica** al `engine-v1.js` validado
  (diff byte a byte sobre 20.000 partidas).
- ✅ Deck completo: 102 cartas en JSON con schema Zod (fuente: `docs/deck-lote-*.md`).
- ✅ Simulador como test de CI (golden check).
- ✅ **F2: juego jugable** — setup, 11 turnos con el deck real, apuestas, emergencias,
  exits/comeback/playa y tarjeta final con seed compartible (`/?s=SEED`). La economía
  de cada trienio es el `simulateTrienio()` del motor, sin tocar. Smoke de CI:
  `npm run smoke` auto-juega 300 partidas.
- ⚠️ Pendiente F3: modo ejecutivo (D6), condiciones en prosa del deck, y recalibración
  de `BAL` contra targets §17 (la sim de CI usa la política proxy; al recalibrar,
  activar `--strict-targets`).
- 🔲 F4: og:image dinámica (edge function) + arte final de tarjeta.

## Deploy (Vercel)

Proyecto listo para Vercel sin configuración extra:

1. [vercel.com/new](https://vercel.com/new) → importar `Leimus/Parlyx`.
2. Framework preset: **Next.js** (auto-detectado; `output: export` genera `out/`).
3. Deploy. Cada push a `main` redeploya; los PRs generan previews.

Dominio corto (D7, abierta): candidatos `tucarrera.app` / `carrera.parlyx.ai`.
