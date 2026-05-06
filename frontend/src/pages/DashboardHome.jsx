import { useState, useEffect, useRef, useMemo } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { motion, AnimatePresence, useSpring } from "framer-motion";
import { databases } from "../services/appwrite";
import { Query } from "appwrite";
import { useAuth } from "../context/AuthContext";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const PICKUPS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_PICKUPS_COLLECTION_ID;

/* ════════════════════════════════════
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

/* ════════════════════════════════════
   LIVE DATA STATE
══════════════════════════════════════ */
const recentListings = [
  { id: 1, name: "Dal Makhani + Basmati Rice", restaurant: "Taj Palace Hotel", qty: "45 meals", distance: "1.2 km", time: "Expires in 40 min", emoji: "🍛", urgent: true, category: "Main Course", calories: 420 },
  { id: 2, name: "Hyderabadi Biryani Platter", restaurant: "ITC Grand Chola", qty: "80 meals", distance: "2.8 km", time: "Expires in 2 hr", emoji: "🍲", urgent: false, category: "Main Course", calories: 650 },
  { id: 3, name: "Assorted Snack Boxes", restaurant: "Oberoi Bengaluru", qty: "120 boxes", distance: "4.1 km", time: "Expires in 3 hr", emoji: "📦", urgent: false, category: "Snacks", calories: 210 },
  { id: 4, name: "South Indian Thali Set", restaurant: "Marriott Chennai", qty: "60 meals", distance: "0.9 km", time: "Expires in 1 hr", emoji: "🥘", urgent: true, category: "Thali", calories: 580 },
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

/* ════════════════════════════════════
   ANIMATED COUNTER
══════════════════════════════════════ */
const AnimCounter = ({ value }) => {
  const [display, setDisplay] = useState(0);
  const spring = useSpring(0, { stiffness: 55, damping: 18 });
  useEffect(() => { spring.set(value); }, [value]);
  useEffect(() => spring.on("change", v => setDisplay(Math.round(v))), [spring]);
  return <>{display.toLocaleString()}</>;
};

/* ════════════════════════════════════
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

/* ════════════════════════════════════
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

/* ════════════════════════════════════
   WELCOME HERO
══════════════════════════════════════ */
const WelcomeHero = ({ T, dark }) => {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const greetEmoji = hour < 12 ? "☀️" : hour < 17 ? "🌤️" : "🌙";
  const { user } = useAuth();
  const userName = user?.name?.split(" ")[0] || "Guest";

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
            {userName}
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

/* ════════════════════════════════════
   QUICK ACTIONS GRID
══════════════════════════════════════ */
const QuickActions = ({ T }) => {
  const actions = [
    { icon: "🍱", label: "Donate Food", desc: "Share your surplus", to: "/dashboard/donate", color: T.accent, bg: T.accentSoft, border: T.borderMed },
    { icon: "🔍", label: "Find Food", desc: "Browse listings", to: "/dashboard/search", color: T.blue, bg: T.blueSoft, border: `rgba(59,130,246,0.2)` },
    { icon: "📦", label: "Track Order", desc: "Live updates", to: "/dashboard/orders", color: T.amber, bg: T.amberSoft, border: `rgba(245,158,11,0.2)` },
    { icon: "💚", label: "My Donations", desc: "View history", to: "/dashboard/profile", color: T.teal, bg: T.tealSoft, border: `rgba(20,184,166,0.2)` },
    { icon: "🗺️", label: "Live Map", desc: "Rescue near you", to: "/map", color: T.purple, bg: T.purpleSoft, border: `rgba(168,85,247,0.2)` },
    { icon: "🏆", label: "Leaderboard", desc: "Top volunteers", to: "/dashboard/leader-board", color: T.amber, bg: T.amberSoft, border: `rgba(245,158,11,0.2)` },
    { icon: "📊", label: "Analytics", desc: "Deep insights", to: "/dashboard/analytics", color: T.teal, bg: T.tealSoft, border: `rgba(20,184,166,0.2)` },
    { icon: "⚡", label: "AI Matching", desc: "Smart food-NGO pairing", to: "/dashboard/ai-matching", color: "#10b981", bg: "rgba(16,185,129,0.08)", border: `rgba(16,185,129,0.15)` },
    { icon: "🔔", label: "Smart Alerts", desc: "Real-time notifications", to: "/dashboard/smart-alerts", color: "#7c3aed", bg: "rgba(124,58,237,0.08)", border: `rgba(124,58,237,0.15)` },
    { icon: "🚴", label: "Volunteer Pickups", desc: "Live tracking", to: "/dashboard/volunteer-pickups", color: T.blue, bg: T.blueSoft, border: `rgba(59,130,246,0.2)` },
    { icon: "📸", label: "Post 60s", desc: "Quick donation", to: "/dashboard/post-60", color: "#f59e0b", bg: T.amberSoft, border: `rgba(245,158,11,0.2)` },
    { icon: "⚙️", label: "Settings", desc: "Preferences", to: "/dashboard/settings", color: T.textMuted, bg: T.border, border: T.border },
  ];

  return (
    <div style={{ marginBottom: 28 }}>
      <SectionHeader label="navigation" title="Quick Actions" T={T} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 12 }} className="rqdh-actions">
        {actions.map((a, i) => (
          <Link key={i} to={a.to} style={{ textDecoration: "none" }}>
            <motion.div
              whileHover={{ y: -3, boxShadow: `0 12px 32px ${a.color}18` }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              style={{
                background: a.bg, borderRadius: 16, padding: "16px 14px",
                border: `1px solid ${a.border}`,
                display: "flex", flexDirection: "column", alignItems: "center",
                gap: 8, cursor: "pointer", transition: "border-color 0.2s, box-shadow 0.2s",
                textAlign: "center",
              }}
            >
              <span style={{ fontSize: 20, filter: "grayscale(0.3) opacity(0.85)", transition: "filter 0.2s" }}>{a.icon}</span>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: T.text }}>{a.label}</div>
                <div style={{ fontSize: 9, color: T.textMuted, marginTop: 2 }}>{a.desc}</div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
};

/* ════════════════════════════════════
   IMPACT STAT CARDS
══════════════════════════════════════ */
const ImpactStats = ({ T, impactStats }) => (
  <div style={{ marginBottom: 28 }}>
    <SectionHeader label="metrics" title="Your Impact at a Glance" T={T} />
    {impactStats.loading ? (
      <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          style={{ width: 40, height: 40, border: "4px solid rgba(16,185,129,0.2)", borderTopColor: "#10b981", borderRadius: "50%" }}
        />
      </div>
    ) : impactStats.error ? (
      <div style={{ padding: "1rem", background: T.redSoft, borderRadius: 12, color: T.red, fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>
        ⚠ {impactStats.error}
      </div>
    ) : (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
        {[
          { label: "Meals Rescued", value: impactStats.mealsRescued, suffix: "", icon: "🍽️", color: "#10b981" },
          { label: "CO₂ Offset", value: impactStats.co2Offset, suffix: " kg", icon: "🌿", color: "#14b8a6" },
          { label: "Families Fed", value: impactStats.familiesFed, suffix: "", icon: "👨‍👩‍👧", color: "#f59e0b" },
          { label: "NGO Partners", value: impactStats.ngoPartners, suffix: "", icon: "🤝", color: "#3b82f6" },
        ].map((s, i) => (
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
          </motion.div>
        ))}
      </div>
    )}
  </div>
);

/* ════════════════════════════════════
   FOOD LISTINGS
══════════════════════════════════════ */
const FoodListings = ({ T, recentAvailable, listingsLoading }) => {
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  const filtered = filter === "urgent"
    ? recentAvailable.filter(l => l.urgent)
    : recentAvailable;

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

      {listingsLoading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            style={{ width: 40, height: 40, border: "4px solid rgba(16,185,129,0.2)", borderTopColor: "#10b981", borderRadius: "50%" }}
          />
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <AnimatePresence>
            {(filtered.length > 0 ? filtered : recentListings).map((item, i) => (
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
                  background: `${T.accent}10`, border: `1px solid ${T.accent}22`,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
                }}>{item.emoji}</div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontFamily: "sans-serif", fontSize: 13, fontWeight: 600, color: T.text }}>{item.name}</div>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: T.textMuted, marginTop: 2 }}>From: {item.restaurant}</div>
                    </div>
                    <div style={{ background: `${T.amber}18`, border: `1px solid ${T.amber}33`, borderRadius: 8, padding: "4px 8px", flexShrink: 0 }}>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: T.amber, fontWeight: 700 }}>{item.time}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 12, marginTop: 8, flexWrap: "wrap" }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: T.accent, fontWeight: 600 }}>{item.qty}</span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: T.textFaint }}>📍 {item.distance}</span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: T.textFaint }}>{item.category}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {(filtered.length === 0 && !listingsLoading) && (
            <div style={{ textAlign: "center", padding: "2rem", color: T.textMuted, fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>
              No listings found. <Link to="/dashboard/search" style={{ color: T.accent }}>Browse all →</Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ════════════════════════════════════
   LIVE STATUS BANNER
══════════════════════════════════════ */
const LiveBanner = ({ T }) => (
  <div style={{
    background: `linear-gradient(90deg, ${T.accent}22, ${T.teal}22, ${T.amber}22)`,
    borderRadius: 16, padding: "16px 20px", marginBottom: 28,
    display: "flex", alignItems: "center", justifyContent: "space-between",
    flexWrap: "wrap", gap: 12, border: `1px solid ${T.borderMed}`,
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ fontSize: 20 }}>🌿</motion.div>
      <div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: T.text, letterSpacing: "0.08em", fontWeight: 600 }}>LIVE IMPACT</div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: T.textMuted, marginTop: 2 }}>Real-time rescue feed active</div>
      </div>
    </div>
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
      {[
        { label: "1200+ Meals", color: T.accent },
        { label: "50+ NGOS", color: T.teal },
        { label: "24/7 Active", color: T.amber },
      ].map((s, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: s.color, boxShadow: `0 0 8px ${s.color}` }} />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: s.color, fontWeight: 600 }}>{s.label}</span>
        </div>
      ))}
    </div>
  </div>
);

