"use client";
/* ============================================================
   TU CARRERA EMPRENDEDORA — front v2 "Densidad Copero"
   (docs/UI-SPEC-v2-densidad-copero.md — manda sobre specs previos)
   Tabla SIEMPRE visible · píldora OVR saturada · Framer Motion:
   springs, odómetro, cascada, bottom-sheet, tensión de reveal.
   ============================================================ */
import { useEffect, useReducer, useRef, useState } from "react";
import { AnimatePresence, MotionConfig, animate, motion, useReducedMotion } from "framer-motion";
import {
  createGame, chooseOption, advanceTurn, hudData, cardTePaso, TURN_YEARS, shareDesafio,
} from "@/lib/game/state.js";
import {
  VERTICALS_META, HQS_META, CAPITALES_META, EMOJIS, COLORS, NOMBRES,
  fmtUSD, ovrTier, ERA_NOMBRES, climaEmoji, EDAD_INICIAL, ETAPAS,
} from "@/lib/game/meta.js";
import { etapaIdx } from "@/lib/engine/index.js";
import { TODOS_ARQUETIPOS } from "@/lib/game/arquetipos.js";
import { COPAS, copasDePartida, actualizarVitrina, cargarVitrina } from "@/lib/game/vitrina.js";

/* eslint-disable @typescript-eslint/no-explicit-any */
type GS = any;

const SPRING = { type: "spring", stiffness: 400, damping: 17 } as const;

const randSeed = () =>
  Array.from({ length: 6 }, () => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[Math.floor(Math.random() * 32)]).join("");

const CAP_RW: Record<string, string> = { boot: "6 meses de caja", fff: "14 meses de caja · -8% eq", vc: "20 meses de caja · -15% eq" };

/* Todo lo tocable responde con spring (§3), sin excepción. */
function MBtn({ className, onClick, disabled, style, children }: any) {
  return (
    <motion.button
      className={className} onClick={onClick} disabled={disabled} style={style}
      whileTap={{ scale: 0.96 }} whileHover={{ scale: 1.02 }} transition={SPRING}
    >
      {children}
    </motion.button>
  );
}

/* Odómetro (§3): OVR/Valuación/ARR/PAT nunca cambian en seco. */
function useOdometer(value: number, fmt: (n: number) => string, fromZero = false) {
  const [txt, setTxt] = useState(() => fmt(fromZero ? 0 : value));
  const prev = useRef(fromZero ? 0 : value);
  const reduced = useReducedMotion();
  useEffect(() => {
    const from = prev.current;
    prev.current = value;
    if (from === value || reduced) { setTxt(fmt(value)); return; }
    const controls = animate(from, value, { duration: 0.45, ease: "easeOut", onUpdate: (v: number) => setTxt(fmt(v)) });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, reduced]);
  return txt;
}

function Ticker({ clima, frozen }: { clima: number; frozen?: boolean }) {
  const up = clima >= 0;
  const syms = ["PLYX", "KUAL", "NXBI", "MELI*", "TECH", "LATM", "SAAS", "FNTX", "ORBT", "WAIR"];
  const items = syms.map((s, i) => {
    const pos = up ? i % 3 !== 0 : i % 3 === 0;
    const n = ((i * 7 + 3) % 40) / 10 + 0.4;
    return (
      <span key={s} style={{ color: pos ? "var(--up)" : "var(--down)" }}>
        {s} {pos ? "▲" : "▼"}{n.toFixed(1)}%
      </span>
    );
  });
  return <div className="ticker"><div className={"tape" + (frozen ? " frozen" : "")}>{items}{items}</div></div>;
}

function Spark({ hist }: { hist: number[] }) {
  const w = 84, h = 16;
  const max = Math.max(...hist), min = Math.min(...hist);
  const pts = hist
    .map((v, i) => `${(i / (hist.length - 1 || 1)) * w},${h - ((v - min) / (max - min || 1)) * (h - 4) - 2}`)
    .join(" ");
  const upTrend = hist[hist.length - 1] >= hist[0];
  return (
    <svg className="spark" width={w} height={h}>
      <polyline points={pts} fill="none" stroke={upTrend ? "var(--up)" : "var(--down)"} strokeWidth="1.5" />
    </svg>
  );
}

