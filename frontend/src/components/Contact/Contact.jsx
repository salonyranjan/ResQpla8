import { useState, useRef, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

/* ─── Font Loader ─── */
const FontLoader = () => {
  useEffect(() => {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href =
      "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,700&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap";
    document.head.appendChild(l);
  }, []);
  return null;
};

/* ─── Theme tokens ─── */
const LIGHT = {
  bg:       "#f7f3ec", bg2: "#ede8dc", bg3: "#e4dfd2",
  card:     "#ffffff", card2: "#f7f3ec",
  border:   "#d9d0bc", border2: "#c8bfaa",
  ink:      "#2f2a24", muted: "#7a7065", hint: "#a89e92",
  leaf:     "#1a4a2e", leafMid: "#2d6a4f", sage: "#6a9e7a", mint: "#a8cdb5",
  terra:    "#b85c38", amber: "#d4933a",
  heroBg:   "#1a4a2e", heroText: "rgba(255,255,255,0.62)",
};
const DARK = {
  bg:       "#0f1410", bg2: "#141a15", bg3: "#1a2219",
  card:     "#1c2a1e", card2: "#162019",
  border:   "#2a3c2d", border2: "#3a5040",
  ink:      "#e8e0d0", muted: "#8fa897", hint: "#5a7065",
  leaf:     "#2d6a4f", leafMid: "#3d8a67", sage: "#6ab882", mint: "#4a9668",
  terra:    "#d4733a", amber: "#e8a838",
  heroBg:   "#0a1a10", heroText: "rgba(255,255,255,0.5)",
};

/* ─── Global styles injected with dark-mode CSS vars ─── */
const GlobalStyles = ({ dark }) => {
  const T = dark ? DARK : LIGHT;
  useEffect(() => {
    const s = document.createElement("style");
    s.id = "rq-contact-styles";
    s.textContent = `
      *, *::before, *::after { box-sizing: border-box; }
      html { scroll-behavior: smooth; }
      body { margin: 0; background: ${T.bg}; transition: background .4s; }
      a { text-decoration: none; color: inherit; }
      input, textarea, select {
        font-family: 'DM Sans', sans-serif; font-size: 14.5px; width: 100%;
        background: ${T.bg2}; border: 1.5px solid ${T.border};
        border-radius: 11px; padding: 12px 15px; color: ${T.ink};
        outline: none; -webkit-appearance: none; appearance: none;
        transition: border-color .25s, box-shadow .25s, background .4s, color .4s;
      }
      input::placeholder, textarea::placeholder { color: ${T.hint}; opacity: .7; }
      input:focus, textarea:focus, select:focus {
        border-color: ${T.leaf}; box-shadow: 0 0 0 3px ${T.leaf}20;
      }
      textarea { resize: none; }
      @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.38} }
      @keyframes floatY { 0%,100%{transform:translateY(-55%)} 50%{transform:translateY(calc(-55% - 11px))} }
      @keyframes floatY2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(9px)} }
      @keyframes ripple { 0%{transform:scale(1);opacity:.38} 100%{transform:scale(2.4);opacity:0} }
      @keyframes spin { to{transform:rotate(360deg)} }
      @keyframes grain {
        0%,100%{transform:translate(0,0)} 10%{transform:translate(-2%,-3%)}
        20%{transform:translate(3%,2%)} 30%{transform:translate(-1%,4%)}
        50%{transform:translate(-3%,3%)} 70%{transform:translate(-4%,1%)}
      }
      @media (max-width:900px) {
        .rq-info-grid, .rq-split, .rq-partner-grid { grid-template-columns: 1fr 1fr !important; }
        .rq-hero-card { display: none !important; }
      }
      @media (max-width:560px) {
        .rq-info-grid, .rq-split, .rq-partner-grid, .rq-form-row { grid-template-columns: 1fr !important; }
      }
    `;
    const old = document.getElementById("rq-contact-styles");
    if (old) old.remove();
    document.head.appendChild(s);
    return () => { const el = document.getElementById("rq-contact-styles"); if (el) el.remove(); };
  }, [dark]);
  return null;
};

/* ─── Grain ─── */
const Grain = () => (
  <div style={{
    position: "fixed", inset: 0, zIndex: 999, pointerEvents: "none", opacity: .028,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
    animation: "grain 4s steps(1) infinite",
  }} />
);

/* ─── Reveal ─── */
const Reveal = ({ children, delay = 0, y = 26 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
    >{children}</motion.div>
  );
};

/* ─── Theme Toggle Button ─── */
const ThemeToggle = ({ dark, onToggle, T }) => (
  <div style={{
    background: T.card, borderBottom: `1px solid ${T.border}`,
    padding: "10px 40px", display: "flex", alignItems: "center",
    justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100,
    transition: "background .4s, border-color .4s",
  }}>
    <div style={{
      fontFamily: "'Cormorant Garamond', serif", fontSize: 19,
      fontWeight: 700, color: T.ink, transition: "color .4s",
    }}>
      ResQ<em style={{ color: T.amber, fontStyle: "italic" }}>Plate</em>
    </div>

    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{
        fontFamily: "'DM Mono', monospace", fontSize: 11,
        letterSpacing: ".1em", color: T.muted, transition: "color .4s",
      }}>{dark ? "DARK" : "LIGHT"}</span>

      <motion.div
        onClick={onToggle}
        role="switch" aria-checked={dark} tabIndex={0}
        onKeyDown={e => (e.key === " " || e.key === "Enter") && onToggle()}
        style={{
          width: 52, height: 28, borderRadius: 100,
          border: `1.5px solid ${dark ? T.leafMid : T.border2}`,
          background: dark ? T.leaf : T.bg2,
          position: "relative", cursor: "pointer",
          transition: "background .35s, border-color .35s",
        }}
      >
        <motion.div
          animate={{ x: dark ? 24 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          style={{
            position: "absolute", top: 3, left: 3,
            width: 18, height: 18, borderRadius: "50%",
            background: dark ? "#e8f5ee" : T.leaf,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          {dark ? (
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <path d="M10 6.5A4.5 4.5 0 015.5 2a4.5 4.5 0 100 9A4.5 4.5 0 0110 6.5z" fill="#1a4a2e" />
            </svg>
          ) : (
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="2.8" fill="#e8f5ee" />
              <line x1="6" y1="0.5" x2="6" y2="2" stroke="#e8f5ee" strokeWidth="1.3" strokeLinecap="round" />
              <line x1="6" y1="10" x2="6" y2="11.5" stroke="#e8f5ee" strokeWidth="1.3" strokeLinecap="round" />
              <line x1="0.5" y1="6" x2="2" y2="6" stroke="#e8f5ee" strokeWidth="1.3" strokeLinecap="round" />
              <line x1="10" y1="6" x2="11.5" y2="6" stroke="#e8f5ee" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
          )}
        </motion.div>
      </motion.div>
    </div>
  </div>
);

/* ─── Botanical leaf deco ─── */
const BotLeaf = ({ style, T }) => (
  <svg viewBox="0 0 100 160" fill="none" style={{ position: "absolute", pointerEvents: "none", ...style }}>
    <path d="M50 155 C15 125 0 85 12 45 C22 12 50 8 76 38 C102 68 98 128 50 155Z" fill={T.sage} opacity=".18" />
    <path d="M50 155 L50 55" stroke={T.sage} strokeWidth="1" opacity=".25" />
  </svg>
);

const DotRing = ({ style, T }) => (
  <svg viewBox="0 0 200 200" fill="none" style={{ position: "absolute", pointerEvents: "none", ...style }}>
    <circle cx="100" cy="100" r="90" stroke={T.border} strokeWidth="1.2" strokeDasharray="3 7" />
  </svg>
);

const Label = ({ children, T }) => (
  <div style={{
    display: "inline-flex", alignItems: "center", gap: 8,
    fontFamily: "'DM Mono', monospace", fontSize: 10.5,
    letterSpacing: ".17em", textTransform: "uppercase",
    color: T.leaf, marginBottom: 12, transition: "color .4s",
  }}>
    <span style={{ width: 16, height: 1, background: T.leaf, display: "inline-block" }} />
    {children}
    <span style={{ width: 16, height: 1, background: T.leaf, display: "inline-block" }} />
  </div>
);

/* ═══════════════════════════════ HERO ═══════════════════════════════ */
const Hero = ({ T }) => (
  <section style={{
    background: T.heroBg, padding: "80px 40px 72px",
    position: "relative", overflow: "hidden",
    transition: "background .4s",
  }}>
    <DotRing style={{ width: 260, top: -70, right: "14%", opacity: .15 }} T={T} />
    <BotLeaf style={{ width: 160, top: 0, left: -24, transform: "rotate(-15deg)" }} T={T} />
    <BotLeaf style={{ width: 120, bottom: 50, right: 40, transform: "rotate(160deg)", opacity: .5 }} T={T} />

    <div style={{ maxWidth: 1080, margin: "0 auto", position: "relative", zIndex: 1 }}>
      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, scale: .85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: .2, duration: .6, ease: [.22, 1, .36, 1] }}
        style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,.12)",
          borderRadius: 100, padding: "6px 16px",
          fontFamily: "'DM Mono', monospace", fontSize: 10.5,
          letterSpacing: ".15em", textTransform: "uppercase", color: T.mint, marginBottom: 20,
        }}
      >
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.amber, display: "inline-block" }} />
        Get in Touch · ResQPlate
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: .3, duration: .8, ease: [.22, 1, .36, 1] }}
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(46px,7vw,84px)", fontWeight: 700,
          lineHeight: .93, color: "#fff", letterSpacing: "-.02em", marginBottom: 20,
        }}
      >
        Let's <em style={{ color: T.amber, fontStyle: "italic" }}>rescue</em><br />food, together.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: .45, duration: .75, ease: [.22, 1, .36, 1] }}
        style={{
          fontSize: 15.5, fontWeight: 300, color: T.heroText,
          maxWidth: 440, lineHeight: 1.75, transition: "color .4s",
        }}
      >
        Whether you're a restaurant with surplus, an NGO serving families, or a volunteer ready to ride — this is where it starts.
      </motion.p>

      {/* Trust row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: .7, duration: .7 }}
        style={{ display: "flex", gap: 22, flexWrap: "wrap", marginTop: 36 }}
      >
        {["Govt. of India Backed", "ISO 9001:2015 Certified", "2,400+ Lives Impacted"].map((t, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: "rgba(255,255,255,.38)", letterSpacing: ".04em" }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="6" stroke={T.sage} strokeWidth="1.2" />
              <path d="M4 7l2 2 4-4" stroke={T.sage} strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            {t}
          </div>
        ))}
      </motion.div>
    </div>

    {/* Floating card */}
    <motion.div
      className="rq-hero-card"
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: .7, duration: 1, ease: [.22, 1, .36, 1] }}
      style={{
        position: "absolute", right: "6%", top: "50%",
        width: 264, background: T.card, borderRadius: 20,
        padding: 20, boxShadow: "0 40px 80px rgba(0,0,0,.28)",
        animation: "floatY 6s ease-in-out infinite",
        transition: "background .4s",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: 9, background: T.mint, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0, transition: "background .4s" }}>🍱</div>
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 500, color: T.ink, transition: "color .4s" }}>New Donation Posted</div>
          <div style={{ fontSize: 10.5, color: T.muted, fontFamily: "'DM Mono', monospace", marginTop: 2, transition: "color .4s" }}>2 min ago · Connaught Place</div>
        </div>
      </div>
      <div style={{ background: T.card2, borderRadius: 9, padding: "9px 12px", marginBottom: 11, fontSize: 12, color: T.ink, lineHeight: 1.5, transition: "background .4s, color .4s" }}>
        45 meals — Dal Makhani, Rice &amp; Sabzi<br />
        <span style={{ fontSize: 11, color: T.muted }}>Expires in 3h · Pickup available</span>
      </div>
      <div style={{ display: "flex", gap: 7 }}>
        <button style={{ flex: 1, borderRadius: 8, padding: "7px 0", textAlign: "center", fontSize: 11.5, fontWeight: 500, background: T.leaf, color: "#fff", border: "none", cursor: "pointer", transition: "background .4s" }}>Accept</button>
        <button style={{ flex: 1, borderRadius: 8, padding: "7px 0", textAlign: "center", fontSize: 11.5, background: T.card2, color: T.muted, border: "none", cursor: "pointer", transition: "background .4s, color .4s" }}>Later</button>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 11, paddingTop: 11, borderTop: `1px solid ${T.border}`, transition: "border-color .4s" }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.sage, display: "inline-block", animation: "blink 1.8s ease-in-out infinite" }} />
        <span style={{ fontSize: 11, color: T.sage, fontFamily: "'DM Mono', monospace", transition: "color .4s" }}>3 NGOs notified nearby</span>
      </div>
      {/* Mini floater */}
      <motion.div
        animate={{ y: [0, 9, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        style={{
          position: "absolute", bottom: -22, left: -40,
          background: T.amber, borderRadius: 13, padding: "10px 15px",
          display: "flex", alignItems: "center", gap: 9,
          boxShadow: "0 14px 36px rgba(0,0,0,.22)", transition: "background .4s",
        }}
      >
        <span style={{ fontSize: 19 }}>🌱</span>
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 500, color: T.leaf, transition: "color .4s" }}>500 kg CO₂ Saved</div>
          <div style={{ fontSize: 10, color: T.leafMid, fontFamily: "'DM Mono', monospace", marginTop: 2, transition: "color .4s" }}>This month alone</div>
        </div>
      </motion.div>
    </motion.div>

    {/* Wave arc */}
    <div style={{ position: "absolute", bottom: -1, left: 0, right: 0, lineHeight: 0 }}>
      <svg viewBox="0 0 1440 70" preserveAspectRatio="none" height="70" style={{ display: "block", width: "100%" }}>
        <path d={`M0,70 Q720,0 1440,70 L1440,70 L0,70Z`} fill={T.bg} />
      </svg>
    </div>
  </section>
);

