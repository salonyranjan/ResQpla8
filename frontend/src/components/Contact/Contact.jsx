import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion, useInView, AnimatePresence, useScroll, useTransform } from "framer-motion";
import emailjs from "@emailjs/browser";

/* ═══════════════════════════════════════════════════════════
   FONTS
═══════════════════════════════════════════════════════════ */
const FontLoader = () => {
  useEffect(() => {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href =
      "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Instrument+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&family=DM+Mono:wght@400;500&display=swap";
    document.head.appendChild(l);
  }, []);
  return null;
};

/* ═══════════════════════════════════════════════════════════
   THEME TOKENS
═══════════════════════════════════════════════════════════ */
const DARK = {
  bg:          "#080e09",
  bg2:         "#0d160e",
  bg3:         "#111a12",
  bgCard:      "#0f1a10",
  bgCard2:     "#131f14",
  bgGlass:     "rgba(15,26,16,0.72)",
  border:      "rgba(52,84,56,0.45)",
  borderMed:   "rgba(65,105,72,0.6)",
  borderHi:    "rgba(85,140,95,0.8)",
  ink:         "#e8ede0",
  inkMuted:    "#8aab8e",
  inkHint:     "#4a6550",
  leaf:        "#2d6a4f",
  leafBright:  "#3d8a67",
  sage:        "#52a878",
  mint:        "#7dcfa0",
  mintSoft:    "rgba(125,207,160,0.12)",
  terra:       "#c8603a",
  amber:       "#d4953c",
  amberSoft:   "rgba(212,149,60,0.15)",
  accentGlow:  "rgba(45,106,79,0.22)",
  heroOverlay: "rgba(8,14,9,0.55)",
};

const LIGHT = {
  bg:          "#f3f0e8",
  bg2:         "#ebe7db",
  bg3:         "#e4dfd0",
  bgCard:      "#ffffff",
  bgCard2:     "#f7f4ed",
  bgGlass:     "rgba(255,255,255,0.82)",
  border:      "rgba(180,168,145,0.5)",
  borderMed:   "rgba(160,145,118,0.65)",
  borderHi:    "rgba(130,115,90,0.8)",
  ink:         "#1e1c18",
  inkMuted:    "#6a6055",
  inkHint:     "#a8a095",
  leaf:        "#1a5c40",
  leafBright:  "#267a56",
  sage:        "#4a9068",
  mint:        "#6dc090",
  mintSoft:    "rgba(26,92,64,0.08)",
  terra:       "#b85030",
  amber:       "#c08530",
  amberSoft:   "rgba(192,133,48,0.12)",
  accentGlow:  "rgba(26,92,64,0.18)",
  heroOverlay: "rgba(5,20,8,0.62)",
};

/* ═══════════════════════════════════════════════════════════
   GLOBAL STYLES
═══════════════════════════════════════════════════════════ */
const GlobalStyles = ({ dark }) => {
  const T = dark ? DARK : LIGHT;
  useEffect(() => {
    const id = "rq-global";
    const old = document.getElementById(id);
    if (old) old.remove();
    const s = document.createElement("style");
    s.id = id;
    s.textContent = `
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html { scroll-behavior: smooth; }
      body {
        background: ${T.bg};
        font-family: 'Instrument Sans', sans-serif;
        transition: background 0.5s;
        -webkit-font-smoothing: antialiased;
      }
      a { text-decoration: none; color: inherit; }
      button { font-family: 'Instrument Sans', sans-serif; }

      .rq-input {
        font-family: 'Instrument Sans', sans-serif;
        font-size: 14px;
        width: 100%;
        background: ${T.bg2};
        border: 1px solid ${T.border};
        border-radius: 10px;
        padding: 13px 16px;
        color: ${T.ink};
        outline: none;
        -webkit-appearance: none;
        appearance: none;
        transition: border-color 0.25s, box-shadow 0.25s, background 0.4s, color 0.4s;
      }
      .rq-input::placeholder { color: ${T.inkHint}; }
      .rq-input:focus {
        border-color: ${T.sage};
        box-shadow: 0 0 0 3px ${T.accentGlow};
        background: ${T.bgCard2};
      }
      textarea.rq-input { resize: none; }

      @keyframes grain {
        0%,100%{transform:translate(0,0)}
        20%{transform:translate(-2%,-3%)}
        40%{transform:translate(3%,1%)}
        60%{transform:translate(-1%,3%)}
        80%{transform:translate(-3%,-1%)}
      }
      @keyframes floatY {
        0%,100%{transform:translateY(0px)}
        50%{transform:translateY(-12px)}
      }
      @keyframes blink {
        0%,100%{opacity:1} 50%{opacity:0.3}
      }
      @keyframes spinRing {
        from{transform:rotate(0deg)} to{transform:rotate(360deg)}
      }
      @keyframes drawLine {
        from{stroke-dashoffset:400} to{stroke-dashoffset:0}
      }
      @keyframes pulse {
        0%,100%{box-shadow:0 0 0 0 ${T.sage}55}
        50%{box-shadow:0 0 0 8px ${T.sage}00}
      }

      .rq-grid-4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; }
      .rq-grid-3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; }
      .rq-grid-2 { display: grid; grid-template-columns: 1.15fr 0.85fr; gap: 36px; }
      .rq-grid-2-eq { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

      @media(max-width:960px){
        .rq-grid-4{grid-template-columns:repeat(2,1fr)!important}
        .rq-grid-3{grid-template-columns:repeat(2,1fr)!important}
        .rq-grid-2{grid-template-columns:1fr!important}
        .rq-hero-float{display:none!important}
      }
      @media(max-width:600px){
        .rq-grid-4,.rq-grid-3,.rq-grid-2-eq{grid-template-columns:1fr!important}
        .rq-hero-h1{font-size:46px!important}
        .rq-section-pad{padding-left:20px!important;padding-right:20px!important}
      }
    `;
    document.head.appendChild(s);
    return () => { const el = document.getElementById(id); if (el) el.remove(); };
  }, [dark]);
  return null;
};

