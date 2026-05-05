import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { motion, AnimatePresence, useSpring } from "framer-motion";

/* ══════════════════════════════════════
   FALLBACK THEME  (used if no OutletContext)
══════════════════════════════════════ */
const fallbackTheme = {
  bg: "#080e0a", bgAlt: "#0d1710", bgCard: "#111c14", bgCardHover: "#152018",
  bgInput: "#0d1710", border: "rgba(34,197,94,0.08)", borderMed: "rgba(34,197,94,0.15)",
  borderStrong: "rgba(34,197,94,0.28)", text: "#ecfdf5", textMuted: "#6ee7b7",
  textFaint: "rgba(110,231,183,0.35)", accent: "#22c55e", accentGlow: "rgba(34,197,94,0.25)",
  accentSoft: "rgba(34,197,94,0.08)", amber: "#f59e0b", amberSoft: "rgba(245,158,11,0.12)",
  red: "#ef4444", redSoft: "rgba(239,68,68,0.12)", blue: "#3b82f6",
  blueSoft: "rgba(59,130,246,0.12)", purple: "#a855f7", purpleSoft: "rgba(168,85,247,0.12)",
  teal: "#14b8a6", tealSoft: "rgba(20,184,166,0.12)", shadow: "0 24px 64px rgba(0,0,0,0.6)",
  shadowSm: "0 4px 20px rgba(0,0,0,0.4)",
};

/* ══════════════════════════════════════
   MOCK DATA
══════════════════════════════════════ */
const recentListings = [
  { id: 1, name: "Dal Makhani + Basmati Rice", restaurant: "Taj Palace Hotel", qty: "45 meals", distance: "1.2 km", time: "Expires in 40 min", emoji: "🍛", urgent: true, category: "Main Course", calories: 420 },
  { id: 2, name: "Hyderabadi Biryani Platter", restaurant: "ITC Grand Chola", qty: "80 meals", distance: "2.8 km", time: "Expires in 2 hr", emoji: "🍲", urgent: false, category: "Main Course", calories: 650 },
  { id: 3, name: "Assorted Snack Boxes", restaurant: "Oberoi Bengaluru", qty: "120 boxes", distance: "4.1 km", time: "Expires in 3 hr", emoji: "📦", urgent: false, category: "Snacks", calories: 210 },
  { id: 4, name: "South Indian Thali Set", restaurant: "Marriott Chennai", qty: "60 meals", distance: "0.9 km", time: "Expires in 1 hr", emoji: "🥘", urgent: true, category: "Thali", calories: 580 },
];

const impactData = [
  { label: "Meals Rescued", value: 12847, suffix: "", icon: "🍽️", color: "#22c55e", spark: [80,95,110,88,130,120,160,145,190,175,220,200] },
  { label: "CO₂ Offset", value: 3842, suffix: " kg", icon: "🌿", color: "#14b8a6", spark: [40,48,55,44,65,58,72,68,88,80,95,90] },
  { label: "Families Fed", value: 4280, suffix: "", icon: "👨‍👩‍👧", color: "#f59e0b", spark: [30,36,40,34,50,46,58,54,68,62,75,70] },
  { label: "NGO Partners", value: 54, suffix: "", icon: "🤝", color: "#3b82f6", spark: [30,32,34,36,38,40,42,44,46,48,50,54] },
];

const volunteers = [
  { name: "Ramesh K.", city: "Delhi", rescues: 142, badge: "🏆", avatar: "RK", color: "#22c55e" },
  { name: "Priya S.", city: "Mumbai", rescues: 118, badge: "🥈", avatar: "PS", color: "#f59e0b" },
  { name: "Arun M.", city: "Bangalore", rescues: 97, badge: "🥉", avatar: "AM", color: "#3b82f6" },
  { name: "Neha V.", city: "Pune", rescues: 84, badge: "⭐", avatar: "NV", color: "#a855f7" },
];

const weeklyMeals = [142, 198, 165, 234, 312, 287, 198];
const weekDays = ["M", "T", "W", "T", "F", "S", "S"];

