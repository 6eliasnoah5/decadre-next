import type { NextConfig } from "next";

// Sicherheits-Header fuer alle Routen.
const securityHeaders = [
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
