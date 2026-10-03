"use client";

import { useEffect, useState } from "react";

// Header-Navigation mit aria-current fuer die sichtbare Sektion.
// IntersectionObserver mit denselben Werten wie im Legacy-Script.
const LINKS = [
  { id: "work", label: "[ work ]" },
  { id: "services", label: "[ services ]" },
  { id: "about", label: "[ about ]" },
  { id: "contact", label: "[ contact ]" },
];

export default function ScrollSpy() {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const targets = LINKS.map((l) => document.getElementById(l.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <nav className="hdr__nav" aria-label="primary">
      {LINKS.map((l) => (
        <a
          key={l.id}
          className="hdr__link"
          href={"#" + l.id}
          data-section={l.id}
          aria-current={active === l.id ? "true" : undefined}
        >
          {l.label}
        </a>
      ))}
    </nav>
  );
}
