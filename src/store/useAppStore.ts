import { create } from "zustand";

// Globaler UI-Zustand, der zwischen unabhaengigen Komponenten geteilt wird.
// Scroll-Position und andere Werte, die sich pro Frame aendern, gehoeren
// NICHT hierher (siehe Scroll-Abstraktion in providers/SmoothScroll.tsx).

/** default: leerer Kreis; fill: gefuellt (Links, Buttons, data-cursor="fill") */
export type CursorMode = "default" | "fill";

type AppState = {
  /** Seite geladen und eingeblendet */
  isReady: boolean;
  setReady: (ready: boolean) => void;

  /** Was der Custom-Cursor gerade anzeigt */
  cursorMode: CursorMode;
  setCursorMode: (mode: CursorMode) => void;

  /** Mobiles Menue offen */
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
};

export const useAppStore = create<AppState>()((set) => ({
  isReady: false,
  setReady: (isReady) => set({ isReady }),

  cursorMode: "default",
  setCursorMode: (cursorMode) => set({ cursorMode }),

  menuOpen: false,
  setMenuOpen: (menuOpen) => set({ menuOpen }),
}));
