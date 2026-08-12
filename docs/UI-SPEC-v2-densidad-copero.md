# UI SPEC v2 — "DENSIDAD COPERO"
**05-ago-2026 · Reemplaza el layout de una pantalla del anexo v0.4 §10 (los chips de timeline quedan ELIMINADOS). Este documento manda sobre cualquier spec de UI anterior. Digiere y filtra el brief externo de Gemini: se adopta su sistema de animación, se rechaza su dirección estética donde contradice a la referencia Copero.**

---

## 0. La corrección de rumbo

El playtest fue claro: la tabla de carrera completa es EL espectáculo del juego — verla llenarse fila a fila ES jugar, y es lo que hace al screenshot. Esconderla en chips fue un error. La solución al problema del scroll no es ocultar la tabla: es **densificarla** al nivel de Copero, cuya tabla mete 13 filas en media pantalla de teléfono.

**Regla nueva:** la tabla de 11 años + fila 2026 está SIEMPRE visible completa durante el juego. El scroll natural hasta la carta de decisión está permitido (Copero también lo tiene) — lo que está prohibido es que la tabla desaparezca o se colapse.

---

## 1. LA TABLA (el componente sagrado — clonar densidad Copero)

Anatomía de fila, altura fija **30px**, grid de 4 columnas:

```
[chip AÑO 40px] [logo 18px + EMPRESA + trofeos inline] [PÍLDORA OVR 38px] [ARR mono, right]
```

- **Chip de año** (como el chip de edad de Copero): rectángulo redondeado chico, fondo coloreado por **etapa de la empresa ese año** — gris oscuro (garage), verde petróleo (seed), azul (Serie A), índigo (Serie B), rojo vino (Serie C+), dorado (pública). El gradiente de colores de los chips a lo largo de la tabla cuenta la historia de un vistazo, igual que los chips de edad de Copero cuentan los clubes.
- **Empresa:** logo-emoji 18px sobre fondo del color de la empresa al 15% + nombre en 13px semibold + trofeos/hitos inline en 11px (🦄 ✝ ↓ ↳) pegados al nombre, como los trofeos por temporada de Copero.
- **Píldora OVR (spec exacta — es el ícono del juego):**
  - 38×22px, `rounded-lg`, número en 13px **black** (peso 900), color del número OSCURO sobre fondo saturado (como Copero: número negro sobre dorado).
  - Tramos: bronce `bg #B45309 → #92400E` · plata `bg #64748B → #475569` · dorado `bg #F0B90B → #D97706` · violeta `bg #A78BFA → #7C3AED` **+ glow exterior** (`box-shadow 0 0 12px rgba(167,139,250,.45)`) — el violeta tiene que verse legendario a un metro de distancia.
  - Cambio de valor → animación odómetro vertical (§3).
- **ARR:** IBM Plex Mono 11px, tabular, gris; con `▼` rojo pegado si cayó vs el año anterior.
- Filas futuras: mismas filas fantasma al 30% de opacidad (el esqueleto Zeigarnik se mantiene).
- Fila del turno actual: fondo `#171A21` + borde izquierdo de 2px en el color de acento.
- Separadores: `border-b border-white/5`. Sin padding vertical extra. Sin aire de más — **la densidad ES la estética.**

## 2. LAYOUT DE JUEGO (reemplaza el 100dvh estricto)

```
Ticker (26px)
HUD (56px, UNA fila): [OVR pill grande 44px] [Valuación con odómetro + sparkline] [Runway] [Founder%]
Franja de era (30px): ☀️ nombre · MÚLTIPLO · CAPITAL
TABLA COMPLETA (12 filas × 30px = 360px)
CARTA DE DECISIÓN (entra como bottom-sheet, §3)
```
Total sobre el fold en un 390×844: ticker+HUD+era+tabla = ~472px → **la tabla entera + el título de la carta se ven sin scrollear.** Las opciones pueden requerir un scroll corto: aceptado, igual que Copero.

## 3. SISTEMA DE ANIMACIÓN (adoptado del brief Gemini — con Framer Motion)

Framer Motion queda **aprobado** como dependencia (≈35KB gz; el presupuesto de peso sube a 550KB y listo — el game feel lo vale). Especificación:

