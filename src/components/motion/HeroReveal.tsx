"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useMotionCapability } from "@/hooks/useMotionCapability";
import { useAppStore } from "@/store/useAppStore";

gsap.registerPlugin(useGSAP);

// Hero: "Form / Frame / Friction" steigen nacheinander von unten in ihre
// Maske (clip-path waechst mit, damit die Maske ortsfest bleibt). Danach
// Caption und Scroll-Hinweis. Startzustand nur per JS; gestartet wird,
// sobald die Seite eingeblendet ist (isReady). Bei reduced motion nichts.

export default function HeroReveal() {
  const { reducedMotion } = useMotionCapability();
  const isReady = useAppStore((s) => s.isReady);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      if (reducedMotion) return;
      const lines = gsap.utils.toArray<HTMLElement>(".hero__title span");
      const after = gsap.utils.toArray<HTMLElement>(".hero__caption, .hero__scroll");
      if (!lines.length) return;
      tl.current = gsap
        .timeline({ paused: true })
        .fromTo(
          lines,
          { yPercent: 100, clipPath: "inset(-20% -10% 100% -10%)" },
          {
            yPercent: 0,
            clipPath: "inset(-20% -10% 0% -10%)",
            duration: 0.9,
            stagger: 0.08,
            ease: "expo.out",
            clearProps: "transform,clipPath",
          },
        )
        .fromTo(after, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6, ease: "power2.out", clearProps: "opacity,visibility" }, "-=0.35");
      if (useAppStore.getState().isReady) tl.current.play();
      return () => {
        tl.current = null;
      };
    },
    { dependencies: [reducedMotion], revertOnUpdate: true },
  );

  useEffect(() => {
    if (isReady) tl.current?.play();
  }, [isReady]);

  return null;
}
