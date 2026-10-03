import type { ComponentPropsWithRef } from "react";

// Kapselt alle <video>-Tags der Site. Immer muted + playsInline, damit
// Autoplay/Hover-Play auf Mobilgeraeten erlaubt ist.
// priority: Video ist sofort relevant (z. B. Hero) -> preload="auto";
// sonst preload="metadata", damit nur Dauer/Masse geladen werden.
// Weitere Attribute (autoPlay, aria-label, data-*) und ref werden durchgereicht.

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
      preload={priority ? "auto" : "metadata"}
      poster={poster}
      {...rest}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
