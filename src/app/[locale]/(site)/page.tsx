import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { CONTACT_EMAIL, INSTAGRAM_URL } from "@/lib/site";
import { HOME_PATHS, localeAlternates, projectPaths } from "@/lib/i18n-meta";
import { PROJECTS, projectMeta } from "@/lib/content";
import Gallery from "@/components/Gallery";
import MagneticLink from "@/components/motion/MagneticLink";
import HeroReveal from "@/components/motion/HeroReveal";
import TextReveal from "@/components/motion/TextReveal";
import StickyNumbers from "@/components/motion/StickyNumbers";
import { SiteHeaderBar, SiteFooter } from "@/components/site/SiteChrome";

// Startseite. Alle Texte aus messages/<locale>.json, Sektions-IDs je Sprache.
// Reihenfolge: Hero, [ 01 ] décadre (Text, Stichwortzeile, Portrait),
// [ 02 ] projekte (Galerie), [ 03 ] kontakt.

type ContactMeta = { label: string; value: string; link?: "email" | "instagram" };

function metaValue({ value, link }: ContactMeta) {
  if (!value) return null;
  if (link === "email") return <a href={`mailto:${CONTACT_EMAIL}`}>{value}</a>;
  if (link === "instagram") {
    return <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">{value}</a>;
  }
  return value;
}

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

  // Abschnittskopf: Nummer, Ueberschrift und hint auf einer Grundlinie
  // (Raster auto / 1fr / auto, align-items: baseline). Die Ueberschrift
  // ersetzt das fruehere Label.
  const sectionHead = (k: string, title: ReactNode) => (
    <div className="section-head">
      <span className="section-head__num">{s(k).num}</span>
      {title}
      <span className="section-head__hint">{s(k).hint}</span>
    </div>
  );

  // Klebende Abschnittsnummer, direktes Kind der <section> (siehe
  // StickyNumbers); ohne JS / bei reduced motion ausgeblendet.
  const sectionPin = (k: string) => (
    <div className="section-pin" aria-hidden="true">
      <div className="container">
        <span className="section-pin__num">{s(k).num}</span>
      </div>
    </div>
  );

  const paragraphs = (items: string[]) =>
    items.map((p) => <p key={p.slice(0, 40)} data-split="">{p}</p>);

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

        {/* ============ [ 01 ] DÉCADRE — wer, warum, was; Text und Portrait ============ */}
        <section className="section section--close-bottom" id={s("decadre").id} aria-label={s("decadre").label}>
          {sectionPin("decadre")}
          <div className="container">
            {sectionHead(
              "decadre",
              <h2 className="section-title section-title--stack">
                {(t.raw("decadre.title") as string[]).map((line) => (
                  <span key={line} data-split="">{line}</span>
                ))}
              </h2>,
            )}
            <div className="about__body">
              <div className="about__copy">
                {paragraphs(t.raw("decadre.body") as string[])}
                <p className="work__note">{t("decadre.keywords")}</p>
              </div>
              <div className="about__slot">
                {/* Portrait 4:5, austauschbar; auf Mobil vor dem Text (CSS order) */}
                {/* eslint-disable-next-line @next/next/no-img-element -- statisches Portrait, bewusst ohne next/image */}
                <img className="about__slot-media" src="/images/about-portrait.jpeg" alt={t("decadre.portraitAlt")} />
              </div>
            </div>
          </div>
        </section>

        {/* ============ [ 02 ] PROJEKTE — Galerie ============ */}
        <section className="section section--close-top section--close-bottom" id={s("projekte").id} aria-label={s("projekte").label}>
          {sectionPin("projekte")}
          {/* Galerie bringt eigene Container mit, die Spur laeuft ueber die volle Breite */}
          <Gallery
            items={PROJECTS.map((p) => ({
              slug: p.slug,
              href: projectPaths(p.slug)[locale],
              title: p.title[locale],
              meta: projectMeta(p, locale, false),
              poster: p.poster,
            }))}
            texts={{
              num: s("projekte").num,
              hint: s("projekte").hint,
              title: t("projekte.title"),
              intro: t("projekte.intro"),
              prev: t("projekte.prev"),
              next: t("projekte.next"),
              prevLabel: t("projekte.prevLabel"),
              nextLabel: t("projekte.nextLabel"),
              regionLabel: t("projekte.regionLabel"),
              imageFollows: t("projekte.imageFollows"),
            }}
          />
        </section>

        {/* ============ [ 03 ] KONTAKT ============ */}
        <section className="section section--close-top" id={s("kontakt").id} aria-label={s("kontakt").label}>
          {sectionPin("kontakt")}
          <div className="container">
            {sectionHead("kontakt", <h2 className="section-title" data-split="">{t("contact.title")}</h2>)}

            <p className="contact__big">
              <MagneticLink href={`mailto:${CONTACT_EMAIL}`} split>{t("contact.big")}</MagneticLink>
            </p>

            {/* Eintraege im Raster (mobil zwei Spalten). Ein leerer
                Wert laesst die Zelle stehen, damit das Raster nicht umbricht. */}
            <dl className="contact__meta">
              {(t.raw("contact.meta") as ContactMeta[]).map((item, i) => (
                <div className="col" key={i}>
                  <dt className="lbl">{item.label}</dt>
                  <dd>{metaValue(item)}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

      </main>

      <HeroReveal />
      <TextReveal />
      <StickyNumbers />
      <SiteFooter locale={locale} />
    </>
  );
}
