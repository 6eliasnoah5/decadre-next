import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import { CONTACT_EMAIL } from "@/lib/site";
import LocalClock from "@/components/LocalClock";

export const metadata: Metadata = {
  title: "Impressum",
  alternates: { canonical: "/impressum" },
};

export default function Impressum() {
  return (
    <>
      {/* ============ HEADER ============ */}
      <SiteHeader>
        <a className="hdr__brand" href="index.html" aria-label="Décadre Studio — home">Décadre Studio</a>
        <a className="hdr__back" href="index.html">[ ← back ]</a>
      </SiteHeader>

      <main>

        {/* ============ [ ↳ ] IMPRESSUM ============ */}
        <section className="section">
          <div className="container">
            <div className="section-head">
              <span className="section-head__num">[ ↳ ]</span>
              <span className="section-head__lbl">impressum</span>
              <span className="section-head__hint">stand · twentytwentysix</span>
            </div>
            <h1 className="section-title">Impressum.</h1>

            <div className="legal">
              <div className="legal__copy">

                <h3>angaben gemäß § 5 ddg</h3>
                <p>Elias Noah Nies<br />
                   Décadre Studio<br />
                   Im Schönblick 7<br />
                   74255 Roigheim<br />
                   Deutschland</p>

                <h3>kontakt</h3>
                <p>Telefon: 0172 6916961<br />
                   E-Mail: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></p>

                <h3>verantwortlich für den inhalt nach § 18 abs. 2 mstv</h3>
                <p>Elias Noah Nies<br />
                   Im Schönblick 7<br />
                   74255 Roigheim</p>

                <h3>haftung für inhalte</h3>
                <p>Die Inhalte dieser Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte kann jedoch keine Gewähr übernommen werden. Als Diensteanbieter bin ich gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich.</p>

                <h3>haftung für links</h3>
                <p>Diese Website enthält gegebenenfalls Links zu externen Websites Dritter, auf deren Inhalte ich keinen Einfluss habe. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.</p>

                <h3>urheberrecht</h3>
                <p>Die durch den Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.</p>

              </div>

              <aside className="legal__meta">
                <div><b>quelle</b> — eigene angaben</div>
                <div><b>stand</b> — twentytwentysix</div>
                <div><b>fragen</b> — <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></div>
              </aside>
            </div>
          </div>
        </section>

      </main>

      {/* ============ FOOTER ============ */}
      <footer>
        <div className="ftr">
          <div><b>Décadre Studio</b> — Stuttgart</div>
          <div className="center"><LocalClock clockId="clock" separator=" " /></div>
          <div className="right">
            <a href="https://www.instagram.com/decadrestudio/" target="_blank" rel="noopener noreferrer">[ instagram ]</a>
            <a href="impressum.html">[ impressum ]</a>
            <a href="datenschutz.html">[ datenschutz ]</a>
          </div>
        </div>
        <div className="ftr__base container">
          © twentytwentysix · décadre studio. all rights reserved.
        </div>
      </footer>

    </>
  );
}
