import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

/* Serif de la tapa de diario (SPEC v3 §3 marco diario + §4 portada).
   Un solo peso, subset latin: el presupuesto de +40KB del §3 no se negocia. */
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-serif",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
  display: "swap",
});

const TITLE = "Tu Carrera Emprendedora · por Parlyx AI";
const DESC =
  "El 27% quiebra. El 3% toca la campana. ¿Vos? 33 años de tu marca a través de la historia del comercio, en 11 decisiones.";

export const metadata: Metadata = {
  metadataBase: new URL("https://carrera.parlyx.ai"),
  title: TITLE,
  description: DESC,
  alternates: { canonical: "/" },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: "/",
    siteName: "Tu Carrera Emprendedora",
    type: "website",
    locale: "es_AR",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "El 27% quiebra. El 3% toca la campana. ¿Vos?" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESC,
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0B0E",
  width: "device-width",
  initialScale: 1,
  // viewport-fit=cover: la app pinta debajo del notch y de la barra de gestos
  // del iPhone; el CSS recupera el espacio con env(safe-area-inset-*).
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR" className={`${archivo.variable} ${plexMono.variable} ${playfair.variable}`}>
      <body>
        {children}
        {/* Plausible: analytics sin cookies (PRD §2). El stub encola
            eventos disparados antes de que cargue el script. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "window.plausible=window.plausible||function(){(window.plausible.q=window.plausible.q||[]).push(arguments)}",
          }}
        />
        <script defer data-domain="carrera.parlyx.ai" src="https://plausible.io/js/script.js" />
      </body>
    </html>
  );
}
