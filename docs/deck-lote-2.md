# Tu Carrera Emprendedora — Deck de cartas · Lote 2 (55 cartas)
**F1 · v0.1** · Completa el deck: 47 (lote 1) + 55 (lote 2) = **102 cartas**, dentro del target de 100-120 del PRD.
Misma notación que el lote 1 (OVR, TEND, RW, EQ, ARR, PAT, ⚑, apuestas %/%).

---

# BLOQUE 4 — EMERGENCIA RUNWAY 0 (5)
*Cartas forzadas: se disparan cuando RW llega a 0. El jugador SIEMPRE tiene salida — la quiebra tiene que sentirse elegida o merecida, nunca arbitraria.*

---

**E-01 · "Se acabó la plata"** · T4 forzada · Trigger: RW = 0 · (carta master: sus opciones llevan a E-02/E-04/E-05)
*Quedan dos sueldos en la cuenta. Nadie más lo sabe. Todavía.*
- **A. Llamar a tus inversores** → va a E-02
- **B. Llamar a los que te quisieron comprar** → va a E-04
- **C. Apostar la caja a un último tiro** → 25%: cliente milagro, RW +6m, TEND +2, ✝ en la fila / 75%: va a E-05

**E-02 · "El inside round"** · T7 forzada · Trigger: desde E-01, con inversores previos
*Tus propios fondos te rescatan. La letra chica muerde: ellos también están asustados.*
- **A. Aceptar los términos duros** → RW +12m · EQ -20% · ↓ en la fila · TEND -1
- **B. Negociar mostrando el pipeline** → 45%: EQ -12% en vez de -20% / 55%: se enojan, EQ -25%
- **C. Rechazar y cerrar** → va a E-05 con OVR +1 (dignidad)

**E-03 · "Vender los muebles"** · T7 forzada · Trigger: RW = 0 sin inversores (bootstrap) · PAT > 0
*No hay fondos a quien llamar. Hay un auto, unos ahorros y una decisión.*
- **A. Poner tu plata** → PAT -todo · RW +8m · OVR +1 · flavor épico si después la sacás adelante
- **B. Sueldos a la mitad, incluido el tuyo** → RW +6m · 55%: el equipo banca, TEND +1 / 45%: se van los mejores, TEND -2
- **C. Cerrar antes de endeudarte** → va a E-05

**E-04 · "El acqui-hire"** · T3 forzada · Trigger: desde E-01
*No compran tu producto. Te compran a vos y a los tres que programan. El comunicado va a decir otra cosa.*
- **A. Aceptar** → final "Te compraron por el equipo" · PAT +300K-1M según OVR · habilita EJ-03 (seguís adentro del gigante)
- **B. Pedir que absorban a TODO el equipo** → 50%: aceptan, OVR +2 (leyenda) / 50%: se cae todo, va a E-05
- **C. Rechazar por orgullo** → va a E-05 · TEND -1 del final

**E-05 · "Cerrar bien"** · T1 forzada · Trigger: quiebra confirmada
*Se terminó. Lo único que queda por decidir es cómo te van a recordar.*
- **A. Pagar sueldos hasta el final, devolver lo que quede** → final "La cerraste bien" ✝ · OVR se conserva para comeback · ⚑ reputación_intacta (mejores term sheets si volvés)
- **B. Desaparecer del mapa** → final "La cerraste bien" pero OVR -3 para comeback
- **C. Comunicado épico + post mortem público** → 60%: OVR +2, el post se hace viral / 40%: quedás como chanta, ⚑ manchado_redes

---

# BLOQUE 5 — CONDICIONALES POR VERTICAL (16 · 2 por vertical)

---

**V-01 · "El churn fantasma"** · T2 · Vertical: SaaS · Etapa: Serie A+
*Vendés bien pero se te van por atrás. Nadie sabe por qué. El dashboard sí sabe, pero nadie lo mira.*
- **A. Frenar ventas un trimestre y investigar** → ARR -10% ya · 65%: encontrás la fuga, TEND +2 / 35%: era el precio, bajás margen
- **B. Vender más rápido de lo que se van** → ARR +15% · ⚑ balde_agujereado (próxima due diligence: efectos ×1.5)

