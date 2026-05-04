import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useSpring, useMotionValue, useTransform } from "framer-motion";

/* ══════════════════════════════════════
   THEME SYSTEM
══════════════════════════════════════ */
const themes = {
  dark: {
    bg: "#080e0a",
    bgAlt: "#0d1710",
    bgCard: "#111c14",
    bgCardHover: "#152018",
    bgGlass: "rgba(11,20,13,0.92)",
    bgInput: "#0d1710",
    border: "rgba(34,197,94,0.08)",
    borderMed: "rgba(34,197,94,0.15)",
    borderStrong: "rgba(34,197,94,0.28)",
    text: "#ecfdf5",
    textMuted: "#6ee7b7",
    textFaint: "rgba(110,231,183,0.35)",
    accent: "#22c55e",
    accentGlow: "rgba(34,197,94,0.25)",
    accentSoft: "rgba(34,197,94,0.08)",
    amber: "#f59e0b",
    amberSoft: "rgba(245,158,11,0.12)",
    red: "#ef4444",
    redSoft: "rgba(239,68,68,0.12)",
    blue: "#3b82f6",
    blueSoft: "rgba(59,130,246,0.12)",
    purple: "#a855f7",
    purpleSoft: "rgba(168,85,247,0.12)",
    teal: "#14b8a6",
    tealSoft: "rgba(20,184,166,0.12)",
    chartLine: "rgba(34,197,94,0.7)",
    chartFill: "rgba(34,197,94,0.08)",
    navBg: "rgba(8,14,10,0.95)",
    sidebarBg: "#080e0a",
    scrollbar: "#1a2e1e",
    ring: "0 0 0 1.5px rgba(34,197,94,0.4)",
    shadow: "0 24px 64px rgba(0,0,0,0.6)",
    shadowSm: "0 4px 20px rgba(0,0,0,0.4)",
  },
  light: {
    bg: "#f0f7f2",
    bgAlt: "#e8f2eb",
    bgCard: "#ffffff",
    bgCardHover: "#f8fdf9",
    bgGlass: "rgba(255,255,255,0.92)",
    bgInput: "#f8fdf9",
    border: "rgba(26,74,46,0.08)",
    borderMed: "rgba(26,74,46,0.14)",
    borderStrong: "rgba(26,74,46,0.25)",
    text: "#0d1f12",
    textMuted: "#3a6647",
    textFaint: "rgba(58,102,71,0.4)",
    accent: "#16a34a",
    accentGlow: "rgba(22,163,74,0.2)",
    accentSoft: "rgba(22,163,74,0.08)",
    amber: "#d97706",
    amberSoft: "rgba(217,119,6,0.1)",
    red: "#dc2626",
    redSoft: "rgba(220,38,38,0.08)",
    blue: "#2563eb",
    blueSoft: "rgba(37,99,235,0.08)",
    purple: "#9333ea",
    purpleSoft: "rgba(147,51,234,0.08)",
    teal: "#0d9488",
    tealSoft: "rgba(13,148,136,0.08)",
    chartLine: "rgba(22,163,74,0.8)",
    chartFill: "rgba(22,163,74,0.08)",
    navBg: "rgba(240,247,242,0.95)",
    sidebarBg: "#e8f2eb",
    scrollbar: "#c9dece",
    ring: "0 0 0 1.5px rgba(22,163,74,0.35)",
    shadow: "0 24px 64px rgba(0,0,0,0.1)",
    shadowSm: "0 4px 20px rgba(0,0,0,0.06)",
  }
};

/* ══════════════════════════════════════
   MOCK DATA
══════════════════════════════════════ */
const weeklyData = [
  { day: "Mon", meals: 142, co2: 42, volunteers: 18, ngos: 12 },
  { day: "Tue", meals: 198, co2: 59, volunteers: 22, ngos: 15 },
  { day: "Wed", meals: 165, co2: 49, volunteers: 19, ngos: 13 },
  { day: "Thu", meals: 234, co2: 70, volunteers: 28, ngos: 18 },
  { day: "Fri", meals: 312, co2: 94, volunteers: 35, ngos: 22 },
  { day: "Sat", meals: 287, co2: 86, volunteers: 31, ngos: 20 },
  { day: "Sun", meals: 198, co2: 59, volunteers: 24, ngos: 16 },
];

const liveActivity = [
  { id: 1, type: "rescue", city: "New Delhi", food: "Dal Makhani + Rice", qty: 45, time: "2m ago", status: "matched", icon: "🍛" },
  { id: 2, type: "delivery", city: "Mumbai", food: "Biryani Platter", qty: 80, time: "5m ago", status: "transit", icon: "🍲" },
  { id: 3, type: "pickup", city: "Bangalore", food: "Snack Boxes", qty: 120, time: "8m ago", status: "complete", icon: "📦" },
  { id: 4, type: "rescue", city: "Chennai", food: "South Indian Thali", qty: 60, time: "12m ago", status: "pending", icon: "🥘" },
  { id: 5, type: "delivery", city: "Pune", food: "Bread + Vegetables", qty: 30, time: "18m ago", status: "complete", icon: "🥗" },
  { id: 6, type: "rescue", city: "Hyderabad", food: "Biryani + Raita", qty: 55, time: "24m ago", status: "transit", icon: "🍱" },
];

