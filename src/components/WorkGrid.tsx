"use client";

import { useRef } from "react";
import { useAppStore } from "@/store/useAppStore";

// Asymmetrisches Work-Grid mit Hover-Play wie im Legacy-Script:
// mouseenter/focus -> play, mouseleave/blur -> pause + zurueck auf 0.
// pointerenter/leave steuern den Custom-Cursor ueber den Store (nur bei
// feinem Zeiger mit Hover und ohne reduced motion, wie im Original).

type Slot = {
  index: string;
  video: string;
  poster: string;
  placeholder: string;
  title: string;
  meta: string;
};

// Vorlaeufig hier; wandert im naechsten Schritt nach src/lib/content.ts.
const SLOTS: Slot[] = [
  { index: "01", video: "videos/work-01.mp4", poster: "videos/work-01.jpg", placeholder: "[ 01 ]  first case — in production", title: "[ platzhalter ]", meta: "brand film" },
  { index: "02", video: "videos/work-02.mp4", poster: "videos/work-02.jpg", placeholder: "[ 02 ]  concept film — twentytwentysix", title: "[ platzhalter ]", meta: "campaign" },
  { index: "03", video: "videos/work-03.mp4", poster: "videos/work-03.jpg", placeholder: "[ 03 ]  ―", title: "[ platzhalter ]", meta: "identity" },
  { index: "04", video: "videos/work-04.mp4", poster: "videos/work-04.jpg", placeholder: "[ 04 ]  ―", title: "[ platzhalter ]", meta: "editorial motion" },
];

function cursorAllowed() {
  return (
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function WorkSlot({ slot }: { slot: Slot }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const setCursorMode = useAppStore((s) => s.setCursorMode);

  const play = () => { videoRef.current?.play().catch(() => {}); };
  const pause = () => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
  };

  return (
    <a
      className={`slot slot--${slot.index}`}
      href="#"
      aria-label={`project ${slot.index}`}
      onMouseEnter={play}
      onMouseLeave={pause}
      onFocus={play}
      onBlur={pause}
      onPointerEnter={() => { if (cursorAllowed()) setCursorMode("play"); }}
      onPointerLeave={() => { if (cursorAllowed()) setCursorMode("default"); }}
    >
      <video
        ref={videoRef}
        className="slot__media"
        muted
        loop
        playsInline
        preload="metadata"
        poster={slot.poster}
        data-hover-play=""
        aria-label={slot.title}
      >
        <source src={slot.video} type="video/mp4" />
      </video>
      <div className="slot__placeholder" aria-hidden="true">{slot.placeholder}</div>
      <div className="slot__overlay">
        <span className="slot__title">{slot.title}</span>
        <span className="slot__meta">{slot.meta}</span>
      </div>
    </a>
  );
}

export default function WorkGrid() {
  return (
    <div className="work__grid">
      {SLOTS.map((slot) => (
        <WorkSlot key={slot.index} slot={slot} />
      ))}
    </div>
  );
}
