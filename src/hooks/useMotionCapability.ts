"use client";

import { useMemo, useSyncExternalStore } from "react";

// Motion-Gate: Was darf dieses Geraet an Bewegung und Grafik?
// Auf dem Server und beim ersten Client-Render gelten konservative Werte
// (keine Effekte), danach die echten. So gibt es keinen Hydration-Mismatch.

export type MotionTier = "low" | "mid" | "high";

export type MotionCapability = {
  reducedMotion: boolean;
  isTouch: boolean;
  canWebGL: boolean;
  tier: MotionTier;
};

// --- Media Queries (reagieren auf Aenderungen zur Laufzeit) ----------

function mediaStore(query: string) {
  return {
    subscribe(onChange: () => void) {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    get: () => window.matchMedia(query).matches,
  };
}

const reducedMotionStore = mediaStore("(prefers-reduced-motion: reduce)");
const coarsePointerStore = mediaStore("(pointer: coarse)");

// --- Einmalige Geraete-Werte -----------------------------------------

let webglCache: boolean | null = null;
function detectWebGL(): boolean {
  if (webglCache !== null) return webglCache;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    webglCache = !!gl;
    // Testkontext sofort freigeben, Browser erlauben nur wenige gleichzeitig.
    (gl as WebGLRenderingContext | null)?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    webglCache = false;
  }
  return webglCache;
}

let tierCache: MotionTier | null = null;
function detectTier(): MotionTier {
  if (tierCache) return tierCache;
  // Grobe Schaetzung. deviceMemory gibt es nur in Chromium (in GB, gedeckelt
  // auf 8); fehlt der Wert, entscheidet die Kernzahl allein.
  const cores = navigator.hardwareConcurrency || 2;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  if (cores <= 4 || (memory !== undefined && memory <= 2)) tierCache = "low";
  else if (cores >= 8 && (memory === undefined || memory >= 8)) tierCache = "high";
  else tierCache = "mid";
  return tierCache;
}

const noopSubscribe = () => () => {};

export function useMotionCapability(): MotionCapability {
  const reducedMotion = useSyncExternalStore(reducedMotionStore.subscribe, reducedMotionStore.get, () => false);
  const isTouch = useSyncExternalStore(coarsePointerStore.subscribe, coarsePointerStore.get, () => false);
  const canWebGL = useSyncExternalStore(noopSubscribe, detectWebGL, () => false);
  const tier = useSyncExternalStore<MotionTier>(noopSubscribe, detectTier, () => "low");

  return useMemo(
    () => ({ reducedMotion, isTouch, canWebGL, tier }),
    [reducedMotion, isTouch, canWebGL, tier],
  );
}
