"use client";
/* ============================================================
   TU CARRERA EMPRENDEDORA — front F2
   Port de reference/prototipo-ui-v0.2.jsx sobre el motor REAL
   (lib/engine) y el deck REAL (data/cards vía lib/game).
   ============================================================ */
import { useEffect, useReducer, useRef, useState } from "react";
import {
  createGame, chooseOption, advanceTurn, hudData, cardTePaso, TURN_YEARS,
} from "@/lib/game/state.js";
import {
  VERTICALS_META, HQS_META, CAPITALES_META, EMOJIS, COLORS, NOMBRES,
  LOGROS_INFO, fmtUSD, ovrTier, ERA_NOMBRES, climaEmoji, EDAD_INICIAL,
} from "@/lib/game/meta.js";

/* eslint-disable @typescript-eslint/no-explicit-any */
type GS = any;

const randSeed = () =>
  Array.from({ length: 6 }, () => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[Math.floor(Math.random() * 32)]).join("");

const CAP_RW: Record<string, string> = { boot: "6 meses de caja", fff: "14 meses de caja · -8% eq", vc: "20 meses de caja · -15% eq" };

function Ticker({ clima }: { clima: number }) {
  const up = clima >= 0;
  const syms = ["PLYX", "KUAL", "NXBI", "MELI*", "TECH", "LATM", "SAAS", "FNTX", "ORBT", "WAIR"];
  const items = syms.map((s, i) => {
    const pos = up ? i % 3 !== 0 : i % 3 === 0;
    const n = ((i * 7 + 3) % 40) / 10 + 0.4;
    return (
      <span key={s} style={{ color: pos ? "var(--up)" : "var(--down)" }}>
        {s} {pos ? "▲" : "▼"}
        {n.toFixed(1)}%
      </span>
    );
  });
  return (
    <div className="ticker">
      <div className="tape">{items}{items}</div>
    </div>
  );
}

