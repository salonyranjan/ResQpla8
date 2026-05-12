import { Link, useNavigate } from "react-router-dom";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import emailjs from "@emailjs/browser";

/* ══════════════════════════════════════════════════
   FONT LOADER
══════════════════════════════════════════════════ */
const FontLoader = () => {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,700;0,9..144,900;1,9..144,700;1,9..144,900&family=Cabinet+Grotesk:wght@300;400;500;700;800&family=DM+Mono:wght@400;500&display=swap";
    document.head.appendChild(link);
  }, []);
  return null;
};

/* ══════════════════════════════════════════════════
   DARK MODE HOOK
══════════════════════════════════════════════════ */
const useDarkMode = () => {
  const [dark, setDark] = useState(true);
  const toggle = useCallback(() => setDark((d) => !d), []);
  return { dark, toggle };
};

/* ══════════════════════════════════════════════════
   PALETTE
══════════════════════════════════════════════════ */
const C = (dark) => ({
  leaf:       dark ? "#2d6a4f" : "#1a4a2e",
  leafm:      dark ? "#3d8a65" : "#2d6a4f",
  sage:       dark ? "#52b788" : "#52b788",
  mint:       dark ? "#95d5b2" : "#95d5b2",
  amber:      dark ? "#f59e0b" : "#e8a838",
  gold:       dark ? "#fbbf24" : "#f4c542",
  ember:      dark ? "#fb923c" : "#d4622a",
  bg:         dark ? "#070f09" : "#f7f2e8",
  bg2:        dark ? "#0c1710" : "#ede8db",
  bg3:        dark ? "#111d14" : "#e0d9cb",
  surface:    dark ? "#0f1a12" : "#ffffff",
  text:       dark ? "#e8f5ec" : "#111c15",
  text2:      dark ? "#6ee7b7" : "#4a5e52",
  text3:      dark ? "#3a6647" : "#8a9e90",
  border:     dark ? "rgba(82,183,136,0.10)"  : "rgba(26,74,46,0.09)",
  border2:    dark ? "rgba(82,183,136,0.22)"  : "rgba(26,74,46,0.18)",
  shadow:     dark ? "rgba(0,0,0,0.55)"       : "rgba(26,74,46,0.10)",
  cardShadow: dark ? "0 24px 70px rgba(0,0,0,0.55)" : "0 24px 70px rgba(26,74,46,0.12)",
  navBg:      dark ? "rgba(7,15,9,0.92)"      : "rgba(247,242,232,0.88)",
  ticker:     dark ? "#0a1a0d"                : "#1a3d26",
  heroBg:     dark
    ? "linear-gradient(150deg,#030b05 0%,#0b1f10 55%,#050f07 100%)"
    : "linear-gradient(150deg,#1a3d26 0%,#2d6a4f 55%,#1e5c3a 100%)",
});

/* ══════════════════════════════════════════════════
   GLOBAL STYLES
══════════════════════════════════════════════════ */
const GlobalStyles = ({ c }) => {
  useEffect(() => {
    const el = document.getElementById("rq-global");
    if (el) el.remove();
    const style = document.createElement("style");
    style.id = "rq-global";
    style.textContent = `
      *, *::before, *::after { box-sizing: border-box; }
      html { scroll-behavior: smooth; }
      body { margin: 0; background: ${c.bg}; transition: background 0.45s; }
      a { text-decoration: none; color: inherit; }
      button { cursor: pointer; font-family: 'Cabinet Grotesk', sans-serif; }

      .rq-hero-em {
        font-style: italic;
        background: linear-gradient(110deg, #e8a838, #f4c542, #e8a838);
        background-size: 200% 200%;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        animation: rqShimmer 3.5s ease infinite;
        display: inline-block;
      }
      @keyframes rqShimmer { 0%,100%{background-position:0%} 50%{background-position:100%} }

      @media (max-width: 1020px) {
        .rq-hero-grid { grid-template-columns: 1fr !important; text-align: center; }
        .rq-card-col { max-width: 380px; margin: 0 auto; }
        .rq-hero-sub { margin-left: auto !important; margin-right: auto !important; }
        .rq-hero-btns, .rq-trust-row { justify-content: center !important; }
        .rq-stats-grid { grid-template-columns: repeat(2,1fr) !important; }
        .rq-feat-grid { grid-template-columns: 1fr 1fr !important; }
        .rq-how-grid { grid-template-columns: 1fr 1fr !important; }
        .rq-how-line { display: none !important; }
        .rq-map-grid { grid-template-columns: 1fr !important; }
        .rq-test-grid { grid-template-columns: 1fr !important; }
        .rq-footer-grid { grid-template-columns: 1fr 1fr !important; }
        .rq-feat-header { justify-content: center !important; text-align: center; }
        .rq-nav-pills { display: none !important; }
        .rq-nl-form { flex-direction: column !important; align-items: center !important; }
        .rq-mob-hide { display: none !important; }
      }
      @media (max-width: 620px) {
        .rq-stats-grid { grid-template-columns: 1fr 1fr !important; padding: 32px 20px !important; }
        .rq-feat-grid { grid-template-columns: 1fr !important; }
        .rq-how-grid { grid-template-columns: 1fr !important; }
        .rq-footer-grid { grid-template-columns: 1fr !important; }
      }
    `;
    document.head.appendChild(style);
    return () => { document.getElementById("rq-global")?.remove(); };
  }, [c.bg]);
  return null;
};

/* ══════════════════════════════════════════════════
   GRAIN OVERLAY
══════════════════════════════════════════════════ */
const Grain = () => (
  <div style={{
    position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999, opacity: 0.022,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
  }} />
);

/* ══════════════════════════════════════════════════
   SCROLL PROGRESS
══════════════════════════════════════════════════ */
const ScrollProgress = ({ c }) => {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div style={{
      position: "fixed", top: 0, left: 0, right: 0, height: 2,
      background: `linear-gradient(90deg, ${c.amber}, ${c.sage}, ${c.mint})`,
      transformOrigin: "0%", scaleX: scrollYProgress, zIndex: 10001,
    }} />
  );
};

/* ══════════════════════════════════════════════════
   LIVE TICKER
══════════════════════════════════════════════════ */
const TICKS = [
  "🍱 Mumbai — 24 meals rescued just now",
  "🥗 Delhi — NGO matched in 3 min",
  "🍛 Bangalore — 80 kg saved today",
  "🫙 Pune — New volunteer joined",
  "🍲 Chennai — 12 families fed",
  "🌿 Hyderabad — 600g CO₂ offset",
];
const Ticker = ({ c }) => {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % TICKS.length), 3200);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{
      background: c.amber, padding: "9px 0", textAlign: "center",
      fontFamily: "'DM Mono', monospace", fontSize: 12, color: c.ticker,
      fontWeight: 500, letterSpacing: "0.04em", overflow: "hidden",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
        <motion.span
          animate={{ opacity: [1, 0.3, 1], scale: [1, 1.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ width: 6, height: 6, borderRadius: "50%", background: c.leaf, display: "inline-block", flexShrink: 0 }}
        />
        <AnimatePresence mode="wait">
          <motion.span
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >{TICKS[idx]}</motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════
   DARK TOGGLE
══════════════════════════════════════════════════ */
const DarkToggle = ({ dark, toggle, c }) => (
  <motion.button
    onClick={toggle}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    style={{
      width: 36, height: 36, borderRadius: 10,
      border: `1px solid ${c.border2}`, background: "transparent",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 15, color: c.text2, flexShrink: 0,
    }}
  >
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={dark ? "sun" : "moon"}
        initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
        transition={{ duration: 0.22 }}
        style={{ display: "flex" }}
      >
        {dark ? (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="5" stroke={c.amber} strokeWidth="2" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
              stroke={c.amber} strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
              stroke={c.text2} strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        )}
      </motion.span>
    </AnimatePresence>
  </motion.button>
);

/* ══════════════════════════════════════════════════
   REVEAL WRAPPER
══════════════════════════════════════════════════ */
const Reveal = ({ children, delay = 0, y = 36, x = 0, style = {} }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y, x }}
      animate={inView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 0.82, delay, ease: [0.22, 1, 0.36, 1] }}
      style={style}
    >
      {children}
    </motion.div>
  );
};

