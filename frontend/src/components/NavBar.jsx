import { Link, NavLink, useLocation } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import Logo from "./Logo";

/* ─── Theme ─────────────────────────────────────────────── */
const THEMES = {
  dark: {
    neon: "#39ff14",
    bg: "rgba(7,7,7,0.88)",
    bgSolid: "#070707",
    surface: "rgba(255,255,255,0.03)",
    surfaceHover: "rgba(255,255,255,0.06)",
    border: "rgba(57,255,20,0.14)",
    borderSubtle: "rgba(255,255,255,0.08)",
    textPrimary: "#f0f0f0",
    textMuted: "rgba(255,255,255,0.42)",
    textFaint: "rgba(255,255,255,0.20)",
    divider: "rgba(255,255,255,0.10)",
    pillBg: "rgba(255,255,255,0.03)",
    pillBorder: "rgba(255,255,255,0.06)",
    drawerBg: "rgba(7,7,7,0.97)",
    drawerBorder: "rgba(57,255,20,0.12)",
    shadow: "rgba(57,255,20,0.07)",
    searchBg: "rgba(255,255,255,0.04)",
    searchBorder: "rgba(255,255,255,0.10)",
    notifBg: "rgba(255,255,255,0.04)",
    activeText: "#050505",
  },
  light: {
    neon: "#22c55e",
    bg: "rgba(252,252,252,0.88)",
    bgSolid: "#fcfcfc",
    surface: "rgba(0,0,0,0.02)",
    surfaceHover: "rgba(0,0,0,0.04)",
    border: "rgba(34,197,94,0.22)",
    borderSubtle: "rgba(0,0,0,0.08)",
    textPrimary: "#111111",
    textMuted: "rgba(0,0,0,0.45)",
    textFaint: "rgba(0,0,0,0.22)",
    divider: "rgba(0,0,0,0.10)",
    pillBg: "rgba(0,0,0,0.02)",
    pillBorder: "rgba(0,0,0,0.07)",
    drawerBg: "rgba(252,252,252,0.98)",
    drawerBorder: "rgba(34,197,94,0.18)",
    shadow: "rgba(34,197,94,0.08)",
    searchBg: "rgba(0,0,0,0.03)",
    searchBorder: "rgba(0,0,0,0.10)",
    notifBg: "rgba(0,0,0,0.03)",
    activeText: "#ffffff",
  },
};

