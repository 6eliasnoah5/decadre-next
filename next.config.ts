import type { NextConfig } from "next";

// Content-Security-Policy, erzwungen. Vorher im Report-Only-Modus geprueft:
// lokal und in der Vercel-Preview keine Verstoesse (ausser vercel.live, das
// nur in Previews eingeblendet wird).
// 'unsafe-inline' bei script-src ist noetig fuer das FadeInScript im <head>
// und die Inline-Scripts, mit denen Next.js die RSC-Daten ausliefert.
// Im Dev-Modus braucht React zusaetzlich 'unsafe-eval' (Fehler-Stacks).
const isDev = process.env.NODE_ENV === "development";
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "media-src 'self'",
  "font-src 'self'",
  "connect-src 'self'",
  "worker-src 'self' blob:",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ") + ";";

// Sicherheits-Header fuer alle Routen.
const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  // Nur HTTPS, 2 Jahre, inkl. Subdomains; Voraussetzung fuer die HSTS-Preload-Liste.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // Kein MIME-Sniffing: Dateien nur mit ihrem deklarierten Content-Type ausfuehren.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Seite darf nicht in Frames eingebettet werden (Clickjacking).
  { key: "X-Frame-Options", value: "DENY" },
  // Fremde Seiten sehen nur den Origin, nicht den vollen Pfad.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Keine Kamera, kein Mikrofon, keine Ortung.
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  // Eigenes Browsing-Context-Fenster, kein Zugriff durch geoeffnete Popups.
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },

  // Alte URLs der statischen Site auf die neuen Routen umleiten.
  // /index.html wird noch von den Header-Links der Unterseiten benutzt.
  async redirects() {
    return [
      { source: "/impressum.html", destination: "/impressum", permanent: true },
      { source: "/datenschutz.html", destination: "/datenschutz", permanent: true },
      { source: "/index.html", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
