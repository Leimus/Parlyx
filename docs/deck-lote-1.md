# Tu Carrera Emprendedora — Deck de cartas · Lote 1 (47 cartas)
**F1 · v0.1** · Para revisión de Leimus: tono (voseo), números de balanceo, y marcar cartas flojas para reescribir.

---

## Cómo leer las cartas

**Notación de efectos:**
- `OVR ±N` → puntos de OVR inmediatos
- `TEND ±N` → tendencia: carga los dados del momentum de los próximos 1-2 trienios
- `RW ±Nm` → runway en meses
- `EQ -N%` → equity que cedés (dilución)
- `ARR ±N%` → modificador de crecimiento del trienio
- `PAT ±N` → patrimonio personal en USD
- `⚑ flag` → marca que habilita/modifica cartas futuras
- Apuestas: `%: resultado bueno / %: resultado malo` (píldoras verde/roja en UI)

**Estructura:** `ID · "Título" · Tipo · Elegibilidad · TE PASÓ (si aplica)` → flavor → opciones.

---

# BLOQUE 1 — CARTAS MACRO (15)
*Pool histórico. Por partida se sortean 1-3 como decisión; el resto solo se siente en el ambiente (clima/múltiplos). Peso de sorteo ×2 si matchea tu vertical/HQ (badge TE PASÓ).*

---

**M-01 · "La fiesta de fin de milenio"** · T4 · Ventana 1996-1999 · TE PASÓ: todos
*Cualquier cosa que termine en punto-com levanta plata. La tuya también.*
- **A. Levantar todo lo que den** → RW +30m · EQ -20% · ⚑ sobrecapitalizado (si cae M-02: efectos negativos ×1.5)
- **B. Levantar lo justo** → RW +14m · EQ -10%
- **C. Guardar la ropa** → OVR +1 (disciplina) · TEND +1 si sobrevivís el trienio

**M-02 · "Se pinchó"** · T4 · Ventana 2000-2002 · TE PASÓ: todos
*El índice tech perdió la mitad en meses. Tus mails a inversores rebotan solos.*
- **A. Hibernar** → RW +6m (recortás todo) · OVR -1 · TEND -1
- **B. Comprar competidores muertos** → RW -8m · 55%: ARR +40%, TEND +2 / 45%: OVR -2
- **C. Seguir como si nada** → 30%: zafás, OVR +2 / 70%: ✝ casi-muerte, RW -12m

**M-03 · "El país se cae a pedazos"** · T4 · Ventana 2000-2002 · TE PASÓ: HQ Buenos Aires
*Corralito, cinco presidentes, la calle prendida fuego. Tus clientes locales no pueden ni pagarte.*
- **A. Facturar afuera ya** → RW -4m · TEND +2 · ⚑ dolarizado
- **B. Aguantar con los clientes de siempre** → ARR -30% · OVR +1 (lealtad, se acuerdan)
- **C. Mudar el HQ a Miami** → RW -6m · EQ -2% (gastos) · cambia HQ · TEND +1

**M-04 · "Un teléfono sin teclas"** · T4 · Ventana 2005-2008 · TE PASÓ: consumer/gaming
*Lo presentó un tipo de jean y polera negra. Tu producto quedó viejo en 40 minutos.*
- **A. Apostar todo a mobile** → RW -6m · 60%: TEND +2, ARR +30% / 40%: OVR -1
- **B. Esperar a ver si prende** → sin cambios · si tu vertical es consumer: TEND -1
- **C. "Es una moda"** → OVR -2 · TEND -1 (la frase te persigue)

**M-05 · "Cayó un banco de 160 años"** · T4 · Ventana 2008-2009 · TE PASÓ: fintech
*Crisis financiera global. La palabra "riesgo" volvió a estar mal vista.*
- **A. Recortar y aguantar** → RW +5m · OVR -1
- **B. Salir a vender confianza** → RW -3m · 55%: ARR +25%, OVR +1 / 45%: sin efecto
- **C. Levantar en la mala** → solo aparece si OVR ≥ 75 → EQ -22% · RW +18m · TEND +1

