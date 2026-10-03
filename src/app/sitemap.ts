import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { HOME_PATHS, projectPaths } from "@/lib/i18n-meta";
import { PROJECTS } from "@/lib/content";

// /sitemap.xml: Startseite in beiden Sprachen (mit hreflang-Alternativen),
// Rechtsseiten nur auf Deutsch, Projektseiten in beiden Sprachen
// (Platzhalter ausgenommen).
const abs = (path: string) => (path === "/" ? SITE_URL : `${SITE_URL}${path}`);

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const homeAlternates = {
    languages: { de: abs(HOME_PATHS.de), en: abs(HOME_PATHS.en), "x-default": abs(HOME_PATHS.de) },
  };
  const projects = PROJECTS.filter((p) => !p.placeholder).flatMap((p) => {
    const paths = projectPaths(p.slug);
    const alternates = { languages: { de: abs(paths.de), en: abs(paths.en), "x-default": abs(paths.de) } };
    return [
      { url: abs(paths.de), lastModified, changeFrequency: "yearly" as const, priority: 0.7, alternates },
      { url: abs(paths.en), lastModified, changeFrequency: "yearly" as const, priority: 0.6, alternates },
    ];
  });
  return [
    { url: abs(HOME_PATHS.de), lastModified, changeFrequency: "monthly", priority: 1, alternates: homeAlternates },
    { url: abs(HOME_PATHS.en), lastModified, changeFrequency: "monthly", priority: 0.9, alternates: homeAlternates },
    { url: abs("/impressum"), lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: abs("/datenschutz"), lastModified, changeFrequency: "yearly", priority: 0.3 },
    ...projects,
  ];
}
