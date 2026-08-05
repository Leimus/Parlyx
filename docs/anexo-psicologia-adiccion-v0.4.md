# Anexo al PRD — Psicología de la adicción y la viralidad
**v0.4 · 05-ago-2026 · Complementa el PRD v0.3 con los ajustes de Leimus: sin Rival, mote acompaña a la tabla, captura = solo email. Manda la consigna: más simplicidad, más elegancia, más adicción.**

---

## 0. Recortes aprobados (simplicidad primero)

| Se va / se achica | Por qué | Qué lo reemplaza |
|---|---|---|
| ❌ El Rival (NPC) | No convenció; agrega sistema y ruido | **El desafío por seed contra gente real** (§3) — tu rival es tu amigo, no un bot |
| ❌ Micro-survey en el juego | Fricción; alcanza con el email | Las 2 preguntas van DESPUÉS, en el mail del informe |
| 6 formatos de carta → **4** | Elegancia | Lista · Duelo · Apuesta · Tienda |
| Tienda de 6 items → **4** | Elegir entre 4 ya es elegir | Parlyx 🤖 · Mentor · PR · CFO |
| Captura | — | **Un solo campo de email al final**, opcional, con el informe como premio. Punto. |

Lo que queda es un juego con 5 sistemas: motor + arcos + arquetipos + vitrina + tienda. Nada más entra en v1.

---

## 1. Los siete principios psicológicos y su traducción EXACTA al juego

### 1.1 Recompensa variable (la palanca de Skinner)
El cerebro se engancha cuando la recompensa es incierta, no cuando es buena. Nuestra palanca es **el reveal de cada decisión**, y hoy es demasiado seco.
- **Micro-suspenso:** entre el tap y el resultado, 500-700ms de tensión visual (el borde de la opción pulsa, el ticker se congela) — el ritual de "abrir el sobre".
- **Críticos (nuevo):** el 5% de las apuestas ganadas salen **doradas**: efecto ×2 con destello y sonido propio. "Me salió una dorada" es lenguaje de tragamonedas y de FIFA — y es exactamente el recuerdo que hace volver.
- Regla de elegancia: el crítico existe solo en apuestas ganadas. Nunca hay "crítico malo" — la casa castiga con probabilidad visible, no con traición.

### 1.2 El casi-logro (near-miss)
Los estudios de máquinas tragamonedas son unánimes: **casi ganar activa más ganas de volver a jugar que ganar.** Hoy nuestras quiebras terminan y chau. Cambio:
- Toda carrera termina mostrando **la línea del casi**: *"Te quedaste a 2 turnos del unicornio"* · *"Tu pico estuvo a 14% del IPO"* · *"Con una decisión distinta en 2008, esta historia era otra"* (el motor sabe cuál fue tu punto de quiebre: lo señala).
- La línea del casi va en la pantalla final **arriba del botón "Otra carrera"**. Es el anzuelo del replay inmediato.

### 1.3 Tarea incompleta (Zeigarnik) + progreso regalado
El cerebro no suelta lo que quedó abierto. Ya lo usamos sin saberlo (la tabla esqueleto con filas vacías). Profundización:
- **La vitrina muestra las copas que NO ganaste, en silueta gris.** Terminás tu primera partida y ves: "Vitrina 3/12". Los 9 huecos son 9 razones para volver. (Colección persistente en el dispositivo — producción, no artifact.)
- Los **arquetipos también se coleccionan**: "Fuiste El Pulpo. Te faltan 7 formas de fundar." Cada arquetipo nuevo desbloqueado se marca — y sacar los 8 exige jugar distinto, no solo jugar más. Eso es rejugabilidad de diseño, no de grind.

### 1.4 Pico y final (Kahneman): la partida se recuerda por dos momentos
- **El pico garantizado:** el sistema de arcos ya lo asegura (cada carrera tiene su momento firma). Puesta en escena: ese beat rompe el layout — pantalla completa, año gigante, un solo tap. El jugador tiene que PODER contar su partida en una frase ("me explotó el producto en el 99 y el 2001 me lo llevó puesto").
- **El final es una ceremonia, nunca un corte** (la queja fundacional del playtest 1). Secuencia de cierre en 3 beats, ~4 segundos total:
  1. La tabla se completa en cascada (fila por fila, 90ms).
  2. Las copas caen una a una a la vitrina (con peso, con sonido).
  3. **El mote se estampa como sello** sobre la esquina de la tarjeta — acompaña a la tabla, no la tapa (ajuste pedido: la tabla de carrera sigue siendo la protagonista del screenshot; el mote es la firma).

### 1.5 Aversión a la pérdida
Perder duele el doble de lo que gana ganar — y el engagement vive en el dolor. Auditoría del deck con esta regla: **~40% de las cartas deben amenazar algo que ya tenés** (tu equity, tu cofounder, tu cliente grande, tu reputación), no ofrecer algo nuevo. Defender se siente más urgente que conquistar. El deck actual está 70/30 al revés → rebalancear tags en F1.5, sin escribir cartas nuevas.