/* ════════════════════════════════════
   VOLUNTEER SECTION
══════════════════════════════════════ */
const VolunteerSection = ({ T }) => (
  <div style={{ marginBottom: 28 }}>
    <SectionHeader label="community" title="Top Volunteers" T={T} />
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 14 }} className="rqdh-volunteers">
      {volunteers.map((v, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.06 }}
          whileHover={{ y: -4 }}
          style={{
            background: T.bgCard, borderRadius: 16, padding: "16px",
            border: `1px solid ${T.border}`, textAlign: "center",
          }}
        >
          <div style={{
            width: 44, height: 44, borderRadius: 12, margin: "0 auto 8px",
            background: `${v.color}18`, border: `1px solid ${v.color}33`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, fontWeight: 700, color: v.color, fontFamily: "sans-serif",
          }}>{v.avatar}</div>
          <div style={{ fontSize: 12, fontWeight: 600, color: T.text, fontFamily: "sans-serif" }}>{v.name}</div>
          <div style={{ fontSize: 9, color: T.textMuted, marginTop: 2, fontFamily: "'JetBrains Mono', monospace" }}>{v.city}</div>
          <div style={{ fontSize: 9, color: v.color, marginTop: 4, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>{v.rescues} rescues</div>
          {v.badge && <div style={{ fontSize: 16, marginTop: 4 }}>{v.badge}</div>}
        </motion.div>
      ))}
    </div>
  </div>
);