/* ═══════════════════════════════════════════════════════════
   PRIMITIVES
═══════════════════════════════════════════════════════════ */
const Grain = () => (
  <div style={{
    position: "fixed", inset: 0, zIndex: 9999, pointerEvents: "none", opacity: 0.032,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
    backgroundSize: "200px 200px",
    animation: "grain 3s steps(1) infinite",
  }} />
);

const Reveal = ({ children, delay = 0, y = 32, once = true }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin: "-60px" });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};

const Label = ({ children, T }) => (
  <div style={{
    display: "inline-flex", alignItems: "center", gap: 10,
    fontFamily: "'DM Mono', monospace", fontSize: 10,
    letterSpacing: "0.2em", textTransform: "uppercase", color: T.sage,
    marginBottom: 14,
  }}>
    <span style={{ width: 20, height: 1, background: `linear-gradient(90deg,transparent,${T.sage})`, display: "inline-block" }} />
    {children}
    <span style={{ width: 20, height: 1, background: `linear-gradient(90deg,${T.sage},transparent)`, display: "inline-block" }} />
  </div>
);

/* ═══════════════════════════════════════════════════════════
   LOGO (kept for Footer)
═══════════════════════════════════════════════════════════ */
const Logo = ({ T, size = 36 }) => (
  <div style={{
    width: size, height: size, borderRadius: Math.round(size * 0.28),
    background: `linear-gradient(135deg, ${T.leaf} 0%, ${T.leafBright} 100%)`,
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0, boxShadow: `0 6px 20px ${T.leaf}55`,
  }}>
    <svg width={size * 0.56} height={size * 0.56} viewBox="0 0 24 24" fill="none">
      <ellipse cx="12" cy="14.5" rx="7.5" ry="3.2" stroke="#95d5b2" strokeWidth="1.3" />
      <path d="M12 14 C12 10.5 9.2 7.5 9.2 7.5 C10.7 7.5 13.8 9 13.8 12" fill="#52b788" opacity="0.95" />
      <path d="M12 14 C12 10.5 14.8 8 14.8 8 C13.3 8 11 9.5 11 12.5" fill="#95d5b2" opacity="0.88" />
      <line x1="12" y1="14.2" x2="12" y2="7.5" stroke="#52b788" strokeWidth="1" strokeLinecap="round" />
    </svg>
  </div>
);

/* ═══════════════════════════════════════════════════════════
   NAVBAR — logo & name removed, toggle only
═══════════════════════════════════════════════════════════ */
const Navbar = ({ dark, onToggle, T }) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "sticky", top: 0, zIndex: 200,
        padding: "0 40px",
        height: 62,
        display: "flex", alignItems: "center", justifyContent: "flex-end",
        background: scrolled
          ? dark ? "rgba(8,14,9,0.88)" : "rgba(243,240,232,0.88)"
          : "transparent",
        backdropFilter: scrolled ? "blur(18px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(18px)" : "none",
        borderBottom: scrolled ? `1px solid ${T.border}` : "1px solid transparent",
        transition: "background 0.4s, border-color 0.4s",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <span style={{
          fontFamily: "'DM Mono', monospace", fontSize: 9.5,
          letterSpacing: "0.14em", color: T.inkHint, textTransform: "uppercase",
        }}>
          {dark ? "Dark" : "Light"}
        </span>

        {/* Toggle */}
        <motion.button
          onClick={onToggle}
          aria-label="Toggle theme"
          style={{
            width: 50, height: 27, borderRadius: 100, border: `1px solid ${T.borderMed}`,
            background: dark ? T.bgCard2 : T.bg3,
            position: "relative", cursor: "pointer",
            display: "flex", alignItems: "center",
            transition: "background 0.35s, border-color 0.35s",
          }}
        >
          <motion.div
            animate={{ x: dark ? 24 : 2 }}
            transition={{ type: "spring", stiffness: 500, damping: 32 }}
            style={{
              width: 21, height: 21, borderRadius: "50%",
              background: dark
                ? `linear-gradient(135deg, ${T.sage}, ${T.mint})`
                : `linear-gradient(135deg, ${T.amber}, ${T.terra})`,
              boxShadow: dark ? `0 2px 8px ${T.sage}66` : `0 2px 8px ${T.amber}66`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            {dark ? (
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="2.6" fill="#080e09" />
                {[0,60,120,180,240,300].map(a => (
                  <line key={a}
                    x1={6 + 3.8*Math.cos(a*Math.PI/180)} y1={6 + 3.8*Math.sin(a*Math.PI/180)}
                    x2={6 + 5.2*Math.cos(a*Math.PI/180)} y2={6 + 5.2*Math.sin(a*Math.PI/180)}
                    stroke="#080e09" strokeWidth="1.2" strokeLinecap="round"
                  />
                ))}
              </svg>
            ) : (
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                <path d="M9.5 6.8A4 4 0 015.2 2.5 4 4 0 109.5 6.8z" fill="#f3f0e8" />
              </svg>
            )}
          </motion.div>
        </motion.button>
      </div>
    </motion.nav>
  );
};