**M-06 · "Una computadora en cada bolsillo"** · T4 · Ventana 2011-2014 · TE PASÓ: consumer/marketplace
*Todo el mundo mira para abajo en el bondi. Ahí está tu mercado.*
- **A. App first, todo de vuelta** → RW -5m · TEND +2
- **B. Versión mobile "para cumplir"** → ARR +10% · TEND -1 (deuda técnica)
- **C. Seguir en la web** → sin cambios · si consumer: ARR -20%

**M-07 · "La palabra de los mil millones"** · T4 · Ventana 2014-2017 · TE PASÓ: todos
*Inventaron un nombre para las startups que valen mil millones. Ahora todos quieren ser eso.*
- **A. Subirse al relato unicornio** → EQ -18% · RW +20m · TEND +1 · ⚑ presión_growth
- **B. "Nosotros vamos a rentabilidad"** → OVR +1 · múltiplo -20% este trienio
- **C. Ni idea, seguir laburando** → sin cambios

**M-08 · "La región se despierta"** · T4 · Ventana 2014-2017 · TE PASÓ: HQ LATAM
*Los diarios de afuera descubrieron que acá también se fundan empresas. Llegan fondos de turismo.*
- **A. Girar el pitch a 'la oportunidad LATAM'** → EQ -15% · RW +16m
- **B. Aliarte con el unicornio criollo** → ARR +25% · ⚑ aliado_gigante (habilita EJ-02 con mejores términos)
- **C. Seguir en la tuya** → sin cambios

**M-09 · "Monedas mágicas de internet"** · T4 · Ventana 2017-2020 · TE PASÓ: crypto (bendición) / resto (tentación)
*Tu primo duplicó la plata en tres meses. Tu directorio pregunta si "tenemos estrategia blockchain".*
- **A. Pivotear el pitch a crypto** → 40%: valuación ×2 este trienio, TEND +1 / 60%: OVR -2, ⚑ manchado_crypto
- **B. Tomar pago en cripto "por si acaso"** → 50%: PAT +500K / 50%: PAT 0 (si no hay PAT, sin efecto)
- **C. Ni loco** → OVR +1 si después cae M-10 en la partida

**M-10 · "Invierno cripto"** · T4 · Ventana 2018-2020 · TE PASÓ: crypto
*Todo lo que subía bajó. Los gurúes borran tuits.*
- **A. Sobrevivir el invierno** → solo crypto → RW -8m · TEND +2 si sobrevivís (los que quedan se llevan todo)
- **B. Pivotear a "web3 enterprise"** → 45%: ARR +30% / 55%: OVR -2
- **C. Cerrar el experimento cripto** → OVR +1 (foco) · TEND +1

**M-11 · "El fondo japonés"** · T4 · Ventana 2017-2020 · TE PASÓ: HQ LATAM
*Un fondo gigante desembarcó en la región con la billetera abierta. Reparte cheques de nueve cifras.*
- **A. Tomar el cheque grande** → RW +30m · EQ -25% · ⚑ presión_growth · TEND +1
- **B. Usar la oferta para mejorar otra** → EQ -15% · RW +18m
- **C. Rechazar (y tuitearlo)** → OVR +2 (personaje) · 30%: TEND -1 (te la guardan)

**M-12 · "El mundo se encierra"** · T4 · Ventana 2020 · TE PASÓ: e-commerce
*Marzo: se cae todo. Septiembre: tu categoría explota. El mismo año.*
- **A. Recortar en marzo, contratar en agosto** → OVR +2 · TEND +2 (timing perfecto)
- **B. Pánico y layoffs profundos** → ↓ · RW +8m · TEND -1 (después no llegás a la demanda)
- **C. Aguantar sin tocar nada** → 60%: ARR +50% / 40%: RW -10m

**M-13 · "La plata era gratis"** · T4 · Ventana 2020-2023 · TE PASÓ: todos
*Te ofrecen cien veces lo que vendés, ofertas de inversión en 48 horas, todos contratan a todos. Nada de esto es normal.*
- **A. Levantar a valuación absurda** → RW +36m · EQ -12% (dilución baja: el múltiplo te protege) · ⚑ valuación_inflada (si cae M-14: down round forzado)
- **B. Levantar razonable** → RW +18m · EQ -12%
- **C. Vender la empresa en el pico** → habilita final Exit con múltiplo ×1.5 (la salida del sabio)

