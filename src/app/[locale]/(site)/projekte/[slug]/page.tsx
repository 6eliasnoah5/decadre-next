import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, OG_LOCALE, type Locale } from "@/i18n/routing";
import { HOME_PATHS, localeAlternates, projectPaths } from "@/lib/i18n-meta";
import { getNextProject, getProject, PROJECTS, projectMeta } from "@/lib/content";
import { OG_IMAGE, SITE_NAME } from "@/lib/site";
import { SiteHeaderBar, SiteFooter } from "@/components/site/SiteChrome";
import VideoEmbed from "@/components/VideoEmbed";
import BackLink from "@/components/BackLink";
import TextReveal from "@/components/motion/TextReveal";

// Projektseite, statisch aus src/lib/content.ts erzeugt.
// Deutsch: /projekte/[slug], Englisch: /en/projects/[slug].
// Vollstaendig serverseitig gerendert, also auch ohne JS lesbar.

export const dynamicParams = false;

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

type Params = { locale: Locale; slug: string };

export async function generateMetadata({ params }: PageProps<"/[locale]/projekte/[slug]">): Promise<Metadata> {
  const { locale, slug } = (await params) as Params;
  const project = getProject(slug);
  if (!project) return {};
  const paths = projectPaths(slug);
  const title = project.title[locale];
  const description = project.synopsis[locale];
  const images = project.poster ? [{ url: project.poster, alt: title }] : OG_IMAGE;
  return {
    title,
    description,
    alternates: localeAlternates(locale, paths),
    openGraph: {
      type: "article",
      siteName: SITE_NAME,
      title: `${title} — ${SITE_NAME}`,
      description,
      url: paths[locale],
      locale: OG_LOCALE[locale],
      alternateLocale: routing.locales.filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
      images,
    },
    twitter: { card: "summary_large_image", title: `${title} — ${SITE_NAME}`, description, images },
    // Platzhalter nicht indexieren
    robots: project.placeholder ? { index: false, follow: true } : { index: true, follow: true },
  };
}

export default async function ProjectPage({ params }: PageProps<"/[locale]/projekte/[slug]">) {
  const { locale, slug } = (await params) as Params;
  const project = getProject(slug);
  if (!project) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale });
  const next = getNextProject(slug);
  const sectionId = t("sections.projekte.id");
  const videoHost = project.videoUrl ? new URL(project.videoUrl).hostname : "";

  return (
    <>
      <SiteHeaderBar locale={locale} paths={projectPaths(slug)} onHome={false} />

      <main id="top" className="project">
        <div className="container">
          <BackLink
            className="project__back"
            href={`${HOME_PATHS[locale]}#${sectionId}`}
            flipId={`project-${project.slug}`}
          >
            {t("project.back")}
          </BackLink>

          <h1 className="section-title project__title" data-split="">{project.title[locale]}</h1>
          <p className="project__meta">{projectMeta(project, locale, true)}</p>

          <div className="project__video" data-flip-id={`project-${project.slug}`}>
            {project.videoUrl ? (
              <VideoEmbed
                url={project.videoUrl}
                title={project.title[locale]}
                loadLabel={t("project.videoLoad")}
                note={t("project.videoNote", { host: videoHost })}
              />
            ) : (
              <span className="tile__ph" aria-hidden="true">{t("project.videoFollows")}</span>
            )}
          </div>

          <div className="project__body">
            <div className="about__copy">
              <p data-split="">{project.synopsis[locale]}</p>
            </div>

            <p className="project__role">
              <span className="project__label">{t("project.roleLabel")}</span>
              <span>{project.role[locale]}</span>
            </p>

            <section className="project__credits" aria-labelledby="credits-title">
              <h2 className="project__label" id="credits-title">{t("project.credits")}</h2>
              <dl className="credits">
                {project.credits.map((c, i) => (
                  <div className="credits__row" key={`${c.role}-${i}`}>
                    <dt>{c.role}</dt>
                    <dd>{c.name}</dd>
                  </div>
                ))}
              </dl>
            </section>
          </div>

          <nav className="project__next" aria-label={t("project.next")}>
            <span className="project__label">{t("project.next")}</span>
            <Link href={projectPaths(next.slug)[locale]} className="project__next-link">
              {next.title[locale]}
            </Link>
          </nav>
        </div>
      </main>

      <TextReveal />
      <SiteFooter locale={locale} />
    </>
  );
}
