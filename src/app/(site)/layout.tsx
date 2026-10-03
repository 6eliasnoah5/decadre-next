import type { Metadata, Viewport } from "next";
import "../globals.css";
import { fontVariables } from "../fonts";
import Providers from "../Providers";
import FadeInScript from "@/components/FadeInScript";
import { SITE_URL, SITE_DESCRIPTION, FAVICON, OG_IMAGE, baseOpenGraph } from "@/lib/site";

// Seitenweite Metadaten fuer (site). canonical und og:url setzt die Seite
// selbst, damit kuenftige Unterseiten nicht "/" erben.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Décadre Studio — Stuttgart",
    template: "%s — Décadre Studio",
  },
  description: SITE_DESCRIPTION,
  openGraph: baseOpenGraph,
  twitter: {
    card: "summary_large_image",
    title: "Décadre Studio — Stuttgart",
    description: SITE_DESCRIPTION,
    ...(OG_IMAGE ? { images: OG_IMAGE } : {}),
  },
  robots: { index: true, follow: true },
  icons: { icon: FAVICON },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#F4F2EE",
};

// lang="en": Die Inhalte der Startseite sind englisch.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: FadeInScript setzt vor der Hydration die Klasse "js".
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <head>
        <FadeInScript />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