const ngoPartners = [
  { name: "Akshaya Patra", city: "Delhi", meals: 1240, rating: 4.9, active: true, color: "#22c55e" },
  { name: "Feeding India", city: "Mumbai", meals: 980, rating: 4.8, active: true, color: "#f59e0b" },
  { name: "Robin Hood Army", city: "Bangalore", meals: 760, rating: 4.7, active: false, color: "#3b82f6" },
  { name: "No Food Waste", city: "Chennai", meals: 520, rating: 4.9, active: true, color: "#a855f7" },
];

const donorStats = [
  { name: "Taj Hotels", meals: 3420, streak: 42, badge: "🏆 Gold" },
  { name: "Oberoi Group", meals: 2890, streak: 38, badge: "🥈 Silver" },
  { name: "Zomato Feeding", meals: 2340, streak: 29, badge: "🥉 Bronze" },
  { name: "Local Catering Co", meals: 1200, streak: 15, badge: "⭐ Rising" },
];

const cityData = [
  { city: "New Delhi", meals: 2840, pct: 100, color: "#22c55e" },
  { city: "Mumbai", meals: 2340, pct: 82, color: "#f59e0b" },
  { city: "Bangalore", meals: 1820, pct: 64, color: "#3b82f6" },
  { city: "Chennai", meals: 1240, pct: 44, color: "#a855f7" },
  { city: "Hyderabad", meals: 980, pct: 35, color: "#14b8a6" },
  { city: "Pune", meals: 760, pct: 27, color: "#ef4444" },
];

/* ══════════════════════════════════════
   SPARKLINE SVG
══════════════════════════════════════ */
const Sparkline = ({ data, color, width = 100, height = 36 }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / (max - min || 1)) * (height - 4) - 2;
    return `${x},${y}`;
  });
  const path = `M${pts.join(" L")}`;
  const fill = `M${pts.join(" L")} L${width},${height} L0,${height} Z`;
  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={`sg-${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fill} fill={`url(#sg-${color.replace("#","")})`} />
      <path d={path} stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

/* ══════════════════════════════════════
   ANIMATED BAR CHART
══════════════════════════════════════ */
const BarChart = ({ data, metric, T }) => {
  const max = Math.max(...data.map(d => d[metric]));
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 140, padding: "0 4px" }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <div style={{ width: "100%", height: 110, display: "flex", alignItems: "flex-end" }}>
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(d[metric] / max) * 100}%` }}
              transition={{ duration: 0.9, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              style={{
                width: "100%", borderRadius: "4px 4px 0 0",
                background: i === 4
                  ? `linear-gradient(180deg, ${T.accent}, ${T.teal})`
                  : T.accentSoft,
                border: `1px solid ${i === 4 ? T.accent : T.border}`,
                position: "relative", overflow: "hidden",
              }}
            >
              {i === 4 && (
                <motion.div
                  animate={{ y: [-100, 100] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)" }}
                />
              )}
            </motion.div>
          </div>
          <span style={{ fontFamily: "monospace", fontSize: 10, color: T.textFaint }}>{d.day}</span>
        </div>
      ))}
    </div>
  );
};

/* ══════════════════════════════════════
   DONUT CHART
══════════════════════════════════════ */
const DonutChart = ({ segments, T }) => {
  const total = segments.reduce((s, d) => s + d.value, 0);
  let cumAngle = -90;
  const r = 56, cx = 70, cy = 70, strokeW = 18;
  const circum = 2 * Math.PI * r;
  return (
    <svg width={140} height={140} viewBox="0 0 140 140">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={T.border} strokeWidth={strokeW} />
      {segments.map((seg, i) => {
        const pct = seg.value / total;
        const dashArr = `${pct * circum} ${circum}`;
        const rotation = cumAngle;
        cumAngle += pct * 360;
        return (
          <motion.circle
            key={i}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth={strokeW}
            strokeDasharray={dashArr}
            strokeDashoffset={circum * 0.25}
            strokeLinecap="round"
            initial={{ strokeDasharray: `0 ${circum}` }}
            animate={{ strokeDasharray: dashArr }}
            transition={{ duration: 1.2, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: `${cx}px ${cy}px`, transform: `rotate(${rotation}deg)` }}
          />
        );
      })}
      <text x={cx} y={cy - 6} textAnchor="middle" style={{ fontFamily: "monospace", fontSize: 20, fontWeight: 700, fill: T.text }}>{total}</text>
      <text x={cx} y={cy + 14} textAnchor="middle" style={{ fontFamily: "sans-serif", fontSize: 9, fill: T.textMuted }}>rescues</text>
    </svg>
  );
};

/* ══════════════════════════════════════
   ANIMATED COUNTER
══════════════════════════════════════ */
const AnimCounter = ({ value, duration = 1.8 }) => {
  const [display, setDisplay] = useState(0);
  const spring = useSpring(0, { stiffness: 60, damping: 20 });
  useEffect(() => { spring.set(value); }, [value]);
  useEffect(() => spring.on("change", v => setDisplay(Math.round(v))), [spring]);
  return <>{display.toLocaleString()}</>;
};

/* ══════════════════════════════════════
   STATUS BADGE
══════════════════════════════════════ */
const StatusBadge = ({ status, T }) => {
  const map = {
    matched: { color: T.blue, bg: T.blueSoft, label: "Matched" },
    transit: { color: T.amber, bg: T.amberSoft, label: "In Transit" },
    complete: { color: T.accent, bg: T.accentSoft, label: "Delivered" },
    pending: { color: T.textMuted, bg: T.border, label: "Pending" },
  };
  const s = map[status] || map.pending;
  return (
    <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.color}44`, borderRadius: 100, padding: "3px 10px", fontSize: 10, fontFamily: "monospace", fontWeight: 600, letterSpacing: "0.06em", whiteSpace: "nowrap" }}>
      {status === "transit" ? "● " : ""}{s.label}
    </span>
  );
};