const categories = [
  { label: "Main Course", count: 48, color: "#22c55e", icon: "🍛" },
  { label: "Snacks", count: 31, color: "#f59e0b", icon: "🍿" },
  { label: "Desserts", count: 19, color: "#a855f7", icon: "🍰" },
  { label: "Beverages", count: 14, color: "#3b82f6", icon: "🥤" },
  { label: "Bakery", count: 22, color: "#14b8a6", icon: "🍞" },
];

const cityActivity = [
  { city: "New Delhi", meals: 2840, pct: 100, color: "#22c55e" },
  { city: "Mumbai", meals: 2340, pct: 82, color: "#f59e0b" },
  { city: "Bangalore", meals: 1820, pct: 64, color: "#3b82f6" },
  { city: "Chennai", meals: 1240, pct: 44, color: "#a855f7" },
  { city: "Hyderabad", meals: 980, pct: 35, color: "#14b8a6" },
];

/* ══════════════════════════════════════
   ANIMATED COUNTER
══════════════════════════════════════ */
const AnimCounter = ({ value }) => {
  const [display, setDisplay] = useState(0);
  const spring = useSpring(0, { stiffness: 55, damping: 18 });
  useEffect(() => { spring.set(value); }, [value]);
  useEffect(() => spring.on("change", v => setDisplay(Math.round(v))), [spring]);
  return <>{display.toLocaleString()}</>;
};

/* ══════════════════════════════════════
   MINI SPARKLINE
══════════════════════════════════════ */
const Spark = ({ data, color, w = 80, h = 28 }) => {
  const max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min || 1)) * (h - 4) - 2;
    return `${x},${y}`;
  });
  const path = `M${pts.join(" L")}`;
  const fill = `M${pts.join(" L")} L${w},${h} L0,${h} Z`;
  const id = `sp-${color.replace("#","")}`;
  return (
    <svg width={w} height={h} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fill} fill={`url(#${id})`} />
      <path d={path} stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

/* ══════════════════════════════════════
   SECTION HEADER
══════════════════════════════════════ */
const SectionHeader = ({ label, title, action, actionTo, T }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 16 }}>
    <div>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: T.textFaint, letterSpacing: "0.2em", marginBottom: 4, textTransform: "uppercase" }}>{label}</div>
      <h2 style={{ margin: 0, fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 19, fontWeight: 700, color: T.text, letterSpacing: "-0.02em" }}>{title}</h2>
    </div>
    {action && (
      <Link to={actionTo} style={{ textDecoration: "none" }}>
        <motion.span
          whileHover={{ x: 3 }}
          style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: T.accent, letterSpacing: "0.08em", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
        >
          {action} →
        </motion.span>
      </Link>
    )}
  </div>
);

