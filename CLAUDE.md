# Tu Carrera Emprendedora · por Parlyx AI — Guía para agentes

## Qué es este proyecto

Minijuego web viral estilo Copero/Remar: simulás una carrera de founder 1993→2026,
11 decisiones trienales, tarjeta final compartible para Twitter/X. Castellano rioplatense
(voseo). Marketing de Parlyx AI — y desde v0.3, **lead magnet jugable** (doble embudo).

**Fuente de verdad del producto:** **`docs/PRD-v1.0-pivote-ecommerce.md` (DEFINITIVA de
concepto — manda sobre v0.3/anexos donde contradiga)** + `docs/PRD-v0.2.md` (base) +
`docs/PRD-v0.3-lead-magnet.md` + `docs/anexo-psicologia-adiccion-v0.4.md`.
Pivote v1.0: ya no sos un founder de startup — **fundás una MARCA de comercio y la llevás
33 años por la historia del e-commerce**. Un solo protagonista (6 rubros como sabor),
lenguaje humano en pantalla (cero notación de motor), Parlyx desbloqueado como beat
estructural en 2020 (regla de oro: óptimo en 60-70% de contextos, verificado en sim),
y NINGUNA carrera termina antes de 2026 (la quiebra es un capítulo, no un corte).
Principio rector v0.3 §0 sigue: el juego primero.

## Mapa del repo

| Ruta | Qué es | Autoridad |
|---|---|---|
| `docs/PRD-v0.2.md` | PRD completo y vigente | **Fuente de verdad del producto** |
| `docs/deck-lote-1.md` + `docs/deck-lote-2.md` | Las 102 cartas con efectos y probabilidades | Fuente de verdad del contenido |
| `data/cards/*.json` | El deck en JSON, 111 cartas (schema `lib/cards/schema.mjs`) — la capa e-commerce (`05-ecommerce.json`, 25 cartas EC en lenguaje humano) reemplazó a los verticales tech | Forma ejecutable del contenido |
| `lib/game/humano.js` | Traducción de notación de motor → palabras (deck viejo) + `scripts/check-lenguaje.mjs` en CI | Regla §5 del PRD v1.0 |
| `docs/conversion-cartas.md` | Convenciones .md → JSON (incl. errata F-04→P-04) | Contrato de la conversión |
| `lib/engine/` | Motor económico puro, módulo importable | Fuente de verdad de la economía |
| `data/balance.json` | `BAL` — el ÚNICO lugar de tuneo económico | — |
| `data/eras.json` | Eras/múltiplos por año (generada de la eraFor original) | — |
| `docs/UI-SPEC-v2-densidad-copero.md` | Spec de UI vigente (tabla siempre visible, píldora OVR, Framer Motion) | **Manda sobre cualquier spec de UI anterior** (incl. anexo §10) |
| `data/arcos.json` | Arcos narrativos (sesgos de momentum por fase, PRD v0.3 §5) | Tuneo de arcos acá |
| `data/tags-ejes.json` | Tags de eje por opción → arquetipos (PRD v0.3 §2) | Tuneo del perfil acá |
| `reference/engine-v1.original.js` | El motor original INTACTO (validado 20.000 sims) | Referencia para diff |
| `reference/prototipo-ui-v0.2.jsx` | Prototipo React jugable | Solo referencia visual/UX |
| `scripts/sim.mjs` | Simulador headless + golden check de CI | QA de balanceo |
| `scripts/smoke-game.mjs` | Auto-juega N partidas · `--arcos` = distribución por arco | QA del core loop |
| `tests/golden-sim.json` | Distribución exacta esperada (N=10000) | Traba de la regla dura #1 |

**Nota motor:** `simulateTrienio` acepta `decisionesFx.momentumBias` (sesgo de arco,
aditivo y opcional). Con 0 u omitido la matemática es EXACTAMENTE la original — el
golden lo verifica. Los arcos se tunean en `data/arcos.json`, jamás en el motor.

## Reglas duras (no negociables)

1. **No cambies la lógica económica sin correr la simulación.**
   `lib/engine/` es un refactor 1:1 del original con salida verificada idéntica
   (diff byte a byte, 20.000 partidas). CI corre `node scripts/sim.mjs 10000 --check`:
   cualquier cambio de distribución rompe el build. Tuneo SOLO en `data/balance.json`.
   Recalibración intencional (F3): correr `npm run sim -- 10000 --strict-targets`,
   verificar targets del PRD §17, regenerar golden con `npm run sim:golden` y
   commitear todo junto.
2. **Cero marcas reales** (empresas, fondos, personas): solo perífrasis/arquetipos
   (PRD §15). `validate-cards.mjs` advierte sobre una lista de marcas sensibles.
3. **Voseo rioplatense** en todo el copy del juego.
4. **Sin backend de gameplay:** SPA estática (`output: export`), seed determinística
   en la URL. Única pieza server: og:image dinámica (edge function, F4).
5. **Mobile-first 390px**, dark theme, estética "startupera bursátil" (PRD §14).

## Comandos

```bash
npm test               # validación del deck + sim con golden check (lo que corre CI)
npm run sim -- 20000   # simulador a N partidas
npm run validate:cards # deck solo
npm run build          # build estático (out/)
```

## Convenciones de contenido