**M-14 · "Subieron las tasas"** · T4 · Ventana 2022-2023 · TE PASÓ: todos
*La plata dejó de ser gratis de un día para el otro. El growth pasó de moda; ahora la moda es "eficiencia".*
- **A. Layoffs quirúrgicos ya** → ↓ · RW +10m · OVR -1
- **B. Down round y a seguir** → ↓ · EQ -15% · RW +14m · si ⚑ valuación_inflada: EQ -22%
- **C. Cortar todo menos el producto** → ARR -15% · TEND +2 (salís más fuerte)

**M-15 · "Un chatbot que escribe solo"** · T4 · Ventana 2023-2026 · TE PASÓ: AI (bendición) / resto (amenaza)
*Salió a fin de año y en dos meses lo usa todo el mundo. Tu producto ahora es "pre-AI".*
- **A. Reconstruir el producto sobre AI** → RW -8m · 65%: múltiplo AI (×2.5), TEND +2 / 35%: OVR -2 (demo que no anda)
- **B. Chapa de "AI-powered" y a vender** → ARR +20% · 40%: OVR -2 si te descubren
- **C. "Lo nuestro es distinto"** → si vertical ≠ AI: TEND -2 · múltiplo -30%

---

# BLOQUE 2 — MODO EJECUTIVO (12)
*D6: las empresas son los clubes. Entrada, vida corporativa y salida del modo ejecutivo.*

---

**EJ-01 · "Te vienen a buscar"** · T9 reactiva · Elegibilidad: OVR ≥ 80, modo founder
*El gigante del e-commerce regional quiere que armes su nueva unidad. Número fuerte, oficina con vista.*
- **A. Fichar como VP** → entra modo ejecutivo · Cargo #5 · PAT +800K/trienio · tu startup queda con CEO contratado (ARR -20%, seguís con tu equity)
- **B. Usar la oferta para negociar con tu directorio** → PAT +300K (te suben el sueldo) · TEND +1
- **C. Rechazar en silencio** → sin cambios

**EJ-02 · "Te compran y te quedás"** · T9 · Trigger: aceptaste una adquisición
*Firmaste el exit. Parte del precio es que te quedes dos años "de transición". Todos saben cómo termina eso.*
- **A. Quedarte y jugarla en serio** → entra modo ejecutivo · Cargo #4 · PAT según exit · ⚑ earnout (si te vas antes: PAT -30%)
- **B. Cumplir la transición mirando el reloj** → modo ejecutivo · TEND -1 · salida garantizada en 1 trienio
- **C. Negociar irte ya** → PAT -20% del exit · volvés a modo founder libre

**EJ-03 · "El rescate"** · T9 · Trigger: quiebra digna
*Tu empresa no llegó. Pero el buscador vio cómo la peleaste y te ofrece dirigir producto en la región.*
- **A. Aceptar y reconstruirte** → entra modo ejecutivo · Cargo #6 · PAT +500K/trienio · OVR se conserva
- **B. Tomarte un trienio sabático** → OVR -2 · próxima carta: G-02 de comeback disponible
- **C. Fundar de nuevo ya mismo** → comeback inmediato sin ventajas (sin red de la salida ejecutiva)

**EJ-04 · "El ascenso"** · T2 · Modo ejecutivo, Cargo #4-#6
*Se abrió la silla de arriba. Sos candidato, pero no el único.*
- **A. Ir con todo** → 55%: Cargo -1 (subís), PAT ×1.5, OVR +2 / 45%: te lo dan a otro, TEND -1
- **B. Apoyar al otro candidato** → TEND +1 (aliado poderoso) · ⚑ favor_debido
- **C. No jugar ese juego** → sin cambios · si pasan 2 trienios sin ascender: TEND -1

