# PRD — **Tu Carrera Emprendedora** · por Parlyx AI
**Versión:** 0.3 · **Fecha:** 05-ago-2026 · **Owner:** Leimus · **Estado:** para revisión — NO pasar a desarrollo hasta aprobar

**Qué cambia vs v0.2:** el juego pasa de "awareness viral" a **lead magnet jugable** (doble embudo: viral + comercial). Se agregan seis sistemas nuevos que responden al feedback del primer playtest completo: Perfil de Founder (arquetipos), Powerups con Parlyx diegético, Arcos narrativos, El Rival, formatos de carta variables, y Vitrina rediseñada. Se corrigen: early game, UI de una pantalla.

---

## 0. El principio rector (nuevo, y es ley)

> **El juego primero.** La captura de leads nunca degrada la experiencia: no hay registro para jugar, no hay gate para compartir la tarjeta, no hay ads. El dato se **gana** entregando valor extra (el informe del perfil), jamás se **exige**. Un lead magnet que se siente como lead magnet es un juego muerto — y un juego muerto no genera leads.

---

## 1. El nuevo modelo: doble embudo

```
                    ┌──────────── EMBUDO VIRAL (igual que v0.2) ───────────┐
 Jugar sin fricción → Tarjeta compartible → Twitter/X → nuevos jugadores
                    └──────────────────────┬───────────────────────────────┘
                                           │ (misma pantalla final)
                    ┌──────────── EMBUDO COMERCIAL (nuevo) ────────────────┐
 "Tu Perfil de Founder" (gratis, en la tarjeta)
   → "Querés el INFORME COMPLETO de tu perfil + tu plan?" → email (lead)
   → micro-survey opcional de 3 preguntas reales (calificación)
   → CTA Parlyx personalizado por arquetipo + vertical
   → HubSpot con lead scoring → contacto comercial personalizado
                    └───────────────────────────────────────────────────────┘
```

La clave: **la misma jugada alimenta los dos embudos.** El Perfil de Founder es simultáneamente el gancho de compartir (efecto test de personalidad) y el dato de calificación comercial.

---

## 2. EL PERFIL DE FOUNDER (el sistema puente — la idea central de v0.3)

Investigación de El Ídolo: al terminar la carrera, el juego te otorga un **mote** — y es una de las cosas que más se comparte. Los tests de personalidad son de los formatos más virales de internet por la misma razón: la gente comparte lo que un juego dice **de ellos**. Acá lo convertimos en sistema:

**2.1 Cuatro ejes, medidos con las decisiones que ya existen.** Cada opción de carta lleva (además de sus efectos) hasta 2 tags de eje, invisibles al jugador:

| Eje | Polo A | Polo B | Qué le dice a Parlyx |
|---|---|---|---|
| **Capital** | Diluidor (levanta siempre) | Dueño (bootstrap, control) | Sensibilidad al precio / decisión rápida vs consenso |
| **Motor** | Ventas (crece vendiendo) | Producto (crece construyendo) | Dónde percibe su cuello de botella |
| **Gestión** | Delegador (contrata, automatiza) | Pulpo (lo hace todo él) | **Fit directo con Parlyx**: el Pulpo es el cliente ideal |
| **Riesgo** | Apostador (toma los 50/50) | Arquitecto (asegura, compone) | Madurez del negocio / tono del pitch comercial |

**2.2 Ocho arquetipos** (combinación dominante de ejes), cada uno con nombre, escudo propio (SVG) y una línea que da ganas de compartir:

1. **El Animal de Ventas** — "Vendés hielo en la Antártida. El producto ya te va a alcanzar."
2. **El Artesano** — "Producto impecable, caja justa. Tus clientes te aman; tu contador, menos."
3. **El Financiero** — "Nunca pusiste un peso tuyo y siempre tuviste caja. Respeto."
4. **El Dueño** — "100% tuyo o nada. Más lento, pero nadie te dice qué hacer."
5. **El Pulpo** — "Vendés, programás, respondés los DMs a las 2 AM. No se puede sostener (y lo sabés)."
6. **El Apostador** — "Cara o cruz con la empresa entera. A veces sale cara."
7. **El Arquitecto** — "Cada decisión, un ladrillo. Aburrido de ver, imposible de voltear."
8. **El Timonel** — "Leés el clima antes que nadie. Vendiste en el pico y compraste en el valle."