/* ══════════════════════════════════════
   WELCOME HERO
══════════════════════════════════════ */
const WelcomeHero = ({ T, dark }) => {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const greetEmoji = hour < 12 ? "☀️" : hour < 17 ? "🌤️" : "🌙";

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{
        borderRadius: 24,
        padding: "28px 32px",
        marginBottom: 24,
        position: "relative",
        overflow: "hidden",
        background: dark
          ? `linear-gradient(135deg, #0d1f12 0%, #0a1a0f 60%, #081208 100%)`
          : `linear-gradient(135deg, #d1fae5 0%, #a7f3d0 60%, #6ee7b7 100%)`,
        border: `1px solid ${T.borderMed}`,
        boxShadow: `0 0 80px ${T.accentGlow}`,
      }}
    >
      {/* Decorative circles */}
      <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: `radial-gradient(circle, ${T.accent}18 0%, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -40, left: "30%", width: 160, height: 160, borderRadius: "50%", background: `radial-gradient(circle, ${T.teal}10 0%, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: `repeating-linear-gradient(0deg, transparent, transparent 40px, ${T.accent}04 40px, ${T.accent}04 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, ${T.accent}04 40px, ${T.accent}04 41px)`, pointerEvents: "none" }} />

      <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 22 }}>{greetEmoji}</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: T.accent, letterSpacing: "0.12em", fontWeight: 600 }}>{greeting.toUpperCase()}</span>
          </div>
          <h1 style={{ margin: 0, fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 30, fontWeight: 900, color: T.text, letterSpacing: "-0.03em", lineHeight: 1.1 }}>
            Salony Ranjan
          </h1>
          <p style={{ margin: "8px 0 0", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: T.textMuted, lineHeight: 1.6 }}>
            You've helped rescue <span style={{ color: T.accent, fontWeight: 700 }}>312 meals</span> today · <span style={{ color: T.teal }}>94 kg CO₂</span> saved 🌿
          </p>
        </div>

        {/* CTA Buttons */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link to="/dashboard/search" style={{ textDecoration: "none" }}>
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: `0 8px 30px ${T.accentGlow}` }}
              whileTap={{ scale: 0.97 }}
              style={{
                padding: "11px 22px", borderRadius: 14,
                background: T.accent, border: "none", color: "#fff",
                fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700,
                cursor: "pointer", letterSpacing: "0.04em", display: "flex", alignItems: "center", gap: 8,
              }}
            >
              🍱 Donate Food
            </motion.button>
          </Link>
          <Link to="/dashboard/search" style={{ textDecoration: "none" }}>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              style={{
                padding: "11px 22px", borderRadius: 14,
                background: T.accentSoft, border: `1px solid ${T.borderMed}`,
                color: T.accent, fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12, fontWeight: 700, cursor: "pointer", letterSpacing: "0.04em",
                display: "flex", alignItems: "center", gap: 8,
              }}
            >
              🔍 Find Food
            </motion.button>
          </Link>
        </div>
      </div>

      {/* Streaks bar */}
      <div style={{ position: "relative", marginTop: 20, paddingTop: 16, borderTop: `1px solid ${T.border}`, display: "flex", gap: 24, flexWrap: "wrap" }}>
        {[
          { icon: "🔥", label: "Day Streak", value: "15 days" },
          { icon: "📍", label: "City", value: "New Delhi" },
          { icon: "⭐", label: "Rank", value: "#4 Volunteer" },
          { icon: "🏅", label: "Badge", value: "Silver Hero" },
        ].map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 16 }}>{s.icon}</span>
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: T.textFaint, letterSpacing: "0.12em" }}>{s.label.toUpperCase()}</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700, color: T.text }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

