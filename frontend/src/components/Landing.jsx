import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useInView, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";

/* ── Font Loader ── */
const FontLoader = () => {
  useEffect(() => {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap";
    document.head.appendChild(l);
  }, []);
  return null;
};

/* ── Dark Mode ── */
const useDarkMode = () => {
  const [dark, setDark] = useState(false);
  const toggle = useCallback(() => setDark(d => !d), []);
  return { dark, toggle };
};

/* ── Palette ── */
const palette = (dark) => ({
  bg: dark ? "#07100a" : "#f5f0e8",
  bgAlt: dark ? "#0c1a10" : "#ede8dc",
  surface: dark ? "#111c15" : "#ffffff",
  surfaceGlass: dark ? "rgba(17,28,21,0.85)" : "rgba(255,255,255,0.85)",
  leaf: dark ? "#22c55e" : "#1a4a2e",
  leafMid: dark ? "#16a34a" : "#2d6a4f",
  sage: dark ? "#4ade80" : "#52b788",
  mint: dark ? "#86efac" : "#95d5b2",
  amber: dark ? "#fbbf24" : "#d97706",
  gold: dark ? "#f59e0b" : "#f59e0b",
  ember: dark ? "#fb923c" : "#c2410c",
  cream: dark ? "#1a2920" : "#fdf8f0",
  text: dark ? "#f0fdf4" : "#111c15",
  textMuted: dark ? "#6ee7b7" : "#4a5e52",
  textFaint: dark ? "rgba(110,231,183,0.35)" : "rgba(74,94,82,0.45)",
  border: dark ? "rgba(34,197,94,0.14)" : "rgba(26,74,46,0.1)",
  borderStrong: dark ? "rgba(34,197,94,0.3)" : "rgba(26,74,46,0.22)",
  navBg: dark ? "rgba(7,16,10,0.88)" : "rgba(245,240,232,0.88)",
  cardShadow: dark ? "0 40px 100px rgba(0,0,0,0.7)" : "0 40px 100px rgba(26,74,46,0.12)",
  heroBg: dark
    ? "linear-gradient(145deg, #030b05 0%, #081508 45%, #040d06 100%)"
    : "linear-gradient(145deg, #1a3d26 0%, #2d6a4f 45%, #1e4d35 100%)",
  neon: dark ? "#22c55e" : "#1a4a2e",
});

/* ── Reveal ── */
const Reveal = ({ children, delay = 0, y = 40, x = 0, className = "" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y, x }}
      animate={inView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}>
      {children}
    </motion.div>
  );
};

/* ── Counter ── */
const Counter = ({ target, suffix = "" }) => {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    const n = parseInt(target.replace(/\D/g, ""));
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

/* ── Live Ticker ── */
const ticks = [
  "🍱 Mumbai — 24 meals rescued just now",
  "🥗 Delhi — NGO matched in 3 min",
  "🍛 Bangalore — 80 kg saved today",
  "🫙 Pune — New volunteer joined",
  "🍲 Chennai — 12 families fed",
  "🌿 Hyderabad — 600g CO₂ offset",
];
const Ticker = ({ C }) => {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % ticks.length), 3400);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ background: C.amber, padding: "9px 0", overflow: "hidden", fontFamily: "'DM Mono', monospace", fontSize: 11.5, color: "#fff", fontWeight: 500, letterSpacing: "0.03em" }}>
      <AnimatePresence mode="wait">
        <motion.div key={idx} initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -16, opacity: 0 }} transition={{ duration: 0.3 }} style={{ textAlign: "center" }}>
          {ticks[idx]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

/* ── Logo ── */
const ResQPlateLogo = ({ C, size = 32 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
    <motion.div whileHover={{ rotate: [0, -8, 8, 0] }} transition={{ duration: 0.5 }} style={{ width: size, height: size, flexShrink: 0 }}>
      <svg viewBox="0 0 48 48" fill="none" width={size} height={size}>
        <circle cx="24" cy="24" r="22" fill={C.leafMid} />
        <path d="M24 9 C29 9 36 14 36 22.5 C36 31 29 38 24 40 C19 38 12 31 12 22.5 C12 14 19 9 24 9Z" fill={C.sage} opacity="0.9" />
        <path d="M24 40 L24 44" stroke={C.mint} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M24 14 L24 37" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M24 19 L19 24" stroke="rgba(255,255,255,0.22)" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M24 27 L29 32" stroke="rgba(255,255,255,0.22)" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M20 7 L20 13" stroke={C.amber} strokeWidth="2" strokeLinecap="round" />
        <path d="M24 6 L24 13" stroke={C.amber} strokeWidth="2" strokeLinecap="round" />
        <path d="M28 7 L28 13" stroke={C.amber} strokeWidth="2" strokeLinecap="round" />
      </svg>
    </motion.div>
    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: size * 0.64, fontWeight: 900, color: C.text, letterSpacing: "-0.02em", lineHeight: 1 }}>
      ResQ<span style={{ color: C.amber }}>Plate</span>
    </span>
  </div>
);

