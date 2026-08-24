import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import Logo from "./Logo";
import { motion as Motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useMemo } from "react";
import emailjs from "@emailjs/browser";

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
      section:has(.rq-remove-live-impact) { display: none !important; }

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
        .rq-hero-grid { grid-template-columns: minmax(0, 1fr) !important; min-width: 0; text-align: center; }
        .rq-hero-grid > * { min-width: 0; }
        .rq-card-col { width: min(100%, 380px); max-width: 100%; margin: 0 auto; }
        .rq-hero-sub { margin-left: auto !important; margin-right: auto !important; }
        .rq-hero-btns { justify-content: center !important; }
        .rq-stats-grid { grid-template-columns: repeat(2,1fr) !important; }
        .rq-feat-grid { grid-template-columns: 1fr 1fr !important; }
        .rq-how-grid { grid-template-columns: 1fr 1fr !important; }
        .rq-how-line { display: none !important; }
        .rq-map-grid { grid-template-columns: 1fr !important; }
        .rq-test-grid { grid-template-columns: 1fr !important; }
        .rq-footer-grid { grid-template-columns: 1fr 1fr !important; }
        .rq-feat-header { justify-content: center !important; text-align: center; }
        .rq-nl-form { flex-direction: column !important; align-items: center !important; }
        .rq-mob-hide { display: none !important; }
      }
      @media (max-width: 620px) {
        .rq-stats-grid { grid-template-columns: 1fr 1fr !important; padding: 32px 20px !important; }
        .rq-feat-grid { grid-template-columns: 1fr !important; }
        .rq-how-grid { grid-template-columns: 1fr !important; }
        .rq-footer-grid { grid-template-columns: 1fr !important; flex-direction: column; align-items: flex-start !important; padding-bottom: 28px !important; }
        .rq-footer-bottom { align-items: flex-start !important; flex-direction: column !important; }
        .rq-site-footer { padding: 38px 18px 24px !important; }
        .rq-hero { min-height: auto !important; padding: 70px 18px 92px !important; }
        .rq-hero-title { max-width: 100%; font-size: clamp(38px, 13vw, 54px) !important; line-height: .96 !important; overflow-wrap: anywhere; }
        .rq-hero-sub { max-width: 100% !important; }
        .rq-hero-btns { margin-bottom: 20px !important; }
        .rq-hero-btns > a { flex: 1 1 100%; }
        .rq-hero-btns button { width: 100%; }
        .rq-card-col { width: 100% !important; padding: 10px 0 24px !important; }
      }

      /* Mobile drawer scroll lock */
      body.rq-drawer-open { overflow: hidden; }
    `;
    document.head.appendChild(style);
    return () => { document.getElementById("rq-global")?.remove(); };
  }, [c.bg]);
  return null;
};

const Grain = () => (
  <div style={{
    position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999, opacity: 0.022,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
  }} />
);

const ScrollProgress = ({ c }) => {
  const { scrollYProgress } = useScroll();
  return (
    <Motion.div style={{
      position: "fixed", top: 0, left: 0, right: 0, height: 2,
      background: `linear-gradient(90deg, ${c.amber}, ${c.sage}, ${c.mint})`,
      transformOrigin: "0%", scaleX: scrollYProgress, zIndex: 10001,
    }} />
  );
};

const TICKS = [
  "🍱 Good food deserves a second destination",
  "🤝 Make surplus visible, useful, and easier to collect",
  "🌿 Waste less. Share more. Strengthen communities",
  "📍 Local food rescue begins with one honest listing",
  "🍲 Every safe meal should have the chance to be shared",
  "🫶 Technology should make generosity easier",
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
        <Motion.span
          animate={{ opacity: [1, 0.3, 1], scale: [1, 1.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ width: 6, height: 6, borderRadius: "50%", background: c.leaf, display: "inline-block", flexShrink: 0 }}
        />
        <AnimatePresence mode="wait">
          <Motion.span
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >{TICKS[idx]}</Motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
};

const Reveal = ({ children, delay = 0, y = 36, x = 0, style = {} }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <Motion.div
      ref={ref}
      initial={{ opacity: 0, y, x }}
      animate={inView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 0.82, delay, ease: [0.22, 1, 0.36, 1] }}
      style={style}
    >
      {children}
    </Motion.div>
  );
};

const LeafDeco = ({ c, style }) => (
  <svg viewBox="0 0 120 180" fill="none" style={{ position: "absolute", pointerEvents: "none", ...style }}>
    <path d="M60 175 C15 140 -5 90 8 42 C21 -6 65 2 95 36 C125 70 118 130 60 175Z"
      fill={c.sage} opacity="0.10" />
    <path d="M60 175 L60 55" stroke={c.sage} strokeWidth="1.5" opacity="0.15" />
  </svg>
);

const Particles = ({ c }) => {
  const particles = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: (i * 37 + 11) % 100,
      y: (i * 61 + 7) % 100,
      size: 2 + (i % 5) * 0.8,
      dur: 5 + (i % 7),
      delay: (i % 6) * 0.5,
      up: i % 2 === 0,
    })), []
  );
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {particles.map((p) => (
        <Motion.div
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

const NAV_LINKS = [
  { label: "Home",         href: "#hero",     icon: "⬡", emoji: "🏠" },
  { label: "Features",     href: "#features", icon: "◈", emoji: "✨" },
  { label: "How It Works", href: "#how",      icon: "◎", emoji: "⚙️" },
];

/* Magnetic link — desktop only */
const MagneticLink = ({ children, href, isActive, onClick, dark }) => {
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
      <Motion.button
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
        <AnimatePresence>
          {(isActive || hovered) && (
            <Motion.div
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
                  : (dark ? "rgba(82,183,136,0.07)" : "rgba(26,74,46,0.05)"),
                border: isActive
                  ? `1px solid ${dark ? "rgba(82,183,136,0.28)" : "rgba(26,74,46,0.18)"}`
                  : "1px solid transparent",
                pointerEvents: "none",
              }}
            />
          )}
        </AnimatePresence>

        <Motion.span
          animate={isActive
            ? { scale: [1, 1.6, 1], opacity: [0.9, 0.4, 0.9] }
            : { scale: 1, opacity: hovered ? 0.6 : 0 }}
          transition={isActive ? { duration: 2.4, repeat: Infinity } : { duration: 0.2 }}
          style={{
            width: 5, height: 5, borderRadius: "50%", flexShrink: 0,
            background: dark ? "#52b788" : "#2d6a4f",
            display: "inline-block",
            boxShadow: isActive && dark ? "0 0 8px #52b788" : "none",
          }}
        />
        <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
        {isActive && (
          <Motion.div
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
      </Motion.button>
    </a>
  );
};

/* Firefly particle */
const NavFirefly = ({ dark, index }) => {
  const x = 15 + index * 18 + (index * 7) % 8;
  return (
    <Motion.div
      style={{
        position: "absolute", left: `${x}%`, top: "50%",
        width: 3, height: 3, borderRadius: "50%",
        background: dark ? "#52b788" : "#2d6a4f",
        pointerEvents: "none",
        boxShadow: dark ? "0 0 6px #52b788" : "0 0 4px #2d6a4f",
      }}
      animate={{ y: [-8, 8, -8], x: [-4, 4, -4], opacity: [0, 0.7, 0], scale: [0.5, 1, 0.5] }}
      transition={{ duration: 3 + index * 0.7, repeat: Infinity, delay: index * 0.9, ease: "easeInOut" }}
    />
  );
};

/* ── Animated Hamburger Icon ── */
const HamburgerIcon = ({ open, dark }) => {
  const color = dark ? "#95d5b2" : "#2d6a4f";
  return (
    <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
      <Motion.rect
        x="0" y="0" width="22" height="2" rx="1" fill={color}
        animate={open ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
        style={{ originX: "11px", originY: "1px" }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      />
      <Motion.rect
        x="0" y="7" width="22" height="2" rx="1" fill={color}
        animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
        style={{ originX: "11px", originY: "8px" }}
        transition={{ duration: 0.22, ease: "easeInOut" }}
      />
      <Motion.rect
        x="0" y="14" width="22" height="2" rx="1" fill={color}
        animate={open ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
        style={{ originX: "11px", originY: "15px" }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  );
};

/* ── Mobile Drawer ── */
const MobileDrawer = ({ open, onClose, activeIdx, setActiveIdx, dark, toggleDark }) => {
  useEffect(() => {
    if (open) document.body.classList.add("rq-drawer-open");
    else document.body.classList.remove("rq-drawer-open");
    return () => document.body.classList.remove("rq-drawer-open");
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <Motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            style={{
              position: "fixed", inset: 0, zIndex: 1100,
              background: "rgba(0,0,0,0.65)",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
            }}
          />

          {/* Drawer panel */}
          <Motion.div
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 340, damping: 32, mass: 0.9 }}
            style={{
              position: "fixed", top: 0, right: 0, bottom: 0,
              width: "min(320px, 85vw)", zIndex: 1200,
              background: dark
                ? "linear-gradient(160deg, #070f09 0%, #0c1a0e 60%, #050d07 100%)"
                : "linear-gradient(160deg, #f7f2e8 0%, #ede8db 60%, #e0d9cb 100%)",
              borderLeft: `1px solid ${dark ? "rgba(82,183,136,0.15)" : "rgba(26,74,46,0.12)"}`,
              boxShadow: dark
                ? "-32px 0 80px rgba(0,0,0,0.6), -1px 0 0 rgba(82,183,136,0.1)"
                : "-24px 0 60px rgba(26,74,46,0.15)",
              display: "flex", flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Top glow orb */}
            <div style={{
              position: "absolute", top: -60, right: -60,
              width: 200, height: 200, borderRadius: "50%",
              background: dark
                ? "radial-gradient(circle, rgba(82,183,136,0.12) 0%, transparent 70%)"
                : "radial-gradient(circle, rgba(45,106,79,0.10) 0%, transparent 70%)",
              pointerEvents: "none",
            }} />

            {/* Header */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "22px 24px 20px",
              borderBottom: `1px solid ${dark ? "rgba(82,183,136,0.10)" : "rgba(26,74,46,0.09)"}`,
            }}>
              {/* Logo */}
              <Link to="/" onClick={onClose}>
                <div style={{
                  fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 900,
                  color: dark ? "#e8f5ec" : "#111c15",
                  display: "flex", alignItems: "center", gap: 8,
                }}>
                  <Motion.span
                    animate={{ rotate: [0, 10, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >🍃</Motion.span>
                  ResQ<span style={{ color: dark ? "#f59e0b" : "#e8a838" }}>Plate</span>
                </div>
              </Link>
              {/* Close button */}
              <Motion.button
                whileTap={{ scale: 0.88 }}
                onClick={onClose}
                style={{
                  width: 38, height: 38, borderRadius: "50%",
                  border: `1px solid ${dark ? "rgba(82,183,136,0.18)" : "rgba(26,74,46,0.14)"}`,
                  background: dark ? "rgba(82,183,136,0.07)" : "rgba(26,74,46,0.06)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: dark ? "#95d5b2" : "#2d6a4f", fontSize: 16, cursor: "pointer",
                }}
              >✕</Motion.button>
            </div>

            {/* Nav links */}
            <nav style={{ flex: 1, padding: "12px 16px", overflowY: "auto" }}>
              {NAV_LINKS.map((l, i) => (
                <Motion.div
                  key={l.label}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 + i * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  <a href={l.href} onClick={() => { setActiveIdx(i); onClose(); }}>
                    <Motion.div
                      whileTap={{ scale: 0.97, x: 4 }}
                      style={{
                        display: "flex", alignItems: "center", gap: 14,
                        padding: "14px 16px", borderRadius: 16, marginBottom: 4,
                        cursor: "pointer",
                        background: activeIdx === i
                          ? (dark
                            ? "linear-gradient(135deg, rgba(45,106,79,0.45), rgba(82,183,136,0.12))"
                            : "linear-gradient(135deg, rgba(45,106,79,0.10), rgba(82,183,136,0.07))")
                          : "transparent",
                        border: `1px solid ${activeIdx === i
                          ? (dark ? "rgba(82,183,136,0.22)" : "rgba(26,74,46,0.16)")
                          : "transparent"}`,
                        transition: "all 0.22s",
                      }}
                    >
                      {/* Emoji icon in pill */}
                      <div style={{
                        width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                        background: activeIdx === i
                          ? (dark ? "rgba(82,183,136,0.22)" : "rgba(45,106,79,0.12)")
                          : (dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"),
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 18,
                        border: `1px solid ${activeIdx === i
                          ? (dark ? "rgba(82,183,136,0.3)" : "rgba(45,106,79,0.2)")
                          : (dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)")}`,
                        transition: "all 0.22s",
                      }}>{l.emoji}</div>

                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontFamily: "'Cabinet Grotesk', sans-serif",
                          fontSize: 15, fontWeight: activeIdx === i ? 700 : 500,
                          color: activeIdx === i
                            ? (dark ? "#95d5b2" : "#1a4a2e")
                            : (dark ? "rgba(232,245,236,0.7)" : "rgba(17,28,21,0.65)"),
                          transition: "color 0.22s",
                        }}>{l.label}</div>
                      </div>

                      {/* Active chevron */}
                      <Motion.div
                        animate={activeIdx === i ? { x: [0, 3, 0], opacity: 1 } : { opacity: 0.25 }}
                        transition={activeIdx === i ? { duration: 1.8, repeat: Infinity } : {}}
                        style={{
                          color: activeIdx === i
                            ? (dark ? "#52b788" : "#2d6a4f")
                            : (dark ? "rgba(82,183,136,0.25)" : "rgba(45,106,79,0.25)"),
                          fontSize: 12,
                        }}
                      >›</Motion.div>
                    </Motion.div>
                  </a>
                </Motion.div>
              ))}

              {/* Divider */}
              <div style={{
                height: 1, margin: "16px 8px",
                background: dark ? "rgba(82,183,136,0.10)" : "rgba(26,74,46,0.09)",
              }} />

              {/* Quick actions */}
              <Motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.44, duration: 0.45 }}
              >
                <div style={{
                  fontFamily: "'DM Mono', monospace", fontSize: 10,
                  letterSpacing: "0.12em", textTransform: "uppercase",
                  color: dark ? "rgba(82,183,136,0.4)" : "rgba(26,74,46,0.4)",
                  padding: "0 16px", marginBottom: 10,
                }}>Quick Actions</div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "0 4px" }}>
                  <Link to="/register?role=donor" onClick={onClose}>
                    <Motion.div
                      whileTap={{ scale: 0.97 }}
                      style={{
                        background: dark ? "#f59e0b" : "#e8a838",
                        color: dark ? "#0a1a0d" : "#1a3d26",
                        borderRadius: 14, padding: "13px 18px",
                        fontFamily: "'Cabinet Grotesk', sans-serif",
                        fontWeight: 700, fontSize: 14,
                        display: "flex", alignItems: "center", gap: 10,
                        cursor: "pointer",
                      }}
                    >
                      <span style={{ fontSize: 18 }}>🍱</span>
                      Donate Food
                      <span style={{ marginLeft: "auto" }}>→</span>
                    </Motion.div>
                  </Link>

                  <Link to="/register?role=ngo" onClick={onClose}>
                    <Motion.div
                      whileTap={{ scale: 0.97 }}
                      style={{
                        background: dark ? "rgba(82,183,136,0.12)" : "rgba(45,106,79,0.08)",
                        border: `1px solid ${dark ? "rgba(82,183,136,0.22)" : "rgba(45,106,79,0.16)"}`,
                        color: dark ? "#95d5b2" : "#2d6a4f",
                        borderRadius: 14, padding: "13px 18px",
                        fontFamily: "'Cabinet Grotesk', sans-serif",
                        fontWeight: 600, fontSize: 14,
                        display: "flex", alignItems: "center", gap: 10,
                        cursor: "pointer",
                      }}
                    >
                      <span style={{ fontSize: 18 }}>🤝</span>
                      Request Food
                      <span style={{ marginLeft: "auto" }}>→</span>
                    </Motion.div>
                  </Link>
                </div>
              </Motion.div>
            </nav>

            {/* Footer */}
            <Motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{
                padding: "16px 24px 28px",
                borderTop: `1px solid ${dark ? "rgba(82,183,136,0.10)" : "rgba(26,74,46,0.09)"}`,
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}
            >
              {/* Theme toggle */}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{
                  fontFamily: "'DM Mono', monospace", fontSize: 11,
                  color: dark ? "rgba(149,213,178,0.5)" : "rgba(74,94,82,0.5)",
                }}>
                  {dark ? "Dark Mode" : "Light Mode"}
                </span>
                <Motion.button
                  onClick={toggleDark}
                  whileTap={{ scale: 0.9 }}
                  style={{
                    width: 44, height: 26, borderRadius: 13,
                    background: dark ? "rgba(82,183,136,0.25)" : "rgba(45,106,79,0.12)",
                    border: `1px solid ${dark ? "rgba(82,183,136,0.35)" : "rgba(45,106,79,0.2)"}`,
                    position: "relative", cursor: "pointer", padding: 0,
                    transition: "all 0.3s",
                  }}
                >
                  <Motion.div
                    animate={{ x: dark ? 20 : 2 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    style={{
                      width: 20, height: 20, borderRadius: "50%",
                      position: "absolute", top: 2,
                      background: dark
                        ? "linear-gradient(135deg, #f59e0b, #fbbf24)"
                        : "linear-gradient(135deg, #2d6a4f, #52b788)",
                      boxShadow: dark
                        ? "0 2px 8px rgba(245,158,11,0.5)"
                        : "0 2px 8px rgba(45,106,79,0.4)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 10,
                    }}
                  >
                    {dark ? "☀" : "☾"}
                  </Motion.div>
                </Motion.button>
              </div>

              {/* Live indicator */}
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{
                    width: 6, height: 6, borderRadius: "50%",
                    background: "#52b788",
                    boxShadow: "0 0 8px rgba(82,183,136,0.7)",
                  }}
                />
                <span style={{
                  fontFamily: "'DM Mono', monospace", fontSize: 10,
                  color: dark ? "#52b788" : "#2d6a4f", fontWeight: 500,
                }}>47 live</span>
              </div>
            </Motion.div>
          </Motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

/* ── Main NavBar ── */
const NavBar = ({ c, dark, toggleDark }) => {
  const [scrolled, setScrolled] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [scrollPct, setScrollPct] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);

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
      /* Hide desktop links on mobile */
      .rq-nav-desktop { display: flex; }
      .rq-nav-desktop-fireflies { display: flex; }
      .rq-nav-desktop-toggle { display: flex; }
      .rq-nav-ham { display: none; }

      @media (max-width: 860px) {
        .rq-nav-desktop { display: none !important; }
        .rq-nav-desktop-fireflies { display: none !important; }
        .rq-nav-desktop-toggle { display: none !important; }
        .rq-nav-ham { display: flex !important; }
      }
    `;
    document.head.appendChild(s);
    return () => document.getElementById("rq-nav-kf")?.remove();
  }, [dark]);

  const aurora1 = dark ? "rgba(45,106,79,0.35)"  : "rgba(45,106,79,0.18)";
  const aurora2 = dark ? "rgba(82,183,136,0.22)" : "rgba(82,183,136,0.12)";
  const aurora3 = dark ? "rgba(149,213,178,0.12)": "rgba(149,213,178,0.08)";

  return (
    <>
      <Motion.nav
        initial={{ y: -90, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 24, delay: 0.08 }}
        style={{
          position: "sticky", top: 0, zIndex: 1000,
          height: 68,
          background: scrolled
            ? (dark ? "rgba(5,12,7,0.88)" : "rgba(245,240,230,0.88)")
            : "transparent",
          backdropFilter: scrolled ? "blur(28px) saturate(200%) brightness(1.04)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(28px) saturate(200%) brightness(1.04)" : "none",
          borderBottom: scrolled
            ? `1px solid ${dark ? "rgba(82,183,136,0.16)" : "rgba(26,74,46,0.12)"}`
            : "1px solid transparent",
          boxShadow: scrolled
            ? (dark
              ? "0 1px 0 rgba(82,183,136,0.06), 0 8px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(82,183,136,0.08)"
              : "0 1px 0 rgba(26,74,46,0.05), 0 8px 32px rgba(26,74,46,0.10)")
            : "none",
          transition: "background 0.5s, border-color 0.5s, box-shadow 0.5s",
          overflow: "hidden",
        }}
      >
        {/* Aurora sweep */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden",
          opacity: scrolled ? 1 : 0, transition: "opacity 0.6s",
        }}>
          <div style={{
            position: "absolute", top: "-60%", left: "0%",
            width: "140%", height: "220%", borderRadius: "50%",
            background: `radial-gradient(ellipse 60% 50% at 35% 50%, ${aurora1}, ${aurora2} 40%, ${aurora3} 65%, transparent 80%)`,
            animation: "rqAurora 9s ease-in-out infinite",
            filter: "blur(18px)",
          }} />
        </div>

        {/* Seed floaters */}
        {scrolled && [0,1,2,3,4].map(i => (
          <div key={i} style={{
            position: "absolute", left: `${10 + i * 18}%`, bottom: 0,
            width: 4, height: 4, borderRadius: "50%",
            background: dark ? "rgba(82,183,136,0.6)" : "rgba(45,106,79,0.5)",
            pointerEvents: "none",
            animation: `rqSeedFloat ${3.5 + i * 0.8}s ease-in-out infinite ${i * 1.1}s`,
          }} />
        ))}

        {/* Progress filament */}
        <Motion.div style={{
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

        {/* Main row — 3-column grid for perfect centering */}
        <div style={{
          maxWidth: 1240, margin: "0 auto", padding: "0 24px", height: "100%",
          display: "grid", gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          position: "relative", zIndex: 2,
        }}>

          {/* LEFT — logo (visible on mobile, hidden offset on desktop) */}
          <div>
            {/* Mobile logo */}
            <div className="rq-nav-ham" style={{ display: "none", alignItems: "center" }}>
              <Link to="/">
                <Motion.div
                  whileTap={{ scale: 0.96 }}
                  style={{
                    fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 900,
                    color: dark ? "#e8f5ec" : "#111c15",
                    display: "flex", alignItems: "center", gap: 8,
                  }}
                >
                  <Motion.span
                    animate={{ rotate: [0, 8, -4, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  >🍃</Motion.span>
                  ResQ<span style={{ color: dark ? "#f59e0b" : "#e8a838" }}>Plate</span>
                </Motion.div>
              </Link>
            </div>
          </div>

          {/* CENTRE — desktop nav links */}
          <div
            className="rq-nav-desktop"
            style={{ alignItems: "center", gap: 2, justifyContent: "center" }}
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

          {/* RIGHT */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "flex-end" }}>

            {/* Desktop: fireflies + orbital toggle */}
            <div className="rq-nav-desktop-fireflies" style={{ alignItems: "center", gap: 14 }}>
              <div style={{ position: "relative", width: 48, height: 36, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {[0, 1, 2].map(i => <NavFirefly key={i} c={c} dark={dark} index={i} />)}
              </div>
            </div>

            <div className="rq-nav-desktop-toggle" style={{ alignItems: "center" }}>
              <Motion.button
                onClick={toggleDark}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92, rotate: 15 }}
                style={{
                  position: "relative", width: 44, height: 44, borderRadius: "50%",
                  border: "none", background: "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", flexShrink: 0, overflow: "visible",
                }}
              >
                <Motion.div
                  animate={{ rotate: dark ? 0 : 180 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    position: "absolute", inset: 0, borderRadius: "50%",
                    border: `1.5px solid ${dark ? "rgba(82,183,136,0.35)" : "rgba(26,74,46,0.25)"}`,
                  }}
                >
                  <Motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                    style={{ position: "absolute", inset: 0, borderRadius: "50%" }}
                  >
                    <div style={{
                      position: "absolute", top: -3, left: "50%", transform: "translateX(-50%)",
                      width: 6, height: 6, borderRadius: "50%",
                      background: dark ? "#f59e0b" : "#2d6a4f",
                      boxShadow: dark ? "0 0 8px #f59e0b, 0 0 16px rgba(245,158,11,0.5)" : "0 0 6px #2d6a4f",
                    }} />
                  </Motion.div>
                </Motion.div>
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
                    <Motion.span
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
                    </Motion.span>
                  </AnimatePresence>
                </div>
              </Motion.button>
            </div>

            {/* Mobile: hamburger button */}
            <Motion.button
              className="rq-nav-ham"
              onClick={() => setDrawerOpen(true)}
              whileTap={{ scale: 0.88 }}
              style={{
                display: "none",
                width: 44, height: 44, borderRadius: 14,
                border: `1px solid ${dark ? "rgba(82,183,136,0.20)" : "rgba(26,74,46,0.14)"}`,
                background: dark ? "rgba(82,183,136,0.07)" : "rgba(26,74,46,0.05)",
                alignItems: "center", justifyContent: "center",
                cursor: "pointer", flexShrink: 0,
              }}
            >
              <HamburgerIcon open={false} dark={dark} />
            </Motion.button>
          </div>
        </div>
      </Motion.nav>

      {/* Mobile Drawer */}
      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        activeIdx={activeIdx}
        setActiveIdx={setActiveIdx}
        c={c}
        dark={dark}
        toggleDark={toggleDark}
      />
    </>
  );
};

const GAME_ITEMS = [
  { id: "rice", icon: "🍚", label: "Rice", points: 10 },
  { id: "dal", icon: "🥣", label: "Dal", points: 10 },
  { id: "veg", icon: "🥕", label: "Veggies", points: 10 },
  { id: "bread", icon: "🥖", label: "Bread", points: 10 },
  { id: "spoiled", icon: "🗑️", label: "Spoiled", hazard: true },
  { id: "plastic", icon: "🥤", label: "Plastic", hazard: true },
];

const FoodCard = () => {
  const [rescued, setRescued] = useState([]);
  const [message, setMessage] = useState("Tap edible food. Skip the waste!");
  const completed = rescued.length === 4;

  const chooseItem = (item) => {
    if (completed) return;
    if (item.hazard) {
      setMessage("Not for the plate — try another!");
      return;
    }
    if (rescued.includes(item.id)) return;
    const next = [...rescued, item.id];
    setRescued(next);
    setMessage(next.length === 4 ? "Meal rescued! You made an impact." : `${next.length} of 4 foods rescued`);
  };

  const resetGame = () => {
    setRescued([]);
    setMessage("Tap edible food. Skip the waste!");
  };

  return (
    <div className="rq-card-col" style={{ position: "relative", padding: "18px 8px 30px 22px" }}>
      <Motion.div
        initial={{ opacity: 0, scale: .94, rotate: 2 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: .65, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: "relative", overflow: "hidden", borderRadius: 30, padding: 22, background: "rgba(255,255,255,.97)", border: "1px solid rgba(255,255,255,.55)", boxShadow: "0 42px 100px rgba(0,0,0,.28)", color: "#173222" }}
      >
        <div style={{ position: "absolute", width: 180, height: 180, right: -80, top: -95, borderRadius: "50%", background: "rgba(82,183,136,.14)" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative" }}>
          <div>
            <div style={{ color: "#2d6a4f", font: "700 9px 'DM Mono', monospace", letterSpacing: ".14em", textTransform: "uppercase" }}>30-second game</div>
            <h3 style={{ margin: "6px 0 0", font: "800 20px 'Cabinet Grotesk', sans-serif", letterSpacing: "-.02em" }}>Build a rescue plate</h3>
          </div>
          <div style={{ padding: "7px 10px", borderRadius: 12, background: "#e8f5ec", color: "#246044", font: "800 11px 'DM Mono', monospace" }}>{rescued.length * 10} pts</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 9, marginTop: 19 }}>
          {GAME_ITEMS.map((item) => {
            const selected = rescued.includes(item.id);
            return (
              <Motion.button
                key={item.id}
                type="button"
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ scale: .92 }}
                onClick={() => chooseItem(item)}
                aria-label={`${selected ? "Rescued" : "Choose"} ${item.label}`}
                style={{ position: "relative", minHeight: 76, padding: "10px 6px", borderRadius: 16, border: selected ? "2px solid #52b788" : "1px solid #e5e9e3", background: selected ? "#e4f5e9" : "#faf9f5", color: "#26392c", cursor: completed ? "default" : "pointer", fontFamily: "inherit" }}
              >
                <span style={{ display: "block", fontSize: 26, filter: selected ? "none" : item.hazard ? "grayscale(.7)" : "none" }}>{selected ? "✓" : item.icon}</span>
                <span style={{ display: "block", marginTop: 5, fontSize: 9.5, fontWeight: 700 }}>{selected ? "Rescued" : item.label}</span>
              </Motion.button>
            );
          })}
        </div>

        <div aria-live="polite" style={{ display: "flex", alignItems: "center", gap: 8, minHeight: 42, marginTop: 12, padding: "10px 12px", borderRadius: 13, background: completed ? "#2d6a4f" : "#f3f0e8", color: completed ? "#fff" : "#637068", font: "600 10px 'DM Mono', monospace" }}>
          <Motion.span animate={completed ? { rotate: [0, -12, 12, 0], scale: [1, 1.25, 1] } : {}} transition={{ duration: .55 }} style={{ fontSize: 16 }}>{completed ? "🎉" : "💡"}</Motion.span>
          <span style={{ flex: 1 }}>{message}</span>
          {completed && <button type="button" onClick={resetGame} style={{ border: 0, borderRadius: 9, padding: "6px 9px", background: "rgba(255,255,255,.15)", color: "#fff", cursor: "pointer", font: "700 9px 'DM Mono', monospace" }}>Play again</button>}
        </div>
      </Motion.div>

      <Motion.div animate={{ y: [0, 7, 0], rotate: [-1, 1, -1] }} transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut" }} style={{ position: "absolute", right: -8, bottom: 5, zIndex: 3, padding: "10px 14px", borderRadius: 14, background: "linear-gradient(135deg,#f59e0b,#e67908)", color: "#fff", boxShadow: "0 15px 34px rgba(190,105,8,.3)", font: "800 10.5px 'Cabinet Grotesk', sans-serif" }}>Every plate counts ✦</Motion.div>
    </div>
  );
};

const Hero = ({ c }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  return (
    <section
      className="rq-hero"
      id="hero"
      ref={ref}
      style={{
    minHeight: 620,
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

      <Motion.div style={{ opacity, width: "100%", position: "relative", zIndex: 2 }}>
        <div
          className="rq-hero-grid"
          style={{
            maxWidth: 1240, margin: "0 auto", width: "100%",
            display: "grid", gridTemplateColumns: "1fr 380px",
            gap: 56, alignItems: "center",
          }}
        >
          <div>
            <Motion.div
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
              <Motion.span
                animate={{ opacity: [1, 0.3, 1], scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ width: 7, height: 7, borderRadius: "50%", background: c.amber, display: "inline-block", flexShrink: 0 }}
              />
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: c.mint, letterSpacing: "0.09em" }}>
                FOOD RESCUE PLATFORM · INDIA
              </span>
            </Motion.div>

            <Motion.h1
              className="rq-hero-title"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 1, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(52px, 7.5vw, 104px)",
                fontWeight: 900, color: "#fff",
                lineHeight: 0.91, letterSpacing: "-0.03em", margin: "0 0 24px",
              }}
            >
              Every Meal<br />
              <span className="rq-hero-em">Matters.</span>
            </Motion.h1>

            <Motion.p
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
            </Motion.p>

            <Motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.85 }}
              className="rq-hero-btns"
              style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 48 }}
            >
              <Link to="/register?role=donor">
                <Motion.button
                  whileHover={{ background: c.gold, transform: "translateY(-3px)", boxShadow: "0 20px 48px rgba(232,168,56,0.42)" }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    padding: "16px 34px", borderRadius: 100, border: "none",
                    background: c.amber, color: c.leaf,
                    fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 700, fontSize: 15, cursor: "pointer",
                  }}
                >Donate Food →</Motion.button>
              </Link>
              <Link to="/register?role=ngo">
                <Motion.button
                  whileHover={{ background: "rgba(255,255,255,0.14)" }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    padding: "16px 34px", borderRadius: 100,
                    border: "1px solid rgba(255,255,255,0.22)",
                    background: "rgba(255,255,255,0.07)", color: "#fff",
                    fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 15, cursor: "pointer",
                  }}
                >Request Food</Motion.button>
              </Link>
            </Motion.div>

          </div>

          <Motion.div
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <FoodCard c={c} />
          </Motion.div>
        </div>
      </Motion.div>

      <Motion.div
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
        <Motion.div
          animate={{ opacity: [0.55, 1, 0.55], scaleY: [1, 1.3, 1] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          style={{ width: 1, height: 36, background: "linear-gradient(to bottom,rgba(255,255,255,.38),transparent)" }}
        />
      </Motion.div>
    </section>
  );
};

const STATS = [
  { value: "List", label: "Surplus food clearly", icon: "🍽️", color: "#52b788", to: "/dashboard/donate" },
  { value: "Find", label: "Food available nearby", icon: "📍", color: "#e8a838", to: "/dashboard/search" },
  { value: "Claim", label: "A pickup transparently", icon: "🤝", color: "#2d6a4f", to: "/dashboard/search" },
  { value: "Track", label: "Real rescue activity", icon: "🌿", color: "#d4622a", to: "/dashboard" },
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
              <Motion.div whileHover={{ scale: 1.04, y: -4 }} style={{ textAlign: "center", cursor: "pointer" }}>
                <Motion.div
                  whileHover={{ scale: 1.15, rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.4 }}
                  style={{
                    width: 58, height: 58, borderRadius: 17,
                    background: `${s.color}18`, border: `1px solid ${s.color}28`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 26, margin: "0 auto 14px",
                  }}
                >{s.icon}</Motion.div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 44, fontWeight: 900, color: s.color, lineHeight: 1 }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 13, color: c.text2, marginTop: 7 }}>{s.label}</div>
              </Motion.div>
            </Link>
          </Reveal>
        ))}
      </div>
    </Reveal>
  </section>
);

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
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(26px,3.8vw,50px)", fontWeight: 700,
          color: c.text, lineHeight: 1.22, fontStyle: "italic", margin: "0 0 26px",
        }}>
          "No plate left behind — bridging abundance and hunger, one rescue at a time."
        </blockquote>
      </Reveal>
      <Reveal delay={0.22}>
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 21, fontStyle: "italic", color: c.text2, lineHeight: 1.7, maxWidth: 680, margin: "0 auto 44px" }}>
          “Good food deserves a second destination.”
        </p>
      </Reveal>
      <Reveal delay={0.3}>
        <div style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
          {[
            "Waste less. Share more.",
            "Make surplus visible.",
            "Let every rescue be real.",
          ].map((quote) => (
            <Motion.div
              key={quote}
              whileHover={{ y: -4, boxShadow: `0 12px 32px ${c.shadow}` }}
              style={{
                background: c.surface, border: `1px solid ${c.border}`,
                borderRadius: 18, padding: "22px 28px", textAlign: "center",
                fontFamily: "'Playfair Display', serif", fontSize: 18,
                fontStyle: "italic", fontWeight: 700, color: c.text,
              }}
            >
              “{quote}”
            </Motion.div>
          ))}
        </div>
      </Reveal>
    </div>
  </section>
);

const FEATURES = [
  { emoji: "🍱", title: "Real Food Listings", desc: "Publish the food type, meal quantity, pickup location, collection window, and an optional photograph.", tag: "", accent: "#52b788", to: "/dashboard/donate" },
  { emoji: "🔎", title: "Available Food", desc: "Browse pending Appwrite listings and search by food or pickup location without placeholder inventory.", tag: "", accent: "#e8a838", to: "/dashboard/search" },
  { emoji: "🤝", title: "Clear Claiming", desc: "Claim available listings through checkout. Availability is checked again before the pickup record changes.", tag: "", accent: "#2d6a4f", to: "/dashboard/search" },
  { emoji: "📊", title: "Honest Impact", desc: "Dashboard totals and impact calculations come from recorded donations and completed pickups.", tag: "", accent: "#d4622a", to: "/dashboard" },
  { emoji: "🔔", title: "Activity Alerts", desc: "See alerts generated from real pending, active, completed, and cancelled pickup records.", tag: "", accent: "#7c3aed", to: "/dashboard/smart-alerts" },
  { emoji: "🧭", title: "Pickup Progress", desc: "Open a pickup record and follow the status and scheduled collection time stored by the platform.", tag: "", accent: "#0891b2", to: "/dashboard/orders" },
];

const Features = ({ c }) => (
  <section style={{ background: c.bg, padding: "72px 32px" }} id="features">
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      <div className="rq-feat-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20, marginBottom: 38 }}>
        <Reveal>
          <div>
            <span style={{
              display: "inline-block", background: c.leafm, color: "#fff",
              fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.15em",
              padding: "6px 16px", borderRadius: 100, marginBottom: 18,
            }}>PLATFORM FEATURES</span>
            <h2 style={{
              fontFamily: "'Playfair Display', serif", fontSize: "clamp(34px,4.5vw,60px)",
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
        {FEATURES.slice(0, 3).map((f, i) => (
          <Reveal key={i} delay={i * 0.08}>
            <Link to={f.to}>
              <Motion.div
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
                <Motion.div
                  whileHover={{ rotate: [0, -8, 8, 0], scale: 1.1 }}
                  transition={{ duration: 0.4 }}
                  style={{
                    width: 54, height: 54, borderRadius: 15,
                    background: `${f.accent}18`, border: `1px solid ${f.accent}28`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 24, marginBottom: 20,
                  }}
                >{f.emoji}</Motion.div>
                <h3 style={{ fontSize: 17, fontWeight: 500, color: c.text, marginBottom: 10 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: c.text2, lineHeight: 1.72, margin: 0 }}>{f.desc}</p>
                <Motion.div
                  initial={{ scaleX: 0, originX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  style={{
                    position: "absolute", bottom: 0, left: 0, right: 0, height: 3,
                    background: `linear-gradient(90deg,${f.accent},${f.accent}88)`,
                  }}
                />
              </Motion.div>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const HOW_STEPS = [
  { num: "01", emoji: "📸", title: "List Surplus Food", desc: "Add accurate food details, quantity, pickup location, collection time, and a photo.", color: "#52b788", to: "/dashboard/donate" },
  { num: "02", emoji: "🔎", title: "Make It Discoverable", desc: "The pending donation appears in the dashboard and available-food listing.", color: "#e8a838", to: "/dashboard/search" },
  { num: "03", emoji: "🤝", title: "Claim, Collect & Track", desc: "A receiver claims the food, arranges collection, and records the completed rescue.", color: "#d4622a", to: "/dashboard/search" },
  { num: "04", emoji: "📋", title: "Record the Outcome", desc: "Pickup status and completed rescue data become part of the project's real impact history.", color: "#2d6a4f", to: "/dashboard/impact-delivered" },
];

const HowItWorks = ({ c }) => (
  <section style={{ background: c.leafm, padding: "72px 32px", position: "relative", overflow: "hidden" }} id="how">
    <svg style={{ position: "absolute", top: -150, right: -150, width: 600, opacity: 0.04, pointerEvents: "none" }} viewBox="0 0 400 400">
      <circle cx="200" cy="200" r="160" stroke="#fff" strokeWidth="80" fill="none" />
    </svg>
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      <Reveal>
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          <span style={{
            display: "inline-block", background: "rgba(255,255,255,0.10)",
            border: "1px solid rgba(255,255,255,0.18)", color: c.mint,
            fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.15em",
            padding: "6px 16px", borderRadius: 100, marginBottom: 18,
          }}>HOW IT WORKS</span>
          <h2 style={{
            fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px,4.8vw,60px)",
            fontWeight: 900, color: "#fff", lineHeight: 1.08, margin: 0,
          }}>
            From surplus to smiles —{" "}
            <em style={{ fontStyle: "italic", color: "rgba(255,255,255,0.68)" }}>in minutes.</em>
          </h2>
        </div>
      </Reveal>
      <div className="rq-how-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24, position: "relative" }}>
        <div className="rq-how-line" style={{ position: "absolute", top: 56, left: "12%", right: "12%", height: 1, background: "rgba(255,255,255,0.10)" }} />
        {HOW_STEPS.slice(0, 3).map((s, i) => (
          <Reveal key={i} delay={i * 0.14}>
            <Link to={s.to}>
              <Motion.div whileHover={{ y: -8 }} style={{ textAlign: "center", position: "relative", zIndex: 1, cursor: "pointer" }}>
                <Motion.div
                  whileHover={{ scale: 1.1 }}
                  style={{
                    width: 80, height: 80, borderRadius: "50%", background: s.color,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 30, margin: "0 auto 20px", boxShadow: `0 0 0 12px ${s.color}28`,
                  }}
                >{s.emoji}</Motion.div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: s.color, letterSpacing: "0.1em", marginBottom: 10 }}>{s.num}</div>
                <h3 style={{ fontSize: 16, fontWeight: 500, color: "#fff", marginBottom: 10 }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.52)", lineHeight: 1.68 }}>{s.desc}</p>
              </Motion.div>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

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
  <section style={{ background: c.bg2, padding: "72px 32px" }} id="impact">
    <div className="rq-map-grid" style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
      <Reveal x={-36} y={0}>
        <div>
          <span style={{
            display: "inline-block", background: c.leafm, color: "#fff",
            fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.15em",
            padding: "6px 16px", borderRadius: 100, marginBottom: 18,
          }}><span className="rq-remove-live-impact">REAL-TIME IMPACT</span></span>
          <h2 style={{
            fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px,4.2vw,56px)",
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
              <Motion.div whileHover={{ x: 4 }} style={{ marginBottom: 18, cursor: "pointer" }}>
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
                  <Motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${ct.pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.4, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                    style={{ height: "100%", background: ct.color, borderRadius: 100 }}
                  />
                </div>
              </Motion.div>
            </Link>
          ))}

          <Link to="/map">
            <Motion.button
              whileHover={{ background: c.leafm, transform: "translateY(-2px)" }}
              whileTap={{ scale: 0.97 }}
              style={{
                marginTop: 28, padding: "12px 28px", borderRadius: 100,
                border: `1.5px solid ${c.border2}`, background: "transparent",
                fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 14,
                fontWeight: 600, color: c.text2, cursor: "pointer", transition: "all 0.25s",
              }}
            >View Live Map →</Motion.button>
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
                <Motion.circle
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
          <Motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3.5, repeat: Infinity }}
            style={{
              position: "absolute", top: 18, right: -14,
              background: c.surface, border: `1px solid ${c.border}`,
              borderRadius: 16, padding: "12px 16px", boxShadow: c.cardShadow,
            }}
          >
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: c.text3, marginBottom: 5, textTransform: "uppercase" }}>Active Now</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 900, color: c.sage }}>47</div>
            <div style={{ fontSize: 11, color: c.text2, fontFamily: "'Cabinet Grotesk', sans-serif" }}>Live pickups</div>
          </Motion.div>
        </Link>
      </Reveal>
    </div>
  </section>
);

const TESTIMONIALS = [
  { name: "Waste less", role: "Our environmental mission", text: "Keep safe, usable food in circulation instead of treating every surplus meal as waste.", av: "01", color: "#52b788" },
  { name: "Share locally", role: "Our community mission", text: "Give donors and receivers one clear place to publish, discover, claim, and follow a food rescue.", av: "02", color: "#e8a838" },
  { name: "Build trust", role: "Our product mission", text: "Show real records, honest statuses, and understandable actions without invented activity or inflated claims.", av: "03", color: "#d4622a" },
];

const Testimonials = ({ c }) => (
  <section style={{ background: c.bg, padding: "100px 32px" }} id="stories">
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      <Reveal style={{ textAlign: "center", marginBottom: 64 }}>
        <span style={{
          display: "inline-block", background: c.leafm, color: "#fff",
          fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.15em",
          padding: "6px 16px", borderRadius: 100, marginBottom: 18,
        }}>WHAT GUIDES US</span>
        <h2 style={{
          fontFamily: "'Playfair Display', serif", fontSize: "clamp(34px,4.5vw,60px)",
          fontWeight: 900, color: c.text, lineHeight: 1.06, margin: 0, letterSpacing: "-0.02em",
        }}>
          A product built around{" "}
          <em style={{ color: c.leafm, fontStyle: "italic" }}>real needs.</em>
        </h2>
      </Reveal>
      <div className="rq-test-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
        {TESTIMONIALS.map((t, i) => (
          <Reveal key={i} delay={i * 0.13}>
            <Motion.div
              whileHover={{ y: -8, boxShadow: `0 32px 70px ${t.color}18` }}
              style={{
                background: c.surface, border: `1px solid ${c.border}`,
                borderRadius: 26, padding: 32, transition: "box-shadow 0.35s",
              }}
            >
              <div style={{ color: c.amber, fontSize: 12, marginBottom: 18, letterSpacing: 2 }}>RESQPLATE PRINCIPLE</div>
              <p style={{
                fontFamily: "'Playfair Display', serif", fontSize: 16.5, color: c.text,
                lineHeight: 1.62, fontStyle: "italic", marginBottom: 24,
              }}>"{t.text}"</p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Motion.div
                  whileHover={{ scale: 1.1 }}
                  style={{
                    width: 44, height: 44, borderRadius: "50%",
                    background: `linear-gradient(135deg,${t.color},${t.color}88)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0,
                    fontFamily: "'Cabinet Grotesk', sans-serif",
                  }}
                >{t.av}</Motion.div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: c.text }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: c.text3, marginTop: 2 }}>{t.role}</div>
                </div>
              </div>
            </Motion.div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

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
            fontFamily: "'Playfair Display', serif", fontSize: "clamp(26px,3.5vw,40px)",
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
            <Motion.button
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
            >{loading ? "Joining..." : sent ? "Subscribed! 🎉" : "Subscribe"}</Motion.button>
          </div>
          <AnimatePresence>
            {sent && (
              <Motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: c.leafm, marginTop: 15 }}
              >
                🎉 Welcome to the movement! Check your inbox.
              </Motion.div>
            )}
          </AnimatePresence>
        </Reveal>
      </div>
    </section>
  );
};