El arquetipo aparece **grande en la tarjeta final** con su escudo — es el mote de El Ídolo hecho marca propia — y define el mensaje comercial (sección 4).

**2.3 Señal, no ruido.** El arquetipo se calcula solo con decisiones donde el jugador eligió entre polos reales (mín. 6 decisiones con tag por partida, garantizado por el sistema de sorteo). Si no hay señal suficiente: arquetipo "El Enigma" (raro, y también compartible).

---

## 3. Captura y calificación (el embudo comercial en detalle)

**3.1 El gate correcto.** En la pantalla final, debajo de la tarjeta (que se comparte libre):

> 📄 **"Tu informe completo de founder"** — Tu arquetipo a fondo, tus 3 fortalezas, tus 2 puntos ciegos según cómo jugaste, y qué harían distinto los que llegan a la Serie B. *Te lo mandamos por mail.*

Eso es un lead magnet clásico y honesto: valor real (el informe se genera del gameplay, es genuinamente personalizado) a cambio del email. **Nunca** se gatea el juego, la tarjeta ni el replay.

**3.2 Micro-survey de calificación (opcional, con recompensa).** Tras dejar el email, 3 preguntas reales, saltables:
1. "¿Tenés un negocio hoy?" (sí, vendo productos / sí, vendo servicios / estoy por arrancar / juego por diversión)
2. "¿Por dónde te compran/consultan más?" (WhatsApp / Instagram / web / local físico / no aplica)
3. "¿Cuántas consultas de clientes recibís por día?" (menos de 10 / 10-50 / 50-200 / +200 / no aplica)

Recompensa por responder: se desbloquea el logro **"Fundador de verdad"** en tu vitrina + un reroll de seed premium. Las 3 respuestas + arquetipo + vertical elegido = **lead scoring completo**.

**3.3 Lead scoring (a HubSpot vía API):**

| Señal | Puntos |
|---|---|
| Eligió vertical E-commerce o Marketplace en el juego | +20 |
| Arquetipo El Pulpo | +25 |
| Survey: vende por WhatsApp/Instagram | +30 |
| Survey: 50+ consultas/día | +30 |
| Survey: "juego por diversión" | descarta de sales, queda en newsletter |
| Compró el powerup Parlyx en el juego (sección 4) | +15 |

Score ≥ 60 → SQL: contacto comercial personalizado ("Vimos que sos El Pulpo y vendés por WhatsApp…"). Score medio → nurture con el informe + contenido. Bajo → solo newsletter del juego.

**3.4 Privacidad y transparencia (no negociable):** consentimiento explícito al dejar el email ("Al pedir tu informe aceptás que Parlyx te contacte"), link a política de datos, unsubscribe real, y las decisiones del JUEGO nunca se presentan como evaluación de la persona en tono serio — es un juego y el copy lo mantiene liviano. Nada de esto es dark pattern: el jugador que no deja nada juega y comparte exactamente igual.

---

## 4. Parlyx diegético: powerups + cartas de dolor

Investigación de El Ídolo 2.0: sumó **cartas de mejora** y un costado RPG — en cada pretemporada elegís qué mejorar para darle tu estilo. Lo adoptamos con nuestra economía:

**4.1 La Tienda (nueva pantalla entre eras, 3 veces por partida: ~1999, ~2011, ~2020).** Comprás con tu caja (o PAT). **Máximo 2 slots por visita** — elegir es la gracia. Catálogo inicial:

| Powerup | Costo | Efecto | Qué revela del jugador |
|---|---|---|---|
| 🤖 **Agentes de Parlyx** (estrella) | 6m runway | +ARR 15%/trienio sin sumar empleados · anula las cartas de "DMs sin responder" | Valora automatizar la atención → lead caliente |
| 🧙 El Mentor | 3m | +1 OVR/trienio, 2 trienios | Busca guía |
| 📣 Agencia de PR | 5m | Duplica chances de premios individuales | Valora la marca personal |
| 🧮 CFO fraccional | 4m | Runway visible con proyección · mejora términos de rondas 5% | Ordenado financiero |
| ⚖️ Estudio de abogados top | 4m | Anula un flag negativo a elección | Aversión al riesgo legal |
| 🎯 Head de Growth mercenario | 7m | ARR +30% ya · TEND -1 | Corto-placista |

El powerup de Parlyx no es un ad: es **la mejor compra del juego** (como corresponde al chiste) y su efecto es literalmente lo que el producto real hace. Si el jugador lo compra, el CTA final se lo recuerda: *"En el juego te funcionó. En la vida real también existe."*

**4.2 Cartas de dolor real (las preguntas de calificación disfrazadas de juego).** 3-4 cartas nuevas que TODO dueño de e-commerce vivió:
- **"Los DMs no paran"** — 200 consultas por día entre Instagram y WhatsApp; la mitad se responde tarde y no compra. → Contratar 2 personas (RW -4m) / Responder vos hasta las 3 AM (OVR -1, TEND -1, tag Pulpo) / Automatizar con agentes (tienda: Parlyx).
- **"El carrito abandonado"**, **"La pregunta de las 3 AM"**, **"Se viene el Hot Sale y no hay equipo"**.
Cómo las responde el jugador alimenta los ejes del perfil. Son máximo 1 por partida para que no se sienta infomercial.

---

## 5. Antisameness I: EL SISTEMA DE ARCOS (guionista oculto)

Diagnóstico del playtest: dos corridas se sintieron iguales — progresás despacito y chau. El momentum genera ruido, no **historia**. Solución: cada seed sortea **un arco dominante** que sesga el sorteo de cartas y el momentum por fases. El jugador nunca ve el nombre del arco; siente la forma de la historia.

| Arco | Prob. | Forma | Qué garantiza |
|---|---|---|---|
| **La Promesa** ("pegarla de joven") | 15% | 🚀 turnos 1-3 momentum cargado + carta de breakout temprano ("Un post viral te trae 10.000 clientes en una semana") | El escalar antes de estar listo: cartas de crisis de crecimiento |
| **El Meteoro** | 10% | Subís rapidísimo, te estrellás en el medio (crash garantizado en turno 4-6), y decidís cómo caer | El drama del screenshot: pico alto + valle profundo |
| **La Travesía del Desierto** | 15% | Turnos 3-6 momentum frenado + cartas de resistencia; si sobrevivís, turnos 7-9 con viento de cola | La remontada — el final más celebrado |
| **El Pase a la Corpo** | 15% | Garantiza la oferta de fichaje ejecutivo (turno 4-7) con condiciones alcanzables | El modo ejecutivo que hoy casi nunca dispara |
| **El Artesano** | 20% | Sin picos: cartas de oficio, clientes, margen; techo sesgado a PyME de oro | La carrera "normal" pero con identidad |
| **La Montaña Rusa** | 15% | Alterna: cada 2-3 turnos invierte el sesgo | Máxima varianza visual en la tabla |
| **Sin arco (caos puro)** | 10% | v0.2 actual | Control del sistema |

Regla: el arco **sesga probabilidades, no dicta resultados** — tus decisiones siguen mandando. Dos partidas con arcos distintos son estructuralmente distintas: eso mata el sameness de raíz.

## 6. Antisameness II: EL RIVAL

Robado con orgullo de El Ídolo (validado por su viralidad): un competidor permanente con el que se disputa toda la carrera. El nuestro:

- Al fundar, el juego genera **tu rival**: nombre + empresa + escudo (del mismo vertical, obvio). Ej.: *"Federico Solá fundó Nexbi el mismo año que vos."*
- Compite en **valuación y ARR** toda la partida (su curva la genera el motor con tu mismo arco invertido — cuando vos sufrís, a él le va bien).
- Aparece en 3-4 **beats**: te gana una ronda ("Nexbi cerró su Serie A. Vos seguís esperando el mail."), te roba un cliente, su exit sale en los diarios, o quiebra antes que vos.
- **Tabla final: vos vs él**, lado a lado. Perderle al rival con dignidad o destrozarlo son los dos mejores screenshots del juego.

