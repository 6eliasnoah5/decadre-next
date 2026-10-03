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
export function MenuButton() {
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
      [ menu ]
    </button>
  );
}

const ITEMS = [
  { href: "#work", num: "[ 01 ]", label: "work" },
  { href: "#services", num: "[ 02 ]", label: "services" },
  { href: "#about", num: "[ 03 ]", label: "about" },
  { href: "#contact", num: "[ 04 ]", label: "contact" },
];

/** Vollflaechiges Overlay */
export default function MobileMenu() {
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
      aria-label="primary navigation"
      data-open={menuOpen ? "true" : "false"}
    >
      <div className="menu__top">
        <span className="menu__brand">Décadre Studio</span>
        <button
          ref={closeRef}
          className="menu__close"
          type="button"
          id="menu-close"
          aria-label="close menu"
          onClick={() => setMenuOpen(false)}
        >
          [ close ]
        </button>
      </div>
      <nav className="menu__items" aria-label="primary mobile">
        {ITEMS.map((item) => (
          <a
            key={item.href}
            className="menu__item"
            href={item.href}
            data-menu-link=""
            onClick={() => setMenuOpen(false)}
          >
            <span className="num">{item.num}</span>
            {item.label}
          </a>
        ))}
      </nav>
      <div className="menu__bottom">
        <div><LocalClock cityId="clock-city-menu" clockId="clock-menu" separator=" · " /></div>
        <div className="right">currently booking — autumn twentytwentysix</div>
      </div>
    </div>
  );
}