**EJ-05 · "Recorte en el gigante"** · T4 · Modo ejecutivo · Ventana: eras ⛈/🌧
*Llegó el mail de "reestructuración". Tu área está en la lista.*
- **A. Defender a tu equipo con números** → 60%: zafan todos, OVR +2 / 40%: cortan igual y quedás marcado, TEND -1
- **B. Ejecutar el recorte prolijo** → OVR -1 · PAT +200K (te lo reconocen) · TEND +1 con la cúpula
- **C. Renunciar en protesta** → OVR +1 (leyenda interna) · salís del modo ejecutivo

**EJ-06 · "El proyecto del CEO"** · T2 · Modo ejecutivo
*El CEO tuvo una idea en un vuelo. Es mala. Te la dieron a vos.*
- **A. Decirle que es mala (con datos)** → 50%: OVR +2, TEND +1 (te respeta) / 50%: ⚑ enemigo_arriba
- **B. Ejecutarla rápido y barato** → 35%: sale bien de casualidad, Cargo -1 / 65%: fracasa, pero no es culpa tuya
- **C. Pasársela a otro VP** → TEND -1 (se nota)

**EJ-07 · "La jaula de oro"** · T1 · Modo ejecutivo, 2+ trienios en el mismo cargo
*Sueldazo, stock, banda ancha corporativa. Hace dos años que no sentís nada.*
- **A. Pedir un desafío imposible adentro** → TEND +1 · 50%: Cargo -1
- **B. Quedarte cómodo** → PAT +400K · OVR -1 por trienio que sigas · TEND -1
- **C. Empezar a mirar la puerta** → habilita EJ-09 el próximo turno

**EJ-08 · "Te quiere la competencia"** · T3 · Modo ejecutivo
*El neobanco morado te ofrece lo mismo, pero con el doble de stock y el título que querías.*
- **A. Saltar de camiseta** → cambia gigante · Cargo -1 · PAT ×1.4 · TEND +1 · ⚑ earnout se pierde si existía
- **B. Mostrar la oferta adentro** → 60%: PAT ×1.2, te igualan / 40%: quedás marcado, TEND -1
- **C. Quedarte por lealtad** → OVR +1 · ⚑ favor_debido de la cúpula

**EJ-09 · "Te pica el bichito"** · T3 · Modo ejecutivo, PAT ≥ 1M
*Viste un problema que nadie está resolviendo. No podés dormir. Ya sabés lo que significa.*
- **A. Renunciar y fundar** → comeback: OVR inicial 60 · techo re-sorteado +10% tramos altos · term sheets mejorados · PAT financia el arranque (RW inicial = PAT/burn)
- **B. Incubarlo adentro del gigante** → 45%: spin-off con 25% tuyo, TEND +2 / 55%: se lo quedan, OVR +1 de consuelo
- **C. Anotarlo en un cuaderno y seguir** → TEND -1 · la carta puede volver

**EJ-10 · "La serruchada"** · T2 · Modo ejecutivo, Cargo #2-#3
*Un par tuyo está armando la cama. Lo sabés porque te lo contó su equipo.*
- **A. Confrontarlo en la mesa chica** → 55%: se va él, Cargo -1 / 45%: te vas vos (salida con PAT +indemnización)
- **B. Blindarte con resultados** → OVR +1 · TEND +1 · tarda un trienio más el ascenso
- **C. Ignorarlo** → 40%: no era nada / 60%: te serruchan, Cargo +1 (bajás)

**EJ-11 · "La tapa de la revista"** · T5 · Modo ejecutivo, Cargo ≤ #3
*Una revista de negocios te quiere en la tapa: "El ejecutivo que viene". Tu CEO también la lee.*
- **A. Aceptar la tapa** → OVR +2 · 35%: ⚑ enemigo_arriba (brillaste de más)
- **B. Sugerir que salga el CEO** → TEND +2 · ⚑ favor_debido
- **C. Perfil bajo** → sin cambios