function Spark({ hist }: { hist: number[] }) {
  const w = 92, h = 22;
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

function OvrPill({ v }: { v: number }) {
  const t = ovrTier(v);
  const bg: Record<string, string> = { bronce: "#3a2a18", plata: "#262b33", dorado: "#3d3006", violeta: "#2b2151" };
  const co: Record<string, string> = { bronce: "var(--bronze)", plata: "#C7CFDA", dorado: "var(--gold)", violeta: "var(--viol)" };
  return <span className="pill" style={{ background: bg[t], color: co[t] }}>{v}</span>;
}

function Fila({ row }: { row: any }) {
  return (
    <div className="trow">
      <span className="yr">{row.year}</span>
      <span className="empresa">
        <span className="logo" style={{ background: (row.color || "#333") + "22" }}>{row.emoji}</span>
        {row.name}{" "}
        {row.markers.map((m: string) => (
          <span key={m} style={{ color: m === "🔁" ? "var(--up)" : "var(--down)" }}>{m}</span>
        ))}
        <span className="hito-inline">{row.hitos.join(" ")}</span>
      </span>
      <span style={{ textAlign: "center" }}>{row.playa ? "" : <OvrPill v={row.ovr} />}</span>
      <span className="arrv">
        {row.playa ? fmtUSD(row.pat) : row.arr ? fmtUSD(row.arr) : "—"}
        {row.down && <span style={{ color: "var(--down)" }}>▼</span>}
      </span>
    </div>
  );
}

export default function Game() {
  const [screen, setScreen] = useState<"landing" | "setup" | "game" | "end">("landing");
  const [seedStr, setSeedStr] = useState("");
  const [seedInput, setSeedInput] = useState("");
  const [setup, setSetup] = useState({ empresa: "", apellido: "", emoji: "🚀", color: COLORS[0], vertical: "", hq: "", capital: "" });
  const [step, setStep] = useState(0);
  const [showName, setShowName] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const gsRef = useRef<GS>(null);
  const [, bump] = useReducer((x: number) => x + 1, 0);

  useEffect(() => {
    setSeedStr(randSeed());
    const s = new URLSearchParams(window.location.search).get("s");
    if (s && /^[A-Z2-9]{6}$/.test(s.toUpperCase())) setSeedInput(s.toUpperCase());
  }, []);

  const gs: GS = gsRef.current;

  const startGame = (sd: string) => {
    gsRef.current = createGame(sd, setup);
    window.history.replaceState(null, "", "?s=" + sd);
    setScreen("game");
    bump();
  };
  const onChoose = (opId: string) => {
    if (!gs || gs.phase !== "decision") return;
    chooseOption(gs, opId);
    bump();
  };
  const onContinue = () => {
    if (!gs || gs.phase !== "resolved") return;
    advanceTurn(gs);
    if (gs.phase === "end") setScreen("end");
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
      <div className="app"><div className="col">
        <Ticker clima={1} />
        <div className="brand"><h1>Tu Carrera Emprendedora</h1><span>por Parlyx AI</span></div>
        <div className="bigtitle">33 años de startup.<br />11 decisiones.</div>
        <p className="landquote">Fundá en 1993, atravesá cada burbuja y cada crash, y terminá tocando la campana… o vendiendo el auto.</p>
        <button className="btn pri" onClick={() => { setSeedStr(randSeed()); setStep(0); setScreen("setup"); }}>Arrancar carrera</button>
        <div className="seedbox">
          <input
            className="input mono" placeholder="¿Tenés un código? (seed)" maxLength={6} value={seedInput}
            onChange={(e) => setSeedInput(e.target.value.toUpperCase())} style={{ flex: 1 }}
          />
          <button
            className="btn sec" style={{ width: "auto", padding: "0 18px" }}
            onClick={() => { if (seedInput.length === 6) { setSeedStr(seedInput); setStep(0); setScreen("setup"); } }}
          >Jugar</button>
        </div>
        <p className="mini">Motor v1 + deck de 102 cartas · sin servidor · seed compartible</p>
      </div></div>
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
          <button className="btn sec" style={{ width: "auto", padding: "0 14px" }}
            onClick={() => setSetup({ ...setup, empresa: NOMBRES[Math.floor(Math.random() * NOMBRES.length)] })}>🎲</button>
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
      <div className="app"><div className="col">
        <Ticker clima={1} />
        <div className="brand"><h1>Tu Carrera Emprendedora</h1><span>{step + 1}/4</span></div>
        {steps[step]}
        <div style={{ marginTop: 18 }}>
          <button className="btn pri" disabled={!canNext} style={{ opacity: canNext ? 1 : 0.4 }}
            onClick={() => { if (step < 3) setStep(step + 1); else startGame(seedStr); }}>
            {step < 3 ? "Siguiente" : `Fundar en 1993 (a los ${EDAD_INICIAL}) →`}
          </button>
          <button className="btn sec" onClick={() => (step > 0 ? setStep(step - 1) : setScreen("landing"))}>Volver</button>
        </div>
      </div></div>
    );
  }

  /* ---------- Juego ---------- */
  if (screen === "game" && gs) {
    const hud = hudData(gs);
    const card = gs.card;
    const isTP = cardTePaso(gs);
    const isEmergency = card?.bloque === "emergencia";
    const isPost = card?.sintetica;
    const isPlaya = card?.bloque === "playa";
    return (
      <div className="app"><div className="col">
        <Ticker clima={hud.era.clima} />
        <div className="hud">
          <div className="hudgrid">
            <div className={"ovrbox t-" + ovrTier(hud.ovr)}><span className="k">OVR</span><span className="n">{hud.ovr}</span></div>
            <div className="stat">
              <div className="k">{hud.public ? "Mkt cap" : "Valuación"}</div>
              <div className="v">{fmtUSD(hud.val)}</div>
              <Spark hist={gs.hist} />
            </div>
            <div className="stat">
              <div className="k">Runway</div>
              <div className="v" style={{ color: hud.runway <= 6 && !hud.public && !hud.cfPositivo ? "var(--down)" : "inherit" }}>
                {hud.public ? "—" : hud.cfPositivo ? "CF+" : hud.runway + "m"}
              </div>
              <div className="k" style={{ marginTop: 4 }}>ARR</div>
              <div className="v" style={{ fontSize: 11 }}>{hud.arr ? fmtUSD(hud.arr) : "—"}</div>
            </div>
            <div className="stat">
              <div className="k">Founder</div>
              <div className="v">{hud.eq}%</div>
              <div className="k" style={{ marginTop: 4 }}>{hud.pat > 0 ? "Patrimonio" : "Equipo"}</div>
              <div className="v" style={{ fontSize: 11 }}>{hud.pat > 0 ? fmtUSD(hud.pat) : hud.emp}</div>
            </div>
          </div>
        </div>
        <div className="era">
          <span><b>{climaEmoji(hud.era.clima)}</b> {ERA_NOMBRES.get(hud.year) || "…"}</span>
          <span className="mono">MÚLTIPLO {hud.era.mult}x · CAPITAL {hud.era.capital.toUpperCase()}</span>
        </div>
        <div className="tabla">
          <div className="thead"><span>Año</span><span>Empresa</span><span style={{ textAlign: "center" }}>OVR</span><span style={{ textAlign: "right" }}>ARR</span></div>
          {TURN_YEARS.map((y: number, i: number) => {
            const row = gs.rows.find((r: any) => r.year === y);
            if (row) return <Fila key={y} row={row} />;
            if (i === gs.g.ti)
              return (
                <div className="trow actual" key={y}>
                  <span className="yr">{y}</span>
                  <span className="empresa" style={{ color: "var(--dim)" }}>Decidiendo…</span>
                  <span style={{ textAlign: "center" }}><OvrPill v={gs.g.ovr} /></span>
                  <span className="arrv" />
                </div>
              );
            return <div className="trow ghost" key={y}><span className="yr">{y}</span><span /><span /><span /></div>;
          })}
          <div className="trow ghost"><span className="yr">2026</span><span className="empresa">Balance final</span><span /><span /></div>
        </div>
        {gs.momentum != null && gs.phase === "decision" && Math.abs(gs.momentum) > 1 && (
          <p className="mini mono" style={{ color: gs.momentum > 1 ? "var(--up)" : "var(--down)" }}>
            {gs.momentum > 1 ? "El mercado te empuja ▲" : "Viento de frente ▼"}
          </p>
        )}
        {card && (
          <div className="card">
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
                gs.chosen == null ? "" : gs.chosen === o.id ? (gs.result ? (gs.result.good ? " win" : " lose") : " win") : " dimmed";
              return (
                <button key={o.id} className={"opt" + state} onClick={() => onChoose(o.id)}>
                  <span className="l"><span className="letra">{String.fromCharCode(65 + i)}</span>{o.label}</span>
                  <span className="d">
                    {o.raw}
                    {o.apuesta && (
                      <span className="betpill">
                        <span className="g">{Math.round(o.apuesta.p * 100)}%</span> / <span className="r">{Math.round((1 - o.apuesta.p) * 100)}%</span>
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
            {gs.result && (
              <div className={"result " + (gs.result.good ? "good" : "bad")}>
                {gs.result.good ? "▲ " : "▼ "}{gs.result.texto}
              </div>
            )}
            {gs.phase === "resolved" && (
              <div style={{ padding: "0 12px 14px" }}>
                <button className="btn pri" onClick={onContinue}>Continuar →</button>
              </div>
            )}
          </div>
        )}
      </div></div>
    );
  }

  /* ---------- Final + tarjeta ---------- */
  if (screen === "end" && gs) {
    const e = gs.endInfo;
    const g = gs.g;
    // Trayectoria de camisetas (D6/PRD §13): empresas en orden, playa incluida
    const camisetas: { emoji: string; name: string }[] = [];
    for (const r of gs.rows) {
      const last = camisetas[camisetas.length - 1];
      if (!last || last.name !== r.name) camisetas.push({ emoji: r.emoji, name: r.name });
    }
    const arrPeak = Math.max(...gs.rows.map((r: any) => r.arr || 0), 0);
    const shareTxt =
      `${e.emoji} ${e.titulo}\n${gs.coEmoji} ${gs.coName} · OVR pico ${g.ovrPeak} · Valuación pico ${fmtUSD(g.valPeak)}\n` +
      `Hitos: ${Object.entries(gs.logros).map(([k, v]: any) => (v > 1 ? k + "×" + v : k)).join(" ") || "—"}\n` +
      `Jugá la tuya · Tu Carrera Emprendedora por Parlyx AI · seed ${gs.seedStr}`;
    const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/?s=${gs.seedStr}` : "";
    return (
      <div className="app"><div className="col">
        <Ticker clima={["digna", "escandalo", "playa0"].includes(e.key) ? -2 : 1} />
        <div className="brand"><h1>Carrera finalizada</h1><span>Compartí tu tarjeta</span></div>
        <div className="tabla">
          <div className="thead"><span>Año</span><span>Empresa</span><span style={{ textAlign: "center" }}>OVR</span><span style={{ textAlign: "right" }}>ARR</span></div>
          {gs.rows.map((row: any) => <Fila key={row.year} row={row} />)}
        </div>
        <div className="sharecard">
          <div className="sc-head">
            <div className={"ovrbox t-" + ovrTier(g.ovrPeak)} style={{ width: 72, height: 72 }}>
              <span className="k">OVR PICO</span><span className="n">{g.ovrPeak}</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", gap: 7, alignItems: "center", flexWrap: "wrap" }}>
                <span className="logo" style={{ background: gs.coColor + "33", width: 26, height: 26, fontSize: 15 }}>{gs.coEmoji}</span>
                <b style={{ fontSize: 19 }}>{gs.exits.length && gs.coN > 1 ? gs.exits[0].name + " → " + gs.coName : gs.coName}</b>
                <span>{HQS_META.find((h) => h.id === gs.hq)?.flag}</span>
                <span className="chip">{VERTICALS_META.find((v) => v.id === gs.setup.vertical)?.label}</span>
              </div>
              <div className="mono" style={{ color: "var(--dim)", fontSize: 12, marginTop: 5 }}>
                VALUACIÓN PICO <b style={{ color: "var(--up)" }}>{fmtUSD(g.valPeak)}</b>
              </div>
              {showName && gs.setup.apellido && (
                <div style={{ color: "var(--dim)", fontSize: 12, marginTop: 2 }}>Fundada por {gs.setup.apellido}</div>
              )}
            </div>
          </div>
          <div className="sc-stats">
            <div><div className="k">AÑOS</div><div className="v">{gs.rows.length * 3}</div></div>
            <div><div className="k">ARR PICO</div><div className="v">{fmtUSD(arrPeak)}</div></div>
            <div><div className="k">EQUIPO PICO</div><div className="v">{g.empPeak}</div></div>
            <div><div className="k">FOUNDER</div><div className="v">{Math.round(g.eq)}%</div></div>
          </div>
          <div className="sc-sec">Trayectoria</div>
          <div className="tray">{camisetas.map((c, i) => (
            <span className="chip" key={i}>{c.emoji} {c.name}</span>
          ))}</div>
          {Object.keys(gs.logros).length > 0 && (
            <>
              <div className="sc-sec">Hitos</div>
              <div className="hitochips">{Object.entries(gs.logros).map(([k, v]: any) => (
                <span className="hitochip" key={k}>
                  <span className="em">{k}</span>{LOGROS_INFO[k as keyof typeof LOGROS_INFO] || ""}{v > 1 && <span className="xn">×{v}</span>}
                </span>
              ))}</div>
            </>
          )}
          <div className="finaltxt">{e.emoji} {e.titulo}</div>
          {g.pat > 0 && <p className="mini mono">Patrimonio personal: {fmtUSD(g.pat)}</p>}
          <div className="sc-foot">
            <span>Jugá la tuya · <b style={{ color: "var(--ink)" }}>Tu Carrera Emprendedora</b> por Parlyx AI</span>
            <span className="mono">seed {gs.seedStr}</span>
          </div>
        </div>
        <div className="toggle">
          <span>Mostrar mi nombre</span>
          <div className={"sw2" + (showName ? " on" : "")} onClick={() => setShowName(!showName)}><div className="dot" /></div>
        </div>
        <div style={{ marginTop: 16 }}>
          <button className="btn pri" onClick={() => copy(shareTxt, "txt")}>{copied === "txt" ? "✓ Copiado" : "Copiar resultado"}</button>
          <button className="btn sec" onClick={() => copy(shareUrl, "url")}>{copied === "url" ? "✓ Link copiado" : "Copiar link con seed"}</button>
          <button className="btn sec" onClick={() => startGame(gs.seedStr)}>Revancha (misma seed)</button>
          <button className="btn sec" onClick={() => { setSeedStr(randSeed()); setStep(0); setScreen("setup"); }}>Nueva partida</button>
        </div>
      </div></div>
    );
  }
  return null;
}