/* ═══════════════════════════════ INFO CARDS ═══════════════════════════════ */
const infoCards = [
  { emoji: "✉️", title: "Email Us",    lines: ["support@resqplate.org", "logistics@resqplate.org"], accent: "#b85c38" },
  { emoji: "📞", title: "Call Us",     lines: ["+91 98765 43210", "24/7 Emergency Line"],          accent: "#d4933a" },
  { emoji: "📍", title: "Our Hub",     lines: ["ResQPlate HQ", "Patna, Bihar — 800001"],           accent: "#2d6a4f" },
  { emoji: "🕐", title: "Hours",       lines: ["Platform: Always On", "Support: 9 AM – 8 PM"],    accent: "#6a9e7a" },
];

const InfoCards = ({ T }) => (
  <section style={{ background: T.bg, padding: "0 40px 68px", transition: "background .4s" }}>
    <div className="rq-info-grid" style={{
      maxWidth: 1080, margin: "0 auto",
      display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16,
      marginTop: -38,
    }}>
      {infoCards.map((c, i) => (
        <Reveal key={i} delay={i * .08}>
          <motion.div
            whileHover={{ y: -4, boxShadow: "0 20px 48px rgba(0,0,0,.1)" }}
            style={{
              background: T.card, borderRadius: 18, padding: 24,
              border: `1px solid ${T.border}`, position: "relative", overflow: "hidden",
              cursor: "default", transition: "background .4s, border-color .4s",
            }}
          >
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: c.accent, borderRadius: 0 }} />
            <div style={{ fontSize: 25, marginBottom: 13 }}>{c.emoji}</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 700, color: T.ink, marginBottom: 7, transition: "color .4s" }}>{c.title}</div>
            {c.lines.map((l, j) => <div key={j} style={{ fontSize: 13, color: T.muted, lineHeight: 1.6, transition: "color .4s" }}>{l}</div>)}
          </motion.div>
        </Reveal>
      ))}
    </div>
  </section>
);