**EJ-12 · "La silla grande"** · T3 · Modo ejecutivo, Cargo #2, OVR ≥ 82
*El CEO se va. El board te mira a vos. Es todo lo que dijiste que querías. ¿Era?*
- **A. Aceptar ser CEO** → Cargo #1 · PAT ×2/trienio · habilita final "Terminaste manejando el barco de otro" · TEND ±2 según resultados
- **B. Rechazar y renunciar para fundar** → comeback con máxima red: term sheets de élite · OVR inicial 65
- **C. Rechazar y quedarte de #2** → PAT +600K · TEND -1 (nunca más te lo ofrecen)

---

# BLOQUE 3 — CARTAS GENERALES (20)

---

**G-01 · "El garage"** · T1 · Etapa: arranque (turno 1-2)
*Versión uno. Podés sacarla ya con alambre, o pulirla seis meses más.*
- **A. Lanzar ya, ver qué pasa** → ARR +10% · TEND +1 (aprendés rápido) · 25%: OVR -1 (papelón chico)
- **B. Pulir hasta que brille** → RW -5m · OVR +1
- **C. Buscar 10 clientes a mano antes de escribir código** → RW -2m · TEND +2 (la vieja escuela)

**G-02 · "La facultad"** · T1 · Etapa: arranque · Edad ≤ 26
*Te faltan ocho materias. Tu vieja pregunta. Tus inversores no.*
- **A. Terminarla a distancia** → RW -2m · OVR +1 (red de contactos) 
- **B. Dejarla (por ahora)** → sin cambios · flavor si llegás a unicornio: "nunca volviste"
- **C. Dejarla (con comunicado en redes)** → 50%: OVR +1 (personaje) / 50%: OVR -1 (insoportable)

**G-03 · "El primer cliente grande"** · T3 · Etapa: garage/seed
*Una empresa enorme quiere tu producto. Condición: exclusividad por tres años.*
- **A. Firmar la exclusividad** → ARR +50% · TEND -2 (te ata al elefante) · ⚑ dependencia
- **B. Negociar sin exclusividad** → 50%: ARR +30% / 50%: se cae el deal
- **C. Rechazar y diversificar** → OVR +1 · ARR +5%

**G-04 · "Modo crunch"** · T2 · Cualquier etapa founder
*Seis meses a fondo para llegar al lanzamiento. El equipo te sigue. Por ahora.*
- **A. Crunch total** → 65%: sale la feature clave, OVR +2, ARR +20% / 35%: burnout, OVR -1, TEND -1
- **B. Ritmo sostenible** → mitad del efecto, sin riesgo: ARR +10%

**G-05 · "Tu cofounder se quiere ir"** · T6 · Etapa: seed en adelante
*Está quemado, quiere hacer la suya. Es tu amigo desde los 12.*
- **A. Comprarle su parte** → RW -6m · EQ +8% (recuperás) · OVR -1 (duele)
- **B. Dejarlo ir con todo** → TEND -1 · el equity se lo lleva (⚑ dead_equity)
- **C. Convencerlo de quedarse un año más** → 50%: se queda y se recupera, TEND +1 / 50%: se va igual y peor, TEND -2

**G-06 · "El CTO estrella"** · T1 · Etapa: seed en adelante
*Viene del buscador. Cuesta el doble que vos. Dicen que vale el triple.*
- **A. Contratarlo** → RW -6m · TEND +2 (carga los dados del futuro)
- **B. Formar al junior de adentro** → RW -1m · TEND +1 pero recién en 2 trienios
- **C. Seguir siendo vos el CTO** → OVR -1 por trienio desde Serie A (no escala)

**G-07 · "Reescribir todo de cero"** · T2 · Etapa: Serie A en adelante
*El que te maneja los sistemas dice que ya no aguantan más. Quiere seis meses y ninguna novedad para vender.*
- **A. Dale, reescriban** → ARR -10% este trienio · 60%: TEND +2 / 40%: tarda el doble, RW -6m
- **B. Parches y a seguir vendiendo** → ARR +10% · ⚑ deuda_técnica (próxima crisis: efectos ×1.5)
- **C. Mitad y mitad** → sin efectos (la peor decisión posible, y el juego te lo dice)

