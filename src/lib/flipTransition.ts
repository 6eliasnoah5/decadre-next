"use client";

import { gsap } from "gsap";
import { Flip } from "gsap/Flip";

gsap.registerPlugin(Flip);

// Seitenuebergang Galerie <-> Projektseite mit GSAP Flip.
// Ablauf: Auf der alten Seite blendet alles ausser dem Bild aus, dann wird
// dessen Position gemerkt (Flip.getState) und per Router navigiert. Das
// Template der neuen Seite ((site)/template.tsx) sucht das Element mit
// derselben data-flip-id und laesst es aus der gemerkten Position in seine
// neue wachsen; der Rest blendet ein.
// Der Zustand liegt hier im Modul, weil er die Navigation ueberleben muss.
// Ein- und Ausblenden nur ueber opacity; visibility nutzt TextReveal.

type Pending = { id: string; state: Flip.FlipState };
let pending: Pending | null = null;
let busy = false;

/** Elemente, die beim Uebergang aus- und eingeblendet werden: alle
 *  Geschwister entlang der Vorfahrenkette von el bis <body>, ohne fixierte
 *  Elemente (Header, Menue, Cursor, Canvas). */
export function surroundings(el: Element): HTMLElement[] {
  const out: HTMLElement[] = [];
  let node: Element | null = el;
  while (node && node !== document.body) {
    const parent: HTMLElement | null = node.parentElement;
    if (!parent) break;
    for (const sib of Array.from(parent.children)) {
      if (sib === node || !(sib instanceof HTMLElement)) continue;
      if (sib.matches("script, style, header") || getComputedStyle(sib).position === "fixed") continue;
      out.push(sib);
    }
    node = parent;
  }
  return out;
}

/** Alte Seite ausblenden, Bildposition merken, dann navigate() aufrufen. */
export function leaveWithFlip(el: HTMLElement, navigate: () => void) {
  if (busy) return;
  const id = el.dataset.flipId;
  if (!id) {
    navigate();
    return;
  }
  busy = true;
  gsap.to(surroundings(el), {
    opacity: 0,
    duration: 0.35,
    ease: "power2.out",
    onComplete: () => {
      pending = { id, state: Flip.getState(el) };
      busy = false;
      navigate();
    },
  });
}

/** data-flip-id eines anstehenden Uebergangs (ohne ihn zu verbrauchen). */
export function pendingFlipId(): string | null {
  return pending?.id ?? null;
}

/** Anstehenden Uebergang abholen (nur einmal). */
export function takeFlip(): Pending | null {
  const p = pending;
  pending = null;
  return p;
}