/* ══════════════════════════════════════
   QUICK ACTIONS GRID
══════════════════════════════════════ */
const QuickActions = ({ T }) => {
  const actions = [
    { icon: "🍱", label: "Donate Food", desc: "Share your surplus", to: "/dashboard/search", color: T.accent, bg: T.accentSoft, border: T.borderMed },
    { icon: "🔍", label: "Find Food", desc: "Browse listings", to: "/dashboard/search", color: T.blue, bg: T.blueSoft, border: `rgba(59,130,246,0.2)` },
    { icon: "📦", label: "Track Order", desc: "Live updates", to: "/dashboard/orders", color: T.amber, bg: T.amberSoft, border: `rgba(245,158,11,0.2)` },
    { icon: "💚", label: "My Donations", desc: "View history", to: "/dashboard/profile", color: T.teal, bg: T.tealSoft, border: `rgba(20,184,166,0.2)` },
    { icon: "🗺️", label: "Live Map", desc: "Rescue near you", to: "/map", color: T.purple, bg: T.purpleSoft, border: `rgba(168,85,247,0.2)` },
    { icon: "🏆", label: "Leaderboard", desc: "Top volunteers", to: "/leaderboard", color: T.amber, bg: T.amberSoft, border: `rgba(245,158,11,0.2)` },
    { icon: "📊", label: "Analytics", desc: "Deep insights", to: "/analytics", color: T.teal, bg: T.tealSoft, border: `rgba(20,184,166,0.2)` },
    { icon: "⚙️", label: "Settings", desc: "Preferences", to: "/settings", color: T.textMuted, bg: T.border, border: T.border },
  ];

  return (
    <div style={{ marginBottom: 28 }}>
      <SectionHeader label="navigation" title="Quick Actions" T={T} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }} className="rqdh-actions">
        {actions.map((a, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.055, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link to={a.to} style={{ textDecoration: "none" }}>
              <motion.div
                whileHover={{ y: -4, boxShadow: `0 12px 40px ${a.color}22` }}
                whileTap={{ scale: 0.97 }}
                style={{
                  background: T.bgCard, borderRadius: 18, padding: "18px 16px",
                  border: `1px solid ${T.border}`, cursor: "pointer",
                  transition: "border-color 0.2s", position: "relative", overflow: "hidden",
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = a.color + "44"}
                onMouseLeave={e => e.currentTarget.style.borderColor = T.border}
              >
                <div style={{ position: "absolute", top: 0, right: 0, width: 80, height: 80, borderRadius: "50%", background: `radial-gradient(circle, ${a.color}12 0%, transparent 70%)`, pointerEvents: "none" }} />
                <div style={{ width: 42, height: 42, borderRadius: 13, background: a.bg, border: `1px solid ${a.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 12 }}>{a.icon}</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700, color: T.text, marginBottom: 3 }}>{a.label}</div>
                <div style={{ fontFamily: "sans-serif", fontSize: 11, color: T.textFaint }}>{a.desc}</div>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════
   IMPACT STAT CARDS
══════════════════════════════════════ */
const ImpactStats = ({ T }) => (
  <div style={{ marginBottom: 28 }}>
    <SectionHeader label="metrics" title="Your Impact at a Glance" T={T} />
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }} className="rqdh-stats">
      {impactData.map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 + i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -3, boxShadow: `0 16px 48px ${s.color}22` }}
          style={{
            background: T.bgCard, borderRadius: 20, padding: "20px",
            border: `1px solid ${T.border}`, boxShadow: T.shadowSm,
            display: "flex", flexDirection: "column", gap: 12, position: "relative", overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: `radial-gradient(circle, ${s.color}12 0%, transparent 70%)` }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ width: 38, height: 38, borderRadius: 12, background: `${s.color}18`, border: `1px solid ${s.color}28`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{s.icon}</div>
            <div style={{ background: `${s.color}18`, border: `1px solid ${s.color}33`, borderRadius: 100, padding: "2px 8px" }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: s.color, fontWeight: 700 }}>▲ ALL TIME</span>
            </div>
          </div>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 26, fontWeight: 700, color: T.text, lineHeight: 1 }}>
              <AnimCounter value={s.value} /><span style={{ fontSize: 14, color: s.color, marginLeft: 1 }}>{s.suffix}</span>
            </div>
            <div style={{ fontFamily: "sans-serif", fontSize: 11, color: T.textMuted, marginTop: 5 }}>{s.label}</div>
          </div>
          <Spark data={s.spark} color={s.color} w={100} h={28} />
        </motion.div>
      ))}
    </div>
  </div>
);

/* ══════════════════════════════════════
   FOOD LISTINGS
══════════════════════════════════════ */
const FoodListings = ({ T }) => {
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  const filtered = filter === "urgent"
    ? recentListings.filter(l => l.urgent)
    : recentListings;

  return (
    <div style={{ marginBottom: 28 }}>
      <SectionHeader label="live feed" title="Recent Listings" action="See All" actionTo="/dashboard/search" T={T} />

      {/* Filter pills */}
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {[{ id: "all", label: "All Listings" }, { id: "urgent", label: "⚠️ Expiring Soon" }].map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            style={{
              padding: "6px 14px", borderRadius: 100, border: `1px solid ${filter === f.id ? T.accent : T.border}`,
              background: filter === f.id ? T.accentSoft : "transparent",
              color: filter === f.id ? T.accent : T.textMuted,
              fontFamily: "'JetBrains Mono', monospace", fontSize: 10, cursor: "pointer", fontWeight: filter === f.id ? 700 : 400,
              letterSpacing: "0.04em", transition: "all 0.2s",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <AnimatePresence>
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ x: 4, boxShadow: `0 8px 32px ${T.accent}14` }}
              onClick={() => navigate("/dashboard/search")}
              style={{
                background: T.bgCard, borderRadius: 18,
                border: `1px solid ${item.urgent ? T.amber + "44" : T.border}`,
                padding: "16px 18px", cursor: "pointer", display: "flex",
                alignItems: "center", gap: 14, transition: "border-color 0.2s, box-shadow 0.2s",
                position: "relative", overflow: "hidden",
              }}
            >
              {item.urgent && (
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${T.amber}, ${T.red})` }} />
              )}

              {/* Food emoji */}
              <div style={{
                width: 52, height: 52, borderRadius: 15, flexShrink: 0,
                background: `${T.accent}14`, border: `1px solid ${T.borderMed}`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24,
              }}>{item.emoji}</div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                  <div style={{ fontFamily: "sans-serif", fontSize: 14, fontWeight: 600, color: T.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</div>
                  {item.urgent && (
                    <span style={{ background: T.amberSoft, color: T.amber, border: `1px solid ${T.amber}44`, borderRadius: 100, padding: "2px 8px", fontSize: 9, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, flexShrink: 0 }}>URGENT</span>
                  )}
                </div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: T.textMuted }}>{item.restaurant}</div>
                <div style={{ display: "flex", gap: 14, marginTop: 6 }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: T.accent }}>🍽 {item.qty}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: T.textFaint }}>📍 {item.distance}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: item.urgent ? T.amber : T.textFaint }}>⏱ {item.time}</span>
                </div>
              </div>

              {/* Category badge + arrow */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, flexShrink: 0 }}>
                <span style={{ background: T.bgAlt, color: T.textMuted, border: `1px solid ${T.border}`, borderRadius: 100, padding: "3px 10px", fontSize: 9, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.06em" }}>{item.category}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: T.teal }}>~{item.calories} kcal</span>
              </div>

              <div style={{ color: T.textFaint, fontSize: 16, flexShrink: 0 }}>→</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════
   WEEKLY ACTIVITY MINI CHART
══════════════════════════════════════ */
const WeeklyChart = ({ T }) => {
  const max = Math.max(...weeklyMeals);
  const today = new Date().getDay();
  const todayIdx = today === 0 ? 6 : today - 1;

  return (
    <div style={{ flex: 1 }}>
      <SectionHeader label="trend" title="This Week's Rescues" T={T} />
      <div style={{
        background: T.bgCard, borderRadius: 20, padding: "20px 22px",
        border: `1px solid ${T.border}`, boxShadow: T.shadowSm,
      }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 100, marginBottom: 8 }}>
          {weeklyMeals.map((v, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              {i === todayIdx && (
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: T.accent, fontWeight: 700 }}>{v}</div>
              )}
              <div style={{ width: "100%", height: 80, display: "flex", alignItems: "flex-end" }}>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(v / max) * 100}%` }}
                  transition={{ duration: 1, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    width: "100%", borderRadius: "5px 5px 0 0",
                    background: i === todayIdx
                      ? `linear-gradient(180deg, ${T.accent}, ${T.teal})`
                      : i === 4
                        ? `${T.accent}55`
                        : T.accentSoft,
                    border: `1px solid ${i === todayIdx ? T.accent : T.border}`,
                    boxShadow: i === todayIdx ? `0 0 16px ${T.accentGlow}` : "none",
                  }}
                />
              </div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: i === todayIdx ? T.accent : T.textFaint, fontWeight: i === todayIdx ? 700 : 400 }}>{weekDays[i]}</span>
            </div>
          ))}
        </div>
        <div style={{ paddingTop: 12, borderTop: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: T.textFaint, letterSpacing: "0.1em" }}>TOTAL THIS WEEK</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 16, fontWeight: 700, color: T.accent, marginTop: 2 }}>
              {weeklyMeals.reduce((a, b) => a + b, 0).toLocaleString()} meals
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: T.textFaint, letterSpacing: "0.1em" }}>VS LAST WEEK</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 700, color: T.teal, marginTop: 2 }}>▲ 18%</div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════
   CITY DISTRIBUTION
══════════════════════════════════════ */
const CityDistribution = ({ T }) => (
  <div style={{ flex: 1 }}>
    <SectionHeader label="geospatial" title="City Activity" T={T} />
    <div style={{
      background: T.bgCard, borderRadius: 20, padding: "20px 22px",
      border: `1px solid ${T.border}`, boxShadow: T.shadowSm,
    }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
        {cityActivity.map((c, i) => (
          <div key={i}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: c.color }} />
                <span style={{ fontFamily: "sans-serif", fontSize: 12.5, color: T.text }}>{c.city}</span>
              </div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: c.color, fontWeight: 700 }}>{c.meals.toLocaleString()}</span>
            </div>
            <div style={{ height: 6, background: T.bgAlt, borderRadius: 100, overflow: "hidden" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${c.pct}%` }}
                transition={{ duration: 1.2, delay: 0.4 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                style={{ height: "100%", background: `linear-gradient(90deg, ${c.color}aa, ${c.color})`, borderRadius: 100 }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ══════════════════════════════════════
   TOP VOLUNTEERS
══════════════════════════════════════ */
const TopVolunteers = ({ T }) => (
  <div style={{ marginBottom: 28 }}>
    <SectionHeader label="leaderboard" title="Top Volunteers" action="View All" actionTo="/leaderboard" T={T} />
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }} className="rqdh-volunteers">
      {volunteers.map((v, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 + i * 0.07 }}
          whileHover={{ y: -4, boxShadow: `0 14px 40px ${v.color}20` }}
          style={{
            background: T.bgCard, borderRadius: 18, padding: "18px 16px",
            border: `1px solid ${T.border}`, textAlign: "center",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
            transition: "box-shadow 0.3s",
          }}
        >
          <div style={{ position: "relative" }}>
            <div style={{
              width: 52, height: 52, borderRadius: "50%",
              background: `linear-gradient(135deg, ${v.color}55, ${v.color}22)`,
              border: `2px solid ${v.color}66`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 700, color: v.color,
            }}>{v.avatar}</div>
            <div style={{ position: "absolute", bottom: -4, right: -4, fontSize: 16 }}>{v.badge}</div>
          </div>
          <div>
            <div style={{ fontFamily: "sans-serif", fontSize: 12.5, fontWeight: 600, color: T.text }}>{v.name}</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: T.textMuted, marginTop: 2 }}>{v.city}</div>
          </div>
          <div style={{ background: T.bgAlt, borderRadius: 10, padding: "6px 14px", border: `1px solid ${T.border}` }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 16, fontWeight: 700, color: v.color }}>{v.rescues}</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: T.textFaint, letterSpacing: "0.12em" }}>RESCUES</div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