## 7. Antisameness III: formatos de carta variables (problema 3)

Basta de lista A/B/C para todo. Seis layouts, elegidos por el tipo de carta:

1. **Lista clásica** (A/B/C) — solo trade-offs de gestión.
2. **Duelo** — dos tarjetones visuales grandes lado a lado (Aceptar/Rechazar) con imagen de fondo y píldoras de efecto, como las decisiones de Copero. Para ofertas y bifurcaciones.
3. **Oferta de camiseta** — 2-3 escudos grandes de gigantes/fondos para elegir (como la oferta de cantera de Copero con tres clubes). Para fichajes y term sheets.
4. **Apuesta** — una sola acción con dial de riesgo visible (65%/35% en grande) y botón "Me la juego" / "Paso".
5. **La Tienda** — grid de powerups con precios.
6. **Flash** — notificación estilo push que cae sobre la pantalla ("Tu rival cerró su ronda 👀") con reacción de un tap. Para beats del rival y micro-eventos.

Con 6 formatos rotando, dos carreras se VEN distintas aunque compartan cartas.

## 8. Early game arreglado (problema 2)

- **Turno 1 (1993) es SIEMPRE "El Origen"** — formato Duelo: *"Tenés un laburo estable y una idea que no te deja dormir."* → Renunciar y a la pileta (runway corto, TEND +2) / Garage de fin de semana (progreso lento, sin riesgo) / Freelancear para financiarte (mitad y mitad).
- **Financiamiento gated:** ninguna carta de term sheets antes del turno 3 Y etapa Seed. En turnos 1-2 solo cartas de origen, producto, primer cliente, equipo fundador.
- La progresión de cartas sigue la vida real: origen → primer cliente → primer empleado → primera ronda. El deck ya tiene las cartas; falta el gating por turno (cambio de elegibilidad, no de contenido).

## 9. LA VITRINA (problema 4 — rediseño de la tarjeta final)

El screenshot tiene que ser un **gabinete de trofeos**, no un resumen de stats. Nueva anatomía de la tarjeta:

1. **Header:** Arquetipo con su escudo + mote ("EL PULPO") como protagonista visual · OVR pico · empresa/emoji.
2. **VITRINA DE COPAS** (SVG propios, nada de emoji): 🏆 diseños únicos por logro — la Copa Unicornio, la Campana de bronce/plata/oro (IPO según resultado), el Salvavidas (casi-muerte), la Copa del Desierto (remontada), el Martillo (echaste al tóxico y sobreviviste). Apilables ×N como Copero.
3. **ESCUDOS** — la fila de camisetas: tu(s) empresa(s) + escudos diseñados de los gigantes donde jugaste. La colección de escudos ES la trayectoria.
4. **PREMIOS INDIVIDUALES** (los balones de oro nuestros): *Founder del Año* (OVR pico 90+), *30 Promesas* (breakout joven), *El Remador de Oro* (sobreviviste 33 años), *Mejor Pitch del Demo Day*, *Tapa de Revista*. Se ganan por eventos + hitos, se muestran como medallas.
5. **VOS vs TU RIVAL** — mini tabla head-to-head.
6. Stats + título del final + footer + seed (igual que v0.2).

**Sala de trofeos persistente:** en producción (web propia), la colección de copas/escudos/premios se guarda en el dispositivo entre partidas → el "una más y completo la vitrina" es el motor de replays de todos estos juegos.

## 10. UI de una pantalla (problema 1)

Layout de juego = grid de `100dvh`, la decisión SIEMPRE above the fold:

```
┌ ticker (26px) ───────────────────────────┐
├ HUD compacto: OVR · Valuación · Runway · │  (una sola fila, 64px)
│ Founder — sin sub-métricas               │
├ Timeline colapsada: tira de chips        │  (44px: ●●●●○○○○○○○ 1993→2026,
│ [tap para expandir tabla completa]       │   chip coloreado por OVR del año)
├ CARTA DEL TURNO                          │  (el resto: año, título, flavor,
│ (formato variable, sección 7)            │   opciones — TODO visible sin scroll)
└──────────────────────────────────────────┘
```

