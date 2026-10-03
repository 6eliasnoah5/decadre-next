"use client";

import { useLayoutEffect, type ReactNode } from "react";
import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import { surroundings, takeFlip } from "@/lib/flipTransition";

gsap.registerPlugin(Flip);

// Template der Site: wird bei jedem Seitenwechsel neu gemountet. Steht ein
// Flip-Uebergang an (Kachel -> Video oder zurueck, siehe
// src/lib/flipTransition.ts), waechst das Bild hier aus seiner alten
// Position in die neue, waehrend der restliche Inhalt einblendet.
// Ohne anstehenden Uebergang (erster Aufruf, Browser-Zurueck, reduced
// motion) passiert nichts.

export default function Template({ children }: { children: ReactNode }) {
  useLayoutEffect(() => {
    const p = takeFlip();
    if (!p) return;
    const target = document.querySelector<HTMLElement>(`[data-flip-id="${p.id}"]`);
    if (!target) return;
    const others = surroundings(target);
    gsap.set(others, { opacity: 0 });
    gsap.set(target, { opacity: 0 });
    // Ein Frame Abstand: bis dahin hat der Router gescrollt (Seitenanfang
    // oder #anker), die Zielposition steht also fest.
    let flip: gsap.core.Timeline | null = null;
    const raf = requestAnimationFrame(() => {
      gsap.set(target, { opacity: 1 });
      flip = Flip.from(p.state, {
        targets: target,
        duration: 0.9,
        ease: "expo.out",
        absolute: true,
        zIndex: 30,
        onComplete: () => gsap.set(target, { clearProps: "opacity" }),
      });
      gsap.to(others, { opacity: 1, duration: 0.6, delay: 0.3, ease: "power2.out", clearProps: "opacity" });
    });
    return () => {
      cancelAnimationFrame(raf);
      flip?.progress(1);
      gsap.set([...others, target], { clearProps: "opacity" });
    };
  }, []);

  return children;
}