/* ══════════════════════════════════════
   FOOD CATEGORIES
══════════════════════════════════════ */
const FoodCategories = ({ T }) => (
  <div style={{ marginBottom: 28 }}>
    <SectionHeader label="browse" title="Browse by Category" action="All Categories" actionTo="/dashboard/search" T={T} />
    <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 6 }}>
      {categories.map((cat, i) => (
        <Link to={`/dashboard/search?cat=${cat.label}`} key={i} style={{ textDecoration: "none", flexShrink: 0 }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + i * 0.06 }}
            whileHover={{ y: -3, boxShadow: `0 10px 32px ${cat.color}22` }}
            style={{
              background: T.bgCard, borderRadius: 16, padding: "14px 20px",
              border: `1px solid ${T.border}`, cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
              minWidth: 90, transition: "all 0.2s",
            }}
          >
            <span style={{ fontSize: 26 }}>{cat.icon}</span>
            <div style={{ fontFamily: "sans-serif", fontSize: 11.5, fontWeight: 600, color: T.text, textAlign: "center" }}>{cat.label}</div>
            <div style={{ background: `${cat.color}18`, color: cat.color, borderRadius: 100, padding: "2px 10px", fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700 }}>{cat.count}</div>
          </motion.div>
        </Link>
      ))}
    </div>
  </div>
);

