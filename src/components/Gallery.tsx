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

// Galerie fuer [ 03 ] projekte: horizontale Spur ueber die volle Breite,
// beginnt an der linken Rasterkante und laeuft rechts aus.
//
// Grundzustand (ohne JS und bei reduced motion): natives horizontales
// Scrollen mit Scrollbar, keine Animation. Mit JS und Bewegung: die Spur
// wird per GSAP Draggable gezogen (Maus und Touch), mit Traegheit und Snap
// auf den Kachelanfang. Dazu Pfeil-Buttons im Abschnittskopf und die
// Pfeiltasten, wenn die Spur den Fokus hat. Beim ersten Erscheinen steigen
// die Kacheln nacheinander auf; ein Klick laesst das Bild per Flip in den
// Videoplatz der Projektseite wachsen (src/lib/flipTransition.ts).

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
  const router = useRouter();
  const routerRef = useRef(router);
  useLayoutEffect(() => {
    routerRef.current = router;
  }, [router]);

  // Layout-Effekt: laeuft vor dem Template-Effekt (Eltern nach Kindern),
  // die Spur steht also schon an der richtigen Kachel, wenn ein Flip zurueck
  // aus der Projektseite ansteht.
  useLayoutEffect(() => {
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
    // Rueckweg von einer Projektseite: an dessen Kachel starten
    const flipId = pendingFlipId();
    const startIndex = Math.max(0, tiles.findIndex((t) => t.querySelector(`[data-flip-id="${flipId}"]`)));

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
      viewport.scrollLeft = positions[startIndex];
      onScroll();
      return () => {
        ro.disconnect();
        viewport.removeEventListener("scroll", onScroll);
        goToRef.current = () => {};
      };
    }

    // ---------- Drag mit Traegheit und Snap ----------
    let current = startIndex;
    gsap.set(track, { x: -positions[startIndex] });
    setIndex(startIndex);
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
    // Rueckweg per Flip, da soll die Zielkachel sofort stehen).
    const entrance = flipId
      ? null
      : gsap.fromTo(
          tiles,
          { y: 24, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.8,
            stagger: 0.06,
            ease: "expo.out",
            clearProps: "transform,opacity,visibility",
            scrollTrigger: { trigger: viewport, start: "top 85%", once: true },
          },
        );
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
      entrance?.scrollTrigger?.kill();
      entrance?.kill();
      gsap.set(tiles, { clearProps: "transform,opacity,visibility" });
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
        <div className="section-head">
          <span className="section-head__num">{texts.num}</span>
          <h2 className="section-title" data-split="">{texts.title}</h2>
          <span className="section-head__hint">{texts.hint}</span>
        </div>
        <div className="gallery__bar">
          <p className="work__note">{texts.intro}</p>
          <span className="gallery__controls">
            <button type="button" aria-label={texts.prevLabel} aria-controls="gallery-track" disabled={index === 0} onClick={() => step(-1)}>
              {texts.prev}
            </button>
            <button type="button" aria-label={texts.nextLabel} aria-controls="gallery-track" disabled={index === items.length - 1} onClick={() => step(1)}>
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
            {items.map((item) => (
              <li key={item.slug} className="gallery__item">
                <Link className="tile" href={item.href} data-cursor="fill" draggable={false}>
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
