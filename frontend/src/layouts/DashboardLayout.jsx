import { useState, useEffect } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

/* ══════════════════════════════════════
   THEME SYSTEM  (mirrors your app)
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
    teal: "#14b8a6",
    navBg: "rgba(8,14,10,0.97)",
    sidebarBg: "#080e0a",
    scrollbar: "#1a2e1e",
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
    teal: "#0d9488",
    navBg: "rgba(240,247,242,0.97)",
    sidebarBg: "#e8f2eb",
    scrollbar: "#c9dece",
    shadow: "0 24px 64px rgba(0,0,0,0.1)",
    shadowSm: "0 4px 20px rgba(0,0,0,0.06)",
  },
};

/* ══════════════════════════════════════
   NAV ITEMS  (path = react-router path)
══════════════════════════════════════ */
const navItems = [
  { icon: "📊",  label: "Dashboard",   path: "/dashboard",         end: true  },
  { icon: "⚡",  label: "Food Search",  path: "/dashboard/search",  badge: "New" },
  { icon: "📦",  label: "My Orders",    path: "/dashboard/orders"              },
  { icon: "👤",  label: "Profile",      path: "/dashboard/profile"             },
];

const bottomNavItems = [
  { icon: "🗺️",  label: "Map View",     path: "/map"      },
  { icon: "🛒",  label: "Cart",         path: "/cart"     },
  { icon: "⚙️",   label: "Settings",     path: "/dashboard/settings" },
];

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
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % ticks.length), 3200);
    return () => clearInterval(t);
  }, []);
  return (
    <div
      style={{
        background: T.amber,
        height: 28,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        zIndex: 60,
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -12, opacity: 0 }}
          transition={{ duration: 0.25 }}
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            color: "#1a3d26",
            fontWeight: 600,
            letterSpacing: "0.04em",
          }}
        >
          {ticks[idx]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

/* ══════════════════════════════════════
   SIDEBAR
══════════════════════════════════════ */
const Sidebar = ({ T, collapsed, setCollapsed, dark, toggleDark }) => {
  const location = useLocation();

  const NavItem = ({ item }) => {
    const isActive =
      item.end
        ? location.pathname === item.path
        : location.pathname.startsWith(item.path);

    return (
      <NavLink
        to={item.path}
        end={item.end}
        style={{ textDecoration: "none" }}
      >
        <motion.div
          whileHover={{ x: collapsed ? 0 : 3 }}
          whileTap={{ scale: 0.97 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: collapsed ? "11px 0" : "10px 14px",
            borderRadius: 12,
            background: isActive ? T.accentSoft : "transparent",
            boxShadow: isActive ? `inset 0 0 0 1px ${T.borderMed}` : "none",
            justifyContent: collapsed ? "center" : "flex-start",
            cursor: "pointer",
            position: "relative",
            transition: "all 0.2s",
            marginBottom: 2,
          }}
        >
          {/* Active indicator bar */}
          {isActive && (
            <motion.div
              layoutId="sidebar-active"
              style={{
                position: "absolute",
                left: collapsed ? 0 : -10,
                width: 3,
                top: 8,
                bottom: 8,
                borderRadius: 100,
                background: T.accent,
              }}
            />
          )}

          <span
            style={{
              fontSize: 17,
              flexShrink: 0,
              filter: isActive
                ? "none"
                : "grayscale(0.5) opacity(0.65)",
              transition: "filter 0.2s",
            }}
          >
            {item.icon}
          </span>

          {!collapsed && (
            <>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 12.5,
                  fontWeight: isActive ? 700 : 400,
                  color: isActive ? T.accent : T.textMuted,
                  whiteSpace: "nowrap",
                  flex: 1,
                  letterSpacing: isActive ? "0.02em" : "0",
                  transition: "color 0.2s",
                }}
              >
                {item.label}
              </span>
              {item.badge && (
                <span
                  style={{
                    background: T.accent,
                    color: "#fff",
                    borderRadius: 100,
                    padding: "2px 8px",
                    fontSize: 9,
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 700,
                    letterSpacing: "0.05em",
                  }}
                >
                  {item.badge}
                </span>
              )}
            </>
          )}
        </motion.div>
      </NavLink>
    );
  };

  return (
    <motion.div
      animate={{ width: collapsed ? 64 : 230 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: T.sidebarBg,
        borderRight: `1px solid ${T.border}`,
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        position: "sticky",
        top: 0,
        flexShrink: 0,
        overflow: "hidden",
        zIndex: 40,
      }}
    >
      {/* ── Logo ── */}
      <div
        style={{
          padding: collapsed ? "20px 14px" : "20px 18px",
          borderBottom: `1px solid ${T.border}`,
          display: "flex",
          alignItems: "center",
          gap: 10,
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            flexShrink: 0,
            borderRadius: 12,
            background: `linear-gradient(135deg, ${T.accent}, ${T.teal})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            boxShadow: `0 4px 16px ${T.accentGlow}`,
          }}
        >
          🌿
        </div>
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
              style={{ overflow: "hidden" }}
            >
              <div
                style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontWeight: 900,
                  fontSize: 17,
                  color: T.text,
                  whiteSpace: "nowrap",
                  letterSpacing: "-0.03em",
                }}
              >
                ResQ<span style={{ color: T.amber }}>Plate</span>
              </div>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 8,
                  color: T.textMuted,
                  letterSpacing: "0.14em",
                  marginTop: 1,
                }}
              >
                OPS DASHBOARD
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Main Nav ── */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          padding: collapsed ? "16px 8px" : "16px 12px",
          display: "flex",
          flexDirection: "column",
          gap: 0,
        }}
      >
        {!collapsed && (
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 8,
              color: T.textFaint,
              letterSpacing: "0.18em",
              padding: "0 4px",
              marginBottom: 8,
            }}
          >
            MAIN
          </div>
        )}
        {navItems.map(item => (
          <NavItem key={item.path} item={item} />
        ))}

        {/* Divider */}
        <div
          style={{
            height: 1,
            background: T.border,
            margin: "16px 0",
            flexShrink: 0,
          }}
        />

        {!collapsed && (
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 8,
              color: T.textFaint,
              letterSpacing: "0.18em",
              padding: "0 4px",
              marginBottom: 8,
            }}
          >
            MORE
          </div>
        )}
        {bottomNavItems.map(item => (
          <NavItem key={item.path} item={item} />
        ))}

        {/* Quick Stats Block */}
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              marginTop: 20,
              borderRadius: 14,
              background: T.accentSoft,
              border: `1px solid ${T.borderMed}`,
              padding: "14px 16px",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 8,
                color: T.textFaint,
                letterSpacing: "0.16em",
                marginBottom: 10,
              }}
            >
              TODAY'S IMPACT
            </div>
            {[
              { label: "Meals Rescued", value: "312", color: T.accent },
              { label: "CO₂ Saved", value: "94 kg", color: T.teal },
              { label: "Volunteers", value: "35", color: T.amber },
            ].map((s, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: i < 2 ? 8 : 0,
                }}
              >
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 10,
                    color: T.textMuted,
                  }}
                >
                  {s.label}
                </span>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 11,
                    fontWeight: 700,
                    color: s.color,
                  }}
                >
                  {s.value}
                </span>
              </div>
            ))}
          </motion.div>
        )}
      </div>

      {/* ── User Profile Footer ── */}
      <div
        style={{
          borderTop: `1px solid ${T.border}`,
          padding: collapsed ? "14px 8px" : "14px 16px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            background: `linear-gradient(135deg, ${T.accent}, ${T.teal})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontWeight: 700,
            color: "#fff",
            fontFamily: "sans-serif",
            flexShrink: 0,
            boxShadow: `0 4px 12px ${T.accentGlow}`,
          }}
        >
          SR
        </div>
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              transition={{ duration: 0.2 }}
              style={{ flex: 1, overflow: "hidden", minWidth: 0 }}
            >
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 12,
                  fontWeight: 600,
                  color: T.text,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                Salony Ranjan
              </div>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 9,
                  color: T.textMuted,
                  marginTop: 1,
                }}
              >
                Operations Lead
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Theme toggle inside user footer */}
        {!collapsed && (
          <motion.button
            onClick={toggleDark}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.9 }}
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: T.bgCard || T.bgAlt,
              border: `1px solid ${T.border}`,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={dark ? "sun" : "moon"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{ display: "flex", fontSize: 13 }}
              >
                {dark ? "☀️" : "🌙"}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