/* ══════════════════════════════════════
   LIVE STATUS BANNER
══════════════════════════════════════ */
const LiveBanner = ({ T }) => {
  const [pulse, setPulse] = useState(true);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      style={{
        background: T.accentSoft, borderRadius: 16, padding: "14px 20px",
        border: `1px solid ${T.borderMed}`, marginBottom: 24,
        display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap",
      }}
    >
      <motion.div
        animate={{ opacity: [1, 0.3, 1], scale: [1, 1.2, 1] }}
        transition={{ duration: 1.4, repeat: Infinity }}
        style={{ width: 10, height: 10, borderRadius: "50%", background: T.accent, flexShrink: 0 }}
      />
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: T.accent, fontWeight: 700, letterSpacing: "0.14em" }}>LIVE</span>
      <div style={{ width: 1, height: 16, background: T.borderMed }} />
      <span style={{ fontFamily: "sans-serif", fontSize: 12.5, color: T.textMuted, flex: 1 }}>
        <span style={{ color: T.text, fontWeight: 600 }}>24 new rescues</span> in the last 30 minutes ·
        <span style={{ color: T.teal }}> 6 NGOs active</span> ·
        <span style={{ color: T.amber }}> 3 urgent pickups</span> nearby
      </span>
      <Link to="/dashboard/search" style={{ textDecoration: "none" }}>
        <motion.span
          whileHover={{ scale: 1.05 }}
          style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: T.accent, fontWeight: 700, cursor: "pointer", letterSpacing: "0.08em" }}
        >
          VIEW ALL →
        </motion.span>
      </Link>
    </motion.div>
  );
};

