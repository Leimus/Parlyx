import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tu Carrera Emprendedora · por Parlyx AI",
  description:
    "33 años de carrera emprendedora en 11 decisiones. Terminás tocando la campana o vendiendo el auto.",
  openGraph: {
    title: "Tu Carrera Emprendedora · por Parlyx AI",
    description:
      "33 años de carrera emprendedora en 11 decisiones. Terminás tocando la campana o vendiendo el auto.",
    type: "website",
    locale: "es_AR",
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0B0D",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR">
      <body>{children}</body>
    </html>
  );
}
