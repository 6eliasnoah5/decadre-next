"use client";

import { useSyncExternalStore } from "react";

// Live-Uhr, Verhalten 1:1 aus den Legacy-Scripts:
// - "visitor" (Startseite): Zeit in der Zeitzone des Besuchers, Label =
//   Kontinent aus der IANA-Zeitzone ("Europe/Berlin" -> "Europe").
//   Bekannte Macke, wird separat geklaert.
// - "berlin" (Rechtsseiten): Zeit fest Europe/Berlin, Label bleibt "Stuttgart".
// Aktualisierung alle 15 s. Server und erster Render zeigen "Stuttgart" und
// "--:--" wie das statische HTML.

type Variant = "visitor" | "berlin";

const formatters: Partial<Record<Variant, Intl.DateTimeFormat>> = {};
function formatter(variant: Variant) {
  return (formatters[variant] ??= new Intl.DateTimeFormat("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    ...(variant === "berlin" ? { timeZone: "Europe/Berlin" } : {}),
  }));
}

function subscribeTick(onTick: () => void) {
  const id = setInterval(onTick, 1000 * 15);
  return () => clearInterval(id);
}

const noopSubscribe = () => () => {};

function visitorRegion(): string {
  let tz = "";
  try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ""; } catch { tz = ""; }
  let region = "Europe";
  if (tz && tz.indexOf("/") !== -1) {
    region = tz.split("/")[0].replace(/_/g, " ");
  }
  return region;
}

export default function LocalClock({
  variant = "visitor",
  cityId,
  clockId,
  separator,
}: {
  variant?: Variant;
  cityId?: string;
  clockId: string;
  /** Text zwischen Ort und Uhrzeit, z. B. " " oder " · " */
  separator: string;
}) {
  const time = useSyncExternalStore(subscribeTick, () => formatter(variant).format(new Date()), () => "--:--");
  const city = useSyncExternalStore(
    noopSubscribe,
    () => (variant === "visitor" ? visitorRegion() : "Stuttgart"),
    () => "Stuttgart",
  );

  return (
    <>
      <b id={cityId}>{city}</b>{separator}<span id={clockId} aria-live="off">{time}</span>
    </>
  );
}
