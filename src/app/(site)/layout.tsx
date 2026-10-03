import type { Metadata, Viewport } from "next";
import "../globals.css";
import { fontVariables } from "../fonts";
import Providers from "../Providers";
import FadeInScript from "@/components/FadeInScript";

// Werte 1:1 aus dem <head> von legacy/index.html, inklusive Platzhaltern.
export const metadata: Metadata = {
  // Noetig, weil Next relative og/twitter-Bild-Pfade sonst auf localhost aufloest.
  // Ergibt dieselbe absolute URL, auf die ein Crawler den Legacy-Pfad aufloest.
  metadataBase: new URL("https://decadre.studio"),
  title: "Décadre Studio — Stuttgart",
  description: "[ platzhalter ]",
  openGraph: {
    type: "website",
    title: "Décadre Studio — Stuttgart",
    description: "[ platzhalter ]",
    url: "https://decadre.studio",
    siteName: "Décadre Studio",
    locale: "de_DE",
    images: "images/og-image.jpg",
  },
  twitter: {
    card: "summary_large_image",
    title: "Décadre Studio — Stuttgart",
    description: "[ platzhalter ]",
    images: "images/og-image.jpg",
  },
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%23F4F2EE'/%3E%3Ctext x='4' y='24' font-family='monospace' font-size='20' font-weight='700' fill='%23111111'%3ED.%3C/text%3E%3C/svg%3E",
  },
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
