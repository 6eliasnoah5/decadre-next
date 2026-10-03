// TEMPORAER — wird beim Fundament in einzelne Komponenten aufgeteilt.
//
// Inline-Script aus legacy/index.html, wortwoertlich in einen useEffect
// gepackt. Die Logik ist bewusst NICHT umgeschrieben. Ergaenzt ist nur
// das Cleanup (alle mit "Cleanup:" markierten Zeilen): Listener, die vorher
// anonym waren, haben dafuer einen Namen bekommen, sonst liessen sie
// sich nicht wieder entfernen.
//
// Typpruefung ist fuer diese Datei abgeschaltet, weil das Legacy-JS
// ungetypt ist und unveraendert bleiben soll.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client";

import { useEffect } from "react";

export default function LegacyScripts() {
  useEffect(() => {
    return (() => {
  'use strict';

  const cleanups = []; // Cleanup: Sammelstelle fuer alle Aufraeum-Funktionen

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // page-load fade-in (400ms) ---------------------------------
  const reveal = () => document.body.classList.add('is-loaded');
  if (document.readyState === 'complete') reveal();
  else window.addEventListener('load', reveal);
  cleanups.push(() => window.removeEventListener('load', reveal)); // Cleanup

  // live clock — Europe/Berlin --------------------------------
  // live clock — adapts to the visitor's own timezone (no permission,
  // no external request — derived from the browser's IANA timezone).
  // city label comes from the timezone's last segment; falls back to
  // Stuttgart if the zone can't be read.
  const clockEls = [document.getElementById('clock'), document.getElementById('clock-menu')].filter(Boolean);
  const cityEls = [document.getElementById('clock-city'), document.getElementById('clock-city-menu')].filter(Boolean);

  let tz = '';
  try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) { tz = ''; }
  // show the continent (first timezone segment): "Europe/Berlin" -> "Europe",
  // "America/New_York" -> "America". falls back to Europe.
  let region = 'Europe';
  if (tz && tz.indexOf('/') !== -1) {
    region = tz.split('/')[0].replace(/_/g, ' ');
  }
  cityEls.forEach(el => { el.textContent = region; });

  // time in the visitor's local zone (omitting timeZone = local)
  const fmt = new Intl.DateTimeFormat('de-DE', {
    hour: '2-digit', minute: '2-digit', hour12: false
  });
  const tickClock = () => {
    const t = fmt.format(new Date());
    clockEls.forEach(el => { el.textContent = t; });
  };
  tickClock();
  const clockInterval = setInterval(tickClock, 1000 * 15); // Cleanup: id gemerkt
  cleanups.push(() => clearInterval(clockInterval)); // Cleanup

  // header — hairline border once scrolled: jetzt in SiteHeader (Lenis)

  // active section indicator ----------------------------------
  const links = Array.from(document.querySelectorAll('.hdr__link'));
  const targets = links
    .map(a => ({ link: a, el: document.getElementById(a.dataset.section) }))
    .filter(t => t.el);
  const setActive = (id) => {
    links.forEach(a => {
      const match = a.dataset.section === id;
      if (match) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  };
  const io = new IntersectionObserver((entries) => {
    const visible = entries
      .filter(e => e.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
    if (visible[0]) setActive(visible[0].target.id);
  }, { rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] });
  targets.forEach(t => io.observe(t.el));
  cleanups.push(() => io.disconnect()); // Cleanup

  // mobile menu — open / close / esc --------------------------
  const menu      = document.getElementById('menu');
  const menuOpen  = document.getElementById('menu-open');
  const menuClose = document.getElementById('menu-close');
  const setMenu = (open) => {
    menu.dataset.open = open ? 'true' : 'false';
    menuOpen.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.classList.toggle('menu-open', open);
    if (open) requestAnimationFrame(() => menuClose.focus());
    else menuOpen.focus();
  };
  const onMenuOpenClick  = () => setMenu(true);  // Cleanup: vorher anonym
  const onMenuCloseClick = () => setMenu(false); // Cleanup: vorher anonym
  menuOpen .addEventListener('click', onMenuOpenClick);
  menuClose.addEventListener('click', onMenuCloseClick);
  cleanups.push(() => menuOpen .removeEventListener('click', onMenuOpenClick));  // Cleanup
  cleanups.push(() => menuClose.removeEventListener('click', onMenuCloseClick)); // Cleanup
  document.querySelectorAll('[data-menu-link]').forEach(a => {
    const onMenuLinkClick = () => setMenu(false); // Cleanup: vorher anonym
    a.addEventListener('click', onMenuLinkClick);
    cleanups.push(() => a.removeEventListener('click', onMenuLinkClick)); // Cleanup
  });
  const onKeydown = (e) => { // Cleanup: vorher anonym
    if (e.key === 'Escape' && menu.dataset.open === 'true') setMenu(false);
  };
  document.addEventListener('keydown', onKeydown);
  cleanups.push(() => document.removeEventListener('keydown', onKeydown)); // Cleanup

  // marquee — continuous CSS auto-loop, no JS needed -----------

  // email — assembled at runtime so the plaintext address never
  // appears in the HTML source (avoids Cloudflare obfuscation +
  // basic bot scraping). data-keep-label keeps the link's text.
  document.querySelectorAll('.email-link').forEach((el) => {
    const user = el.getAttribute('data-user');
    const domain = el.getAttribute('data-domain');
    if (!user || !domain) return;
    const addr = user + '@' + domain;
    el.href = 'mailto:' + addr;
    if (!el.hasAttribute('data-keep-label')) el.textContent = addr;
  });

  // hover-play for work videos --------------------------------
  document.querySelectorAll('.slot').forEach(slot => {
    const v = slot.querySelector('video[data-hover-play]');
    if (!v) return;
    const play  = () => { v.play().catch(() => {}); };
    const pause = () => { v.pause(); v.currentTime = 0; };
    slot.addEventListener('mouseenter', play);
    slot.addEventListener('mouseleave', pause);
    slot.addEventListener('focusin', play);
    slot.addEventListener('focusout', pause);
    cleanups.push(() => { // Cleanup
      slot.removeEventListener('mouseenter', play);
      slot.removeEventListener('mouseleave', pause);
      slot.removeEventListener('focusin', play);
      slot.removeEventListener('focusout', pause);
    });
  });

  // custom cursor — desktop, fine pointer only ----------------
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (finePointer && !reduced) {
    const cursor = document.getElementById('cursor');
    let raf = 0, x = 0, y = 0;
    const onMove = (e) => {
      x = e.clientX; y = e.clientY;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        cursor.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
        raf = 0;
      });
    };
    document.querySelectorAll('.slot').forEach(slot => {
      const onEnter = () => { cursor.dataset.visible = 'true'; window.addEventListener('pointermove', onMove); };   // Cleanup: vorher anonym
      const onLeave = () => { cursor.dataset.visible = 'false'; window.removeEventListener('pointermove', onMove); }; // Cleanup: vorher anonym
      slot.addEventListener('pointerenter', onEnter);
      slot.addEventListener('pointerleave', onLeave);
      cleanups.push(() => { // Cleanup
        slot.removeEventListener('pointerenter', onEnter);
        slot.removeEventListener('pointerleave', onLeave);
      });
    });
    cleanups.push(() => { // Cleanup
      window.removeEventListener('pointermove', onMove);
      if (raf) cancelAnimationFrame(raf);
    });
  }

  return () => { cleanups.forEach(fn => fn()); }; // Cleanup: an useEffect zurueckgeben
})();
  }, []);

  return null;
}
