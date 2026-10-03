"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useTranslations } from "next-intl";
import { useAppStore, type CursorMode } from "@/store/useAppStore";
import { useMotionCapability } from "@/hooks/useMotionCapability";

// Agentur-Cursor: leerer 24px-Kreis mit 1px weissem Rand, mix-blend-mode
// difference (invertiert ueber Papier, Rot, Blau und Schwarz und ist damit
// ueberall sichtbar). Folgt dem Zeiger verzoegert per gsap.quickTo.
//
// Zustaende kommen aus dem Store (cursorMode). Eine zentrale Delegation liest
// data-cursor am Element unter dem Zeiger: "fill" (Kreis waechst und fuellt
// sich), "write" (zusaetzlich Text). Links und Buttons ohne Attribut gelten
// als "fill".
//
// Nicht gerendert bei Touch oder reduced motion; dann bleibt der native Cursor.

export default function Cursor() {
  const { isTouch, reducedMotion } = useMotionCapability();
  if (isTouch || reducedMotion) return null;
  return <CursorCircle />;
}

const MODE_SELECTOR = "[data-cursor], a, button";

function modeFor(target: EventTarget | null): CursorMode {
  if (!(target instanceof Element)) return "default";
  const hit = target.closest(MODE_SELECTOR);
  if (!hit) return "default";
  const attr = hit.getAttribute("data-cursor");
  return attr === "write" ? "write" : "fill";
}

function CursorCircle() {
  const t = useTranslations("cursor");
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
      // Erste Bewegung: ohne Verzoegerung an den Zeiger setzen, dann einblenden.
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
    const onDown = () => gsap.to(el, { scale: 0.8, duration: 0.12, ease: "power2.out" });
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
    >
      <span className="cursor__label">{t("write")}</span>
    </div>
  );
}
