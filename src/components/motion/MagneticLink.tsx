"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useMotionCapability } from "@/hooks/useMotionCapability";

gsap.registerPlugin(useGSAP);

// Magnetischer Link: folgt dem Zeiger, sobald er naeher als 120px an den
// Link kommt, um hoechstens 12px; ausserhalb zurueck auf 0.
// Nur mit feinem Zeiger und ohne reduced motion.

const RADIUS = 120;
const MAX = 12;

export default function MagneticLink({
  href,
  className,
  split,
  children,
}: {
  href: string;
  className?: string;
  /** Zeilen-Reveal (TextReveal) auf dem Link selbst, nicht auf dem Elternelement:
   *  SplitText.revert() ersetzt den Inhalt und wuerde den Link austauschen. */
  split?: boolean;
  children: ReactNode;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const { reducedMotion, isTouch } = useMotionCapability();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || reducedMotion || isTouch || !window.matchMedia("(pointer: fine)").matches) return;
      const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3" });
      const clamp = gsap.utils.clamp(-MAX, MAX);

      const onMove = (e: PointerEvent) => {
        // Ruhelage ohne die aktuelle Verschiebung
        const r = el.getBoundingClientRect();
        const left = r.left - (gsap.getProperty(el, "x") as number);
        const top = r.top - (gsap.getProperty(el, "y") as number);
        const dx = Math.max(left - e.clientX, 0, e.clientX - (left + r.width));
        const dy = Math.max(top - e.clientY, 0, e.clientY - (top + r.height));
        if (Math.hypot(dx, dy) > RADIUS) {
          xTo(0);
          yTo(0);
          return;
        }
        xTo(clamp((e.clientX - (left + r.width / 2)) * 0.06));
        yTo(clamp((e.clientY - (top + r.height / 2)) * 0.15));
      };
      const reset = () => {
        xTo(0);
        yTo(0);
      };
      window.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", reset);
      return () => {
        window.removeEventListener("pointermove", onMove);
        document.documentElement.removeEventListener("pointerleave", reset);
        gsap.set(el, { clearProps: "transform" });
      };
    },
    { dependencies: [reducedMotion, isTouch], revertOnUpdate: true },
  );

  return (
    <a ref={ref} href={href} className={className} data-cursor="fill" data-split={split ? "" : undefined}>
      {children}
    </a>
  );
}
