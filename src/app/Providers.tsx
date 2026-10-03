"use client";

import type { ReactNode } from "react";

// Gemeinsamer Client-Rahmen fuer beide Root-Layouts (site) und (legal).
// Alles, was seitenweit laeuft (Scroll, Canvas, globaler State), haengt
// hier und nicht doppelt in den Layouts.
export default function Providers({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