/* ══════════════════════════════════════
   INJECT RESPONSIVE STYLES
══════════════════════════════════════ */
const useStyles = () => {
  useEffect(() => {
    const s = document.createElement("style");
    s.id = "rqdh-styles";
    s.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap');
      @media (max-width: 1100px) {
        .rqdh-actions { grid-template-columns: repeat(4, 1fr) !important; }
        .rqdh-stats { grid-template-columns: repeat(2, 1fr) !important; }
        .rqdh-volunteers { grid-template-columns: repeat(2, 1fr) !important; }
      }
      @media (max-width: 700px) {
        .rqdh-actions { grid-template-columns: repeat(2, 1fr) !important; }
        .rqdh-stats { grid-template-columns: repeat(2, 1fr) !important; }
        .rqdh-volunteers { grid-template-columns: repeat(2, 1fr) !important; }
      }
    `;
    document.getElementById("rqdh-styles")?.remove();
    document.head.appendChild(s);
    return () => document.getElementById("rqdh-styles")?.remove();
  }, []);
};

/* ══════════════════════════════════════
   ROOT  DASHBOARDHOME
══════════════════════════════════════ */
const DashboardHome = () => {
  // Consume theme from DashboardLayout via Outlet context
  // Falls back to dark theme if used standalone
  let T, dark;
  try {
    const ctx = useOutletContext();
    T = ctx?.T || fallbackTheme;
    dark = ctx?.dark ?? true;
  } catch {
    T = fallbackTheme;
    dark = true;
  }

  useStyles();

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto" }}>
      {/* Welcome Hero */}
      <WelcomeHero T={T} dark={dark} />

      {/* Live status banner */}
      <LiveBanner T={T} />

      {/* Quick Actions */}
      <QuickActions T={T} />

      {/* Impact Stats */}
      <ImpactStats T={T} />

      {/* Charts row */}
      <div style={{ display: "flex", gap: 16, marginBottom: 28 }} className="rqdh-charts">
        <WeeklyChart T={T} />
        <CityDistribution T={T} />
      </div>

      {/* Food Categories */}
      <FoodCategories T={T} />

      {/* Recent Listings */}
      <FoodListings T={T} />

      {/* Top Volunteers */}
      <TopVolunteers T={T} />

      {/* Motivation footer card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        style={{
          background: T.bgCard, borderRadius: 20, padding: "22px 28px",
          border: `1px solid ${T.border}`, marginBottom: 8,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: 16, flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <span style={{ fontSize: 36 }}>🌍</span>
          <div>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 16, fontWeight: 700, color: T.text, marginBottom: 4 }}>Every meal rescued matters.</div>
            <div style={{ fontFamily: "sans-serif", fontSize: 12, color: T.textMuted, lineHeight: 1.5 }}>Together we've diverted <strong style={{ color: T.accent }}>12,847 meals</strong> from landfills and fed thousands of families across India.</div>
          </div>
        </div>
        <Link to="/dashboard/search" style={{ textDecoration: "none" }}>
          <motion.button
            whileHover={{ scale: 1.04, boxShadow: `0 8px 28px ${T.accentGlow}` }}
            whileTap={{ scale: 0.97 }}
            style={{
              padding: "11px 22px", borderRadius: 14, background: T.accent,
              border: "none", color: "#fff", fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12, fontWeight: 700, cursor: "pointer", letterSpacing: "0.04em",
              whiteSpace: "nowrap",
            }}
          >
            🚀 Start Rescuing
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
};

export default DashboardHome;