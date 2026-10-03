"use client";

import { useEffect, useState } from "react";

// Header-Navigation mit aria-current fuer die sichtbare Sektion.
// Links und Labels kommen aus den Sprachdateien. base ist "" auf der
// Startseite (reine #anker) und der Pfad der Startseite auf Unterseiten.
export type NavLink = { id: string; label: string };

export default function ScrollSpy({
  links,
  label,
  base = "",
}: {
  links: NavLink[];
  label: string;
  base?: string;
}) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const targets = links
      .map((l) => document.getElementById(l.id))
      .filter((el): el is HTMLElement => el !== null);
    if (!targets.length) return;
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
  }, [links]);

  return (
    <nav className="hdr__nav" aria-label={label}>
      {links.map((l) => (
        <a
          key={l.id}
          className="hdr__link"
          href={`${base}#${l.id}`}
          data-section={l.id}
          aria-current={active === l.id ? "true" : undefined}
        >
          {`[ ${l.label} ]`}
        </a>
      ))}
    </nav>
  );
}
