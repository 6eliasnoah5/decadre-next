import LegacyScripts from "@/components/LegacyScripts";

export default function Home() {
  return (
    <>
      {/* ============ HEADER ============ */}
      <header className="hdr" id="header">
        <a className="hdr__brand" href="#top" aria-label="Décadre Studio — home">Décadre Studio</a>
        <nav className="hdr__nav" aria-label="primary">
          <a className="hdr__link" href="#work"     data-section="work">[ work ]</a>
          <a className="hdr__link" href="#services" data-section="services">[ services ]</a>
          <a className="hdr__link" href="#about"    data-section="about">[ about ]</a>
          <a className="hdr__link" href="#contact"  data-section="contact">[ contact ]</a>
        </nav>
        <button className="hdr__menu" type="button" aria-controls="menu" aria-expanded="false" id="menu-open">[ menu ]</button>
      </header>

      {/* ============ MOBILE MENU OVERLAY ============ */}
      <div className="menu" id="menu" role="dialog" aria-modal="true" aria-label="primary navigation" data-open="false">
        <div className="menu__top">
          <span className="menu__brand">Décadre Studio</span>
          <button className="menu__close" type="button" id="menu-close" aria-label="close menu">[ close ]</button>
        </div>
        <nav className="menu__items" aria-label="primary mobile">
          <a className="menu__item" href="#work"     data-menu-link=""><span className="num">[ 01 ]</span>work</a>
          <a className="menu__item" href="#services" data-menu-link=""><span className="num">[ 02 ]</span>services</a>
          <a className="menu__item" href="#about"    data-menu-link=""><span className="num">[ 03 ]</span>about</a>
          <a className="menu__item" href="#contact"  data-menu-link=""><span className="num">[ 04 ]</span>contact</a>
        </nav>
        <div className="menu__bottom">
          <div><b id="clock-city-menu">Stuttgart</b> · <span id="clock-menu" aria-live="off">--:--</span></div>
          <div className="right">currently booking — autumn twentytwentysix</div>
        </div>
      </div>

      {/* custom cursor (desktop only) */}
      <div className="cursor" id="cursor" aria-hidden="true">[ play ]</div>

      <main id="top">

        {/* ============ HERO ============ */}
        <section className="hero" aria-label="intro">

          {/* HERO VIDEO: src="videos/hero.mp4", poster="videos/hero.jpg" */}
          {/* HERO VIDEO AKTIVIEREN: dieses video display:none entfernen (hero__media--hidden weg), src + poster setzen */}
          <video className="hero__media hero__media--hidden" autoPlay muted loop playsInline
                 poster="videos/hero.jpg"
                 aria-label="[ platzhalter ]">
            <source src="videos/hero.mp4" type="video/mp4" />
          </video>

          <div className="hero__overlay">
            {/* TEXT HIER: hero headline, three lines */}
            <h1 className="hero__title">
              <span>Form</span>
              <span>Frame</span>
              <span>Friction</span>
            </h1>
            <div className="hero__bar">
              <div className="hero__caption">[ décadre studio — stuttgart — twentytwentysix ]</div>
              <a className="hero__scroll" href="#work">[ scroll ↓ ]</a>
            </div>
          </div>
        </section>

        {/* ============ MARQUEE — continuous auto-loop ============ */}
        <div className="marquee-pin" id="marquee-pin" aria-hidden="true">
          <div className="marquee">
            <div className="marquee__track" id="marquee-track">
              <span>creative consultancy — video production — branding — brand strategy — campaign development — direction —</span>
              <span>creative consultancy — video production — branding — brand strategy — campaign development — direction —</span>
            </div>
          </div>
        </div>

        {/* ============ [ 01 ] WORK ============ */}
        <section className="section section--first section--tight-bottom" id="work" aria-label="work">
          <div className="container">
            <div className="section-head">
              <span className="section-head__num">[ 01 ]</span>
              <span className="section-head__lbl">work</span>
              <span className="section-head__hint"></span>
            </div>
            {/* TEXT HIER: work section headline */}
            <h2 className="section-title" style={{ whiteSpace: "nowrap" }}>Selected Work.</h2>
            <p className="work__note">selected concept work available on request.</p>

            <div className="work__grid">

              {/* VIDEO HIER: src="videos/work-01.mp4", poster="videos/work-01.jpg" */}
              <a className="slot slot--01" href="#" aria-label="project 01">
                <video className="slot__media" muted loop playsInline preload="metadata"
                       poster="videos/work-01.jpg"
                       data-hover-play=""
                       aria-label="[ platzhalter ]">
                  <source src="videos/work-01.mp4" type="video/mp4" />
                </video>
                <div className="slot__placeholder" aria-hidden="true">[ 01 ]  first case — in production</div>
                <div className="slot__overlay">
                  <span className="slot__title">[ platzhalter ]</span>
                  <span className="slot__meta">brand film</span>
                </div>
              </a>

              {/* VIDEO HIER: src="videos/work-02.mp4", poster="videos/work-02.jpg" */}
              <a className="slot slot--02" href="#" aria-label="project 02">
                <video className="slot__media" muted loop playsInline preload="metadata"
                       poster="videos/work-02.jpg"
                       data-hover-play=""
                       aria-label="[ platzhalter ]">
                  <source src="videos/work-02.mp4" type="video/mp4" />
                </video>
                <div className="slot__placeholder" aria-hidden="true">[ 02 ]  concept film — twentytwentysix</div>
                <div className="slot__overlay">
                  <span className="slot__title">[ platzhalter ]</span>
                  <span className="slot__meta">campaign</span>
                </div>
              </a>

              {/* VIDEO HIER: src="videos/work-03.mp4", poster="videos/work-03.jpg" */}
              <a className="slot slot--03" href="#" aria-label="project 03">
                <video className="slot__media" muted loop playsInline preload="metadata"
                       poster="videos/work-03.jpg"
                       data-hover-play=""
                       aria-label="[ platzhalter ]">
                  <source src="videos/work-03.mp4" type="video/mp4" />
                </video>
                <div className="slot__placeholder" aria-hidden="true">[ 03 ]  ―</div>
                <div className="slot__overlay">
                  <span className="slot__title">[ platzhalter ]</span>
                  <span className="slot__meta">identity</span>
                </div>
              </a>

              {/* VIDEO HIER: src="videos/work-04.mp4", poster="videos/work-04.jpg" */}
              <a className="slot slot--04" href="#" aria-label="project 04">
                <video className="slot__media" muted loop playsInline preload="metadata"
                       poster="videos/work-04.jpg"
                       data-hover-play=""
                       aria-label="[ platzhalter ]">
                  <source src="videos/work-04.mp4" type="video/mp4" />
                </video>
                <div className="slot__placeholder" aria-hidden="true">[ 04 ]  ―</div>
                <div className="slot__overlay">
                  <span className="slot__title">[ platzhalter ]</span>
                  <span className="slot__meta">editorial motion</span>
                </div>
              </a>

            </div>
          </div>
        </section>

        {/* ============ [ 02 ] SERVICES ============ */}
        <section className="section section--tight-top section--tight-bottom" id="services" aria-label="services">
          <div className="container">
            <div className="section-head">
              <span className="section-head__num">[ 02 ]</span>
              <span className="section-head__lbl">services</span>
              <span className="section-head__hint">three practice areas</span>
            </div>

            <div className="svc__list" role="list">
              <div className="svc" role="listitem" tabIndex={0}>
                <div className="svc__num">[ one ]</div>
                <div className="svc__title">creative consultancy</div>
                {/* TEXT HIER: one-line description for consultancy */}
                <div className="svc__desc">Strategic guidance across the full creative spectrum — positioning, naming, brand strategy, communication, and the operational questions behind them. A particular focus on AI-driven content workflows and on enabling founders and smaller teams to build systems they can run themselves, without becoming dependent on an external studio. Always paired with a critical view of where the tools end and authorship has to begin.</div>
              </div>

              <div className="svc" role="listitem" tabIndex={0}>
                <div className="svc__num">[ two ]</div>
                <div className="svc__title">video production</div>
                {/* TEXT HIER: one-line description for video */}
                <div className="svc__desc">Cinematic campaign films, image essays, documentary fragments, and editorial-grade digital content. We work end-to-end: concept, direction, shoot, edit, colour, sound. Built for brands and founders that need more than a stack of cuts — work that holds up beyond the first scroll and carries weight on the second view.</div>
              </div>

              <div className="svc" role="listitem" tabIndex={0}>
                <div className="svc__num">[ three ]</div>
                <div className="svc__title">branding</div>
                {/* TEXT HIER: one-line description for branding */}
                <div className="svc__desc">Full visual identity systems: typography, mark, motion language, guidelines, and the rules for breaking them. Built to translate cleanly between physical space, print, and screen, and to outlast campaign cycles rather than chase them. Identity as a frame, not as decoration.</div>
              </div>

              <div className="svc svc--muted" role="listitem" aria-disabled="true">
                <div className="svc__num">[ four ]</div>
                <div className="svc__title">events</div>
                <div className="svc__desc">— twentytwentyseven</div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ [ 03 ] ABOUT ============ */}
        <section className="section section--tight-top section--tight-bottom" id="about" aria-label="about">
          <div className="container">
            <div className="section-head">
              <span className="section-head__num">[ 03 ]</span>
              <span className="section-head__lbl">about</span>
              <span className="section-head__hint">stuttgart, since twentytwentysix</span>
            </div>
            {/* TEXT HIER: about section headline */}
            <h2 className="section-title section-title--stack">
              <span>A studio</span>
              <span>between</span>
              <span>disciplines.</span>
            </h2>

            <div className="about__body">
              <div className="about__copy">
                {/* TEXT HIER: about paragraphs */}
                <p>Décadre is a multidisciplinary creative studio based in Stuttgart, working at the intersection of brand consulting, video production, and visual identity.</p>
                <p>The studio was founded by Elias Noah Nies. Trained as an industrial engineer, he led AI and software projects in the retail-tech sector and previously built his own startup in EdTech. This background — structural thinking on one side, raw visual instinct on the other — shapes every project: strategy that does not flatten aesthetics, aesthetics that do not hide from substance.</p>
                <p>Brand consulting, video production, and visual identity are the three practices we deliver today. Each project begins with the same conviction: a brand is more than its surface, and its visual language should know what lies beneath. We treat strategy, image, and motion as one continuous narrative — not a stack of separate deliverables — and build visual systems meant to outlast a campaign cycle.</p>
                <p>The studio operates on a few non-negotiables. Inclusion is unconditional, and the politics that follow from it are not decoration. Honest supply chains, honest margins, an open record of our own mistakes. Climate, culture, and political responsibility are not subjects we comment on from the outside — they shape which projects we take, how we build them, and what we refuse to make.</p>
                <p>We work across the full spectrum. Hospitality in transition. Emerging fashion labels and full-creative studios. Founders in tech and innovation who treat their visual language as part of the product, not its packaging. Artists, musicians, and cultural operators building something that does not fit an existing frame. A growing share of the work sits around AI-assisted content and enabling smaller teams to operate creatively on their own — and around sport and movement culture as a whole, from football and team sports to endurance and extreme disciplines, treated as a cultural field rather than lifestyle content.</p>
                <p>Beyond commissioned work, the studio holds space for its original purpose: making visible what unsettles us. The questions beneath the surface of a culture in transition — loneliness, the slow disappearance of non-commercial public space, the return to analog tools as a quiet act of resistance, the aestheticisation of suffering, the limits of authentic journalism in an age of generated content. Some of it becomes a project. Some of it stays a record.</p>
                <div className="about-outro">
                  <p>[ on the horizon ] live formats and large-scale visual environments for festivals and concerts — led stage design, content direction, and integrated show concepts conceived as a single body of work rather than a stack of separate deliverables. the studio is positioning itself to move from screen to space, treating the venue itself as a frame.</p>
                  <p>[ open ] open to projects that do not yet have a category.</p>
                </div>
              </div>
              <div className="about__slot">
                {/* ABOUT-BILD: /images/about-portrait.jpeg — 4:5, austauschbar */}
                <img className="about__slot-media" src="/images/about-portrait.jpeg"
                     alt="Elias Noah Nies — Décadre Studio" />
              </div>
            </div>
          </div>
        </section>

        {/* ============ [ 04 ] CONTACT ============ */}
        <section className="section section--tight-top section--mb-120" id="contact" aria-label="contact">
          <div className="container">
            <div className="section-head">
              <span className="section-head__num">[ 04 ]</span>
              <span className="section-head__lbl">contact</span>
              <span className="section-head__hint"></span>
            </div>

            <h2 className="contact__big">
              <a href="#" className="email-link" data-user="hello" data-domain="decadre.studio" data-keep-label="">[ → write us ]</a>
            </h2>

            <div className="contact__meta">
              <div className="col">
                <span className="lbl">email</span>
                <a href="#" className="email-link" data-user="hello" data-domain="decadre.studio">hello [at] decadre.studio</a>
              </div>
              <div className="col">
                <span className="lbl">studio</span>
                <span>stuttgart, germany</span>
              </div>
              <div className="col">
                <span className="lbl">next intake</span>
                <span>autumn twentytwentysix</span>
              </div>
              <div className="col">
                <span className="lbl">social</span>
                <a href="https://www.instagram.com/decadrestudio/" target="_blank" rel="noopener noreferrer">[ ↗ instagram ]</a>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* ============ FOOTER ============ */}
      <footer>
        <div className="ftr">
          <div><b>Décadre Studio</b> — Stuttgart</div>
          <div className="center"><b id="clock-city">Stuttgart</b> <span id="clock" aria-live="off">--:--</span></div>
          <div className="right">
            <a href="https://www.instagram.com/decadrestudio/" target="_blank" rel="noopener noreferrer">[ instagram ]</a>
            <a href="/impressum">[ impressum ]</a>
            <a href="/datenschutz">[ datenschutz ]</a>
          </div>
        </div>
        <div className="ftr__base container">
          © twentytwentysix · décadre studio. all rights reserved.
        </div>
      </footer>

      {/* TEMPORAER — wird beim Fundament in einzelne Komponenten aufgeteilt. */}
      <LegacyScripts />
    </>
  );
}
