"use client";

import { useRef } from "react";
import { getLenis, useScrollListener } from "@/providers/SmoothScroll";
import { useMotionCapability } from "@/hooks/useMotionCapability";

// Duenne Fortschrittslinie (2px, Tinte) unter dem Header. Der Wert kommt aus
// Lenis (lenis.progress) ueber die Scroll-Abstraktion, nie aus window.scrollY.
// Geschrieben wird direkt per transform, ohne React-Render pro Frame.
// Bei reduced motion wird sie nicht gerendert.
export default function ScrollProgress() {
  const { reducedMotion } = useMotionCapability();
  if (reducedMotion) return null;
  return <ProgressLine />;
}

function ProgressLine() {
  const ref = useRef<HTMLDivElement>(null);
  useScrollListener(() => {
    const lenis = getLenis();
    const progress = lenis ? lenis.progress : 0;
    if (ref.current) ref.current.style.transform = `scaleX(${Math.min(1, Math.max(0, progress || 0))})`;
  });
  return <div ref={ref} className="scroll-progress" aria-hidden="true" />;
}
