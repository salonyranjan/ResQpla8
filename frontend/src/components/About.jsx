import { useEffect, useRef, useState } from "react";

/* ─── Google Fonts + global tokens ─── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Outfit:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --c-earth:     #1a1208;
    --c-moss:      #2d5016;
    --c-leaf:      #4a7c2f;
    --c-sage:      #7db05a;
    --c-mist:      #d4e8c2;
    --c-cream:     #f7f3ec;
    --c-warm:      #ede8df;
    --c-amber:     #c8792a;
    --c-text:      #2a1f0e;
    --c-sub:       #5a4e3a;
    --c-muted:     #8a7d6a;
    --font-display:'Lora', Georgia, serif;
    --font-body:   'Outfit', system-ui, sans-serif;
    --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
    --ease-out:    cubic-bezier(0.22, 1, 0.36, 1);
  }

  body { background: var(--c-cream); }

  .about-page {
    font-family: var(--font-body);
    color: var(--c-text);
    overflow-x: hidden;
  }

  /* ── Scroll reveal ── */
  .reveal {
    opacity: 0;
    transform: translateY(36px);
    transition: opacity 0.75s var(--ease-out), transform 0.75s var(--ease-out);
  }
  .reveal.visible {
    opacity: 1;
    transform: translateY(0);
  }
  .reveal-delay-1 { transition-delay: 0.1s; }
  .reveal-delay-2 { transition-delay: 0.22s; }
  .reveal-delay-3 { transition-delay: 0.34s; }
  .reveal-delay-4 { transition-delay: 0.46s; }

  /* ═══════════════════════════════
     HERO
  ═══════════════════════════════ */
  .hero {
    position: relative;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 80px 24px;
    background: var(--c-earth);
    overflow: hidden;
  }

  /* Organic blob background */
  .hero-blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    pointer-events: none;
  }
  .hero-blob-1 {
    width: 600px; height: 600px;
    background: radial-gradient(circle, #2d5016cc 0%, transparent 70%);
    top: -180px; left: -160px;
    animation: drift 14s ease-in-out infinite alternate;
  }
  .hero-blob-2 {
    width: 500px; height: 500px;
    background: radial-gradient(circle, #4a7c2f88 0%, transparent 70%);
    bottom: -100px; right: -120px;
    animation: drift 18s ease-in-out infinite alternate-reverse;
  }
  .hero-blob-3 {
    width: 300px; height: 300px;
    background: radial-gradient(circle, #c8792a44 0%, transparent 70%);
    top: 50%; left: 55%;
    animation: drift 10s ease-in-out infinite alternate;
  }

  @keyframes drift {
    from { transform: translate(0, 0) scale(1); }
    to   { transform: translate(40px, 30px) scale(1.08); }
  }

  /* Grain overlay */
  .hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    background-size: 180px;
    opacity: 0.35;
    pointer-events: none;
    z-index: 1;
  }

  .hero-content { position: relative; z-index: 2; max-width: 820px; }

  .hero-eyebrow {
    font-family: var(--font-body);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--c-sage);
    margin-bottom: 20px;
    display: inline-flex;
    align-items: center;
    gap: 10px;
  }
  .hero-eyebrow::before, .hero-eyebrow::after {
    content: '';
    width: 32px;
    height: 1px;
    background: var(--c-sage);
    opacity: 0.6;
  }

  .hero-title {
    font-family: var(--font-display);
    font-size: clamp(48px, 8vw, 96px);
    font-weight: 700;
    line-height: 1.0;
    color: var(--c-cream);
    margin-bottom: 12px;
    letter-spacing: -0.02em;
  }
  .hero-title em {
    font-style: italic;
    color: var(--c-sage);
    position: relative;
  }
  .hero-title em::after {
    content: '';
    position: absolute;
    bottom: 4px;
    left: 0;
    right: 0;
    height: 3px;
    background: var(--c-amber);
    border-radius: 2px;
    transform: scaleX(0);
    transform-origin: left;
    animation: underline-in 0.8s 1.2s var(--ease-spring) forwards;
  }
  @keyframes underline-in {
    to { transform: scaleX(1); }
  }

  .hero-sub {
    font-family: var(--font-display);
    font-size: clamp(16px, 2.5vw, 22px);
    font-weight: 400;
    font-style: italic;
    color: var(--c-mist);
    opacity: 0.85;
    max-width: 560px;
    margin: 0 auto 48px;
    line-height: 1.6;
  }

  /* Stats row */
  .hero-stats {
    display: flex;
    gap: 40px;
    justify-content: center;
    flex-wrap: wrap;
    margin-top: 40px;
  }
  .stat {
    text-align: center;
    position: relative;
  }
  .stat + .stat::before {
    content: '';
    position: absolute;
    left: -20px;
    top: 50%;
    transform: translateY(-50%);
    width: 1px;
    height: 40px;
    background: rgba(255,255,255,0.12);
  }
  .stat-num {
    font-family: var(--font-display);
    font-size: 36px;
    font-weight: 700;
    color: var(--c-sage);
    line-height: 1;
  }
  .stat-label {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--c-muted);
    margin-top: 6px;
  }

  /* Scroll cue */
  .scroll-cue {
    position: absolute;
    bottom: 36px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    color: var(--c-muted);
    font-size: 10px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }
  .scroll-line {
    width: 1px;
    height: 40px;
    background: linear-gradient(to bottom, var(--c-sage), transparent);
    animation: scroll-bounce 2s ease-in-out infinite;
  }
  @keyframes scroll-bounce {
    0%,100% { transform: scaleY(1); opacity: 0.6; }
    50%      { transform: scaleY(1.3); opacity: 1; }
  }

  /* ═══════════════════════════════
     MISSION
  ═══════════════════════════════ */
  .mission {
    padding: 120px 24px;
    background: var(--c-cream);
    position: relative;
  }
  .mission::before {
    content: '"';
    font-family: var(--font-display);
    font-size: 400px;
    color: var(--c-leaf);
    opacity: 0.04;
    position: absolute;
    top: -60px;
    left: -20px;
    line-height: 1;
    pointer-events: none;
    user-select: none;
  }

  .mission-inner {
    max-width: 1100px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: center;
  }
  @media (max-width: 768px) {
    .mission-inner { grid-template-columns: 1fr; gap: 48px; }
  }

  .section-tag {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--c-amber);
    margin-bottom: 16px;
  }

  .section-title {
    font-family: var(--font-display);
    font-size: clamp(28px, 4vw, 48px);
    font-weight: 700;
    line-height: 1.15;
    color: var(--c-earth);
    margin-bottom: 24px;
    letter-spacing: -0.01em;
  }
  .section-title em { font-style: italic; color: var(--c-leaf); }

  .section-body {
    font-size: 16px;
    line-height: 1.8;
    color: var(--c-sub);
    margin-bottom: 16px;
  }

  /* Why card */
  .why-card {
    background: var(--c-earth);
    border-radius: 24px;
    padding: 40px;
    position: relative;
    overflow: hidden;
  }
  .why-card::before {
    content: '';
    position: absolute;
    top: -60px;
    right: -60px;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background: radial-gradient(circle, var(--c-leaf) 0%, transparent 70%);
    opacity: 0.3;
  }
  .why-title {
    font-family: var(--font-display);
    font-size: 22px;
    font-weight: 600;
    color: var(--c-mist);
    margin-bottom: 28px;
  }
  .why-item {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    margin-bottom: 18px;
    font-size: 15px;
    color: var(--c-mist);
    opacity: 0.85;
    line-height: 1.55;
  }
  .why-check {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: var(--c-sage);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 1px;
    font-size: 11px;
    color: var(--c-earth);
    font-weight: 700;
  }

  /* ═══════════════════════════════
     IMPACT
  ═══════════════════════════════ */
  .impact {
    padding: 120px 24px;
    background: var(--c-warm);
    position: relative;
    overflow: hidden;
  }
  .impact::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, transparent, var(--c-sage), var(--c-amber), var(--c-sage), transparent);
  }

  .impact-header {
    text-align: center;
    max-width: 600px;
    margin: 0 auto 72px;
  }

  .impact-grid {
    max-width: 1100px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 28px;
  }
  @media (max-width: 768px) {
    .impact-grid { grid-template-columns: 1fr; }
  }

  .impact-card {
    background: var(--c-cream);
    border-radius: 24px;
    padding: 40px 32px;
    border: 1px solid rgba(45, 80, 22, 0.08);
    position: relative;
    overflow: hidden;
    transition: transform 0.4s var(--ease-spring), box-shadow 0.4s ease, border-color 0.35s ease;
    cursor: default;
  }
  .impact-card:hover {
    transform: translateY(-10px) scale(1.02);
    box-shadow: 0 24px 60px rgba(26,18,8,0.14);
    border-color: var(--c-sage);
  }
  .impact-card-accent {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    border-radius: 24px 24px 0 0;
    transition: height 0.35s ease;
  }
  .impact-card:hover .impact-card-accent { height: 6px; }

  .impact-icon {
    width: 64px;
    height: 64px;
    border-radius: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    margin-bottom: 24px;
  }
  .impact-card-title {
    font-family: var(--font-display);
    font-size: 20px;
    font-weight: 700;
    color: var(--c-earth);
    margin-bottom: 12px;
  }
  .impact-card-body {
    font-size: 14px;
    line-height: 1.75;
    color: var(--c-sub);
  }

  /* ═══════════════════════════════
     VALUES
  ═══════════════════════════════ */
  .values {
    padding: 120px 24px;
    background: var(--c-cream);
  }
  .values-inner {
    max-width: 1100px;
    margin: 0 auto;
  }
  .values-header {
    text-align: center;
    max-width: 600px;
    margin: 0 auto 72px;
  }
  .values-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }
  @media (max-width: 900px) {
    .values-grid { grid-template-columns: 1fr 1fr; }
  }
  @media (max-width: 540px) {
    .values-grid { grid-template-columns: 1fr; }
  }

  .value-card {
    background: var(--c-earth);
    border-radius: 20px;
    padding: 36px 28px;
    position: relative;
    overflow: hidden;
    transition: transform 0.4s var(--ease-spring);
  }
  .value-card:hover { transform: translateY(-6px); }
  .value-card::after {
    content: '';
    position: absolute;
    bottom: -40px;
    right: -40px;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: var(--c-leaf);
    opacity: 0.12;
    transition: opacity 0.35s ease, transform 0.35s ease;
  }
  .value-card:hover::after { opacity: 0.22; transform: scale(1.3); }

  .value-icon {
    font-size: 32px;
    margin-bottom: 20px;
    display: block;
  }
  .value-title {
    font-family: var(--font-display);
    font-size: 17px;
    font-weight: 700;
    color: var(--c-sage);
    margin-bottom: 10px;
  }
  .value-body {
    font-size: 13px;
    line-height: 1.7;
    color: var(--c-mist);
    opacity: 0.75;
  }

  /* ═══════════════════════════════
     CTA FOOTER
  ═══════════════════════════════ */
  .cta-section {
    background: var(--c-moss);
    padding: 100px 24px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .cta-section::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 50% 0%, rgba(74,124,47,0.6) 0%, transparent 70%);
    pointer-events: none;
  }
  .cta-leaf {
    position: absolute;
    font-size: 200px;
    opacity: 0.04;
    user-select: none;
    pointer-events: none;
  }
  .cta-leaf-1 { top: -20px; left: -40px; transform: rotate(-30deg); }
  .cta-leaf-2 { bottom: -30px; right: -20px; transform: rotate(20deg); }

  .cta-inner { position: relative; z-index: 1; max-width: 640px; margin: 0 auto; }

  .cta-eyebrow {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--c-sage);
    margin-bottom: 20px;
  }

  .cta-title {
    font-family: var(--font-display);
    font-size: clamp(30px, 5vw, 52px);
    font-weight: 700;
    line-height: 1.15;
    color: var(--c-cream);
    margin-bottom: 20px;
    letter-spacing: -0.02em;
  }
  .cta-title em { font-style: italic; color: var(--c-sage); }

  .cta-sub {
    font-size: 16px;
    color: var(--c-mist);
    opacity: 0.7;
    line-height: 1.7;
    margin-bottom: 44px;
  }

  .cta-btn {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: var(--c-sage);
    color: var(--c-earth);
    font-family: var(--font-body);
    font-size: 15px;
    font-weight: 600;
    letter-spacing: 0.04em;
    padding: 16px 36px;
    border-radius: 50px;
    border: none;
    cursor: pointer;
    text-decoration: none;
    transition: transform 0.35s var(--ease-spring), box-shadow 0.35s ease, background 0.25s ease;
    box-shadow: 0 4px 24px rgba(74,124,47,0.35);
  }
  .cta-btn:hover {
    transform: translateY(-4px) scale(1.04);
    box-shadow: 0 12px 40px rgba(74,124,47,0.5);
    background: var(--c-mist);
  }
  .cta-btn-arrow {
    transition: transform 0.3s var(--ease-spring);
  }
  .cta-btn:hover .cta-btn-arrow { transform: translateX(4px); }

  .cta-footer-note {
    margin-top: 56px;
    font-size: 12px;
    color: var(--c-muted);
    letter-spacing: 0.06em;
  }
