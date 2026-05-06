import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";

const Leaderboard = () => {
  const { T, dark } = useOutletContext() || {};
  
  // Clean fallback theme to ensure no crashes
  const theme = T || {
    bg: dark ? "#080e0a" : "#f0fdf4",
    bgCard: dark ? "rgba(13,22,15,0.85)" : "rgba(255,255,255,0.92)",
    text: dark ? "rgba(240,253,244,0.95)" : "rgba(15,23,42,0.95)",
    textMuted: dark ? "rgba(134,239,172,0.45)" : "rgba(71,85,105,0.6)",
    accent: "#f59e0b",
    accentSoft: "rgba(245,158,11,0.08)",
    border: dark ? "rgba(74,222,128,0.10)" : "rgba(0,0,0,0.06)",
  };

  const leaders = [
    { rank: 1, name: "Ramesh K.", rescues: 142, badge: "🏆", avatar: "RK", color: "#f59e0b" },
    { rank: 2, name: "Priya S.", rescues: 118, badge: "🥈", avatar: "PS", color: "#94a3b8" },
    { rank: 3, name: "Arun M.", rescues: 97, badge: "🥉", avatar: "AM", color: "#cd7c2f" },
    { rank: 4, name: "Neha V.", rescues: 84, badge: "⭐", avatar: "NV", color: "#a855f7" },
    { rank: 5, name: "Vikram S.", rescues: 72, badge: "", avatar: "VS", color: "#3b82f6" },
  ];

  return (
    <div style={{ padding: "28px", background: theme.bg, minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{
            width: 40, height: 40, borderRadius: 10,
            background: theme.accentSoft, display: "flex",
            alignItems: "center", justifyContent: "center", fontSize: 20,
          }}
        >🏆</motion.div>
        <div>
          <h2 style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 24,
            color: theme.text, margin: 0, letterSpacing: "-0.02em",
          }}>Leaderboard</h2>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
            color: theme.textMuted, letterSpacing: "0.06em",
          }}>Top volunteers this month</div>
        </div>
      </div>

      {/* Trophy Card - FIXED Line 62 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: `linear-gradient(135deg, ${theme.accent}22, ${theme.accent}08)`,
          border: `1px solid ${theme.accent}33`,
          borderRadius: 24, padding: "32px", marginBottom: 32,
          textAlign: "center", position: "relative", overflow: "hidden",
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 12 }}>🏆</div>
        <div style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: 28, fontWeight: 900, color: theme.text,
          marginBottom: 4,
        }}>Top Volunteer</div>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 14, color: theme.accent, fontWeight: 700,
        }}>{leaders[0].name}</div>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 12, color: theme.textMuted, marginTop: 4,
        }}>{leaders[0].rescues} rescues this month</div>
      </motion.div>

      {/* Leaderboard List */}
      <div style={{ 
        background: theme.bgCard, 
        borderRadius: 18, 
        border: theme.border.includes("solid") ? theme.border : `1px solid ${theme.border}`, 
        overflow: "hidden" 
      }}>
        {leaders.map((leader, i) => (
          <motion.div
            key={leader.rank}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            style={{
              display: "flex", alignItems: "center", gap: 16,
              padding: "16px 20px",
              borderBottom: i < leaders.length - 1 ? `1px solid ${theme.border}` : "none",
              background: i === 0 ? `${leader.color}08` : "transparent",
            }}
          >
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: i === 0 ? leader.color : theme.accentSoft,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
              color: i === 0 ? "#fff" : theme.textMuted, fontWeight: 700,
            }}>
              {leader.rank}
            </div>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: `${leader.color}22`,
              border: `1px solid ${leader.color}33`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "sans-serif", fontSize: 14, fontWeight: 700,
              color: leader.color,
            }}>
              {leader.avatar}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontFamily: "sans-serif", fontSize: 14, fontWeight: 600,
                color: theme.text,
              }}>{leader.name}</div>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                color: theme.textMuted,
              }}>{leader.rescues} rescues</div>
            </div>
            {leader.badge && (
              <div style={{ fontSize: 20 }}>{leader.badge}</div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;