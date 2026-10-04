"use client";

import { useCallback, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMotionCapability } from "@/hooks/useMotionCapability";
import { leaveWithFlip, pendingFlipId } from "@/lib/flipTransition";

gsap.registerPlugin(Draggable, InertiaPlugin, ScrollTrigger);

// Galerie fuer [ 02 ] projekte: horizontale Spur ueber die volle Breite,
// beginnt an der linken Rasterkante.
//
// Grundzustand (ohne JS und bei reduced motion): natives horizontales
// Scrollen mit Scrollbar ueber den echten Satz Kacheln, keine Animation.
//
// Mit JS und Bewegung: Endlosschleife nach dem horizontalLoop-Muster aus der
// GSAP-Doku. Eine pausierte Timeline schiebt alle Kacheln um eine Satzbreite
// nach links; ein modifiers-Callback mit gsap.utils.wrap setzt jede Kachel
// zyklisch um, sobald sie links aus dem Bild laeuft. Die Position (X) kommt
// aus einem Draggable-Proxy mit Traegheit und Snap auf den Kachelanfang,
// aus den Pfeil-Buttons, den Pfeiltasten oder horizontalem Wischen; X wird
// in den Fortschritt der Timeline uebersetzt. Kein Anschlag, kein
// Selbstlauf. Reicht ein Satz nicht ueber Viewport plus eine Kachel, werden
// weitere Saetze als Klone angehaengt (Anzahl aus Viewport- / Kachelbreite).
//
// Beim ersten Erscheinen steigen die Kacheln nacheinander auf; ein Klick
// laesst das Bild per Flip in den Videoplatz der Projektseite wachsen
// (src/lib/flipTransition.ts).

export type GalleryItem = {
  slug: string;
  href: string;
  title: string;
  /** "format · jahr" */
  meta: string;
  poster: string | null;
};

export type GalleryTexts = {
  num: string;
  hint: string;
  title: string;
  intro: string;
  prev: string;
  next: string;
  prevLabel: string;
  nextLabel: string;
  regionLabel: string;
  imageFollows: string;
};

const pad = (n: number) => String(n).padStart(2, "0");
const mod = (n: number, m: number) => ((n % m) + m) % m;
const noopSubscribe = () => () => {};