/* ══════════════════════════════════════════════════
   ANIMATED COUNTER
══════════════════════════════════════════════════ */
const Counter = ({ target, suffix = "" }) => {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    const n = parseInt(String(target).replace(/\D/g, ""));
    let start = 0;
    const step = Math.ceil(n / 60);
    const t = setInterval(() => {
      start = Math.min(start + step, n);
      setVal(start);
      if (start >= n) clearInterval(t);
    }, 18);
    return () => clearInterval(t);
  }, [inView, target]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
};

/* ══════════════════════════════════════════════════
   LEAF DECORATION
══════════════════════════════════════════════════ */
const LeafDeco = ({ c, style }) => (
  <svg viewBox="0 0 120 180" fill="none" style={{ position: "absolute", pointerEvents: "none", ...style }}>
    <path d="M60 175 C15 140 -5 90 8 42 C21 -6 65 2 95 36 C125 70 118 130 60 175Z"
      fill={c.sage} opacity="0.10" />
    <path d="M60 175 L60 55" stroke={c.sage} strokeWidth="1.5" opacity="0.15" />
  </svg>
);

/* ══════════════════════════════════════════════════
   FLOATING PARTICLES
══════════════════════════════════════════════════ */
const Particles = ({ c }) => {
  const particles = useRef(
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      dur: Math.random() * 7 + 5,
      delay: Math.random() * 3,
      up: Math.random() > 0.5,
    }))
  ).current;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          style={{
            position: "absolute", left: `${p.x}%`, top: `${p.y}%`,
            width: p.size, height: p.size, borderRadius: "50%",
            background: c.sage, opacity: 0.15,
          }}
          animate={{ y: p.up ? [-18, 18, -18] : [18, -18, 18] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
};

/* ══════════════════════════════════════════════════
   NAVBAR — bioluminescent forest · world-class
══════════════════════════════════════════════════ */
const NAV_LINKS = [
  { label: "Home",         href: "#hero",     icon: "⬡" },
  { label: "Features",     href: "#features", icon: "◈" },
  { label: "How It Works", href: "#how",      icon: "◎" },
  { label: "Impact",       href: "#impact",   icon: "◉" },
  { label: "Stories",      href: "#stories",  icon: "◇" },
];

/* Magnetic link — cursor pulls the label toward it */
const MagneticLink = ({ children, href, isActive, onClick, c, dark }) => {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    setPos({ x: (e.clientX - cx) * 0.28, y: (e.clientY - cy) * 0.28 });
  };
  const handleMouseLeave = () => { setPos({ x: 0, y: 0 }); setHovered(false); };

  return (
    <a href={href} style={{ textDecoration: "none", position: "relative" }}>
      <motion.button
        ref={ref}
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        animate={{ x: pos.x, y: pos.y }}
        transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.4 }}
        style={{
          position: "relative", border: "none", background: "transparent",
          padding: "10px 18px", cursor: "pointer", display: "flex",
          alignItems: "center", gap: 6, borderRadius: 14,
          fontFamily: "'Cabinet Grotesk', sans-serif",
          fontSize: 13, fontWeight: isActive ? 600 : 400,
          color: isActive
            ? (dark ? "#95d5b2" : "#1a4a2e")
            : (dark ? "rgba(110,231,183,0.5)" : "rgba(74,94,82,0.6)"),
          letterSpacing: "0.02em",
          transition: "color 0.25s",
          overflow: "visible",
        }}
      >
        {/* Glow blob behind active/hovered item */}
        <AnimatePresence>
          {(isActive || hovered) && (
            <motion.div
              key="glow"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.28 }}
              style={{
                position: "absolute", inset: 0, borderRadius: 14,
                background: isActive
                  ? (dark
                    ? "linear-gradient(135deg,rgba(45,106,79,0.55),rgba(82,183,136,0.18))"
                    : "linear-gradient(135deg,rgba(45,106,79,0.12),rgba(82,183,136,0.08))")
                  : (dark
                    ? "rgba(82,183,136,0.07)"
                    : "rgba(26,74,46,0.05)"),
                border: isActive
                  ? `1px solid ${dark ? "rgba(82,183,136,0.28)" : "rgba(26,74,46,0.18)"}`
                  : "1px solid transparent",
                pointerEvents: "none",
              }}
            />
          )}
        </AnimatePresence>

        {/* Spore dot — pulses only on active */}
        <motion.span
          animate={isActive
            ? { scale: [1, 1.6, 1], opacity: [0.9, 0.4, 0.9] }
            : { scale: 1, opacity: hovered ? 0.6 : 0 }}
          transition={isActive
            ? { duration: 2.4, repeat: Infinity }
            : { duration: 0.2 }}
          style={{
            width: 5, height: 5, borderRadius: "50%", flexShrink: 0,
            background: dark ? "#52b788" : "#2d6a4f",
            display: "inline-block",
            boxShadow: isActive && dark ? "0 0 8px #52b788" : "none",
          }}
        />

        <span style={{ position: "relative", zIndex: 1 }}>{children}</span>

        {/* Active underline — shimmer gradient */}
        {isActive && (
          <motion.div
            layoutId="nav-shimmer-line"
            style={{
              position: "absolute", bottom: 4, left: 18, right: 18, height: 1.5, borderRadius: 2,
              background: dark
                ? "linear-gradient(90deg, transparent, #52b788, #95d5b2, #52b788, transparent)"
                : "linear-gradient(90deg, transparent, #2d6a4f, #52b788, #2d6a4f, transparent)",
              backgroundSize: "200% 100%",
              animation: "rqNavShimmer 2.2s linear infinite",
            }}
            transition={{ type: "spring", stiffness: 400, damping: 32 }}
          />
        )}
      </motion.button>
    </a>
  );
};

/* Firefly particle that floats inside the nav */
const NavFirefly = ({ c, dark, index }) => {
  const x = 15 + index * 18 + Math.random() * 8;
  return (
    <motion.div
      style={{
        position: "absolute",
        left: `${x}%`,
        top: "50%",
        width: 3, height: 3, borderRadius: "50%",
        background: dark ? "#52b788" : "#2d6a4f",
        pointerEvents: "none",
        boxShadow: dark ? "0 0 6px #52b788" : "0 0 4px #2d6a4f",
      }}
      animate={{
        y: [-8, 8, -8],
        x: [-4, 4, -4],
        opacity: [0, 0.7, 0],
        scale: [0.5, 1, 0.5],
      }}
      transition={{
        duration: 3 + index * 0.7,
        repeat: Infinity,
        delay: index * 0.9,
        ease: "easeInOut",
      }}
    />
  );
};

