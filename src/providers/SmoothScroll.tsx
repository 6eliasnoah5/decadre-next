"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger);

// ------------------------------------------------------------------
// Scroll-Abstraktion
// Regel: Kein Code liest window.scrollY direkt. Wer die Scroll-Position
// braucht, nutzt useScrollListener bzw. subscribeScroll. Quelle ist Lenis,
// ohne Lenis (z. B. bei reduced motion) das native scroll-Event.
// ------------------------------------------------------------------

type ScrollListener = (y: number) => void;

const listeners = new Set<ScrollListener>();
let lenisInstance: Lenis | null = null;

// Einzige Stelle, an der die native Position gelesen wird.
const readNativeScroll = () => window.scrollY;

export function getScrollY(): number {
  return lenisInstance ? lenisInstance.scroll : readNativeScroll();
}

export function getLenis(): Lenis | null {
  return lenisInstance;
}

function emit(y: number) {
  listeners.forEach((fn) => fn(y));
}

/** Meldet sofort die aktuelle Position und danach jede Aenderung. */
export function subscribeScroll(fn: ScrollListener): () => void {
  listeners.add(fn);
  fn(getScrollY());
  return () => {
    listeners.delete(fn);
  };
}

/** React-Variante von subscribeScroll; der Callback darf sich aendern. */
export function useScrollListener(fn: ScrollListener) {
  const ref = useRef(fn);
  useEffect(() => {
    ref.current = fn;
  });
  useEffect(() => subscribeScroll((y) => ref.current(y)), []);
}

// ------------------------------------------------------------------
// Provider
// ------------------------------------------------------------------

export default function SmoothScroll({ enabled = true }: { enabled?: boolean }) {
  useEffect(() => {
    if (!enabled) {
      // Nativer Scroll: Position aus dem scroll-Event weiterreichen.
      const onNativeScroll = () => {
        emit(readNativeScroll());
        ScrollTrigger.update();
      };
      window.addEventListener("scroll", onNativeScroll, { passive: true });
      emit(readNativeScroll());
      return () => window.removeEventListener("scroll", onNativeScroll);
    }

    const lenis = new Lenis({
      // Ersetzt das bisherige scroll-behavior: smooth fuer #anker-Links.
      anchors: true,
    });
    lenisInstance = lenis;

    // Lenis -> ScrollTrigger und Scroll-Abonnenten.
    // Kein scrollerProxy noetig: Lenis bewegt das native Fenster, ScrollTrigger
    // liest die Position also ohnehin korrekt; ein Proxy waere nur fuer
    // virtuelle Scroller (eigener Wrapper mit transform) erforderlich.
    const unsubscribe = lenis.on("scroll", (instance: Lenis) => {
      ScrollTrigger.update();
      emit(instance.scroll);
    });

    // Ein einziger Frame-Takt fuer alles: GSAPs ticker (requestAnimationFrame)
    // treibt Lenis, damit Lenis und GSAP-Animationen im selben Frame laufen.
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    emit(lenis.scroll);

    return () => {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33); // GSAP-Standard wiederherstellen
      unsubscribe();
      lenis.destroy();
      lenisInstance = null;
    };
  }, [enabled]);

  return null;
}
