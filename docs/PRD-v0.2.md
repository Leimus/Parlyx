# PRD — **Tu Carrera Emprendedora** · por Parlyx AI
**Versión:** 0.2 · **Fecha:** 04-ago-2026 · **Owner:** Leimus (Parlyx) · **Estado:** decisiones D1-D6 cerradas, listo para F1

**Changelog v0.1 → v0.2:** nombre definido (D1) · estructura de 11 turnos trienales 1993→2026 (D2) · voseo rioplatense (D3) · dirección de arte "startupera bursátil" (D4) · macro histórica probabilística en dos capas, ya no fija estilo Remar (D5) · nueva mecánica "cambio de camiseta": carrera ejecutiva en empresas grandes (D6).

---

## 1. Resumen ejecutivo

**Tu Carrera Emprendedora** es un minijuego web gratuito, mobile-first, sin registro ni descarga: simulás tu vida emprendedora completa —**1993 → 2026, una decisión cada 3 años, 11 decisiones**— desde el garage hasta el IPO, la quiebra, la playa o el sillón de CEO de un gigante. Partida de 4-6 minutos que termina en una **tarjeta compartible** diseñada para Twitter/X.

Cruza la simplicidad y el sistema de progresión de **Copero** (OVR, potencial oculto, tabla de carrera, pases de camiseta, trofeos) con el trasfondo histórico del tech y de LATAM, en **castellano rioplatense**, para el nicho abierto del género: startups.

**Objetivo de negocio:** awareness de Parlyx en el ecosistema tech/emprendedor de LATAM. La marca entra solo como "por Parlyx AI" en título, footer y tarjeta.

**One-liner de marketing (propuesta):** *"33 años de carrera emprendedora en 11 decisiones. Terminás tocando la campana o vendiendo el auto."*

**Nota de implementación del nombre:** el título completo es "Tu Carrera Emprendedora por Parlyx AI". Para la URL conviene un dominio corto y tipeable (candidatos a verificar: `tucarrera.app`, `carrera.parlyx.ai`, `emprendedor.app`); el título largo vive en el logo, el og:title y la tarjeta.

---

## 2. Objetivos y KPIs

| Objetivo | KPI | Target inicial (primeras 4 semanas) |
|---|---|---|
| Viralidad | % de partidas terminadas que comparten la tarjeta | ≥ 15% |
| Viralidad | K-factor (nuevos jugadores por jugador) | ≥ 0.4 |
| Engagement | % de partidas iniciadas que se completan | ≥ 65% (subió: partida más corta) |
| Engagement | Replays por jugador | ≥ 2.0 (subió: deck rota más, ver sección 7) |
| Duración | Tiempo mediano de partida | 4-6 min |
| Marca | CTR hacia parlyx.ai | ≥ 2% |
| Performance | Carga inicial en 4G | < 2 s / < 500 KB |

Eventos a instrumentar: `game_start`, `setup_complete`, `turn_decision` (id de carta + opción), `game_end` (final alcanzado), `share_open`, `share_complete`, `seed_replay`, `outbound_parlyx`.

---

## 3. Aprendizajes de referencia (Copero + Remar)

Síntesis de investigación + análisis de ~20 screenshots de partidas reales. Se mantienen de v0.1, con dos ajustes de dirección (filas 4-5 y 16) decididos por el owner:

| # | Principio | Fuente | Aplicación |
|---|---|---|---|
| 1 | El screenshot final ES el producto | Copero | La tarjeta se diseña primero |
| 2 | Ironía dramática: el jugador conoce la historia | Remar | Capa ambiente histórica (sección 9) — presente pero no invasiva |
| 3 | Una decisión por turno, cero fricción | Ambos | 1 tap por decisión, sin registro |
| 4 | Tabla-esqueleto visible desde el turno 1 | Copero | **11-12 filas trienales** — más limpia que la de 31 y mejor para screenshot (D2) |
| 5 | Pocas decisiones por partida = rejugabilidad | D2 (owner) | En 11 turnos NO ves todo el deck: cada partida toca ~10% de las cartas |
| 6 | Potencial oculto: mismo origen, techos distintos | Copero | Techo sorteado + momentum (sección 8) |
| 7 | Decisiones que marcan tendencia (pendiente, no valor) | Copero (owner) | Atributo `tendencia` en opciones |
| 8 | Probabilidades explícitas en píldoras (65%/35%) | Copero | Cartas tipo apuesta con % visibles |
| 9 | Cartas de humor entre las serias | Copero | Deck de color, tono realista-con-guiños |
| 10 | Reveal del outcome resaltado en la misma carta | Copero | Animación idéntica en espíritu |
| 11 | La tarjeta muestra el PICO, no el final | Copero | OVR pico + valuación pico |
| 12 | Declive inevitable al final | Copero | Curva de fatiga post-pico |
| 13 | Costo en una sola moneda (meses de runway) | Remar | Runway como moneda |
| 14 | Seed compartible para replay retado | Remar | Seed en la URL |
| 15 | Marcadores de fila: ↳ ↓ 🏆 inline | Copero | ↳ pivot/pase, ↓ down round, hitos inline |
| 16 | Cambios de camiseta como columna vertebral de la carrera | Copero (D6) | Las empresas son los clubes: tu startup, gigantes que te compran, tu segunda startup |
| 17 | Setup con framing narrativo de dificultad | Remar | Capital inicial con narrativa |
| 18 | Badge "TE PASÓ" cuando el evento te pega directo | Remar | Al matchear vertical/HQ |
| 19 | Toggle de privacidad en la tarjeta | Copero | "Mostrar mi nombre" |
| 20 | No nombrar marcas reales; narrar hechos | Remar | Arquetipos reconocibles sin nombres (sección 15) |

---

## 4. Concepto y estructura temporal

- **Rol:** vos. Founder (y a veces ejecutivo) a lo largo de 33 años.
- **Ventana:** **1993 → 2026.** 11 turnos de decisión trienales: 1993 · 1996 · 1999 · 2002 · 2005 · 2008 · 2011 · 2014 · 2017 · 2020 · 2023, más la fila de **balance final 2026**. Total en tabla: 12 filas — la misma densidad visual que la tabla de Copero (12 filas de 16 a 38 años).
- **Edad:** elegís edad inicial 20-25 → terminás con 53-58. La vida entera entra en un screenshot.
- **Por qué trienios (D2, racional del owner):** (a) screenshot más limpio y legible, (b) juego más dinámico —termina en 4-6 min—, (c) rejugabilidad estructural: con 11 decisiones sobre un deck de 100+ cartas, no ves todas las situaciones en una partida; cada run es una mano distinta.
- **Ritmos (opcionales, data-driven):** **Normal** = 11 turnos trienales (default y modo de lanzamiento) · **Intensa** = 17 turnos bienales (post-MVP si hay demanda) · **Exprés** = 6 turnos de 5-6 años (post-MVP). v1 lanza solo con Normal para concentrar el balanceo.
- **Tono:** realista con guiños (cerrado).
- **Idioma:** **voseo rioplatense** (D3 cerrada). "Elegí tu rubro", "te compraron", "la sacaste barata". Guiños regionales extra según HQ.

---

## 5. Setup de partida (4 pasos + identidad)

Wizard corto estilo Remar; identidad estilo "camiseta" de Copero.

**Paso 0 — Identidad:** nombre de la empresa (máx 14 caracteres, botón "dado" con generador aleatorio) · tu apellido · logo = emoji + color (grid 12×8). El logo-emoji es tu camiseta: aparece en cada fila y en la tarjeta.

**Paso 1 — Rubro (= tu exposición):**

| Vertical | Riesgo | Beta al ciclo | Nota |
|---|---|---|---|
| SaaS B2B | Medio | Media | El camino sólido |
| Fintech | Alto | Alta | Regulación como evento extra |
| E-commerce / enabler | Medio | Media-alta | Boom 2020, resaca 2022 |
| Marketplace | Alto | Alta | Winner-takes-all |
| AI / ML | Muy alto | Muy alta | Muerto antes de 2014, dios después de 2023 |
| Gaming / consumer | Alto | Media | Hits-driven, más varianza |
| Deep tech / hardware | Muy alto | Baja | Lento, exit tardío y grande |
| Crypto / web3 | Extremo | Extrema | x10 o cero |

