import { Link, useOutletContext } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  HiOutlineUser,
  HiOutlineClipboardList,
  HiOutlineLogout,
  HiOutlineHeart,
  HiOutlineCog,
  HiOutlineBell,
  HiOutlineChevronRight,
  HiOutlineShieldCheck,
  HiOutlineStar,
  HiOutlineQuestionMarkCircle,
} from "react-icons/hi";
import { currentUser } from "../data/mockData";

const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } };

export default function ProfilePage() {
  const ctx = useOutletContext?.() ?? {};
  const dark = ctx?.dark ?? true;
  const T = dark
    ? {
        bg: "#080e0a", bgAlt: "#0d1710", bgCard: "#111c14", border: "rgba(34,197,94,0.09)",
        borderMed: "rgba(34,197,94,0.18)", text: "#ecfdf5", textMuted: "#6ee7b7",
        textFaint: "rgba(110,231,183,0.35)", accent: "#22c55e", accentSoft: "rgba(34,197,94,0.09)",
        red: "#ef4444", redSoft: "rgba(239,68,68,0.1)", amber: "#f59e0b", amberSoft: "rgba(245,158,11,0.1)",
        teal: "#14b8a6", blue: "#3b82f6", blueSoft: "rgba(59,130,246,0.1)",
        shadow: "0 4px 24px rgba(0,0,0,0.4)",
      }
    : {
        bg: "#f0f7f2", bgAlt: "#e8f2eb", bgCard: "#ffffff", border: "rgba(26,74,46,0.09)",
        borderMed: "rgba(26,74,46,0.18)", text: "#0d1f12", textMuted: "#3a6647",
        textFaint: "rgba(58,102,71,0.4)", accent: "#16a34a", accentSoft: "rgba(22,163,74,0.09)",
        red: "#dc2626", redSoft: "rgba(220,38,38,0.08)", amber: "#d97706", amberSoft: "rgba(217,119,6,0.08)",
        teal: "#0d9488", blue: "#2563eb", blueSoft: "rgba(37,99,235,0.08)",
        shadow: "0 4px 24px rgba(0,0,0,0.06)",
      };

  const [logoutModal, setLogoutModal] = useState(false);

  const user = currentUser || {
    name: "Arjun Kumar",
    email: "arjun@example.com",
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=arjun",
    donations: 42,
    mealsShared: 186,
    streak: 14,
  };

  const menuSections = [
    {
      title: "ACCOUNT",
      items: [
        { icon: HiOutlineUser, label: "Edit Profile", sub: "Update your info", color: T.blue, bg: T.blueSoft, to: null },
        { icon: HiOutlineClipboardList, label: "Order History", sub: "View past orders", color: T.accent, bg: T.accentSoft, to: "/dashboard/orders" },
        { icon: HiOutlineHeart, label: "My Donations", sub: "Your contribution", color: "#ec4899", bg: "rgba(236,72,153,0.09)", to: "/dashboard/orders" },
      ],
    },
    {
      title: "PREFERENCES",
      items: [
        { icon: HiOutlineBell, label: "Notifications", sub: "Manage alerts", color: T.amber, bg: T.amberSoft, to: null },
        { icon: HiOutlineCog, label: "Settings", sub: "App preferences", color: T.teal, bg: "rgba(20,184,166,0.1)", to: null },
        { icon: HiOutlineShieldCheck, label: "Privacy", sub: "Data & security", color: T.blue, bg: T.blueSoft, to: null },
      ],
    },
    {
      title: "SUPPORT",
      items: [
        { icon: HiOutlineQuestionMarkCircle, label: "Help & FAQ", sub: "Get support", color: T.textMuted, bg: T.accentSoft, to: null },
        { icon: HiOutlineStar, label: "Rate the App", sub: "Share your feedback", color: T.amber, bg: T.amberSoft, to: null },
      ],
    },
  ];

  const achievements = [
    { emoji: "🏆", label: "Gold Donor", desc: "42 donations" },
    { emoji: "🔥", label: "14-Day Streak", desc: "Consistent hero" },
    { emoji: "🌿", label: "Eco Warrior", desc: "100kg CO₂ saved" },
  ];

  return (
    <div style={{ background: T.bg, minHeight: "100vh", paddingBottom: 32 }}>
      {/* Hero header */}
      <div
        style={{
          background: `linear-gradient(160deg, ${dark ? "#0a1f0e" : "#dcfce7"} 0%, ${dark ? "#111c14" : "#f0fdf4"} 100%)`,
          padding: "28px 20px 80px",
          position: "relative",
          overflow: "hidden",
          borderBottom: `1px solid ${T.border}`,
        }}
      >
        {/* Decorative circles */}
        {[200, 140, 80].map((size, i) => (
          <div key={i} style={{
            position: "absolute", top: -size / 2, right: -size / 4,
            width: size, height: size, borderRadius: "50%",
            background: `radial-gradient(circle, ${T.accent}${12 - i * 3}  0%, transparent 70%)`,
            pointerEvents: "none",
          }} />
        ))}

        <div style={{ display: "flex", alignItems: "center", gap: 16, position: "relative" }}>
          <div style={{ position: "relative" }}>
            <img
              src={user.avatar || `https://api.dicebear.com/7.x/notionists/svg?seed=${user.name}`}
              alt="avatar"
              style={{
                width: 72,
                height: 72,
                borderRadius: 22,
                border: `3px solid ${T.accent}`,
                objectFit: "cover",
                background: T.bgCard,
              }}
            />
            <div style={{
              position: "absolute",
              bottom: -4,
              right: -4,
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: T.accent,
              border: `2px solid ${dark ? "#0a1f0e" : "#dcfce7"}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 10,
            }}>
              ✓
            </div>
          </div>

          <div>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: T.text, letterSpacing: "-0.03em" }}>{user.name}</h1>
            <p style={{ fontSize: 12.5, color: T.textMuted, marginTop: 3 }}>{user.email}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
              <div style={{ background: T.accentSoft, border: `1px solid ${T.borderMed}`, borderRadius: 100, padding: "2px 10px" }}>
                <span style={{ fontFamily: "monospace", fontSize: 10, color: T.accent, fontWeight: 700 }}>🏆 GOLD DONOR</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div style={{ padding: "0 16px", marginTop: -44 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: T.bgCard,
            border: `1px solid ${T.border}`,
            borderRadius: 22,
            padding: "18px 20px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 16,
            boxShadow: T.shadow,
          }}
        >
          {[
            { value: user.donations || 42, label: "Donations", icon: "🍽️", color: T.accent },
            { value: user.mealsShared || 186, label: "Meals Shared", icon: "🤝", color: T.teal },
            { value: (user.streak || 14) + "d", label: "Streak", icon: "🔥", color: T.amber },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
              <p style={{ fontFamily: "monospace", fontSize: 18, fontWeight: 800, color: s.color }}>{s.value}</p>
              <p style={{ fontSize: 9.5, color: T.textFaint, fontFamily: "monospace", marginTop: 2 }}>{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Achievements */}
      <div style={{ padding: "20px 16px 0" }}>
        <p style={{ fontSize: 11, fontFamily: "monospace", color: T.textFaint, letterSpacing: "0.08em", marginBottom: 12 }}>ACHIEVEMENTS</p>
        <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 2, scrollbarWidth: "none" }}>
          {achievements.map((a) => (
            <motion.div
              key={a.label}
              whileHover={{ y: -2 }}
              style={{
                flexShrink: 0,
                background: T.bgCard,
                border: `1px solid ${T.border}`,
                borderRadius: 18,
                padding: "14px 16px",
                textAlign: "center",
                minWidth: 110,
                boxShadow: T.shadow,
              }}
            >
              <div style={{ fontSize: 26, marginBottom: 6 }}>{a.emoji}</div>
              <p style={{ fontSize: 12, fontWeight: 700, color: T.text }}>{a.label}</p>
              <p style={{ fontSize: 10, color: T.textFaint, marginTop: 2 }}>{a.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Menu sections */}
      {menuSections.map((section) => (
        <div key={section.title} style={{ padding: "20px 16px 0" }}>
          <p style={{ fontSize: 10, fontFamily: "monospace", color: T.textFaint, letterSpacing: "0.1em", marginBottom: 10 }}>
            {section.title}
          </p>
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            style={{
              background: T.bgCard,
              border: `1px solid ${T.border}`,
              borderRadius: 20,
              overflow: "hidden",
            }}
          >
            {section.items.map((item, idx) => {
              const Inner = (
                <motion.div
                  key={item.label}
                  variants={fadeUp}
                  whileHover={{ x: 3 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "14px 16px",
                    borderBottom: idx < section.items.length - 1 ? `1px solid ${T.border}` : "none",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  <div style={{
                    width: 40, height: 40, borderRadius: 13,
                    background: item.bg,
                    border: `1px solid ${item.color}22`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <item.icon style={{ fontSize: 18, color: item.color }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, fontSize: 13.5, color: T.text }}>{item.label}</p>
                    <p style={{ fontSize: 11, color: T.textFaint, marginTop: 2 }}>{item.sub}</p>
                  </div>
                  <HiOutlineChevronRight style={{ fontSize: 16, color: T.textFaint }} />
                </motion.div>
              );

              return item.to ? (
                <Link key={item.label} to={item.to} style={{ textDecoration: "none", display: "block" }}>
                  {Inner}
                </Link>
              ) : (
                <div key={item.label}>{Inner}</div>
              );
            })}
          </motion.div>
        </div>
      ))}

      {/* Logout */}
      <div style={{ padding: "16px 16px 0" }}>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setLogoutModal(true)}
          style={{
            width: "100%",
            background: T.redSoft,
            border: `1px solid ${T.red}33`,
            borderRadius: 20,
            padding: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          <HiOutlineLogout style={{ fontSize: 20, color: T.red }} />
          <span style={{ fontWeight: 700, fontSize: 14, color: T.red }}>Logout</span>
        </motion.button>
      </div>

      {/* App version */}
      <p style={{ textAlign: "center", marginTop: 24, fontSize: 11, color: T.textFaint, fontFamily: "monospace" }}>
        ResQPlate v2.0.0 · Made with 🌿
      </p>

      {/* Logout modal */}
      <AnimatePresence>
        {logoutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
              display: "flex", alignItems: "flex-end", justifyContent: "center",
              zIndex: 100, padding: 16,
            }}
            onClick={() => setLogoutModal(false)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: T.bgCard,
                borderRadius: 28,
                padding: 28,
                width: "100%",
                maxWidth: 420,
                border: `1px solid ${T.border}`,
              }}
            >
              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <div style={{ fontSize: 44, marginBottom: 12 }}>👋</div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: T.text, marginBottom: 8 }}>Leaving so soon?</h3>
                <p style={{ fontSize: 13, color: T.textMuted }}>Are you sure you want to logout?</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <button style={{ background: T.red, color: "#fff", border: "none", borderRadius: 16, padding: "14px", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
                  Yes, Logout
                </button>
                <button onClick={() => setLogoutModal(false)}
                  style={{ background: T.bgAlt, color: T.textMuted, border: `1px solid ${T.border}`, borderRadius: 16, padding: "14px", fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}