/* ── Dark Toggle ── */
const DarkToggle = ({ dark, toggle, C }) => (
  <motion.button onClick={toggle} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
    style={{ width: 42, height: 42, borderRadius: 14, background: C.surface, border: `1.5px solid ${C.borderStrong}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.textMuted }}>
    <AnimatePresence mode="wait" initial={false}>
      <motion.span key={dark ? "sun" : "moon"} initial={{ rotate: -90, opacity: 0, scale: 0.6 }} animate={{ rotate: 0, opacity: 1, scale: 1 }} exit={{ rotate: 90, opacity: 0, scale: 0.6 }} transition={{ duration: 0.25 }} style={{ display: "flex" }}>
        {dark ? (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="5" stroke={C.amber} strokeWidth="2" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke={C.amber} strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke={C.textMuted} strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        )}
      </motion.span>
    </AnimatePresence>
  </motion.button>
);

/* ── Scroll Progress ── */
const ScrollProgress = ({ C }) => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return (
    <motion.div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${C.amber}, ${C.sage}, ${C.mint})`, transformOrigin: "0%", scaleX }} />
  );
};

/* ── NAVBAR — Logo + DarkMode only ── */
const NavBar = ({ C, dark, toggleDark }) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <motion.nav initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 240, damping: 28, delay: 0.1 }}
      style={{
        position: "sticky", top: 0, zIndex: 100,
        background: scrolled ? C.navBg : "transparent",
        backdropFilter: scrolled ? "blur(28px) saturate(200%)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(28px) saturate(200%)" : "none",
        borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`,
        transition: "all 0.45s cubic-bezier(0.22,1,0.36,1)",
        height: 72,
      }}>
      <ScrollProgress C={C} />
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 32px", height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <ResQPlateLogo C={C} size={38} />
        <DarkToggle dark={dark} toggle={toggleDark} C={C} />
      </div>
    </motion.nav>
  );
};

/* ── Decorative SVG Leaf ── */
const LeafDeco = ({ C, style }) => (
  <svg viewBox="0 0 120 180" fill="none" style={{ position: "absolute", pointerEvents: "none", ...style }}>
    <path d="M60 175 C15 140 -5 90 8 42 C21 -6 65 2 95 36 C125 70 118 130 60 175Z" fill={C.sage} opacity="0.1" />
    <path d="M60 175 L60 55" stroke={C.sage} strokeWidth="1.5" opacity="0.18" />
    <path d="M60 80 L42 100" stroke={C.sage} strokeWidth="1" opacity="0.14" />
    <path d="M60 110 L78 130" stroke={C.sage} strokeWidth="1" opacity="0.14" />
  </svg>
);

/* ── Grain overlay ── */
const Grain = () => (
  <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 999, opacity: 0.022, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />
);

/* ── Floating Particles ── */
const Particles = ({ C }) => {
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    dur: Math.random() * 8 + 6,
    delay: Math.random() * 4,
  }));
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {particles.map(p => (
        <motion.div key={p.id}
          style={{ position: "absolute", left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, borderRadius: "50%", background: C.sage, opacity: 0.18 }}
          animate={{ y: [-20, 20, -20], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeInOut" }} />
      ))}
    </div>
  );
};

/* ── HERO ── */
const Hero = ({ C }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  return (
    <section ref={ref} style={{ minHeight: "100vh", background: C.heroBg, position: "relative", display: "flex", alignItems: "center", overflow: "hidden" }}>
      <Particles C={C} />
      <motion.div style={{ y, position: "absolute", inset: 0, pointerEvents: "none" }}>
        <LeafDeco C={C} style={{ width: 380, top: -80, left: -100, transform: "rotate(-20deg)" }} />
        <LeafDeco C={C} style={{ width: 280, bottom: 60, right: -60, transform: "rotate(140deg)" }} />
        <LeafDeco C={C} style={{ width: 180, top: "30%", right: "22%", transform: "rotate(70deg)" }} />
      </motion.div>

      {/* Radial glow */}
      <div style={{ position: "absolute", width: 900, height: 900, borderRadius: "50%", background: `radial-gradient(circle, rgba(82,183,136,0.12) 0%, transparent 68%)`, top: "50%", left: "50%", transform: "translate(-50%,-50%)", pointerEvents: "none" }} />

      {/* Arc decoration */}
      <svg style={{ position: "absolute", bottom: -60, right: -60, width: 620, opacity: 0.06 }} viewBox="0 0 500 500">
        <circle cx="500" cy="500" r="350" stroke={C.amber} strokeWidth="100" fill="none" />
        <circle cx="500" cy="500" r="220" stroke={C.sage} strokeWidth="40" fill="none" opacity="0.5" />
      </svg>

      <motion.div style={{ opacity }} className="rq-hero-inner">

        {/* Badge */}
        <motion.div initial={{ opacity: 0, scale: 0.75, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "rgba(255,255,255,0.07)", backdropFilter: "blur(14px)", border: "1px solid rgba(255,255,255,0.13)", borderRadius: 100, padding: "9px 20px", marginBottom: 36, cursor: "default" }}>
          <motion.span style={{ width: 7, height: 7, borderRadius: "50%", background: C.amber, display: "inline-block" }}
            animate={{ opacity: [1, 0.35, 1], scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity }} />
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: C.mint, letterSpacing: "0.1em" }}>FOOD RESCUE PLATFORM · INDIA</span>
        </motion.div>

        {/* Headline */}
        <motion.h1 initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(58px, 9vw, 130px)", fontWeight: 900, lineHeight: 0.88, color: "#fff", marginBottom: 30, letterSpacing: "-0.03em", margin: "0 0 30px" }}>
          Every Meal<br />
          <em style={{ fontStyle: "italic", background: "linear-gradient(115deg, #fbbf24, #fb923c, #fbbf24)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundSize: "200%", display: "inline-block", animation: "shimmer 3s ease infinite" }}>
            Matters.
          </em>
        </motion.h1>

        {/* Subheading */}
        <motion.p initial={{ opacity: 0, y: 35 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(16px, 2.2vw, 21px)", color: "rgba(255,255,255,0.58)", maxWidth: 530, lineHeight: 1.78, marginBottom: 52, fontWeight: 300 }}>
          ResQPlate bridges surplus food with hungry families — in real time, with zero friction and maximum impact across India.
        </motion.p>

        {/* CTAs */}
        <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.75 }} style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 56 }}>
          <motion.button whileHover={{ scale: 1.05, boxShadow: `0 28px 64px rgba(251,191,36,0.45)` }} whileTap={{ scale: 0.97 }}
            style={{ background: C.amber, color: "#1a3d26", border: "none", padding: "18px 40px", borderRadius: 100, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 15, cursor: "pointer", letterSpacing: "0.01em" }}>
            Donate Food →
          </motion.button>
          <motion.button whileHover={{ background: "rgba(255,255,255,0.13)" }} whileTap={{ scale: 0.97 }}
            style={{ background: "rgba(255,255,255,0.06)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", padding: "18px 40px", borderRadius: 100, fontFamily: "'DM Sans', sans-serif", fontWeight: 400, fontSize: 15, cursor: "pointer" }}>
            Request Food
          </motion.button>
        </motion.div>

        {/* Trust badges */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 0.9 }}
          style={{ display: "flex", alignItems: "center", gap: 28, flexWrap: "wrap" }}>
          {["Govt. of India Backed", "ISO 9001:2015 Certified", "2,400+ Lives Impacted"].map((t, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: "rgba(255,255,255,0.42)", fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.03em" }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6" stroke={C.sage} strokeWidth="1.2" />
                <path d="M4 7l2 2 4-4" stroke={C.sage} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {t}
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Floating Donation Card */}
      <motion.div initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.9, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        className="rq-hero-card"
        style={{ position: "absolute", right: "6%", top: "50%", transform: "translateY(-50%)", width: 300 }}>

        {/* Main card */}
        <motion.div animate={{ y: [0, -16, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{ background: "rgba(255,255,255,0.97)", borderRadius: 28, padding: 28, boxShadow: "0 56px 120px rgba(0,0,0,0.35)", backdropFilter: "blur(20px)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
            <div style={{ width: 46, height: 46, borderRadius: 15, background: "#d1fae5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🍱</div>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: "#111c15", fontFamily: "'DM Sans', sans-serif" }}>New Donation Posted</div>
              <div style={{ fontSize: 11, color: "#6b7a6d", fontFamily: "'DM Mono', monospace", marginTop: 2 }}>2 min ago · Connaught Place</div>
            </div>
          </div>
          <div style={{ background: "#f7f3ec", borderRadius: 14, padding: "11px 15px", marginBottom: 16 }}>
            <div style={{ fontSize: 13.5, color: "#111c15", fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>45 meals — Dal Makhani, Rice, Sabzi</div>
            <div style={{ fontSize: 11, color: "#6b7a6d", marginTop: 4, fontFamily: "'DM Mono', monospace" }}>Expires in 3h · Pickup available</div>
          </div>
          <div style={{ display: "flex", gap: 9 }}>
            <motion.div whileHover={{ scale: 1.04 }} style={{ flex: 1, background: "#2d6a4f", color: "#fff", borderRadius: 12, padding: "9px 0", textAlign: "center", fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>Accept</motion.div>
            <div style={{ flex: 1, background: "#f0ebe0", color: "#6b7a6d", borderRadius: 12, padding: "9px 0", textAlign: "center", fontSize: 13, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>Later</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 16, paddingTop: 16, borderTop: "1px solid #f0ebe0" }}>
            <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 2, repeat: Infinity }}
              style={{ width: 7, height: 7, borderRadius: "50%", background: "#52b788", flexShrink: 0 }} />
            <span style={{ fontSize: 11, color: "#52b788", fontFamily: "'DM Mono', monospace" }}>3 NGOs notified nearby</span>
          </div>
        </motion.div>

        {/* CO2 badge */}
        <motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          style={{ position: "absolute", bottom: -38, left: -48, background: "linear-gradient(135deg, #d97706, #f59e0b)", borderRadius: 20, padding: "14px 22px", display: "flex", alignItems: "center", gap: 11, boxShadow: "0 24px 56px rgba(217,119,6,0.4)" }}>
          <span style={{ fontSize: 24 }}>🌱</span>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>500 kg CO₂ Saved</div>
            <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.75)", fontFamily: "'DM Mono', monospace" }}>This month alone</div>
          </div>
        </motion.div>

        {/* Volunteer nearby chip */}
        <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          style={{ position: "absolute", top: -28, right: -32, background: "rgba(255,255,255,0.96)", borderRadius: 14, padding: "10px 16px", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 12px 36px rgba(0,0,0,0.2)", border: "1px solid rgba(82,183,136,0.2)" }}>
          <span style={{ fontSize: 16 }}>🚴</span>
          <div style={{ fontSize: 11.5, fontWeight: 600, color: "#1a4a2e", fontFamily: "'DM Sans', sans-serif" }}>Volunteer 0.8 km away</div>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6, duration: 0.8 }}
        style={{ position: "absolute", bottom: 36, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 9, color: "rgba(255,255,255,0.28)", fontFamily: "'DM Mono', monospace", letterSpacing: "0.2em" }}>SCROLL</span>
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 1.8, repeat: Infinity }}
          style={{ width: 1, height: 38, background: "linear-gradient(to bottom, rgba(255,255,255,0.4), transparent)" }} />
      </motion.div>
    </section>
  );
};

/* ── STATS ── */
const statsData = [
  { value: "1200", suffix: "+", label: "Meals Rescued", icon: "🍽️", color: "#52b788" },
  { value: "50", suffix: "+", label: "NGO Partners", icon: "🤝", color: "#d97706" },
  { value: "500", suffix: " kg", label: "CO₂ Reduced", icon: "🌿", color: "#2d6a4f" },
  { value: "98", suffix: "%", label: "Satisfaction", icon: "⭐", color: "#c2410c" },
];

const Stats = ({ C }) => (
  <section style={{ background: C.bgAlt, padding: "0 24px" }}>
    <div style={{ maxWidth: 1140, margin: "0 auto", transform: "translateY(-60px)", background: C.surface, borderRadius: 36, boxShadow: C.cardShadow, padding: "60px 52px", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 32 }} className="rq-stats-grid">
      {statsData.map((s, i) => (
        <Reveal key={i} delay={i * 0.1}>
          <div style={{ textAlign: "center" }}>
            <motion.div whileHover={{ scale: 1.15, rotate: [0, -10, 10, 0] }} transition={{ duration: 0.4 }}
              style={{ width: 64, height: 64, borderRadius: 20, background: `${s.color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 16px", border: `1px solid ${s.color}28` }}>
              {s.icon}
            </motion.div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 50, fontWeight: 900, color: s.color, lineHeight: 1 }}>
              <Counter target={s.value} suffix={s.suffix} />
            </div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, color: C.textMuted, marginTop: 8, fontWeight: 400 }}>{s.label}</div>
          </div>
        </Reveal>
      ))}
    </div>
  </section>
);

