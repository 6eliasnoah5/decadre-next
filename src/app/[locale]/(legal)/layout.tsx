import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import "../../legal.css";
import { fontVariables } from "../../fonts";
import Providers from "../../Providers";
import FadeInScript from "@/components/FadeInScript";
import { SITE_URL, LEGAL_DESCRIPTION, FAVICON, OG_IMAGE, SITE_NAME } from "@/lib/site";

// Eigenes Root-Layout fuer die Rechtsseiten (eigenes Stylesheet, siehe
// legal.css). Impressum und Datenschutz gibt es rechtlich nur auf Deutsch:
// nur locale "de" wird gebaut, /en/impressum und /en/datenschutz leitet
// next.config.ts auf die deutschen Fassungen um.

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ locale: "de" }];
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s — ${SITE_NAME}` },
  description: LEGAL_DESCRIPTION,
  robots: { index: true, follow: true },
  icons: { icon: FAVICON },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    description: LEGAL_DESCRIPTION,
    locale: "de_DE",
    images: OG_IMAGE,
  },
  twitter: { card: "summary_large_image", images: OG_IMAGE },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#F2F1ED",
};

export default async function LegalLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (locale !== "de") notFound();
  setRequestLocale(locale);

  return (
    // suppressHydrationWarning: FadeInScript setzt vor der Hydration die Klasse "js".
    <html lang="de" className={fontVariables} suppressHydrationWarning>
      <head>
        <FadeInScript />
      </head>
      <body>
        <NextIntlClientProvider>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