/* ═══════════════════════════════════════════════════════════
   HERO
═══════════════════════════════════════════════════════════ */
const Hero = ({ T, dark }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} style={{
      position: "relative", minHeight: "88vh",
      display: "flex", alignItems: "center",
      background: dark
        ? `radial-gradient(ellipse at 30% 60%, rgba(29,76,50,0.35) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(45,106,79,0.18) 0%, transparent 50%), ${T.bg}`
        : `radial-gradient(ellipse at 30% 60%, rgba(26,92,64,0.12) 0%, transparent 60%), ${T.bg}`,
      overflow: "hidden",
    }}>
      {/* Animated background grid */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: dark ? 0.055 : 0.04 }}
          viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
          {Array.from({ length: 14 }, (_, i) => (
            <line key={`v${i}`} x1={i * 110} y1={0} x2={i * 110} y2={900} stroke={T.sage} strokeWidth="0.6" />
          ))}
          {Array.from({ length: 10 }, (_, i) => (
            <line key={`h${i}`} x1={0} y1={i * 100} x2={1440} y2={i * 100} stroke={T.sage} strokeWidth="0.6" />
          ))}
        </svg>

        {/* Decorative large circle */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
          style={{
            position: "absolute", right: "8%", top: "50%", transform: "translateY(-50%)",
            width: 560, height: 560, borderRadius: "50%",
            border: `1px dashed ${T.border}`, opacity: 0.6,
          }}
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          style={{
            position: "absolute", right: "calc(8% + 60px)", top: "50%", transform: "translateY(-50%)",
            width: 440, height: 440, borderRadius: "50%",
            border: `1px solid ${T.border}`, opacity: 0.4,
          }}
        />

        {/* Botanical leaf decorations */}
        <svg viewBox="0 0 120 200" fill="none" style={{ position: "absolute", left: -20, bottom: 40, width: 180, opacity: dark ? 0.15 : 0.1, pointerEvents: "none" }}>
          <path d="M60 190 C20 155 0 100 15 52 C28 12 60 6 88 40 C116 74 112 148 60 190Z" fill={T.sage} />
          <path d="M60 190 L60 60" stroke={T.leaf} strokeWidth="1.2" opacity="0.7" />
          <path d="M60 130 C40 115 30 90 38 70" stroke={T.leaf} strokeWidth="0.8" opacity="0.5" />
          <path d="M60 150 C80 132 85 108 78 88" stroke={T.leaf} strokeWidth="0.8" opacity="0.5" />
        </svg>
        <svg viewBox="0 0 80 140" fill="none" style={{ position: "absolute", right: 30, bottom: 0, width: 110, opacity: dark ? 0.12 : 0.08, transform: "rotate(175deg)", pointerEvents: "none" }}>
          <path d="M40 130 C10 105 0 70 10 38 C18 10 40 4 58 28 C76 52 74 102 40 130Z" fill={T.sage} />
          <path d="M40 130 L40 40" stroke={T.leaf} strokeWidth="1" opacity="0.6" />
        </svg>
      </div>

      <motion.div style={{ y, opacity }} className="rq-section-pad">
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 48px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 40 }}>

          {/* Left: text */}
          <div style={{ maxWidth: 580, flex: "0 0 auto" }}>
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              style={{
                display: "inline-flex", alignItems: "center", gap: 9, marginBottom: 28,
                background: T.mintSoft, border: `1px solid ${T.border}`,
                borderRadius: 100, padding: "6px 16px 6px 12px",
              }}
            >
              <motion.div
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                style={{ width: 7, height: 7, borderRadius: "50%", background: T.sage, flexShrink: 0 }}
              />
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10.5, letterSpacing: "0.15em", textTransform: "uppercase", color: T.mint }}>
                Get in Touch · ResQPlate
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              className="rq-hero-h1"
              initial={{ opacity: 0, y: 48 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(52px, 7.5vw, 88px)",
                fontWeight: 900, lineHeight: 0.94,
                color: T.ink, letterSpacing: "-0.03em",
                marginBottom: 24,
              }}
            >
              Let&apos;s{" "}
              <em style={{
                color: T.amber, fontStyle: "italic",
                backgroundImage: `linear-gradient(90deg, ${T.amber}, ${T.terra})`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>rescue</em>
              <br />food, together.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              style={{ fontSize: 16, fontWeight: 300, color: T.inkMuted, lineHeight: 1.8, maxWidth: 420, marginBottom: 40 }}
            >
              Whether you&apos;re a restaurant with surplus, an NGO serving families,
              or a volunteer ready to ride — this is where the change begins.
            </motion.p>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.72, duration: 0.7 }}
              style={{ display: "flex", gap: 24, flexWrap: "wrap" }}
            >
              {["Govt. of India Backed", "ISO 9001:2015", "2,400+ Lives Impacted"].map((t, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <div style={{
                    width: 17, height: 17, borderRadius: "50%",
                    border: `1.5px solid ${T.sage}`, display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5.2l2 1.8 4-4" stroke={T.sage} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span style={{ fontSize: 12, color: T.inkHint, fontFamily: "'DM Mono', monospace", letterSpacing: "0.04em" }}>{t}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: floating notification card */}
          <motion.div
            className="rq-hero-float"
            initial={{ opacity: 0, x: 60, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: 0.8, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            style={{ flexShrink: 0, position: "relative", animation: "floatY 7s ease-in-out infinite" }}
          >
            {/* Main donation card */}
            <div style={{
              width: 280, background: T.bgCard,
              borderRadius: 22, padding: 22,
              border: `1px solid ${T.border}`,
              boxShadow: dark ? `0 40px 90px rgba(0,0,0,0.55), 0 0 0 1px ${T.border}` : `0 30px 70px rgba(0,0,0,0.12)`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: T.mintSoft, border: `1px solid ${T.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0,
                }}>🍱</div>
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: T.ink }}>New Donation Posted</div>
                  <div style={{ fontSize: 10.5, color: T.inkMuted, fontFamily: "'DM Mono', monospace", marginTop: 2 }}>2 min ago · Connaught Place</div>
                </div>
              </div>
              <div style={{
                background: T.bg2, borderRadius: 10, padding: "10px 13px", marginBottom: 13,
                fontSize: 12.5, color: T.ink, lineHeight: 1.6,
                border: `1px solid ${T.border}`,
              }}>
                45 meals — Dal Makhani, Rice &amp; Sabzi
                <div style={{ fontSize: 11, color: T.inkMuted, marginTop: 3 }}>Expires in 3h · Pickup available</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button style={{
                  flex: 1, borderRadius: 9, padding: "8px 0",
                  fontSize: 12, fontWeight: 600, color: "#fff",
                  background: `linear-gradient(135deg, ${T.leaf}, ${T.leafBright})`,
                  border: "none", cursor: "pointer",
                  boxShadow: `0 4px 14px ${T.leaf}44`,
                }}>Accept</button>
                <button style={{
                  flex: 1, borderRadius: 9, padding: "8px 0",
                  fontSize: 12, color: T.inkMuted,
                  background: T.bg2, border: `1px solid ${T.border}`, cursor: "pointer",
                }}>Later</button>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 13, paddingTop: 13, borderTop: `1px solid ${T.border}` }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.sage, display: "inline-block", animation: "blink 1.8s ease-in-out infinite" }} />
                <span style={{ fontSize: 11, color: T.sage, fontFamily: "'DM Mono', monospace" }}>3 NGOs notified nearby</span>
              </div>
            </div>

            {/* Floating CO2 badge */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
              style={{
                position: "absolute", bottom: -26, left: -44,
                background: `linear-gradient(135deg, ${T.amber}, ${T.terra})`,
                borderRadius: 14, padding: "11px 16px",
                display: "flex", alignItems: "center", gap: 10,
                boxShadow: dark ? "0 16px 40px rgba(0,0,0,0.38)" : "0 12px 30px rgba(0,0,0,0.15)",
              }}
            >
              <span style={{ fontSize: 20 }}>🌱</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>500 kg CO₂ Saved</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", fontFamily: "'DM Mono', monospace", marginTop: 2 }}>This month alone</div>
              </div>
            </motion.div>

            {/* AI match badge */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              style={{
                position: "absolute", top: -22, right: -30,
                background: T.bgCard, border: `1px solid ${T.borderMed}`,
                borderRadius: 12, padding: "9px 14px",
                display: "flex", alignItems: "center", gap: 8,
                boxShadow: dark ? "0 10px 30px rgba(0,0,0,0.35)" : "0 8px 24px rgba(0,0,0,0.1)",
              }}
            >
              <div style={{ width: 24, height: 24, borderRadius: 7, background: T.mintSoft, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>⚡</div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: T.ink }}>AI Matched</div>
                <div style={{ fontSize: 9.5, color: T.inkMuted, fontFamily: "'DM Mono', monospace" }}>in 87 sec</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom wave */}
      <div style={{ position: "absolute", bottom: -2, left: 0, right: 0, lineHeight: 0 }}>
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: 80 }}>
          <path d="M0,80 C360,20 1080,20 1440,80 L1440,80 L0,80Z" fill={T.bg2} />
        </svg>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════
   INFO CARDS
═══════════════════════════════════════════════════════════ */
const INFO = [
  { icon: "✉️", title: "Email Us",   lines: ["support@resqplate.org", "logistics@resqplate.org"], accent: "#c8603a", action: { label: "Write to us", href: "mailto:support@resqplate.org" } },
  { icon: "📞", title: "Call Us",    lines: ["+91 98765 43210", "24/7 emergency line"],           accent: "#d4953c", action: null },
  { icon: "📍", title: "Our Hub",    lines: ["ResQPlate HQ", "Patna, Bihar — 800001"],            accent: "#3d8a67", action: { label: "View on map", to: "/map" } },
  { icon: "🕐", title: "Hours",      lines: ["Platform: Always on", "Support: 9 AM – 8 PM"],     accent: "#6ab882", action: null },
];

const InfoCards = ({ T }) => (
  <section style={{ background: T.bg2, padding: "0 48px 72px", transition: "background 0.4s" }}>
    <div className="rq-grid-4 rq-section-pad" style={{ maxWidth: 1100, margin: "0 auto", marginTop: -42 }}>
      {INFO.map((c, i) => (
        <Reveal key={i} delay={i * 0.08}>
          <motion.div
            whileHover={{ y: -5, boxShadow: dark => dark ? "0 24px 56px rgba(0,0,0,0.45)" : "0 18px 44px rgba(0,0,0,0.1)" }}
            style={{
              background: T.bgCard, borderRadius: 20,
              border: `1px solid ${T.border}`,
              padding: "28px 24px 24px",
              position: "relative", overflow: "hidden",
              cursor: "default",
              transition: "background 0.4s, border-color 0.4s",
            }}
          >
            {/* Top accent stripe */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: c.accent, borderRadius: "20px 20px 0 0" }} />

            {/* Icon circle */}
            <div style={{
              width: 44, height: 44, borderRadius: 13,
              background: `${c.accent}18`, border: `1px solid ${c.accent}30`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, marginBottom: 16,
            }}>{c.icon}</div>

            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, color: T.ink, marginBottom: 8 }}>{c.title}</h3>
            {c.lines.map((l, j) => (
              <div key={j} style={{ fontSize: 12.5, color: T.inkMuted, lineHeight: 1.65 }}>{l}</div>
            ))}

            {c.action && (
              <div style={{ marginTop: 16 }}>
                {c.action.href ? (
                  <a href={c.action.href} style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    fontSize: 11.5, fontWeight: 500, color: c.accent,
                    fontFamily: "'DM Mono', monospace", letterSpacing: "0.05em",
                    padding: "7px 13px", borderRadius: 8,
                    background: `${c.accent}12`, border: `1px solid ${c.accent}25`,
                    transition: "background 0.2s, color 0.2s",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = c.accent; e.currentTarget.style.color = "#fff"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = `${c.accent}12`; e.currentTarget.style.color = c.accent; }}
                  >
                    {c.action.label} →
                  </a>
                ) : (
                  <Link to={c.action.to} style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    fontSize: 11.5, fontWeight: 500, color: c.accent,
                    fontFamily: "'DM Mono', monospace", letterSpacing: "0.05em",
                    padding: "7px 13px", borderRadius: 8,
                    background: `${c.accent}12`, border: `1px solid ${c.accent}25`,
                    transition: "background 0.2s, color 0.2s",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = c.accent; e.currentTarget.style.color = "#fff"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = `${c.accent}12`; e.currentTarget.style.color = c.accent; }}
                  >
                    {c.action.label} →
                  </Link>
                )}
              </div>
            )}
          </motion.div>
        </Reveal>
      ))}
    </div>
  </section>
);

/* ═══════════════════════════════════════════════════════════
   FORM + SIDEBAR
═══════════════════════════════════════════════════════════ */
const FAQS = [
  {
    q: "How fast are NGOs matched to donations?",
    a: "Our AI typically finds the best-fit NGO within 90 seconds — factoring distance, capacity, and food type simultaneously.",
    link: { to: "/dashboard/ai-matching", label: "Try AI Matching" },
  },
  {
    q: "How is food safety maintained in transit?",
    a: "Volunteers use insulated carriers. Missed pickup windows auto-reassign to the next nearest verified volunteer.",
    link: null,
  },
  {
    q: "Can NGOs specify the food they need?",
    a: "Yes. NGOs manage a live preference dashboard so they only receive food matching their current needs and storage capacity.",
    link: null,
  },
  {
    q: "Do donors receive proof of impact?",
    a: "Every donor gets a digital certificate showing meals rescued, CO₂ saved, and estimated families reached.",
    link: { to: "/dashboard/impact-delivered", label: "View Impact Dashboard" },
  },
];

const FormSection = ({ T }) => {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", role: "Restaurant / Donor", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [focused, setFocused] = useState(null);

  useEffect(() => {
    if (user) setForm(p => ({ ...p, name: user.name || "", email: user.email || "" }));
  }, [user]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_CONTACT_TEMPLATE_ID,
        { from_name: form.name, from_email: form.email, user_role: form.role, message: form.message },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );
      setSent(true);
      setTimeout(() => {
        setSent(false);
        setForm({ name: "", email: "", role: "Restaurant / Donor", message: "" });
      }, 3500);
    } catch (err) {
      console.error("EmailJS:", err);
      alert("Message failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (name) => ({
    fontFamily: "'Instrument Sans', sans-serif",
    fontSize: 14, width: "100%",
    background: focused === name ? T.bgCard2 : T.bg2,
    border: `1px solid ${focused === name ? T.sage : T.border}`,
    borderRadius: 10, padding: "13px 16px", color: T.ink, outline: "none",
    WebkitAppearance: "none", appearance: "none",
    boxShadow: focused === name ? `0 0 0 3px ${T.accentGlow}` : "none",
    transition: "all 0.25s",
  });

  return (
    <section style={{ background: T.bg, padding: "80px 48px 100px", position: "relative", overflow: "hidden" }}>
      {/* Decorative elements */}
      <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle, ${T.accentGlow} 0%, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -60, left: -60, width: 300, height: 300, borderRadius: "50%", background: `radial-gradient(circle, ${T.amberSoft} 0%, transparent 70%)`, pointerEvents: "none" }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <Label T={T}>Write to Us</Label>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(32px, 5vw, 54px)", fontWeight: 700,
              color: T.ink, lineHeight: 1.05,
            }}>
              Start the{" "}
              <em style={{ fontStyle: "italic", color: T.terra }}>conversation.</em>
            </h2>
          </div>
        </Reveal>

        <div className="rq-grid-2">
          {/* ── FORM CARD ── */}
          <Reveal>
            <div style={{
              background: T.bgCard, borderRadius: 24,
              border: `1px solid ${T.border}`,
              overflow: "hidden", position: "relative",
              boxShadow: `0 2px 0 0 ${T.terra}`,
            }}>
              {/* Gradient header bar */}
              <div style={{ height: 3, background: `linear-gradient(90deg, ${T.terra}, ${T.amber}, ${T.sage})` }} />

              <div style={{ padding: "36px 36px 40px" }}>
                <AnimatePresence mode="wait">
                  {sent ? (
                    <motion.div key="sent"
                      initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                      style={{ textAlign: "center", padding: "52px 0" }}
                    >
                      <motion.div
                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        style={{
                          width: 72, height: 72, borderRadius: "50%",
                          background: `linear-gradient(135deg, ${T.leaf}, ${T.sage})`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 32, margin: "0 auto 20px",
                          boxShadow: `0 12px 40px ${T.leaf}44`,
                        }}
                      >🌿</motion.div>
                      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: T.sage, marginBottom: 10 }}>Message Received</h3>
                      <p style={{ fontSize: 14, color: T.inkMuted, lineHeight: 1.75 }}>
                        We&apos;ll get back within 24 hours.<br />Thank you for reaching out!
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <div style={{ marginBottom: 28 }}>
                        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: T.ink, marginBottom: 5 }}>Send a Message</h3>
                        <p style={{ fontSize: 13, color: T.inkMuted }}>For partnerships, logistics, or just a hello.</p>
                      </div>

                      <form onSubmit={handleSubmit}>
                        {/* Name + Email */}
                        <div className="rq-grid-2-eq" style={{ marginBottom: 14 }}>
                          <div>
                            <label style={{ display: "block", fontSize: 10.5, fontWeight: 500, color: T.inkMuted, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 7, fontFamily: "'DM Mono', monospace" }}>
                              Your Name
                            </label>
                            <input
                              className="rq-input" name="name" value={form.name} onChange={handleChange}
                              placeholder="Priya Sharma" required
                              style={inputStyle("name")}
                              onFocus={() => setFocused("name")} onBlur={() => setFocused(null)}
                            />
                          </div>
                          <div>
                            <label style={{ display: "block", fontSize: 10.5, fontWeight: 500, color: T.inkMuted, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 7, fontFamily: "'DM Mono', monospace" }}>
                              Email Address
                            </label>
                            <input
                              className="rq-input" type="email" name="email" value={form.email} onChange={handleChange}
                              placeholder="priya@restaurant.com" required
                              style={inputStyle("email")}
                              onFocus={() => setFocused("email")} onBlur={() => setFocused(null)}
                            />
                          </div>
                        </div>

                        {/* Role select */}
                        <div style={{ marginBottom: 14 }}>
                          <label style={{ display: "block", fontSize: 10.5, fontWeight: 500, color: T.inkMuted, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 7, fontFamily: "'DM Mono', monospace" }}>
                            I am a…
                          </label>
                          <div style={{ position: "relative" }}>
                            <select
                              name="role" value={form.role} onChange={handleChange}
                              style={inputStyle("role")}
                              onFocus={() => setFocused("role")} onBlur={() => setFocused(null)}
                            >
                              <option>Restaurant / Donor</option>
                              <option>NGO / Shelter</option>
                              <option>Volunteer / Driver</option>
                              <option>Corporate Partner</option>
                              <option>Media / Press</option>
                            </select>
                            <svg style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} width="12" height="12" viewBox="0 0 12 12" fill="none">
                              <path d="M2.5 4.5l3.5 3.5 3.5-3.5" stroke={T.inkMuted} strokeWidth="1.4" strokeLinecap="round" />
                            </svg>
                          </div>
                        </div>

                        {/* Message */}
                        <div style={{ marginBottom: 28 }}>
                          <label style={{ display: "block", fontSize: 10.5, fontWeight: 500, color: T.inkMuted, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 7, fontFamily: "'DM Mono', monospace" }}>
                            Message
                          </label>
                          <textarea
                            name="message" rows={5} value={form.message} onChange={handleChange}
                            placeholder="Tell us about your situation, your needs, or your ideas…"
                            required
                            style={inputStyle("message")}
                            onFocus={() => setFocused("message")} onBlur={() => setFocused(null)}
                          />
                        </div>

                        {/* Submit */}
                        <motion.button
                          type="submit" disabled={loading}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          style={{
                            width: "100%", padding: "15px 0", borderRadius: 12, border: "none",
                            background: loading
                              ? T.sage
                              : `linear-gradient(135deg, ${T.leaf} 0%, ${T.leafBright} 100%)`,
                            color: "#fff", fontSize: 14.5, fontWeight: 600,
                            cursor: loading ? "not-allowed" : "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                            boxShadow: `0 8px 28px ${T.leaf}44`,
                            transition: "background 0.3s, box-shadow 0.3s",
                            letterSpacing: "0.02em",
                          }}
                        >
                          {loading ? (
                            <>
                              <motion.span
                                animate={{ rotate: 360 }}
                                transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                                style={{ width: 17, height: 17, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", flexShrink: 0 }}
                              />
                              Sending…
                            </>
                          ) : (
                            <>
                              Send Message
                              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                                <path d="M2 7.5h11M8.5 3l4.5 4.5L8.5 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </>
                          )}
                        </motion.button>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </Reveal>

          {/* ── SIDEBAR ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Map card */}
            <Reveal delay={0.1}>
              <div style={{ background: T.bgCard, borderRadius: 20, overflow: "hidden", border: `1px solid ${T.border}` }}>
                {/* Map visual */}
                <div style={{
                  height: 155, position: "relative", overflow: "hidden",
                  background: `radial-gradient(ellipse at 50% 100%, ${T.leaf}28 0%, transparent 60%), ${T.bg3}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.12 }} viewBox="0 0 380 155" preserveAspectRatio="none">
                    {[31, 62, 93, 124].map(y => <line key={y} x1="0" y1={y} x2="380" y2={y} stroke={T.sage} strokeWidth="0.7" />)}
                    {[76, 152, 228, 304].map(x => <line key={x} x1={x} y1="0" x2={x} y2="155" stroke={T.sage} strokeWidth="0.7" />)}
                  </svg>
                  {/* Pulse dot */}
                  <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
                    <motion.div
                      animate={{ scale: [1, 2.8, 1], opacity: [0.4, 0, 0.4] }}
                      transition={{ duration: 2.4, repeat: Infinity }}
                      style={{ position: "absolute", width: 52, height: 52, borderRadius: "50%", background: T.amber, top: 0, left: "50%", transform: "translateX(-50%)" }}
                    />
                    <div style={{
                      width: 50, height: 50, borderRadius: "50%",
                      background: `linear-gradient(135deg, ${T.amber}, ${T.terra})`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 22, margin: "0 auto 10px", position: "relative", zIndex: 1,
                      boxShadow: `0 0 0 8px ${T.amber}22`,
                      animation: "pulse 2.4s ease-in-out infinite",
                    }}>📍</div>
                    <div style={{ fontSize: 11, color: T.inkMuted, fontFamily: "'DM Mono', monospace", letterSpacing: "0.08em" }}>PATNA, BIHAR</div>
                  </div>
                  {[{ label: "Delhi", s: { top: "18%", left: "8%" } }, { label: "Mumbai", s: { bottom: "14%", left: "6%" } }, { label: "Kolkata", s: { top: "18%", right: "7%" } }].map((c, i) => (
                    <div key={i} style={{
                      position: "absolute", background: T.bgGlass,
                      backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)",
                      border: `1px solid ${T.border}`,
                      borderRadius: 100, padding: "3px 10px",
                      fontSize: 10, color: T.inkMuted,
                      fontFamily: "'DM Mono', monospace", ...c.s,
                    }}>{c.label}</div>
                  ))}
                </div>
                <div style={{ padding: "18px 22px 20px" }}>
                  <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: T.ink, marginBottom: 4 }}>Central Operations Hub</h4>
                  <p style={{ fontSize: 13, color: T.inkMuted }}>Boring Road, Patna, Bihar 800001</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 10 }}>
                    <motion.span
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1.8, repeat: Infinity }}
                      style={{ width: 7, height: 7, borderRadius: "50%", background: T.sage, display: "inline-block", flexShrink: 0 }}
                    />
                    <span style={{ fontSize: 11, color: T.sage, fontFamily: "'DM Mono', monospace" }}>All systems operational</span>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* FAQ accordion */}
            <Reveal delay={0.15}>
              <div style={{ background: T.bgCard, borderRadius: 20, overflow: "hidden", border: `1px solid ${T.border}` }}>
                <div style={{
                  padding: "20px 24px 18px",
                  borderBottom: `1px solid ${T.border}`,
                  display: "flex", alignItems: "center", gap: 10,
                }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: T.mintSoft, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>❓</div>
                  <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: T.ink }}>Common Questions</h4>
                </div>
                {FAQS.map((faq, i) => (
                  <div key={i} style={{ borderBottom: i < FAQS.length - 1 ? `1px solid ${T.border}` : "none" }}>
                    <button
                      onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                      style={{
                        width: "100%", padding: "15px 22px",
                        display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12,
                        background: activeFaq === i ? T.mintSoft : "transparent",
                        border: "none", cursor: "pointer", textAlign: "left",
                        transition: "background 0.25s",
                      }}
                    >
                      <span style={{ fontSize: 13, fontWeight: 500, color: activeFaq === i ? T.sage : T.ink, lineHeight: 1.5, flex: 1, transition: "color 0.25s" }}>
                        {faq.q}
                      </span>
                      <motion.div
                        animate={{ rotate: activeFaq === i ? 45 : 0 }}
                        transition={{ duration: 0.22 }}
                        style={{
                          width: 20, height: 20, borderRadius: "50%",
                          border: `1.5px solid ${activeFaq === i ? T.sage : T.border}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 14, color: activeFaq === i ? T.sage : T.inkMuted,
                          flexShrink: 0, marginTop: 1,
                          transition: "border-color 0.22s, color 0.22s",
                        }}
                      >+</motion.div>
                    </button>
                    <AnimatePresence initial={false}>
                      {activeFaq === i && (
                        <motion.div
                          key="ans"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                          style={{ overflow: "hidden" }}
                        >
                          <p style={{ padding: "2px 22px 16px", fontSize: 13, color: T.inkMuted, lineHeight: 1.75, margin: 0 }}>
                            {faq.a}
                            {faq.link && (
                              <> <Link to={faq.link.to} style={{ color: T.sage, fontWeight: 600, textDecoration: "underline", textUnderlineOffset: 3, textDecorationColor: `${T.sage}66` }}>{faq.link.label}</Link></>
                            )}
                          </p>
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

/* ═══════════════════════════════════════════════════════════
   PARTNERS SECTION
═══════════════════════════════════════════════════════════ */
const PARTNERS = [
  {
    emoji: "🍽️", title: "Restaurants & Caterers",
    desc: "Post surplus in 60 seconds. We handle matching, pickup, and your digital impact certificate.",
    cta: "Join as Donor", color: "#c8603a", link: "/register?role=donor",
    stat: "1,200+ restaurants",
  },
  {
    emoji: "🤲", title: "NGOs & Shelters",
    desc: "Register your needs and receive matched food donations with zero coordination overhead.",
    cta: "Register NGO", color: "#3d8a67", link: "/register?role=ngo",
    stat: "340+ NGOs served",
  },
  {
    emoji: "🚴", title: "Volunteers & Drivers",
    desc: "Join the fleet. Get pickup requests near you, track live deliveries, earn ResQPoints.",
    cta: "Volunteer Now", color: "#d4953c", link: "/register?role=volunteer",
    stat: "860+ active riders",
  },
];

const Partners = ({ T }) => (
  <section style={{ background: T.bg2, padding: "80px 48px 100px", position: "relative", overflow: "hidden" }}>
    <svg viewBox="0 0 120 200" fill="none" style={{ position: "absolute", right: -20, top: 40, width: 140, opacity: 0.08, pointerEvents: "none" }}>
      <path d="M60 190 C20 155 0 100 15 52 C28 12 60 6 88 40 C116 74 112 148 60 190Z" fill={T.sage} />
      <path d="M60 190 L60 60" stroke={T.leaf} strokeWidth="1.2" />
    </svg>

    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      <Reveal>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <Label T={T}>Who We Work With</Label>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(30px, 5vw, 52px)", fontWeight: 700, color: T.ink, lineHeight: 1.05 }}>
            Every role in the{" "}
            <em style={{ fontStyle: "italic", color: T.terra }}>rescue chain.</em>
          </h2>
        </div>
      </Reveal>

      <div className="rq-grid-3">
        {PARTNERS.map((p, i) => (
          <Reveal key={i} delay={i * 0.1}>
            <motion.div
              whileHover={{ y: -6 }}
              style={{
                background: T.bgCard, borderRadius: 22,
                border: `1px solid ${T.border}`,
                padding: "32px 28px 28px",
                display: "flex", flexDirection: "column", height: "100%",
                position: "relative", overflow: "hidden",
                transition: "background 0.4s, border-color 0.4s",
              }}
            >
              {/* Corner accent */}
              <div style={{
                position: "absolute", top: 0, right: 0,
                width: 70, height: 70,
                background: `radial-gradient(circle at 100% 0%, ${p.color}18 0%, transparent 70%)`,
              }} />

              <div style={{ fontSize: 36, marginBottom: 18 }}>{p.emoji}</div>

              {/* Stat pill */}
              <div style={{
                display: "inline-flex", alignItems: "center",
                background: `${p.color}14`, border: `1px solid ${p.color}28`,
                borderRadius: 100, padding: "3px 11px", marginBottom: 14,
                fontSize: 10.5, color: p.color, fontFamily: "'DM Mono', monospace",
                letterSpacing: "0.05em", alignSelf: "flex-start",
              }}>{p.stat}</div>

              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: T.ink, marginBottom: 10 }}>{p.title}</h3>
              <p style={{ fontSize: 13.5, color: T.inkMuted, lineHeight: 1.75, flex: 1, marginBottom: 22 }}>{p.desc}</p>

              <Link to={p.link}>
                <motion.div
                  whileHover={{ x: 4 }}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 7,
                    fontSize: 13, fontWeight: 600, color: p.color,
                  }}
                >
                  {p.cta}
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path d="M2 6.5h9M7 2.5l4 4-4 4" stroke={p.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.div>
              </Link>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* ═══════════════════════════════════════════════════════════
   FOOTER
═══════════════════════════════════════════════════════════ */
const Footer = ({ T }) => (
  <footer style={{
    background: T.bg,
    borderTop: `1px solid ${T.border}`,
    padding: "28px 48px",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    flexWrap: "wrap", gap: 14,
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
      <Logo T={T} size={30} />
      <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 19, fontWeight: 700, color: T.ink }}>
        ResQ<em style={{ color: T.amber, fontStyle: "italic" }}>Plate</em>
      </span>
    </div>
    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11.5, color: T.inkHint }}>
      © 2026 ResQPlate · Built for Social Good
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <motion.span
        animate={{ opacity: [1, 0.35, 1] }}
        transition={{ duration: 1.8, repeat: Infinity }}
        style={{ width: 7, height: 7, borderRadius: "50%", background: T.sage, display: "inline-block" }}
      />
      <span style={{ fontSize: 11.5, color: T.inkMuted, fontFamily: "'DM Mono', monospace" }}>Carbon-neutral operations</span>
    </div>
  </footer>
);

/* ═══════════════════════════════════════════════════════════
   ROOT
═══════════════════════════════════════════════════════════ */
export default function Contact() {
  const [dark, setDark] = useState(true);
  const T = dark ? DARK : LIGHT;

  return (
    <>
      <FontLoader />
      <GlobalStyles dark={dark} />
      <Grain />
      <div style={{ background: T.bg, transition: "background 0.5s", minHeight: "100vh" }}>
        <Navbar dark={dark} onToggle={() => setDark(d => !d)} T={T} />
        <Hero T={T} dark={dark} />
        <InfoCards T={T} />
        <FormSection T={T} />
        <Partners T={T} />
        <Footer T={T} />
      </div>
    </>
  );
}