/* ── MISSION ── */
const Mission = ({ C }) => (
  <section style={{ background: C.bgAlt, padding: "40px 24px 120px", position: "relative", overflow: "hidden" }}>
    <LeafDeco C={C} style={{ width: 260, top: -40, right: 40, opacity: 0.9 }} />
    <LeafDeco C={C} style={{ width: 200, bottom: 20, left: -60, opacity: 0.6, transform: "rotate(110deg)" }} />
    <div style={{ maxWidth: 840, margin: "0 auto", textAlign: "center" }}>
      <Reveal>
        <span style={{ display: "inline-block", background: C.leafMid, color: "#fff", fontFamily: "'DM Mono', monospace", fontSize: 10.5, letterSpacing: "0.16em", padding: "7px 20px", borderRadius: 100, marginBottom: 28 }}>
          OUR MISSION
        </span>
      </Reveal>
      <Reveal delay={0.12}>
        <blockquote style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 4.5vw, 54px)", fontWeight: 700, color: C.text, lineHeight: 1.2, margin: "0 0 28px", fontStyle: "italic" }}>
          "No plate left behind — bridging abundance and hunger, one rescue at a time."
        </blockquote>
      </Reveal>
      <Reveal delay={0.22}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", color: C.textMuted, fontSize: 16.5, lineHeight: 1.82, maxWidth: 600, margin: "0 auto 44px" }}>
          We believe food waste and hunger are two sides of the same broken system. ResQPlate repairs it — with technology, community, and compassion at scale.
        </p>
      </Reveal>
      <Reveal delay={0.3}>
        <div style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
          {[
            { label: "Vision 2030", val: "Zero Food Waste India" },
            { label: "Founded", val: "2023 · New Delhi" },
            { label: "Network", val: "22 Cities Active" },
          ].map((m, i) => (
            <div key={i} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: "20px 28px", textAlign: "center" }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.textMuted, letterSpacing: "0.12em", marginBottom: 6 }}>{m.label}</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, color: C.text }}>{m.val}</div>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  </section>
);

