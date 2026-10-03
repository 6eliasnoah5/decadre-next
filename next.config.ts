import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
