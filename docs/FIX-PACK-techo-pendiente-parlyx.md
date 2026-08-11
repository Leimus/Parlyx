# FIX-PACK — "El techo es una pendiente" + lógica Parlyx
**10-ago-2026 · Correcciones de lógica de juego tras playtest del owner. Tres problemas: (1) los picos de OVR están aplastados en ~70-75 para todos, (2) las carreras se sienten lineales, (3) Parlyx activo coincidió con caída de ventas sin explicación — inaceptable para la marca. Más un bug visual persistente.**

---

## 1. EL TECHO ES UNA PENDIENTE (bug matemático confirmado)

**Diagnóstico:** la curva `dev` suma ~+19 OVR en la carrera para TODOS los jugadores. Aunque el techo sorteado sea 99, el pico esperado queda en 70-75: los techos altos existen pero son inalcanzables. Por eso todas las partidas del owner terminaron en 66-77.

**Fix (en el motor, `BAL`):**
```
talentFactor = 0.7 + (techo - 68) / 40
// techo 68 → ×0.70 · techo 77 → ×0.93 · techo 85 → ×1.13 · techo 92 → ×1.30 · techo 99 → ×1.48
devEfectivo[t] = round(dev[t] × talentFactor)
```
El talento no solo llega más alto: **crece más rápido**. Un techo 95 se siente distinto desde el turno 3.

**Validación en simulador (obligatoria, 20k corridas):** distribución de OVR PICO target:
- pico ≥ 80: **20-26%** de las partidas
- pico ≥ 85: **12-16%**
- pico ≥ 90: **5-8%**
- pico ≥ 95: **1.5-3%**
- pico promedio: 73-77
Si no da, ajustar la pendiente del talentFactor hasta que dé. Este es EL número de la diversión.

## 2. LA SEÑAL DEL WONDERKID

Hoy el techo es 100% invisible → todas las partidas ARRANCAN sintiéndose iguales. Copero te insinúa la joya temprano y eso genera la anticipación.
- Si techo ≥ 86: en el turno 2 o 3, una línea de flavor sobre la fila recién completada: *"Hay algo distinto en esta marca. La gente vuelve."*
- Si techo ≥ 94: versión más fuerte en turno 2: *"Un mayorista te dijo que nunca vio rotar un producto así."*
- Si techo ≤ 76: silencio (la ausencia de señal también informa, con el tiempo el jugador aprende a leerla).
- Nunca revelar el número. Es un susurro, no un spoiler.

## 3. RACHAS (el motor de las carreras que despegan)

- 2 trienios consecutivos con momentum > 0 → el 3° tira con +1 extra ("estás en llama").
- 2 consecutivos con momentum < 0 → el 3° con -1 extra (las malas rachas también existen — pero ver §4.2 del PRD: las emergencias siguen capadas a 2 rescates).
- Feedback visual: mini indicador de racha en el HUD (🔥 ×2, ×3) — el jugador tiene que SENTIR la racha.
- Verificar en sim que las rachas + talentFactor + arcos generan curvas con forma (subidas de 3-4 turnos, no serruchos planos). Métrica: ≥ 30% de las partidas deben tener una racha de 3+ trienios positivos.

## 4. ARCOS: verificar que están vivos y amplificarlos

La tabla del último playtest (56→62→68→68→71→71→72→71→72→68→63) es una meseta con declive — no tiene forma de historia. O los arcos no están implementados en el build actual, o su sesgo es demasiado tímido.
- Verificar que el sorteo de arco corre y afecta.
- Amplificar: el sesgo de fase de cada arco pasa a **±2 de momentum** (hoy parece ≤ ±0.5 o inexistente).
- Log de QA: la sim reporta distribución de arcos y curva promedio por arco — las curvas por arco deben verse DISTINTAS a simple vista en el reporte.

## 5. LÓGICA PARLYX: EL AMORTIGUADOR (crítico de marca)

**El problema:** el owner activó Parlyx y su marca cayó 25.5M → 18.9M → 10.4M sin explicación. La marca del juego no puede coincidir con un derrumbe silencioso — es antimarketing.

**La regla (mecánica + narrativa):**
1. **Invariante duro:** con Parlyx activo, la caída de ventas de un trienio se amortigua 40% (`caídaConParlyx = caídaBase × 0.6`). El mercado te puede pegar igual (2022 le pegó a todos) — pero **nunca caés más CON Parlyx que sin él.** Agregar test unitario de este invariante.
2. **El contrafactual visible:** el motor corre la rama sin-Parlyx con la misma seed (es determinístico: es gratis). Cuando hay un trienio negativo con Parlyx activo, la fila/el reporte lo dice: *"Ventas -19%. Sin automatizar: -34%."* La caída es del mercado; Parlyx te salvó la mitad — honesto, verificable, y protege la marca.
3. El bloque IMPACTO de la tarjeta suma la línea cuando aplique: *"Amortiguó la crisis del 2022: -19% en vez de -34%."*
4. Sigue vigente la regla de oro (§4.2 del PRD v1.0): activarlo óptimo en 60-70% de contextos — el amortiguador cuenta como beneficio en ese cálculo. Re-verificar en sim.
5. **Prohibido:** cualquier carta o mecánica donde tener Parlyx activo empeore un resultado.

## 6. BUG VISUAL PERSISTENTE (tercera aparición)

El **escudo violeta con "$???"/"$TIM"** sigue renderizándose flotante sobre el header de la tabla (esquina superior derecha, pisando la columna VENTAS). Es un componente con posicionamiento absoluto y data placeholder — probablemente el sello del arquetipo o un tooltip de ticker renderizando fuera de lugar. Encontrarlo (buscar el string "$" + shield/escudo en componentes de tarjeta), y arreglarlo o eliminarlo. Screenshot de verificación obligatorio en la entrega.

## 7. Coherencia mote ↔ final (menor)

"El Timonel — vendiste en el pico y compraste en el valle" apareció junto al final "33 años después, seguís remando" — el mote describe algo que no pasó. Las líneas de arquetipo deben tener 2 variantes (resultado bueno / resultado modesto) y elegirse según el final. Ej. Timonel modesto: *"Leés el clima antes que nadie. Ejecutarlo es otra historia."*

## 8. Entrega y validación

- Reporte de sim con: distribución de OVR pico (contra los targets del §1), % de partidas con racha 3+, curvas promedio por arco, % de contextos donde Parlyx es óptimo, y el golden actualizado.
- Screenshots: (a) una carrera con pico 88+ (jugarla con seed que la produzca, la sim la encuentra), (b) el contrafactual de Parlyx en pantalla, (c) la tabla sin el escudo fantasma.
- No tocar: deck, lenguaje humano, setup, UI densidad — esto es SOLO motor + los dos fixes visuales.