- Cambios de cartas: editar el `.md` Y el JSON correspondiente (el JSON preserva el
  texto exacto del efecto en `raw` — mantener sincronizado). Validar con
  `npm run validate:cards`.
- El schema Zod es estricto (campos extra = error). Convenciones completas de
  conversión en `docs/conversion-cartas.md`.
- `efectos` = solo lo incondicional e inmediato; lo condicional en prosa vive en
  `raw`/`notas` hasta que el motor lo mecanice.

## Estado y próximos pasos (orden del plan)

1. ✅ Scaffold + motor como módulo puro (salida idéntica verificada) + sim como test CI.
2. ✅ Deck 102 cartas → JSON con Zod.
3. ✅ F2: core loop jugable (`lib/game/` + `app/Game.tsx`): setup ×4, 11 turnos con el
   deck real, economía por trienio = `simulateTrienio()` del motor INTACTO,
   emergencias E-01→E-05, exits, comeback, modo playa, seed compartible.
4. ✅ **v1 del PRD v0.3/anexo v0.4** (11 ítems del pedido del owner):
   arquetipos (tags en `data/tags-ejes.json` + mote) · arcos (`data/arcos.json`,
   momentumBias) · vitrina SVG con siluetas + colección de arquetipos (localStorage) ·
   ceremonia final 3 beats (cascada → copas → sello del mote; la tabla protagonista) ·
   críticos dorados (5% apuestas ganadas, ×2) · línea del casi · turno 1 "El Origen" +
   financiamiento gateado (turno ≥3 y etapa ≥Seed) · landing "El 27% quiebra…" +
   "Fundar mi empresa" · "Otra carrera" 1-tap (setup recordado) · share 1ª persona
   con seed-desafío. **UI v2 "Densidad Copero"** (reemplazó los chips del anexo §10):
   tabla de 12 filas SIEMPRE visible (30px/fila, chip de año por etapa), píldora OVR
   spec exacta (número oscuro sobre fondo saturado, glow solo violeta), Framer Motion
   (springs, odómetro, cascada, carta como bottom-sheet, tensión 500-700ms),
   export Feed 4:5 / Story 9:16. Presupuesto ≤550KB: bundle 484KB.
   Verificación de arcos: 120k partidas (`smoke-game 120000 --arcos`) — épico 33%
   Promesa vs 12% Desierto, quiebra estable 13-17%, agregado sano. BAL intacto.
   **Pendiente de v1 (decisión consciente):** arco "Pase a la Corpo" (necesita modo
   ejecutivo → su 15% está sumado a "ninguno" en arcos.json) · sesgo de SORTEO de
   cartas por arco (solo momentum por ahora) · rebalanceo 40% cartas de pérdida
   (anexo §1.5 — es tag de contenido, va con revisión de Leimus) · formatos de carta
   Duelo/Apuesta (§7 v0.3; el pedido del owner no los listó) · audio de críticos.
5. ✅ **Pivote e-commerce (PRD v1.0)**: capa EC de 25 cartas (2 beats anclados: EC-24
   "Quinientos mensajes en una hora" en 2020 → PARLYX DESBLOQUEADO con momento visual,
   y EC-25 "El tiempo que recuperaste" en 2023 si lo activaste) · macros adaptadas al
   comercio · lenguaje humano integral (humano.js + check-lenguaje en CI, 950 textos,
   0 fugas) · setup 2 pantallas con preview vivo (bolsa SVG), 12 isotipos y 6 rubros ·
   motor: `g.prodMul` opcional (Parlyx ×1.35) + margen ecom 0.30→0.45 (golden
   regenerado) · regla "sin finales tempranos": quiebra → carta DD-01 "El día después"
   (corpo/refundar/austero), la tabla SIEMPRE llega a 2026 · bloque IMPACTO en tarjeta
   o casi "conversaciones sin responder" · bugs: sello $??? (no se muestra con Enigma) y
   El Enigma 16%→1.1% (<3% target, umbral 4 + desempate). **Verificado en sim:** regla
   de oro Parlyx 68.4% ∈ [60-70] · smoke 111 cartas sin crashes. **Pendiente consciente:**
   renombrar arquetipos que suenen a VC (§9, "revisar con owner") · HQ fijo en BA (el
   setup de 2 pantallas no lo elige; cartas H-* siguen vivas).
6. 🔲 **v1.1 "El juego que vende"** (NO empezar sin OK): Seed del Día + share Wordle +
   racha · email/informe por arquetipo · tienda/powerups (4 items) · HubSpot.
7. 🔲 F3 motor: modo ejecutivo D6 completo (el corpo de DD-01 es la versión light),
   condiciones en prosa, retiro standalone, recalibrar `BAL` contra §17.
8. 🔲 F4: og:image dinámica + arte final de tarjeta.

## Contexto de negocio

Owner: Leimus (Manuel Lamedica), cofounder de Parlyx AI. El branding es solo
"por Parlyx AI" en título, footer y tarjeta — la marca nunca interrumpe el juego.
KPI norte: % de tarjetas compartidas y K-factor (PRD §2).
El PDF `Brief_Arquitectura_Producto_2026.pdf` en la raíz es de OTRO producto
(Parlyx Core, agentes IA para ecommerce) — no es contexto de este juego.
