import { defineRouting } from "next-intl/routing";

// Sprachen der Site. Deutsch ist Standard und bleibt ohne Praefix auf "/",
// Englisch liegt unter "/en".
export const routing = defineRouting({
  locales: ["de", "en"],
  defaultLocale: "de",
  localePrefix: "as-needed",
  // Keine automatische Umleitung nach Browsersprache: "/" ist immer Deutsch.
  localeDetection: false,
  // Kein Sprach-Cookie. Die Datenschutzerklaerung sagt "keine Cookies".
  localeCookie: false,
  // hreflang setzen die Seiten selbst per Metadaten (Rechtsseiten gibt es nur
  // auf Deutsch, die automatischen Link-Header wuerden /en/impressum melden).
  alternateLinks: false,
  // Pfade (fuer beide Sprachen gleich).
  pathnames: {
    "/": "/",
    "/impressum": "/impressum",
    "/datenschutz": "/datenschutz",
  },
});

export type Locale = (typeof routing.locales)[number];

/** og:locale je Sprache */
export const OG_LOCALE: Record<Locale, string> = { de: "de_DE", en: "en_GB" };
