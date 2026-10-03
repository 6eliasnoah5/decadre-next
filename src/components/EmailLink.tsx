"use client";

import { useSyncExternalStore, type ReactNode } from "react";

// E-Mail-Link, Adresse erst im Browser zusammengesetzt, damit sie nicht im
// HTML-Quelltext steht (wie im Legacy-Script). Vor dem Mount: href="#" und
// das Label aus dem Markup. Danach: mailto: und - ohne keepLabel - die
// Adresse als Text.
const noopSubscribe = () => () => {};

export default function EmailLink({
  user,
  domain,
  keepLabel = false,
  className = "email-link",
  children,
}: {
  user: string;
  domain: string;
  keepLabel?: boolean;
  className?: string;
  children?: ReactNode;
}) {
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const addr = user + "@" + domain;

  return (
    <a
      href={mounted ? "mailto:" + addr : "#"}
      className={className}
      data-user={user}
      data-domain={domain}
      data-keep-label={keepLabel ? "" : undefined}
    >
      {mounted && !keepLabel ? addr : children}
    </a>
  );
}
