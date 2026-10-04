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
- Startseite: genau drei Abschnitte ([ 01 ] décadre, [ 02 ] projekte,
  [ 03 ] kontakt). Keine Laufschrift. Abschnittskopf: Nummer, Ueberschrift
  und hint auf einer Grundlinie (Grid-Baseline, keine Pixelwerte).
- Projekte: Daten nur in `src/lib/content.ts` (Typ `Project`). Galerie in
  `src/components/Gallery.tsx` (Endlosschleife, Klone nach Viewportbreite,
  kein Selbstlauf; bei reduced motion nativ), Detailseiten unter
  `src/app/[locale]/(site)/projekte/[slug]` (en: /en/projects/[slug]).
  `placeholder: true` = noindex und nicht in der Sitemap. Videos erst
  nach Klick (`VideoEmbed`), Hosts in der CSP unter frame-src; vor dem
  ersten echten Video die Datenschutzerklaerung ergaenzen.
- Keine ausgeschriebenen Jahreszahlen ("twentytwentysix" o. ae.),
  Jahreszahlen in Ziffern.
- Scroll: Lenis in `src/providers/SmoothScroll.tsx`. Kein Code liest
  `window.scrollY` direkt, sondern `useScrollListener` / `subscribeScroll`.
- Bewegung und WebGL nur hinter `useMotionCapability`
  (reducedMotion, isTouch, canWebGL, tier). Bei reduced motion steht
  sofort der Endzustand. Startzustaende von Reveals nur per JS setzen,
  nie im CSS. Bewegungskomponenten in `src/components/motion/`.
- Zeilen-Reveal: `data-split` nur auf Elemente mit reinem Text
  (SplitText.revert ersetzt den Inhalt). TextReveal setzt nur
  `visibility`, der Seitenuebergang (`src/lib/flipTransition.ts`,
  `(site)/template.tsx`) nur `opacity`.
- `overflow-x` auf html/body ist `clip`, nicht `hidden` (sonst kein
  position: sticky am Viewport).
- Globaler UI-Zustand in `src/store/useAppStore.ts`; nichts, was sich pro
  Frame aendert. Cursor-Zustand per `data-cursor="fill"` (Links und
  Buttons gelten automatisch als "fill").
- Die Seite muss ohne JS vollstaendig sichtbar sein.

@AGENTS.md
