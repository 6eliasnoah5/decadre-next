"use client";

import type { ReactNode } from "react";
import SmoothScroll from "@/providers/SmoothScroll";
import { useMotionCapability } from "@/hooks/useMotionCapability";

// Gemeinsamer Client-Rahmen fuer beide Root-Layouts (site) und (legal).
// Alles, was seitenweit laeuft (Scroll, Canvas, globaler State), haengt
// hier und nicht doppelt in den Layouts.
export default function Providers({ children }: { children: ReactNode }) {
  const { reducedMotion } = useMotionCapability();

  return (
    <>
      {/* Bei reduced motion kein Lenis, nativer Scroll */}
      <SmoothScroll enabled={!reducedMotion} />
      {children}
    </>
  );
}
