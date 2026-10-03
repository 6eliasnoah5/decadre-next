import type { Metadata } from "next";

// Seitenweite Konstanten fuer Metadaten, Sitemap und robots.txt.

export const SITE_URL = "https://www.decadre.studio";
export const SITE_NAME = "Décadre Studio";
export const CONTACT_EMAIL = "hello@decadre.studio";

/** Englisch, passend zu lang="en" und og:locale en_GB der Startseite. */
export const SITE_DESCRIPTION =
  "Multidisciplinary creative studio in Stuttgart. Brand consulting, video production and visual identity as one continuous narrative.";

/** Deutsch, fuer Impressum und Datenschutz (lang="de", og:locale de_DE). */
export const LEGAL_DESCRIPTION =
  "Multidisziplinäres Kreativstudio in Stuttgart. Brand Consulting, Videoproduktion und Visual Identity als eine durchgehende Erzählung.";

export const FAVICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%23F4F2EE'/%3E%3Ctext x='4' y='24' font-family='monospace' font-size='20' font-weight='700' fill='%23111111'%3ED.%3C/text%3E%3C/svg%3E";

/** Generiertes OG-Bild (src/app/opengraph-image.tsx), auch fuer Twitter/X. */
export const OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "Décadre Studio — Stuttgart",
  type: "image/png",
};

/** Gemeinsame Open-Graph-Werte. Next ersetzt openGraph pro Seite komplett,
 *  daher spreaden Seiten mit eigener url diese Basis. */
export const baseOpenGraph: NonNullable<Metadata["openGraph"]> = {
  type: "website",
  siteName: SITE_NAME,
  title: "Décadre Studio — Stuttgart",
  description: SITE_DESCRIPTION,
  locale: "en_GB",
  images: OG_IMAGE,
};