**V-02 · "El cliente que pide custom"** · T3 · Vertical: SaaS
*Tu cliente más grande quiere features solo para él. Paga bien. Tu producto se convierte en SU producto.*
- **A. Cobrarle el desarrollo custom** → ARR +25% · TEND -1 (te volvés consultora)
- **B. Decirle que no, roadmap es roadmap** → 55%: se queda igual, OVR +1 / 45%: se va, ARR -20%
- **C. Hacerlo configurable para todos** → RW -4m · TEND +2

**V-03 · "Llamó el regulador"** · T4 · Vertical: fintech · TE PASÓ
*Un sobre con membrete del banco central. Quieren "conversar sobre su modelo de negocio".*
- **A. Contratar al ex regulador como asesor** → RW -4m · TEND +1 · ⚑ blindado_regulatorio
- **B. Ir vos con tu abogado de siempre** → 50%: zafás / 50%: multa, RW -6m, OVR -1
- **C. Operar en el gris mientras se pueda** → ARR +20% · 40% por trienio: clausura parcial, ARR -50%

**V-04 · "El fraude"** · T2 · Vertical: fintech · Etapa: Serie A+
*Detectaron un anillo de fraude usando tu producto. Todavía no salió en ningún lado.*
- **A. Frenar todo, avisar a clientes y autoridades** → ARR -15% ya · OVR +2 · ⚑ blindado_regulatorio
- **B. Arreglarlo en silencio** → 60%: nadie se entera / 40%: se filtra, OVR -3, ⚑ manchado_redes

**V-05 · "La logística se come todo"** · T1 · Vertical: e-commerce
*Vendés como nunca. Perdés plata en cada envío. El Excel no miente, pero vos no lo mirás.*
- **A. Armar logística propia** → RW -8m · TEND +2 (foso competitivo)
- **B. Subir el mínimo de compra** → ARR -10% · margen +, RW +3m
- **C. Seguir creciendo, "después vemos margen"** → ARR +20% · ⚑ margen_negativo (en era ⛈: RW -8m extra)

**V-06 · "El Hot Sale que rompe todo"** · T2 · Vertical: e-commerce
*El evento de descuentos más grande del año. El año pasado se te cayó el sitio a las 00:04.*
- **A. Invertir en infraestructura antes** → RW -3m · 75%: récord de ventas, ARR +30% / 25%: igual se cae, OVR -1
- **B. Entrar con lo que hay** → 40%: aguanta, ARR +25% / 60%: se cae en horario pico, OVR -2, memes

**V-07 · "El huevo y la gallina"** · T1 · Vertical: marketplace · Etapa: garage/seed
*Sin compradores no hay vendedores. Sin vendedores no hay compradores. Bienvenido al marketplace.*
- **A. Subsidiar a los vendedores** → RW -6m · TEND +2
- **B. Hacer de vendedor vos mismo al principio** → RW -2m · OVR +1 (la vieja escuela)
- **C. Lanzar en una sola ciudad chica** → TEND +1 · ARR arranca -20% pero momentum cargado

**V-08 · "Te puentean"** · T2 · Vertical: marketplace · Etapa: Serie A+
*Comprador y vendedor se conocieron en tu plataforma. La segunda operación la hicieron por WhatsApp.*
- **A. Bajar la comisión** → ARR -15% · TEND +1 (volumen)
- **B. Meter valor que no puedan puentear (pagos, garantía)** → RW -5m · 65%: TEND +2 / 35%: no mueve la aguja
- **C. Bloquear teléfonos en el chat** → 50%: funciona / 50%: éxodo de usuarios, ARR -20%

**V-09 · "La demo que alucina"** · T2 · Vertical: AI · TE PASÓ
*Demo con el cliente más grande de tu vida. Tu modelo inventó un dato. Con confianza.*
- **A. Reírte, explicarlo y mostrar los guardrails** → 60%: firman igual, OVR +2 / 40%: "lo vamos a pensar"
- **B. Culpar al wifi** → 30%: cuela / 70%: se dan cuenta, OVR -2
- **C. Posponer y encerrarte a arreglar** → RW -4m · TEND +1

