// Projekte fuer [ 03 ] projekte und die Detailseiten /projekte/[slug]
// (englisch /en/projects/[slug]). Reihenfolge der Galerie = Reihenfolge hier.
// placeholder: true kennzeichnet Dummy-Eintraege ("Platzhalter" steht
// sichtbar im Titel); sie erscheinen in der
// Galerie, aber nicht in der Sitemap, und ihre Detailseiten sind noindex.

// Credit-Rollen sind ein einziger String fuer beide Sprachen, deshalb in den
// branchenueblichen englischen Bezeichnungen.
export type Credit = { role: string; name: string };

export type Project = {
  slug: string;
  index: number;
  title: { de: string; en: string };
  /** Auftraggeber oder Plattform */
  client: string | null;
  year: number | null;
  /** Mono-Beschriftung, daher klein geschrieben */
  format: { de: string; en: string };
  role: { de: string; en: string };
  /** 2-4 Saetze */
  synopsis: { de: string; en: string };
  /** Vimeo- oder YouTube-Embed-URL */
  videoUrl: string | null;
  /** Pfad in /public/images */
  poster: string | null;
  credits: Credit[];
  placeholder: boolean;
};

export const PROJECTS: Project[] = [
  {
    slug: "platzhalter-eins",
    index: 1,
    title: { de: "Platzhalter Eins", en: "Placeholder One" },
    client: "Auftraggeber A",
    year: 2026,
    format: { de: "kurzfilm", en: "short film" },
    role: { de: "Producer", en: "Producer" },
    synopsis: {
      de: "Ein Kurzfilm über eine Nacht, in der nichts passiert und trotzdem alles kippt. Gedreht an drei Orten in vier Tagen. Der Text ist ein Platzhalter und wird ersetzt.",
      en: "A short film about a night in which nothing happens and everything still shifts. Shot in three locations over four days. This text is a placeholder and will be replaced.",
    },
    videoUrl: null,
    poster: null,
    credits: [
      { role: "Director", name: "Vorname Nachname" },
      { role: "Producer", name: "Elias Noah Nies" },
      { role: "Director of Photography", name: "Vorname Nachname" },
      { role: "Gaffer", name: "Vorname Nachname" },
      { role: "Production Design", name: "Vorname Nachname" },
      { role: "Sound", name: "Vorname Nachname" },
      { role: "Editor", name: "Vorname Nachname" },
      { role: "Colourist", name: "Vorname Nachname" },
    ],
    placeholder: true,
  },
  {
    slug: "platzhalter-zwei",
    index: 2,
    title: { de: "Platzhalter Zwei", en: "Placeholder Two" },
    client: "Label B",
    year: 2025,
    format: { de: "musikvideo", en: "music video" },
    role: { de: "Producer", en: "Producer" },
    synopsis: {
      de: "Ein Musikvideo in einer einzigen Einstellung. Die Kamera bleibt, die Menschen gehen. Der Text ist ein Platzhalter und wird ersetzt.",
      en: "A music video in a single take. The camera stays, the people leave. This text is a placeholder and will be replaced.",
    },
    videoUrl: null,
    poster: null,
    credits: [
      { role: "Artist", name: "Vorname Nachname" },
      { role: "Director", name: "Vorname Nachname" },
      { role: "Producer", name: "Elias Noah Nies" },
      { role: "Director of Photography", name: "Vorname Nachname" },
      { role: "Steadicam", name: "Vorname Nachname" },
      { role: "Choreography", name: "Vorname Nachname" },
    ],
    placeholder: true,
  },
  {
    slug: "platzhalter-drei",
    index: 3,
    title: { de: "Platzhalter Drei", en: "Placeholder Three" },
    client: "Marke C",
    year: 2025,
    format: { de: "kampagne", en: "campaign" },
    role: { de: "Producer, Herstellungsleitung", en: "Producer, line producer" },
    synopsis: {
      de: "Eine Kampagne aus Film und Fotografie, entstanden an einem Drehtag mit zwei Teams. Ein Motiv, zwei Medien, ein Zeitplan. Der Text ist ein Platzhalter und wird ersetzt.",
      en: "A campaign in film and photography, made on a single shoot day with two crews. One subject, two media, one schedule. This text is a placeholder and will be replaced.",
    },
    videoUrl: null,
    poster: null,
    credits: [
      { role: "Client", name: "Marke C" },
      { role: "Director", name: "Vorname Nachname" },
      { role: "Producer", name: "Elias Noah Nies" },
      { role: "Director of Photography", name: "Vorname Nachname" },
      { role: "Photography", name: "Vorname Nachname" },
      { role: "Styling", name: "Vorname Nachname" },
      { role: "Make-up", name: "Vorname Nachname" },
      { role: "Production Assistant", name: "Vorname Nachname" },
      { role: "Editor", name: "Vorname Nachname" },
      { role: "Sound", name: "Vorname Nachname" },
    ],
    placeholder: true,
  },
  {
    slug: "platzhalter-vier",
    index: 4,
    title: { de: "Platzhalter Vier", en: "Placeholder Four" },
    client: null,
    year: 2024,
    format: { de: "dokumentarfilm", en: "documentary" },
    role: { de: "Producer", en: "Producer" },
    synopsis: {
      de: "Ein Dokumentarfilm über einen Ort, der im Winter verschwindet. Ohne Kommentar, ohne Musik. Gedreht über ein Jahr. Der Text ist ein Platzhalter und wird ersetzt.",
      en: "A documentary about a place that disappears in winter. No narration, no score. Filmed over one year. This text is a placeholder and will be replaced.",
    },
    videoUrl: null,
    poster: null,
    credits: [
      { role: "Director", name: "Vorname Nachname" },
      { role: "Producer", name: "Elias Noah Nies" },
      { role: "Director of Photography", name: "Vorname Nachname" },
      { role: "Sound", name: "Vorname Nachname" },
      { role: "Editor", name: "Vorname Nachname" },
      { role: "Re-recording Mixer", name: "Vorname Nachname" },
      { role: "Colourist", name: "Vorname Nachname" },
    ],
    placeholder: true,
  },
];

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

/** Naechstes Projekt in der Reihenfolge, nach dem letzten wieder das erste. */
export function getNextProject(slug: string): Project {
  const i = PROJECTS.findIndex((p) => p.slug === slug);
  return PROJECTS[(i + 1) % PROJECTS.length];
}

/** Mono-Zeile "auftraggeber · format · jahr"; fehlende Werte fallen weg. */
export function projectMeta(p: Project, locale: "de" | "en", withClient: boolean): string {
  return [withClient ? p.client : null, p.format[locale], p.year]
    .filter((v) => v !== null && v !== "")
    .join(" · ");
}