const NAV_ITEMS = [
  { name: "Home",      path: "/",          icon: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" },
  { name: "About",     path: "/about",     icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  { name: "Contact",   path: "/contact",   icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
  { name: "Dashboard", path: "/dashboard", icon: "M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" },
];

/* ─── Helpers ────────────────────────────────────────────── */
const Icon = ({ d, size = 14, color = "currentColor", strokeWidth = 1.5 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
    <path d={d} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ─── Status Pill ─────────────────────────────────────────── */
const StatusPill = ({ full = false, t }) => (
  <motion.div
    whileHover={{ scale: 1.03 }}
    style={{
      display: "flex", alignItems: "center", gap: 7,
      padding: "5px 12px", borderRadius: 100,
      background: `rgba(${full ? "34,197,94" : "57,255,20"},0.06)`,
      border: `1px solid ${t.border}`,
      fontSize: 11, fontWeight: 500, letterSpacing: "0.08em",
      textTransform: "uppercase", color: t.neon,
      whiteSpace: "nowrap", cursor: "default",
      userSelect: "none",
    }}
  >
    <motion.span
      style={{
        width: 6, height: 6, borderRadius: "50%",
        background: t.neon, boxShadow: `0 0 6px ${t.neon}`,
        display: "block", flexShrink: 0,
      }}
      animate={{ opacity: [1, 0.4, 1], scale: [1, 0.75, 1] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
    />
    {full ? "All systems operational" : "Live"}
  </motion.div>
);

/* ─── Divider ─────────────────────────────────────────────── */
const Divider = ({ t }) => (
  <div style={{
    width: 1, height: 22,
    background: t.divider, borderRadius: 1, flexShrink: 0,
  }} />
);

/* ─── Theme Toggle ─────────────────────────────────────────── */
const ThemeToggle = ({ isDark, onToggle, t }) => (
  <motion.button
    onClick={onToggle}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.93 }}
    title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    style={{
      width: 36, height: 36, borderRadius: 10,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: t.surface,
      border: `1px solid ${t.borderSubtle}`,
      cursor: "pointer", position: "relative", overflow: "hidden",
      color: t.textMuted,
    }}
    aria-label="Toggle theme"
  >
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={isDark ? "moon" : "sun"}
        initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        style={{ display: "flex" }}
      >
        {isDark ? (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
              stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.8" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
              stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        )}
      </motion.span>
    </AnimatePresence>
  </motion.button>
);

/* ─── Notification Bell ──────────────────────────────────────── */
const NotifBell = ({ count = 3, t }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const notifs = [
    { id: 1, text: "New deployment is live", time: "2m ago", unread: true },
    { id: 2, text: "API usage limit at 80%", time: "1h ago", unread: true },
    { id: 3, text: "Weekly report ready", time: "3h ago", unread: false },
  ];

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.93 }}
        style={{
          width: 36, height: 36, borderRadius: 10,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: t.surface, border: `1px solid ${t.borderSubtle}`,
          cursor: "pointer", position: "relative", color: t.textMuted,
        }}
        aria-label="Notifications"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"
            stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {count > 0 && (
          <motion.span
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            style={{
              position: "absolute", top: 6, right: 6,
              width: 7, height: 7, borderRadius: "50%",
              background: t.neon, boxShadow: `0 0 6px ${t.neon}`,
            }}
          />
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            style={{
              position: "absolute", top: "calc(100% + 10px)", right: 0,
              width: 290, borderRadius: 14,
              background: t.drawerBg, border: `1px solid ${t.border}`,
              backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
              boxShadow: `0 20px 40px rgba(0,0,0,0.28)`,
              overflow: "hidden", zIndex: 100,
            }}
          >
            <div style={{
              padding: "12px 16px", borderBottom: `1px solid ${t.borderSubtle}`,
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: t.textMuted }}>
                Notifications
              </span>
              <motion.button
                whileTap={{ scale: 0.95 }}
                style={{ fontSize: 11, color: t.neon, background: "none", border: "none", cursor: "pointer", padding: 0 }}
              >Mark all read</motion.button>
            </div>
            {notifs.map((n, i) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                style={{
                  padding: "12px 16px", display: "flex", gap: 10, alignItems: "flex-start",
                  borderBottom: i < notifs.length - 1 ? `1px solid ${t.borderSubtle}` : "none",
                  background: n.unread ? `rgba(${t.neon === "#39ff14" ? "57,255,20" : "34,197,94"},0.03)` : "transparent",
                  cursor: "pointer",
                }}
              >
                {n.unread && (
                  <span style={{
                    marginTop: 5, width: 6, height: 6, borderRadius: "50%",
                    background: t.neon, flexShrink: 0,
                  }} />
                )}
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: 13, color: t.textPrimary, lineHeight: 1.4 }}>{n.text}</p>
                  <p style={{ margin: "3px 0 0", fontSize: 11, color: t.textMuted }}>{n.time}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─── Search Bar ─────────────────────────────────────────── */
const SearchBar = ({ t }) => {
  const [active, setActive] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    const h = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setActive(true);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
      if (e.key === "Escape") { setActive(false); setQuery(""); }
    };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, []);

  return (
    <>
      {/* Trigger */}
      <motion.button
        onClick={() => { setActive(true); setTimeout(() => inputRef.current?.focus(), 80); }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className="hidden md:flex"
        style={{
          alignItems: "center", gap: 8,
          padding: "6px 12px", borderRadius: 10,
          background: t.searchBg,
          border: `1px solid ${t.searchBorder}`,
          color: t.textMuted, fontSize: 12.5, cursor: "pointer",
          whiteSpace: "nowrap",
        }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.8" />
          <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        Search…
        <span style={{
          marginLeft: 4, padding: "2px 6px", borderRadius: 5,
          background: t.surfaceHover, border: `1px solid ${t.borderSubtle}`,
          fontSize: 10, letterSpacing: "0.05em", color: t.textFaint,
        }}>⌘K</span>
      </motion.button>

      {/* Full overlay */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { setActive(false); setQuery(""); }}
            style={{
              position: "fixed", inset: 0, zIndex: 200,
              background: "rgba(0,0,0,0.65)",
              backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
              display: "flex", alignItems: "flex-start", justifyContent: "center",
              paddingTop: "15vh",
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 340, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "min(580px, 90vw)", borderRadius: 18,
                background: t.drawerBg, border: `1px solid ${t.border}`,
                boxShadow: `0 40px 80px rgba(0,0,0,0.45), 0 0 0 1px ${t.border}`,
                overflow: "hidden",
              }}
            >
              <div style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "14px 18px",
                borderBottom: `1px solid ${t.borderSubtle}`,
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color: t.neon, flexShrink: 0 }}>
                  <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search pages, docs, actions…"
                  style={{
                    flex: 1, background: "none", border: "none", outline: "none",
                    fontSize: 15, color: t.textPrimary, fontFamily: "'DM Sans', sans-serif",
                  }}
                />
                <kbd style={{
                  padding: "3px 7px", borderRadius: 6, fontSize: 11,
                  background: t.surfaceHover, border: `1px solid ${t.borderSubtle}`,
                  color: t.textMuted, cursor: "pointer",
                }} onClick={() => { setActive(false); setQuery(""); }}>ESC</kbd>
              </div>
              <div style={{ padding: "8px 0", maxHeight: 320, overflowY: "auto" }}>
                {NAV_ITEMS.map((item, i) => (
                  <Link key={item.name} to={item.path} onClick={() => { setActive(false); setQuery(""); }}>
                    <motion.div
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      whileHover={{ background: t.surfaceHover }}
                      style={{
                        display: "flex", alignItems: "center", gap: 12,
                        padding: "11px 18px", cursor: "pointer",
                        color: t.textPrimary, fontSize: 14,
                        transition: "background 0.15s",
                      }}
                    >
                      <span style={{
                        width: 32, height: 32, borderRadius: 8, display: "flex",
                        alignItems: "center", justifyContent: "center",
                        background: `rgba(${t.neon === "#39ff14" ? "57,255,20" : "34,197,94"},0.08)`,
                        color: t.neon, flexShrink: 0,
                      }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path d={item.icon} stroke="currentColor" strokeWidth="1.6"
                            strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      <span>{item.name}</span>
                      <span style={{ marginLeft: "auto", color: t.textFaint, fontSize: 12 }}>
                        {item.path}
                      </span>
                    </motion.div>
                  </Link>
                ))}
              </div>
              <div style={{
                padding: "10px 18px", borderTop: `1px solid ${t.borderSubtle}`,
                display: "flex", gap: 16,
              }}>
                {["↵ to select", "↑↓ navigate", "esc to close"].map((hint) => (
                  <span key={hint} style={{ fontSize: 11, color: t.textFaint }}>{hint}</span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

/* ─── Pill Nav (Desktop) ─────────────────────────────────── */
const NavPill = ({ t }) => (
  <div style={{
    display: "flex", alignItems: "center", gap: 2,
    background: t.pillBg, border: `1px solid ${t.pillBorder}`,
    borderRadius: 100, padding: 4,
  }}>
    {NAV_ITEMS.map((item) => (
      <NavLink key={item.name} to={item.path} end={item.path === "/"}>
        {({ isActive }) => (
          <motion.span
            layout
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "6px 16px", borderRadius: 100,
              fontSize: 13, fontWeight: isActive ? 600 : 400,
              letterSpacing: "0.01em",
              color: isActive ? t.activeText : t.textMuted,
              background: isActive ? t.neon : "transparent",
              boxShadow: isActive
                ? `0 0 18px rgba(${t.neon === "#39ff14" ? "57,255,20" : "34,197,94"},0.42), 0 2px 8px rgba(${t.neon === "#39ff14" ? "57,255,20" : "34,197,94"},0.22)`
                : "none",
              cursor: "pointer", whiteSpace: "nowrap",
              transition: "all 0.22s",
            }}
          >
            {item.name}
          </motion.span>
        )}
      </NavLink>
    ))}
  </div>
);

/* ─── Hamburger ──────────────────────────────────────────── */
const Ham = ({ open, t }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
    {[0, 1, 2].map((i) => (
      <motion.span
        key={i}
        style={{ background: t.neon, height: 1.5, borderRadius: 2, display: "block" }}
        animate={
          open
            ? i === 0 ? { width: 17, rotate: 45,  y: 6.5, opacity: 1 }
            : i === 1 ? { width: 17, opacity: 0, scaleX: 0 }
            :           { width: 17, rotate: -45, y: -6.5, opacity: 1 }
            : { width: 17, rotate: 0, y: 0, opacity: 1, scaleX: 1 }
        }
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
      />
    ))}
  </div>
);

/* ─── Scroll Progress Bar ────────────────────────────────── */
const ScrollProgress = ({ t }) => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      style={{
        position: "absolute", bottom: -1, left: 0, right: 0,
        height: 2, transformOrigin: "0%",
        background: `linear-gradient(90deg, ${t.neon}, ${t.neon}88)`,
        boxShadow: `0 0 8px ${t.neon}60`,
        scaleX,
      }}
    />
  );
};

/* ─── Announcement Banner ─────────────────────────────────── */
const AnnouncementBanner = ({ t, onDismiss }) => (
  <motion.div
    initial={{ height: 0, opacity: 0 }}
    animate={{ height: "auto", opacity: 1 }}
    exit={{ height: 0, opacity: 0 }}
    transition={{ duration: 0.3 }}
    style={{
      background: `linear-gradient(90deg, ${t.neon}15, ${t.neon}08, ${t.neon}15)`,
      borderBottom: `1px solid ${t.border}`,
      overflow: "hidden",
    }}
  >
    <div style={{
      maxWidth: 1200, margin: "0 auto", padding: "8px 32px",
      display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
    }}>
      <motion.span
        animate={{ rotate: [0, 15, -15, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
        style={{ fontSize: 14 }}
      >🚀</motion.span>
      <span style={{ fontSize: 12.5, color: t.textPrimary, letterSpacing: "0.01em" }}>
        <strong style={{ color: t.neon }}>v2.0 is live —</strong> New dashboard features and 10× faster API.{" "}
        <Link to="/changelog" style={{ color: t.neon, textDecoration: "underline", fontSize: 12.5 }}>See what's new →</Link>
      </span>
      <motion.button
        onClick={onDismiss}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{
          marginLeft: "auto", background: "none", border: "none",
          cursor: "pointer", color: t.textMuted, fontSize: 16, lineHeight: 1,
          padding: "2px 4px",
        }}
        aria-label="Dismiss"
      >×</motion.button>
    </div>
  </motion.div>
);

/* ─── Mobile Drawer ──────────────────────────────────────── */
const MobileDrawer = ({ open, onClose, t, isDark, onThemeToggle }) => {
  const location = useLocation();
  useEffect(() => { onClose(); }, [location.pathname]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            onClick={onClose}
            style={{ position: "fixed", inset: 0, zIndex: 49, background: "rgba(0,0,0,0.7)" }}
          />

          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            style={{
              position: "fixed", top: 0, right: 0, bottom: 0, width: 300,
              zIndex: 50, display: "flex", flexDirection: "column",
              background: t.drawerBg,
              backdropFilter: "blur(32px)", WebkitBackdropFilter: "blur(32px)",
              borderLeft: `1px solid ${t.drawerBorder}`,
            }}
          >
            {/* Header */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "0 20px", height: 64,
              borderBottom: `1px solid ${t.borderSubtle}`,
            }}>
              <Link to="/" onClick={onClose}><Logo /></Link>
              <div style={{ display: "flex", gap: 8 }}>
                <ThemeToggle isDark={isDark} onToggle={onThemeToggle} t={t} />
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  style={{
                    width: 36, height: 36, borderRadius: 10,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: t.surface, border: `1px solid ${t.drawerBorder}`,
                    cursor: "pointer",
                  }}
                  aria-label="Close"
                >
                  <Ham open t={t} />
                </motion.button>
              </div>
            </div>

            {/* Search mobile */}
            <div style={{ padding: "12px 16px", borderBottom: `1px solid ${t.borderSubtle}` }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 14px", borderRadius: 12,
                background: t.searchBg, border: `1px solid ${t.searchBorder}`,
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ color: t.textMuted }}>
                  <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                <span style={{ fontSize: 13, color: t.textFaint }}>Search…</span>
              </div>
            </div>

            {/* Links */}
            <nav style={{ flex: 1, padding: "12px 12px", display: "flex", flexDirection: "column", gap: 4, overflowY: "auto" }}>
              <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: t.textFaint, padding: "4px 10px 8px" }}>Navigation</p>
              {NAV_ITEMS.map((item, i) => (
                <NavLink key={item.name} to={item.path} end={item.path === "/"}>
                  {({ isActive }) => (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05, type: "spring", stiffness: 300, damping: 26 }}
                      whileHover={{ x: 2 }}
                      style={{
                        display: "flex", alignItems: "center", gap: 12,
                        padding: "12px 14px", borderRadius: 12,
                        fontSize: 14, fontWeight: isActive ? 500 : 400,
                        color: isActive ? t.neon : t.textMuted,
                        background: isActive ? `rgba(${t.neon === "#39ff14" ? "57,255,20" : "34,197,94"},0.06)` : "transparent",
                        border: `1px solid ${isActive ? t.border : "transparent"}`,
                        cursor: "pointer", transition: "all 0.2s",
                      }}
                    >
                      <span style={{
                        width: 28, height: 28, borderRadius: 7, display: "flex",
                        alignItems: "center", justifyContent: "center",
                        background: isActive ? `rgba(${t.neon === "#39ff14" ? "57,255,20" : "34,197,94"},0.12)` : t.surface,
                        color: isActive ? t.neon : t.textMuted,
                      }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                          <path d={item.icon} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      {item.name}
                      {isActive && (
                        <motion.svg
                          width="12" height="12" viewBox="0 0 24 24" fill="none"
                          style={{ marginLeft: "auto", color: t.neon }}
                          initial={{ opacity: 0, x: -4 }}
                          animate={{ opacity: 1, x: 0 }}
                        >
                          <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </motion.svg>
                      )}
                    </motion.div>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Footer */}
            <div style={{
              padding: "16px 16px 32px",
              borderTop: `1px solid ${t.borderSubtle}`,
              display: "flex", flexDirection: "column", gap: 10,
            }}>
              <StatusPill full t={t} />
              <NavLink to="/login" onClick={onClose} style={{ display: "block" }}>
                <motion.button
                  whileHover={{ borderColor: t.neon }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    width: "100%", padding: "12px 0", borderRadius: 12,
                    fontSize: 13.5, color: t.textMuted,
                    background: t.surface, border: `1px solid ${t.borderSubtle}`,
                    cursor: "pointer", transition: "all 0.25s",
                  }}
                >Log in</motion.button>
              </NavLink>
              <Link to="/register" onClick={onClose} style={{ display: "block" }}>
                <motion.button
                  whileHover={{ boxShadow: `0 0 28px ${t.neon}88` }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    width: "100%", padding: "13px 0", borderRadius: 12,
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 13, fontWeight: 700,
                    letterSpacing: "0.06em", textTransform: "uppercase",
                    color: t.activeText, background: t.neon, border: "none",
                    boxShadow: `0 0 16px ${t.neon}50`,
                    cursor: "pointer",
                  }}
                >Get Started →</motion.button>
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

/* ─── User Avatar ────────────────────────────────────────── */
const UserAvatar = ({ t }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const menuItems = [
    { label: "Profile", icon: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" },
    { label: "Settings", icon: "M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" },
    { label: "Billing", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" },
    { label: "Sign out", icon: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1", danger: true },
  ];

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          width: 32, height: 32, borderRadius: "50%",
          background: `linear-gradient(135deg, ${t.neon}cc, ${t.neon}66)`,
          border: `2px solid ${t.neon}44`,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", fontWeight: 700, fontSize: 12,
          color: "#050505", flexShrink: 0,
          boxShadow: open ? `0 0 14px ${t.neon}44` : "none",
          transition: "box-shadow 0.3s",
        }}
      >
        U
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.16 }}
            style={{
              position: "absolute", top: "calc(100% + 10px)", right: 0,
              width: 200, borderRadius: 14, overflow: "hidden",
              background: t.drawerBg, border: `1px solid ${t.border}`,
              backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
              boxShadow: `0 20px 40px rgba(0,0,0,0.28)`, zIndex: 100,
            }}
          >
            <div style={{ padding: "12px 14px", borderBottom: `1px solid ${t.borderSubtle}` }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: t.textPrimary }}>User Name</p>
              <p style={{ margin: "2px 0 0", fontSize: 11, color: t.textMuted }}>user@example.com</p>
            </div>
            {menuItems.map((item, i) => (
              <motion.div
                key={item.label}
                whileHover={{ background: item.danger ? "rgba(239,68,68,0.06)" : t.surfaceHover }}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 14px", cursor: "pointer",
                  color: item.danger ? "#ef4444" : t.textPrimary,
                  fontSize: 13, borderBottom: i < menuItems.length - 1 ? `1px solid ${t.borderSubtle}` : "none",
                  transition: "background 0.15s",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d={item.icon} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {item.label}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─── Main NavBar ────────────────────────────────────────── */
const NavBar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [showBanner, setShowBanner] = useState(true);
  const [isLoggedIn] = useState(false);

  const t = THEMES[isDark ? "dark" : "light"];

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const toggleTheme = useCallback(() => setIsDark((d) => !d), []);

  return (
    <div style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}>
      {/* Main nav */}
      <motion.nav
        initial={{ y: -64, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 24, delay: 0.06 }}
        style={{
          position: "sticky", top: 0, zIndex: 50,
          height: 64,
          background: t.bg,
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          borderBottom: `1px solid ${scrolled ? t.border : "transparent"}`,
          boxShadow: scrolled ? `0 4px 32px ${t.shadow}, 0 1px 0 ${t.border}` : "none",
          transition: "border-color 0.4s, box-shadow 0.4s, background 0.35s",
          paddingTop: "env(safe-area-inset-top, 0px)",
        }}
      >
        {/* Scroll progress */}
        <ScrollProgress t={t} />

        <div style={{
          maxWidth: 1200, margin: "0 auto",
          padding: "0 28px", height: "100%",
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center", gap: 20,
        }}>
          {/* Col 1 — Logo */}
<Link to="/" style={{ justifySelf: "start", display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
  <motion.div whileHover={{ scale: 1.05, rotate: 5 }} whileTap={{ scale: 0.95 }}>
    <div style={{
      width: 40, height: 40, borderRadius: 12,
      background: `linear-gradient(135deg, #1A1A1A 0%, #050505 100%)`, // Darker base for neon to pop
      display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: `0 4px 20px ${t.neon}33`,
      border: `1px solid ${t.neon}44`
    }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Circular Rescue Arrow (Inspired by logo.jpg) */}
        <path 
          d="M21 12a9 9 0 11-15.65-6" 
          stroke={t.neon} 
          strokeWidth="2" 
          strokeLinecap="round" 
        />
        <path d="M6 2v4h4" stroke={t.neon} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        
        {/* Central Food Bowl */}
        <path 
          d="M7 11h10l-1.5 6a3 3 0 01-3 2h-1a3 3 0 01-3-2L7 11z" 
          fill={`${t.neon}33`} 
          stroke={t.neon} 
          strokeWidth="1.5" 
        />
        
        {/* Leaf Accent (Representing sustainability) */}
        <path 
          d="M18 4c-2 0-3 2-3 2s2 1 3 1 2-2 2-3" 
          fill={t.neon} 
        />
      </svg>
    </div>
  </motion.div>

  <span style={{
    fontSize: 20, fontWeight: 800, letterSpacing: "-0.04em",
    color: t.textPrimary,
    fontFamily: "Inter, sans-serif"
  }}>
    ResQ<span style={{ color: t.neon }}>Plate</span>
  </span>
</Link>
          {/* Col 2 — Pill nav (desktop) */}
          <div className="hidden md:block">
            <NavPill t={t} />
          </div>

          {/* Col 3 — Right cluster */}
          <div style={{ justifySelf: "end", display: "flex", alignItems: "center", gap: 10 }}>

            {/* Desktop */}
            <div className="hidden md:flex" style={{ alignItems: "center", gap: 10 }}>
              <SearchBar t={t} />
              <NotifBell count={3} t={t} />
              <ThemeToggle isDark={isDark} onToggle={toggleTheme} t={t} />
              <Divider t={t} />
              <StatusPill t={t} />
              <Divider t={t} />

              {isLoggedIn ? (
                <UserAvatar t={t} />
              ) : (
                <>
                  <NavLink to="/login">
                    {({ isActive }) => (
                      <motion.button
                        whileHover={{ color: t.textPrimary, borderColor: t.border, background: t.surfaceHover }}
                        whileTap={{ scale: 0.97 }}
                        style={{
                          padding: "7px 17px", borderRadius: 100,
                          fontSize: 13, fontWeight: 400,
                          color: isActive ? t.textPrimary : t.textMuted,
                          background: isActive ? t.surfaceHover : "transparent",
                          border: `1px solid ${isActive ? t.border : t.borderSubtle}`,
                          cursor: "pointer", whiteSpace: "nowrap",
                          transition: "all 0.22s",
                        }}
                      >Log in</motion.button>
                    )}
                  </NavLink>

                  <Link to="/register">
                    <motion.button
                      whileHover={{ scale: 1.04, boxShadow: `0 0 30px ${t.neon}66, 0 0 60px ${t.neon}22` }}
                      whileTap={{ scale: 0.97 }}
                      style={{
                        padding: "8px 20px", borderRadius: 100,
                        fontSize: 12.5, fontWeight: 700,
                        letterSpacing: "0.07em", textTransform: "uppercase",
                        color: t.activeText, background: t.neon, border: "none",
                        boxShadow: `0 0 16px ${t.neon}44`,
                        cursor: "pointer", whiteSpace: "nowrap",
                        transition: "box-shadow 0.3s",
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >Get Started</motion.button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile — theme + bell + hamburger */}
            <div className="md:hidden" style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <ThemeToggle isDark={isDark} onToggle={toggleTheme} t={t} />
              <NotifBell count={3} t={t} />
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setOpen(!open)}
                style={{
                  width: 36, height: 36, borderRadius: 10,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: t.surface,
                  border: `1px solid ${open ? t.border : t.borderSubtle}`,
                  boxShadow: open ? `0 0 14px ${t.neon}22` : "none",
                  cursor: "pointer", transition: "all 0.3s",
                }}
                aria-label="Toggle menu"
              >
                <Ham open={open} t={t} />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      <MobileDrawer open={open} onClose={() => setOpen(false)} t={t} isDark={isDark} onThemeToggle={toggleTheme} />
    </div>
  );
};

export default NavBar;