`;

/* ─── Scroll-reveal hook ─── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ─── Animated counter ─── */
function Counter({ to, suffix = "" }) {
  const [val, setVal] = useState(0);
  const ref = useRef();
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      let start = 0;
      const step = to / 60;
      const tick = () => {
        start = Math.min(start + step, to);
        setVal(Math.round(start));
        if (start < to) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.5 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [to]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

/* ═══════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════ */
const About = () => {
  useReveal();

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div className="about-page">

        {/* ── HERO ── */}
        <section className="hero">
          <div className="hero-blob hero-blob-1" />
          <div className="hero-blob hero-blob-2" />
          <div className="hero-blob hero-blob-3" />

          <div className="hero-content">
            <div className="hero-eyebrow reveal">Our Story</div>

            <h1 className="hero-title reveal reveal-delay-1">
              Rescue Food.<br />
              <em>Restore Hope.</em>
            </h1>

            <p className="hero-sub reveal reveal-delay-2">
              Bridging the gap between surplus and need — one meal at a time.
            </p>

            <div className="hero-stats reveal reveal-delay-3">
              <div className="stat">
                <div className="stat-num"><Counter to={12000} suffix="+" /></div>
                <div className="stat-label">Meals Rescued</div>
              </div>
              <div className="stat">
                <div className="stat-num"><Counter to={340} suffix="+" /></div>
                <div className="stat-label">NGO Partners</div>
              </div>
              <div className="stat">
                <div className="stat-num"><Counter to={98} suffix="%" /></div>
                <div className="stat-label">Safe Delivery</div>
              </div>
            </div>
          </div>

          <div className="scroll-cue">
            <div className="scroll-line" />
            Scroll
          </div>
        </section>

        {/* ── MISSION ── */}
        <section className="mission">
          <div className="mission-inner">
            <div>
              <p className="section-tag reveal">Our Mission</p>
              <h2 className="section-title reveal reveal-delay-1">
                Technology in service of <em>humanity</em>
              </h2>
              <p className="section-body reveal reveal-delay-2">
                ResQPlate is a technology-driven platform designed to reduce food waste
                and combat hunger. We connect restaurants, event organizers, and households
                with verified NGOs and volunteers in real time.
              </p>
              <p className="section-body reveal reveal-delay-3">
                By leveraging geolocation, smart matching, and secure authentication,
                we ensure that surplus food reaches the right people — before it goes to waste.
              </p>
            </div>

            <div className="why-card reveal reveal-delay-2">
              <h3 className="why-title">Why ResQPlate?</h3>
              {[
                "Reduces food wastage with precision matching",
                "Empowers NGOs & frontline volunteers",
                "Guarantees safe, timely pickup every time",
                "Builds sustainable, compassionate communities",
              ].map((text, i) => (
                <div className="why-item" key={i}>
                  <div className="why-check">✓</div>
                  {text}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── IMPACT ── */}
        <section className="impact">
          <div className="impact-header">
            <p className="section-tag reveal">How We Work</p>
            <h2 className="section-title reveal reveal-delay-1">
              Every feature built to <em>make a difference</em>
            </h2>
          </div>

          <div className="impact-grid">
            {[
              {
                icon: "🍽️",
                accent: "linear-gradient(90deg, #4a7c2f, #7db05a)",
                iconBg: "rgba(74,124,47,0.12)",
                title: "Food Rescue",
                body: "Prevents edible food from being discarded by redirecting surplus to verified NGOs in real time — zero waste, zero hunger.",
              },
              {
                icon: "📍",
                accent: "linear-gradient(90deg, #c8792a, #e8a85a)",
                iconBg: "rgba(200,121,42,0.12)",
                title: "Smart Matching",
                body: "Location-based algorithms notify nearby verified receivers instantly, ensuring the fastest path from donor to plate.",
              },
              {
                icon: "🤝",
                accent: "linear-gradient(90deg, #2d5016, #4a7c2f)",
                iconBg: "rgba(45,80,22,0.1)",
                title: "Community Driven",
                body: "Donors, NGOs, and volunteers collaborate through a transparent ecosystem built on mutual trust and shared purpose.",
              },
            ].map((card, i) => (
              <div className={`impact-card reveal reveal-delay-${i + 1}`} key={i}>
                <div className="impact-card-accent" style={{ background: card.accent }} />
                <div className="impact-icon" style={{ background: card.iconBg }}>{card.icon}</div>
                <h3 className="impact-card-title">{card.title}</h3>
                <p className="impact-card-body">{card.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── VALUES ── */}
        <section className="values">
          <div className="values-inner">
            <div className="values-header">
              <p className="section-tag reveal">Our Principles</p>
              <h2 className="section-title reveal reveal-delay-1">
                Values we <em>never</em> compromise
              </h2>
              <p className="section-body reveal reveal-delay-2" style={{ textAlign: "center" }}>
                Trust and responsibility are at the core of everything we do.
              </p>
            </div>

            <div className="values-grid">
              {[
                { icon: "🛡️", title: "Food Safety",   body: "Expiry-based listings ensure only safe, consumable food enters our network." },
                { icon: "🔐", title: "Secure Access",  body: "Role-based auth protects every donor and verified NGO on the platform." },
                { icon: "⚖️", title: "Transparency",   body: "Every donation follows a clear, auditable claim and pickup workflow." },
                { icon: "🌍", title: "Social Impact",  body: "Sustainable communities built through meaningful collaboration, not charity." },
              ].map((v, i) => (
                <div className={`value-card reveal reveal-delay-${i + 1}`} key={i}>
                  <span className="value-icon">{v.icon}</span>
                  <h4 className="value-title">{v.title}</h4>
                  <p className="value-body">{v.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="cta-section">
          <span className="cta-leaf cta-leaf-1">🌿</span>
          <span className="cta-leaf cta-leaf-2">🌿</span>

          <div className="cta-inner">
            <p className="cta-eyebrow reveal">Join the movement</p>
            <h2 className="cta-title reveal reveal-delay-1">
              Together, we can <em>end</em> food waste
            </h2>
            <p className="cta-sub reveal reveal-delay-2">
              Every surplus plate is someone's next meal. Be the bridge.
            </p>
            <a href="/signup" className="cta-btn reveal reveal-delay-3">
              Get Started Today
              <span className="cta-btn-arrow">→</span>
            </a>

            <p className="cta-footer-note reveal reveal-delay-4">
              © 2025 ResQPlate — Built for Social Impact
            </p>
          </div>
        </section>

      </div>
    </>
  );
};

export default About;