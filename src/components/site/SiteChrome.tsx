import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { HOME_PATHS, type LocalePaths } from "@/lib/i18n-meta";
import { INSTAGRAM_URL } from "@/lib/site";
import SiteHeader from "@/components/SiteHeader";
import ScrollSpy from "@/components/ScrollSpy";
import MobileMenu, { MenuButton } from "@/components/MobileMenu";
import LanguageSwitch from "@/components/LanguageSwitch";
import LocalClock from "@/components/LocalClock";

// Gemeinsamer Rahmen der Site-Seiten (Startseite, Notizen): Header mit
// Navigation und Sprachumschalter, mobiles Menue, Footer.
// Texte aus messages/<locale>.json, Sektions-IDs je Sprache.

type Section = { id: string; num: string; label: string; inHeader: boolean };

async function getSections(locale: Locale): Promise<Section[]> {
  const t = await getTranslations({ locale, namespace: "sections" });
  const keys = t.raw("order") as string[];
  return keys.map((key) => ({
    id: t(`${key}.id`),
    num: t(`${key}.num`),
    label: t(`${key}.label`),
    inHeader: t.raw(`${key}.inHeader`) === true,
  }));
}

export async function SiteHeaderBar({
  locale,
  paths,
  onHome,
}: {
  locale: Locale;
  /** Pfade dieser Seite je Sprache, fuer den Sprachumschalter */
  paths: LocalePaths;
  /** true auf der Startseite: Navigation als reine #anker */
  onHome: boolean;
}) {
  const t = await getTranslations({ locale, namespace: "nav" });
  const tl = await getTranslations({ locale, namespace: "lang" });
  const sections = await getSections(locale);
  const base = onHome ? "" : HOME_PATHS[locale];
  const langSwitch = (className: string) => (
    <LanguageSwitch locale={locale} paths={paths} fallback={HOME_PATHS} label={tl("label")} className={className} />
  );

  return (
    <>
      <SiteHeader>
        <a className="hdr__brand" href={onHome ? "#top" : HOME_PATHS[locale]} aria-label={t("home")}>{t("brand")}</a>
        <ScrollSpy
          label={t("primary")}
          base={base}
          links={sections.filter((s) => s.inHeader).map(({ id, label }) => ({ id, label }))}
        />
        {langSwitch("lang-switch")}
        <MenuButton label={t("menu")} />
      </SiteHeader>

      <MobileMenu
        base={base}
        items={sections.map(({ id, num, label }) => ({ id, num, label }))}
        langSwitch={langSwitch("lang-switch lang-switch--menu")}
        texts={{
          brand: t("brand"),
          close: t("close"),
          closeLabel: t("closeLabel"),
          dialogLabel: t("menuLabel"),
          navLabel: t("primaryMobile"),
          bottom: t("menuBottom"),
        }}
      />
    </>
  );
}

export async function SiteFooter({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "footer" });
  return (
    <footer>
      <div className="ftr">
        <div><b>{t("brand")}</b> {t("left")}</div>
        <div className="center"><LocalClock clockId="clock" /></div>
        <div className="right">
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">{t("instagram")}</a>
          {/* Rechtsseiten gibt es nur auf Deutsch */}
          <Link href="/impressum" hrefLang="de">{t("imprint")}</Link>
          <Link href="/datenschutz" hrefLang="de">{t("privacy")}</Link>
        </div>
      </div>
      <div className="ftr__base container">{t("base")}</div>
    </footer>
  );
}

