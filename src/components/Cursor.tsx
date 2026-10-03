"use client";

import { useEffect, useRef } from "react";
import { useAppStore } from "@/store/useAppStore";
import { useMotionCapability } from "@/hooks/useMotionCapability";

// Custom-Cursor "[ play ]" ueber den Work-Kacheln.
// Nur gemountet ohne Touch und ohne reduced motion. Sichtbarkeit kommt aus
// dem Store (cursorMode, gesetzt von WorkGrid). Positions-Tracking wie im
// Legacy-Script nur bei feinem Zeiger mit Hover und nur, solange der
// Cursor sichtbar ist.
export default function Cursor() {
  const { isTouch, reducedMotion } = useMotionCapability();
  if (isTouch || reducedMotion) return null;
  return <CursorOverlay />;
}

function CursorOverlay() {
  const cursorMode = useAppStore((s) => s.cursorMode);
  const ref = useRef<HTMLDivElement>(null);
  const active = cursorMode === "play";

  useEffect(() => {
    if (!active) return;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!finePointer) return;

    let raf = 0, x = 0, y = 0;
    const onMove = (e: PointerEvent) => {
      x = e.clientX; y = e.clientY;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        if (ref.current) ref.current.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
        raf = 0;
      });
    };
    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [active]);

  return (
    <div className="cursor" id="cursor" aria-hidden="true" data-visible={active ? "true" : undefined} ref={ref}>
      [ play ]
    </div>
  );
}