/* ── FEATURES ── */
const featuresData = [
  { emoji: "⚡", title: "AI-Powered Matching", desc: "Our algorithm matches surplus food to the nearest verified NGO in under 90 seconds, factoring in distance, capacity, and food type.", tag: "NEW", accent: "#52b788" },
  { emoji: "🗺️", title: "Live Map Tracking", desc: "Follow every donation from post to plate with real-time GPS tracking and push notifications for all parties.", tag: "", accent: "#d97706" },
  { emoji: "🛡️", title: "Trust & Safety", desc: "Every NGO is background-checked, rated, and insured. Donors get full transparency with photo proof of delivery.", tag: "", accent: "#2d6a4f" },
  { emoji: "📊", title: "Impact Dashboard", desc: "See your personal CO₂ savings, meals rescued, and families helped in a beautiful, shareable impact report.", tag: "NEW", accent: "#c2410c" },
  { emoji: "🔔", title: "Smart Alerts", desc: "WhatsApp, SMS, and app notifications ensure zero missed pickups. Set your schedule and we'll handle coordination.", tag: "", accent: "#7c3aed" },
  { emoji: "🏆", title: "Donor Rewards", desc: "Earn ResQPoints for every donation. Redeem for tax certificates, brand badges, and exclusive partner discounts.", tag: "NEW", accent: "#0891b2" },
];

