# SPEC v3 — Legibilidad · Las Tres Sillas · Marcos de Época · Portada
**Basado en playtest con usuarios reales. Manda sobre UI-SPEC v2 donde contradiga (tipografía y densidad). No toca motor económico salvo lo indicado en §2.**

---

# 1. LEGIBILIDAD (el feedback más repetido: "no se lee")

**Diagnóstico:** la densidad Copero se implementó comprimiendo tipografía en vez de comprimiendo aire. Copero tiene filas compactas **con texto grande**. Se corrige subiendo tipografía y creciendo la fila lo necesario: la tabla puede ocupar más alto, la legibilidad no se negocia.

**Escala tipográfica obligatoria (mínimo absoluto: 13px en toda la app, cero excepciones):**

| Elemento | Antes (aprox) | **Ahora** |
|---|---|---|
| Fila de tabla (alto) | 30px | **38px** |
| Chip de año | 11px | **14px** semibold |
| Nombre de marca | 13px | **16px** semibold |
| Número de píldora OVR | 13px | **17px** black |
| Ventas (columna derecha) | 11px | **14px** mono |
| Encabezados de columna | 9px | **11px** + más tracking |
| Título de carta (h2) | 21px | **26px** black |
| Año grande de la carta | 44px | **56px** |
| Flavor de carta | 14px | **17px**, line-height 1.5 |
| Label de opción | 14px | **17px** semibold |
| Consecuencia de opción | 12px | **14.5px** |
| HUD: valores | 14px | **18px** |
| HUD: etiquetas | 9px | **11px** |
| Vitrina: nombre de copa | 10px | **13px** |

**Reglas de contraste:** el gris de texto secundario sube de `#8B93A3` a `#A8B0BE` (ratio ≥ 7:1 sobre `#09090B`). Prohibido texto gris sobre fondo de panel a menos de 4.5:1 — auditar todo con herramienta, no a ojo.

**Consecuencia aceptada:** la tabla de 12 filas pasa de ~360px a ~456px de alto. Se acepta scroll para llegar a las opciones. La tabla completa sigue SIEMPRE visible (regla de v2 intacta), solo que ahora se lee.

---

# 2. LAS TRES SILLAS (garantizar el beat 2020 sin quitar libertad)

**El problema:** un jugador puede retirarse en el turno 5, y entonces nunca vive el momento Parlyx (2020) — que es el corazón del juego y del negocio. Prohibir el retiro es la salida barata y contradice la regla de "ninguna carrera se corta".

**El principio de diseño:** *no importa dónde te sientes, en 2020 el mundo entero se llenó de mensajes.* La avalancha de conversaciones te alcanza en cualquier silla — lo que cambia es **desde dónde la vivís**. Eso convierte una restricción en tres narrativas distintas, y de paso agrega rejugabilidad (tres formas de ver el mismo año).

## 2.1 Las tres sillas

Todo jugador está siempre en una de tres sillas, y las tres llegan a 2026 con contenido propio:

| Silla | Cómo llegás | Qué medís | Cómo vivís 2020 |
|---|---|---|---|
| **A. Fundador** | Default | Ventas, caja, tu parte | Tu marca explota de mensajes (carta actual) |
| **B. Corpo** | Te ficha el gigante / rescate post-quiebra | Cargo, patrimonio | El gigante te pone a resolver la avalancha de TODA la compañía |
| **C. Ángel / Playa** | Retiro (vendiste o te cansaste) | Patrimonio, tu portfolio | **Tu ahijado te llama** (ver §2.3) |

## 2.2 El retiro deja de ser "salir del juego"

Hoy el retiro es una sala de espera con cartas de estilo de vida. Pasa a ser un **rol activo: el Ángel**.
- Al retirarte, elegís **en qué invertir tu plata**: 1-3 marcas chicas de otros rubros (generadas por el motor, con nombre y logo). Ese es tu portfolio y crece o se hunde con tus consejos.
- Tus cartas ahora son de **consejo**: los founders de tu portfolio te consultan y vos decidís qué recomendarles. Mismo formato de decisión, otra voz.
- Tu patrimonio depende de cómo les va a ellos. Podés fundirte igual (regla vigente).
- **Se elimina la sala de espera:** ningún trienio en modo playa es pasivo.

## 2.3 El beat 2020 en cada silla (garantizado por estructura)

La carta de 2020 es **ancla obligatoria en las tres sillas** — cambia el texto, no la estructura:

- **Silla A (Fundador):** la actual. 500 mensajes en una hora, tu marca. → Responder vos / contratar / 🤖 activar Parlyx.
- **Silla B (Corpo):** *"El gigante recibe 40.000 consultas por día y el call center colapsó. Te toca a vos resolverlo."* → Tercerizar a un BPO / contratar 200 personas / 🤖 llevar Parlyx a la compañía. (Si lo elegís: impacto ×escala corporativa en tu carrera — asciende tu cargo.)
- **Silla C (Ángel/Playa):** *"Te llama el pibe al que le pusiste plata. Está ahogado: 900 mensajes sin responder y el stock volando."* → Decile que contrate / metele más plata / 🤖 recomendale Parlyx. (Si lo recomendás: la marca de tu portfolio despega y tu patrimonio sube — vos ganás por el consejo.)

**Consecuencia clave para el lead magnet:** el 100% de las partidas ve el momento Parlyx, sin forzar a nadie a nada. Y el bloque IMPACTO de la tarjeta final se adapta a la silla ("tu marca" / "la compañía" / "las marcas que asesoraste").

## 2.4 Gate mínimo de retiro (suave, no prohibitivo)