**Paso 2 — HQ:** Buenos Aires · CDMX · São Paulo · Bogotá · Santiago · Miami. Afecta costo de burn, frecuencia de cartas de capital y cartas de color locales.

**Paso 3 — Capital de arranque (= dificultad):**

| Opción | Narrativa | Capital | Equity cedido | Runway |
|---|---|---|---|---|
| Bootstrap | "Con lo puesto. Cada mes es una decisión." | USD 15.000 | 0% | 6 meses |
| Friends & Family | "La plata del asado. Ahora todos opinan." | USD 100.000 | 8% | 14 meses |
| Pre-seed VC | "Un fondo te firmó. También te puso metas." | USD 500.000 | 15% | 20 meses + flag `presión_growth` |

**Paso 4 — Confirmar** (resumen de tu identidad + "Arrancar carrera"). El ritmo no se elige en v1 (solo Normal).

---

## 6. Métricas del juego (HUD)

1. **OVR** (0-99): calidad integral founder+empresa. Se mantiene el nombre "OVR": es el meme legible de FIFA/Copero. Píldoras por tramo: bronce <70, gris 70-79, dorado 80-89, violeta 90+.
2. **Valuación** (USD): `ARR × múltiplo_de_la_era × (0.6 + OVR/100)`. En modo ejecutivo (sección 11.2) esta métrica se reemplaza por **Patrimonio**.
3. **Runway** (meses): moneda de costo de las decisiones ("-4 MESES"). Runway 0 → carta forzada de emergencia.
4. **% Founder**: se diluye por ronda; define tu exit y habilita el retiro.
5. **ARR**: visible desde que facturás.
6. **Techo de potencial** (OCULTA): sección 8.
7. **Patrimonio personal** (USD): aparece tras secondary, exit o al pasar a modo ejecutivo.

---

## 7. Loop de turno

- Tabla de 12 filas visible y vacía desde el arranque. Cada fila completada muestra: **año** · **logo-camiseta** (tu emoji, o el logo del gigante donde estés) · nombre de empresa/rol (`Kualo` / `VP Producto · el gigante del e-commerce`) · hitos inline · **OVR pill** · ARR o patrimonio · Δ valuación.
- Marcadores: **↳** pivot o pase de camiseta · **↓** down round / layoffs · **✝** casi-muerte sobrevivida · **🔁** comeback.
- **Por turno:**
  1. Header de era (sección 9): `CLIMA ☀️ · CAPITAL: abundante · MÚLTIPLO: 12x ARR` — mini-ticker bursátil animado de fondo (D4).
  2. Carta del turno (del pool elegible; macro solo si el sorteo la trae — sección 9.2). Badge **TE PASÓ** si matchea tu vertical/HQ.
  3. 2-3 opciones con efectos visibles: Δrunway, Δequity, y en apuestas, píldoras verde/roja con %.
  4. Tap → reveal: opción resaltada + outcome verde o rojo (400 ms), como Copero.
  5. La fila del trienio se completa con simulación (`rendimiento = f(OVR, tendencia, era, RNG)`), animada en cascada.
- **Cartas reactivas** entre turnos (máx 1 por trienio) si se cumplen condiciones: oferta de compra, VC que te busca, cofounder que se va, gigante que quiere ficharte (D6).

---

## 8. Potencial, momentum y tendencia (el corazón)

**8.1 Techo oculto** sorteado por partida (por empresa — un comeback re-sortea):

| Techo | Prob. | Arquetipo |
|---|---|---|
| 68-76 | 35% | "PyME digital sólida" |
| 77-85 | 30% | "Campeón regional" |
| 86-93 | 22% | "Unicornio posible" |
| 94-97 | 10% | "Generacional" |
| 98-99 | 3% | "Leyenda" |

Señales cualitativas sutiles ("los fondos preguntan por vos" / "cuesta que te devuelvan los mails") insinúan sin revelar.

**8.2 Momentum por trienio:** tirada `∈ {-2,-1,0,+1,+2,+3}` con pesos modificados por tendencia acumulada, era y fit vertical-era (AI post-2023 tira cargado para arriba; crypto en era de invierno, para abajo). Al ser trienios, cada tirada mueve más OVR que en v0.1 (rango efectivo ±4 por turno) — menos turnos, más peso por turno.

