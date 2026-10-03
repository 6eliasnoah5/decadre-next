// Laeuft blockierend im <head>, also vor dem ersten Paint:
// - setzt html.js; nur dann startet <body> unsichtbar (siehe globals.css /
//   legal.css). Ohne JS bleibt die Seite vollstaendig sichtbar.
// - Sicherheitsnetz: Falls das JS-Bundle nicht laedt oder abbricht, blendet
//   dieses Script die Seite 1 s nach dem load-Event selbst ein. Im
//   Normalfall erledigt das Providers sofort beim load-Event.
const code = `document.documentElement.classList.add('js');window.addEventListener('load',function(){setTimeout(function(){document.body.classList.add('is-loaded')},1000)});`;

export default function FadeInScript() {
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