/* Píldora OVR (§1, spec exacta): número oscuro black sobre fondo saturado. */
function OvrPill({ v, size }: { v: number; size?: "grande" | "pico" }) {
  const t = ovrTier(v);
  const odo = useOdometer(v, (n) => String(Math.round(n)));
  return <span className={`pill p-${t}${size ? " " + size : ""}`}>{odo}</span>;
}

/* Chip de año coloreado por etapa (§1). */
const ETAPA_CLASS: Record<string, string> = {
  Garage: "e-garage", Seed: "e-seed", "Serie A": "e-serieA", "Serie B": "e-serieB",
  "Serie C": "e-serieC", Gigante: "e-serieC", "Pública": "e-publica", Retiro: "e-retiro",
};

function Fila({ row, delay = 0 }: { row: any; delay?: number }) {
  return (
    <motion.div
      className="trow"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 24, delay }}
    >
      <span className={"yrchip " + (ETAPA_CLASS[row.etapa] || "")}>{row.year}</span>
      <span className="empresa">
        <span className="logo" style={{ background: (row.color || "#333") + "26" }}>{row.emoji}</span>
        {row.name}{" "}
        {row.markers.map((m: string) => (
          <span key={m} style={{ color: m === "🔁" ? "var(--up)" : "var(--down)", fontSize: 11 }}>{m}</span>
        ))}
        <span className="hito-inline">{row.hitos.join(" ")}</span>
      </span>
      <span style={{ textAlign: "center" }}>{row.playa ? "" : <OvrPill v={row.ovr} />}</span>
      <span className="arrv">
        {row.playa ? fmtUSD(row.pat) : row.arr ? fmtUSD(row.arr) : "—"}
        {row.down && <span style={{ color: "var(--down)" }}>▼</span>}
      </span>
    </motion.div>
  );
}

