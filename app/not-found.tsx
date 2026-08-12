import Link from "next/link";

/* 404 amigable: en el tono del juego, siempre con salida al landing. */
export default function NotFound() {
  return (
    <div className="app">
      <div className="col">
        <div className="err404">
          <div className="cod">404 ▼</div>
          <h2>Esta página no cotiza.</h2>
          <p>El link que seguiste no existe o ya cerró sus puertas. Tu carrera, en cambio, te está esperando.</p>
          <Link href="/" className="btn pri">Fundar mi marca →</Link>
        </div>
      </div>
    </div>
  );
}