La tabla completa estilo Copero vive: expandida bajo demanda durante el juego, y **siempre completa en la pantalla final** (ahí es donde el screenshot la necesita). Presupuesto: opciones de carta ≤ 3 visibles, flavor ≤ 2 líneas — el copy ya cumple.

## 11. KPIs actualizados

Se mantienen los virales de v0.2 (share ≥15%, K ≥0.4, completion ≥65%) y se agregan los comerciales:

| KPI comercial | Target inicial |
|---|---|
| % partidas terminadas → email (informe) | 8-15% |
| % emails → survey completada | ≥ 50% (la recompensa empuja) |
| Leads score ≥60 (SQL) sobre total leads | ≥ 15% |
| Costo por lead calificado | vs. benchmark de Meta Ads de Parlyx (el juego tiene que ganarle a la pauta) |

Ese último es EL número que justifica el proyecto ante cualquier socio: si el juego genera SQLs más baratos que los ads, se paga solo.

## 12. Cambios técnicos derivados (para cuando se apruebe — NO ejecutar aún)

1. Motor: sistema de arcos (sesgos por fase) + rival (curva espejo) + tags de eje en opciones + powerups como modificadores persistentes.
2. Deck: ~15 cartas nuevas (orígenes, dolor real, beats de rival, breakouts) + tags de eje en las 102 existentes + gating por turno.
3. Front: 6 layouts de carta + layout 100dvh + tienda + vitrina SVG (encargar/generar los assets de copas y escudos: es EL trabajo de arte del proyecto).
4. Backend nuevo mínimo: endpoint de captura de email + integración HubSpot (API) + generación del informe por email (template por arquetipo). Sigue sin backend de gameplay.
5. Recalibrar con simulador: los arcos cambian las distribuciones; correr 20k por arco.

## 13. Riesgos nuevos

| Riesgo | Mitigación |
|---|---|
| El comercial mata la magia (se siente infomercial) | Regla de la sección 0 + máx 1 carta de dolor por partida + powerup Parlyx como MEJOR item del juego, no como banner |
| Datos/privacidad (email + comportamiento) | Consentimiento explícito, política clara, y el perfil siempre en tono de juego |
| Los arcos se sienten guionados ("el juego me odia") | Arcos sesgan, no dictan; el jugador siempre decide; testear percepción en playtest |
| Scope: 6 sistemas nuevos de una | Fasear: v1 = Perfil + Vitrina + Arcos + UI one-screen + early game (lo que arregla el juego). v1.1 = Rival + Tienda + funnel de email (lo que monetiza). Ver §14 |

## 14. Propuesta de fases (para discutir)

- **v1 "El juego que quiero compartir":** arquetipos + vitrina SVG + arcos + formatos de carta + one-screen + origen. Sin captura todavía. Objetivo: que 10 playtesters digan "esto lo comparto".
- **v1.1 "El juego que vende":** rival + tienda/powerups + email/informe + survey + HubSpot. Se lanza público con esto.
- Racional: la máquina comercial solo vale sobre un juego que la gente juega. Primero la magia, después la manguera.

## 15. Decisiones abiertas para Leimus

| # | Decisión | Recomendación |
|---|---|---|
| D8 | ¿Gate solo el informe, o también un ranking global? | Solo el informe en v1.1; ranking (como el nacional de El Ídolo) para v2 — es otro motor de retención pero pide backend |
| D9 | Micro-survey: ¿las 3 preguntas propuestas van? | Sí, con la recompensa del logro; revisar wording juntos |
| D10 | Los 8 arquetipos: ¿nombres y líneas aprobados? | Revisar la lista de §2.2 — acá el copy ES el producto |
| D11 | Fases §14: ¿v1 → v1.1 o todo junto? | v1 → v1.1 (dos semanas de diferencia bien usadas) |
| D7 | Dominio (sigue abierta) | tucarrera.app / carrera.parlyx.ai |