/* ═══════════════════════════════ FORM SECTION ═══════════════════════════════ */
const faqs = [
  { q: "How fast are NGOs matched to donations?", a: "Our AI typically finds the best-fit NGO within 90 seconds — factoring distance, capacity, and food type simultaneously." },
  { q: "How is food safety maintained in transit?", a: "Volunteers use insulated carriers. If a pickup window is missed, we auto-reassign to the next nearest verified volunteer." },
  { q: "Can NGOs specify food they need?", a: "Yes. NGOs manage a live preference dashboard so they only receive food matching their current needs and storage capacity." },
  { q: "Do donors receive proof of impact?", a: "Every donor gets a digital certificate showing meals rescued, CO₂ saved, and estimated families reached — fully shareable." },
];

const FormSection = ({ T }) => {
  const [form, setForm] = useState({ name: "", email: "", role: "Restaurant / Donor", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false); setSent(true);
      setTimeout(() => {
        setSent(false);
        setForm({ name: "", email: "", role: "Restaurant / Donor", message: "" });
      }, 3200);
    }, 1500);
  };

  const fieldStyle = {
    background: T.bg2, border: `1.5px solid ${T.border}`, borderRadius: 11,
    padding: "12px 15px", fontFamily: "'DM Sans', sans-serif",
    fontSize: 14.5, color: T.ink, width: "100%", outline: "none",
    transition: "background .4s, color .4s, border-color .4s",
  };

  return (
    <section style={{ background: T.bg2, padding: "68px 40px 88px", position: "relative", overflow: "hidden", transition: "background .4s" }}>
      <DotRing style={{ width: 190, top: -36, left: -36, opacity: .3 }} T={T} />
      <BotLeaf style={{ width: 150, bottom: 0, right: -30, transform: "rotate(145deg)", opacity: .4 }} T={T} />

      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <Label T={T}>Write to Us</Label>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(30px,5vw,50px)", fontWeight: 700, color: T.ink, lineHeight: 1.05, transition: "color .4s" }}>
              Start the <em style={{ color: T.terra, fontStyle: "italic" }}>conversation.</em>
            </h2>
          </div>
        </Reveal>

        <div className="rq-split" style={{ display: "grid", gridTemplateColumns: "1.1fr .9fr", gap: 32 }}>

          {/* FORM CARD */}
          <Reveal>
            <div style={{ background: T.card, borderRadius: 24, padding: 40, border: `1px solid ${T.border}`, position: "relative", overflow: "hidden", transition: "background .4s, border-color .4s" }}>
              <div style={{ position: "absolute", top: 0, left: 28, right: 28, height: 2, background: `linear-gradient(90deg,${T.terra},${T.amber})`, borderRadius: "0 0 4px 4px" }} />

              <AnimatePresence mode="wait">
                {sent ? (
                  <motion.div key="sent" initial={{ opacity: 0, scale: .92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                    style={{ textAlign: "center", padding: "40px 0" }}>
                    <div style={{ fontSize: 44, marginBottom: 14 }}>🌿</div>
                    <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 700, color: T.leaf, marginBottom: 8, transition: "color .4s" }}>Message Received</h3>
                    <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.7, transition: "color .4s" }}>We'll get back to you within 24 hours.<br />Thank you for reaching out!</p>
                  </motion.div>
                ) : (
                  <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div style={{ marginBottom: 26 }}>
                      <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 23, fontWeight: 700, color: T.ink, marginBottom: 5, transition: "color .4s" }}>Send a Message</h3>
                      <p style={{ fontSize: 13, color: T.muted, transition: "color .4s" }}>For partnerships, logistics, or just a hello.</p>
                    </div>
                    <form onSubmit={handleSubmit}>
                      <div className="rq-form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 13, marginBottom: 13 }}>
                        <div>
                          <label style={{ display: "block", fontSize: 11, fontWeight: 500, color: T.muted, letterSpacing: ".07em", textTransform: "uppercase", marginBottom: 6, transition: "color .4s" }}>Your Name</label>
                          <input style={fieldStyle} name="name" value={form.name} onChange={handleChange} placeholder="Priya Sharma" required />
                        </div>
                        <div>
                          <label style={{ display: "block", fontSize: 11, fontWeight: 500, color: T.muted, letterSpacing: ".07em", textTransform: "uppercase", marginBottom: 6, transition: "color .4s" }}>Email Address</label>
                          <input style={fieldStyle} type="email" name="email" value={form.email} onChange={handleChange} placeholder="priya@restaurant.com" required />
                        </div>
                      </div>
                      <div style={{ marginBottom: 13 }}>
                        <label style={{ display: "block", fontSize: 11, fontWeight: 500, color: T.muted, letterSpacing: ".07em", textTransform: "uppercase", marginBottom: 6, transition: "color .4s" }}>I am a…</label>
                        <div style={{ position: "relative" }}>
                          <select style={fieldStyle} name="role" value={form.role} onChange={handleChange}>
                            <option>Restaurant / Donor</option>
                            <option>NGO / Shelter</option>
                            <option>Volunteer / Driver</option>
                            <option>Corporate Partner</option>
                            <option>Media / Press</option>
                          </select>
                          <svg style={{ position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: T.muted }} width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M2.5 4.5l3.5 3.5 3.5-3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                          </svg>
                        </div>
                      </div>
                      <div style={{ marginBottom: 26 }}>
                        <label style={{ display: "block", fontSize: 11, fontWeight: 500, color: T.muted, letterSpacing: ".07em", textTransform: "uppercase", marginBottom: 6, transition: "color .4s" }}>Message</label>
                        <textarea style={fieldStyle} name="message" rows={5} value={form.message} onChange={handleChange} placeholder="Tell us about your situation, your needs, or your ideas…" required />
                      </div>
                      <motion.button
                        type="submit" disabled={loading}
                        whileHover={{ scale: 1.02, boxShadow: `0 16px 40px ${T.leaf}30` }}
                        whileTap={{ scale: .98 }}
                        style={{
                          width: "100%", padding: "14px 0", borderRadius: 12, border: "none",
                          background: loading ? T.sage : T.leaf, color: "#fff",
                          fontFamily: "'DM Sans', sans-serif", fontSize: 14.5, fontWeight: 500,
                          cursor: loading ? "not-allowed" : "pointer",
                          display: "flex", alignItems: "center", justifyContent: "center", gap: 9,
                          transition: "background .3s",
                        }}
                      >
                        {loading ? (
                          <>
                            <motion.span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,.3)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block" }}
                              animate={{ rotate: 360 }} transition={{ duration: .9, repeat: Infinity, ease: "linear" }} />
                            Sending…
                          </>
                        ) : "Send Message →"}
                      </motion.button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Reveal>

          {/* SIDEBAR */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Map card */}
            <Reveal delay={.1}>
              <div style={{ background: T.card, borderRadius: 20, overflow: "hidden", border: `1px solid ${T.border}`, transition: "background .4s, border-color .4s" }}>
                <div style={{ height: 160, background: T.heroBg, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", transition: "background .4s" }}>
                  <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: .08 }} viewBox="0 0 380 160" preserveAspectRatio="none">
                    {[40, 80, 120].map(y => <line key={y} x1="0" y1={y} x2="380" y2={y} stroke="white" strokeWidth=".8" />)}
                    {[76, 152, 228, 304].map(x => <line key={x} x1={x} y1="0" x2={x} y2="160" stroke="white" strokeWidth=".8" />)}
                  </svg>
                  <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
                    <motion.div animate={{ scale: [1, 2.4, 1], opacity: [.38, 0, .38] }} transition={{ duration: 2.4, repeat: Infinity }}
                      style={{ position: "absolute", width: 48, height: 48, borderRadius: "50%", background: T.amber, top: 0, left: "50%", transform: "translateX(-50%)" }} />
                    <div style={{ width: 48, height: 48, borderRadius: "50%", background: T.amber, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19, margin: "0 auto 9px", position: "relative", zIndex: 1, boxShadow: `0 0 0 7px ${T.amber}33`, transition: "background .4s" }}>📍</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,.7)", fontFamily: "'DM Mono', monospace", letterSpacing: ".06em" }}>PATNA, BIHAR</div>
                  </div>
                  {[{ label: "Delhi", s: { top: "18%", left: "10%" } }, { label: "Mumbai", s: { top: "70%", left: "7%" } }, { label: "Kolkata", s: { top: "19%", right: "9%" } }].map((c, i) => (
                    <div key={i} style={{ position: "absolute", background: "rgba(255,255,255,.09)", borderRadius: 100, padding: "3px 9px", fontSize: 10, color: "rgba(255,255,255,.5)", fontFamily: "'DM Mono', monospace", ...c.s }}>{c.label}</div>
                  ))}
                </div>
                <div style={{ padding: "17px 21px" }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 700, color: T.ink, marginBottom: 4, transition: "color .4s" }}>Central Operations Hub</div>
                  <div style={{ fontSize: 13, color: T.muted, transition: "color .4s" }}>Boring Road, Patna, Bihar 800001</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
                    <motion.span animate={{ opacity: [1, .38, 1] }} transition={{ duration: 1.8, repeat: Infinity }}
                      style={{ width: 6, height: 6, borderRadius: "50%", background: T.sage, display: "inline-block", flexShrink: 0 }} />
                    <span style={{ fontSize: 11, color: T.sage, fontFamily: "'DM Mono', monospace", transition: "color .4s" }}>All systems operational</span>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* FAQ */}
            <Reveal delay={.15}>
              <div style={{ background: T.card, borderRadius: 20, overflow: "hidden", border: `1px solid ${T.border}`, transition: "background .4s, border-color .4s" }}>
                <div style={{ padding: "20px 24px 16px", borderBottom: `1px solid ${T.border}`, transition: "border-color .4s" }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 19, fontWeight: 700, color: T.ink, transition: "color .4s" }}>Common Questions</div>
                </div>
                {faqs.map((faq, i) => (
                  <div key={i} style={{ borderBottom: i < faqs.length - 1 ? `1px solid ${T.border}` : "none", transition: "border-color .4s" }}>
                    <button onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                      style={{ width: "100%", padding: "15px 22px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 13, background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, color: activeFaq === i ? T.leaf : T.ink, lineHeight: 1.5, flex: 1, transition: "color .25s" }}>{faq.q}</span>
                      <motion.span animate={{ rotate: activeFaq === i ? 45 : 0 }} transition={{ duration: .22 }}
                        style={{ width: 19, height: 19, borderRadius: "50%", border: `1.5px solid ${activeFaq === i ? T.leaf : T.border2}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: activeFaq === i ? T.leaf : T.muted, flexShrink: 0, marginTop: 1, transition: "border-color .22s, color .22s" }}>+</motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {activeFaq === i && (
                        <motion.div key="ans" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: .3, ease: [.22, 1, .36, 1] }} style={{ overflow: "hidden" }}>
                          <p style={{ padding: "0 22px 16px", fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: T.muted, lineHeight: 1.72, margin: 0, transition: "color .4s" }}>{faq.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════ PARTNERS ═══════════════════════════════ */
const partners = [
  { emoji: "🍽️", title: "Restaurants & Caterers", desc: "Post surplus in 60 seconds. We handle matching, pickup, and your digital impact certificate.", cta: "Join as Donor →", color: "#b85c38" },
  { emoji: "🤲", title: "NGOs & Shelters",         desc: "Register your needs and receive matched food donations with zero coordination overhead.",      cta: "Register NGO →",  color: "#2d6a4f" },
  { emoji: "🚴", title: "Volunteers & Drivers",    desc: "Join the fleet. Get pickup requests near you, track live deliveries, earn ResQPoints.",         cta: "Volunteer Now →", color: "#d4933a" },
];

const Partners = ({ T }) => (
  <section style={{ background: T.bg, padding: "68px 40px 88px", position: "relative", overflow: "hidden", transition: "background .4s" }}>
    <DotRing style={{ width: 200, bottom: -50, right: -50, opacity: .28 }} T={T} />
    <div style={{ maxWidth: 1080, margin: "0 auto" }}>
      <Reveal>
        <div style={{ textAlign: "center", marginBottom: 0 }}>
          <Label T={T}>Who We Work With</Label>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(30px,5vw,50px)", fontWeight: 700, color: T.ink, lineHeight: 1.05, transition: "color .4s" }}>
            Every role in the <em style={{ color: T.terra, fontStyle: "italic" }}>rescue chain.</em>
          </h2>
        </div>
      </Reveal>
      <div className="rq-partner-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, marginTop: 48 }}>
        {partners.map((p, i) => (
          <Reveal key={i} delay={i * .1}>
            <motion.div whileHover={{ y: -5 }}
              style={{ background: T.card, borderRadius: 20, padding: 32, border: `1px solid ${T.border}`, display: "flex", flexDirection: "column", height: "100%", transition: "background .4s, border-color .4s" }}>
              <div style={{ fontSize: 32, marginBottom: 14 }}>{p.emoji}</div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700, color: T.ink, marginBottom: 10, transition: "color .4s" }}>{p.title}</h3>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, color: T.muted, lineHeight: 1.72, flex: 1, marginBottom: 20, transition: "color .4s" }}>{p.desc}</p>
              <motion.div whileHover={{ x: 4 }} style={{ fontSize: 13, fontWeight: 500, color: p.color, cursor: "pointer" }}>{p.cta}</motion.div>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* ═══════════════════════════════ FOOTER ═══════════════════════════════ */
const Footer = ({ T }) => (
  <footer style={{ background: T.heroBg, padding: "34px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, transition: "background .4s" }}>
    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 21, fontWeight: 700, color: "#fff" }}>
      ResQ<em style={{ color: T.amber, fontStyle: "italic" }}>Plate</em>
    </div>
    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11.5, color: "rgba(255,255,255,.4)" }}>© 2026 ResQPlate · Built for Social Good</div>
    <div style={{ display: "flex", alignItems: "center", gap: 7, fontFamily: "'DM Mono', monospace", fontSize: 11, color: T.mint, transition: "color .4s" }}>
      <motion.span animate={{ opacity: [1, .38, 1] }} transition={{ duration: 1.8, repeat: Infinity }}
        style={{ width: 6, height: 6, borderRadius: "50%", background: T.sage, display: "inline-block" }} />
      Carbon-neutral operations
    </div>
  </footer>
);

/* ═══════════════════════════════ ROOT ═══════════════════════════════ */
const Contact = () => {
  const [dark, setDark] = useState(false);
  const T = dark ? DARK : LIGHT;

  return (
    <>
      <FontLoader />
      <GlobalStyles dark={dark} />
      <Grain />
      <div style={{ background: T.bg, transition: "background .4s" }}>
        <ThemeToggle dark={dark} onToggle={() => setDark(d => !d)} T={T} />
        <Hero T={T} />
        <InfoCards T={T} />
        <FormSection T={T} />
        <Partners T={T} />
        <Footer T={T} />
      </div>
    </>
  );
};

export default Contact;