const CTA = ({ c }) => (
  <section style={{
    background: c.heroBg, padding: "82px 32px", textAlign: "center",
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
          fontFamily: "'Playfair Display', serif", fontSize: "clamp(44px,7vw,88px)",
          fontWeight: 900, color: "#fff", lineHeight: 0.95, marginBottom: 24, letterSpacing: "-0.03em",
        }}>
          Ready to rescue<br />your first meal?
        </h2>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginTop: 40 }}>
          <Link to="/register?role=donor">
            <Motion.button
              whileHover={{ background: c.gold, transform: "translateY(-3px)", boxShadow: "0 24px 56px rgba(232,168,56,0.45)" }}
              whileTap={{ scale: 0.97 }}
              style={{
                padding: "18px 46px", borderRadius: 100, border: "none",
                background: c.amber, color: c.leaf,
                fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 700, fontSize: 16, cursor: "pointer",
              }}
            >Start Donating →</Motion.button>
          </Link>
          <Link to="/register?role=ngo">
            <Motion.button
              whileHover={{ background: "rgba(255,255,255,0.14)" }}
              whileTap={{ scale: 0.97 }}
              style={{
                padding: "18px 46px", borderRadius: 100,
                border: "1px solid rgba(255,255,255,0.22)",
                background: "rgba(255,255,255,0.07)", color: "#fff",
                fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 16, cursor: "pointer",
              }}
            >Request Food</Motion.button>
          </Link>
        </div>
        <div style={{ display: "flex", gap: 28, justifyContent: "center", marginTop: 36, flexWrap: "wrap" }}>
          {[
            { label: "Learn More",      to: "/about"           },
            { label: "Contact Us",      to: "/contact"         },
            { label: "Browse Listings", to: "/dashboard/search" },
          ].map((l) => (
            <Link key={l.label} to={l.to}>
              <Motion.span
                whileHover={{ color: c.mint }}
                style={{
                  fontSize: 13, color: "rgba(255,255,255,0.38)",
                  fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em",
                  cursor: "pointer", transition: "color 0.2s",
                }}
              >{l.label}</Motion.span>
            </Link>
          ))}
        </div>
      </Reveal>
    </div>
  </section>
);

