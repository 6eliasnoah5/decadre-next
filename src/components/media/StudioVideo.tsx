import type { ComponentPropsWithRef } from "react";

// Kapselt alle <video>-Tags der Site. Immer muted + playsInline, damit
// Autoplay/Hover-Play auf Mobilgeraeten erlaubt ist.
// Weitere Attribute (autoPlay, aria-label, data-*) und ref werden durchgereicht.

// preload je nach priority. Bewusst beide "metadata": Auch ein prioritaeres
// Video (Hero) laedt vorab nur Dauer und Masse, nie die ganze Datei; das
// Hero-Video ist zudem per CSS versteckt und wuerde sonst komplett geladen,
// sobald es existiert. Hier zentral anpassen, falls sich das aendert.
const PRELOAD = { priority: "metadata", default: "metadata" } as const;

type StudioVideoProps = {
  src: string;
  poster?: string;
  priority?: boolean;
  loop?: boolean;
  className?: string;
} & Omit<ComponentPropsWithRef<"video">, "src" | "poster" | "loop" | "className" | "muted" | "playsInline" | "preload" | "children">;

export default function StudioVideo({
  src,
  poster,
  priority = false,
  loop = true,
  className,
  ...rest
}: StudioVideoProps) {
  return (
    <video
      className={className}
      muted
      loop={loop}
      playsInline
      preload={priority ? PRELOAD.priority : PRELOAD.default}
      poster={poster}
      {...rest}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
