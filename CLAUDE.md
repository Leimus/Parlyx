# Tu Carrera Emprendedora · por Parlyx AI — Guía para agentes

## Qué es este proyecto

Minijuego web viral estilo Copero/Remar: simulás una carrera de founder 1993→2026,
11 decisiones trienales, tarjeta final compartible para Twitter/X. Castellano rioplatense
(voseo). Marketing de Parlyx AI. **Fuente de verdad del producto: `docs/PRD-v0.2.md`**
(decisiones D1-D6 cerradas).

## Mapa del repo

| Ruta | Qué es | Autoridad |
|---|---|---|
| `docs/PRD-v0.2.md` | PRD completo y vigente | **Fuente de verdad del producto** |
| `docs/deck-lote-1.md` + `docs/deck-lote-2.md` | Las 102 cartas con efectos y probabilidades | Fuente de verdad del contenido |
| `data/cards/*.json` | El deck en JSON (schema `lib/cards/schema.mjs`) | Forma ejecutable del contenido |
| `docs/conversion-cartas.md` | Convenciones .md → JSON (incl. errata F-04→P-04) | Contrato de la conversión |
| `lib/engine/` | Motor económico puro, módulo importable | Fuente de verdad de la economía |
| `data/balance.json` | `BAL` — el ÚNICO lugar de tuneo económico | — |
| `data/eras.json` | Eras/múltiplos por año (generada de la eraFor original) | — |
| `reference/engine-v1.original.js` | El motor original INTACTO (validado 20.000 sims) | Referencia para diff |
| `reference/prototipo-ui-v0.2.jsx` | Prototipo React jugable | Solo referencia visual/UX |
| `scripts/sim.mjs` | Simulador headless + golden check de CI | QA de balanceo |
| `tests/golden-sim.json` | Distribución exacta esperada (N=10000) | Traba de la regla dura #1 |

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
3. 🔲 Integrar el deck real al motor (hoy la sim usa `politicaFx`, una política proxy)
   → recalibrar `BAL` contra targets PRD §17 → activar `--strict-targets` en CI.
4. 🔲 F2: core loop + pantallas (referencia: `reference/prototipo-ui-v0.2.jsx`,
   dirección de arte PRD §14).
5. 🔲 F4: og:image dinámica + tarjeta compartible (PRD §13 — LA feature).

## Contexto de negocio

Owner: Leimus (Manuel Lamedica), cofounder de Parlyx AI. El branding es solo
"por Parlyx AI" en título, footer y tarjeta — la marca nunca interrumpe el juego.
KPI norte: % de tarjetas compartidas y K-factor (PRD §2).
El PDF `Brief_Arquitectura_Producto_2026.pdf` en la raíz es de OTRO producto
(Parlyx Core, agentes IA para ecommerce) — no es contexto de este juego.