**V-10 · "La big tech lo lanza gratis"** · T4 · Vertical: AI · Ventana 2023-2026 · TE PASÓ
*El gigante de los modelos lanzó tu producto entero. Como feature. Gratis.*
- **A. Ir a nicho profundo (vertical + datos propios)** → ARR -20% ya · TEND +2
- **B. Pelear de frente por precio** → 25%: David gana, OVR +3 / 75%: TEND -2
- **C. Llamarlos para que te compren** → 35%: exit decente / 65%: "ya lo construimos, gracias"

**V-11 · "El hit inesperado"** · T2 · Vertical: gaming · TE PASÓ
*Un streamer coreano jugó tu juego 9 horas. Tenés un millón de descargas y el servidor prendido fuego.*
- **A. Meter toda la caja en servers y live-ops** → RW -8m · 60%: se consolida, ARR +60%, TEND +2 / 40%: moda de un mes
- **B. Monetizar agresivo YA** → ARR +40% ya · TEND -2 (la comunidad no perdona)
- **C. Disfrutarlo sin cambiar el plan** → ARR +15% · OVR +1

**V-12 · "La plataforma cambia las reglas"** · T4 · Vertical: gaming/consumer
*La tienda de apps se queda con el 30%. Hoy anunciaron que además cambia el algoritmo. Tu tráfico: -60%.*
- **A. Ir directo al usuario (web, mail, comunidad)** → RW -5m · TEND +2 · ⚑ canal_propio
- **B. Pagar ads para recuperar el tráfico** → RW -7m · ARR estable · TEND -1 (adicto al ad)
- **C. Protestar públicamente** → OVR +1 (aplausos) · nada cambia

**V-13 · "El prototipo no escala"** · T2 · Vertical: deep tech
*En el laboratorio funciona perfecto. En la fábrica, el costo por unidad es cinco veces el precio de venta.*
- **A. Dos años más de I+D** → RW -10m · 55%: breakthrough, TEND +3 / 45%: sigue caro, TEND -1
- **B. Vender la versión cara a nicho premium** → ARR +15% · TEND +1
- **C. Licenciar la tecnología a un grande** → ARR +30% estable · techo de OVR -5 (dejás de ser protagonista)

**V-14 · "El contrato con el Estado"** · T3 · Vertical: deep tech/hardware
*Un gobierno quiere tu tecnología. Es el contrato más grande de tu historia. Pagan a 180 días. A veces.*
- **A. Firmar** → ARR +50% · ⚑ dependencia · 40%: pagan tarde, RW -6m
- **B. Firmar solo con anticipo del 50%** → 45%: aceptan, lo mejor de ambos / 55%: se cae
- **C. Mantenerte privado** → sin cambios · OVR +1 si tu HQ tiene historial de default

**V-15 · "Se cayó el exchange"** · T4 · Vertical: crypto · Ventana 2018-2026 · TE PASÓ
*El exchange más grande del mundo quebró de un día para el otro. Tu industria entera es sospechosa.*
- **A. Transparencia radical (reservas públicas, auditoría)** → RW -4m · OVR +2 · TEND +2 (los sobrevivientes heredan todo)
- **B. Silencio de radio** → 50%: pasa la tormenta / 50%: te asocian, ARR -40%
- **C. Aprovechar y comprar competidores baratos** → RW -8m · 50%: TEND +3 / 50%: comprás problemas

**V-16 · "El token propio"** · T2 · Vertical: crypto · Ventana 2017-2021
*Tus asesores insisten: lanzá tu token. La plata es inmediata. Las consecuencias, también.*
- **A. Lanzarlo** → RW +24m sin dilución · 65%: el regulador te encuentra tarde o temprano, multa + OVR -3, ⚑ manchado_crypto / 35%: zafás
- **B. No lanzar** → OVR +1 (adulto en la sala) · TEND +1 en eras 🌧
- *(Diseño intencional: la opción tentadora tiene expectativa negativa. El juego no premia el atajo.)*

---

# BLOQUE 6 — CONDICIONALES POR HQ (8)

---

