import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getNote, getNotes, notePath, formatNoteDate } from "@/lib/content";
import { HOME_PATHS, localeAlternates } from "@/lib/i18n-meta";
import { SiteHeaderBar, SiteFooter } from "@/components/site/SiteChrome";

// Notiz-Detailseite: /notizen/<slug> (de) bzw. /en/notes/<slug> (en, per
// Proxy auf diesen Ordner umgeschrieben). Nur veroeffentlichte Notizen der
// jeweiligen Sprache werden gebaut, alles andere ist 404.
// Layout aus bestehenden Klassen: section, section-head, section-title,
// work__note (Datum), about__copy (Text).

export const dynamicParams = false;

export async function generateStaticParams({ params }: { params: { locale: string } }) {
  const notes = await getNotes(params.locale as Locale);
  return notes.map((n) => ({ slug: n.slug }));
}

type Props = PageProps<"/[locale]/notizen/[slug]">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = (await params) as { locale: Locale; slug: string };
  const note = await getNote(locale, slug);
  if (!note) return {};
  const path = notePath(note.meta);
  return {
    title: note.meta.title,
    description: note.meta.excerpt,
    // Notizen existieren nur in einer Sprache: keine Alternative melden.
    alternates: localeAlternates(locale, { [locale]: path }),
    openGraph: { type: "article", title: note.meta.title, description: note.meta.excerpt, url: path },
  };
}

export default async function NotePage({ params }: Props) {
  const { locale, slug } = (await params) as { locale: Locale; slug: string };
  setRequestLocale(locale);
  const note = await getNote(locale, slug);
  if (!note) notFound();
  const t = await getTranslations({ locale });
  const { meta, Content } = note;
  const section = t("sections.notizen.id");

  return (
    <>
      <SiteHeaderBar locale={locale} paths={{ [locale]: notePath(meta) }} onHome={false} />

      <main id="top">
        <article className="section section--note" aria-labelledby="note-title">
          <div className="container">
            <div className="section-head">
              <span className="section-head__num">{t("sections.notizen.num")}</span>
              <span className="section-head__lbl">{t("sections.notizen.label")}</span>
              <span className="section-head__hint"></span>
            </div>
            <h1 className="section-title" id="note-title">{meta.title}</h1>
            <p className="work__note">
              <time dateTime={meta.date}>{formatNoteDate(meta.date, locale)}</time>
            </p>
            <div className="about__body">
              <div className="about__copy">
                <Content />
              </div>
            </div>
            <p className="work__note">
              <a href={`${HOME_PATHS[locale]}#${section}`}>{t("notizen.back")}</a>
            </p>
          </div>
        </article>
      </main>

      <SiteFooter locale={locale} />
    </>
  );
}