const Features = ({ C }) => (
  <section style={{ background: C.bg, padding: "110px 24px" }}>
    <div style={{ maxWidth: 1140, margin: "0 auto" }}>
      <Reveal>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 72, flexWrap: "wrap", gap: 20 }}>
          <div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10.5, letterSpacing: "0.18em", color: C.textMuted, marginBottom: 16 }}>PLATFORM FEATURES</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(36px, 5vw, 68px)", fontWeight: 900, color: C.text, lineHeight: 1, margin: 0, maxWidth: 500 }}>
              Built for <em style={{ color: C.leafMid, fontStyle: "italic" }}>speed,</em><br />trust & impact.
            </h2>
          </div>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: C.textMuted, maxWidth: 300, lineHeight: 1.75 }}>
            Every feature is designed to remove friction from food rescue operations.
          </p>
        </div>
      </Reveal>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 22 }} className="rq-feat-grid">
        {featuresData.map((f, i) => (
          <Reveal key={i} delay={i * 0.08}>
            <motion.div whileHover={{ y: -10, boxShadow: `0 36px 80px ${f.accent}18` }}
              style={{ background: C.surface, borderRadius: 26, padding: 34, border: `1px solid ${C.border}`, cursor: "default", position: "relative", overflow: "hidden", transition: "box-shadow 0.35s" }}>
              {f.tag && (
                <div style={{ position: "absolute", top: 22, right: 22, background: C.amber, color: "#fff", fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", padding: "4px 10px", borderRadius: 100, fontFamily: "'DM Mono', monospace" }}>{f.tag}</div>
              )}
              <motion.div whileHover={{ rotate: [0, -8, 8, 0], scale: 1.1 }} transition={{ duration: 0.4 }}
                style={{ width: 58, height: 58, borderRadius: 18, background: `${f.accent}16`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, marginBottom: 22, border: `1px solid ${f.accent}28` }}>
                {f.emoji}
              </motion.div>
              <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 18, color: C.text, marginBottom: 12 }}>{f.title}</h3>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: C.textMuted, lineHeight: 1.76, margin: 0 }}>{f.desc}</p>
              <motion.div initial={{ scaleX: 0, originX: 0 }} whileHover={{ scaleX: 1 }}
                style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${f.accent}, ${f.accent}88)` }} />
            </motion.div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* ── HOW IT WORKS ── */
const howSteps = [
  { num: "01", emoji: "📸", title: "Post in 60 Seconds", desc: "Snap a photo, add quantity and pickup window. No forms, no friction — just impact.", color: "#52b788" },
  { num: "02", emoji: "🤖", title: "AI Finds the Match", desc: "Our engine notifies the best-fit NGO in seconds based on location, type, and urgency.", color: "#d97706" },
  { num: "03", emoji: "🚴", title: "Volunteer Picks Up", desc: "A vetted volunteer collects the food with live GPS updates for all parties.", color: "#c2410c" },
  { num: "04", emoji: "📋", title: "Impact Delivered", desc: "Receive a certificate with CO₂ saved, meals rescued, and families fed. Share on social.", color: "#2d6a4f" },
];

const HowItWorks = ({ C }) => (
  <section style={{ background: C.leafMid, padding: "120px 24px", position: "relative", overflow: "hidden" }}>
    {/* Background decoration */}
    <svg style={{ position: "absolute", top: -150, right: -150, width: 600, opacity: 0.04, pointerEvents: "none" }} viewBox="0 0 400 400">
      <circle cx="200" cy="200" r="160" stroke="#fff" strokeWidth="80" fill="none" />
    </svg>
    <svg style={{ position: "absolute", bottom: -100, left: -80, width: 400, opacity: 0.04, pointerEvents: "none" }} viewBox="0 0 400 400">
      <circle cx="200" cy="200" r="140" stroke="#fff" strokeWidth="60" fill="none" />
    </svg>

    <div style={{ maxWidth: 1140, margin: "0 auto" }}>
      <Reveal>
        <div style={{ textAlign: "center", marginBottom: 80 }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10.5, letterSpacing: "0.18em", color: "rgba(149,213,178,0.7)", marginBottom: 16 }}>HOW IT WORKS</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(36px, 5.5vw, 68px)", fontWeight: 900, color: "#fff", lineHeight: 1.05, margin: 0 }}>
            From surplus to smiles<br />
            <em style={{ fontStyle: "italic", color: "rgba(255,255,255,0.7)" }}>in minutes.</em>
          </h2>
        </div>
      </Reveal>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24, position: "relative" }} className="rq-how-grid">
        {/* Connection line */}
        <div style={{ position: "absolute", top: 64, left: "12%", right: "12%", height: 1, background: "rgba(255,255,255,0.1)", zIndex: 0 }} className="rq-how-line" />
        {howSteps.map((s, i) => (
          <Reveal key={i} delay={i * 0.14}>
            <motion.div whileHover={{ y: -8 }} style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
              <motion.div whileHover={{ scale: 1.1 }}
                style={{ width: 82, height: 82, borderRadius: "50%", background: s.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, margin: "0 auto 24px", boxShadow: `0 0 0 12px ${s.color}28` }}>
                {s.emoji}
              </motion.div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: s.color, letterSpacing: "0.1em", marginBottom: 12 }}>{s.num}</div>
              <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, fontWeight: 600, color: "#fff", marginBottom: 12 }}>{s.title}</h3>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.72 }}>{s.desc}</p>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* ── IMPACT VISUAL ── */
const ImpactMap = ({ C }) => (
  <section style={{ background: C.bgAlt, padding: "120px 24px", overflow: "hidden" }}>
    <div style={{ maxWidth: 1140, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }} className="rq-map-grid">
      <Reveal>
        <div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10.5, letterSpacing: "0.18em", color: C.textMuted, marginBottom: 16 }}>REAL-TIME IMPACT</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px, 4.2vw, 56px)", fontWeight: 900, color: C.text, lineHeight: 1.1, marginBottom: 22 }}>
            Rescues happening right now, across India.
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15.5, color: C.textMuted, lineHeight: 1.82, marginBottom: 44 }}>
            Our live operations dashboard shows every active donation, pickup in progress, and delivery completed — city by city, minute by minute.
          </p>
          {[
            { city: "New Delhi", meals: 124, color: C.sage, pct: 95 },
            { city: "Mumbai", meals: 98, color: C.amber, pct: 75 },
            { city: "Bangalore", meals: 76, color: C.ember, pct: 58 },
            { city: "Chennai", meals: 52, color: C.mint, pct: 40 },
          ].map((c, i) => (
            <div key={i} style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 9, height: 9, borderRadius: "50%", background: c.color }} />
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: C.text }}>{c.city}</span>
                </div>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: c.color, fontWeight: 500 }}>{c.meals} meals</span>
              </div>
              <div style={{ height: 6, background: C.border, borderRadius: 100, overflow: "hidden" }}>
                <motion.div initial={{ width: 0 }} whileInView={{ width: `${c.pct}%` }}
                  viewport={{ once: true }} transition={{ duration: 1.4, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                  style={{ height: "100%", background: c.color, borderRadius: 100 }} />
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.2}>
        <div style={{ position: "relative" }}>
          {/* India map SVG */}
          <svg viewBox="0 0 360 440" fill="none" style={{ width: "100%", filter: `drop-shadow(0 32px 64px rgba(0,0,0,0.15))` }}>
            <path d="M180 28 C215 22 248 38 268 70 C298 115 302 148 285 185 C274 208 295 228 290 258 C282 296 263 322 242 348 C222 374 202 398 180 422 C158 398 138 374 118 348 C97 322 78 296 70 258 C65 228 85 208 74 185 C57 148 62 115 92 70 C112 38 145 34 180 28Z"
              fill={C.surface} stroke={C.sage} strokeWidth="1.8" />
            {[
              { x: 152, y: 118, label: "Delhi", r: 14, color: C.sage },
              { x: 118, y: 258, label: "Mumbai", r: 11, color: C.amber },
              { x: 198, y: 282, label: "Bengaluru", r: 9, color: C.ember },
              { x: 218, y: 175, label: "Kolkata", r: 8, color: C.leafMid },
              { x: 168, y: 308, label: "Chennai", r: 7, color: C.gold },
              { x: 145, y: 210, label: "Hyderabad", r: 8, color: "#7c3aed" },
            ].map((dot, i) => (
              <g key={i}>
                <motion.circle cx={dot.x} cy={dot.y} r={dot.r + 8} fill={dot.color} opacity={0.14}
                  animate={{ r: [dot.r + 8, dot.r + 20, dot.r + 8] }}
                  transition={{ duration: 3, repeat: Infinity, delay: i * 0.55, ease: "easeInOut" }} />
                <circle cx={dot.x} cy={dot.y} r={dot.r} fill={dot.color} />
                <text x={dot.x + dot.r + 8} y={dot.y + 4} fontSize="10" fill={C.textMuted} fontFamily="DM Sans, sans-serif">{dot.label}</text>
              </g>
            ))}
          </svg>

          {/* Floating live chip */}
          <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3.5, repeat: Infinity }}
            style={{ position: "absolute", top: 20, right: -20, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "10px 16px", boxShadow: C.cardShadow }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.textMuted, marginBottom: 4 }}>ACTIVE NOW</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 900, color: C.sage }}>47</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: C.textMuted }}>Live pickups</div>
          </motion.div>
        </div>
      </Reveal>
    </div>
  </section>
);

/* ── TESTIMONIALS ── */
const testimonialsData = [
  { name: "Priya Sharma", role: "Restaurant Owner, Delhi", text: "ResQPlate turned our daily food waste into daily impact. The app is stupidly simple and the results are extraordinary.", avatar: "PS", color: "#52b788" },
  { name: "Rahul Gupta", role: "NGO Coordinator, Mumbai", text: "The AI matching cut our coordination time from hours to minutes. We're feeding 3× more families with the same team.", avatar: "RG", color: "#d97706" },
  { name: "Anita Verma", role: "Community Leader, Bangalore", text: "I've never seen a tech product that cares this much about real people. The impact dashboard made our donors cry with joy.", avatar: "AV", color: "#c2410c" },
];

const Testimonials = ({ C }) => (
  <section style={{ background: C.bg, padding: "120px 24px" }}>
    <div style={{ maxWidth: 1140, margin: "0 auto" }}>
      <Reveal>
        <div style={{ textAlign: "center", marginBottom: 80 }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10.5, letterSpacing: "0.18em", color: C.textMuted, marginBottom: 16 }}>COMMUNITY VOICES</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(36px, 5vw, 62px)", fontWeight: 900, color: C.text, lineHeight: 1.05, margin: 0 }}>
            The people who make<br />it <em style={{ color: C.leafMid, fontStyle: "italic" }}>real.</em>
          </h2>
        </div>
      </Reveal>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 26 }} className="rq-testi-grid">
        {testimonialsData.map((t, i) => (
          <Reveal key={i} delay={i * 0.13}>
            <motion.div whileHover={{ y: -10, boxShadow: `0 36px 80px ${t.color}18` }}
              style={{ background: C.surface, borderRadius: 28, padding: 36, boxShadow: C.cardShadow, display: "flex", flexDirection: "column", border: `1px solid ${C.border}`, transition: "box-shadow 0.35s" }}>
              <div style={{ display: "flex", gap: 3, marginBottom: 24 }}>
                {[...Array(5)].map((_, j) => <span key={j} style={{ color: C.amber, fontSize: 16 }}>★</span>)}
              </div>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 17.5, color: C.text, lineHeight: 1.66, fontStyle: "italic", flex: 1, marginBottom: 28 }}>"{t.text}"</p>
              <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
                <motion.div whileHover={{ scale: 1.1 }}
                  style={{ width: 48, height: 48, borderRadius: "50%", background: `linear-gradient(135deg, ${t.color}, ${t.color}88)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 14, color: "#fff", flexShrink: 0 }}>
                  {t.avatar}
                </motion.div>
                <div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14.5, fontWeight: 600, color: C.text }}>{t.name}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: C.textMuted, marginTop: 2 }}>{t.role}</div>
                </div>
              </div>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* ── PARTNERS ── */