const NavBar = ({ c, dark, toggleDark }) => {
  const [scrolled, setScrolled] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [scrollPct, setScrollPct] = useState(0);
  const navRef = useRef(null);

  useEffect(() => {
    const h = () => {
      const sy = window.scrollY;
      setScrolled(sy > 20);
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      setScrollPct(maxScroll > 0 ? (sy / maxScroll) * 100 : 0);
    };
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  /* inject keyframes for shimmer + aurora */
  useEffect(() => {
    const existing = document.getElementById("rq-nav-kf");
    if (existing) existing.remove();
    const s = document.createElement("style");
    s.id = "rq-nav-kf";
    s.textContent = `
      @keyframes rqNavShimmer {
        0%   { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
      @keyframes rqAurora {
        0%,100% { transform: translateX(-30%) scaleY(1); opacity:0.18; }
        33%      { transform: translateX(10%)  scaleY(1.4); opacity:0.26; }
        66%      { transform: translateX(-10%) scaleY(0.8); opacity:0.14; }
      }
      @keyframes rqOrb {
        0%,100% { transform: translate(-50%,-50%) scale(1);   opacity:0.22; }
        50%      { transform: translate(-50%,-50%) scale(1.3); opacity:0.34; }
      }
      @keyframes rqSeedFloat {
        0%   { transform: translateY(0px)  rotate(0deg)   scale(1);   opacity:0; }
        15%  { opacity:0.55; }
        85%  { opacity:0.35; }
        100% { transform: translateY(-38px) rotate(180deg) scale(0.4); opacity:0; }
      }
      @media (max-width:860px) {
        .rq-nav-links { display: none !important; }
      }
    `;
    document.head.appendChild(s);
    return () => document.getElementById("rq-nav-kf")?.remove();
  }, [dark]);

  const aurora1 = dark ? "rgba(45,106,79,0.35)"  : "rgba(45,106,79,0.18)";
  const aurora2 = dark ? "rgba(82,183,136,0.22)" : "rgba(82,183,136,0.12)";
  const aurora3 = dark ? "rgba(149,213,178,0.12)": "rgba(149,213,178,0.08)";

  return (
    <motion.nav
      ref={navRef}
      initial={{ y: -90, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 220, damping: 24, delay: 0.08 }}
      style={{
        position: "sticky", top: 0, zIndex: 1000,
        height: 68,
        /* layered glass: dark border → inner glow → frosted bg */
        background: scrolled
          ? (dark
            ? "rgba(5,12,7,0.82)"
            : "rgba(245,240,230,0.82)")
          : "transparent",
        backdropFilter: scrolled ? "blur(28px) saturate(200%) brightness(1.04)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(28px) saturate(200%) brightness(1.04)" : "none",
        borderBottom: scrolled
          ? `1px solid ${dark ? "rgba(82,183,136,0.16)" : "rgba(26,74,46,0.12)"}`
          : "1px solid transparent",
        boxShadow: scrolled
          ? (dark
            ? "0 1px 0 rgba(82,183,136,0.06), 0 8px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(82,183,136,0.08)"
            : "0 1px 0 rgba(26,74,46,0.05), 0 8px 32px rgba(26,74,46,0.10), inset 0 1px 0 rgba(82,183,136,0.06)")
          : "none",
        transition: "background 0.5s, border-color 0.5s, box-shadow 0.5s",
        overflow: "hidden",
      }}
    >

      {/* ── Aurora sweep (slow horizontal drift) ── */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden",
        opacity: scrolled ? 1 : 0, transition: "opacity 0.6s",
      }}>
        {/* wide aurora band */}
        <div style={{
          position: "absolute", top: "-60%", left: "0%",
          width: "140%", height: "220%", borderRadius: "50%",
          background: `radial-gradient(ellipse 60% 50% at 35% 50%, ${aurora1}, ${aurora2} 40%, ${aurora3} 65%, transparent 80%)`,
          animation: "rqAurora 9s ease-in-out infinite",
          filter: "blur(18px)",
        }} />
        {/* secondary orb — amber accent */}
        <div style={{
          position: "absolute", top: "50%", right: "18%",
          width: 220, height: 220, borderRadius: "50%",
          background: dark
            ? "radial-gradient(circle, rgba(245,158,11,0.09) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(232,168,56,0.07) 0%, transparent 70%)",
          animation: "rqOrb 7s ease-in-out infinite 2s",
          transform: "translate(-50%,-50%)",
          filter: "blur(10px)",
        }} />
      </div>

      {/* ── Floating spore seeds (subtle, only when scrolled) ── */}
      {scrolled && [0,1,2,3,4].map(i => (
        <div key={i} style={{
          position: "absolute",
          left: `${10 + i * 18}%`,
          bottom: 0,
          width: 4, height: 4,
          borderRadius: "50%",
          background: dark ? "rgba(82,183,136,0.6)" : "rgba(45,106,79,0.5)",
          pointerEvents: "none",
          animation: `rqSeedFloat ${3.5 + i * 0.8}s ease-in-out infinite ${i * 1.1}s`,
        }} />
      ))}

      {/* ── Bottom progress filament ── */}
      <motion.div style={{
        position: "absolute", bottom: 0, left: 0,
        height: 1.5, borderRadius: 1,
        background: dark
          ? "linear-gradient(90deg, transparent, #2d6a4f, #52b788, #95d5b2, #52b788, #2d6a4f, transparent)"
          : "linear-gradient(90deg, transparent, #1a4a2e, #2d6a4f, #52b788, #2d6a4f, #1a4a2e, transparent)",
        width: `${scrollPct}%`,
        boxShadow: dark ? "0 0 8px #52b788, 0 0 18px rgba(82,183,136,0.4)" : "0 0 6px #2d6a4f",
        transition: "width 0.12s linear",
        opacity: scrolled ? 1 : 0,
      }} />

      {/* ── Main row ── */}
      <div style={{
        maxWidth: 1240, margin: "0 auto", padding: "0 32px", height: "100%",
        display: "grid", gridTemplateColumns: "1fr auto 1fr",
        alignItems: "center",
        position: "relative", zIndex: 2,
      }}>

        {/* LEFT — spacer keeps centre truly centred */}
        <div />

        {/* CENTRE — nav links */}
        <div
          className="rq-nav-links"
          style={{ display: "flex", alignItems: "center", gap: 2, justifyContent: "center" }}
        >
          {NAV_LINKS.map((l, i) => (
            <MagneticLink
              key={l.label}
              href={l.href}
              isActive={activeIdx === i}
              onClick={() => setActiveIdx(i)}
              c={c}
              dark={dark}
            >
              {l.label}
            </MagneticLink>
          ))}
        </div>

        {/* RIGHT — fireflies cluster + dark toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, justifyContent: "flex-end" }}>

          {/* Firefly cluster — decorative living element */}
          <div style={{
            position: "relative", width: 48, height: 36,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {[0, 1, 2].map(i => <NavFirefly key={i} c={c} dark={dark} index={i} />)}
          </div>

          {/* ── Dark toggle — orbital ring design ── */}
          <motion.button
            onClick={toggleDark}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92, rotate: 15 }}
            style={{
              position: "relative",
              width: 44, height: 44, borderRadius: "50%",
              border: "none", background: "transparent",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", flexShrink: 0, overflow: "visible",
            }}
          >
            {/* Ring */}
            <motion.div
              animate={{ rotate: dark ? 0 : 180 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: "absolute", inset: 0, borderRadius: "50%",
                border: `1.5px solid ${dark ? "rgba(82,183,136,0.35)" : "rgba(26,74,46,0.25)"}`,
              }}
            >
              {/* Orbit dot */}
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                style={{
                  position: "absolute", inset: 0, borderRadius: "50%",
                }}
              >
                <div style={{
                  position: "absolute", top: -3, left: "50%", transform: "translateX(-50%)",
                  width: 6, height: 6, borderRadius: "50%",
                  background: dark ? "#f59e0b" : "#2d6a4f",
                  boxShadow: dark
                    ? "0 0 8px #f59e0b, 0 0 16px rgba(245,158,11,0.5)"
                    : "0 0 6px #2d6a4f",
                }} />
              </motion.div>
            </motion.div>

            {/* Inner surface */}
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: dark
                ? "linear-gradient(135deg, rgba(15,26,18,0.9), rgba(30,50,35,0.8))"
                : "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(230,240,232,0.8))",
              border: `1px solid ${dark ? "rgba(82,183,136,0.2)" : "rgba(26,74,46,0.15)"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: dark
                ? "inset 0 1px 0 rgba(82,183,136,0.15), 0 2px 8px rgba(0,0,0,0.4)"
                : "inset 0 1px 0 rgba(255,255,255,0.8), 0 2px 6px rgba(26,74,46,0.12)",
            }}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={dark ? "sun" : "moon"}
                  initial={{ rotate: -120, opacity: 0, scale: 0.3 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 120, opacity: 0, scale: 0.3 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  {dark ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="4.5" fill="#f59e0b" opacity="0.9"/>
                      <circle cx="12" cy="12" r="4.5" stroke="#fbbf24" strokeWidth="1.5" fill="none"/>
                      <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
                        stroke="#f59e0b" strokeWidth="1.6" strokeLinecap="round"/>
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                        fill="#2d6a4f" opacity="0.2" stroke="#2d6a4f" strokeWidth="1.6" strokeLinecap="round"/>
                    </svg>
                  )}
                </motion.span>
              </AnimatePresence>
            </div>
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
};

/* ══════════════════════════════════════════════════
   FOOD CARD (hero visual)
══════════════════════════════════════════════════ */
const FoodCard = ({ c }) => {
  const navigate = useNavigate();
  return (
    <div
      className="rq-card-col"
      style={{ position: "relative", paddingTop: 44, paddingBottom: 52, paddingLeft: 20 }}
    >
      {/* Volunteer chip */}
      <motion.div
        animate={{ y: [0, -9, 0] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        style={{
          position: "absolute", top: 4, right: 0,
          background: "rgba(255,255,255,0.97)", borderRadius: 14, padding: "9px 14px",
          display: "flex", alignItems: "center", gap: 8,
          boxShadow: "0 10px 32px rgba(0,0,0,0.16)", border: "1px solid rgba(82,183,136,0.22)",
          zIndex: 4, whiteSpace: "nowrap",
        }}
      >
        <span style={{ fontSize: 16 }}>🚴</span>
        <span style={{ fontSize: 11.5, fontWeight: 600, color: "#1a4a2e", fontFamily: "'Cabinet Grotesk', sans-serif" }}>
          Volunteer 0.8 km away
        </span>
      </motion.div>

      {/* Main card */}
      <motion.div
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        onClick={() => navigate("/dashboard/search")}
        style={{
          background: "rgba(255,255,255,0.97)", borderRadius: 26, padding: 24,
          boxShadow: "0 48px 110px rgba(0,0,0,0.30), 0 8px 24px rgba(0,0,0,0.10)",
          position: "relative", zIndex: 2, cursor: "pointer",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 13, background: "#d1fae5",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 21, flexShrink: 0,
          }}>🍱</div>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: "#111c15", fontFamily: "'Cabinet Grotesk', sans-serif" }}>
              New Donation Posted
            </div>
            <div style={{ fontSize: 11, color: "#6b7a6d", fontFamily: "'DM Mono', monospace", marginTop: 2 }}>
              2 min ago · Connaught Place
            </div>
          </div>
        </div>

        <div style={{ background: "#f7f3ec", borderRadius: 12, padding: "11px 14px", marginBottom: 14 }}>
          <div style={{ fontSize: 13.5, fontWeight: 500, color: "#111c15", fontFamily: "'Cabinet Grotesk', sans-serif" }}>
            45 meals — Dal Makhani, Rice, Sabzi
          </div>
          <div style={{ fontSize: 11, color: "#6b7a6d", fontFamily: "'DM Mono', monospace", marginTop: 4 }}>
            Expires in 3h · Pickup available
          </div>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <motion.div
            whileHover={{ opacity: 0.88 }}
            onClick={(e) => { e.stopPropagation(); navigate("/dashboard/search"); }}
            style={{
              flex: 1, background: "#2d6a4f", color: "#fff",
              borderRadius: 11, padding: "9px 0", textAlign: "center",
              fontSize: 12.5, fontWeight: 600, cursor: "pointer",
              fontFamily: "'Cabinet Grotesk', sans-serif",
            }}
          >Accept</motion.div>
          <motion.div
            whileHover={{ opacity: 0.88 }}
            onClick={(e) => { e.stopPropagation(); navigate("/dashboard"); }}
            style={{
              flex: 1, background: "#f0ebe0", color: "#6b7a6d",
              borderRadius: 11, padding: "9px 0", textAlign: "center",
              fontSize: 12.5, cursor: "pointer",
              fontFamily: "'Cabinet Grotesk', sans-serif",
            }}
          >Later</motion.div>
        </div>

        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          marginTop: 14, paddingTop: 14, borderTop: "1px solid #f0ebe0",
        }}>
          <motion.div
            animate={{ scale: [1, 1.4, 1], opacity: [1, 0.4, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ width: 6, height: 6, borderRadius: "50%", background: "#52b788", flexShrink: 0 }}
          />
          <span style={{ fontSize: 11, color: "#52b788", fontFamily: "'DM Mono', monospace" }}>
            3 NGOs notified nearby
          </span>
        </div>
      </motion.div>

      {/* CO₂ chip */}
      <motion.div
        animate={{ y: [0, 11, 0] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
        style={{
          position: "absolute", bottom: 4, left: 0,
          background: "linear-gradient(135deg, #d97706, #f59e0b)",
          borderRadius: 18, padding: "13px 18px",
          display: "flex", alignItems: "center", gap: 10,
          boxShadow: "0 18px 48px rgba(217,119,6,0.38)", zIndex: 4,
        }}
      >
        <span style={{ fontSize: 22 }}>🌱</span>
        <div>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: "#fff", fontFamily: "'Cabinet Grotesk', sans-serif" }}>
            500 kg CO₂ Saved
          </div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.75)", fontFamily: "'DM Mono', monospace", marginTop: 2 }}>
            This month alone
          </div>
        </div>
      </motion.div>
    </div>
  );
};

/* ══════════════════════════════════════════════════
   HERO
══════════════════════════════════════════════════ */
const Hero = ({ c }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  return (
    <section
      id="hero"
      ref={ref}
      style={{
        minHeight: "100vh",
        background: c.heroBg,
        display: "flex", alignItems: "center",
        position: "relative", overflow: "visible",
        padding: "80px 32px", transition: "background 0.45s",
      }}
    >
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
        <div style={{
          position: "absolute", width: 800, height: 800, borderRadius: "50%",
          background: "radial-gradient(circle,rgba(82,183,136,.12) 0%,transparent 68%)",
          top: "50%", left: "50%", transform: "translate(-50%,-50%)",
        }} />
        <svg style={{ position: "absolute", bottom: -80, right: -80, width: 620, opacity: 0.07 }} viewBox="0 0 500 500">
          <circle cx="500" cy="500" r="360" stroke="#e8a838" strokeWidth="70" fill="none" opacity=".8" />
          <circle cx="500" cy="500" r="220" stroke="#52b788" strokeWidth="35" fill="none" opacity=".4" />
        </svg>
        <Particles c={c} />
      </div>

      <motion.div style={{ opacity, width: "100%", position: "relative", zIndex: 2 }}>
        <div
          className="rq-hero-grid"
          style={{
            maxWidth: 1240, margin: "0 auto", width: "100%",
            display: "grid", gridTemplateColumns: "1fr 380px",
            gap: 56, alignItems: "center",
          }}
        >
          <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              style={{
                display: "inline-flex", alignItems: "center", gap: 9,
                background: "rgba(255,255,255,0.08)", backdropFilter: "blur(14px)",
                border: "1px solid rgba(255,255,255,0.14)", borderRadius: 100,
                padding: "8px 18px", marginBottom: 26, cursor: "default",
              }}
            >
              <motion.span
                animate={{ opacity: [1, 0.3, 1], scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ width: 7, height: 7, borderRadius: "50%", background: c.amber, display: "inline-block", flexShrink: 0 }}
              />
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: c.mint, letterSpacing: "0.09em" }}>
                FOOD RESCUE PLATFORM · INDIA
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 1, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: "clamp(52px, 7.5vw, 104px)",
                fontWeight: 900, color: "#fff",
                lineHeight: 0.91, letterSpacing: "-0.03em", margin: "0 0 24px",
              }}
            >
              Every Meal<br />
              <span className="rq-hero-em">Matters.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 38 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="rq-hero-sub"
              style={{
                fontFamily: "'Cabinet Grotesk', sans-serif",
                fontSize: "clamp(15px,1.8vw,19px)", color: "rgba(255,255,255,0.57)",
                maxWidth: 500, lineHeight: 1.76, marginBottom: 42, fontWeight: 300,
              }}
            >
              ResQPlate bridges surplus food with hungry families — in real time,
              with zero friction and maximum impact across India.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.85 }}
              className="rq-hero-btns"
              style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 48 }}
            >
              <Link to="/register?role=donor">
                <motion.button
                  whileHover={{ background: c.gold, transform: "translateY(-3px)", boxShadow: "0 20px 48px rgba(232,168,56,0.42)" }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    padding: "16px 34px", borderRadius: 100, border: "none",
                    background: c.amber, color: c.leaf,
                    fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 700, fontSize: 15, cursor: "pointer",
                  }}
                >Donate Food →</motion.button>
              </Link>

              <Link to="/register?role=ngo">
                <motion.button
                  whileHover={{ background: "rgba(255,255,255,0.14)" }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    padding: "16px 34px", borderRadius: 100,
                    border: "1px solid rgba(255,255,255,0.22)",
                    background: "rgba(255,255,255,0.07)", color: "#fff",
                    fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 15, cursor: "pointer",
                  }}
                >Request Food</motion.button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.9 }}
              className="rq-trust-row"
              style={{ display: "flex", flexWrap: "wrap", gap: 18 }}
            >
              {["Govt. of India Backed", "ISO 9001:2015 Certified", "2,400+ Lives Impacted"].map((t) => (
                <div key={t} style={{
                  display: "flex", alignItems: "center", gap: 7,
                  fontSize: 12, color: "rgba(255,255,255,0.40)",
                  fontFamily: "'DM Mono', monospace", letterSpacing: "0.04em",
                }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="7" r="6" stroke="#52b788" strokeWidth="1.2" />
                    <path d="M4 7l2 2 4-4" stroke="#52b788" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                  {t}
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <FoodCard c={c} />
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        style={{
          position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 7, zIndex: 2,
        }}
      >
        <span style={{ fontSize: 9, color: "rgba(255,255,255,0.28)", fontFamily: "'DM Mono', monospace", letterSpacing: "0.2em" }}>
          SCROLL
        </span>
        <motion.div
          animate={{ opacity: [0.55, 1, 0.55], scaleY: [1, 1.3, 1] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          style={{ width: 1, height: 36, background: "linear-gradient(to bottom,rgba(255,255,255,.38),transparent)" }}
        />
      </motion.div>
    </section>
  );
};

/* ══════════════════════════════════════════════════
   STATS
══════════════════════════════════════════════════ */
const STATS = [
  { value: "1200", suffix: "+",   label: "Meals Rescued",     icon: "🍽️", color: "#52b788", to: "/dashboard"        },
  { value: "50",   suffix: "+",   label: "NGO Partners",      icon: "🤝", color: "#e8a838", to: "/dashboard/search" },
  { value: "500",  suffix: " kg", label: "CO₂ Reduced",       icon: "🌿", color: "#2d6a4f", to: "/about"            },
  { value: "98",   suffix: "%",   label: "Satisfaction Rate",  icon: "⭐", color: "#d4622a", to: "/about"            },
];

const Stats = ({ c }) => (
  <section style={{ background: c.leafm, padding: "0 32px" }}>
    <Reveal>
      <div
        className="rq-stats-grid"
        style={{
          maxWidth: 1100, margin: "0 auto", transform: "translateY(-52px)",
          background: c.surface, borderRadius: 30, boxShadow: c.cardShadow,
          padding: "50px 44px", display: "grid", gridTemplateColumns: "repeat(4,1fr)",
          gap: 24, border: `1px solid ${c.border}`,
        }}
      >
        {STATS.map((s, i) => (
          <Reveal key={i} delay={i * 0.1}>
            <Link to={s.to}>
              <motion.div whileHover={{ scale: 1.04, y: -4 }} style={{ textAlign: "center", cursor: "pointer" }}>
                <motion.div
                  whileHover={{ scale: 1.15, rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.4 }}
                  style={{
                    width: 58, height: 58, borderRadius: 17,
                    background: `${s.color}18`, border: `1px solid ${s.color}28`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 26, margin: "0 auto 14px",
                  }}
                >{s.icon}</motion.div>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: 44, fontWeight: 900, color: s.color, lineHeight: 1 }}>
                  <Counter target={s.value} suffix={s.suffix} />
                </div>
                <div style={{ fontSize: 13, color: c.text2, marginTop: 7 }}>{s.label}</div>
              </motion.div>
            </Link>
          </Reveal>
        ))}
      </div>
    </Reveal>
  </section>
);

/* ══════════════════════════════════════════════════
   MISSION
══════════════════════════════════════════════════ */
const Mission = ({ c }) => (
  <section style={{ background: c.bg2, padding: "80px 32px", textAlign: "center", position: "relative", overflow: "hidden" }}>
    <LeafDeco c={c} style={{ width: 260, top: -40, right: 40, opacity: 0.9 }} />
    <LeafDeco c={c} style={{ width: 200, bottom: 20, left: -60, opacity: 0.6, transform: "rotate(110deg)" }} />
    <div style={{ maxWidth: 840, margin: "0 auto" }}>
      <Reveal>
        <span style={{
          display: "inline-block", background: c.leafm, color: "#fff",
          fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.15em",
          padding: "6px 16px", borderRadius: 100, marginBottom: 20,
        }}>OUR MISSION</span>
      </Reveal>
      <Reveal delay={0.12}>
        <blockquote style={{
          fontFamily: "'Fraunces', serif",
          fontSize: "clamp(26px,3.8vw,50px)", fontWeight: 700,
          color: c.text, lineHeight: 1.22, fontStyle: "italic", margin: "0 0 26px",
        }}>
          "No plate left behind — bridging abundance and hunger, one rescue at a time."
        </blockquote>
      </Reveal>
      <Reveal delay={0.22}>
        <p style={{ fontSize: 16, color: c.text2, lineHeight: 1.78, maxWidth: 580, margin: "0 auto 44px" }}>
          We believe food waste and hunger are two sides of the same broken system.
          ResQPlate repairs it — with technology, community, and compassion at scale.
        </p>
      </Reveal>
      <Reveal delay={0.3}>
        <div style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
          {[
            { label: "Vision 2030", val: "Zero Food Waste India", to: "/about" },
            { label: "Founded",     val: "2023 · New Delhi",      to: "/about" },
            { label: "Network",     val: "22 Cities Active",       to: "/map"   },
          ].map((m) => (
            <Link key={m.label} to={m.to}>
              <motion.div
                whileHover={{ y: -4, boxShadow: `0 12px 32px ${c.shadow}` }}
                style={{
                  background: c.surface, border: `1px solid ${c.border}`,
                  borderRadius: 18, padding: "22px 28px", textAlign: "center", cursor: "pointer",
                }}
              >
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: c.text3, letterSpacing: "0.12em", marginBottom: 7, textTransform: "uppercase" }}>{m.label}</div>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 700, color: c.text }}>{m.val}</div>
              </motion.div>
            </Link>
          ))}
        </div>
      </Reveal>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════
   FEATURES
══════════════════════════════════════════════════ */
const FEATURES = [
  { emoji: "⚡", title: "AI-Powered Matching",  desc: "Our algorithm matches surplus food to the nearest verified NGO in under 90 seconds, factoring in distance, capacity, and food type.", tag: "NEW", accent: "#52b788", to: "/dashboard/ai-matching" },
  { emoji: "🗺️", title: "Live Map Tracking",   desc: "Follow every donation from post to plate with real-time GPS tracking and push notifications for all parties.", tag: "", accent: "#e8a838", to: "/map" },
  { emoji: "🛡️", title: "Trust & Safety",      desc: "Every NGO is background-checked, rated, and insured. Donors get full transparency with photo proof of delivery.", tag: "", accent: "#2d6a4f", to: "/about" },
  { emoji: "📊", title: "Impact Dashboard",    desc: "See your personal CO₂ savings, meals rescued, and families helped in a beautiful, shareable impact report.", tag: "NEW", accent: "#d4622a", to: "/dashboard" },
  { emoji: "🔔", title: "Smart Alerts",        desc: "WhatsApp, SMS, and app notifications ensure zero missed pickups. Set your schedule and we'll handle coordination.", tag: "", accent: "#7c3aed", to: "/dashboard/smart-alerts" },
  { emoji: "🏆", title: "Donor Rewards",       desc: "Earn ResQPoints for every donation. Redeem for tax certificates, brand badges, and exclusive partner discounts.", tag: "NEW", accent: "#0891b2", to: "/dashboard/profile" },
];

const Features = ({ c }) => (
  <section style={{ background: c.bg, padding: "100px 32px" }} id="features">
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      <div className="rq-feat-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20, marginBottom: 64 }}>
        <Reveal>
          <div>
            <span style={{
              display: "inline-block", background: c.leafm, color: "#fff",
              fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.15em",
              padding: "6px 16px", borderRadius: 100, marginBottom: 18,
            }}>PLATFORM FEATURES</span>
            <h2 style={{
              fontFamily: "'Fraunces', serif", fontSize: "clamp(34px,4.5vw,60px)",
              fontWeight: 900, color: c.text, lineHeight: 1.06, margin: 0, maxWidth: 480, letterSpacing: "-0.02em",
            }}>
              Built for <em style={{ color: c.leafm, fontStyle: "italic" }}>speed,</em> trust &amp; impact.
            </h2>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <p style={{ fontSize: 15, color: c.text2, lineHeight: 1.78, maxWidth: 280 }}>
            Every feature designed to remove friction from food rescue operations.
          </p>
        </Reveal>
      </div>

      <div className="rq-feat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
        {FEATURES.map((f, i) => (
          <Reveal key={i} delay={i * 0.08}>
            <Link to={f.to}>
              <motion.div
                whileHover={{ y: -8, boxShadow: `0 28px 70px ${f.accent}18` }}
                style={{
                  background: c.surface, border: `1px solid ${c.border}`,
                  borderRadius: 22, padding: 30, position: "relative",
                  overflow: "hidden", cursor: "pointer", transition: "box-shadow 0.35s",
                }}
              >
                {f.tag && (
                  <div style={{
                    position: "absolute", top: 20, right: 20,
                    background: c.amber, color: c.leaf,
                    fontSize: 9, fontWeight: 700, letterSpacing: "0.12em",
                    padding: "3px 9px", borderRadius: 100, fontFamily: "'DM Mono', monospace",
                  }}>{f.tag}</div>
                )}
                <motion.div
                  whileHover={{ rotate: [0, -8, 8, 0], scale: 1.1 }}
                  transition={{ duration: 0.4 }}
                  style={{
                    width: 54, height: 54, borderRadius: 15,
                    background: `${f.accent}18`, border: `1px solid ${f.accent}28`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 24, marginBottom: 20,
                  }}
                >{f.emoji}</motion.div>
                <h3 style={{ fontSize: 17, fontWeight: 500, color: c.text, marginBottom: 10 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: c.text2, lineHeight: 1.72, margin: 0 }}>{f.desc}</p>
                <motion.div
                  initial={{ scaleX: 0, originX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  style={{
                    position: "absolute", bottom: 0, left: 0, right: 0, height: 3,
                    background: `linear-gradient(90deg,${f.accent},${f.accent}88)`,
                  }}
                />
              </motion.div>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════
   HOW IT WORKS
══════════════════════════════════════════════════ */
const HOW_STEPS = [
  { num: "01", emoji: "📸", title: "Post in 60 Seconds", desc: "Snap a photo, add quantity and pickup window. No forms, no friction — just impact.", color: "#52b788", to: "/dashboard/post-60" },
  { num: "02", emoji: "🤖", title: "AI Finds the Match",  desc: "Our engine notifies the best-fit NGO within seconds based on location, type, and urgency.", color: "#e8a838", to: "/dashboard/ai-matching" },
  { num: "03", emoji: "🚴", title: "Volunteer Picks Up",  desc: "A vetted volunteer collects the food with live GPS updates for all parties.", color: "#d4622a", to: "/dashboard/volunteer-pickups" },
  { num: "04", emoji: "📋", title: "Impact Delivered",    desc: "Receive a certificate with CO₂ saved, meals rescued, and families fed. Share on social.", color: "#2d6a4f", to: "/dashboard/impact-delivered" },
];

const HowItWorks = ({ c }) => (
  <section style={{ background: c.leafm, padding: "100px 32px", position: "relative", overflow: "hidden" }} id="how">
    <svg style={{ position: "absolute", top: -150, right: -150, width: 600, opacity: 0.04, pointerEvents: "none" }} viewBox="0 0 400 400">
      <circle cx="200" cy="200" r="160" stroke="#fff" strokeWidth="80" fill="none" />
    </svg>
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      <Reveal>
        <div style={{ textAlign: "center", marginBottom: 80 }}>
          <span style={{
            display: "inline-block", background: "rgba(255,255,255,0.10)",
            border: "1px solid rgba(255,255,255,0.18)", color: c.mint,
            fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.15em",
            padding: "6px 16px", borderRadius: 100, marginBottom: 18,
          }}>HOW IT WORKS</span>
          <h2 style={{
            fontFamily: "'Fraunces', serif", fontSize: "clamp(32px,4.8vw,60px)",
            fontWeight: 900, color: "#fff", lineHeight: 1.08, margin: 0,
          }}>
            From surplus to smiles —{" "}
            <em style={{ fontStyle: "italic", color: "rgba(255,255,255,0.68)" }}>in minutes.</em>
          </h2>
        </div>
      </Reveal>
      <div className="rq-how-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24, position: "relative" }}>
        <div className="rq-how-line" style={{ position: "absolute", top: 56, left: "12%", right: "12%", height: 1, background: "rgba(255,255,255,0.10)" }} />
        {HOW_STEPS.map((s, i) => (
          <Reveal key={i} delay={i * 0.14}>
            <Link to={s.to}>
              <motion.div whileHover={{ y: -8 }} style={{ textAlign: "center", position: "relative", zIndex: 1, cursor: "pointer" }}>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  style={{
                    width: 80, height: 80, borderRadius: "50%", background: s.color,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 30, margin: "0 auto 20px", boxShadow: `0 0 0 12px ${s.color}28`,
                  }}
                >{s.emoji}</motion.div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: s.color, letterSpacing: "0.1em", marginBottom: 10 }}>{s.num}</div>
                <h3 style={{ fontSize: 16, fontWeight: 500, color: "#fff", marginBottom: 10 }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.52)", lineHeight: 1.68 }}>{s.desc}</p>
              </motion.div>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════
   IMPACT MAP
══════════════════════════════════════════════════ */
const CITIES = [
  { city: "New Delhi",  meals: 124, color: "#52b788", pct: 100 },
  { city: "Mumbai",     meals: 98,  color: "#e8a838", pct: 79  },
  { city: "Bangalore",  meals: 76,  color: "#d4622a", pct: 61  },
  { city: "Chennai",    meals: 52,  color: "#95d5b2", pct: 42  },
  { city: "Hyderabad",  meals: 38,  color: "#7c3aed", pct: 31  },
];
const MAP_DOTS = [
  { x: 155, y: 120, label: "Delhi",     r: 14, c: "#52b788" },
  { x: 120, y: 260, label: "Mumbai",    r: 11, c: "#e8a838" },
  { x: 198, y: 285, label: "Bengaluru", r: 9,  c: "#d4622a" },
  { x: 218, y: 178, label: "Kolkata",   r: 8,  c: "#2d6a4f" },
  { x: 168, y: 310, label: "Chennai",   r: 7,  c: "#f4c542" },
  { x: 148, y: 215, label: "Hyderabad", r: 8,  c: "#7c3aed" },
];

const ImpactMap = ({ c }) => (
  <section style={{ background: c.bg2, padding: "100px 32px" }} id="impact">
    <div className="rq-map-grid" style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
      <Reveal x={-36} y={0}>
        <div>
          <span style={{
            display: "inline-block", background: c.leafm, color: "#fff",
            fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.15em",
            padding: "6px 16px", borderRadius: 100, marginBottom: 18,
          }}>REAL-TIME IMPACT</span>
          <h2 style={{
            fontFamily: "'Fraunces', serif", fontSize: "clamp(32px,4.2vw,56px)",
            fontWeight: 900, color: c.text, lineHeight: 1.1, marginBottom: 22, letterSpacing: "-0.02em",
          }}>
            Rescues happening right now, across India.
          </h2>
          <p style={{ fontSize: 15.5, color: c.text2, lineHeight: 1.78, marginBottom: 40 }}>
            Our live operations dashboard shows every active donation, pickup in progress,
            and delivery completed — city by city, minute by minute.
          </p>

          {CITIES.map((ct, i) => (
            <Link key={i} to="/map">
              <motion.div whileHover={{ x: 4 }} style={{ marginBottom: 18, cursor: "pointer" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 9, height: 9, borderRadius: "50%", background: ct.color }} />
                    <span style={{ fontSize: 14, color: c.text }}>{ct.city}</span>
                  </div>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: ct.color, fontWeight: 500 }}>
                    {ct.meals} meals
                  </span>
                </div>
                <div style={{ height: 5, background: c.border, borderRadius: 100, overflow: "hidden" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${ct.pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.4, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                    style={{ height: "100%", background: ct.color, borderRadius: 100 }}
                  />
                </div>
              </motion.div>
            </Link>
          ))}

          <Link to="/map">
            <motion.button
              whileHover={{ background: c.leafm, transform: "translateY(-2px)" }}
              whileTap={{ scale: 0.97 }}
              style={{
                marginTop: 28, padding: "12px 28px", borderRadius: 100,
                border: `1.5px solid ${c.border2}`, background: "transparent",
                fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 14,
                fontWeight: 600, color: c.text2, cursor: "pointer", transition: "all 0.25s",
              }}
            >View Live Map →</motion.button>
          </Link>
        </div>
      </Reveal>

      <Reveal delay={0.18}>
        <Link to="/map" style={{ display: "block", position: "relative" }}>
          <svg viewBox="0 0 360 440" fill="none" style={{ width: "100%", filter: "drop-shadow(0 24px 52px rgba(0,0,0,0.13))", cursor: "pointer" }}>
            <path
              d="M180 28 C215 22 248 38 268 70 C298 115 302 148 285 185 C274 208 295 228 290 258 C282 296 263 322 242 348 C222 374 202 398 180 422 C158 398 138 374 118 348 C97 322 78 296 70 258 C65 228 85 208 74 185 C57 148 62 115 92 70 C112 38 145 34 180 28Z"
              fill={c.surface} stroke={c.sage} strokeWidth="1.8"
            />
            {MAP_DOTS.map((d, i) => (
              <g key={i}>
                <motion.circle
                  cx={d.x} cy={d.y} r={d.r + 8} fill={d.c} opacity={0.16}
                  animate={{ r: [d.r + 8, d.r + 18, d.r + 8] }}
                  transition={{ duration: 2.8, repeat: Infinity, delay: i * 0.48, ease: "easeInOut" }}
                />
                <circle cx={d.x} cy={d.y} r={d.r} fill={d.c} />
                <text x={d.x + d.r + 7} y={d.y + 4} fontSize="10" fill={c.text3} fontFamily="Cabinet Grotesk, sans-serif">
                  {d.label}
                </text>
              </g>
            ))}
          </svg>
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3.5, repeat: Infinity }}
            style={{
              position: "absolute", top: 18, right: -14,
              background: c.surface, border: `1px solid ${c.border}`,
              borderRadius: 16, padding: "12px 16px", boxShadow: c.cardShadow,
            }}
          >
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: c.text3, marginBottom: 5, textTransform: "uppercase" }}>Active Now</div>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 900, color: c.sage }}>47</div>
            <div style={{ fontSize: 11, color: c.text2, fontFamily: "'Cabinet Grotesk', sans-serif" }}>Live pickups</div>
          </motion.div>
        </Link>
      </Reveal>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════
   TESTIMONIALS
══════════════════════════════════════════════════ */
const TESTIMONIALS = [
  { name: "Priya Sharma", role: "Restaurant Owner, Delhi",     text: "ResQPlate turned our daily food waste into daily impact. The app is stupidly simple and the results are extraordinary.", av: "PS", color: "#52b788" },
  { name: "Rahul Gupta",  role: "NGO Coordinator, Mumbai",     text: "The AI matching cut our coordination time from hours to minutes. We're feeding 3× more families with the same team.", av: "RG", color: "#e8a838" },
  { name: "Anita Verma",  role: "Community Leader, Bangalore", text: "I've never seen a tech product that cares this much about real people. The impact dashboard made our donors cry happy tears.", av: "AV", color: "#d4622a" },
];

const Testimonials = ({ c }) => (
  <section style={{ background: c.bg, padding: "100px 32px" }} id="stories">
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      <Reveal style={{ textAlign: "center", marginBottom: 64 }}>
        <span style={{
          display: "inline-block", background: c.leafm, color: "#fff",
          fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.15em",
          padding: "6px 16px", borderRadius: 100, marginBottom: 18,
        }}>COMMUNITY VOICES</span>
        <h2 style={{
          fontFamily: "'Fraunces', serif", fontSize: "clamp(34px,4.5vw,60px)",
          fontWeight: 900, color: c.text, lineHeight: 1.06, margin: 0, letterSpacing: "-0.02em",
        }}>
          The people who make it{" "}
          <em style={{ color: c.leafm, fontStyle: "italic" }}>real.</em>
        </h2>
      </Reveal>
      <div className="rq-test-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
        {TESTIMONIALS.map((t, i) => (
          <Reveal key={i} delay={i * 0.13}>
            <motion.div
              whileHover={{ y: -8, boxShadow: `0 32px 70px ${t.color}18` }}
              style={{
                background: c.surface, border: `1px solid ${c.border}`,
                borderRadius: 26, padding: 32, transition: "box-shadow 0.35s",
              }}
            >
              <div style={{ color: c.amber, fontSize: 14, marginBottom: 18, letterSpacing: 2 }}>★★★★★</div>
              <p style={{
                fontFamily: "'Fraunces', serif", fontSize: 16.5, color: c.text,
                lineHeight: 1.62, fontStyle: "italic", marginBottom: 24,
              }}>"{t.text}"</p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  style={{
                    width: 44, height: 44, borderRadius: "50%",
                    background: `linear-gradient(135deg,${t.color},${t.color}88)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0,
                    fontFamily: "'Cabinet Grotesk', sans-serif",
                  }}
                >{t.av}</motion.div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: c.text }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: c.text3, marginTop: 2 }}>{t.role}</div>
                </div>
              </div>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════
   NEWSLETTER