/* ════════════════════════════════════
   WEEKLY CHART
══════════════════════════════════════ */
const WeeklyChart = ({ T }) => (
  <div style={{ marginBottom: 28 }}>
    <SectionHeader label="trends" title="This Week's Rescues" T={T} />
    <div style={{ background: T.bgCard, borderRadius: 18, padding: "20px 24px", border: `1px solid ${T.border}` }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120, marginBottom: 12 }}>
        {weeklyMeals.map((val, i) => (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(val / Math.max(...weeklyMeals)) * 100}px` }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              style={{ width: "100%", background: `linear-gradient(180deg, ${T.accent}, ${T.teal})`, borderRadius: 6, flexShrink: 0 }}
            />
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        {weekDays.map((d, i) => (
          <span key={i} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: T.textMuted, textAlign: "center", width: "100%" }}>{d}</span>
        ))}
      </div>
    </div>
  </div>
);

/* ════════════════════════════════════
   CATEGORY BREAKDOWN
══════════════════════════════════════ */
const CategoryBreakdown = ({ T }) => (
  <div style={{ marginBottom: 28 }}>
    <SectionHeader label="distribution" title="By Category" T={T} />
    <div style={{ background: T.bgCard, borderRadius: 18, padding: "20px 24px", border: `1px solid ${T.border}` }}>
      {categories.map((c, i) => (
        <div key={i} style={{ marginBottom: i < categories.length - 1 ? 12 : 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 14 }}>{c.icon}</span>
              <span style={{ fontFamily: "sans-serif", fontSize: 12, color: T.text }}>{c.label}</span>
            </div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: c.color, fontWeight: 600 }}>{c.count}</span>
          </div>
          <div style={{ height: 4, background: T.bgAlt, borderRadius: 100, overflow: "hidden" }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(c.count / Math.max(...categories.map(x => x.count))) * 100}%` }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              style={{ height: "100%", borderRadius: 100, background: c.color }}
            />
          </div>
        </div>
      ))}
    </div>
  </div>
);

