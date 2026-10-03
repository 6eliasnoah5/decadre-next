"use client";

import { useEffect, useRef } from "react";
import { useAppStore } from "@/store/useAppStore";
import LocalClock from "@/components/LocalClock";

// Mobiles Menue. Zustand liegt im Store (menuOpen), damit Header-Button und
// Overlay getrennt gerendert werden koennen. Verhalten wie im Legacy-Script:
// body.menu-open, aria-expanded, Fokus auf [ close ] beim Oeffnen und
// zurueck auf [ menu ] beim Schliessen, Escape schliesst, Menue-Links
// schliessen.

/** [ menu ]-Button im Header */
export function MenuButton({ label }: { label: string }) {
  const menuOpen = useAppStore((s) => s.menuOpen);
  const setMenuOpen = useAppStore((s) => s.setMenuOpen);

  return (
    <button
      className="hdr__menu"
      type="button"
      aria-controls="menu"
      aria-expanded={menuOpen ? "true" : "false"}
      id="menu-open"
      onClick={() => setMenuOpen(true)}
    >
      {label}
    </button>
  );
}

export type MenuItem = { id: string; num: string; label: string };

export type MenuTexts = {
  brand: string;
  close: string;
  closeLabel: string;
  dialogLabel: string;
  navLabel: string;
  place: string;
  bottom: string;
};

/** Vollflaechiges Overlay */
export default function MobileMenu({
  items,
  texts,
  base = "",
  langSwitch,
}: {
  items: MenuItem[];
  texts: MenuTexts;
  /** "" auf der Startseite, sonst deren Pfad (fuer #anker-Links) */
  base?: string;
  /** Sprachumschalter, serverseitig gerendert */
  langSwitch?: React.ReactNode;
}) {
  const menuOpen = useAppStore((s) => s.menuOpen);
  const setMenuOpen = useAppStore((s) => s.setMenuOpen);
  const closeRef = useRef<HTMLButtonElement>(null);
  const prevOpen = useRef(menuOpen);

  // Seiteneffekte nur bei echtem Wechsel, nicht beim ersten Render
  // (auch nicht beim doppelten Effekt-Lauf unter StrictMode).
  useEffect(() => {
    if (prevOpen.current === menuOpen) return;
    prevOpen.current = menuOpen;
    document.body.classList.toggle("menu-open", menuOpen);
    if (menuOpen) {
      const raf = requestAnimationFrame(() => closeRef.current?.focus());
      return () => cancelAnimationFrame(raf);
    }
    document.getElementById("menu-open")?.focus();
  }, [menuOpen]);

  useEffect(() => {
    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && useAppStore.getState().menuOpen) setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeydown);
    return () => document.removeEventListener("keydown", onKeydown);
  }, [setMenuOpen]);

  return (
    <div
      className="menu"
      id="menu"
      role="dialog"
      aria-modal="true"
      aria-label={texts.dialogLabel}
      data-open={menuOpen ? "true" : "false"}
    >
      <div className="menu__top">
        <span className="menu__brand">{texts.brand}</span>
        {langSwitch}
        <button
          ref={closeRef}
          className="menu__close"
          type="button"
          id="menu-close"
          aria-label={texts.closeLabel}
          onClick={() => setMenuOpen(false)}
        >
          {texts.close}
        </button>
      </div>
      <nav className="menu__items" aria-label={texts.navLabel}>
        {items.map((item) => (
          <a
            key={item.id}
            className="menu__item"
            href={`${base}#${item.id}`}
            data-menu-link=""
            onClick={() => setMenuOpen(false)}
          >
            <span className="num">{item.num}</span>
            {item.label}
          </a>
        ))}
      </nav>
      <div className="menu__bottom">
        <div><LocalClock place={texts.place} cityId="clock-city-menu" clockId="clock-menu" separator=" · " /></div>
        <div className="right">{texts.bottom}</div>
      </div>
    </div>
  );
}