**8.3 Tendencia:** cada opción puede llevar modificador -2..+2 que altera los pesos del momentum de los próximos 1-2 trienios. Contratar al CTO caro no rinde hoy: carga los dados de mañana. "Modo crunch" rinde hoy y descarga los de pasado mañana.

**8.4 Declive:** pasados ~7 turnos de carrera activa o con 2+ burnouts, pesos corridos a negativo. Decidir cuándo vender/retirarte/pasarte a ejecutivo es el endgame.

---

## 9. La historia como trasfondo: dos capas (D5 — rediseñado)

Decisión del owner: la historia NO es un guion fijo estilo Remar. Es **ambiente garantizado + eventos sorteados**. Resultado: carreras más random, raras y divertidas; la ironía dramática sobrevive en el clima y los múltiplos.

**9.1 Capa ambiente (fija, silenciosa).** Las eras definen el header de cada turno (clima, capital, múltiplo). Siempre activas — no son cartas, son el terreno:

| Era | Años | Clima | Múltiplo ARR base | Capital |
|---|---|---|---|---|
| Burbuja punto-com | 1993-1999 | ☀️→☀️☀️ | 6x → 20x | abundante → eufórico |
| Invierno nuclear | 2000-2002 | ⛈ | 2-3x | cerrado |
| Recuperación web 2.0 | 2003-2007 | ⛅ | 5-7x | selectivo → normal |
| Crisis global | 2008-2009 | ⛈ | 3x | cerrado |
| Boom mobile/SaaS/región | 2010-2015 | ☀️ | 7-10x | abundante |
| Sustito + manía cripto | 2016-2019 | 🌧/☀️ | 7-12x | selectivo → abundante |
| Shock y fiesta | 2020-2021 | ⛈→☀️☀️ | 5x → 40x (early) | cerrado → eufórico |
| Ajuste de tasas | 2022 | ⛈ | 6x | cerrado |
| Era AI | 2023-2026 | ⛅/☀️ | 6-8x (resto) · 18-22x (AI) | selectivo (AI: eufórico) |

*Los múltiplos son valores de juego inspirados en la dirección real del mercado, no cifras históricas exactas; se calibran en F3.*

**9.2 Capa de cartas macro (pool sorteado).** ~15 cartas macro con ventana temporal. Por partida, la seed sortea **1-3 que efectivamente se juegan como decisión** (peso extra si matchean tu vertical/HQ → badge TE PASÓ); el resto de la historia solo se siente por el ambiente. Pool inicial:

| Carta macro | Ventana | TE PASÓ para |
|---|---|---|
| "La fiesta de fin de milenio" — cualquier dominio levanta plata | 1996-1999 | todos |
| "Se pinchó" — el índice tech pierde la mitad | 2000-2002 | todos |
| "El país se cae a pedazos" — colapso económico local | 2000-2002 | HQ Buenos Aires |
| "Un teléfono sin teclas lo cambia todo" | 2005-2008 | consumer/gaming |
| "Cayó un banco de 160 años" | 2008-2009 | fintech |
| "Todos tienen una computadora en el bolsillo" | 2011-2014 | consumer/marketplace |
| "Inventaron una palabra para las startups de mil millones" | 2014-2017 | todos |
| "La región se despierta" — nacen los gigantes de LATAM | 2014-2017 | HQ LATAM |
| "Monedas mágicas de internet" | 2017-2020 | crypto |
| "Invierno cripto" | 2017-2020 | crypto |
| "Un fondo japonés gigante desembarca con la billetera abierta" | 2017-2020 | HQ LATAM |
| "El mundo se encierra" — crash y boom digital en el mismo año | 2020 | e-commerce |
| "La plata era gratis" — rondas a 100x ARR | 2020-2023 | todos |
| "Subieron las tasas" — layoffs y fin del growth | 2022-2023 | todos |
| "Un chatbot que escribe solo lo cambia todo (de nuevo)" | 2023-2026 | AI (bendición) y resto (amenaza) |

**9.3 Historia Inventada (post-MVP, D5 la vuelve menos urgente):** con macro sorteada, cada partida de Historia Real ya es distinta. El modo shuffle de eras completo pasa a backlog (sección 20).

---

## 10. Taxonomía de cartas + deck

