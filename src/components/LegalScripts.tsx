// TEMPORAER — wird beim Fundament in einzelne Komponenten aufgeteilt.
//
// Die beiden Inline-Scripts aus legacy/impressum.html und
// legacy/datenschutz.html (dort identisch), wortwoertlich in einem
// useEffect. Die Logik ist bewusst NICHT umgeschrieben. Ergaenzt ist nur
// das Cleanup (alle mit "Cleanup:" markierten Zeilen).
//
// Typpruefung ist fuer diese Datei abgeschaltet, weil das Legacy-JS
// ungetypt ist und unveraendert bleiben soll.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client";

import { useEffect } from "react";

export default function LegalScripts() {
  useEffect(() => {
    const cleanup = (() => {
  'use strict';

  const cleanups = []; // Cleanup: Sammelstelle fuer alle Aufraeum-Funktionen

  // page-load fade --------------------------------------------
  const reveal = () => document.body.classList.add('is-loaded');
  if (document.readyState === 'complete') reveal();
  else window.addEventListener('load', reveal);
  cleanups.push(() => window.removeEventListener('load', reveal)); // Cleanup

  // live clock — Europe/Berlin --------------------------------
  const clockEl = document.getElementById('clock');
  if (clockEl) {
    const fmt = new Intl.DateTimeFormat('de-DE', {
      hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Europe/Berlin'
    });
    const tick = () => { clockEl.textContent = fmt.format(new Date()); };
    tick();
    const clockInterval = setInterval(tick, 1000 * 15); // Cleanup: id gemerkt
    cleanups.push(() => clearInterval(clockInterval)); // Cleanup
  }

  // header hairline on scroll: jetzt in SiteHeader (Lenis)

  return () => { cleanups.forEach(fn => fn()); }; // Cleanup: an useEffect zurueckgeben
})();

  // email — assembled at runtime so the plaintext address never
  // appears in the HTML source (avoids Cloudflare obfuscation).
  document.querySelectorAll('.email-link').forEach(function (el) {
    // eslint-disable-next-line no-var -- Legacy-Code wortwoertlich
    var addr = el.getAttribute('data-user') + '@' + el.getAttribute('data-domain');
    el.href = 'mailto:' + addr;
    if (!el.textContent.trim()) { el.textContent = addr; }
  });

    return cleanup; // Cleanup
  }, []);

  return null;
}