**H-01 · "El asado con el inversor"** · T5 · HQ: Buenos Aires
*Un fondo local te invita a un asado "para conocerse". Acá las ofertas de inversión se cocinan a las brasas.*
- **A. Ir y hablar de negocios** → 50%: term sheet el lunes, RW +12m, EQ -12% / 50%: era solo un asado
- **B. Ir y NO hablar de negocios** → TEND +1 (leyeron el juego) · ⚑ favor_debido
- **C. "Estoy a full, otro día"** → los fondos locales te bajan el pulgar un trienio

**H-02 · "El dólar y vos"** · T1 · HQ: Buenos Aires · Cualquier era
*Facturás en pesos, gastás en dólares. O al revés. Nunca los dos bien a la vez.*
- **A. Dolarizar ingresos (exportar servicios)** → RW -3m · TEND +2 · ⚑ dolarizado
- **B. Cobertura financiera criolla** → RW -1m · 60%: te salva en la próxima devaluación / 40%: costo hundido
- **C. Que sea lo que Dios quiera** → 50%: la devaluación te licúa costos, RW +6m / 50%: te licúa ingresos, RW -6m

**H-03 · "El corporativo te copia"** · T3 · HQ: CDMX
*El conglomerado más grande del país lanzó tu producto. Con peor diseño y el triple de presupuesto.*
- **A. Aliarte con su competidor histórico** → ARR +30% · TEND +1 · te casaste con un bando
- **B. Ganarles en velocidad** → TEND +2 · RW -4m
- **C. Venderles la empresa** → 40%: exit decente / 60%: "mejor lo hacemos nosotros" (ya lo hicieron)

**H-04 · "São Paulo es otro planeta"** · T8 · HQ: São Paulo o expandiendo a Brasil
*El mercado más grande de la región habla otro idioma, usa otros medios de pago y no te conoce.*
- **A. Equipo 100% local con jefe local** → RW -6m · 70%: TEND +2 / 30%: perdés el control de la cultura
- **B. Mandar a tu mejor gente desde el HQ** → RW -4m · 40%: funciona / 60%: rebote total en un año
- **C. Entrar por adquisición de un player chico** → RW -10m · EQ -5% · TEND +1

**H-05 · "La rosca bogotana"** · T5 · HQ: Bogotá
*En este ecosistema todos se conocen. Te invitan al grupo de WhatsApp donde pasan las cosas.*
- **A. Entrar y jugar la rosca** → TEND +1 · ⚑ favor_debido · 25%: un quilombo ajeno te salpica
- **B. Mantenerte al margen** → OVR +1 (fama de derecho) · te enterás tarde de todo

**H-06 · "Santiago ordenado"** · T1 · HQ: Santiago
*Mercado chico, estable y formal. Se escala poco, se quiebra menos.*
- **A. Usarlo de laboratorio y salir rápido a la región** → RW -4m · TEND +2
- **B. Dominar el mercado local primero** → ARR +20% · techo de OVR -3 mientras no salgas
- *(Refleja el trade-off real de los mercados chicos: piso alto, techo corto.)*

**H-07 · "Miami: ni gringo ni latino"** · T1 · HQ: Miami
*Para el Valle sos 'LATAM'. Para LATAM sos 'el que se fue'. Para el banco sos un cheque en dólares.*
- **A. Jugarla de puente (capital allá, operación acá)** → TEND +2 · RW +4m (levantar en USD rinde)
- **B. Ir full mercado US** → 40%: multiplico todo, múltiplo +30% / 60%: competís con nativos, TEND -1
- **C. Volverte al pago** → cambia HQ · OVR +1 (la vuelta del hijo pródigo vende)

**H-08 · "La visa"** · T2 · HQ: cualquiera de LATAM, expandiendo a US
*Tu ronda depende de una reunión en San Francisco. Tu visa depende de un turno que no aparece.*
- **A. Abogado migratorio premium** → RW -2m · 80%: llegás a la reunión / 20%: no sale, la ronda espera
- **B. Reunión por videollamada** → 55%: cierra igual / 45%: "queremos conocerte en persona" (la ronda se enfría, TEND -1)

---

# BLOQUE 7 — EQUIPO Y CULTURA (8)