Schema por carta: `id`, `título`, `flavor` (1-2 líneas), `tipo`, `elegibilidad` (modo founder/ejecutivo, etapa, vertical, ventana de años, métricas, flags), `opciones[2-3]`. Por opción: `label`, `efectos` (Δrunway, Δequity, ΔOVR, ΔARR%, Δtendencia, Δpatrimonio), `probabilidad` (apuestas), `flags`.

**Tipos:**
- **T1 · Trade-off determinístico.** "Terminar la facultad a distancia" → +1 OVR contactos / -2 meses runway, vs. seguir a full → sin cambios.
- **T2 · Apuesta con % explícito.** "Modo crunch: 6 meses a fondo" → Sale la feature clave 65% (+2 OVR, +ARR) / Burnout 35% (-1 OVR, tendencia -1).
- **T3 · Bifurcación.** "Un gigante te quiere comprar" → Vender / Rechazar y pelearla.
- **T4 · Forzada por contexto.** Runway 0 o macro dura: "La plata se cortó" → Layoffs 30% (↓, -2 OVR, +8 meses) / Down round al 50% (↓, -10% eq.) / Apostar la caja al pivot (40/60).
- **T5 · Color/humor.** "Un influencer de negocios se ofrece de advisor por el 2%" → Aceptar: +2 OVR visibilidad 60% / Papelón 40% · Rechazar: no pasa nada. "Te invitan a un panel sobre el futuro" → +1 OVR 70% / Decís algo que envejece mal 30%. Máx 1 cada 3 decisiones.
- **T6 · Equipo.** "Tu cofounder se quiere ir" → Comprarle su parte (-6 meses, +8% eq.) / Dejarlo ir (tendencia -1) / Convencerlo (50/50).
- **T7 · Financiamiento.** Term sheets generados por era/OVR: fondo top del Valle (más plata, +dilución, flag `presión_growth`) · fondo regional paciente · venture debt · no levantar (+1 OVR disciplina si sobrevivís) · en ⛈ solo down/inside rounds · **secondary personal** desde Serie B (crea Patrimonio, habilita retiro).
- **T8 · Expansión.** "México te tira onda" → Abrir CDMX (-5 meses, tendencia +1, ARR +20% en el trienio) / Foco en casa.
- **T9 · Cambio de camiseta (NUEVO, D6).** Ver sección 11.2.

**Deck MVP:** 100-120 cartas (~15 macro, ~55 generales T1-T8, ~20 condicionales de vertical/HQ, ~15 de color, ~12 de modo ejecutivo). Con 11 turnos por partida, cada run usa ~10-12 cartas → dos partidas seguidas casi no se repiten. Esto implementa directamente la lógica de D2.

---

## 11. Los tres caminos: founder, ejecutivo, playa

**11.1 Founder (default).** Todo lo anterior.