/* ══════════════════════════════════════
   TOP BAR
══════════════════════════════════════ */
const notifData = [
  {
    icon: "🍱",
    text: "New donation: 45 meals in Connaught Place",
    time: "2m",
    color: "#22c55e",
  },
  {
    icon: "🚴",
    text: "Volunteer Ramesh picked up order #2847",
    time: "5m",
    color: "#3b82f6",
  },
  {
    icon: "✅",
    text: "Delivery confirmed — Akshaya Patra Delhi",
    time: "12m",
    color: "#14b8a6",
  },
  {
    icon: "⚠️",
    text: "3 meals expiring in 30 min — Pune",
    time: "18m",
    color: "#f59e0b",
  },
];

const TopBar = ({ T, dark, toggleDark, collapsed, setCollapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [unreadCount, setUnreadCount] = useState(notifData.length);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Close notif on route change
  useEffect(() => {
    setNotifOpen(false);
  }, [location]);

  const timeStr = time.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const dateStr = time.toLocaleDateString("en-IN", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  // Breadcrumb from path
  const crumbs = location.pathname
    .split("/")
    .filter(Boolean)
    .map(seg => seg.charAt(0).toUpperCase() + seg.slice(1));

  const searchSuggestions = [
    "Search food listings near Delhi",
    "My recent orders",
    "NGO partners list",
    "Track order #2847",
  ].filter(s => s.toLowerCase().includes(searchVal.toLowerCase()));

  return (
    <div
      style={{
        height: 60,
        background: T.navBg,
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderBottom: `1px solid ${T.border}`,
        display: "flex",
        alignItems: "center",
        padding: "0 20px",
        gap: 14,
        position: "sticky",
        top: 0,
        zIndex: 50,
        flexShrink: 0,
      }}
    >
      {/* Collapse Toggle */}
      <motion.button
        onClick={() => setCollapsed(v => !v)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.9 }}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        style={{
          width: 34,
          height: 34,
          borderRadius: 10,
          background: T.accentSoft,
          border: `1px solid ${T.borderMed}`,
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
          flexShrink: 0,
        }}
      >
        {[0, 1, 2].map(i => (
          <div
            key={i}
            style={{
              width: 14,
              height: 1.5,
              background: T.accent,
              borderRadius: 1,
              transition: "all 0.3s cubic-bezier(0.22,1,0.36,1)",
              transform:
                collapsed && i === 0
                  ? "translateY(5.5px) rotate(45deg)"
                  : collapsed && i === 2
                  ? "translateY(-5.5px) rotate(-45deg)"
                  : i === 1 && collapsed
                  ? "scaleX(0)"
                  : "none",
            }}
          />
        ))}
      </motion.button>

      {/* Breadcrumb */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          flexShrink: 0,
        }}
      >
        {crumbs.map((c, i) => (
          <span key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {i > 0 && (
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                  color: T.textFaint,
                }}
              >
                /
              </span>
            )}
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                color: i === crumbs.length - 1 ? T.accent : T.textMuted,
                fontWeight: i === crumbs.length - 1 ? 700 : 400,
                letterSpacing: "0.04em",
              }}
            >
              {c}
            </span>
          </span>
        ))}
      </div>

      {/* Search */}
      <div
        style={{ flex: 1, maxWidth: 360, position: "relative", marginLeft: 8 }}
      >
        <span
          style={{
            position: "absolute",
            left: 12,
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: 14,
            color: T.textFaint,
            pointerEvents: "none",
          }}
        >
          ⌕
        </span>
        <input
          value={searchVal}
          onChange={e => setSearchVal(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter" && searchVal) {
              navigate(`/dashboard/search?q=${encodeURIComponent(searchVal)}`);
              setSearchVal("");
            }
          }}
          placeholder="Search food, orders, NGOs…"
          style={{
            width: "100%",
            height: 34,
            paddingLeft: 34,
            paddingRight: 36,
            background: T.bgInput,
            border: `1px solid ${T.border}`,
            borderRadius: 10,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            color: T.text,
            outline: "none",
            boxSizing: "border-box",
            transition: "border-color 0.2s, box-shadow 0.2s",
          }}
          onFocus={e => {
            e.target.style.borderColor = T.accent + "66";
            e.target.style.boxShadow = `0 0 0 3px ${T.accentSoft}`;
          }}
          onBlur={e => {
            e.target.style.borderColor = T.border;
            e.target.style.boxShadow = "none";
          }}
        />
        {searchVal && (
          <button
            onClick={() => setSearchVal("")}
            style={{
              position: "absolute",
              right: 10,
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              color: T.textFaint,
              cursor: "pointer",
              fontSize: 13,
              padding: 0,
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        )}

        {/* Dropdown */}
        <AnimatePresence>
          {searchVal && searchSuggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              style={{
                position: "absolute",
                top: "calc(100% + 6px)",
                left: 0,
                right: 0,
                background: T.bgCard || "#111c14",
                border: `1px solid ${T.border}`,
                borderRadius: 12,
                padding: 8,
                boxShadow: T.shadow,
                zIndex: 200,
              }}
            >
              {searchSuggestions.map((r, i) => (
                <div
                  key={i}
                  onClick={() => {
                    navigate(
                      `/dashboard/search?q=${encodeURIComponent(r)}`
                    );
                    setSearchVal("");
                  }}
                  style={{
                    padding: "8px 10px",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontSize: 12,
                    color: T.textMuted,
                    fontFamily: "'JetBrains Mono', monospace",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                  onMouseEnter={e =>
                    (e.currentTarget.style.background = T.accentSoft)
                  }
                  onMouseLeave={e =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <span style={{ opacity: 0.5 }}>⌕</span> {r}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div style={{ flex: 1 }} />

      {/* Live Dot */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
          background: T.accentSoft,
          border: `1px solid ${T.borderMed}`,
          borderRadius: 100,
          padding: "5px 12px",
          flexShrink: 0,
        }}
      >
        <motion.div
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{ duration: 1.4, repeat: Infinity }}
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: T.accent,
          }}
        />
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 9,
            color: T.accent,
            letterSpacing: "0.12em",
            fontWeight: 700,
          }}
        >
          LIVE
        </span>
      </div>

      {/* Clock */}
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 13,
            fontWeight: 700,
            color: T.text,
            letterSpacing: "0.04em",
            lineHeight: 1,
          }}
        >
          {timeStr}
        </div>
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 8,
            color: T.textMuted,
            marginTop: 2,
            letterSpacing: "0.06em",
          }}
        >
          {dateStr}
        </div>
      </div>

      {/* Cart Button */}
      <motion.button
        onClick={() => navigate("/cart")}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.9 }}
        title="Cart"
        style={{
          width: 36,
          height: 36,
          borderRadius: 11,
          background: T.bgCard || T.bgAlt,
          border: `1px solid ${T.border}`,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: 15 }}>🛒</span>
        <div
          style={{
            position: "absolute",
            top: 5,
            right: 5,
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: T.amber,
            border: `2px solid ${T.bg}`,
          }}
        />
      </motion.button>

      {/* Notifications */}
      <div style={{ position: "relative", flexShrink: 0 }}>
        <motion.button
          onClick={() => {
            setNotifOpen(v => !v);
            if (!notifOpen) setUnreadCount(0);
          }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.9 }}
          title="Notifications"
          style={{
            width: 36,
            height: 36,
            borderRadius: 11,
            background: T.bgCard || T.bgAlt,
            border: `1px solid ${T.border}`,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <span style={{ fontSize: 15 }}>🔔</span>
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              style={{
                position: "absolute",
                top: 4,
                right: 4,
                width: 16,
                height: 16,
                borderRadius: "50%",
                background: T.red,
                border: `2px solid ${T.bg}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 8,
                fontWeight: 700,
                color: "#fff",
              }}
            >
              {unreadCount}
            </motion.div>
          )}
        </motion.button>

        <AnimatePresence>
          {notifOpen && (
            <>
              {/* Backdrop */}
              <div
                style={{
                  position: "fixed",
                  inset: 0,
                  zIndex: 150,
                }}
                onClick={() => setNotifOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: "absolute",
                  top: "calc(100% + 10px)",
                  right: 0,
                  width: 340,
                  background: T.bgCard || "#111c14",
                  border: `1px solid ${T.border}`,
                  borderRadius: 18,
                  padding: 18,
                  boxShadow: T.shadow,
                  zIndex: 200,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 14,
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 10,
                      color: T.textMuted,
                      letterSpacing: "0.12em",
                    }}
                  >
                    NOTIFICATIONS
                  </div>
                  <button
                    onClick={() => setNotifOpen(false)}
                    style={{
                      background: "none",
                      border: "none",
                      color: T.textFaint,
                      cursor: "pointer",
                      fontSize: 12,
                      padding: 0,
                    }}
                  >
                    ✕
                  </button>
                </div>
                {notifData.map((n, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    style={{
                      display: "flex",
                      gap: 10,
                      padding: "10px 0",
                      borderBottom:
                        i < notifData.length - 1
                          ? `1px solid ${T.border}`
                          : "none",
                      cursor: "pointer",
                    }}
                    onMouseEnter={e =>
                      (e.currentTarget.style.background = T.accentSoft + "88")
                    }
                    onMouseLeave={e =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 10,
                        background: `${n.color}18`,
                        border: `1px solid ${n.color}33`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 15,
                        flexShrink: 0,
                      }}
                    >
                      {n.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontFamily: "sans-serif",
                          fontSize: 12,
                          color: T.text,
                          lineHeight: 1.4,
                        }}
                      >
                        {n.text}
                      </div>
                      <div
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: 9,
                          color: T.textFaint,
                          marginTop: 3,
                        }}
                      >
                        {n.time} ago
                      </div>
                    </div>
                  </motion.div>
                ))}
                <div
                  style={{
                    marginTop: 12,
                    textAlign: "center",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 10,
                    color: T.accent,
                    cursor: "pointer",
                    letterSpacing: "0.08em",
                  }}
                  onClick={() => setNotifOpen(false)}
                >
                  VIEW ALL →
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Dark toggle */}
      <motion.button
        onClick={toggleDark}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.9 }}
        title="Toggle theme"
        style={{
          width: 36,
          height: 36,
          borderRadius: 11,
          background: T.bgCard || T.bgAlt,
          border: `1px solid ${T.border}`,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={dark ? "sun" : "moon"}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ display: "flex", fontSize: 15 }}
          >
            {dark ? "☀️" : "🌙"}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

/* ══════════════════════════════════════
   MOBILE BOTTOM TAB BAR
══════════════════════════════════════ */
const MobileTabBar = ({ T }) => {
  const location = useLocation();
  const allTabs = [...navItems.slice(0, 4), { icon: "⚙", label: "More", path: "/settings" }];

  return (
    <div
      style={{
        display: "none",
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: 60,
        background: T.navBg,
        backdropFilter: "blur(20px)",
        borderTop: `1px solid ${T.border}`,
        zIndex: 100,
        alignItems: "center",
        justifyContent: "space-around",
        padding: "0 8px",
      }}
      className="rq-mobile-tabs"
    >
      {allTabs.map(item => {
        const isActive = item.end
          ? location.pathname === item.path
          : location.pathname.startsWith(item.path);
        return (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            style={{ textDecoration: "none" }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 3,
                padding: "6px 14px",
                borderRadius: 10,
                background: isActive ? T.accentSoft : "transparent",
              }}
            >
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 8,
                  color: isActive ? T.accent : T.textFaint,
                  fontWeight: isActive ? 700 : 400,
                  letterSpacing: "0.06em",
                }}
              >
                {item.label.toUpperCase()}
              </span>
            </div>
          </NavLink>
        );
      })}
    </div>
  );
};

/* ══════════════════════════════════════
   GLOBAL STYLE INJECTOR
══════════════════════════════════════ */
const useGlobalStyles = T => {
  useEffect(() => {
    const style = document.createElement("style");
    style.id = "rq-layout-styles";
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap');
      *, *::before, *::after { box-sizing: border-box; }
      html, body { margin: 0; padding: 0; }
      ::-webkit-scrollbar { width: 5px; height: 5px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: ${T.scrollbar}; border-radius: 3px; }
      ::-webkit-scrollbar-thumb:hover { background: ${T.borderStrong}; }
      input::placeholder { color: ${T.textFaint}; }
      button { cursor: pointer; }
      a { text-decoration: none; }
      @media (max-width: 768px) {
        .rq-sidebar { display: none !important; }
        .rq-mobile-tabs { display: flex !important; }
        .rq-main-content { padding-bottom: 72px !important; }
      }
    `;
    document.getElementById("rq-layout-styles")?.remove();
    document.head.appendChild(style);
    return () => document.getElementById("rq-layout-styles")?.remove();
  }, [T.scrollbar, T.borderStrong, T.textFaint]);
};

/* ══════════════════════════════════════
   DASHBOARD LAYOUT  — default export
══════════════════════════════════════ */
const DashboardLayout = () => {
  const [dark, setDark] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const T = dark ? themes.dark : themes.light;
  const location = useLocation();

  useGlobalStyles(T);

  return (
    <div
      style={{
        background: T.bg,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        transition: "background 0.35s ease, color 0.35s ease",
        fontFamily: "sans-serif",
      }}
    >
      {/* Ticker */}
      <TickerBanner T={T} />

      {/* Body */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* Sidebar */}
        <div className="rq-sidebar">
          <Sidebar
            T={T}
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            dark={dark}
            toggleDark={() => setDark(d => !d)}
          />
        </div>

        {/* Right column */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            minHeight: "100vh",
          }}
        >
          <TopBar
            T={T}
            dark={dark}
            toggleDark={() => setDark(d => !d)}
            collapsed={collapsed}
            setCollapsed={setCollapsed}
          />

          {/* Page content */}
          <main
            className="rq-main-content"
            style={{
              flex: 1,
              overflowY: "auto",
              overflowX: "hidden",
              padding: "28px 28px 48px",
              background: T.bg,
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Child routes render here */}
                <Outlet context={{ T, dark, toggleDark: () => setDark(d => !d) }} />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* Mobile bottom tab bar */}
      <MobileTabBar T={T} />
    </div>
  );
};

export default DashboardLayout;

/*
  ════════════════════════════════════════
  USAGE NOTES
  ════════════════════════════════════════

  1. CONSUMING THEME IN CHILD PAGES
     ────────────────────────────────
     import { useOutletContext } from "react-router-dom";
     const { T, dark } = useOutletContext();

  2. ACTIVE LINK DETECTION
     ────────────────────────────────
     Uses NavLink from react-router-dom.
     - "/dashboard"          → exact match (end: true)
     - "/dashboard/search"   → prefix match
     - "/dashboard/orders"   → prefix match
     - "/dashboard/profile"  → prefix match
     The sidebar pill, accent color + indicator bar all respond automatically.

  3. ROUTE SETUP (from your App.jsx — already correct)
     ────────────────────────────────
     <Route path="/dashboard" element={<DashboardLayout />}>
       <Route index          element={<DashboardHome />}  />
       <Route path="search"  element={<FoodListing />}    />
       <Route path="orders"  element={<OrderTracking />}  />
       <Route path="profile" element={<ProfilePage />}    />
     </Route>

  4. DEPENDENCIES
     ────────────────────────────────
     npm install framer-motion react-router-dom

  ════════════════════════════════════════
*/