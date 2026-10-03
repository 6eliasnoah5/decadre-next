# decadre.studio
Website von Décadre (Elias Noah Nies) auf Next.js App Router.
Urspruengliche statische Site als Referenz: /legacy/

## Zielbild
Hochgradig responsive, sichere Studio-Website, deren Architektur spaeter
Smooth Scroll, WebGL, Page Transitions und Scroll-Animationen traegt.
Design und Inhalt werden NACH der Architektur ueberarbeitet.

## Regeln
- Der 1:1-Port und die Haertung sind abgeschlossen. Design und Inhalte
  duerfen sich jetzt aendern, aber nur auf Anweisung.
- Keine neuen Dependencies ohne Rueckfrage.
- Nach jeder Aenderung muessen `npm run build`, `tsc` und `eslint` sauber sein.
- Kleinschreibung nur fuer Labels, Navigation, Mono-Beschriftungen und
  Listentitel. Fliesstext und Ueberschriften normal.
- Kommentare und Commit-Messages auf Deutsch.

## Architektur
- Zwei Root-Layouts unter `src/app/[locale]/`: `(site)` mit globals.css,
  `(legal)` mit legal.css. Beide binden `src/app/Providers.tsx` ein;
  Seitenweites gehoert dorthin. Tokens stehen nur in `src/app/tokens.css`.
- Sprachen: next-intl (`src/i18n/`, `src/proxy.ts`). Deutsch auf "/",
  Englisch unter "/en". Kein Sprach-Cookie, keine Spracherkennung
  (Datenschutz: keine Cookies). Alle Texte in `messages/de.json` und
  `messages/en.json`, beide mit denselben Schluesseln.
- Impressum und Datenschutz nur auf Deutsch; /en/... leitet um.
- Farben: nur Papier (`--color-bg`) und Tinte (`--color-fg`) samt deren
  Alpha-Stufen. Kein Farbsystem, keine Farbfelder, alle Schrift schwarz.
- Startseite: genau drei Abschnitte ([ 01 ] décadre, [ 02 ] arbeit,
  [ 03 ] kontakt). Keine Listen, keine Laufschrift.
- Keine ausgeschriebenen Jahreszahlen ("twentytwentysix" o. ae.),
  Jahreszahlen in Ziffern.
- Scroll: Lenis in `src/providers/SmoothScroll.tsx`. Kein Code liest
  `window.scrollY` direkt, sondern `useScrollListener` / `subscribeScroll`.
- Bewegung und WebGL nur hinter `useMotionCapability`
  (reducedMotion, isTouch, canWebGL, tier).
- Globaler UI-Zustand in `src/store/useAppStore.ts`; nichts, was sich pro
  Frame aendert. Cursor-Zustand per `data-cursor="fill"` (Links und
  Buttons gelten automatisch als "fill").
- Die Seite muss ohne JS vollstaendig sichtbar sein.

@AGENTS.md
