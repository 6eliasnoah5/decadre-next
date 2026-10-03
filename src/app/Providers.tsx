"use client";

import { useEffect, type ReactNode } from "react";
import dynamic from "next/dynamic";
import SmoothScroll from "@/providers/SmoothScroll";
import { useMotionCapability } from "@/hooks/useMotionCapability";
import { useAppStore } from "@/store/useAppStore";
import Cursor from "@/components/Cursor";

// R3F/three nur im Browser laden; nicht im Server-Render und nicht im
// initialen Bundle.
const Scene = dynamic(() => import("@/components/canvas/Scene"), { ssr: false });

// Gemeinsamer Client-Rahmen fuer beide Root-Layouts (site) und (legal).
// Alles, was seitenweit laeuft (Scroll, Canvas, globaler State), haengt
// hier und nicht doppelt in den Layouts.
export default function Providers({ children }: { children: ReactNode }) {
  const { reducedMotion, canWebGL, tier } = useMotionCapability();
  const setReady = useAppStore((s) => s.setReady);

  // Seite nach dem load-Event einblenden (body.is-loaded) und isReady setzen.
  useEffect(() => {
    const reveal = () => {
      document.body.classList.add("is-loaded");
      setReady(true);
    };
    if (document.readyState === "complete") reveal();
    else window.addEventListener("load", reveal);
    return () => window.removeEventListener("load", reveal);
  }, [setReady]);

  return (
    <>
      {/* Bei reduced motion kein Lenis, nativer Scroll */}
      <SmoothScroll enabled={!reducedMotion} />
      {/* Ohne WebGL kein Canvas */}
      {canWebGL && <Scene tier={tier} />}
      {children}
      {/* Custom-Cursor, nur feiner Zeiger ohne reduced motion */}
      <Cursor />
    </>
  );
}
