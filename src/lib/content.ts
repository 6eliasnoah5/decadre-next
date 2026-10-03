import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import type { ComponentType } from "react";
import * as runtime from "react/jsx-runtime";
import matter from "gray-matter";
import { evaluate } from "@mdx-js/mdx";
import { routing, type Locale } from "@/i18n/routing";

// Content-Layer: einzige Datenquelle fuer redaktionelle Inhalte, die nicht in
// den Sprachdateien (messages/*.json) stehen. Nur serverseitig verwenden.
//
// Notizen: MDX-Dateien in src/content/notes/<slug>.mdx mit Frontmatter
//   title, date (YYYY-MM-DD), excerpt, lang ("de" | "en"), draft (true/false)
// Eine Notiz existiert in genau einer Sprache und wird in der anderen nicht
// gelistet. draft: true erscheint weder in Listen noch in Routen/Sitemap.

const NOTES_DIR = path.join(process.cwd(), "src/content/notes");

export type NoteMeta = {
  slug: string;
  title: string;
  /** ISO-Datum YYYY-MM-DD */
  date: string;
  excerpt: string;
  lang: Locale;
  draft: boolean;
};

type NoteFile = { meta: NoteMeta; body: string };

function toIsoDate(value: unknown, file: string): string {
  // YAML macht aus unquotierten Daten Date-Objekte
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  throw new Error(`Notiz ${file}: "date" muss YYYY-MM-DD sein`);
}

function parseNote(file: string, source: string): NoteFile {
  const { data, content } = matter(source);
  const slug = file.replace(/\.mdx$/, "");
  for (const key of ["title", "excerpt", "lang"] as const) {
    if (typeof data[key] !== "string" || !data[key]) {
      throw new Error(`Notiz ${file}: Frontmatter "${key}" fehlt`);
    }
  }
  if (!(routing.locales as readonly string[]).includes(data.lang)) {
    throw new Error(`Notiz ${file}: "lang" muss ${routing.locales.join(" oder ")} sein`);
  }
  return {
    meta: {
      slug,
      title: data.title,
      date: toIsoDate(data.date, file),
      excerpt: data.excerpt,
      lang: data.lang as Locale,
      draft: data.draft === true,
    },
    body: content,
  };
}

async function readAllNotes(): Promise<NoteFile[]> {
  let files: string[];
  try {
    files = (await readdir(NOTES_DIR)).filter((f) => f.endsWith(".mdx"));
  } catch {
    return [];
  }
  return Promise.all(
    files.map(async (f) => parseNote(f, await readFile(path.join(NOTES_DIR, f), "utf8"))),
  );
}

/** Veroeffentlichte Notizen einer Sprache, neueste zuerst. */
export async function getNotes(locale: Locale): Promise<NoteMeta[]> {
  return (await readAllNotes())
    .filter((n) => n.meta.lang === locale && !n.meta.draft)
    .map((n) => n.meta)
    .sort((a, b) => b.date.localeCompare(a.date));
}

/** Alle veroeffentlichten Notizen beider Sprachen (Sitemap). */
export async function getAllPublishedNotes(): Promise<NoteMeta[]> {
  return (await readAllNotes()).filter((n) => !n.meta.draft).map((n) => n.meta);
}

/** Eine veroeffentlichte Notiz mit kompiliertem MDX, sonst null. */
export async function getNote(
  locale: Locale,
  slug: string,
): Promise<{ meta: NoteMeta; Content: ComponentType } | null> {
  const note = (await readAllNotes()).find(
    (n) => n.meta.slug === slug && n.meta.lang === locale && !n.meta.draft,
  );
  if (!note) return null;
  // Zur Buildzeit auf dem Server kompiliert (statische Seiten).
  const { default: Content } = await evaluate(note.body, { ...runtime });
  return { meta: note.meta, Content: Content as ComponentType };
}

/** Pfad einer Notiz in ihrer Sprache. */
export function notePath(meta: Pick<NoteMeta, "slug" | "lang">): string {
  return meta.lang === "de" ? `/notizen/${meta.slug}` : `/en/notes/${meta.slug}`;
}

/** Datum einer Notiz, Mono-Schreibweise je Sprache. */
export function formatNoteDate(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "de" ? "de-DE" : "en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));
}