---

**T-01 · "El empleado número uno"** · T6 · Etapa: garage/seed
*Trabaja como socio y cobra como el que recién empieza. Te pide una parte de la empresa. Tiene razón.*
- **A. Darle 2% con vesting** → EQ -2% · TEND +2 (lealtad de hierro)
- **B. Subirle el sueldo, sin equity** → RW -2m · 55%: se queda / 45%: se va al año, TEND -1
- **C. "Más adelante lo vemos"** → 70%: se va cuando más lo necesitás, TEND -2

**T-02 · "Seniors o pibes"** · T1 · Etapa: seed/A
*Podés contratar dos seniors caros o cinco juniors con hambre. No hay plata para las dos cosas.*
- **A. Los dos seniors** → RW -5m · TEND +1 inmediato
- **B. Los cinco juniors** → RW -3m · TEND +2 pero recién en 2 trienios · 30%: el gigante te los roba formados
- **C. Un senior que forme juniors** → RW -4m · TEND +1 sostenido (el equilibrio, si lo encontrás)

**T-03 · "Oficina o remoto"** · T1 · Etapa: Serie A+ · Ventana 2020+
*La mitad del equipo no quiere volver. La otra mitad no quiere trabajar solo. Vos querés no decidir.*
- **A. Full remoto, oficina mínima** → RW +3m · 60%: TEND +1 (contratás en todo el continente) / 40%: la cultura se diluye, TEND -1
- **B. Todos a la oficina** → RW -3m · 50%: cohesión, TEND +1 / 50%: renuncias de los mejores
- **C. Híbrido "flexible"** → sin efectos · flavor: "la palabra flexible hizo mucho daño"

**T-04 · "El tóxico que factura"** · T6 · Etapa: Serie A+
*Tu mejor vendedor es el peor compañero. Los números lo aman. El equipo lo odia.*
- **A. Echarlo igual** → ARR -15% un trienio · OVR +2 · TEND +2 (el mensaje que queda)
- **B. Aislarlo en su propia isla** → ARR estable · 50%: funciona / 50%: la isla se agranda
- **C. Bancarlo por los números** → ARR +10% · TEND -2 · 40%: se te van dos buenos por cada trimestre

**T-05 · "La fuga al gigante"** · T6 · Etapa: Serie B+
*El gigante del e-commerce regional está reclutando. Le ofreció el doble a tres de los tuyos.*
- **A. Igualar las ofertas** → RW -5m · se quedan · ⚑ inflación_salarial
- **B. Dejar ir, ascender de adentro** → TEND -1 ya, +2 en el próximo trienio (los que suben responden)
- **C. Llamar al gigante y quejarte** → OVR -1 · igual se los llevan · flavor: "no fue tu mejor llamada"

**T-06 · "El head de People"** · T1 · Etapa: Serie B+ · 50+ empleados
*Pasaste de 15 a 80 personas. Los quilombos ya no se arreglan con un asado.*
- **A. Contratar un head de People en serio** → RW -3m · TEND +1 sostenido
- **B. "La cultura la manejo yo"** → OVR -1 por trienio desde 100 empleados · 40%: crisis interna pública

**T-07 · "Sueldos a la vista"** · T2 · Etapa: cualquiera 20+ empleados
*Se filtró la planilla de sueldos. Todos saben lo de todos. Hay caras largas en la cocina.*
- **A. Transparencia total desde hoy (bandas públicas)** → 60%: TEND +2, empleador imán / 40%: se van dos que estaban fuera de banda
- **B. Emparejar en silencio** → RW -4m · se calma
- **C. Cazar al que filtró** → TEND -2 · encontrarlo no arregla nada y el juego te lo dice

**T-08 · "El bonus pool"** · T1 · Etapa: año bueno (ARR +30% o más)
*Fue un año espectacular. La pregunta de diciembre: ¿cuánto se reparte?*
- **A. Bonus generoso para todos** → RW -4m · TEND +2
- **B. Bonus solo a los top performers** → RW -2m · 50%: meritocracia sana / 50%: guerra fría interna
- **C. Reinvertir todo, "el bonus es el equity"** → TEND -1 · OVR -1 si lo repetís dos veces