/* Copas y escudos SVG propios (nunca Lucide para trofeos — §4). */
function CopaSVG({ id, ganada, size = 34 }: { id: string; ganada: boolean; size?: number }) {
  const c = ganada ? "var(--gold)" : "#3a4150";
  const s = { fill: "none", stroke: c, strokeWidth: 2.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const glifos: Record<string, React.ReactNode> = {
    millon: <><circle cx="20" cy="16" r="10" {...s} /><path d="M20 10v12M16.5 13.5h5a2.5 2.5 0 010 5h-3a2.5 2.5 0 000 5h5" {...s} strokeWidth={2} /><path d="M12 34h16M14 30h12" {...s} /></>,
    decena: <><path d="M8 26L16 16l6 5 9-12" {...s} /><path d="M25 9h6v6" {...s} /><path d="M12 34h16" {...s} /></>,
    cien: <><circle cx="13" cy="14" r="4.5" {...s} /><circle cx="27" cy="14" r="4.5" {...s} /><circle cx="20" cy="23" r="4.5" {...s} /><path d="M12 34h16" {...s} /></>,
    unicornio: <><path d="M12 10h16v6a8 8 0 01-16 0z" {...s} /><path d="M20 4l2.5 6h-5z" {...s} /><path d="M16 28h8M20 24v4M12 34h16" {...s} /></>,
    campana: <><path d="M20 6c6 0 8 5 8 10 0 5 2 7 3 8H9c1-1 3-3 3-8 0-5 2-10 8-10z" {...s} /><path d="M17 28a3 3 0 006 0M12 34h16" {...s} /></>,
    salvavidas: <><circle cx="20" cy="18" r="11" {...s} /><circle cx="20" cy="18" r="4.5" {...s} /><path d="M20 7v6.5M20 22.5V29M9 18h6.5M24.5 18H31" {...s} strokeWidth={2} /><path d="M12 34h16" {...s} /></>,
    desierto: <><circle cx="27" cy="10" r="4" {...s} /><path d="M13 25c0-6 1-12 1-12M14 17c-3 0-4-2-4-4M14 20c3 0 4-2 4-4" {...s} /><path d="M6 28c5-3 10-3 14 0s9 3 14 0" {...s} strokeWidth={2} /><path d="M12 34h16" {...s} /></>,
    martillo: <><path d="M10 12l6-5 5 6-6 5z" {...s} /><path d="M18 16l11 12" {...s} /><path d="M12 34h16" {...s} /></>,
    exit: <><path d="M10 8h12v20H10z" {...s} /><path d="M25 14l6 4-6 4M22 18h9" {...s} strokeWidth={2} /><path d="M12 34h16" {...s} /></>,
    segundo: <><path d="M27 12a10 10 0 10 3 8" {...s} /><path d="M30 5v7h-7" {...s} /><path d="M12 34h16" {...s} /></>,
    remador: <><path d="M8 28L28 8" {...s} /><path d="M26 6l6 2-2 6c-3 1-5-1-4-4z" {...s} strokeWidth={2} /><path d="M12 34h16" {...s} /></>,
    reposera: <><path d="M20 6v18M20 6c-7 0-12 5-13 11l13-2 13 2C32 11 27 6 20 6z" {...s} /><path d="M12 30l4-5M28 30l-4-5M12 34h16" {...s} strokeWidth={2} /></>,
  };
  return (
    <svg width={size} height={size + 4} viewBox="0 0 40 38" aria-hidden>
      {glifos[id] || glifos.millon}
    </svg>
  );
}

function EscudoSVG({ ticker, on, size = 44 }: { ticker: string; on: boolean; size?: number }) {
  const c = on ? "var(--viol)" : "#3a4150";
  return (
    <svg width={size} height={size * 1.14} viewBox="0 0 44 50" aria-hidden>
      <path d="M22 2L40 8v16c0 12-8 19-18 24C12 43 4 36 4 24V8z" fill={on ? "rgba(167,139,250,.10)" : "rgba(58,65,80,.12)"} stroke={c} strokeWidth="2.4" strokeLinejoin="round" />
      <text x="22" y="29" textAnchor="middle" fontSize="10.5" fontWeight="800" fill={c} fontFamily="var(--font-mono), monospace">{ticker}</text>
    </svg>
  );
}

function HudValuacion({ val, hist, publica }: { val: number; hist: number[]; publica: boolean }) {
  const odo = useOdometer(val, fmtUSD);
  return (
    <div className="stat">
      <div className="k">{publica ? "Mkt cap" : "Valuación"}</div>
      <div className="v">{odo}</div>
      <Spark hist={hist} />
    </div>
  );
}

function PatOdo({ pat }: { pat: number }) {
  const odo = useOdometer(pat, fmtUSD, true);
  return <p className="mini mono">Patrimonio personal: {odo}</p>;
}

export default function Game() {
  const [screen, setScreen] = useState<"landing" | "setup" | "game" | "end">("landing");
  const [seedStr, setSeedStr] = useState("");
  const [seedInput, setSeedInput] = useState("");
  const [setup, setSetup] = useState({ empresa: "", apellido: "", emoji: "🚀", color: COLORS[0], vertical: "", hq: "", capital: "" });
  const [step, setStep] = useState(0);
  const [showName, setShowName] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [pendingOp, setPendingOp] = useState<string | null>(null);
  const [formato, setFormato] = useState<"45" | "916">("45");
  const [vitrina, setVitrina] = useState<{ copas: string[]; arquetipos: string[]; partidas: number }>({ copas: [], arquetipos: [], partidas: 0 });
  const gsRef = useRef<GS>(null);
  const [, bump] = useReducer((x: number) => x + 1, 0);
  const reduced = useReducedMotion();

  useEffect(() => {
    setSeedStr(randSeed());
    const s = new URLSearchParams(window.location.search).get("s");
    if (s && /^[A-Z2-9]{6}$/.test(s.toUpperCase())) setSeedInput(s.toUpperCase());
    const v = cargarVitrina();
    setVitrina({ copas: v.copas, arquetipos: v.arquetipos, partidas: v.partidas });
    if (v.setup?.empresa) setSetup(v.setup);
  }, []);

  /* Al resolver, la sheet baja sola al resultado + Continuar. */
  useEffect(() => {
    if (gsRef.current?.phase === "resolved") {
      const el = document.querySelector(".sheet");
      el?.scrollTo({ top: el.scrollHeight, behavior: reduced ? "auto" : "smooth" });
    }
  });

  const gs: GS = gsRef.current;

  const startGame = (sd: string, s = setup) => {
    gsRef.current = createGame(sd, s);
    try { window.history.replaceState(null, "", "?s=" + sd); } catch { /* sandbox */ }
    setPendingOp(null);
    setScreen("game");
    bump();
  };
  /* Reveal con tensión (§3): tap → 500-700ms de suspenso → outcome. */
  const onChoose = (opId: string) => {
    if (!gs || gs.phase !== "decision" || pendingOp) return;
    const op = gs.card.opciones.find((o: any) => o.id === opId);
    const delay = reduced ? 0 : op?.apuesta ? 500 + Math.random() * 200 : 200;
    setPendingOp(opId);
    window.setTimeout(() => {
      chooseOption(gs, opId);
      setPendingOp(null);
      bump();
    }, delay);
  };
  const onContinue = () => {
    if (!gs || gs.phase !== "resolved") return;
    advanceTurn(gs);
    if (gs.phase === "end") {
      const v = actualizarVitrina(gs);
      setVitrina({ copas: v.copas, arquetipos: v.arquetipos, partidas: v.partidas });
      setScreen("end");
    }
    bump();
  };
  const copy = (txt: string, tag: string) => {
    navigator.clipboard?.writeText(txt).then(() => {
      setCopied(tag);
      setTimeout(() => setCopied(null), 1600);
    });
  };

  /* ---------- Landing ---------- */
  if (screen === "landing")
    return (
      <MotionConfig reducedMotion="user">
      <div className="app"><div className="col">
        <Ticker clima={1} />
        <div className="brand"><h1>Tu Carrera Emprendedora</h1><span>por Parlyx AI</span></div>
        <div style={{ marginTop: 26 }}>
          <div className="statline">El <span className="down">27%</span> quiebra.</div>
          <div className="statline">El <span className="up">3%</span> toca la campana.</div>
          <div className="vos">¿Vos?</div>
        </div>
        <p className="landquote">33 años de startup. 11 decisiones.<br />Una carrera que es toda tuya.</p>
        <MBtn className="btn pri" onClick={() => { setSeedStr(randSeed()); setStep(0); setScreen("setup"); }}>Fundar mi empresa →</MBtn>
        <div className="seedbox">
          <input
            className="input mono" placeholder="¿Te retaron? Pegá la seed" maxLength={6} value={seedInput}
            onChange={(e) => setSeedInput(e.target.value.toUpperCase())} style={{ flex: 1 }}
          />
          <MBtn
            className="btn sec" style={{ width: "auto", padding: "0 18px" }}
            onClick={() => { if (seedInput.length === 6) { setSeedStr(seedInput); setStep(0); setScreen("setup"); } }}
          >Jugar</MBtn>
        </div>
        {vitrina.partidas > 0 && (
          <p className="mini mono">
            Vitrina {vitrina.copas.length}/{COPAS.length} · Arquetipos {vitrina.arquetipos.length}/8 · {vitrina.partidas} carreras
          </p>
        )}
      </div></div>
      </MotionConfig>
    );

  /* ---------- Setup ---------- */
  if (screen === "setup") {
    const steps = [
      <div key="0" className="setup">
        <h2>Tu empresa</h2><p className="sub">La camiseta con la que salís a la cancha.</p>
        <span className="label">Nombre</span>
        <div style={{ display: "flex", gap: 8 }}>
          <input className="input" maxLength={14} value={setup.empresa} placeholder="Zentra"
            onChange={(e) => setSetup({ ...setup, empresa: e.target.value })} style={{ flex: 1 }} />
          <MBtn className="btn sec" style={{ width: "auto", padding: "0 14px" }}
            onClick={() => setSetup({ ...setup, empresa: NOMBRES[Math.floor(Math.random() * NOMBRES.length)] })}>🎲</MBtn>
        </div>
        <span className="label">Tu apellido (para la tarjeta)</span>
        <input className="input" maxLength={16} value={setup.apellido} placeholder="Lamedica"
          onChange={(e) => setSetup({ ...setup, apellido: e.target.value })} />
        <span className="label">Logo</span>
        <div className="swatches">{EMOJIS.map((e) => (
          <div key={e} className={"sw" + (setup.emoji === e ? " on" : "")} style={{ background: "var(--panel)" }}
            onClick={() => setSetup({ ...setup, emoji: e })}>{e}</div>
        ))}</div>
        <span className="label">Color</span>
        <div className="swatches">{COLORS.map((c) => (
          <div key={c} className={"sw" + (setup.color === c ? " on" : "")} style={{ background: c }}
            onClick={() => setSetup({ ...setup, color: c })} />
        ))}</div>
      </div>,
      <div key="1" className="setup">
        <h2>El rubro</h2><p className="sub">= tu exposición al ciclo.</p>
        <div className="grid2">{VERTICALS_META.map((v) => (
          <div key={v.id} className={"tile" + (setup.vertical === v.id ? " on" : "")}
            onClick={() => setSetup({ ...setup, vertical: v.id })}>
            <div className="e">{v.emoji}</div><div className="n">{v.label}</div><div className="s">{v.nota}</div>
          </div>
        ))}</div>
      </div>,
      <div key="2" className="setup">
        <h2>El HQ</h2><p className="sub">Dónde arrancás. Después el mapa se agranda.</p>
        <div className="grid2">{HQS_META.map((h) => (
          <div key={h.id} className={"tile" + (setup.hq === h.id ? " on" : "")}
            onClick={() => setSetup({ ...setup, hq: h.id })}>
            <div className="e">{h.flag}</div><div className="n">{h.label}</div>
          </div>
        ))}</div>
      </div>,
      <div key="3" className="setup">
        <h2>Con cuánto arrancás</h2><p className="sub">= la dificultad.</p>
        {CAPITALES_META.map((c) => (
          <div key={c.id} className={"capital" + (setup.capital === c.id ? " on" : "")}
            onClick={() => setSetup({ ...setup, capital: c.id })}>
            <div className="row"><b>{c.label}</b><span className="monto">{c.monto}</span></div>
            <div className="row"><span className="nar">{c.narrativa}</span><span className="rw">{CAP_RW[c.id]}</span></div>
          </div>
        ))}
      </div>,
    ];
    const canNext = [setup.empresa.trim().length > 0, !!setup.vertical, !!setup.hq, !!setup.capital][step];
    return (
      <MotionConfig reducedMotion="user">
      <div className="app"><div className="col">
        <Ticker clima={1} />
        <div className="brand"><h1>Tu Carrera Emprendedora</h1><span>{step + 1}/4</span></div>
        {steps[step]}
        <div style={{ marginTop: 18 }}>
          <MBtn className="btn pri" disabled={!canNext} style={{ opacity: canNext ? 1 : 0.4 }}
            onClick={() => { if (step < 3) setStep(step + 1); else startGame(seedStr); }}>
            {step < 3 ? "Siguiente" : `Fundar en 1993 (a los ${EDAD_INICIAL}) →`}
          </MBtn>
          <MBtn className="btn sec" onClick={() => (step > 0 ? setStep(step - 1) : setScreen("landing"))}>Volver</MBtn>
        </div>
      </div></div>
      </MotionConfig>
    );
  }

  /* ---------- Juego (§2): ticker · HUD · era · TABLA COMPLETA · sheet ---------- */
  if (screen === "game" && gs) {
    const hud = hudData(gs);
    const card = gs.card;
    const isTP = cardTePaso(gs);
    const isEmergency = card?.bloque === "emergencia";
    const isPost = card?.sintetica && card.id === "PX-01";
    const isPlaya = card?.bloque === "playa";
    const etapaActual = gs.mode === "playa" ? "Retiro" : gs.g.public ? "Pública" : ETAPAS[etapaIdx(gs.g.val)];
    return (
      <MotionConfig reducedMotion="user">
      <div className="app"><div className="col ingame">
        <Ticker clima={hud.era.clima} frozen={!!pendingOp} />
        <div className="hudrow">
          <OvrPill v={hud.ovr} size="grande" />
          <HudValuacion val={hud.val} hist={gs.hist} publica={hud.public} />
          <div className="stat">
            <div className="k">Runway</div>
            <div className="v" style={{ color: hud.runway <= 6 && !hud.public && !hud.cfPositivo ? "var(--down)" : "inherit" }}>
              {hud.public ? "—" : hud.cfPositivo ? "CF+" : hud.runway + "m"}
            </div>
          </div>
          <div className="stat">
            <div className="k">Founder</div>
            <div className="v">{hud.eq}%</div>
          </div>
        </div>
        <div className="era">
          <span><b>{climaEmoji(hud.era.clima)}</b> {ERA_NOMBRES.get(hud.year) || "…"}</span>
          <span className="mono">MULT {hud.era.mult}x · {hud.era.capital.toUpperCase()}</span>
        </div>
        {/* LA TABLA — siempre visible completa (§0, regla nueva) */}
        <div className="tabla">
          <div className="thead"><span>Año</span><span>Empresa</span><span style={{ textAlign: "center" }}>OVR</span><span style={{ textAlign: "right" }}>ARR</span></div>
          {TURN_YEARS.map((y: number, i: number) => {
            const row = gs.rows.find((r: any) => r.year === y);
            if (row) return <Fila key={y} row={row} />;
            if (i === gs.g.ti)
              return (
                <div className="trow actual" key={y}>
                  <span className={"yrchip " + (ETAPA_CLASS[etapaActual] || "")}>{y}</span>
                  <span className="empresa" style={{ color: "var(--dim)", fontWeight: 500 }}>Decidiendo…</span>
                  <span style={{ textAlign: "center" }}><OvrPill v={gs.g.ovr} /></span>
                  <span className="arrv" />
                </div>
              );
            return <div className="trow ghost" key={y}><span className="yrchip">{y}</span><span /><span /><span /></div>;
          })}
          <div className="trow ghost"><span className="yrchip">2026</span><span className="empresa" style={{ fontWeight: 500 }}>Balance final</span><span /><span /></div>
        </div>
        {gs.momentum != null && gs.phase === "decision" && Math.abs(gs.momentum) > 1 && (
          <p className="mini mono" style={{ color: gs.momentum > 1 ? "var(--up)" : "var(--down)", marginTop: 6 }}>
            {gs.momentum > 1 ? "El mercado te empuja ▲" : "Viento de frente ▼"}
          </p>
        )}

        {/* CARTA = bottom-sheet con rebote; la anterior sale a la izquierda (§3) */}
        <div className="sheetwrap">
          <AnimatePresence mode="popLayout" initial={false}>
            {card && (
              <motion.div
                className="sheet"
                key={card.id + ":" + gs.g.ti + ":" + gs.rows.length}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ x: -80, opacity: 0, pointerEvents: "none" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="top">
                  <span className="yearbig">{hud.year}</span>
                  {isEmergency ? (
                    <span className="tepaso" style={{ background: "#7A1F27", color: "#FFD9DC" }}>EMERGENCIA</span>
                  ) : isPost ? (
                    <span className="tepaso" style={{ background: "#1F5C46", color: "#D7FFE9" }}>EXIT</span>
                  ) : isPlaya ? (
                    <span className="tepaso" style={{ background: "#0E4C56", color: "#C8F4FF" }}>PLAYA</span>
                  ) : isTP ? (
                    <span className="tepaso">TE PASÓ</span>
                  ) : null}
                </div>
                <h2>{card.titulo}</h2>
                <p className="flavor">{card.flavor}</p>
                {card.opciones.map((o: any, i: number) => {
                  const state =
                    pendingOp ? (pendingOp === o.id ? " pending" : " dimmed")
                    : gs.chosen == null ? ""
                    : gs.chosen === o.id ? (gs.result ? (gs.result.good ? (gs.result.critico ? " win goldwin" : " win") : " lose") : " win")
                    : " dimmed";
                  return (
                    <motion.button key={o.id} className={"opt" + state} onClick={() => onChoose(o.id)}
                      whileTap={{ scale: 0.96 }} whileHover={{ scale: 1.02 }} transition={SPRING}>
                      <span className="l"><span className="letra">{String.fromCharCode(65 + i)}</span>{o.label}</span>
                      <span className="d">
                        {o.raw}
                        {o.apuesta && (
                          <span className="betpill">
                            <span className="g">{Math.round(o.apuesta.p * 100)}%</span> / <span className="r">{Math.round((1 - o.apuesta.p) * 100)}%</span>
                          </span>
                        )}
                      </span>
                    </motion.button>
                  );
                })}
                {gs.result && !pendingOp && (
                  <motion.div
                    className={"result " + (gs.result.critico ? "critico" : gs.result.good ? "good" : "bad")}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={gs.result.critico ? { scale: [0.9, 1.15, 1], opacity: 1 } : { scale: 1, opacity: 1 }}
                    transition={{ duration: 0.45 }}
                  >
                    {gs.result.critico ? "★ DORADA — efecto ×2 · " : gs.result.good ? "▲ " : "▼ "}{gs.result.texto}
                  </motion.div>
                )}
                {gs.phase === "resolved" && !pendingOp && (
                  <div style={{ padding: "0 12px 14px" }}>
                    <MBtn className="btn pri" onClick={onContinue}>Continuar →</MBtn>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div></div>
      </MotionConfig>
    );
  }

  /* ---------- Final (§5): tabla protagonista → vitrina → casi → Otra carrera ---------- */
  if (screen === "end" && gs) {
    const e = gs.endInfo;
    const g = gs.g;
    const camisetas: { emoji: string; name: string }[] = [];
    for (const r of gs.rows) {
      const last = camisetas[camisetas.length - 1];
      if (!last || last.name !== r.name) camisetas.push({ emoji: r.emoji, name: r.name });
    }
    const arrPeak = Math.max(...gs.rows.map((r: any) => r.arr || 0), 0);
    const copasEsta = copasDePartida(gs);
    const nRows = gs.rows.length;
    const copasBase = nRows * 0.09 + 0.35;
    const selloDelay = copasBase + copasEsta.size * 0.22 + 0.25;
    const shareUrl = typeof window !== "undefined" ? `${window.location.origin}${window.location.pathname}?s=${gs.seedStr}` : "";
    const desafio = shareDesafio(gs, shareUrl);
    let copaIdx = 0;
    return (
      <MotionConfig reducedMotion="user">
      <div className="app"><div className="col">
        <Ticker clima={["digna", "escandalo", "playa0"].includes(e.key) ? -2 : 1} />
        <div className="brand"><h1>Carrera finalizada</h1><span>Compartí tu tarjeta</span></div>

        <div className="formato-toggle">
          <button className={formato === "45" ? "on" : ""} onClick={() => setFormato("45")}>Feed 4:5</button>
          <button className={formato === "916" ? "on" : ""} onClick={() => setFormato("916")}>Story 9:16</button>
        </div>

        <div className={"sharecard" + (formato === "916" ? " story" : "")}>
          {/* Sello del mote: acompaña a la tabla, no la tapa */}
          <motion.div
            className="sello mote-badge"
            initial={{ scale: 2.6, opacity: 0, rotate: 7 }}
            animate={{ scale: 1, opacity: 1, rotate: 7 }}
            transition={{ type: "spring", stiffness: 260, damping: 18, delay: selloDelay }}
          >
            <EscudoSVG ticker={gs.mote.ticker} on size={56} />
          </motion.div>

          {/* LA TABLA — protagonista del screenshot, cascada con física */}
          <div className="tabla">
            <div className="thead"><span>Año</span><span>Empresa</span><span style={{ textAlign: "center" }}>OVR</span><span style={{ textAlign: "right" }}>ARR</span></div>
            {gs.rows.map((row: any, i: number) => <Fila key={row.year} row={row} delay={i * 0.09} />)}
          </div>

          <div className="sc-head">
            <OvrPill v={g.ovrPeak} size="pico" />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", gap: 7, alignItems: "center", flexWrap: "wrap" }}>
                <span className="logo" style={{ background: gs.coColor + "33", width: 24, height: 24, fontSize: 14 }}>{gs.coEmoji}</span>
                <b style={{ fontSize: 17 }}>{gs.exits.length && gs.coN > 1 ? gs.exits[0].name + " → " + gs.coName : gs.coName}</b>
                <span>{HQS_META.find((h) => h.id === gs.hq)?.flag}</span>
                <span className="chip">{VERTICALS_META.find((v) => v.id === gs.setup.vertical)?.label}</span>
              </div>
              <div className="mono" style={{ color: "var(--dim)", fontSize: 12, marginTop: 4 }}>
                VALUACIÓN PICO <b style={{ color: "var(--up)" }}>{fmtUSD(g.valPeak)}</b>
              </div>
              <div style={{ fontSize: 12, marginTop: 3 }}>
                <b style={{ color: "var(--viol)" }}>{gs.mote.nombre}</b>
                <span style={{ color: "var(--dim)" }}> — {gs.mote.linea}</span>
              </div>
              {showName && gs.setup.apellido && (
                <div style={{ color: "var(--dim)", fontSize: 12, marginTop: 2 }}>Fundada por {gs.setup.apellido}</div>
              )}
            </div>
          </div>

          <div className="sc-stats">
            <div><div className="k">AÑOS</div><div className="v">{nRows * 3}</div></div>
            <div><div className="k">ARR PICO</div><div className="v">{fmtUSD(arrPeak)}</div></div>
            <div><div className="k">EQUIPO</div><div className="v">{g.empPeak}</div></div>
            <div><div className="k">FOUNDER</div><div className="v">{Math.round(g.eq)}%</div></div>
          </div>

          <div className="sc-sec">Trayectoria</div>
          <div className="tray">{camisetas.map((c, i) => (
            <span className="chip" key={i}>{c.emoji} {c.name}</span>
          ))}</div>

          <div className="finaltxt">{e.emoji} {e.titulo}</div>
          {g.pat > 0 && <PatOdo pat={g.pat} />}
          <div className="sc-foot">
            <span>Jugá la tuya · <b style={{ color: "var(--ink)" }}>Tu Carrera Emprendedora</b> por Parlyx AI</span>
            <span className="mono">seed {gs.seedStr}</span>
          </div>
        </div>

        <div className="vitrina">
          <h3>Vitrina · <span className="cnt">{vitrina.copas.length}/{COPAS.length}</span></h3>
          <div className="copas-grid">
            {COPAS.map((c) => {
              const enColeccion = vitrina.copas.includes(c.id);
              const nueva = copasEsta.has(c.id);
              const d = nueva ? copasBase + copaIdx++ * 0.22 : 0;
              return (
                <motion.div key={c.id} className={"copa" + (enColeccion ? "" : " lock") + (nueva ? " nueva" : "")}
                  initial={nueva ? { scale: 0, opacity: 0 } : false}
                  animate={nueva ? { scale: [0, 1.2, 1], opacity: 1 } : {}}
                  transition={nueva ? { delay: d, duration: 0.45, times: [0, 0.6, 1] } : undefined}
                  title={c.detalle}>
                  <CopaSVG id={c.id} ganada={enColeccion} />
                  <span className="nom">{c.nombre}</span>
                </motion.div>
              );
            })}
          </div>
          <h3 style={{ marginTop: 14 }}>Formas de fundar · <span className="cnt">{vitrina.arquetipos.length}/8</span></h3>
          <div className="escudos-grid">
            {TODOS_ARQUETIPOS.filter((a) => a.id !== "enigma").map((a) => {
              const on = vitrina.arquetipos.includes(a.id);
              return (
                <div key={a.id} className={"escudo" + (on ? "" : " lock")} title={on ? a.linea : "¿Cómo se juega esto?"}>
                  <EscudoSVG ticker={on ? a.ticker : "$???"} on={on} size={38} />
                  <span className="nom">{on ? a.nombre : "———"}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="casi">{gs.casi}</div>

        <div className="toggle">
          <span>Mostrar mi nombre</span>
          <div className={"sw2" + (showName ? " on" : "")} onClick={() => setShowName(!showName)}><div className="dot" /></div>
        </div>
        <div style={{ marginTop: 12 }}>
          <MBtn className="btn pri" onClick={() => startGame(randSeed())}>Otra carrera</MBtn>
          <MBtn className="btn sec" onClick={() => copy(desafio, "desafio")}>{copied === "desafio" ? "✓ Copiado" : "Copiar desafío (con mi seed)"}</MBtn>
          <MBtn className="btn sec" onClick={() => startGame(gs.seedStr)}>Revancha (misma seed)</MBtn>
          <MBtn className="btn sec" onClick={() => { setSeedStr(randSeed()); setStep(0); setScreen("setup"); }}>Cambiar setup</MBtn>
        </div>
      </div></div>
      </MotionConfig>
    );
  }
  return null;
}
