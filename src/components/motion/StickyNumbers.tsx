"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useMotionCapability } from "@/hooks/useMotionCapability";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Abschnittsnummern "[ 01 ]" bleiben unter dem Header stehen, solange ihr
// Abschnitt im Bild ist. Das Kleben macht position: sticky (.section-pin,
// direktes Kind der <section>, also endet es mit dem Abschnitt). Der
// ScrollTrigger schiebt die Nummer nur noch nach oben weg, wenn das Ende
// des Abschnitts heranrueckt. Aktiv nur mit JS und ohne reduced motion
// (html[data-pins]); sonst bleibt die Nummer statisch im Abschnittskopf.

export default function StickyNumbers() {
  const { reducedMotion } = useMotionCapability();

  useGSAP(
    () => {
      if (reducedMotion) return;
      const root = document.documentElement;
      root.dataset.pins = "";
      const top = () => document.getElementById("header")?.offsetHeight ?? 64;
      gsap.utils.toArray<HTMLElement>(".section-pin__num").forEach((pin) => {
        const section = pin.closest("section");
        if (!section) return;
        gsap.to(pin, {
          y: -32,
          autoAlpha: 0,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: () => `bottom top+=${top() + 72}`,
            end: () => `bottom top+=${top() + 8}`,
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
      });
      return () => {
        delete root.dataset.pins;
      };
    },
    { dependencies: [reducedMotion], revertOnUpdate: true },
  );

  return null;
}
