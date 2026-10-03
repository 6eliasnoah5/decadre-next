// Einzige Datenquelle fuer die Work-Eintraege. Komponenten lesen nur von hier,
// Inhalte stehen nicht im JSX.
//
// Die vier Eintraege sind die bestehenden Platzhalter der Legacy-Site.
// Unbekannte Werte sind null bzw. leere Listen, nicht erfunden.

export type WorkStatus = "in-production" | "concept" | "placeholder";

export type WorkEntry = {
  slug: string;
  /** Zweistellig, steuert Reihenfolge, Grid-Position (slot--NN) und Label */
  index: string;
  title: string;
  client: string | null;
  year: number | null;
  role: string | null;
  credits: string[];
  disciplines: string[];
  /** Kurzbeschreibung im Hover-Overlay, z. B. "brand film" */
  category: string;
  poster: string;
  video: string;
  status: WorkStatus;
  /** Text auf der Kachel, solange kein Video da ist (nach "[ NN ]  ") */
  placeholder: string;
};

export const work: WorkEntry[] = [
  {
    slug: "project-01",
    index: "01",
    title: "[ platzhalter ]",
    client: null,
    year: null,
    role: null,
    credits: [],
    disciplines: [],
    category: "brand film",
    poster: "videos/work-01.jpg",
    video: "videos/work-01.mp4",
    status: "in-production",
    placeholder: "first case — in production",
  },
  {
    slug: "project-02",
    index: "02",
    title: "[ platzhalter ]",
    client: null,
    year: null,
    role: null,
    credits: [],
    disciplines: [],
    category: "campaign",
    poster: "videos/work-02.jpg",
    video: "videos/work-02.mp4",
    status: "concept",
    placeholder: "concept film — twentytwentysix",
  },
  {
    slug: "project-03",
    index: "03",
    title: "[ platzhalter ]",
    client: null,
    year: null,
    role: null,
    credits: [],
    disciplines: [],
    category: "identity",
    poster: "videos/work-03.jpg",
    video: "videos/work-03.mp4",
    status: "placeholder",
    placeholder: "―",
  },
  {
    slug: "project-04",
    index: "04",
    title: "[ platzhalter ]",
    client: null,
    year: null,
    role: null,
    credits: [],
    disciplines: [],
    category: "editorial motion",
    poster: "videos/work-04.jpg",
    video: "videos/work-04.mp4",
    status: "placeholder",
    placeholder: "―",
  },
];
