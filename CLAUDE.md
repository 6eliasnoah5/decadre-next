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

@AGENTS.md