**G-08 · "Dos ofertas sobre la mesa"** · T7 · Etapa: cualquier ronda
*El fondo top del Valle y el fondo regional de siempre. Mismo día, distinta letra chica.*
- **A. El fondo top** → RW +20m · EQ -20% · TEND +1 · ⚑ presión_growth
- **B. El fondo regional paciente** → RW +14m · EQ -15%
- **C. Los dos (ronda más grande)** → RW +28m · EQ -26% · board complicado: TEND -1

**G-09 · "Plata prestada"** · T7 · Etapa: Serie A+, ARR > 0
*Plata prestada, sin ceder un pedazo de tu empresa. El interés se paga igual, llueva o truene.*
- **A. Tomar la deuda** → RW +10m · EQ 0% · ⚑ deuda (si llega era ⛈: RW -6m extra)
- **B. Pasar** → sin cambios

**G-10 · "A pulmón"** · T7 · Etapa: cualquiera, sin ronda previa este trienio
*Podés levantar. También podés no levantar. Nadie te obliga a diluirte.*
- **A. Bootstrap un trienio más** → OVR +1 (disciplina) · TEND +1 si terminás el trienio cash-flow positivo
- **B. Levantar igual, por las dudas** → RW +12m · EQ -12%

**G-11 · "Vender un cachito"** · T7 · Etapa: Serie B+, EQ ≥ 30%
*Un fondo te ofrece comprarte el 4% personal. Tu primera plata real en diez años.*
- **A. Vender el 4%** → PAT +2M (o proporcional a valuación) · EQ -4% · habilita retiro (gate PAT ≥ 2M)
- **B. "Yo cobro cuando cobran todos"** → OVR +1 · los VCs lo cuentan en los asados
- **C. Vender el 8%** → PAT ×2 · EQ -8% · TEND -1 (señal fea al mercado)

**G-12 · "México te tira onda"** · T8 · Etapa: Serie A+, HQ ≠ CDMX
*Tres clientes grandes de allá te escriben solos. El mercado es cinco veces el tuyo.*
- **A. Abrir CDMX en serio** → RW -5m · TEND +1 · ARR +20% en 2 trienios
- **B. Venderles remoto** → ARR +10% · 40%: un competidor local te gana la plaza, TEND -1
- **C. Foco en casa** → sin cambios

**G-13 · "Guerra de precios"** · T3 · Etapa: Serie A+ · Vertical: marketplace/e-commerce/consumer
*Un competidor levantó una fortuna y regala el producto. Literalmente: gratis.*
- **A. Bajar precios y bancar la quema** → RW -8m · 50%: se funde él primero, ARR +40% / 50%: se funden los dos un poco, TEND -1
- **B. Subir precios e ir a premium** → ARR -15% · OVR +2 · TEND +1
- **C. Llamarlo para hablar de "consolidación"** → 40%: fusión, valuación +30% / 60%: te dice que no y lo tuitea

**G-14 · "Te quieren comprar temprano"** · T3 · Etapa: seed/A · Valuación ≥ 5M
*Oferta por toda la empresa. Es plata que te cambia la vida. También es temprano.*
- **A. Vender** → final Exit chico · PAT según valuación y EQ · fin de esta empresa (habilita playa o comeback)
- **B. Rechazar** → TEND +1 (creés en vos) · flavor recordatorio si después quebrás
- **C. Contraofertar el doble** → 25%: aceptan, Exit ×2 / 75%: se van y no vuelven

**G-15 · "El elefante moroso"** · T2 · Etapa: cualquiera con ⚑ dependencia o ARR concentrado
*Tu cliente más grande —el 60% de tu facturación— hace 90 días que no paga.*
- **A. Cortarle el servicio** → 50%: paga en 48hs, OVR +1 / 50%: se va, ARR -40%
- **B. Financiarlo y rezar** → RW -6m · 60%: paga y renueva, ARR +10% / 40%: quiebra él, ARR -50%
- **C. Salir a diversificar ya** → RW -3m · TEND +2 · quita ⚑ dependencia