---

# BLOQUE 8 — FINANCIAMIENTO AVANZADO Y ENDGAME (5)

---

**F-01 · "La campana"** · T3 · Etapa: valuación ≥ USD 800M, ARR ≥ 80M · Era ⛅/☀️
*Los bancos de inversión te llaman por tu nombre de pila. Salir a bolsa: la meta de todos, el infierno de varios.*
- **A. Tocar la campana** → final "Tocaste la campana" 🔔 · valuación final = pico × factor de era (en ☀️ ×1.2, en ⛅ ×0.9) · PAT según EQ
- **B. Una ronda privada más** → EQ -8% · valuación +20% · 40%: la ventana de IPO se cierra (era cambia), TEND -1
- **C. Vender a un estratégico en vez de IPO** → final Exit grande · ×1.1 sin el riesgo del mercado

**F-02 · "El board te quiere afuera"** · T3 · Etapa: Serie B+ · Trigger: TEND ≤ -2 o 2 trienios malos
*"Estamos pensando que la empresa necesita un CEO con experiencia en esta etapa." Lo dicen mirándote.*
- **A. Pelear tu silla (aliados + plan)** → 50%: te quedás, OVR +2, TEND +2 / 50%: te van igual, y peor
- **B. Aceptar ser 'founder & CTO' con CEO contratado** → OVR -1 · TEND +1 (la empresa mejora sin vos al mando, trágico y real)
- **C. Irte con tu equity y tu orgullo** → conservás EQ · habilita comeback o playa · flavor: la empresa puede volar sin vos y lo vas a ver por el diario

**F-03 · "El CFO adulto"** · T1 · Etapa: Serie B+
*Tu Excel ya no alcanza. Los fondos piden "alguien con experiencia en la posición".*
- **A. Contratar al CFO de un gigante** → RW -4m · TEND +1 · requisito para F-01 y F-04
- **B. Ascender a tu contador de siempre** → RW -1m · 45%: crece con el puesto / 55%: F-04 duele el doble
- **C. Seguir con el Excel** → bloquea F-01 · en due diligence: efectos ×1.5

**F-04 · "La due diligence"** · T2 · Trigger: antes de rondas Serie B+ o exit
*Un ejército de analistas revisa tu empresa con lupa. Todas las manchas que juntaste están por cobrar peaje.*
- **A. Abrir todo, sin sorpresas** → si no hay flags negativos: TEND +1, cierre rápido · si hay (balde_agujereado, deuda_técnica, margen_negativo): valuación -15% por flag
- **B. Maquillar lo justo** → 45%: cuela / 55%: encuentran todo, la ronda se cae, OVR -2
- *(Esta carta es el cobrador del karma: hace que los flags de todo el deck importen.)*

**F-05 · "El atajo a la bolsa"** · T3 · Ventana 2020-2021 · Etapa: Serie B+
*Un cheque en blanco cotizante te ofrece fusionarte y salir a bolsa por la ventana. Sin roadshow, sin preguntas.*
- **A. Tomar el atajo** → final IPO técnico · valuación pico ×1.3 en el papel · 70%: la acción cae 60% en el trienio siguiente y la tarjeta lo muestra ("Tocaste la campana*" con asterisco) / 30%: aguanta
- **B. Pasar** → OVR +1 cuando pase la moda
- *(El asterisco en la tarjeta es un chiste que el ecosistema va a entender al toque.)*

---

# BLOQUE 9 — MODO PLAYA (8)
*Solo en retiro (gate PAT ≥ 2M). El patrimonio es la única métrica. El riesgo: fundirte en la playa.*

---

**P-01 · "La casa frente al mar"** · T1 · Modo playa
*La casa que mirabas en Zillow a las 3 AM cuando la empresa se caía. Ahora podés.*
- **A. Comprarla** → PAT -30% · OVR estable (sos feliz) · flavor en tarjeta: 🏖
- **B. Alquilarla por temporada** → PAT -5% · la sensatez no hace buenas historias
- **C. Comprarla y también el barco** → PAT -50% · ⚑ tren_de_vida (cada trienio: PAT -15% extra)

