import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { CONTACT_EMAIL, INSTAGRAM_URL } from "@/lib/site";
import { HOME_PATHS, localeAlternates } from "@/lib/i18n-meta";
import { SiteHeaderBar, SiteFooter } from "@/components/site/SiteChrome";
import { getNotes, notePath, formatNoteDate } from "@/lib/content";

// Startseite. Alle Texte aus messages/<locale>.json, Sektions-IDs je Sprache.
// Reihenfolge: Hero, Marquee, [01] haltung (Feld rot), [02] arbeit,
// [03] formate (Feld blau), [04] hintergrund, [05] notizen, [06] kontakt.

type ListItem = { title: string; desc: string };

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  return { alternates: localeAlternates(locale, HOME_PATHS) };
}

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = (await params) as { locale: Locale };
  setRequestLocale(locale);
  const t = await getTranslations({ locale });
  const s = (key: string) => ({
    id: t(`sections.${key}.id`),
    num: t(`sections.${key}.num`),
    label: t(`sections.${key}.label`),
    hint: t(`sections.${key}.hint`),
  });
  const nums = t.raw("itemNums") as string[];
  // Neueste drei veroeffentlichte Notizen dieser Sprache
  const notes = (await getNotes(locale)).slice(0, 3);

  const sectionHead = (k: string) => (
    <div className="section-head">
      <span className="section-head__num">{s(k).num}</span>
      <span className="section-head__lbl">{s(k).label}</span>
      <span className="section-head__hint">{s(k).hint}</span>
    </div>
  );

  const list = (items: ListItem[]) => (
    <div className="svc__list" role="list">
      {items.map((item, i) => (
        <div className="svc" role="listitem" tabIndex={0} key={item.title} data-cursor="fill">
          <div className="svc__num">{nums[i]}</div>
          <div className="svc__title">{item.title}</div>
          <div className="svc__desc">{item.desc}</div>
        </div>
      ))}
    </div>
  );

  const paragraphs = (items: string[]) => (
    <>
      {items.map((p) => (
        <p key={p.slice(0, 40)}>{p}</p>
      ))}
    </>
  );

  return (
    <>
      <SiteHeaderBar locale={locale} paths={HOME_PATHS} onHome />

      <main id="top">

        {/* ============ HERO ============ */}
        <section className="hero" aria-label={t("hero.label")}>
          <div className="hero__overlay">
            <h1 className="hero__title">
              <span>Form</span>
              <span>Frame</span>
              <span>Friction</span>
            </h1>
            <div className="hero__bar">
              <div className="hero__caption">{t("hero.caption")}</div>
              <a className="hero__scroll" href={`#${s("haltung").id}`}>{t("hero.scroll")}</a>
            </div>
          </div>
        </section>

        {/* ============ MARQUEE — continuous auto-loop ============ */}
        <div className="marquee-pin" id="marquee-pin" aria-hidden="true">
          <div className="marquee">
            <div className="marquee__track" id="marquee-track">
              <span>{t("marquee")}</span>
              <span>{t("marquee")}</span>
            </div>
          </div>
        </div>

        {/* ============ [ 01 ] HALTUNG — Feld rot ============ */}
        <section className="section section--field section--red" id={s("haltung").id} aria-label={s("haltung").label}>
          <div className="container">
            {sectionHead("haltung")}
            <h2 className="section-title section-title--stack">
              {(t.raw("haltung.title") as string[]).map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h2>
            <div className="about__body">
              <div className="about__copy">
                {paragraphs(t.raw("haltung.body") as string[])}
              </div>
            </div>
          </div>
        </section>

        {/* ============ [ 02 ] ARBEIT ============ */}
        <section className="section section--tight-top section--tight-bottom" id={s("arbeit").id} aria-label={s("arbeit").label}>
          <div className="container">
            {sectionHead("arbeit")}
            <h2 className="section-title">{t("arbeit.title")}</h2>
            <p className="work__note">{t("arbeit.intro")}</p>
            {list(t.raw("arbeit.items") as ListItem[])}
          </div>
        </section>

        {/* ============ [ 03 ] FORMATE — Feld blau ============ */}
        <section className="section section--field section--blue" id={s("formate").id} aria-label={s("formate").label}>
          <div className="container">
            {sectionHead("formate")}
            <h2 className="section-title">{t("formate.title")}</h2>
            <p className="work__note">{t("formate.intro")}</p>
            {list(t.raw("formate.items") as ListItem[])}
          </div>
        </section>

        {/* ============ [ 04 ] HINTERGRUND ============ */}
        <section className="section section--tight-top section--tight-bottom" id={s("hintergrund").id} aria-label={s("hintergrund").label}>
          <div className="container">
            {sectionHead("hintergrund")}
            <h2 className="section-title">{t("hintergrund.title")}</h2>
            <div className="about__body">
              <div className="about__copy">
                {paragraphs(t.raw("hintergrund.body") as string[])}
              </div>
              <div className="about__slot">
                {/* Portrait 4:5, austauschbar */}
                {/* eslint-disable-next-line @next/next/no-img-element -- statisches Portrait, bewusst ohne next/image */}
                <img className="about__slot-media" src="/images/about-portrait.jpeg" alt={t("hintergrund.portraitAlt")} />
              </div>
            </div>
          </div>
        </section>

        {/* ============ [ 05 ] NOTIZEN ============ */}
        <section className="section section--tight-top section--tight-bottom" id={s("notizen").id} aria-label={s("notizen").label}>
          <div className="container">
            {sectionHead("notizen")}
            <h2 className="section-title">{t("notizen.title")}</h2>
            <p className="work__note">{t("notizen.intro")}</p>
            {notes.length ? (
              <div className="svc__list" role="list">
                {notes.map((note) => (
                  <div role="listitem" key={note.slug}>
                    <a className="svc svc--note" href={notePath(note)}>
                      <time className="svc__num" dateTime={note.date}>{formatNoteDate(note.date, locale)}</time>
                      <span className="svc__title">{note.title}</span>
                      <span className="svc__desc">{note.excerpt}</span>
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="work__note">{t("notizen.empty")}</p>
            )}
          </div>
        </section>

        {/* ============ [ 06 ] KONTAKT ============ */}
        <section className="section section--tight-top section--mb-120" id={s("kontakt").id} aria-label={s("kontakt").label}>
          <div className="container">
            {sectionHead("kontakt")}

            <h2 className="contact__big">
              <a href={`mailto:${CONTACT_EMAIL}`} data-cursor="write">{t("contact.big")}</a>
            </h2>

            <div className="contact__meta">
              <div className="col">
                <span className="lbl">{t("contact.email")}</span>
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              </div>
              <div className="col">
                <span className="lbl">{t("contact.available")}</span>
                <span>{t("contact.availableValue")}</span>
              </div>
              <div className="col">
                <span className="lbl">{t("contact.area")}</span>
                <span>{t("contact.areaValue")}</span>
              </div>
              <div className="col">
                <span className="lbl">{t("contact.social")}</span>
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">{t("contact.instagram")}</a>
              </div>
            </div>
          </div>
        </section>

      </main>

      <SiteFooter locale={locale} />
    </>
  );
}
