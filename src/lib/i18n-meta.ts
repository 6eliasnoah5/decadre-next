import type { Metadata } from "next";
import type { Locale } from "@/i18n/routing";

// Pfade einer Seite je Sprache. Fehlt eine Sprache (z. B. eine Notiz, die es
// nur auf Deutsch gibt), wird sie nicht als Alternative gemeldet.
export type LocalePaths = Partial<Record<Locale, string>>;

/** canonical + hreflang (de, en, x-default auf Deutsch) fuer eine Seite. */
export function localeAlternates(locale: Locale, paths: LocalePaths): Metadata["alternates"] {
  const languages: Record<string, string> = {};
  if (paths.de) languages.de = paths.de;
  if (paths.en) languages.en = paths.en;
  if (paths.de) languages["x-default"] = paths.de;
  return { canonical: paths[locale], languages };
}

/** Startseite je Sprache */
export const HOME_PATHS: Required<LocalePaths> = { de: "/", en: "/en" };