══════════════════════════════════════════════════ */
const Newsletter = ({ c }) => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!email.includes('@')) { alert('Please enter a valid email'); return; }
    setLoading(true);
    const templateParams = {
      user_email: email,
      project_name: "ResQPlate",
      signup_date: new Date().toLocaleDateString(),
    };
    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        templateParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );
      setSent(true);
    } catch (error) {
      console.error('EmailJS Error:', error);
      alert('Subscription failed. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={{ background: c.bg, padding: "80px 32px", borderTop: `1px solid ${c.border}`, borderBottom: `1px solid ${c.border}` }}>
      <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center", minHeight: "320px" }}>
        <Reveal>
          <span style={{
            display: "inline-block", background: c.leafm, color: "#fff",
            fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.15em",
            padding: "6px 16px", borderRadius: 100, marginBottom: 18,
          }}>STAY UPDATED</span>
          <h3 style={{
            fontFamily: "'Fraunces', serif", fontSize: "clamp(26px,3.5vw,40px)",
            fontWeight: 900, color: c.text, marginBottom: 14, lineHeight: 1.1,
          }}>Get impact stories in your inbox</h3>
          <p style={{ fontSize: 15, color: c.text2, marginBottom: 36, lineHeight: 1.75 }}>
            Monthly reports on meals rescued, CO₂ saved, and communities served — no spam, ever.
          </p>
          <div className="rq-nl-form" style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: 10, maxWidth: 460, margin: "0 auto 20px",
          }}>
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com" readOnly={sent}
              style={{
                flex: 1, padding: "13px 20px", borderRadius: 100,
                border: `1.5px solid ${sent ? c.leafm : c.border2}`,
                background: c.surface, fontFamily: "'Cabinet Grotesk', sans-serif",
                fontSize: 14, color: sent ? c.text3 : c.text, outline: "none", transition: "all 0.3s ease",
              }}
            />
            <motion.button
              whileHover={!sent && !loading ? { background: c.leaf, scale: 1.02 } : {}}
              whileTap={!sent && !loading ? { scale: 0.98 } : {}}
              onClick={handleSubscribe} disabled={loading || sent}
              style={{
                background: sent ? c.leaf : c.leafm, color: "#fff", border: "none",
                padding: "13px 28px", borderRadius: 100,
                fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 600, fontSize: 14,
                cursor: loading || sent ? "default" : "pointer", whiteSpace: "nowrap",
                minWidth: "140px", display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background 0.5s ease",
              }}
            >{loading ? "Joining..." : sent ? "Subscribed! 🎉" : "Subscribe"}</motion.button>
          </div>
          <AnimatePresence>
            {sent && (
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 700, color: c.leafm, marginTop: 15 }}
              >
                🎉 Welcome to the movement! Check your inbox.
              </motion.div>
            )}
          </AnimatePresence>
        </Reveal>
      </div>
    </section>
  );
};

