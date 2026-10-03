# decadre.studio
Portierung der statischen Site decadre.studio nach Next.js App Router.
Referenz: /legacy/index.html

## Zielbild
Hochgradig responsive, sichere Studio-Website, deren Architektur spaeter
Smooth Scroll, WebGL, Page Transitions und Scroll-Animationen traegt.
Design und Inhalt werden NACH der Architektur ueberarbeitet.

## Regeln fuer diese Phase
- Das ist ein 1:1-Port. Das Design darf sich NICHT aendern.
  CSS wird unveraendert uebernommen, nicht refactored, nicht zu
  Tailwind konvertiert.
- Bekannte Macken werden mitportiert, nicht repariert.
- Keine neuen Dependencies ohne Rueckfrage.
- Nach jeder Aenderung muss `npm run build` durchlaufen.
- Die Site ist auf Englisch und bewusst durchgehend kleingeschrieben.
  Designentscheidung, nicht korrigieren.
- Kommentare und Commit-Messages auf Deutsch.

## Architektur (Motion-Fundament)
- Zwei Root-Layouts: `(site)` mit globals.css, `(legal)` mit legal.css.
  Beide binden `src/app/Providers.tsx` ein; Seitenweites gehoert dorthin,
  nicht doppelt in die Layouts. Tokens stehen nur in `src/app/tokens.css`.
- Scroll: Lenis in `src/providers/SmoothScroll.tsx`. Kein Code liest
  `window.scrollY` direkt, sondern `useScrollListener` / `subscribeScroll`.
- Bewegung und WebGL nur hinter `useMotionCapability`
  (reducedMotion, isTouch, canWebGL, tier).
- Globaler UI-Zustand in `src/store/useAppStore.ts`; nichts, was sich pro
  Frame aendert.
- Work-Inhalte nur in `src/lib/content.ts`, nicht im JSX.
- Videos nur ueber `src/components/media/StudioVideo.tsx`.
- Die Seite muss ohne JS vollstaendig sichtbar sein.

@AGENTS.md
