/* Landing F2 (esqueleto). Importa el motor real para fijar la arquitectura:
   el front consume lib/engine + data/*.json desde el build estático. */
import { TURN_YEARS, BAL } from "@/lib/engine/index.js";

export default function Landing() {
  const desde = TURN_YEARS[0];
  const hasta = 2026;
  const decisiones = TURN_YEARS.length;

  return (
    <main className="col" style={{ justifyContent: "center", gap: 24, textAlign: "center" }}>
      <header>
        <p
          className="mono"
          style={{ color: "var(--dim)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase" }}
        >
          {desde} → {hasta} · {decisiones} decisiones · OVR techo {BAL.techo.at(-1)![1] + BAL.techo.at(-1)![2] - 1}
        </p>
        <h1 style={{ fontSize: 34, fontWeight: 900, letterSpacing: "-0.02em", lineHeight: 1.05, marginTop: 12 }}>
          TU CARRERA
          <br />
          EMPRENDEDORA
        </h1>
        <p style={{ color: "var(--dim)", fontSize: 13, marginTop: 6 }}>por Parlyx AI</p>
      </header>

      <p style={{ color: "var(--ink)", fontSize: 16, lineHeight: 1.5 }}>
        33 años de carrera emprendedora en 11 decisiones.
        <br />
        Terminás tocando la campana o vendiendo el auto.
      </p>

      <div>
        <button
          disabled
          className="mono"
          style={{
            background: "var(--panel)",
            color: "var(--dim)",
            border: "1px solid var(--line)",
            borderRadius: 999,
            padding: "14px 28px",
            fontSize: 14,
            fontWeight: 700,
            cursor: "not-allowed",
          }}
        >
          ARRANCAR CARRERA — EN CONSTRUCCIÓN (F2)
        </button>
        <p className="mono" style={{ color: "var(--dim)", fontSize: 11, marginTop: 10 }}>
          motor v1 validado · deck 102 cartas · core loop en camino
        </p>
      </div>

      <footer style={{ marginTop: 24 }}>
        <a
          href="https://parlyx.ai"
          className="mono"
          style={{ color: "var(--up)", fontSize: 12, textDecoration: "none" }}
        >
          parlyx.ai →
        </a>
      </footer>
    </main>
  );
}
