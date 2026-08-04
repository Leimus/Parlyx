# Convenciones de conversión: deck-lote-*.md → data/cards/*.json

Los `.md` (`docs/deck-lote-1.md`, `docs/deck-lote-2.md`) son la **fuente de verdad del contenido**.
Los JSON de `data/cards/` son su forma ejecutable, validada por `lib/cards/schema.mjs` (Zod).
Principio rector: **cero pérdida de información** — todo lo que no se puede estructurar se
preserva en `raw` (texto exacto del efecto) y `notas`.

## Archivos

| Archivo | Bloque del .md | IDs | Cartas |
|---|---|---|---|
| `01-macro.json` | Lote 1 · Bloque 1 | M-01…M-15 | 15 |
| `02-ejecutivo.json` | Lote 1 · Bloque 2 | EJ-01…EJ-12 | 12 |
| `03-generales.json` | Lote 1 · Bloque 3 | G-01…G-20 | 20 |
| `04-emergencia.json` | Lote 2 · Bloque 4 | E-01…E-05 | 5 |
| `05-vertical.json` | Lote 2 · Bloque 5 | V-01…V-16 | 16 |
| `06-hq.json` | Lote 2 · Bloque 6 | H-01…H-08 | 8 |
| `07-equipo.json` | Lote 2 · Bloque 7 | T-01…T-08 | 8 |
| `08-financiamiento.json` | Lote 2 · Bloque 8 | F-01…F-05 | 5 |
| `09-playa.json` | Lote 2 · Bloque 9 | P-01…P-08 | 8 |
| `10-color.json` | Lote 2 · Bloque 10 | C-01…C-05 | 5 |

**Errata corregida en la conversión:** en el .md, la cuarta carta del Bloque 9 (playa) está
numerada "F-04 · El fondo de tu amigo", colisionando con "F-04 · La due diligence" del
Bloque 8. Es un typo evidente (está entre P-03 y P-05): en JSON es **P-04**.

## Mapeos de IDs

- **Verticales:** SaaS→`saas` · Fintech→`fintech` · E-commerce/enabler→`ecom` ·
  Marketplace→`marketplace` · AI/ML→`ai` · Gaming→`gaming` · **consumer→`gaming`**
  (el PRD define la vertical como "Gaming / consumer") · Deep tech/hardware→`deeptech` ·
  Crypto/web3→`crypto`.
- **HQ:** Buenos Aires→`ba` · CDMX→`cdmx` · São Paulo→`sp` · Bogotá→`bog` ·
  Santiago→`scl` · Miami→`mia`. "Cualquiera de LATAM" → `[ba, cdmx, sp, bog, scl]`.
- **Etapas** (por valuación, como `etapaIdx()` del motor): 0 Garage · 1 Seed · 2 Serie A ·
  3 Serie B · 4 Serie C · 5 Gigante. "Serie A+" → `etapaMin: 2` · "Serie B+" → `etapaMin: 3` ·
  "seed en adelante" → `etapaMin: 1` · "garage/seed" → `etapaMax: 1` · "seed/A" →
  `etapaMin: 1, etapaMax: 2` · "arranque (turno 1-2)" → `turnoMax: 2` · "cualquier etapa" → nada.
- **Modos:** bloque ejecutivo → `["ejecutivo"]`, salvo las cartas de entrada que se juegan
  siendo founder (EJ-01, EJ-02, EJ-03 → `["founder"]` + `trigger`). Bloque playa →
  `["playa"]` (P-03 dice "playa o ejecutivo" → ambos). Resto → `["founder"]`.

## Efectos: notación → campos

