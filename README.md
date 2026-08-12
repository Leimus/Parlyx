# Tu Carrera Emprendedora · por Parlyx AI

Minijuego web viral estilo Copero/Remar: simulás una carrera de founder **1993 → 2026**,
11 decisiones trienales, tarjeta final compartible para Twitter/X. Castellano rioplatense.
Marketing de [Parlyx AI](https://parlyx.ai).

**Fuente de verdad del producto:** [`docs/PRD-v1.0-pivote-ecommerce.md`](docs/PRD-v1.0-pivote-ecommerce.md)
(definitiva de concepto) sobre [`docs/PRD-v0.2.md`](docs/PRD-v0.2.md) (base) +
[`docs/PRD-v0.3-lead-magnet.md`](docs/PRD-v0.3-lead-magnet.md) + anexos.

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

- ✅ Motor como módulo puro (validado contra el original) + sim/golden/invariante en CI.
- ✅ Deck 111 cartas con schema Zod (102 base + capa e-commerce en lenguaje humano).
- ✅ Juego completo: setup 2 pantallas, 11 turnos, emergencias, Parlyx desbloqueado
  (regla de oro 60-70% verificada), sin finales tempranos, tarjeta compartible con
  seed-desafío (`/?s=SEED`), vitrina, arquetipos y UI v2 "Densidad Copero".
- ✅ FIX-PACK "el techo es una pendiente": talentFactor, rachas, amortiguador Parlyx
  con contrafactual (detalle en `docs/FIX-PACK-techo-pendiente-parlyx.md`).
- ✅ **Listo para producción:** analytics Plausible (9 eventos del PRD §2, sin cookies),
  og:image estática + meta tags completos, favicon/app icons, 404 propia, robots.txt,
  Lighthouse mobile ≥90 (transferencia ~283KB gzip).
- ⚠️ Pendiente F3: modo ejecutivo completo (D6) y recalibración de `BAL` contra §17.
- 🔲 v1.1 "El juego que vende" (Seed del Día, informes, tienda) y F4 (og:image dinámica).

## Deploy (Vercel) → carrera.parlyx.ai

Proyecto listo para Vercel sin configuración extra (`output: export` — 100% estático):

1. **Importar:** [vercel.com/new](https://vercel.com/new) → `Leimus/Parlyx`. Framework
   preset **Next.js** (auto-detectado), build `npm run build`, salida `out/`. Deploy.
   Cada push a `main` redeploya; los PRs generan previews.
2. **Dominio:** en el proyecto → Settings → Domains → agregar `carrera.parlyx.ai`.
   En el DNS de `parlyx.ai`, crear el registro:

   ```
   Tipo    Nombre     Valor
   CNAME   carrera    cname.vercel-dns.com
   ```

   Vercel emite el certificado TLS solo una vez que el CNAME propaga (minutos, hasta
   ~1h según el TTL del DNS).

**Post-deploy (una vez):**

- **Analytics:** dar de alta el sitio `carrera.parlyx.ai` en [plausible.io](https://plausible.io)
  (el script ya está integrado en `app/layout.tsx`, sin cookies). Eventos custom del
  PRD §2 que van a aparecer solos: `game_start`, `setup_complete`, `turn_decision`
  (carta + opción), `game_end` (final + arquetipo), `share_open`, `share_complete`,
  `seed_replay`, `parlyx_activado`, `outbound_parlyx`. Conviene marcarlos como *goals*
  en Plausible para verlos en el dashboard.
- **Verificar la og:image:** pasar `https://carrera.parlyx.ai` por el
  [validador de cards de Twitter/X](https://cards-dev.twitter.com/validator) o
  compartir la URL en un chat: tiene que aparecer la imagen "El 27% quiebra…"
  (`public/og.png`, 1200×630). La og:image **dinámica por partida** queda para v1.1.