**P-02 · "El restaurante"** · T2 · Modo playa
*Todos tus amigos exitosos pusieron uno. Ninguno recuperó la plata. El tuyo va a ser distinto, obvio.*
- **A. Abrir el restaurante** → PAT -20% · 25%: da ganancia y sos feliz / 75%: pierde plata elegantemente, PAT -10% extra por trienio hasta que lo cierres
- **B. Invertir en el de un chef en serio** → PAT -8% · 50%: recuperás ×2 / 50%: cero
- **C. Ir a comer a los de otros** → PAT -1% · sabiduría

**P-03 · "Ángel de día"** · T2 · Modo playa o ejecutivo
*Todos los founders jóvenes quieren tu cheque. Y tu WhatsApp. Sobre todo tu WhatsApp.*
- **A. Portfolio de 10 apuestas chicas** → PAT -15% · 60%: una paga todo, PAT +40% / 40%: aprendizaje carísimo
- **B. Un solo cheque grande al que más te cierra** → PAT -20% · 35%: PAT ×2.5 / 65%: PAT -20% y un amigo menos
- **C. Solo consejos, cero cheques** → OVR +1 (mentor querido) · ⚑ red_de_founders (mejora el comeback)

**F-04 · "El fondo de tu amigo"** · T2 · Modo playa · PAT ≥ 5M
*Tu excompañero de la facultad armó un fondo. "Entrá de LP, es plata dormida", dice.*
- **A. Entrar como LP** → PAT -25% bloqueado 2 trienios · 55%: PAT ×1.6 al final / 45%: "el mercado estuvo difícil"
- **B. Entrar como socio activo** → sale de modo playa a "modo inversor" (flavor de cartas cambia) · TEND +1
- **C. "Te banco desde afuera"** → sin cambios

**P-05 · "Cripto personal"** · T2 · Modo playa
*Aburrido, con plata y con internet. La combinación más peligrosa del mundo.*
- **A. Meter el 10% 'para jugar'** → 50%: PAT +15% / 50%: PAT -10%
- **B. Meter el 50% porque 'esta vez es distinto'** → 25%: PAT ×1.8 / 75%: PAT -35% · flavor: nunca es distinto
- **C. No tocar nada** → PAT estable · dormís bien

**P-06 · "El año sabático de verdad"** · T1 · Modo playa
*Un año entero sin agenda. Los primeros dos meses son un sueño. El tercero aparece el vacío.*
- **A. Viajar hasta que se pase** → PAT -8% · OVR -1 (te desconectás del juego)
- **B. Escribir, entrenar, estar** → OVR +1 · TEND +1 si hay comeback (volvés entero)
- **C. Volverte loco y mirar dashboards ajenos** → acelera la carta EJ-09/"Te pica el bichito"

**P-07 · "El circuito de charlas"** · T5 · Modo playa o post-exit
*Universidades, conferencias, un TEDx del conurbano. Todos quieren la historia del exit.*
- **A. Aceptar todo** → PAT +3% · OVR estable (seguís vigente) · ⚑ red_de_founders
- **B. Solo las que pagan bien** → PAT +5% · OVR -1 (te ven menos)
- **C. Ninguna, perfil fantasma** → el misterio también es marca: 50%: OVR +1 / 50%: te olvidan

**P-08 · "El libro"** · T2 · Modo playa · Trienio 2+ de retiro
*Una editorial quiere tus memorias: "Cómo lo hice". Vos sabés cuánto fue suerte. ¿Lo escribís igual?*
- **A. Escribirlo honesto (con la suerte incluida)** → OVR +2 · ⚑ reputación_intacta
- **B. Escribirlo épico (sin la suerte)** → 55%: bestseller de aeropuerto, PAT +5%, OVR +1 / 45%: el ecosistema se ríe, OVR -2
- **C. No escribirlo** → sin cambios

---

# BLOQUE 10 — COLOR ADICIONAL (5)

---