- El retiro sigue exigiendo el patrimonio mínimo ya definido, y se agrega: **no disponible antes del turno 4** (1993-1999 sos joven; retirarse a los 3 años no es una historia, es un bug).
- Si el jugador insiste en retirarse temprano y cumple el gate: adelante — la silla C tiene contenido propio desde el turno 4 y llega a 2026 completa.

## 2.5 Verificación en simulador
- **100%** de las partidas (10k corridas) alcanzan el año 2020 con la carta de Parlyx disponible en alguna de las tres sillas. Test de CI: si alguna partida no ve el beat, falla el build.
- Distribución objetivo de sillas al llegar a 2020: Fundador 65-75% · Corpo 12-20% · Ángel 10-18%.
- La regla de oro sigue: activar Parlyx óptimo en 60-70% de contextos, no en el 100%.

---

# 3. MARCOS DE ÉPOCA (la idea del owner — el juego se ve como se veía el mundo)

**Concepto:** la carta de decisión se renderiza con la estética del medio por el que uno se enteraba de las cosas en cada era. No es decoración: es el reloj narrativo del juego, y refuerza que estamos contando la historia del comercio.

| Era | Marco | Cómo se ve la carta |
|---|---|---|
| **1993-1998** | 📰 **Diario** | Papel apenas texturado (crema/gris muy oscuro), tipografía **serif** para el titular, filete de columna, fecha en cabecera de sección, subtítulo en cursiva. Se siente recorte de diario. |
| **1999-2007** | 🖥️ **Monitor CRT** | Ventana con chrome de sistema operativo viejo (barra de título con botones cuadrados), esquinas rectas, scanline muy sutil (opacidad ≤4%), tipografía sans compacta. Verde fósforo permitido solo en acentos. |
| **2008-2013** | 💻 **Laptop / navegador** | Barra de navegador con pestaña y URL ficticia (`tumarca.com.ar/2011`), esquinas redondeadas suaves, sombra plana. Look web 2.0 limpio. |
| **2014-2020** | 📱 **Celular / app** | Carta como tarjeta de app moderna, con barra de estado arriba (hora, señal, batería) y el título como notificación push. Aquí encaja perfecto el beat de los DMs. |
| **2021-2026** | 💬 **Chat / DM** | La carta se presenta como conversación: el evento entra como burbuja de mensaje entrante, las opciones son burbujas de respuesta. (Es el formato donde vive Parlyx — cierre poético.) |

**Reglas de implementación:**
- El marco envuelve SOLO la carta de decisión, nunca el HUD ni la tabla (que mantienen su identidad bursátil constante — es lo que unifica todo).
- **Transición de era:** al entrar a una nueva, un beat de 900ms — el marco anterior se desvanece/apaga y aparece el nuevo con un cartel discreto (*"1999 · llegó internet"*). Es un micro-momento memorable, y de los que se comparten.
- Costo: CSS + un SVG chico por marco. Cero imágenes pesadas. Presupuesto: +40KB máximo total.
- Accesibilidad: los efectos de textura/scanline se apagan con `prefers-reduced-motion` y nunca bajan el contraste del texto por debajo de lo exigido en §1.
- El ticker superior también evoluciona: en era diario es una **cinta de cotizaciones impresa**; en CRT, texto monoespaciado verde; de 2008 en adelante, el ticker actual.

---

# 4. PORTADA NUEVA (hoy: "muy fea, sin diseño")

**Diagnóstico:** la portada actual es texto centrado sobre negro, sin jerarquía visual ni imagen. No comunica que adentro hay un juego lindo.

**Estructura (mobile-first, todo en una pantalla sin scroll):**

1. **Marco de diario a pantalla completa** — la portada ES la tapa del diario de 1993. Cabecera con el nombre del juego en serif display grande, filete doble, y una línea de fecha: *"Buenos Aires · 1993 · Edición del fundador"*.
2. **El titular** (el gancho, en serif enorme, 2 líneas máximo):
   > **"El 27% quiebra.**
   > **El 3% toca la campana."**
   y debajo, en display sans, grande: **¿VOS?**
3. **Bajada corta:** *"33 años de comercio argentino. 11 decisiones. Una marca: la tuya."*
4. **Una pieza visual** (la que falta hoy): mini-preview animado de una tabla de carrera llenándose sola en loop (4-5 filas, píldoras de OVR cambiando). Muestra el producto en 3 segundos sin explicar nada. Es lo que engancha.
5. **CTA principal grande:** `Fundar mi marca →` (botón blanco, alto 56px, sombra).
6. **CTA secundario discreto:** "¿Te retaron? Pegá el código" (input colapsado, se abre al tocar).
7. **Pie:** "un juego de **Parlyx AI**" con el link.
8. Al tocar el CTA: transición de la tapa del diario **abriéndose** hacia el setup (900ms, la página se dobla/desvanece). Es el primer "wow" del juego y cuesta poco.

**Prohibido:** emojis sueltos como decoración, íconos genéricos de librería, texto plano centrado sin marco. Todo lo visual sale del universo diario/comercio.

---

# 5. Entrega esperada

- Screenshots a 390px de: portada nueva · una carta en cada uno de los 5 marcos de época · la tabla con la tipografía nueva · el beat 2020 en las tres sillas (fundador, corpo, ángel).
- Reporte de sim: 100% de partidas alcanzan el beat Parlyx · distribución de sillas · regla de oro 60-70% intacta · golden actualizado.
- Auditoría de contraste (ratios) y confirmación de que ningún texto quedó bajo 13px.