const Partners = ({ C }) => (
  <section style={{ background: C.bgAlt, padding: "72px 24px", borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
    <div style={{ maxWidth: 960, margin: "0 auto", textAlign: "center" }}>
      <Reveal>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10.5, letterSpacing: "0.18em", color: C.textMuted, marginBottom: 44 }}>TRUSTED BY</div>
      </Reveal>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 52, flexWrap: "wrap" }}>
        {["Food Corp India", "Akshaya Patra", "Feeding India", "Zomato Feeding", "FSSAI"].map((name, i) => (
          <Reveal key={i} delay={i * 0.08}>
            <motion.div whileHover={{ opacity: 1, scale: 1.06 }}
              style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: C.textMuted, opacity: 0.45, letterSpacing: "0.01em", cursor: "default" }}>
              {name}
            </motion.div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* ── NEWSLETTER STRIP ── */
const Newsletter = ({ C }) => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <section style={{ background: C.cream, padding: "80px 24px", borderBottom: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
        <Reveal>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10.5, letterSpacing: "0.18em", color: C.textMuted, marginBottom: 16 }}>STAY UPDATED</div>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 900, color: C.text, marginBottom: 12, lineHeight: 1.1 }}>
            Get impact stories in your inbox
          </h3>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: C.textMuted, marginBottom: 36, lineHeight: 1.75 }}>
            Monthly reports on meals rescued, CO₂ saved, and communities served.
          </p>
          <AnimatePresence mode="wait">
            {!sent ? (
              <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ display: "flex", gap: 10, maxWidth: 460, margin: "0 auto" }}>
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com"
                  style={{ flex: 1, padding: "14px 20px", borderRadius: 100, border: `1.5px solid ${C.borderStrong}`, background: C.surface, fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: C.text, outline: "none" }} />
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} onClick={() => email && setSent(true)}
                  style={{ background: C.leafMid, color: "#fff", border: "none", padding: "14px 28px", borderRadius: 100, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 14, cursor: "pointer", whiteSpace: "nowrap" }}>
                  Subscribe
                </motion.button>
              </motion.div>
            ) : (
              <motion.div key="thanks" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: C.sage }}>
                🎉 Welcome to the movement!
              </motion.div>
            )}
          </AnimatePresence>
        </Reveal>
      </div>
    </section>
  );
};