- **Botones/opciones (tactilidad):** `whileTap={{scale:.96}}` `whileHover={{scale:1.02}}` con `spring(stiffness:400, damping:17)`. TODO lo tocable responde así, sin excepción.
- **Odómetro:** OVR, Valuación, ARR y Patrimonio nunca cambian en seco — conteo animado (300-500ms) o slot vertical. La valuación girando después de cada decisión es EL momento de dopamina barata del HUD.
- **Filas nuevas de tabla:** `initial={{opacity:0, y:14}} → animate={{opacity:1, y:0}}` en cascada de 90ms — la ceremonia de fin de trienio existente, ahora con física.
- **Carta de evento:** entra como **bottom-sheet con rebote** (`y:100% → 0`, spring suave). La carta anterior sale con `x:-80, opacity:0`. Cero delay entre salida y entrada (estado síncrono, sin spinners jamás).
- **Reveal de decisión:** tap → 500-700ms de tensión (borde pulsando) → outcome con flash verde/rojo. **Crítico dorado:** `scale:[1,1.15,1]` + glow dorado + partículas mínimas.
- **Logros:** en la vitrina, bloqueados = escala de grises + `opacity-30` (adoptado tal cual del brief); al desbloquear en vivo: pop `scale:[1,1.2,1]` + glow.
- `prefers-reduced-motion`: todo degrada a fades de 150ms.

## 4. PALETA Y TIPOGRAFÍA (fallo sobre el brief Gemini)

| Tema | Brief Gemini | Decisión | Por qué |
|---|---|---|---|
| Fondo | #000 / #09090B | ✅ `#09090B` | Un pelo más negro que el nuestro, ok |
| Acento primario | ❌ Esmeralda #004D40 | **Verde mercado `#16C784`** | El esmeralda oscuro no contrasta sobre negro y rompe el idioma verde-sube/rojo-baja del género |
| Éxito/fracaso | esmeralda/gris | **Verde `#16C784` / Rojo `#EA3943`** | Semántica de mercado, no de formulario |
| Whitespace | ❌ "masivo, editorial minimalista" | **Densidad Copero** | La referencia del owner ES la densidad; el minimalismo aireado es una landing de SaaS, no un juego de carrera |
| Tramos OVR | (no los contempla) | **Se mantienen los 4 tramos** | Es el lenguaje FIFA/Copero — quitarlo mata la legibilidad memética |
| Tipos | Sans geométrica black + Inter | ✅ Se mantiene Archivo (display black) + IBM Plex Mono (datos) — cumple lo pedido | Ya son eso |
| Bordes/blur | rounded-2xl + backdrop-blur | ✅ radios suaves · blur SOLO en bottom-sheet y modal final | Blur masivo mata los 60fps en gama media |
| Glows | tenues, solo legendario | ✅ tal cual: glow únicamente en OVR 90+, críticos dorados y desbloqueo de logros | Escasez del glow = jerarquía |
| Iconografía | Lucide React | ✅ Lucide para UI · **SVG propios para copas/escudos** (nunca Lucide para trofeos) | La vitrina es arte propio |

## 5. PANTALLA FINAL / SHARE (refinada)

- La tabla completa ARRIBA (protagonista, densidad total, es el screenshot) → vitrina → sello del arquetipo → línea del casi → botón "Otra carrera".
- **Formato de export:** 1080×1350 (4:5, feed/X) como principal **+ variante 9:16** para stories (adoptado del brief). Mismo layout, la 9:16 estira el espacio entre secciones.
- El OVR PICO masivo (72px) con su tramo y glow si corresponde — "destacar de forma masiva" del brief: aprobado, ya era nuestro.
- Seed visible + botón "Copiar desafío" (share primera persona).

## 6. Mensaje para el equipo (resumen ejecutable)

1. **Revertir** los chips de timeline → tabla completa siempre visible con la densidad de §1.
2. **Instalar Framer Motion** e implementar §3 completo (botones spring, odómetro, cascada, bottom-sheet, reveal, pops de logro).
3. **Rehacer la píldora OVR** según spec exacta de §1.
4. Aplicar los fallos de paleta de §4 (verde mercado, no esmeralda; densidad, no whitespace).
5. Pantalla final según §5 con export 4:5 y 9:16.
6. Presupuesto actualizado: ≤550KB, 60fps gama media, reduced-motion degradado.
