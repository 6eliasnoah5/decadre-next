import type { Locale } from "@/i18n/routing";
import type { LocalePaths } from "@/lib/i18n-meta";

// Sprachumschalter "DE / EN" in Mono 13px; die aktive Sprache hat volle
// Deckkraft, die inaktive 0.4, kein Fettdruck. Normale Links mit vollem
// Seitenaufruf, damit <html lang> und Metadaten sicher wechseln.
// Gibt es die Seite in der anderen Sprache nicht, fuehrt der Link zu deren
// Startseite (fallback).
export default function LanguageSwitch({
  locale,
  paths,
  fallback,
  label,
  className = "lang-switch",
}: {
  locale: Locale;
  paths: LocalePaths;
  fallback: Record<Locale, string>;
  label: string;
  className?: string;
}) {
  const link = (l: Locale, text: string) => (
    <a
      href={paths[l] ?? fallback[l]}
      hrefLang={l}
      lang={l}
      aria-current={l === locale ? "true" : undefined}
    >
      {text}
    </a>
  );
  return (
    <span className={className} role="group" aria-label={label}>
      {link("de", "DE")} / {link("en", "EN")}
    </span>
  );
}