### 1.6 Curiosity gap + prueba social (el copy de arranque)
El landing no describe el juego: **abre una pregunta que solo se cierra jugando.** Y tenemos un arma que nadie más tiene — los números reales de nuestro propio simulador:

> # El 27% quiebra.
> # El 3% toca la campana.
> # ¿Vos?
> 33 años de startup. 11 decisiones. Una carrera que es toda tuya.
> **[ Fundar mi empresa → ]**

Por qué funciona: números concretos = credibilidad + prueba social implícita ("miles jugaron"); el "¿Vos?" es desafío directo a la identidad; y el botón no dice "jugar" — dice **"Fundar mi empresa"**, que ya es rol. (Los porcentajes se actualizan con datos reales post-launch: "basado en X carreras jugadas" — el copy mejora solo.)

### 1.7 Moneda social (por qué la gente comparte)
La gente comparte lo que la define o la hace ver bien. El share tiene que hablar en **primera persona con desafío incluido**, pre-armado:
> *"Toqué la campana en 2014 y me fundí en 2022 🔔📉. Dice que soy El Apostador. ¿La sacás mejor que yo? [link con mi seed]"*

El desafío por seed convierte a cada share en una invitación 1-a-1 — y ese es el reemplazo elegante del Rival: **tu rival es la persona que te compartió el link.** Cero sistemas nuevos, máxima pica real.

---

## 2. El motor de "no puedo parar": eliminar todo punto de pausa

El "una más" no es magia, es fricción cero en el loop de reinicio:
- La pantalla final tiene UN botón grande: **"Otra carrera"**. Un tap → nueva partida con tu misma empresa/identidad ("misma empresa, otra vida") — el setup completo solo si lo pedís.
- Precarga de la siguiente carta durante el reveal de la actual. Ninguna espera > 300ms.
- Todos los taps en la zona del pulgar. El pulgar nunca viaja arriba.
- Sesión objetivo: primera partida ≤ 6 min, segunda ≤ 4 (setup salteado). El pico de adicción es la **tercera** partida: ahí ya entendiste el sistema y querés dominarlo — todo el diseño empuja a que la tercera empiece.

---

## 3. LA SEED DEL DÍA (la idea grande de este anexo)

El mecanismo que convirtió a Wordle en fenómeno mundial tiene tres piezas: **una sola partida diaria igual para todos + resultado comparable + share compacto que intriga sin spoilear.** Nosotros lo podemos hacer sin un solo servidor:

- **"La Carrera del Día":** la fecha genera la seed (determinística). Todo el mundo juega HOY la misma historia: mismos eventos, mismos outcomes de apuestas. **Gana el que decide mejor** — es comparación pura de criterio, la conversación perfecta para el Twitter de negocios ("¿tomaste el cheque del fondo japonés o no?").
- **El share formato Wordle:** compacto, intrigante, cero spoiler:

```
Tu Carrera #34 🔔
🟩🟩🟨🟥🟨🟩🟩🟩🟨🟩🟩
OVR 84 · El Timonel
tucarrera.app
```
  (un cuadrado por turno según momentum: verde subiste, amarillo aguantaste, rojo caíste — la forma de TU historia en 11 emojis.)
- **Efecto psicológico triple:** escasez (una por día → hábito), FOMO (todos hablan de LA misma carrera), y racha ("jugaste 5 días seguidos" — contador local).
- Costo de implementación: casi cero — es una seed fija + un share text. **Relación impacto/esfuerzo más alta de todo el proyecto.**
- La carrera libre (seed random) sigue existiendo al lado, siempre.

---

## 4. Qué mide que esto funciona (KPIs de adicción)

| Métrica | Target | Por qué |
|---|---|---|
| Partidas por sesión | ≥ 2.5 | El "una más" funciona |
| % que juega una 3ª partida | ≥ 35% | El pico de adicción (§2) |
| % de shares con seed-desafío clickeados | ≥ 25% de los shares | El rival humano funciona |
| Jugadores de la Seed del Día que vuelven al día siguiente | ≥ 30% | El hábito Wordle prende |
| Vitrina: % que desbloquea 2º arquetipo | ≥ 20% | La colección tira |

---

## 5. Cambios concretos al backlog (cuando se apruebe — sigue frenado el desarrollo)

**Entra a v1:** críticos dorados · línea del casi · vitrina con siluetas + colección de arquetipos · ceremonia final de 3 beats · copy de arranque nuevo · botón "Otra carrera" 1-tap · share primera persona con seed · rebalanceo 40% cartas de pérdida.
**Entra a v1.1:** Seed del Día + share Wordle + racha local · email/informe · tienda.
**Sale del backlog:** Rival NPC · micro-survey in-game · 2 formatos de carta.

---

*Nota final de diseño: todos los mecanismos de este anexo son de "adicción honesta" — recompensa por jugar bien, colección por jugar distinto, hábito por ritual compartido. Sin timers artificiales, sin energía que se agota, sin pagar por seguir. El juego respeta al jugador; por eso el jugador lo recomienda.*