/* ════════════════════════════════════
   CITY ACTIVITY
══════════════════════════════════════ */
const CityActivity = ({ T }) => (
  <div>
    <SectionHeader label="regional" title="City-wise Activity" T={T} />
    <div style={{ background: T.bgCard, borderRadius: 18, padding: "20px 24px", border: `1px solid ${T.border}` }}>
      {cityActivity.map((c, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: i < cityActivity.length - 1 ? 12 : 0 }}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%", background: c.color,
            flexShrink: 0, boxShadow: `0 0 8px ${c.color}44`,
          }} />
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "sans-serif", fontSize: 12, fontWeight: 600, color: T.text }}>{c.city}</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: c.color, fontWeight: 600 }}>{c.meals.toLocaleString()} meals</span>
            </div>
            <div style={{ height: 3, background: T.bgAlt, borderRadius: 100, marginTop: 6, overflow: "hidden" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${c.pct}%` }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                style={{ height: "100%", borderRadius: 100, background: c.color }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

/* ════════════════════════════════════
   GLOBAL STYLE INJECTOR
══════════════════════════════════════ */
const useStyles = () => {
  useEffect(() => {
    const style = document.createElement("style");
    style.id = "rq-dashboard-styles";
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Georgia&display=swap');
      *, *::before, *::after { box-sizing: border-box; }
      html, body { margin: 0; padding: 0; }
      ::-webkit-scrollbar { width: 5px; height: 5px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: rgba(34,197,94,0.3); border-radius: 3px; }
      ::-webkit-scrollbar-thumb:hover { background: rgba(34,197,94,0.5); }
      input::placeholder { color: rgba(110,231,183,0.4); }
      button { cursor: pointer; }
      a { text-decoration: none; }
      @media (max-width: 768px) {
        .rq-dashboard-styles { display: none !important; }
      }
    `;
    document.getElementById("rq-dashboard-styles")?.remove();
    document.head.appendChild(style);
    return () => document.getElementById("rq-dashboard-styles")?.remove();
  }, []);
};

