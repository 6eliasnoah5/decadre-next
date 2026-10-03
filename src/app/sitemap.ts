import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { HOME_PATHS } from "@/lib/i18n-meta";
import { getAllPublishedNotes, notePath } from "@/lib/content";

// /sitemap.xml: Startseite in beiden Sprachen (mit hreflang-Alternativen),
// Rechtsseiten nur auf Deutsch, veroeffentlichte Notizen in ihrer Sprache
// (Entwuerfe nicht).
const abs = (path: string) => (path === "/" ? SITE_URL : `${SITE_URL}${path}`);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const homeAlternates = {
    languages: { de: abs(HOME_PATHS.de), en: abs(HOME_PATHS.en), "x-default": abs(HOME_PATHS.de) },
  };
  return [
    { url: abs(HOME_PATHS.de), lastModified, changeFrequency: "monthly", priority: 1, alternates: homeAlternates },
    { url: abs(HOME_PATHS.en), lastModified, changeFrequency: "monthly", priority: 0.9, alternates: homeAlternates },
    { url: abs("/impressum"), lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: abs("/datenschutz"), lastModified, changeFrequency: "yearly", priority: 0.3 },
    ...(await getAllPublishedNotes()).map((note) => ({
      url: abs(notePath(note)),
      lastModified: new Date(`${note.date}T00:00:00Z`),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
