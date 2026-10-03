"use client";

import { useState, type ReactNode } from "react";
import { useScrollListener } from "@/providers/SmoothScroll";
import ScrollProgress from "@/components/ScrollProgress";

// <header class="hdr"> mit Hairline ab 8px Scroll (data-scrolled), wie im
// Legacy-Script. Die Position kommt aus der Scroll-Abstraktion (Lenis).
// Vor dem ersten Client-Render fehlt data-scrolled, wie im Original vor
// dem ersten Script-Durchlauf.
export default function SiteHeader({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState<"true" | "false" | undefined>(undefined);
  useScrollListener((y) => setScrolled(y > 8 ? "true" : "false"));

  return (
    <header className="hdr" id="header" data-scrolled={scrolled}>
      {children}
      <ScrollProgress />
    </header>
  );
}