const Footer = ({ c }) => {
  const socials = [
    { label: "X", name: "X / Twitter", href: "https://x.com/itsSalonyy" },
    { label: "↗", name: "Portfolio", href: "https://salonyranjan.github.io/" },
    { label: "in", name: "LinkedIn", href: "https://www.linkedin.com/in/salony-ranjan-b63200280/" },
  ];

  return (
    <footer className="rq-site-footer" style={{ position: "relative", overflow: "hidden", background: "#061108", color: "rgba(232,245,236,0.62)", padding: "46px 32px 26px" }}>
      <div aria-hidden style={{ position: "absolute", width: 420, height: 420, borderRadius: "50%", top: -260, right: -120, background: "radial-gradient(circle,rgba(82,183,136,.12),transparent 68%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1160, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div className="rq-footer-grid" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 34, padding: "0 8px 34px" }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ color: "#fff", marginBottom: 14 }}><Logo size={40} /></div>
            <p style={{ maxWidth: 520, margin: 0, fontSize: 13.5, lineHeight: 1.7, color: "rgba(232,245,236,.5)" }}>
              Connecting safe surplus food with nearby people and organizations through one clear rescue workflow.
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
            {socials.map((social) => (
              <Motion.a key={social.name} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.name} whileHover={{ y: -3, borderColor: "rgba(82,183,136,.55)", color: "#95d5b2" }} style={{ width: 40, height: 40, borderRadius: 12, border: "1px solid rgba(255,255,255,.1)", background: "rgba(255,255,255,.04)", color: "rgba(232,245,236,.64)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: 600 }}>
                {social.label}
              </Motion.a>
            ))}
          </div>
        </div>

        <div className="rq-footer-bottom" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 18, padding: "24px 8px 0", borderTop: "1px solid rgba(255,255,255,.08)" }}>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "rgba(232,245,236,.34)" }}>© 2026 ResQPlate. Food shared, not wasted.</span>
          <div style={{ display: "flex", alignItems: "center", gap: 9, fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: ".08em", color: "rgba(149,213,178,.46)" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.sage, boxShadow: "0 0 10px rgba(82,183,136,.8)" }} />
            BUILT FOR COMMUNITY IMPACT
          </div>
        </div>
      </div>
    </footer>
  );
};

const Landing = () => {
  const { dark } = useTheme();
  const c = C(dark);

  return (
    <>
      <FontLoader />
      <GlobalStyles c={c} />
      <Grain />
      <ScrollProgress c={c} />
      <Hero c={c} />
      <Stats c={c} />
      <Features c={c} />
      <HowItWorks c={c} />
      <Footer c={c} />
    </>
  );
};

export default Landing;
