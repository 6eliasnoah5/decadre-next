"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { useMotionCapability } from "@/hooks/useMotionCapability";

gsap.registerPlugin(Draggable, InertiaPlugin);

// Galerie fuer [ 03 ] projekte: horizontale Spur ueber die volle Breite,
// beginnt an der linken Rasterkante und laeuft rechts aus.
//
// Grundzustand (ohne JS und bei reduced motion): natives horizontales
// Scrollen mit Scrollbar, keine Animation. Mit JS und Bewegung: die Spur
// wird per GSAP Draggable gezogen (Maus und Touch), mit Traegheit und Snap
// auf den Kachelanfang. Dazu Pfeil-Buttons im Abschnittskopf und die
// Pfeiltasten, wenn die Spur den Fokus hat.

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
  label: string;
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
const noopSubscribe = () => () => {};

export default function Gallery({ items, texts }: { items: GalleryItem[]; texts: GalleryTexts }) {
  const { reducedMotion } = useMotionCapability();
  // Erst nach der Hydration ziehen; Server und erster Render: nativ.
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const mode = hydrated && !reducedMotion ? "drag" : "native";

  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const goToRef = useRef<(i: number) => void>(() => {});
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;
    const tiles = Array.from(track.children) as HTMLElement[];
    if (!tiles.length) return;

    // Kachelanfaenge relativ zur ersten Kachel, begrenzt auf den Scrollweg.
    let positions: number[] = [];
    let maxScroll = 0;
    const measure = () => {
      maxScroll = Math.max(0, track.scrollWidth - viewport.clientWidth);
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
    const clampIndex = (i: number) => Math.max(0, Math.min(tiles.length - 1, i));
    measure();

    // ---------- nativ: Scrollbar, Spruenge ohne Animation ----------
    if (mode === "native") {
      const onScroll = () => setIndex(closest(viewport.scrollLeft));
      goToRef.current = (i) => {
        viewport.scrollTo({ left: positions[clampIndex(i)], behavior: "instant" });
      };
      const ro = new ResizeObserver(() => {
        measure();
        onScroll();
      });
      ro.observe(viewport);
      viewport.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
      return () => {
        ro.disconnect();
        viewport.removeEventListener("scroll", onScroll);
        goToRef.current = () => {};
      };
    }

    // ---------- Drag mit Traegheit und Snap ----------
    let current = 0;
    const update = (x: number) => {
      current = closest(-x);
      setIndex(current);
    };

    let moved = false;
    const [draggable] = Draggable.create(track, {
      type: "x",
      bounds: { minX: -maxScroll, maxX: 0 },
      inertia: true,
      dragClickables: true,
      edgeResistance: 0.85,
      snap: { x: (x: number) => -positions[closest(-x)] },
      onPress() {
        moved = false;
        gsap.killTweensOf(track);
      },
      onDrag() {
        if (Math.abs(this.x - this.startX) > 4) moved = true;
        update(this.x);
      },
      onThrowUpdate() {
        update(this.x);
      },
    });

    const goTo = (i: number, instant = false) => {
      const target = clampIndex(i);
      gsap.killTweensOf(track);
      update(-positions[target]);
      gsap.to(track, {
        x: -positions[target],
        duration: instant ? 0 : 0.8,
        ease: "expo.out",
        onUpdate: () => draggable.update(),
      });
    };
    goToRef.current = (i) => goTo(i);

    // Gezogen statt geklickt: den Link-Klick danach verschlucken.
    const onClick = (e: MouseEvent) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    };
    // Fokus per Tab: Browser scrollen auch overflow:hidden-Container zum
    // fokussierten Element. Das zuruecksetzen und stattdessen die Spur fahren.
    const onFocusIn = (e: FocusEvent) => {
      const i = tiles.findIndex((t) => t.contains(e.target as Node));
      viewport.scrollLeft = 0;
      if (i >= 0 && i !== current) goTo(i);
    };
    const onViewportScroll = () => {
      if (viewport.scrollLeft !== 0) viewport.scrollLeft = 0;
    };
    // Horizontales Wischen auf dem Trackpad, danach auf die Kachel einrasten.
    let wheelTimer: ReturnType<typeof setTimeout> | undefined;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      gsap.killTweensOf(track);
      const x = Math.max(-maxScroll, Math.min(0, (gsap.getProperty(track, "x") as number) - e.deltaX));
      gsap.set(track, { x });
      draggable.update();
      update(x);
      clearTimeout(wheelTimer);
      wheelTimer = setTimeout(() => goTo(closest(-x)), 140);
    };
    const ro = new ResizeObserver(() => {
      measure();
      draggable.applyBounds({ minX: -maxScroll, maxX: 0 });
      goTo(current, true);
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
      gsap.killTweensOf(track);
      gsap.set(track, { clearProps: "transform,touchAction,cursor,userSelect" });
      goToRef.current = () => {};
    };
  }, [mode]);

  const step = useCallback((dir: number) => goToRef.current(index + dir), [index]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") step(1);
    else if (e.key === "ArrowLeft") step(-1);
    else return;
    e.preventDefault();
  };

  return (
    <>
      <div className="container">
        <div className="section-head section-head--controls">
          <span className="section-head__num">{texts.num}</span>
          <span className="section-head__lbl">{texts.label}</span>
          <span className="gallery__controls">
            <button type="button" aria-label={texts.prevLabel} aria-controls="gallery-track" disabled={index === 0} onClick={() => step(-1)}>
              {texts.prev}
            </button>
            <button type="button" aria-label={texts.nextLabel} aria-controls="gallery-track" disabled={index === items.length - 1} onClick={() => step(1)}>
              {texts.next}
            </button>
          </span>
        </div>
        <h2 className="section-title">{texts.title}</h2>
        <p className="work__note">{texts.intro}</p>
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
            {items.map((item) => (
              <li key={item.slug} className="gallery__item">
                <Link className="tile" href={item.href} data-cursor="fill" draggable={false}>
                  <span className="tile__media">
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
            ))}
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