**C-01 · "El podcast"** · T5 · Etapa: Serie A+
*Todo founder tiene un podcast. Vos todavía no. El micrófono ya lo compraste.*
- **A. Lanzarlo** → RW -1m · 45%: OVR +1, canal de marca / 55%: 4 episodios y abandono, flavor eterno
- **B. Ir de invitado a los de otros** → OVR +1 · cero costo (la jugada correcta y el juego lo premia)
- **C. Ni loco** → sin cambios

**C-02 · "La rutina del gurú"** · T5 · Cualquier etapa
*Baños helados, ayuno, despertarse 4:30. Un founder que admirás jura que ahí está el secreto.*
- **A. Adoptar la rutina completa** → 40%: TEND +1 (energía real) / 60%: OVR -1 (dormido en el board)
- **B. Robarle solo lo que sirve (dormir bien)** → TEND +1 · sin drama
- **C. Tuitear en contra de los gurúes** → va a G-18 ("El tweet") automáticamente

**C-03 · "El coach"** · T5 · Etapa: Serie B+ o TEND ≤ -1
*Tu inversor principal te "sugiere" un coach ejecutivo. La sugerencia vino con el contacto agendado.*
- **A. Ir con la mente abierta** → 65%: TEND +1, OVR +1 / 35%: son 200 dólares la hora de frases de LinkedIn
- **B. Ir para que el inversor se calle** → sin efectos · el coach se da cuenta
- **C. "Yo no necesito eso"** → TEND -1 con el board

**C-04 · "La nota promesa"** · T5 · Etapa: seed/A
*Un medio grande te elige "startup promesa del año". La nota va a envejecer como envejecen esas notas.*
- **A. Aceptar y difundir a full** → OVR +1 ya · 50%: si quebrás después, la nota resucita en los replies
- **B. Aceptar con perfil bajo** → OVR +1 · sin riesgo
- **C. Pedir que saquen a otro** → ⚑ favor_debido de un competidor agradecido

**C-05 · "El pitch en el casamiento"** · T5 · Cualquier etapa
*Un pariente lejano te encara en la fiesta: tiene "la idea del siglo" y solo necesita "alguien técnico".*
- **A. Escucharlo 5 minutos por respeto** → sin efectos · flavor: la idea era una app de asados
- **B. Darle un consejo real** → OVR +1 (buena gente) · 10%: la idea era buena en serio, ⚑ oportunidad_familiar
- **C. Esconderte en la barra** → sin efectos · todos te vimos

---

## Resumen del deck completo (lote 1 + 2)

| Bloque | Cartas | Modo |
|---|---|---|
| Macro históricas | 15 | founder |
| Modo ejecutivo | 12 | ejecutivo |
| Generales | 20 | founder |
| Emergencia runway 0 | 5 | founder (forzadas) |
| Condicionales por vertical | 16 | founder |
| Condicionales por HQ | 8 | founder |
| Equipo y cultura | 8 | founder |
| Financiamiento avanzado / endgame | 5 | founder |
| Modo playa | 8 | playa |
| Color adicional | 5 | founder |
| **TOTAL** | **102** | |

**Chequeos contra el PRD:**
- ✅ 102 cartas ∈ target 100-120 · con 11 turnos por partida se usa ~10-12% del deck por run.
- ✅ Humor T5: 12 cartas (11.7%) — dentro de la regla "máx 1 cada 3 decisiones" con el sistema de frecuencia.
- ✅ Flags totales del deck: 15 (7 del lote 1 + reputación_intacta, blindado_regulatorio, balde_agujereado, margen_negativo, canal_propio, tren_de_vida, red_de_founders, inflación_salarial, oportunidad_familiar). **F-04 "La due diligence" es el cobrador central**: convierte flags acumulados en consecuencias — el deck se acuerda de lo que hiciste.
- ✅ Toda quiebra pasa por el árbol E-01→E-05: siempre hay decisión antes del final.
- ⚠️ Para F3 (simulador): calibrar que las cartas con expectativa negativa intencional (V-16 token, P-02 restaurante, F-05 SPAC) no se sientan trampa — el % está a la vista, el jugador elige con los ojos abiertos.

*Misma mecánica de revisión: ✅ / ✏️ / ❌ carta por carta. Con tu devolución de los dos lotes cierro F1 y armo los JSON para F2.*
