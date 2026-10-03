"use client";

import { useState } from "react";

// Video-Einbettung erst auf Klick (Zwei-Klick-Loesung): vorher wird keine
// Verbindung zu Vimeo oder YouTube aufgebaut. Ohne videoUrl rendert die
// Detailseite stattdessen den Platzhalter "[ video folgt ]".
// Die Hosts muessen in der CSP unter frame-src stehen (next.config.ts).

export default function VideoEmbed({
  url,
  title,
  loadLabel,
  note,
}: {
  url: string;
  title: string;
  loadLabel: string;
  note: string;
}) {
  const [active, setActive] = useState(false);

  if (active) {
    return (
      <iframe
        className="project__iframe"
        src={url}
        title={title}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
    );
  }
  return (
    <button type="button" className="project__load" onClick={() => setActive(true)}>
      <span>{loadLabel}</span>
      <span className="project__load-note">{note}</span>
    </button>
  );
}
