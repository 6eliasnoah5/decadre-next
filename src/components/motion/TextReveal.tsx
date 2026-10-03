"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { useMotionCapability } from "@/hooks/useMotionCapability";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

// Zeilen-Reveal fuer Ueberschriften und Fliesstext: alle Elemente mit
// [data-split] werden nach dem Laden der Schriften in Zeilen zerlegt und
// steigen beim Eintritt in den Viewport von unten in ihre Maske.
// Startzustand nur per JS (ohne JS bleibt alles sichtbar, im CSS steht kein
// Startzustand). Nach dem Reveal wird SplitText zurueckgesetzt, das DOM ist
// danach wieder der urspruengliche Text. [data-split] daher nur auf
// Elemente mit reinem Text (revert ersetzt den Inhalt). Bei reduced motion nichts.

export default function TextReveal() {
  const { reducedMotion } = useMotionCapability();

  useGSAP(
    (_, contextSafe) => {
      if (reducedMotion || !contextSafe) return;
      const els = gsap.utils.toArray<HTMLElement>("[data-split]");
      if (!els.length) return;
      // bis die Schriften da sind: unsichtbar, damit die Zeilen stimmen.
      // Nur visibility, opacity gehoert dem Seitenuebergang (flipTransition).
      gsap.set(els, { visibility: "hidden" });

      let cancelled = false;
      const run = contextSafe(() => {
        if (cancelled) return;
        els.forEach((el) => {
          const split = SplitText.create(el, { type: "lines", mask: "lines" });
          gsap.set(split.lines, { yPercent: 100 });
          gsap.set(el, { visibility: "visible" });
          gsap.to(split.lines, {
            yPercent: 0,
            duration: 0.8,
            stagger: 0.04,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
            onComplete: () => split.revert(),
          });
        });
        ScrollTrigger.refresh();
      });
      document.fonts.ready.then(run);
      return () => {
        cancelled = true;
      };
    },
    { dependencies: [reducedMotion], revertOnUpdate: true },
  );

  return null;
}
