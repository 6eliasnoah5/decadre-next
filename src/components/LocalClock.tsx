"use client";

import { useEffect, useState } from "react";

// Live-Uhr des Studios: feste Zeitzone Europe/Berlin, Ortsangabe als Prop.
// Server und erster Client-Render zeigen "--:--"; die echte Zeit kommt erst
// im useEffect, damit es keinen Hydration-Mismatch gibt.
// Aktualisiert genau zum Minutenwechsel statt in festen Intervallen.

const fmt = new Intl.DateTimeFormat("de-DE", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "Europe/Berlin",
});

export default function LocalClock({
  place,
  cityId,
  clockId,
  separator,
}: {
  /** Ortsangabe vor der Uhrzeit (aus den Sprachdateien) */
  place: string;
  cityId?: string;
  clockId: string;
  /** Text zwischen Ort und Uhrzeit, z. B. " " oder " · " */
  separator: string;
}) {
  const [time, setTime] = useState("--:--");

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const now = new Date();
      setTime(fmt.format(now));
      // naechster Aufruf kurz nach dem naechsten Minutenwechsel
      timer = setTimeout(tick, 60_000 - (now.getSeconds() * 1000 + now.getMilliseconds()) + 50);
    };
    tick();
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <b id={cityId}>{place}</b>{separator}<span id={clockId} aria-live="off">{time}</span>
    </>
  );
}