**11.2 Modo ejecutivo — "cambio de camiseta" (D6).** Como irte a jugar al Real Madrid:
- **Cómo se entra:** (a) un gigante te adquiere y te ofrece quedarte ("Fichar por el gigante del e-commerce regional como VP Producto" — tu exit se cobra, y seguís adentro), (b) tu startup muere y te llega oferta de rescate ejecutivo, (c) oferta directa de fichaje en cualquier momento si tu OVR ≥ 80 (carta reactiva).
- **Gigantes ficticios reconocibles (arquetipos, cero marcas):** 📦 el gigante del e-commerce regional · 🔍 el buscador · 🏦 el banco que se quiere volver fintech · 🟣 el neobanco morado · 🚗 la app de viajes · 🧉 el unicornio criollo. Cada uno con "prestigio" (equivalente a la jerarquía de clubes) que multiplica OVR ganado y patrimonio.
- **Qué cambia en el HUD:** desaparecen Runway/%Founder/Valuación; aparecen **Cargo** (#N en el organigrama: VP → C-level → CEO) y **Patrimonio** (sueldo + stock, crece estable). El OVR sigue siendo tuyo y sigue con momentum.
- **Cartas propias del modo:** política corporativa, pelear un ascenso (T2 con %), defender tu área en layoffs, aburrimiento dorado (-tendencia si te quedás muchos trienios), y la puerta de salida: **"Te pica el bichito"** → renunciás y fundás de nuevo (→ 11.4).
- **En la tabla:** la fila cambia de camiseta (logo del gigante) y el rol reemplaza al nombre de tu startup, exactamente como Copero muestra el pase de club. **Este vaivén startup→gigante→startup es EL screenshot diferencial nuestro.**

**11.3 Modo playa (retiro).**
- **Gate:** "Vender tu parte y retirarte" solo aparece con `Patrimonio ≥ USD 2M`. Sin éxito mínimo, la opción no existe (pedido explícito del owner).
- Trienios restantes en cartas de estilo de vida: viajes, inversiones personales, un restaurante, cripto personal. Podés **fundirte en la playa** (Patrimonio → 0 = final "De la playa a LinkedIn") o multiplicar.
- Desde la playa, si quedan ≥ 2 turnos: carta **"Te pica el bichito otra vez"** → comeback.

**11.4 Comeback (founder serial).** Nueva empresa: OVR inicial 60 (no 50), techo re-sorteado con +10% de probabilidad en tramos altos, term sheets mejores (tu red). Camino a "ir más arriba aún". La tarjeta muestra todas las camisetas de la carrera.

---

## 12. Finales y logros

**Finales:**

| Final | Condición | Título en tarjeta |
|---|---|---|
| IPO | Valuación ≥ USD 1B + campana aceptada | "Tocaste la campana" 🔔 |
| Unicornio privado | Pico ≥ USD 1B sin IPO | "Unicornio" 🦄 |
| Exit grande | Venta ≥ USD 100M | "Exit" 💰 |
| Acqui-hire | Venta de emergencia por talento | "Te compraron por el equipo" |
| CEO corporativo (NUEVO, D6) | Llegaste a CEO de un gigante | "Terminaste manejando el barco de otro" |
| Ejecutivo estrella (NUEVO, D6) | C-level con Patrimonio ≥ USD 10M | "El empleado mejor pago de LATAM" |
| PyME rentable | 2026 cash-flow positivo sin exit | "Rentable. Nadie te aplaude, vos cobrás." |
| Quiebra digna | Runway 0, cierre ordenado | "La cerraste bien" ✝ |
| Quiebra escándalo | Runway 0 + flags turbios | "Saliste en los diarios" |
| Leyenda retirada | Retiro con Patrimonio ≥ USD 20M | "Modo playa permanente" 🏝 |
| Fundido en la playa | Retiro + Patrimonio 0 | "De la playa a LinkedIn" |
| Founder serial | 2+ empresas, la segunda supera a la primera | "El segundo tiempo fue mejor" 🔁 |

**Logros (apilables ×N, inline en fila + apilados en tarjeta):** 🦄 · 🔔 · 🏆 #1 en ranking de lanzamientos · 💵 primer millón ARR · 📈 10M ARR · 👥 100 empleados · 🌎 3 mercados · 🏅 lista "30 promesas" · ✝ sobreviviste al 2001 · ✝ sobreviviste al 2022 sin layoffs · 🛡 down round survivor · 💎 nunca bajaste del 50% de equity · 🔥 3 trienios seguidos +100% · 👔 fichado por un gigante · 🔁 comeback.

---

## 13. Tarjeta compartible (spec — LA feature)

1. **Header:** OVR PICO en card grande (color por tramo, violeta 90+) · logo-emoji + nombre de tu empresa (o última camiseta) · bandera HQ · pill de vertical · "VALUACIÓN PICO USD XXX M" (o Patrimonio si carrera ejecutiva).
2. **Stats:** AÑOS ACTIVOS · ARR PICO · EMPLEADOS PICO · % FOUNDER FINAL (o CARGO MÁXIMO).
3. **TRAYECTORIA:** la fila de camisetas en orden — tu emoji-logo, logos de gigantes (📦🔍🏦…), segundo emoji-logo si hubo comeback. El vaivén es el screenshot diferencial (D6).
4. **HITOS:** trofeos apilados ×N.
5. **Título del final** como frase protagonista (tabla sección 12).
6. **Footer:** "Jugá la tuya en [dominio] · **Tu Carrera Emprendedora por Parlyx AI**" + seed de 6 caracteres.
7. **Toggle:** "Mostrar mi nombre".

**Formatos:** la pantalla final YA es la tarjeta 1080×1350 (screenshot nativo perfecto) + **og:image dinámica 1200×630 por partida** (edge function) para que el link pegado en X muestre TU tarjeta. Acciones: compartir nativo · copiar imagen · descargar · copiar link con seed ("Jugá mi misma partida").

---

## 14. UI/UX y dirección de arte (D4 cerrada)

- **Dirección: "startupera bursátil".** Nasdaq/S&P/Merval/TechCrunch/Forbes como universo visual: canchero, cool, pragmático, denso en datos como Copero. Elementos concretos:
  - **Ticker de mercado** animado como textura de fondo del header de turno (símbolos ficticios subiendo/bajando según el clima de la era).
  - **Verde/rojo de mercado** (#16C784 / #EA3943) como semántica universal de outcomes, probabilidades y deltas — ya es el lenguaje de las píldoras de Copero.
  - **Tipografía:** sans grotesk densa para HUD/tabla (estilo terminal financiera); display bold condensada para el año del turno y los titulares de carta (estilo tapa de revista de negocios). Números tabulares SIEMPRE.
  - **Dark theme** #0B0B0D, tinta #F5F5F4, acento verde mercado. Sparkline de valuación permanente en el HUD (la "acción" de tu empresa).
  - Sin ilustraciones pesadas: emoji nativo + SVG. Peso y velocidad primero.
- **Mobile-first 390px**; desktop = columna centrada.
- **Pantallas:** Landing (título + one-liner + "Arrancar carrera") → Setup ×5 → Juego (HUD sticky + tabla-esqueleto + carta) → Fin ("Tu carrera llegó a su fin" + stats + trofeos + [Ver tarjeta] [Volver a jugar]) → Modal compartir.
- **Microinteracciones:** reveal 400 ms · cascada de fila 100 ms · confetti sobrio solo en 🦄/🔔 · contador de valuación animado tipo ticker.
- **Accesibilidad:** contraste AA, taps ≥ 44px, % siempre numérico (no solo color).

---

## 15. Contenido y copy

- **Voseo rioplatense** (D3 cerrada): "elegí", "arrancá", "te fundiste", "la sacaste barata". Es el registro de Copero/Remar y del Twitter argentino que originó el género. Guiños locales por HQ (asado en BA, tacos en CDMX) sin cambiar el registro base.
- **Reglas:** títulos ≤ 5 palabras · flavor ≤ 2 líneas · opciones ≤ 6 palabras · anglicismos solo los del ecosistema (ARR, runway, exit — son parte del chiste).
- **Marcas:** jamás nombres reales de empresas, fondos o personas. Arquetipos reconocibles con perífrasis ("el gigante del e-commerce regional", "un fondo japonés con la billetera abierta"). Más elegante, más gracioso, cero riesgo legal.

---

## 16. Arquitectura técnica

- **Stack:** SPA estática (Next.js export o Astro + islands React). Sin backend de gameplay.
- **Motor determinístico por seed:** techo, momentum, sorteo de macro (D5), orden del deck y outcomes derivan de una seed (mulberry32/xoshiro). Seed en URL (`/p/AB3X9K`) → replay retado exacto sin servidor.
- **Contenido data-driven:** `/data/cards/*.json`, `/data/eras.json`, `/data/balance.json`, validado con Zod. Balancear = editar datos.
- **Máquina de estados:** `setup → turn(1..11) → resolve → reactive? → ... → ending → share`. Estado serializable.
- **Única pieza server-side:** edge function de og:image (Vercel OG/satori) con fallback estático.
- **Analytics:** PostHog o Plausible, eventos de sección 2, sin login ni cookies invasivas.
- **i18n-ready** (es-AR base; en/pt en backlog).
- **Hosting:** Vercel o Cloudflare Pages. Dominio corto + UTM a parlyx.ai.
- **QA de balanceo:** simulador headless de 10.000 partidas → valida distribución de finales contra sección 17 antes de cada release.

---

## 17. Balanceo — targets (10.000 partidas simuladas, juego competente-aleatorio)

| Resultado | Target |
|---|---|
| Quiebra (digna + escándalo) | 25-30% |
| PyME rentable | 20-25% |
| Carrera ejecutiva como final (CEO/estrella) | 8-12% |
| Exit chico / acqui-hire | 12-15% |
| Exit grande (≥100M) | 8-10% |
| Unicornio (con o sin IPO) | 7-9% |
| IPO | 3-5% |
| Retiro playa (cualquier variante) | 5-8% |
| Comeback jugado | 10-15% de las partidas |
| OVR pico promedio | 74-78 |
| Macro cards jugadas por partida | 1-3 (nunca 0, nunca 4+) |
| Duración | 11 decisiones · 4-6 min |

Principio: la mayoría termina "bien pero no épico". Lo épico raro = screenshot valioso.

---

## 18. Distribución y lanzamiento

1. **Soft launch:** 15-20 amigos del ecosistema con seed challenge.
2. **Launch:** hilo en X de Leimus (historia del proyecto + su tarjeta + link). Formato validado por el hilo de @nicotourne que catalogó el género.
3. **Pico:** desafíos por seed con cuentas grandes tech AR/MX.
4. **Prensa del género** (Canal26, Milenio, ABC, El Litoral ya cubren estos juegos) post-tracción.
5. **Parlyx:** título, footer, tarjeta y un tuit de la cuenta. La marca no interrumpe jamás.

---

## 19. Roadmap

| Fase | Entregable | Criterio de salida |
|---|---|---|
| F1 · Contenido | Deck 100-120 cartas + eras.json + balance v1 + copy en voseo | Aprobación de Leimus carta por carta |
| F2 · Core loop | Setup + motor + HUD + tabla, arte placeholder | Partida completa jugable en el teléfono |
| F3 · Simulador | 10k runs + ajuste a targets | Distribución dentro de targets |
| F4 · Arte + tarjeta | Dirección "startupera bursátil" final + og:image dinámica | Screenshot al nivel de Copero/Remar |
| F5 · Playtest | 15-20 testers AR+MX | ≥65% completion, 0 bugs bloqueantes |
| F6 · Launch | Dominio + analytics + hilo | Público |

---

## 20. Post-MVP (backlog — NO entra en v1)

Historia Inventada (shuffle de eras) · ritmos Intensa/Exprés · Modo Dinastía (timeline extendido a 2040, edad hasta 65) · EN + PT · ranking semanal por seed · cartas estacionales · spin-off "El Inversor" (jugás del otro lado de la mesa, mismo motor).

---

## 21. Estado de decisiones

| # | Decisión | Estado |
|---|---|---|
| D1 | Nombre: **Tu Carrera Emprendedora por Parlyx AI** | ✅ Cerrada (pendiente: elegir dominio corto) |
| D2 | Estructura: **1993→2026, 11 turnos trienales** | ✅ Cerrada |
| D3 | **Voseo rioplatense** | ✅ Cerrada |
| D4 | Arte: **startupera bursátil** (Nasdaq/TechCrunch/Forbes, canchera como Copero) | ✅ Cerrada |
| D5 | Macro histórica: **ambiente fijo + 1-3 cartas macro sorteadas** por partida | ✅ Cerrada |
| D6 | **Cambio de camiseta**: carrera ejecutiva en gigantes, con vuelta al ruedo | ✅ Cerrada |
| D7 | Dominio corto (tucarrera.app / carrera.parlyx.ai / otro) | 🔲 Abierta |

---

## 22. Riesgos

| Riesgo | Prob. | Mitigación |
|---|---|---|
| Clones antes del launch (el género explota) | Alta | Velocidad + tarjeta de calidad + nicho startup libre + D6 como mecánica única |
| Voseo limita en MX | Media | Asumido por el owner (D3); playtesters MX en F5 validan comprensión |
| Balanceo plano (partidas parecidas) | Media | Techo oculto + macro sorteada (D5) + deck grande vs 11 turnos |
| Marcas/legales | Baja | Regla dura de arquetipos sin nombres |
| Scope creep | Alta | Sección 20 es contrato: nada de eso en v1 |
| og:image falla en X/WhatsApp | Media | Test de unfurl real en F4 |

---

*Próximo paso: F1 — escribir el deck completo de cartas. Propuesta de arranque: las 15 macro + las 12 de modo ejecutivo + 20 generales, para revisar tono y balanceo antes de escalar al resto.*