/* ════════════════════════════════════
   ROOT DASHBOARDHOME
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

  const { user } = useAuth();

  // Live impact stats
  const [impactStats, setImpactStats] = useState({
    mealsRescued: 0,
    co2Offset: 0,
    familiesFed: 0,
    ngoPartners: 0,
    loading: true,
    error: null,
  });

  // Live recent listings (available pickups)
  const [recentAvailable, setRecentAvailable] = useState([]);
  const [listingsLoading, setListingsLoading] = useState(true);

  // Fetch live impact data
  useEffect(() => {
    let cancelled = false;

    const fetchImpact = async () => {
      try {
        const pickupsRes = await databases.listDocuments(
          DATABASE_ID,
          PICKUPS_COLLECTION_ID,
          [Query.limit(5000)]
        );
        const allPickups = pickupsRes.documents;

        const totalMeals = allPickups.reduce((sum, p) => {
          const qty = parseInt(p.qty?.match(/\d+/)?.[0] || p.meals || 0, 10);
          return sum + (isNaN(qty) ? 0 : qty);
        }, 0);

        const ngoSet = new Set();
        allPickups.forEach(p => {
          if (p.ngo || p.ngoName) ngoSet.add(p.ngo || p.ngoName);
        });

        if (!cancelled) {
          setImpactStats({
            mealsRescued: totalMeals,
            co2Offset: (totalMeals * 0.3).toFixed(1),
            familiesFed: Math.round(totalMeals / 3),
            ngoPartners: ngoSet.size,
            loading: false,
            error: null,
          });
        }
      } catch (err) {
        console.error("Failed to fetch impact data:", err);
        if (!cancelled) {
          setImpactStats(prev => ({ ...prev, loading: false, error: "Failed to load impact data" }));
        }
      }
    };

    fetchImpact();
    return () => { cancelled = true; };
  }, []);

  // Fetch recent available pickups
  useEffect(() => {
    let cancelled = false;

    const fetchListings = async () => {
      try {
        const res = await databases.listDocuments(
          DATABASE_ID,
          PICKUPS_COLLECTION_ID,
          [
            Query.equal("status", "available"),
            Query.orderDesc("$createdAt"),
            Query.limit(4),
          ]
        );
        if (!cancelled) {
          setRecentAvailable(res.documents);
          setListingsLoading(false);
        }
      } catch (err) {
        console.error("Failed to fetch recent listings:", err);
        if (!cancelled) setListingsLoading(false);
      }
    };

    fetchListings();
    return () => { cancelled = true; };
  }, []);

  useStyles();

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto" }}>
      {/* Welcome Hero */}
      <WelcomeHero T={T} dark={dark} />

      {/* AI Matching Promo */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          background: T.bgCard, borderRadius: 24, padding: "28px 32px",
          border: `1px solid ${T.border}`, marginBottom: 24,
          position: "relative", overflow: "hidden",
        }}
      >
        {/* Decorative elements */}
        <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: `radial-gradient(circle, ${T.accent}12 0%, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 20, right: 20, width: 80, height: 80, borderRadius: "50%", background: `radial-gradient(circle, ${T.teal}08 0%, transparent 70%)`, pointerEvents: "none" }} />

        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                style={{ fontSize: 24 }}
              >🤖</motion.div>
              <div style={{
                background: T.accentSoft, color: T.accent,
                padding: "4px 12px", borderRadius: 100,
                fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700,
                letterSpacing: "0.08em",
              }}>AI POWERED</div>
            </div>
            <h3 style={{
              margin: 0, fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: 24, fontWeight: 700, color: T.text,
              letterSpacing: "-0.02em", marginBottom: 8,
            }}>Smart Food-NGO Matching</h3>
            <p style={{
              margin: 0, fontFamily: "'JetBrains Mono', monospace", fontSize: 13,
              color: T.textMuted, lineHeight: 1.6,
              maxWidth: 400,
            }}>
              Our AI instantly matches surplus food with nearest NGOs in under 90 seconds,
              optimizing routes and minimizing food waste.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
              <Link to="/dashboard/ai-matching" style={{ textDecoration: "none" }}>
                <motion.button
                  whileHover={{ scale: 1.04, boxShadow: `0 8px 28px ${T.accentGlow}` }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    padding: "11px 22px", borderRadius: 14, border: "none",
                    background: T.accent, color: "#fff",
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700,
                    cursor: "pointer", letterSpacing: "0.04em", display: "flex",
                    alignItems: "center", gap: 8,
                  }}
                >
                  Try AI Matching →
                </motion.button>
              </Link>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => alert("Feature coming soon!")}
                style={{
                  padding: "11px 22px", borderRadius: 14,
                  background: T.bgAlt, border: `1px solid ${T.border}`,
                  color: T.text, fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 12, fontWeight: 600, cursor: "pointer",
                  letterSpacing: "0.04em",
                }}
              >
                Learn More
              </motion.button>
            </div>
          </div>

          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: 160, height: 160, borderRadius: 24,
              background: T.accentSoft, border: `1px solid ${T.accent}33`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 80, position: "relative", flexShrink: 0,
            }}
          >
            <div style={{
              position: "absolute", inset: 0, borderRadius: 24,
              background: `radial-gradient(circle, ${T.accent}08 0%, transparent 60%)`,
            }} />
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >🚀</motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Live status banner */}
      <LiveBanner T={T} />

      {/* Impact Stats */}
      <ImpactStats T={T} impactStats={impactStats} />

      {/* Quick Actions */}
      <QuickActions T={T} />

      {/* Two-column layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 28 }}>
        <div>
          {/* Food Listings */}
          <FoodListings T={T} recentAvailable={recentAvailable} listingsLoading={listingsLoading} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <WeeklyChart T={T} />
          <CategoryBreakdown T={T} />
        </div>
      </div>

      {/* Volunteer Section */}
      <VolunteerSection T={T} />

      {/* City Activity */}
      <CityActivity T={T} />
    </div>
  );
};

export default DashboardHome;