**G-16 · "El influencer advisor"** · T5 · Etapa: cualquiera
*Doscientos mil seguidores hablando de negocios. Se ofrece de advisor por el 2%.*
- **A. Aceptar** → EQ -2% · 60%: OVR +2 (visibilidad) / 40%: papelón público, OVR -1
- **B. Ofrecerle 0.5% y ver** → 50%: acepta, mitad de efectos / 50%: te escracha en un hilo
- **C. Rechazar** → sin cambios

**G-17 · "El panel del futuro"** · T5 · Etapa: Serie A+
*Te invitan a un panel: "El futuro de tu industria". Micrófono abierto, prensa presente.*
- **A. Ir y jugarla segura** → OVR +1
- **B. Ir y tirar una predicción fuerte** → 60%: OVR +2, TEND +1 (visionario) / 40%: envejece mal en un trienio, OVR -2
- **C. Mandar al cofounder** → TEND +1 del equipo · 20%: la rompe y ahora es la cara visible

**G-18 · "El tweet"** · T5 · Etapa: cualquiera
*Son las 2 AM. Tenés una opinión picante sobre el ecosistema y el pulgar caliente.*
- **A. Publicar** → 55%: OVR +2 (personaje del ecosistema) / 45%: quilombo, OVR -2, ⚑ manchado_redes
- **B. Guardarlo en borradores** → OVR +1 (madurez) 
- **C. Mandarlo al grupo de founders** → 30%: alguien lo filtra igual, mitad del efecto malo

**G-19 · "El VP de Ventas golazo-o-fichita"** · T2 · Etapa: Serie A+
*Currículum brillante, sonrisa de cierre. Los VP de Ventas son la posición con más varianza del fútbol.*
- **A. Contratarlo** → RW -5m · 55%: ARR +35%, TEND +1 / 45%: no vende nada, lo echás en un año, TEND -1
- **B. Promover al mejor vendedor interno** → 65%: ARR +15% / 35%: era mejor vendedor que jefe
- **C. Seguir vendiendo vos** → ARR +5% · OVR -1 desde Serie B (no escala)

**G-20 · "El pivot"** · T3 · Etapa: cualquiera, TEND ≤ -1 o ARR estancado
*Los números no mienten hace dos años. Hay otra puerta, pero es empezar casi de cero.*
- **A. Pivotear con todo** → ↳ en la tabla · ARR -40% ya · 55%: TEND +2 y techo re-sorteado / 45%: TEND -1
- **B. Pivot suave (mismo producto, otro cliente)** → 60%: ARR +20% / 40%: sin efecto
- **C. Doblar la apuesta en lo que hay** → 35%: era cuestión de tiempo, ARR +30% / 65%: TEND -2

---

## Notas de balanceo del lote (para revisión)

1. **Presupuesto de OVR:** con 11 turnos y momentum ±4, las cartas mueven ±1..2 de OVR como norma; solo macro y apuestas grandes llegan a ±2..3. Si las cartas regalan mucho OVR, el techo oculto deja de importar.
2. **Runway:** costos de decisión 2-8 meses; rondas suman 10-36. Un trienio quema ~12-24 meses según etapa (tabla en balance.json, F3).
3. **Flags con interacción cruzada en este lote:** `sobrecapitalizado` (M-01→M-02) · `valuación_inflada` (M-13→M-14) · `dependencia` (G-03→G-15) · `deuda` (G-09→eras ⛈) · `deuda_técnica` (G-07→crisis) · `aliado_gigante` (M-08→EJ-02) · `favor_debido` / `enemigo_arriba` (cadena ejecutiva). Son 7: suficientes para que el deck se sienta vivo, pocos para no volver ilegible el sistema.
4. **Humor:** 4 cartas T5 sobre 20 generales (20%) + EJ-11 = dentro de la regla "máx 1 cada 3 decisiones".
5. **Pendiente para lote 2 (~60 cartas):** condicionales por vertical (crypto, deep tech, gaming), condicionales por HQ (asado con inversor en BA, cartas CDMX/SP), cartas de playa (modo retiro), más T6 de equipo y cultura, y las cartas de emergencia runway-0.

*Para la revisión: marcá con ✅/✏️/❌ carta por carta (aprobada / reescribir / afuera) y anotá si algún número te hace ruido.*