/* ══════════════════════════════════════════════════
   PARTNERS
══════════════════════════════════════════════════ */
const Partners = ({ c }) => (
  <section style={{ background: c.bg2, padding: "60px 32px", borderBottom: `1px solid ${c.border}` }}>
    <div style={{ maxWidth: 920, margin: "0 auto", textAlign: "center" }}>
      <Reveal>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.15em", color: c.text3, textTransform: "uppercase", marginBottom: 32 }}>
          TRUSTED BY
        </div>
      </Reveal>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 44, flexWrap: "wrap" }}>
        {["Food Corp India", "Akshaya Patra", "Feeding India", "Zomato Feeding", "FSSAI"].map((name, i) => (
          <Reveal key={i} delay={i * 0.08}>
            <Link to="/about">
              <motion.div
                whileHover={{ opacity: 1, scale: 1.06 }}
                style={{
                  fontFamily: "'Fraunces', serif", fontSize: 15, fontWeight: 700,
                  color: c.text2, opacity: 0.45, letterSpacing: "0.01em",
                  cursor: "pointer", fontStyle: "italic",
                }}
              >{name}</motion.div>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════
   CTA
══════════════════════════════════════════════════ */
const CTA = ({ c }) => (
  <section style={{
    background: c.heroBg, padding: "130px 32px", textAlign: "center",
    position: "relative", overflow: "hidden", transition: "background 0.45s",
  }}>
    <Particles c={c} />
    <LeafDeco c={c} style={{ width: 320, top: -60, left: -80, opacity: 0.5, transform: "rotate(-25deg)" }} />
    <LeafDeco c={c} style={{ width: 260, bottom: -30, right: -50, opacity: 0.4, transform: "rotate(150deg)" }} />
    <svg style={{ position: "absolute", bottom: -100, right: -100, width: 500, opacity: 0.05, pointerEvents: "none" }} viewBox="0 0 400 400">
      <circle cx="200" cy="200" r="180" stroke={c.amber} strokeWidth="50" fill="none" />
      <circle cx="200" cy="200" r="120" stroke={c.sage} strokeWidth="30" fill="none" opacity="0.6" />
    </svg>
    <div style={{ maxWidth: 720, margin: "0 auto", position: "relative", zIndex: 1 }}>
      <Reveal>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.18em", color: "rgba(149,213,178,0.7)", marginBottom: 22 }}>
          JOIN THE MOVEMENT
        </div>
        <h2 style={{
          fontFamily: "'Fraunces', serif", fontSize: "clamp(44px,7vw,88px)",
          fontWeight: 900, color: "#fff", lineHeight: 0.95, marginBottom: 24, letterSpacing: "-0.03em",
        }}>
          Ready to rescue<br />your first meal?
        </h2>
        <p style={{ fontSize: 17, color: "rgba(255,255,255,0.55)", marginBottom: 52, fontWeight: 300, lineHeight: 1.78 }}>
          Join 1,200+ donors and 50 NGOs already making India's food system more human.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/register?role=donor">
            <motion.button
              whileHover={{ background: c.gold, transform: "translateY(-3px)", boxShadow: "0 24px 56px rgba(232,168,56,0.45)" }}
              whileTap={{ scale: 0.97 }}
              style={{
                padding: "18px 46px", borderRadius: 100, border: "none",
                background: c.amber, color: c.leaf,
                fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 700, fontSize: 16, cursor: "pointer",
              }}
            >Start Donating →</motion.button>
          </Link>
          <Link to="/register?role=ngo">
            <motion.button
              whileHover={{ background: "rgba(255,255,255,0.14)" }}
              whileTap={{ scale: 0.97 }}
              style={{
                padding: "18px 46px", borderRadius: 100,
                border: "1px solid rgba(255,255,255,0.22)",
                background: "rgba(255,255,255,0.07)", color: "#fff",
                fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 16, cursor: "pointer",
              }}
            >Request Food</motion.button>
          </Link>
        </div>
        <div style={{ display: "flex", gap: 28, justifyContent: "center", marginTop: 36, flexWrap: "wrap" }}>
          {[
            { label: "Learn More",     to: "/about"           },
            { label: "Contact Us",     to: "/contact"         },
            { label: "Browse Listings", to: "/dashboard/search" },
          ].map((l) => (
            <Link key={l.label} to={l.to}>
              <motion.span
                whileHover={{ color: c.mint }}
                style={{
                  fontSize: 13, color: "rgba(255,255,255,0.38)",
                  fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em",
                  cursor: "pointer", transition: "color 0.2s",
                }}
              >{l.label}</motion.span>
            </Link>
          ))}
        </div>
      </Reveal>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════
   FOOTER
══════════════════════════════════════════════════ */
const FOOTER_COLS = [
  {
    title: "Platform",
    links: [
      { label: "How it Works", to: "#how"                     },
      { label: "Browse Food",  to: "/dashboard/search"        },
      { label: "Volunteer",    to: "/register?role=volunteer"  },
      { label: "Live Map",     to: "/map"                     },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About",   to: "/about"   },
      { label: "Contact", to: "/contact" },
      { label: "Blog",    to: "/about"   },
      { label: "Careers", to: "/contact" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign Up",       to: "/register"         },
      { label: "Log In",        to: "/login"            },
      { label: "Dashboard",     to: "/dashboard"        },
      { label: "Order History", to: "/dashboard/orders" },
    ],
  },
];

const Footer = ({ c }) => (
  <footer style={{ background: "#0a1a0d", color: "rgba(255,255,255,0.4)", padding: "76px 32px 44px" }}>
    <div className="rq-footer-grid" style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 44, marginBottom: 56 }}>
      <div>
        <Link to="/">
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 25, fontWeight: 900, color: "#fff", marginBottom: 14, display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
            <span style={{ fontSize: 20 }}>🍃</span>
            ResQ<span style={{ color: c.amber }}>Plate</span>
          </div>
        </Link>
        <p style={{ fontSize: 14, lineHeight: 1.78, maxWidth: 280, marginBottom: 22 }}>
          Connecting surplus food with families in need. Building a hunger-free India, one rescue at a time.
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          {[{ icon: "🐦", href: "https://x.com/itsSalonyy" }, { icon: "📸", href: "https://salonyranjan.github.io/" }, { icon: "💼", href: "https://www.linkedin.com/in/salony-ranjan-b63200280/" }].map(({ icon, href }) => (
            <motion.a
              key={icon} href={href} target="_blank" rel="noopener noreferrer"
              whileHover={{ scale: 1.15, background: "rgba(255,255,255,0.14)" }}
              style={{
                width: 38, height: 38, borderRadius: "50%",
                background: "rgba(255,255,255,0.07)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, cursor: "pointer", textDecoration: "none",
              }}
            >{icon}</motion.a>
          ))}
        </div>
      </div>

      {FOOTER_COLS.map((col) => (
        <div key={col.title}>
          <div style={{ fontSize: 11, fontWeight: 500, color: "#fff", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 18, fontFamily: "'DM Mono', monospace" }}>
            {col.title}
          </div>
          {col.links.map((l) => (
            <Link key={l.label} to={l.to}>
              <motion.div
                whileHover={{ x: 4, color: "#fff" }}
                style={{ fontSize: 14, marginBottom: 11, cursor: "pointer", transition: "color 0.2s", color: "rgba(255,255,255,0.4)" }}
              >{l.label}</motion.div>
            </Link>
          ))}
        </div>
      ))}
    </div>

    <div style={{ maxWidth: 1100, margin: "0 auto", borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 28, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12 }}>© 2026 ResQPlate · Built for Social Good</span>
      <div style={{ display: "flex", gap: 20 }}>
        <Link to="/contact"><span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, cursor: "pointer" }}>Privacy</span></Link>
        <Link to="/contact"><span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, cursor: "pointer" }}>Terms</span></Link>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: c.sage }}>🌿 Carbon-neutral operations</span>
      </div>
    </div>
  </footer>
);

/* ══════════════════════════════════════════════════
   ROOT EXPORT
══════════════════════════════════════════════════ */
const Landing = () => {
  const { dark, toggle } = useDarkMode();
  const c = C(dark);

  return (
    <>
      <FontLoader />
      <GlobalStyles c={c} />
      <Grain />
      <ScrollProgress c={c} />
      <Ticker c={c} />
      <NavBar c={c} dark={dark} toggleDark={toggle} />
      <Hero c={c} />
      <Stats c={c} />
      <Mission c={c} />
      <Features c={c} />
      <HowItWorks c={c} />
      <ImpactMap c={c} />
      <Testimonials c={c} />
      <Newsletter c={c} />
      <Partners c={c} />
      <CTA c={c} />
      <Footer c={c} />
    </>
  );
};

export default Landing;
