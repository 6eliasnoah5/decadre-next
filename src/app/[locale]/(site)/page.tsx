import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { CONTACT_EMAIL, INSTAGRAM_URL } from "@/lib/site";
import { HOME_PATHS, localeAlternates } from "@/lib/i18n-meta";
import { SiteHeaderBar, SiteFooter } from "@/components/site/SiteChrome";

// Startseite. Alle Texte aus messages/<locale>.json, Sektions-IDs je Sprache.
// Reihenfolge: Hero, [ 01 ] décadre (Text + Portrait), [ 02 ] arbeit
// (Fliesstext + Stichwortzeile), [ 03 ] projekte (Galerie), [ 04 ] kontakt.

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

  const sectionHead = (k: string) => (
    <div className="section-head">
      <span className="section-head__num">{s(k).num}</span>
      <span className="section-head__lbl">{s(k).label}</span>
      <span className="section-head__hint">{s(k).hint}</span>
    </div>
  );

  const paragraphs = (items: string[]) =>
    items.map((p) => <p key={p.slice(0, 40)}>{p}</p>);

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
              <a className="hero__scroll" href={`#${s("decadre").id}`}>{t("hero.scroll")}</a>
            </div>
          </div>
        </section>

        {/* ============ [ 01 ] DÉCADRE — Text und Portrait ============ */}
        <section className="section section--close-bottom" id={s("decadre").id} aria-label={s("decadre").label}>
          <div className="container">
            {sectionHead("decadre")}
            <h2 className="section-title section-title--stack">
              {(t.raw("decadre.title") as string[]).map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h2>
            <div className="about__body">
              <div className="about__copy">
                {paragraphs(t.raw("decadre.body") as string[])}
              </div>
              <div className="about__slot">
                {/* Portrait 4:5, austauschbar; auf Mobil vor dem Text (CSS order) */}
                {/* eslint-disable-next-line @next/next/no-img-element -- statisches Portrait, bewusst ohne next/image */}
                <img className="about__slot-media" src="/images/about-portrait.jpeg" alt={t("decadre.portraitAlt")} />
              </div>
            </div>
          </div>
        </section>

        {/* ============ [ 02 ] ARBEIT — Fliesstext ============ */}
        <section className="section section--close-top" id={s("arbeit").id} aria-label={s("arbeit").label}>
          <div className="container">
            {sectionHead("arbeit")}
            <h2 className="section-title">{t("arbeit.title")}</h2>
            <div className="about__body">
              <div className="about__copy">
                {paragraphs(t.raw("arbeit.body") as string[])}
                <p className="work__note">{t("arbeit.keywords")}</p>
              </div>
            </div>
          </div>
        </section>

        {/* ============ [ 03 ] PROJEKTE — Galerie ============ */}
        <section className="section" id={s("projekte").id} aria-label={s("projekte").label}>
          <div className="container">
            {sectionHead("projekte")}
            <h2 className="section-title">{t("projekte.title")}</h2>
            <p className="work__note">{t("projekte.intro")}</p>
          </div>
        </section>

        {/* ============ [ 04 ] KONTAKT ============ */}
        <section className="section" id={s("kontakt").id} aria-label={s("kontakt").label}>
          <div className="container">
            {sectionHead("kontakt")}

            <h2 className="contact__big">
              <a href={`mailto:${CONTACT_EMAIL}`}>{t("contact.big")}</a>
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