/* ══════════════════════════════════════
   STAT CARD
══════════════════════════════════════ */
const StatCard = ({ icon, label, value, suffix, delta, color, sparkData, T }) => (
  <motion.div
    whileHover={{ y: -3, boxShadow: `0 20px 60px ${color}22` }}
    transition={{ type: "spring", stiffness: 300, damping: 25 }}
    style={{
      background: T.bgCard, borderRadius: 20, padding: "22px 24px",
      border: `1px solid ${T.border}`, boxShadow: T.shadowSm,
      display: "flex", flexDirection: "column", gap: 14, position: "relative", overflow: "hidden",
    }}
  >
    <div style={{ position: "absolute", top: 0, right: 0, width: 140, height: 140, borderRadius: "50%", background: `radial-gradient(circle, ${color}10 0%, transparent 70%)`, pointerEvents: "none" }} />
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div style={{ width: 44, height: 44, borderRadius: 14, background: `${color}18`, border: `1px solid ${color}28`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{icon}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 4, background: delta > 0 ? T.accentSoft : T.redSoft, border: `1px solid ${delta > 0 ? T.accent : T.red}33`, borderRadius: 100, padding: "3px 9px" }}>
        <span style={{ fontSize: 10, color: delta > 0 ? T.accent : T.red, fontFamily: "monospace", fontWeight: 700 }}>{delta > 0 ? "▲" : "▼"} {Math.abs(delta)}%</span>
      </div>
    </div>
    <div>
      <div style={{ fontFamily: "monospace", fontSize: 32, fontWeight: 700, color: T.text, lineHeight: 1 }}>
        <AnimCounter value={value} /><span style={{ fontSize: 18, color: color, marginLeft: 2 }}>{suffix}</span>
      </div>
      <div style={{ fontSize: 12, color: T.textMuted, marginTop: 6, fontFamily: "sans-serif" }}>{label}</div>
    </div>
    <div style={{ marginTop: 4 }}>
      <Sparkline data={sparkData} color={color} width={120} height={32} />
    </div>
  </motion.div>
);

/* ══════════════════════════════════════
   SIDEBAR NAV
══════════════════════════════════════ */
const navItems = [
  { icon: "⊞", label: "Dashboard", id: "dashboard" },
  { icon: "⚡", label: "Live Feed", id: "live", badge: 6 },
  { icon: "🗺", label: "Impact Map", id: "map" },
  { icon: "🤝", label: "NGO Network", id: "ngos" },
  { icon: "📊", label: "Analytics", id: "analytics" },
  { icon: "🏆", label: "Leaderboard", id: "leaderboard" },
  { icon: "⚙", label: "Settings", id: "settings" },
];

