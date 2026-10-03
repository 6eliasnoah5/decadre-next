"use client";

import { Canvas } from "@react-three/fiber";
import type { MotionTier } from "@/hooks/useMotionCapability";

// Seitenweites WebGL-Canvas: fix, ganzflaechig, hinter dem Inhalt, ohne
// Pointer-Events. Rendert vorerst nichts.
//
// Hinweis fuer spaeter: z-index -1 liegt unter dem opaken Hintergrund von
// <body> (var(--color-bg)). Damit Szenen sichtbar werden, muss der
// Body-Hintergrund transparent werden und die Farbe auf <html> bleiben.
//
// frameloop="demand": kein Dauer-Renderloop, solange es nichts zu zeigen gibt.
export default function Scene({ tier }: { tier: MotionTier }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        pointerEvents: "none",
      }}
    >
      <Canvas
        frameloop="demand"
        dpr={[1, tier === "high" ? 2 : 1.5]}
        gl={{ alpha: true, antialias: tier !== "low", powerPreference: "low-power" }}
      />
    </div>
  );
}
