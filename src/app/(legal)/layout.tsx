import type { Metadata, Viewport } from "next";
import "../legal.css";
import { fontVariables } from "../fonts";

// Eigenes Root-Layout fuer die Rechtsseiten: Sie hatten in der Legacy-Site
// ein eigenes <style> mit abweichenden Regeln fuer dieselben Klassen.
// Ein Wechsel zwischen (site) und (legal) ist ein voller Seitenaufruf,
// dadurch kann das CSS beider Seitentypen nicht ineinander laufen.

// Gemeinsame Werte aus dem <head> von legacy/impressum.html und
// legacy/datenschutz.html, inklusive Platzhalter. Titel setzt die Seite.
export const metadata: Metadata = {
  description: "[ platzhalter ]",
  robots: "noindex",
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%23F4F2EE'/%3E%3Ctext x='4' y='24' font-family='monospace' font-size='20' font-weight='700' fill='%23111111'%3ED.%3C/text%3E%3C/svg%3E",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#F4F2EE",
};

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={fontVariables}>
      <body>{children}</body>
    </html>
  );
}