/* ── CTA ── */
const CTA = ({ C }) => (
  <section style={{ background: C.heroBg, padding: "140px 24px", position: "relative", overflow: "hidden", textAlign: "center" }}>
    <Particles C={C} />
    <LeafDeco C={C} style={{ width: 320, top: -60, left: -80, opacity: 0.5, transform: "rotate(-25deg)" }} />
    <LeafDeco C={C} style={{ width: 260, bottom: -30, right: -50, opacity: 0.4, transform: "rotate(150deg)" }} />
    <svg style={{ position: "absolute", bottom: -100, right: -100, width: 500, opacity: 0.05, pointerEvents: "none" }} viewBox="0 0 400 400">
      <circle cx="200" cy="200" r="180" stroke={C.amber} strokeWidth="50" fill="none" />
      <circle cx="200" cy="200" r="120" stroke={C.sage} strokeWidth="30" fill="none" opacity="0.6" />
    </svg>
    <div style={{ maxWidth: 720, margin: "0 auto", position: "relative", zIndex: 1 }}>
      <Reveal>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10.5, letterSpacing: "0.18em", color: "rgba(149,213,178,0.7)", marginBottom: 24 }}>JOIN THE MOVEMENT</div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(44px, 7vw, 90px)", fontWeight: 900, color: "#fff", lineHeight: 0.95, marginBottom: 26, letterSpacing: "-0.03em" }}>
          Ready to rescue<br />your first meal?
        </h2>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: "rgba(255,255,255,0.5)", marginBottom: 52, fontWeight: 300, lineHeight: 1.78 }}>
          Join 1,200+ donors and 50 NGOs already making India's food system more human.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <motion.button whileHover={{ scale: 1.06, boxShadow: `0 32px 72px rgba(217,119,6,0.5)` }} whileTap={{ scale: 0.97 }}
            style={{ background: C.amber, color: "#1a3d26", border: "none", padding: "20px 48px", borderRadius: 100, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 16, cursor: "pointer" }}>
            Start Donating →
          </motion.button>
          <motion.button whileHover={{ background: "rgba(255,255,255,0.14)" }} whileTap={{ scale: 0.97 }}
            style={{ background: "rgba(255,255,255,0.07)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", padding: "20px 48px", borderRadius: 100, fontFamily: "'DM Sans', sans-serif", fontWeight: 400, fontSize: 16, cursor: "pointer" }}>
            Request Food
          </motion.button>
        </div>
      </Reveal>
    </div>
  </section>
);

