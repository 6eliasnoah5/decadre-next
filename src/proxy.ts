import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Next 16: "proxy" ersetzt "middleware". Ordnet Anfragen der Sprache zu und
// schreibt die lokalisierten Pfade auf die internen Routen um
// (z. B. /en/notes/x -> /en/notizen/x, / -> /de).
export default createMiddleware(routing);

export const config = {
  // Alles ausser API, Next-Interna, Metadaten-Routen und Dateien mit Endung.
  matcher: ["/((?!api|_next|_vercel|opengraph-image|robots.txt|sitemap.xml|.*\\..*).*)"],
};
