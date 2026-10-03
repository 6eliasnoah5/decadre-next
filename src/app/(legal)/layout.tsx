import type { Metadata, Viewport } from "next";
import "../legal.css";
import { fontVariables } from "../fonts";
import Providers from "../Providers";
import FadeInScript from "@/components/FadeInScript";
import { SITE_URL, SITE_DESCRIPTION, FAVICON } from "@/lib/site";

// Eigenes Root-Layout fuer die Rechtsseiten: Sie hatten in der Legacy-Site
// ein eigenes <style> mit abweichenden Regeln fuer dieselben Klassen.
// Ein Wechsel zwischen (site) und (legal) ist ein voller Seitenaufruf,
// dadurch kann das CSS beider Seitentypen nicht ineinander laufen.

// Gemeinsame Metadaten der Rechtsseiten; Titel und canonical setzt die Seite.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Décadre Studio", template: "%s — Décadre Studio" },
  description: SITE_DESCRIPTION,
  robots: { index: true, follow: true },
  icons: { icon: FAVICON },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#F4F2EE",
};

// lang="de": Impressum und Datenschutz sind deutsch.
export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: FadeInScript setzt vor der Hydration die Klasse "js".
    <html lang="de" className={fontVariables} suppressHydrationWarning>
      <head>
        <FadeInScript />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