export default function Gallery({ items, texts }: { items: GalleryItem[]; texts: GalleryTexts }) {
  const { reducedMotion } = useMotionCapability();
  // Erst nach der Hydration ziehen; Server und erster Render: nativ.
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const mode = hydrated && !reducedMotion ? "drag" : "native";

  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  // Schritt um dir Kacheln (Buttons, Pfeiltasten); je nach Modus belegt
  const stepRef = useRef<(dir: number) => void>(() => {});
  const [index, setIndex] = useState(0);
  // Anzahl der gerenderten Saetze in der Schleife (1 = keine Klone)
  const [copies, setCopies] = useState(1);
  // Aktuelle Kachelposition der Schleife, ueberdauert Neuaufbauten (Resize)
  const slotRef = useRef<number | null>(null);
  // Kachel-Einblendung schon gelaufen (nicht nach Resize wiederholen)
  const enteredRef = useRef(false);
  const router = useRouter();
  const routerRef = useRef(router);
  useLayoutEffect(() => {
    routerRef.current = router;
  }, [router]);

  // Layout-Effekte: laufen vor dem Template-Effekt (Eltern nach Kindern),
  // die Spur steht also schon an der richtigen Kachel, wenn ein Flip zurueck
  // aus der Projektseite ansteht.

  // ---------- nativ: Scrollbar, Spruenge ohne Animation ----------
  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (mode !== "native" || !viewport || !track) return;
    const tiles = Array.from(track.children) as HTMLElement[];
    if (!tiles.length) return;

    // Kachelanfaenge relativ zur ersten Kachel, begrenzt auf den Scrollweg.
    let positions: number[] = [];
    const measure = () => {
      const maxScroll = Math.max(0, track.scrollWidth - viewport.clientWidth);
      const first = tiles[0].offsetLeft;
      positions = tiles.map((t) => Math.min(maxScroll, t.offsetLeft - first));
    };
    const closest = (scroll: number) => {
      let best = 0;
      positions.forEach((p, i) => {
        if (Math.abs(p - scroll) < Math.abs(positions[best] - scroll)) best = i;
      });
      return best;
    };
    measure();
    const flipId = pendingFlipId();
    const startIndex = Math.max(0, tiles.findIndex((t) => t.querySelector(`[data-flip-id="${flipId}"]`)));

    let current = startIndex;
    const onScroll = () => {
      current = closest(viewport.scrollLeft);
      setIndex(current);
    };
    stepRef.current = (dir) => {
      const i = Math.max(0, Math.min(tiles.length - 1, current + dir));
      viewport.scrollTo({ left: positions[i], behavior: "instant" });
    };
    const ro = new ResizeObserver(() => {
      measure();
      onScroll();
    });
    ro.observe(viewport);
    viewport.addEventListener("scroll", onScroll, { passive: true });
    viewport.scrollLeft = positions[startIndex];
    onScroll();
    return () => {
      ro.disconnect();
      viewport.removeEventListener("scroll", onScroll);
      stepRef.current = () => {};
    };
  }, [mode]);

  // ---------- Endlosschleife ----------
  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (mode !== "drag" || !viewport || !track) return;
    const tiles = Array.from(track.children) as HTMLElement[];
    const realCount = items.length;
    if (!tiles.length || !realCount) return;

    // Masse: Abstand von Kachel zu Kachel (span), Satzbreite (total),
    // linker Einzug bis zur Rasterkante (startPad), Grundlage je Kachel.
    let span = 0;
    let total = 0;
    let startPad = 0;
    let tileW = 0;
    let offsets: number[] = [];
    const measure = () => {
      const first = tiles[0].offsetLeft;
      startPad = first;
      offsets = tiles.map((t) => t.offsetLeft - first);
      tileW = tiles[0].offsetWidth;
      span = tiles.length > 1 ? tiles[1].offsetLeft - first : tileW;
      total = span * tiles.length;
    };
    // Saetze, damit die Spur Viewport plus eine Kachel plus Reserve deckt:
    // umgesetzt wird nur ausserhalb des Bildes, mit mindestens einer halben
    // Kachel Abstand je Seite, auch bei schnellem Wurf.
    const neededCopies = () =>
      Math.max(1, Math.ceil((viewport.clientWidth + tileW + span) / (span * realCount)));

    // Stimmt die Zahl der Saetze nicht, setzt der ResizeObserver unten sie
    // gleich beim ersten Aufruf; der Effekt laeuft dann erneut.
    measure();

    // Timeline: alle Kacheln um eine Satzbreite nach links; wrap haelt jede
    // Kachel im Fenster [left, left + total) in Viewport-Koordinaten. left
    // liegt eine Kachel plus die halbe Reserve links ausserhalb, das rechte
    // Ende ebenso weit rechts. Faellt eine Kachel links heraus, steht sie
    // rechts wieder an (und umgekehrt).
    let wraps: ((x: number) => number)[] = [];
    const loop = gsap.timeline({ paused: true });
    const build = () => {
      const reserve = (total - viewport.clientWidth - tileW) / 2;
      const left = -tileW - reserve - startPad;
      wraps = offsets.map((o) => gsap.utils.wrap(left - o, left + total - o));
      loop.clear();
      gsap.set(tiles, { x: 0 });
      loop.to(tiles, {
        x: -total,
        duration: 1,
        ease: "none",
        modifiers: {
          x: (x: string, target: HTMLElement) => `${wraps[tiles.indexOf(target)](parseFloat(x))}px`,
        },
      });
    };

    // X: Verschiebung der ganzen Spur in px (0 = Kachel 1 an der Rasterkante)
    const state = { x: 0 };
    let shown = -1;
    const render = () => {
      // Eine pausierte Timeline rendert bei unveraendertem Fortschritt nicht
      // (etwa direkt nach dem Aufbau bei 0); dann waeren die Kacheln noch
      // nicht umgesetzt. Darum bei gleichem Wert einmal anstossen.
      const progress = mod(-state.x / total, 1);
      if (progress === loop.progress()) loop.progress(progress === 0 ? 0.5 : 0);
      loop.progress(progress);
      const i = mod(Math.round(-state.x / span), realCount);
      if (i !== shown) {
        shown = i;
        setIndex(i);
      }
    };
    const slotOf = (x: number) => Math.round(-x / span);
    const proxy = document.createElement("div");

    build();
    // Start: gemerkte Position (Resize), sonst die Kachel eines anstehenden
    // Flips zurueck, sonst Kachel 1
    const flipId = pendingFlipId();
    const flipIndex = tiles.findIndex((t) => t.querySelector(`[data-flip-id="${flipId}"]`));
    const startSlot = slotRef.current ?? Math.max(0, flipIndex);
    state.x = -startSlot * span;
    render();

    const tweenTo = (slot: number) => {
      gsap.killTweensOf(state);
      slotRef.current = slot;
      gsap.to(state, { x: -slot * span, duration: 0.8, ease: "expo.out", onUpdate: render });
    };
    stepRef.current = (dir) => tweenTo(slotOf(state.x) + dir);

    let moved = false;
    const [draggable] = Draggable.create(proxy, {
      type: "x",
      trigger: viewport,
      inertia: true,
      dragClickables: true,
      snap: { x: (x: number) => Math.round(x / span) * span },
      onPressInit() {
        gsap.killTweensOf(state);
        gsap.set(proxy, { x: state.x });
        moved = false;
      },
      onDrag() {
        if (Math.abs(this.x - this.startX) > 4) moved = true;
        state.x = this.x;
        render();
      },
      onThrowUpdate() {
        state.x = this.x;
        render();
      },
      onThrowComplete() {
        slotRef.current = slotOf(state.x);
      },
    });

    // Gezogen statt geklickt: den Link-Klick danach verschlucken.
    // Echter Klick: Flip-Uebergang zur Projektseite.
    const onClick = (e: MouseEvent) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
        return;
      }
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element).closest<HTMLAnchorElement>("a.tile");
      const media = link?.querySelector<HTMLElement>("[data-flip-id]");
      if (!link || !media) return;
      e.preventDefault();
      const href = link.getAttribute("href") ?? "";
      leaveWithFlip(media, () => routerRef.current.push(href));
    };

    // Erstes Erscheinen: Kacheln steigen nacheinander auf (nicht beim
    // Rueckweg per Flip, da soll die Zielkachel sofort stehen). Animiert
    // wird der Link in der Kachel: das transform der <li> gehoert allein der
    // Schleife, ein zweiter Tween darauf wuerde ihr x ueberschreiben.
    const links = tiles.map((t) => t.querySelector<HTMLElement>(".tile")).filter((l): l is HTMLElement => !!l);
    const entrance = flipId || enteredRef.current
      ? null
      : gsap.fromTo(
          links,
          { y: 24, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.8,
            stagger: 0.06,
            ease: "expo.out",
            clearProps: "transform,opacity,visibility",
            onStart: () => {
              enteredRef.current = true;
            },
            scrollTrigger: { trigger: viewport, start: "top 85%", once: true },
          },
        );

    // Fokus per Tab (nur der echte Satz ist fokussierbar): Browser scrollen
    // auch overflow:hidden-Container zum fokussierten Element. Das
    // zuruecksetzen und die Kachel auf der naechstgelegenen Position zeigen.
    const onFocusIn = (e: FocusEvent) => {
      const i = tiles.findIndex((t) => t.contains(e.target as Node));
      viewport.scrollLeft = 0;
      // Nur Tastaturfokus: ein Mausdruck fokussiert den Link ebenfalls und
      // wuerde sonst gegen das gerade beginnende Ziehen anfahren.
      if (i < 0 || !(e.target as Element).matches(":focus-visible")) return;
      const cur = slotOf(state.x);
      const target = cur + mod(i - cur + tiles.length / 2, tiles.length) - tiles.length / 2;
      const slot = Math.round(target);
      if (slot !== cur) tweenTo(slot);
    };
    const onViewportScroll = () => {
      if (viewport.scrollLeft !== 0) viewport.scrollLeft = 0;
    };
    // Horizontales Wischen auf dem Trackpad, danach auf die Kachel einrasten.
    let wheelTimer: ReturnType<typeof setTimeout> | undefined;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      gsap.killTweensOf(state);
      state.x -= e.deltaX;
      render();
      clearTimeout(wheelTimer);
      wheelTimer = setTimeout(() => tweenTo(slotOf(state.x)), 140);
    };
    // Resize: neu messen; reicht die Zahl der Saetze nicht mehr, neu rendern
    // (der Effekt laeuft dann mit der neuen Zahl erneut).
    const ro = new ResizeObserver(() => {
      const slot = slotOf(state.x);
      measure();
      const need = neededCopies();
      if (need !== copies) {
        slotRef.current = slot;
        setCopies(need);
        return;
      }
      build();
      state.x = -slot * span;
      render();
    });

    track.addEventListener("click", onClick, true);
    track.addEventListener("focusin", onFocusIn);
    viewport.addEventListener("scroll", onViewportScroll);
    viewport.addEventListener("wheel", onWheel, { passive: false });
    ro.observe(viewport);

    return () => {
      clearTimeout(wheelTimer);
      ro.disconnect();
      track.removeEventListener("click", onClick, true);
      track.removeEventListener("focusin", onFocusIn);
      viewport.removeEventListener("scroll", onViewportScroll);
      viewport.removeEventListener("wheel", onWheel);
      draggable.kill();
      entrance?.scrollTrigger?.kill();
      entrance?.kill();
      gsap.killTweensOf(state);
      loop.kill();
      gsap.set(tiles, { clearProps: "transform" });
      gsap.set(links, { clearProps: "transform,opacity,visibility" });
      stepRef.current = () => {};
    };
  }, [mode, copies, items.length]);

  const step = useCallback((dir: number) => stepRef.current(dir), []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") step(1);
    else if (e.key === "ArrowLeft") step(-1);
    else return;
    e.preventDefault();
  };

  // Schleife: echter Satz plus Klone; nativ nur der echte Satz.
  const loop = mode === "drag";
  const sets = loop ? copies : 1;

  return (
    <>
      <div className="container">
        <div className="section-head">
          <span className="section-head__num">{texts.num}</span>
          <h2 className="section-title" data-split="">{texts.title}</h2>
          <span className="section-head__hint">{texts.hint}</span>
        </div>
        <div className="gallery__bar">
          <p className="work__note">{texts.intro}</p>
          <span className="gallery__controls">
            <button type="button" aria-label={texts.prevLabel} aria-controls="gallery-track" disabled={!loop && index === 0} onClick={() => step(-1)}>
              {texts.prev}
            </button>
            <button type="button" aria-label={texts.nextLabel} aria-controls="gallery-track" disabled={!loop && index === items.length - 1} onClick={() => step(1)}>
              {texts.next}
            </button>
          </span>
        </div>
      </div>

      <div className="gallery" data-mode={mode}>
        <div
          ref={viewportRef}
          className="gallery__viewport"
          role="region"
          aria-label={texts.regionLabel}
          tabIndex={0}
          onKeyDown={onKeyDown}
        >
          <ul ref={trackRef} className="gallery__track" id="gallery-track">
            {Array.from({ length: sets }, (_, set) =>
              items.map((item) => {
                // Klone: fuer Screenreader und Tab unsichtbar, aber klickbar
                const clone = set > 0;
                return (
                  <li key={`${set}-${item.slug}`} className="gallery__item" aria-hidden={clone || undefined}>
                    <Link
                      className="tile"
                      href={item.href}
                      data-cursor="fill"
                      draggable={false}
                      tabIndex={clone ? -1 : undefined}
                    >
                      <span className="tile__media" data-flip-id={`project-${item.slug}`}>
                        {item.poster ? (
                          // eslint-disable-next-line @next/next/no-img-element -- Poster aus /public, bewusst ohne next/image
                          <img src={item.poster} alt="" draggable={false} loading="lazy" />
                        ) : (
                          <span className="tile__ph" aria-hidden="true">{texts.imageFollows}</span>
                        )}
                      </span>
                      <h3 className="tile__title">{item.title}</h3>
                      <span className="tile__meta">{item.meta}</span>
                    </Link>
                  </li>
                );
              }),
            )}
          </ul>
        </div>
      </div>

      <div className="container">
        <p className="gallery__pos" aria-live="polite">
          {pad(index + 1)} / {pad(items.length)}
        </p>
      </div>
    </>
  );
}
