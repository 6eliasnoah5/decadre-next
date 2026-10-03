"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useMotionCapability } from "@/hooks/useMotionCapability";
import { leaveWithFlip } from "@/lib/flipTransition";

// Link zurueck zur Galerie. Mit Bewegung schrumpft das Video zurueck in
// seine Kachel (Flip, siehe src/lib/flipTransition.ts); ohne JS ein
// normaler Link auf /#projekte.

export default function BackLink({ href, flipId, className, children }: {
  href: string;
  flipId: string;
  className?: string;
  children: ReactNode;
}) {
  const router = useRouter();
  const { reducedMotion } = useMotionCapability();

  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (reducedMotion || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const el = document.querySelector<HTMLElement>(`[data-flip-id="${flipId}"]`);
    if (!el) return;
    e.preventDefault();
    leaveWithFlip(el, () => router.push(href));
  };

  return (
    <Link className={className} href={href} onClick={onClick}>
      {children}
    </Link>
  );
}
