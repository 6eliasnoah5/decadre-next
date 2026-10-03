import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import LegalScripts from "@/components/LegalScripts";

export const metadata: Metadata = {
  title: "Datenschutz — Décadre Studio",
};

export default function Datenschutz() {
  return (
    <>
      {/* ============ HEADER ============ */}
      <SiteHeader>
        <a className="hdr__brand" href="index.html" aria-label="Décadre Studio — home">Décadre Studio</a>
        <a className="hdr__back" href="index.html">[ ← back ]</a>
      </SiteHeader>

      <main>

        {/* ============ [ ↳ ] DATENSCHUTZ ============ */}
        <section className="section">
          <div className="container">
            <div className="section-head">
              <span className="section-head__num">[ ↳ ]</span>
              <span className="section-head__lbl">datenschutz</span>
              <span className="section-head__hint">stand · twentytwentysix</span>
            </div>
            <h1 className="section-title">Datenschutz.</h1>

            <div className="legal">
              <div className="legal__copy">

                <h3>verantwortlicher</h3>
                <p>Verantwortlich für die Datenverarbeitung auf dieser Website ist:<br />
                   Elias Noah Nies<br />
                   Décadre Studio<br />
                   Im Schönblick 7<br />
                   74255 Roigheim<br />
                   Deutschland<br />
                   E-Mail: <a className="email-link" href="#" data-user="hello" data-domain="decadre.studio"></a><br />
                   Telefon: 0172 6916961</p>

                <h3>allgemeines</h3>
                <p>Der Schutz personenbezogener Daten ist mir ein wichtiges Anliegen. Diese Website ist eine reine Informationsseite. Es werden keine Cookies gesetzt, kein Tracking eingesetzt und keine Analyse-Tools verwendet. Personenbezogene Daten werden nur in dem technisch notwendigen Umfang verarbeitet, der für den Betrieb der Website erforderlich ist.</p>

                <h3>server-logfiles und hosting</h3>
                <p>Diese Website wird bei Vercel Inc. (340 S Lemon Ave #4133, Walnut, CA 91789, USA) gehostet. Beim Aufruf der Website verarbeitet der Hosting-Anbieter automatisch technische Informationen, die Ihr Browser übermittelt (insbesondere IP-Adresse, Datum und Uhrzeit des Zugriffs, aufgerufene Seite, verwendeter Browser und Betriebssystem). Diese Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO zur Gewährleistung eines sicheren und stabilen Betriebs der Website. Die Datenübermittlung in die USA ist durch entsprechende Garantien (Standardvertragsklauseln) abgesichert.</p>

                <h3>schriftarten</h3>
                <p>Die auf dieser Website verwendeten Schriftarten werden lokal vom Server dieser Website ausgeliefert. Es findet keine Verbindung zu Servern Dritter (etwa Google Fonts) statt. Beim Laden der Schriftarten werden keine personenbezogenen Daten an Dritte übertragen.</p>

                <h3>kontaktaufnahme per e-mail</h3>
                <p>Wenn Sie per E-Mail Kontakt aufnehmen, werden die von Ihnen übermittelten Daten (Ihre E-Mail-Adresse sowie der Inhalt der Nachricht) zum Zweck der Bearbeitung Ihrer Anfrage gespeichert und verarbeitet. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b und lit. f DSGVO. Diese Daten werden nicht ohne Ihre Einwilligung an Dritte weitergegeben und gelöscht, sobald sie für die Zweckerreichung nicht mehr erforderlich sind.</p>

                <h3>ihre rechte</h3>
                <p>Sie haben das Recht auf Auskunft über die zu Ihrer Person gespeicherten Daten (Art. 15 DSGVO), auf Berichtigung (Art. 16 DSGVO), auf Löschung (Art. 17 DSGVO), auf Einschränkung der Verarbeitung (Art. 18 DSGVO) sowie auf Datenübertragbarkeit (Art. 20 DSGVO). Sie können einer Verarbeitung, die auf Art. 6 Abs. 1 lit. f DSGVO beruht, jederzeit widersprechen (Art. 21 DSGVO). Zudem haben Sie das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren.</p>

                <h3>zuständige aufsichtsbehörde</h3>
                <p>Der Landesbeauftragte für den Datenschutz und die Informationsfreiheit Baden-Württemberg, Lautenschlagerstraße 20, 70173 Stuttgart.</p>

                <h3>stand</h3>
                <p>Diese Datenschutzerklärung wird bei Bedarf aktualisiert, insbesondere bei Änderungen der angebotenen Funktionen (z. B. Einführung eines Kontaktformulars oder von Analyse-Tools).</p>

              </div>

              <aside className="legal__meta">
                <div><b>verantwortlich</b> — elias noah nies</div>
                <div><b>cookies</b> — keine</div>
                <div><b>tracking</b> — keines</div>
                <div><b>fragen</b> — <a className="email-link" href="#" data-user="hello" data-domain="decadre.studio"></a></div>
              </aside>
            </div>
          </div>
        </section>

      </main>

      {/* ============ FOOTER ============ */}
      <footer>
        <div className="ftr">
          <div><b>Décadre Studio</b> — Stuttgart</div>
          <div className="center"><b>Stuttgart</b> <span id="clock" aria-live="off">--:--</span></div>
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

      {/* TEMPORAER — wird beim Fundament in einzelne Komponenten aufgeteilt. */}
      <LegalScripts />
    </>
  );
}