const Sidebar = ({ active, setActive, T, collapsed }) => (
  <div style={{
    width: collapsed ? 64 : 228, background: T.sidebarBg, borderRight: `1px solid ${T.border}`,
    display: "flex", flexDirection: "column", padding: "24px 0", gap: 2,
    transition: "width 0.3s cubic-bezier(0.22,1,0.36,1)", overflow: "hidden", flexShrink: 0,
    position: "sticky", top: 0, height: "100vh",
  }}>
    {/* Logo */}
    <div style={{ padding: "0 16px 24px", borderBottom: `1px solid ${T.border}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, overflow: "hidden" }}>
        <div style={{ width: 36, height: 36, flexShrink: 0, borderRadius: 12, background: `linear-gradient(135deg, ${T.accent}, ${T.teal})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🌿</div>
        {!collapsed && (
          <div style={{ overflow: "hidden" }}>
            <div style={{ fontFamily: "serif", fontWeight: 900, fontSize: 16, color: T.text, whiteSpace: "nowrap", letterSpacing: "-0.02em" }}>ResQ<span style={{ color: T.amber }}>Plate</span></div>
            <div style={{ fontFamily: "monospace", fontSize: 9, color: T.textMuted, letterSpacing: "0.1em" }}>OPS DASHBOARD</div>
          </div>
        )}
      </div>
    </div>

    {/* Nav */}
    <div style={{ padding: "16px 10px", display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
      {navItems.map(item => (
        <motion.button
          key={item.id}
          onClick={() => setActive(item.id)}
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.97 }}
          style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: collapsed ? "10px" : "10px 14px",
            borderRadius: 12, border: "none", cursor: "pointer",
            background: active === item.id ? T.accentSoft : "transparent",
            boxShadow: active === item.id ? `inset 0 0 0 1px ${T.borderMed}` : "none",
            justifyContent: collapsed ? "center" : "flex-start",
            transition: "all 0.2s", position: "relative", overflow: "visible",
          }}
        >
          <span style={{ fontSize: 16, flexShrink: 0, filter: active === item.id ? "none" : "grayscale(0.4) opacity(0.7)" }}>{item.icon}</span>
          {!collapsed && (
            <span style={{ fontFamily: "sans-serif", fontSize: 13.5, fontWeight: active === item.id ? 600 : 400, color: active === item.id ? T.accent : T.textMuted, whiteSpace: "nowrap", flex: 1, textAlign: "left" }}>{item.label}</span>
          )}
          {!collapsed && item.badge && (
            <span style={{ background: T.accent, color: "#fff", borderRadius: 100, padding: "1px 7px", fontSize: 9, fontFamily: "monospace", fontWeight: 700 }}>{item.badge}</span>
          )}
          {active === item.id && (
            <motion.div layoutId="nav-indicator" style={{ position: "absolute", left: collapsed ? 0 : -10, width: 3, top: 8, bottom: 8, borderRadius: 100, background: T.accent }} />
          )}
        </motion.button>
      ))}
    </div>

    {/* User */}
    {!collapsed && (
      <div style={{ padding: "16px", borderTop: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: `linear-gradient(135deg, ${T.accent}, ${T.teal})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", fontFamily: "sans-serif", flexShrink: 0 }}>AK</div>
        <div style={{ overflow: "hidden" }}>
          <div style={{ fontFamily: "sans-serif", fontSize: 13, fontWeight: 600, color: T.text, whiteSpace: "nowrap" }}>Arjun Kumar</div>
          <div style={{ fontFamily: "monospace", fontSize: 9, color: T.textMuted }}>Operations Lead</div>
        </div>
      </div>
    )}
  </div>
);

/* ══════════════════════════════════════
   TOP BAR
══════════════════════════════════════ */
const TopBar = ({ T, dark, toggleDark, collapsed, toggleSidebar }) => {
  const [time, setTime] = useState(new Date());
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const timeStr = time.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
  const dateStr = time.toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" });

  return (
    <div style={{
      height: 60, background: T.navBg, backdropFilter: "blur(24px)",
      borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center",
      padding: "0 24px", gap: 16, position: "sticky", top: 0, zIndex: 50,
    }}>
      {/* Collapse toggle */}
      <motion.button
        onClick={toggleSidebar} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
        style={{ width: 34, height: 34, borderRadius: 10, background: T.accentSoft, border: `1px solid ${T.borderMed}`, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4 }}
      >
        {[0, 1, 2].map(i => (
          <div key={i} style={{ width: 14, height: 1.5, background: T.accent, borderRadius: 1, transition: "all 0.3s", transform: collapsed && i === 0 ? "translateY(5.5px) rotate(45deg)" : collapsed && i === 2 ? "translateY(-5.5px) rotate(-45deg)" : i === 1 && collapsed ? "scaleX(0)" : "none" }} />
        ))}
      </motion.button>

      {/* Search */}
      <div style={{ flex: 1, maxWidth: 380, position: "relative" }}>
        <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 13, opacity: 0.4 }}>⌕</span>
        <input
          value={searchVal} onChange={e => setSearchVal(e.target.value)}
          placeholder="Search rescues, NGOs, cities…"
          style={{
            width: "100%", height: 34, paddingLeft: 32, paddingRight: 12,
            background: T.bgInput, border: `1px solid ${T.border}`, borderRadius: 10,
            fontFamily: "sans-serif", fontSize: 13, color: T.text, outline: "none",
            boxSizing: "border-box",
          }}
        />
        {searchVal && (
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
            style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12, padding: 10, boxShadow: T.shadow, zIndex: 100 }}>
            {["New Delhi rescues", "Akshaya Patra NGO", "Friday analytics"].filter(s => s.toLowerCase().includes(searchVal.toLowerCase())).map((r, i) => (
              <div key={i} onClick={() => setSearchVal("")} style={{ padding: "8px 10px", borderRadius: 8, cursor: "pointer", fontSize: 13, color: T.textMuted, fontFamily: "sans-serif" }}
                onMouseEnter={e => e.currentTarget.style.background = T.accentSoft}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >{r}</div>
            ))}
          </motion.div>
        )}
      </div>

      <div style={{ flex: 1 }} />

      {/* Live indicator */}
      <div style={{ display: "flex", alignItems: "center", gap: 7, background: T.accentSoft, border: `1px solid ${T.borderMed}`, borderRadius: 100, padding: "5px 12px" }}>
        <motion.div animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1.4, repeat: Infinity }}
          style={{ width: 6, height: 6, borderRadius: "50%", background: T.accent }} />
        <span style={{ fontFamily: "monospace", fontSize: 10, color: T.accent, letterSpacing: "0.1em" }}>LIVE</span>
      </div>

      {/* Clock */}
      <div style={{ textAlign: "right" }}>
        <div style={{ fontFamily: "monospace", fontSize: 14, fontWeight: 700, color: T.text, letterSpacing: "0.04em" }}>{timeStr}</div>
        <div style={{ fontFamily: "monospace", fontSize: 9, color: T.textMuted }}>{dateStr}</div>
      </div>

      {/* Notifications */}
      <div style={{ position: "relative" }}>
        <motion.button onClick={() => setNotifOpen(v => !v)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          style={{ width: 36, height: 36, borderRadius: 11, background: T.bgCard, border: `1px solid ${T.border}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
          <span style={{ fontSize: 15 }}>🔔</span>
          <div style={{ position: "absolute", top: 6, right: 6, width: 8, height: 8, borderRadius: "50%", background: T.red, border: `2px solid ${T.bg}` }} />
        </motion.button>
        <AnimatePresence>
          {notifOpen && (
            <motion.div initial={{ opacity: 0, y: -8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.96 }}
              style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, width: 320, background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 16, padding: 16, boxShadow: T.shadow, zIndex: 200 }}>
              <div style={{ fontFamily: "monospace", fontSize: 10, color: T.textMuted, marginBottom: 12, letterSpacing: "0.1em" }}>NOTIFICATIONS</div>
              {[
                { icon: "🍱", text: "New donation: 45 meals in Connaught Place", time: "2m", color: T.accent },
                { icon: "🚴", text: "Volunteer Ramesh picked up order #2847", time: "5m", color: T.blue },
                { icon: "✅", text: "Delivery confirmed — Akshaya Patra Delhi", time: "12m", color: T.teal },
                { icon: "⚠️", text: "3 meals expiring in 30 min — Pune", time: "18m", color: T.amber },
              ].map((n, i) => (
                <div key={i} style={{ display: "flex", gap: 10, padding: "10px 0", borderBottom: i < 3 ? `1px solid ${T.border}` : "none", cursor: "pointer" }}>
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: `${n.color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>{n.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "sans-serif", fontSize: 12, color: T.text, lineHeight: 1.4 }}>{n.text}</div>
                    <div style={{ fontFamily: "monospace", fontSize: 10, color: T.textFaint, marginTop: 3 }}>{n.time} ago</div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Dark toggle */}
      <motion.button onClick={toggleDark} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
        style={{ width: 36, height: 36, borderRadius: 11, background: T.bgCard, border: `1px solid ${T.border}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={dark ? "sun" : "moon"} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }} style={{ display: "flex", fontSize: 15 }}>
            {dark ? "☀️" : "🌙"}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

/* ══════════════════════════════════════
   DASHBOARD MAIN CONTENT
══════════════════════════════════════ */
const DashboardContent = ({ T }) => {
  const [metric, setMetric] = useState("meals");

  const statCards = [
    { icon: "🍽️", label: "Total Meals Rescued", value: 12847, suffix: "", delta: 18, color: T.accent, sparkData: [80, 120, 95, 160, 140, 200, 180, 240, 220, 280] },
    { icon: "🌿", label: "CO₂ Offset (kg)", value: 3842, suffix: "", delta: 12, color: T.teal, sparkData: [40, 55, 48, 72, 65, 88, 80, 105, 95, 115] },
    { icon: "🤝", label: "Active NGO Partners", value: 54, suffix: "", delta: 6, color: T.blue, sparkData: [30, 32, 36, 38, 42, 40, 46, 48, 50, 54] },
    { icon: "👥", label: "Volunteers Active", value: 248, suffix: "", delta: -3, color: T.amber, sparkData: [280, 260, 290, 270, 250, 265, 240, 255, 245, 248] },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontFamily: "monospace", fontSize: 10, color: T.textMuted, letterSpacing: "0.16em", marginBottom: 6 }}>OVERVIEW · TODAY</div>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: 28, fontWeight: 700, color: T.text, margin: 0, letterSpacing: "-0.02em" }}>Operations Dashboard</h1>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["Today", "7D", "30D", "All"].map(r => (
            <motion.button key={r} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              style={{ padding: "7px 16px", borderRadius: 10, border: `1px solid ${r === "7D" ? T.accent : T.border}`, background: r === "7D" ? T.accentSoft : "transparent", color: r === "7D" ? T.accent : T.textMuted, fontFamily: "monospace", fontSize: 11, cursor: "pointer", fontWeight: r === "7D" ? 700 : 400, letterSpacing: "0.04em" }}>
              {r}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }} className="rq-stat-grid">
        {statCards.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
            <StatCard {...s} T={T} />
          </motion.div>
        ))}
      </div>

      {/* Middle row */}
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 16 }} className="rq-mid-grid">

        {/* Bar chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          style={{ background: T.bgCard, borderRadius: 20, padding: 24, border: `1px solid ${T.border}`, boxShadow: T.shadowSm }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <div>
              <div style={{ fontFamily: "monospace", fontSize: 10, color: T.textMuted, letterSpacing: "0.1em", marginBottom: 4 }}>WEEKLY ACTIVITY</div>
              <div style={{ fontFamily: "Georgia, serif", fontSize: 17, fontWeight: 700, color: T.text }}>Rescue Performance</div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {["meals", "co2", "volunteers"].map(m => (
                <button key={m} onClick={() => setMetric(m)}
                  style={{ padding: "5px 12px", borderRadius: 8, border: `1px solid ${metric === m ? T.accent : T.border}`, background: metric === m ? T.accentSoft : "transparent", color: metric === m ? T.accent : T.textMuted, fontFamily: "monospace", fontSize: 9, cursor: "pointer", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  {m}
                </button>
              ))}
            </div>
          </div>
          <BarChart data={weeklyData} metric={metric} T={T} />
          <div style={{ display: "flex", gap: 20, marginTop: 16, paddingTop: 16, borderTop: `1px solid ${T.border}` }}>
            {[
              { label: "Peak day", val: "Friday · 312 meals", color: T.accent },
              { label: "Avg / day", val: "219 meals", color: T.blue },
              { label: "Trend", val: "↑ 18% vs last week", color: T.teal },
            ].map((s, i) => (
              <div key={i}>
                <div style={{ fontFamily: "monospace", fontSize: 9, color: T.textFaint, marginBottom: 3, letterSpacing: "0.08em" }}>{s.label.toUpperCase()}</div>
                <div style={{ fontFamily: "monospace", fontSize: 12, color: s.color, fontWeight: 600 }}>{s.val}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Donut + City distribution */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          style={{ background: T.bgCard, borderRadius: 20, padding: 24, border: `1px solid ${T.border}`, boxShadow: T.shadowSm }}>
          <div style={{ fontFamily: "monospace", fontSize: 10, color: T.textMuted, letterSpacing: "0.1em", marginBottom: 4 }}>CITY DISTRIBUTION</div>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 17, fontWeight: 700, color: T.text, marginBottom: 20 }}>By Region</div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <DonutChart segments={cityData.slice(0, 4).map(c => ({ value: c.meals, color: c.color }))} T={T} />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
              {cityData.slice(0, 4).map((c, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: c.color, flexShrink: 0 }} />
                  <span style={{ fontFamily: "sans-serif", fontSize: 12, color: T.textMuted, flex: 1 }}>{c.city}</span>
                  <span style={{ fontFamily: "monospace", fontSize: 11, color: c.color, fontWeight: 600 }}>{c.meals.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="rq-bottom-grid">

        {/* Live activity */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          style={{ background: T.bgCard, borderRadius: 20, padding: 24, border: `1px solid ${T.border}`, boxShadow: T.shadowSm }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <div style={{ fontFamily: "monospace", fontSize: 10, color: T.textMuted, letterSpacing: "0.1em", marginBottom: 4 }}>REAL-TIME</div>
              <div style={{ fontFamily: "Georgia, serif", fontSize: 17, fontWeight: 700, color: T.text }}>Live Activity Feed</div>
            </div>
            <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
              style={{ display: "flex", alignItems: "center", gap: 5, background: T.accentSoft, borderRadius: 100, padding: "4px 10px", border: `1px solid ${T.borderMed}` }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: T.accent }} />
              <span style={{ fontFamily: "monospace", fontSize: 9, color: T.accent, letterSpacing: "0.12em" }}>LIVE</span>
            </motion.div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {liveActivity.map((item, i) => (
              <motion.div key={item.id}
                initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 + 0.6 }}
                whileHover={{ background: T.accentSoft, paddingLeft: 6 }}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 4px", borderBottom: i < liveActivity.length - 1 ? `1px solid ${T.border}` : "none", cursor: "pointer", borderRadius: 8, transition: "all 0.2s" }}>
                <div style={{ width: 36, height: 36, borderRadius: 11, background: T.bgAlt, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{item.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "sans-serif", fontSize: 12.5, fontWeight: 500, color: T.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.food}</div>
                  <div style={{ fontFamily: "monospace", fontSize: 10, color: T.textMuted, marginTop: 2 }}>{item.city} · {item.qty} meals · {item.time}</div>
                </div>
                <StatusBadge status={item.status} T={T} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* NGO Partners + top donors in tabs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
          style={{ background: T.bgCard, borderRadius: 20, padding: 24, border: `1px solid ${T.border}`, boxShadow: T.shadowSm }}>
          <div>
            <NGOLeaderPanel T={T} />
          </div>
        </motion.div>
      </div>

      {/* City bars */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
        style={{ background: T.bgCard, borderRadius: 20, padding: 24, border: `1px solid ${T.border}`, boxShadow: T.shadowSm }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <div style={{ fontFamily: "monospace", fontSize: 10, color: T.textMuted, letterSpacing: "0.1em", marginBottom: 4 }}>GEOSPATIAL</div>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 17, fontWeight: 700, color: T.text }}>City-by-City Breakdown</div>
          </div>
          <span style={{ fontFamily: "monospace", fontSize: 10, color: T.textMuted }}>Total: {cityData.reduce((s, c) => s + c.meals, 0).toLocaleString()} meals</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {cityData.map((c, i) => (
            <div key={i}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: c.color }} />
                  <span style={{ fontFamily: "sans-serif", fontSize: 13, color: T.text }}>{c.city}</span>
                </div>
                <span style={{ fontFamily: "monospace", fontSize: 12, color: c.color, fontWeight: 700 }}>{c.meals.toLocaleString()} meals</span>
              </div>
              <div style={{ height: 7, background: T.bgAlt, borderRadius: 100, overflow: "hidden" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${c.pct}%` }}
                  transition={{ duration: 1.4, delay: i * 0.1 + 0.8, ease: [0.22, 1, 0.36, 1] }}
                  style={{ height: "100%", background: `linear-gradient(90deg, ${c.color}cc, ${c.color})`, borderRadius: 100 }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

/* ══════════════════════════════════════
   NGO + LEADERBOARD PANEL
══════════════════════════════════════ */
const NGOLeaderPanel = ({ T }) => {
  const [tab, setTab] = useState("ngos");
  return (
    <div>
      <div style={{ display: "flex", gap: 0, marginBottom: 20, background: T.bgAlt, borderRadius: 12, padding: 4 }}>
        {[{ id: "ngos", label: "NGO Network" }, { id: "donors", label: "Top Donors" }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ flex: 1, padding: "7px", borderRadius: 9, border: "none", background: tab === t.id ? T.bgCard : "transparent", color: tab === t.id ? T.text : T.textMuted, fontFamily: "sans-serif", fontSize: 12, fontWeight: tab === t.id ? 600 : 400, cursor: "pointer", boxShadow: tab === t.id ? T.shadowSm : "none", transition: "all 0.2s" }}>
            {t.label}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {tab === "ngos" ? (
          <motion.div key="ngos" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
            style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {ngoPartners.map((n, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 4px", borderBottom: i < ngoPartners.length - 1 ? `1px solid ${T.border}` : "none" }}>
                <div style={{ width: 38, height: 38, borderRadius: 11, background: `${n.color}20`, border: `1px solid ${n.color}33`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif", fontSize: 14, fontWeight: 700, color: n.color, flexShrink: 0 }}>
                  {n.name.slice(0, 2).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "sans-serif", fontSize: 13, fontWeight: 600, color: T.text }}>{n.name}</div>
                  <div style={{ fontFamily: "monospace", fontSize: 10, color: T.textMuted, marginTop: 2 }}>{n.city} · {n.meals.toLocaleString()} meals</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "monospace", fontSize: 11, color: T.amber, fontWeight: 600 }}>★ {n.rating}</div>
                  <div style={{ background: n.active ? T.accentSoft : T.bgAlt, color: n.active ? T.accent : T.textFaint, borderRadius: 100, padding: "2px 8px", fontSize: 9, fontFamily: "monospace", marginTop: 3 }}>{n.active ? "● ACTIVE" : "○ OFFLINE"}</div>
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div key="donors" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
            style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {donorStats.map((d, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 4px", borderBottom: i < donorStats.length - 1 ? `1px solid ${T.border}` : "none" }}>
                <div style={{ fontFamily: "monospace", fontSize: 18, fontWeight: 700, color: T.textFaint, width: 28, textAlign: "center" }}>#{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "sans-serif", fontSize: 13, fontWeight: 600, color: T.text }}>{d.name}</div>
                  <div style={{ fontFamily: "monospace", fontSize: 10, color: T.textMuted, marginTop: 2 }}>{d.meals.toLocaleString()} meals · {d.streak}d streak 🔥</div>
                </div>
                <div style={{ fontFamily: "monospace", fontSize: 11, color: T.amber }}>{d.badge}</div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ══════════════════════════════════════
   PLACEHOLDER PAGES
══════════════════════════════════════ */
const PlaceholderPage = ({ title, subtitle, T }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60vh", gap: 16 }}>
    <div style={{ fontSize: 64 }}>🚧</div>
    <h2 style={{ fontFamily: "Georgia, serif", fontSize: 24, color: T.text, margin: 0 }}>{title}</h2>
    <p style={{ fontFamily: "sans-serif", fontSize: 15, color: T.textMuted, margin: 0 }}>{subtitle}</p>
    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
      style={{ marginTop: 8, padding: "10px 24px", borderRadius: 12, background: T.accentSoft, border: `1px solid ${T.borderMed}`, color: T.accent, fontFamily: "monospace", fontSize: 12, cursor: "pointer", letterSpacing: "0.06em" }}>
      COMING SOON
    </motion.button>
  </div>
);

/* ══════════════════════════════════════
   GLOBAL STYLES INJECTOR
══════════════════════════════════════ */
const useGlobalStyles = (T) => {
  useEffect(() => {
    const style = document.createElement("style");
    style.id = "rq-dash-styles";
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,600;0,700;1,600&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
      *, *::before, *::after { box-sizing: border-box; }
      html, body { margin: 0; padding: 0; }
      ::-webkit-scrollbar { width: 6px; height: 6px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: ${T.scrollbar}; border-radius: 3px; }
      ::-webkit-scrollbar-thumb:hover { background: ${T.borderStrong}; }
      input::placeholder { color: ${T.textFaint}; }
      button { cursor: pointer; }
      @media (max-width: 1100px) {
        .rq-stat-grid { grid-template-columns: repeat(2,1fr) !important; }
        .rq-mid-grid { grid-template-columns: 1fr !important; }
        .rq-bottom-grid { grid-template-columns: 1fr !important; }
      }
      @media (max-width: 700px) {
        .rq-stat-grid { grid-template-columns: 1fr 1fr !important; }
      }
    `;
    document.getElementById("rq-dash-styles")?.remove();
    document.head.appendChild(style);
    return () => document.getElementById("rq-dash-styles")?.remove();
  }, [T.scrollbar]);
};

/* ══════════════════════════════════════
   TICKER BANNER
══════════════════════════════════════ */
const ticks = [
  "🍱  Mumbai — 24 meals rescued just now",
  "🥗  Delhi — NGO matched in 3 min",
  "🍛  Bangalore — 80 kg saved today",
  "🫙  Pune — New volunteer joined",
  "🍲  Chennai — 12 families fed",
  "🌿  Hyderabad — 600 g CO₂ offset",
];
const TickerBanner = ({ T }) => {
  const [idx, setIdx] = useState(0);
  useEffect(() => { const t = setInterval(() => setIdx(i => (i + 1) % ticks.length), 3200); return () => clearInterval(t); }, []);
  return (
    <div style={{ background: T.amber, height: 28, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <AnimatePresence mode="wait">
        <motion.div key={idx} initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -12, opacity: 0 }} transition={{ duration: 0.25 }}
          style={{ fontFamily: "monospace", fontSize: 11, color: "#1a3d26", fontWeight: 600, letterSpacing: "0.04em" }}>
          {ticks[idx]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

/* ══════════════════════════════════════
   ROOT
══════════════════════════════════════ */
const App = () => {
  const [dark, setDark] = useState(true);
  const [activePage, setActivePage] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const T = dark ? themes.dark : themes.light;

  useGlobalStyles(T);

  const pages = {
    dashboard: <DashboardContent T={T} />,
    live: <PlaceholderPage title="Live Feed" subtitle="Real-time rescue tracking across all cities" T={T} />,
    map: <PlaceholderPage title="Impact Map" subtitle="Geospatial visualization of all active rescues" T={T} />,
    ngos: <PlaceholderPage title="NGO Network" subtitle="Manage and monitor your partner organizations" T={T} />,
    analytics: <PlaceholderPage title="Analytics" subtitle="Deep dive into historical performance data" T={T} />,
    leaderboard: <PlaceholderPage title="Leaderboard" subtitle="Top donors and volunteers across India" T={T} />,
    settings: <PlaceholderPage title="Settings" subtitle="Configure your account and platform preferences" T={T} />,
  };

  return (
    <div style={{ background: T.bg, minHeight: "100vh", display: "flex", flexDirection: "column", transition: "background 0.4s, color 0.4s" }}>
      <TickerBanner T={T} />
      <div style={{ display: "flex", flex: 1 }}>
        <Sidebar active={activePage} setActive={setActivePage} T={T} collapsed={collapsed} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          <TopBar T={T} dark={dark} toggleDark={() => setDark(d => !d)} collapsed={collapsed} toggleSidebar={() => setCollapsed(v => !v)} />
          <main style={{ flex: 1, padding: "28px 28px 48px", overflowY: "auto" }}>
            <AnimatePresence mode="wait">
              <motion.div key={activePage} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35 }}>
                {pages[activePage]}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;