/* ── FOOTER ── */
const Footer = ({ C }) => (
  <footer style={{ background: C.surface, borderTop: `1px solid ${C.border}`, padding: "80px 24px 44px" }}>
    <div style={{ maxWidth: 1140, margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "2.2fr 1fr 1fr 1fr", gap: 48, marginBottom: 64 }} className="rq-footer-grid">
        <div>
          <ResQPlateLogo C={C} size={36} />
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: C.textMuted, lineHeight: 1.82, maxWidth: 290, marginTop: 18 }}>
            Connecting surplus food with families in need. Building a hunger-free India, one rescue at a time.
          </p>
          <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
            {["🐦", "📸", "💼"].map((icon, i) => (
              <motion.div key={i} whileHover={{ scale: 1.15, background: C.bgAlt }}
                style={{ width: 40, height: 40, borderRadius: "50%", background: C.bgAlt, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, cursor: "pointer" }}>
                {icon}
              </motion.div>
            ))}
          </div>
        </div>
        {[
          { title: "Platform", links: ["How it Works", "NGO Partners", "Volunteer", "Impact Map"] },
          { title: "Company", links: ["About", "Blog", "Press", "Careers"] },
          { title: "Support", links: ["Contact", "FAQ", "Privacy", "Terms"] },
        ].map((col, i) => (
          <div key={i}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.text, letterSpacing: "0.14em", marginBottom: 20, textTransform: "uppercase" }}>{col.title}</div>
            {col.links.map((link, j) => (
              <motion.div key={j} whileHover={{ x: 4, color: C.text }}
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: C.textMuted, marginBottom: 12, cursor: "pointer", transition: "color 0.2s" }}>
                {link}
              </motion.div>
            ))}
          </div>
        ))}
      </div>
      <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 30, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: C.textFaint }}>© 2026 ResQPlate · Built for Social Good</div>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: C.sage }}>🌿 Carbon-neutral operations</div>
      </div>
    </div>
  </footer>
);

/* ── GLOBAL STYLES ── */
const GlobalStyles = ({ C }) => {
  useEffect(() => {
    const style = document.createElement("style");
    style.id = "rq-global";
    style.textContent = `
      *, *::before, *::after { box-sizing: border-box; }
      html { scroll-behavior: smooth; }
      body { margin: 0; background: ${C.bg}; transition: background 0.5s; }
      a { text-decoration: none; color: inherit; }
      @keyframes shimmer { 0%,100% { background-position: 0% 50% } 50% { background-position: 100% 50% } }
      .rq-hero-inner { position: relative; z-index: 2; padding: 120px 5% 0 8%; max-width: 1240px; margin: 0 auto; width: 100%; }
      .rq-hero-card { display: block; }
      @media (max-width: 1020px) {
        .rq-hero-card { display: none !important; }
        .rq-hero-inner { padding: 120px 24px 0; text-align: center; }
        .rq-stats-grid { grid-template-columns: repeat(2,1fr) !important; }
        .rq-feat-grid { grid-template-columns: 1fr 1fr !important; }
        .rq-how-grid { grid-template-columns: 1fr 1fr !important; }
        .rq-how-line { display: none; }
        .rq-map-grid { grid-template-columns: 1fr !important; }
        .rq-testi-grid { grid-template-columns: 1fr !important; }
        .rq-footer-grid { grid-template-columns: 1fr 1fr !important; }
      }
      @media (max-width: 620px) {
        .rq-stats-grid { grid-template-columns: 1fr 1fr !important; padding: 36px 20px !important; }
        .rq-feat-grid { grid-template-columns: 1fr !important; }
        .rq-how-grid { grid-template-columns: 1fr !important; }
        .rq-footer-grid { grid-template-columns: 1fr !important; }
      }
    `;
    const existing = document.getElementById("rq-global");
    if (existing) existing.remove();
    document.head.appendChild(style);
    return () => { const el = document.getElementById("rq-global"); if (el) el.remove(); };
  }, [C.bg]);
  return null;
};

/* ══ ROOT ══ */
const Landing = () => {
  const { dark, toggle } = useDarkMode();
  const C = palette(dark);
  return (
    <>
      <FontLoader />
      <GlobalStyles C={C} />
      <Grain />
      <Ticker C={C} />
      <NavBar C={C} dark={dark} toggleDark={toggle} />
      <Hero C={C} />
      <Stats C={C} />
      <Mission C={C} />
      <Features C={C} />
      <HowItWorks C={C} />
      <ImpactMap C={C} />
      <Testimonials C={C} />
      <Partners C={C} />
      <Newsletter C={C} />
      <CTA C={C} />
      <Footer C={C} />
    </>
  );
};

export default Landing;