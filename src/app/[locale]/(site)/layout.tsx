import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import "../../globals.css";
import { fontVariables } from "../../fonts";
import Providers from "../../Providers";
import FadeInScript from "@/components/FadeInScript";
import { routing, OG_LOCALE } from "@/i18n/routing";
import { SITE_URL, FAVICON, OG_IMAGE, SITE_NAME } from "@/lib/site";

// Root-Layout der Site, eine Instanz pro Sprache (de auf "/", en auf "/en").
// canonical, og:url und hreflang setzen die Seiten selbst.

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t("title"), template: `%s — ${SITE_NAME}` },
    description: t("description"),
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: t("title"),
      description: t("description"),
      locale: OG_LOCALE[locale],
      alternateLocale: routing.locales.filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
      images: OG_IMAGE,
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: OG_IMAGE,
    },
    robots: { index: true, follow: true },
    icons: { icon: FAVICON },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#F2F1ED",
};

export default async function SiteLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    // suppressHydrationWarning: FadeInScript setzt vor der Hydration die Klasse "js".
    <html lang={locale} className={fontVariables} suppressHydrationWarning>
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