| Notación .md | Campo JSON |
|---|---|
| `OVR ±N` | `efectos.ovr` |
| `TEND ±N` | `efectos.tend` |
| `TEND +N pero recién en 2 trienios` | `efectos.tendLenta` + nota |
| `RW ±Nm` | `efectos.rw` |
| `EQ -N%` (cedés) / `EQ +N%` (recuperás) | `efectos.eq` (±N) |
| `ARR +30%` / `ARR -40%` | `efectos.arrMul` (1.3 / 0.6) |
| `PAT +500K` | `efectos.pat` (500000) |
| `PAT ×2` | `efectos.patMul` (2) |
| `PAT -30%` | `efectos.patPct` (-0.3) |
| `valuación ×2 este trienio` | `efectos.valMul` (2) |
| `múltiplo -20% este trienio` | `efectos.multMul` (0.8) |
| `Cargo -1` (subís en el organigrama) | `efectos.cargo` (-1) |
| `techo de OVR -5` | `efectos.techoDelta` (-5) |
| `⚑ nombre` | `efectos.flags: ["nombre"]` (nombre exacto del .md, minúsculas, espacios→`_`) |
| `quita ⚑ x` | `efectos.quitaFlags` |
| `↳` `↓` `✝` `🔁` | `efectos.marker` |
| logro/hito emoji | `efectos.hito` |
| `X%: bueno / Y%: malo` | `apuesta: { p: 0.X, gana: {...}, pierde: {...} }` |
| `va a E-02` | `goto: "E-02"` |
| "solo aparece si OVR ≥ 75" | `condicion` (a nivel opción) |

Reglas finas:

1. **Efectos previos a una apuesta** ("RW -8m · 55%: …") → el costo fijo va en `efectos`,
   la apuesta en `apuesta`. Los efectos de cada rama van en `gana.efectos`/`pierde.efectos`.
2. **Efectos condicionales en prosa** ("TEND +1 si sobrevivís el trienio", "si ⚑
   valuación_inflada: EQ -22%", "OVR -1 por trienio que sigas") **no** van en `efectos`:
   quedan solo en `raw`/`notas`. `efectos` es únicamente lo incondicional e inmediato.
3. **Efectos narrativos no mecanizados** (entrar a modo ejecutivo, comeback, vender la
   empresa, IPO, re-sortear techo, "PAT -todo", cambiar de HQ, salir del modo, spin-off)
   → `efectos.special` con un nombre corto en camelCase (`entraEjecutivo`, `comeback`,
   `sellNow`, `sellPeak`, `ipo`, `retechear`, `patTodo`, `cambiaHQ`, `saleEjecutivo`,
   `spinOff`, `finalExit`, …) + detalle en `notas`. El texto exacto siempre está en `raw`.
4. **`raw` es sagrado:** copia literal del texto de efectos del .md (lo que sigue a la
   flecha →), sin la letra de la opción ni el label.
5. **Tipos:** "T9 reactiva" → `tipo: "T9"` + `reactiva: true`. "T4 forzada"/"T7 forzada" →
   `tipo` + `forzada: true` (todo el bloque emergencia es forzado).
6. **TE PASÓ:** "todos" → `{todos: true}` · vertical/HQ → `{verticales|hqs: [...]}` ·
   matices ("bendición para AI, amenaza para el resto") → `nota`.
7. **Elegibilidad no mecanizable** ("eras ⛈/🌧", "ARR estancado", "valuación ≥ 800M",
   "2+ trienios en el mismo cargo", "año bueno") → `elegibilidad.condicion` o
   `elegibilidad.trigger` como texto.
8. Las **notas de diseño en cursiva** del .md (V-16, H-06, F-04, F-05…) → `notas` de la carta.

## Flags canónicos del deck (15)

`sobrecapitalizado` · `presión_growth` · `valuación_inflada` · `dependencia` · `deuda` ·
`deuda_técnica` · `aliado_gigante` · `favor_debido` · `enemigo_arriba` · `dolarizado` ·
`manchado_crypto` · `manchado_redes` · `reputación_intacta` · `blindado_regulatorio` ·
`balde_agujereado` · `margen_negativo` · `canal_propio` · `tren_de_vida` · `red_de_founders` ·
`inflación_salarial` · `oportunidad_familiar` · `earnout` · `dead_equity`

(la lista efectiva la produce el deck; usar siempre el nombre textual del .md)

## Validación

```bash
npm run validate:cards                      # todo el deck + chequeos globales
node scripts/validate-cards.mjs --file data/cards/01-macro.json   # un archivo
```
