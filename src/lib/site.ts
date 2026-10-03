import { existsSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";

// Seitenweite Konstanten fuer Metadaten, Sitemap und robots.txt.
// Nur serverseitig verwenden (liest beim Build das Dateisystem).

export const SITE_URL = "https://www.decadre.studio";
export const SITE_NAME = "Décadre Studio";
export const CONTACT_EMAIL = "hello@decadre.studio";

export const SITE_DESCRIPTION =
  "Multidisziplinäres Kreativstudio in Stuttgart. Brand Consulting, Videoproduktion und Visual Identity als eine durchgehende Erzählung.";

export const FAVICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%23F4F2EE'/%3E%3Ctext x='4' y='24' font-family='monospace' font-size='20' font-weight='700' fill='%23111111'%3ED.%3C/text%3E%3C/svg%3E";

// Das OG-Bild wird nur eingetragen, wenn die Datei existiert. Ein Verweis auf
// eine fehlende Datei wuerde in Link-Vorschauen ein kaputtes Bild erzeugen.
// Sobald public/images/og-image.jpg (1200x630) da ist, greift es automatisch.
const OG_IMAGE_PATH = "/images/og-image.jpg";
export const OG_IMAGE = existsSync(join(process.cwd(), "public", OG_IMAGE_PATH))
  ? OG_IMAGE_PATH
  : undefined;

/** Gemeinsame Open-Graph-Werte. Next ersetzt openGraph pro Seite komplett,
 *  daher spreaden Seiten mit eigener url diese Basis. */
export const baseOpenGraph: NonNullable<Metadata["openGraph"]> = {
  type: "website",
  siteName: SITE_NAME,
  title: "Décadre Studio — Stuttgart",
  description: SITE_DESCRIPTION,
  locale: "en_GB",
  ...(OG_IMAGE ? { images: OG_IMAGE } : {}),
};
