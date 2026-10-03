"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useAppStore, type CursorMode } from "@/store/useAppStore";
import { useMotionCapability } from "@/hooks/useMotionCapability";

// Cursor: leerer 24px-Kreis mit 1px Rand in --color-fg, ohne Blend-Modus
// (die Seite hat nur einen Hintergrund). Folgt dem Zeiger verzoegert per
// gsap.quickTo. Ueber Links, Buttons und Elementen mit data-cursor="fill"
// waechst er auf 56px und fuellt sich. Zustand ueber cursorMode im Store,
// gesetzt von einer zentralen Delegation (keine Listener pro Komponente).
//
// Nicht gerendert bei Touch oder reduced motion; dann bleibt der native Cursor.

export default function Cursor() {
  const { isTouch, reducedMotion } = useMotionCapability();
  if (isTouch || reducedMotion) return null;
  return <CursorCircle />;
}

function modeFor(target: EventTarget | null): CursorMode {
  if (!(target instanceof Element)) return "default";
  return target.closest('[data-cursor="fill"], a, button') ? "fill" : "default";
}

function CursorCircle() {
  const ref = useRef<HTMLDivElement>(null);
  const cursorMode = useAppStore((s) => s.cursorMode);
  const setCursorMode = useAppStore((s) => s.setCursorMode);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Nur mit feinem Zeiger und Hover; sonst bleibt der native Cursor.
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const el = ref.current;
    if (!el) return;
    const root = document.documentElement;
    root.classList.add("has-cursor");

    gsap.set(el, { xPercent: -50, yPercent: -50 });
    const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3" });
    let placed = false;

    const onMove = (e: PointerEvent) => {
      // Erste Bewegung: direkt an den Zeiger setzen, dann einblenden.
      if (!placed) {
        gsap.set(el, { x: e.clientX, y: e.clientY });
        placed = true;
      }
      xTo(e.clientX);
      yTo(e.clientY);
      setVisible(true);
    };
    const onOver = (e: PointerEvent) => setCursorMode(modeFor(e.target));
    // Zeiger verlaesst das Fenster: relatedTarget ist dann null.
    const onOut = (e: PointerEvent) => {
      if (!e.relatedTarget) {
        setVisible(false);
        setCursorMode("default");
      }
    };
    const onDown = () => gsap.to(el, { scale: 0.85, duration: 0.12, ease: "power2.out" });
    const onUp = () => gsap.to(el, { scale: 1, duration: 0.3, ease: "power3.out" });

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerout", onOut);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      root.classList.remove("has-cursor");
      gsap.killTweensOf(el);
      setCursorMode("default");
    };
  }, [setCursorMode]);

  return (
    <div
      ref={ref}
      className="cursor"
      aria-hidden="true"
      data-visible={visible ? "true" : "false"}
      data-mode={cursorMode}
    />
  );
}
