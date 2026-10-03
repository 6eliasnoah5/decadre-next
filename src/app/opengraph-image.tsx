import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// OG-Bild, zur Buildzeit generiert (statisch, keine Request-APIs).
// Gestaltung im Stil der Site: Offwhite-Flaeche, schwarze Schrift, kein
// Rahmen, kein Logo, keine Effekte. Erreichbar unter /opengraph-image.
// Eingetragen wird es ueber OG_IMAGE in src/lib/site.ts: Im App-Wurzelordner
// gibt es kein Layout und damit keine metadataBase, die automatische
// Einbindung wuerde sonst auf localhost zeigen.
// Die Schriften liegen als TTF in assets/fonts (Satori liest kein woff2).

export const alt = "Décadre — Elias Noah Nies, Producer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BG = "#F2F1ED";
const FG = "#111111";
const TITLE_SIZE = 136;

export default async function OpengraphImage() {
  const [interTightBold, jetbrainsMono] = await Promise.all([
    readFile(join(process.cwd(), "assets/fonts/InterTight-Bold.ttf")),
    readFile(join(process.cwd(), "assets/fonts/JetBrainsMono-Regular.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 88px",
          background: BG,
          color: FG,
        }}
      >
        <div
          style={{
            fontFamily: "Inter Tight",
            fontWeight: 700,
            fontSize: TITLE_SIZE,
            lineHeight: 0.95,
            // -0.05em wie .hero__title, in px umgerechnet
            letterSpacing: TITLE_SIZE * -0.05,
          }}
        >
          Décadre
        </div>
        <div
          style={{
            marginTop: 36,
            fontFamily: "JetBrains Mono",
            fontWeight: 400,
            fontSize: 26,
            letterSpacing: 26 * 0.04,
          }}
        >
          [ elias noah nies — producer — weltweit ]
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Inter Tight", data: interTightBold, weight: 700, style: "normal" },
        { name: "JetBrains Mono", data: jetbrainsMono, weight: 400, style: "normal" },
      ],
    },
  );
}
