# SPEC v4 — MISTERIO Y VARIANTES
**Ronda de flujo, no de diseño visual. Dos sistemas: (1) regla de información — costos visibles, resultados ocultos; (2) variantes por turno — cada decisión sale de un pool, no es fija. No toca UI ni motor económico.**

---

# 1. LA REGLA DE INFORMACIÓN

**Problema:** hoy las opciones anuncian el resultado ("OVR +1 (disciplina)", "ventas +25%") y el jugador sabe cuál es la buena antes de elegir. Sin misterio no hay decisión: hay lectura de etiquetas.

**Trampa a evitar:** esconder todo tampoco sirve — clickear a ciegas no es decidir, es tirar dados, y sin costo visible el jugador no siente que arriesga.

**La regla (aplicar a TODAS las cartas):**

> **Se muestra lo que PAGÁS (el costo, siempre). Se esconde lo que GANÁS (el resultado, siempre).**

El costo es un contrato con el jugador; el resultado es el juego. Excepción única: las cartas de apuesta explícita conservan sus porcentajes (`55% / 45%`) — ahí el riesgo declarado ES la mecánica y funciona bien.

## 1.1 Traducción concreta

| Hoy (spoiler) | **Ahora** |
|---|---|
| `OVR +1 (disciplina) · te ordena el futuro si terminás ganando plata` | `sin ceder nada · el camino largo` |
| `+12 meses de caja · cedés el 12% de tu empresa` | `+12 meses de caja · cedés el 12% de tu empresa` ✅ (costo puro, se queda igual) |
| `ventas +25% este tramo` | `una apuesta al nombre de la marca` |
| `2 meses menos de caja · ventas +15% · el mapa se agranda` | `2 meses menos de caja · el mapa se agranda` |
| `1 mes menos de caja · el catálogo se agranda para el futuro` | `1 mes menos de caja · pensando en el catálogo de mañana` |
| `sin cambios · la puerta no siempre vuelve a abrirse` | ✅ se queda (no promete nada, insinúa riesgo) |

**Guía de escritura para la línea de cada opción:**
1. Primero el costo duro si existe (meses de caja, % que cedés, plata) — literal y numérico.
2. Después una frase de **carácter**, no de resultado: qué tipo de jugada es (segura, agresiva, lenta, de fe), en lenguaje de negocio, sin números de beneficio.
3. **Prohibido:** cualquier número de resultado (OVR, ventas %, equipo) y cualquier adjetivo que ordene las opciones ("lo mejor", "recomendado", "la sólida").

## 1.2 Ninguna opción dominada
Cada opción tiene que ser defendible por alguien. Test de escritura: si un jugador experto elige siempre la misma sin pensar, la carta está mal escrita. En cada carta debe haber al menos una opción que sea mejor **según el contexto** (caja baja, era mala, arquetipo) y no en abstracto. Auditar las 102 + las nuevas con este criterio.

## 1.3 Varianza oculta en cartas "determinísticas"
Hoy una carta sin % da siempre exactamente lo mismo → se memoriza en dos partidas. Cambio: todo efecto oculto se resuelve con una **varianza silenciosa de ±35%** alrededor de su valor base (y en el 12% de los casos, un resultado "de cola": bastante mejor o bastante peor, con su propio texto de reveal). El jugador nunca ve el dado; ve que la misma decisión no siempre rinde igual — como en la vida.

## 1.4 El reveal ES el aprendizaje
Al elegir, el resultado se muestra en una línea clara y concreta: *"Bootstrap: cerraste el trienio sin deuda. Tu equipo aprendió a hacer más con menos."* / *"El pedido de Brasil te comió la caja y llegaste tarde."*
- Ese texto es donde el jugador aprende el sistema. Escribir los reveals con el mismo cariño que los flavors: son la mitad del contenido.
- Efectos de largo plazo (lo que hoy es TEND): NO se anuncian antes ni se etiquetan después con jerga. Se sienten en los trienios siguientes y, si conviene, el reveal lo insinúa ("esto se va a notar más adelante").

---

# 2. VARIANTES POR TURNO (rejugabilidad exponencial)

**Problema:** las 11 decisiones son casi siempre las mismas cartas en el mismo orden. Dos partidas se sienten iguales.

**Solución:** cada uno de los 11 turnos tiene un **pool temático de 4-6 cartas candidatas**; la seed elige una. Mismo momento narrativo, historia distinta.

## 2.1 Matemática (para dimensionar el impacto)
Con 4 candidatas por turno y 11 turnos: **4¹¹ ≈ 4,2 millones de combinaciones**. Sumado a arcos, techo oculto y varianza, la probabilidad de que dos partidas se parezcan es despreciable. Con 5-6 candidatas en los turnos centrales, mejor todavía.

