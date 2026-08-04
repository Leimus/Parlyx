import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
  display: "swap",
});

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
  themeColor: "#0A0B0E",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR" className={`${archivo.variable} ${plexMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
