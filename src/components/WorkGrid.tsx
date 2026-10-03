"use client";

import { useRef } from "react";
import { useAppStore } from "@/store/useAppStore";
import { work, type WorkEntry } from "@/lib/content";
import StudioVideo from "@/components/media/StudioVideo";

// Asymmetrisches Work-Grid mit Hover-Play:
// mouseenter -> play, mouseleave -> pause + zurueck auf 0.
// Kacheln sind <div>, solange es keine Case-Study-Seiten gibt (vorher
// <a href="#"> ohne Ziel). Damit sind sie nicht mehr per Tab fokussierbar;
// das Fokus-Play entfaellt, weil es nichts auszuloesen gibt.
// pointerenter/leave steuern den Custom-Cursor ueber den Store (nur bei
// feinem Zeiger mit Hover und ohne reduced motion, wie im Original).
// Inhalte kommen ausschliesslich aus src/lib/content.ts.

function cursorAllowed() {
  return (
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function WorkSlot({ entry }: { entry: WorkEntry }) {
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
    <div
      className={`slot slot--${entry.index}`}
      role="group"
      aria-label={`project ${entry.index}`}
      onMouseEnter={play}
      onMouseLeave={pause}
      onPointerEnter={() => { if (cursorAllowed()) setCursorMode("play"); }}
      onPointerLeave={() => { if (cursorAllowed()) setCursorMode("default"); }}
    >
      <StudioVideo
        ref={videoRef}
        className="slot__media"
        src={entry.video}
        poster={entry.poster}
        data-hover-play=""
        aria-label={entry.title}
      />
      <div className="slot__placeholder" aria-hidden="true">{`[ ${entry.index} ]  ${entry.placeholder}`}</div>
      <div className="slot__overlay">
        <span className="slot__title">{entry.title}</span>
        <span className="slot__meta">{entry.category}</span>
      </div>
    </div>
  );
}

export default function WorkGrid() {
  return (
    <div className="work__grid">
      {work.map((entry) => (
        <WorkSlot key={entry.slug} entry={entry} />
      ))}
    </div>
  );
}