## 2.2 Pools por turno (temática fija, contenido variable)

| Turno | Tema del slot | Ejemplos de candidatas (≥4 cada uno) |
|---|---|---|
| 1993 | El origen | Renunciar y abrir el local · El galpón del tío · Empezar vendiendo lo de otro · La feria americana · Heredás el negocio familiar |
| 1996 | Primer crecimiento | Primer empleado · Primer cliente grande · El proveedor exclusivo · Segunda sucursal · La marca propia |
| 1999 | Internet aparece | ¿Página web? · El sobrino que sabe de computadoras · Catálogo por email · Vender en un portal · Ignorar internet |
| 2002 | La crisis | El país se cae · El proveedor te deja · Precios que cambian cada día · Trueque y clientes viejos · Exportar por necesidad |
| 2005 | Profesionalizar | Contador y papeles · Primer gerente · El local nuevo · Sistema de stock · El socio que aparece |
| 2008 | El golpe global | Crisis mundial · El pedido de Brasil · El competidor barato · Se acabó el stock · El cliente que no paga |
| 2011 | Todo en el bolsillo | Tu web no se ve en el celu · Vender por redes · La app que te ofrecen · El delivery propio · La primera campaña paga |
| 2014 | Marketplace | ¿Entrás al gigante o defendés tu tienda? · Comisiones que suben · Un vendedor te copia · Logística tercerizada · Hot Sale |
| 2017 | La era social | El influencer · Los DMs empiezan · La reseña de una estrella · La comunidad · Ads cada vez más caros |
| **2020** | **La avalancha** | **ANCLA FIJA** (las tres sillas del SPEC v3) — con 2-3 variantes de texto según rubro |
| 2023 | El tiempo recuperado | El tiempo que recuperaste (si activó Parlyx) · La competencia automatizó · Vender la marca · Franquiciar · El hijo quiere entrar |

**Necesidad de contenido: ~35-40 cartas nuevas** para llenar los pools. Reutilizar y reasignar las existentes donde encajen; el deck actual ya cubre buena parte.

## 2.3 Reglas del sorteo
- La seed elige la candidata de cada slot al iniciar la partida (determinístico: el desafío por seed sigue funcionando).
- **El arco sesga la elección**: si el arco es "La Promesa", el slot 1996 favorece candidatas de crecimiento explosivo; si es "Travesía del Desierto", favorece las de resistencia.
- **Anti-repetición local:** guardar los ids de las últimas 2 partidas en el dispositivo y despriorizar (no prohibir) esas candidatas. La segunda partida tiene que sentirse nueva sí o sí.
- El rubro elegido (moda/deco/mate/tecno/belleza/alimentos) también sesga: cada slot debería tener al menos una candidata con sabor de rubro.

## 2.4 Test de cobertura (CI)
- Correr 200 partidas y verificar: ninguna carta aparece en >35% de las partidas; todo slot tiene ≥4 candidatas elegibles en el 95% de las configuraciones (rubro × arco × capital); dos partidas consecutivas con seeds distintas comparten ≤3 cartas de 11.
- El reporte de sim debe listar frecuencia de aparición por carta — si alguna está en 60%, el pool de ese slot está mal armado.

---

# 3. DIARIO DE APRENDIZAJES (lo que hace justa la información oculta)

Si escondemos resultados, hay que premiar la experiencia. Al terminar cada partida, se desbloquean 1-3 **aprendizajes** basados en lo que viviste, y quedan guardados en el dispositivo:
> *"Ahora sabés: firmar exclusividad con un cliente grande te ata las manos cuando el mercado cambia."*
> *"Ahora sabés: en año de crisis, ceder equity sale carísimo."*

- Se acumulan en una sección "Lo que aprendiste" junto a la vitrina (Zeigarnik otra vez: 6/24 aprendizajes).
- Efecto psicológico: convierte la información oculta de frustración en **progresión entre partidas** — la razón honesta para jugar la tercera.
- Cero mecánica de ventaja: son conocimiento del jugador, no bonus. El juego no se vuelve más fácil; el jugador se vuelve mejor.

---

# 4. Entrega esperada
- Auditoría de las cartas existentes con la regla del §1 (listado de las que se reescribieron).
- ~35-40 cartas nuevas para completar pools, con reveals escritos.
- Reporte de cobertura del §2.4 + golden actualizado.
- Screenshots: la misma decisión (turno 1996) en tres seeds distintas, mostrando tres cartas diferentes; y una opción antes/después de aplicar la regla de información.
