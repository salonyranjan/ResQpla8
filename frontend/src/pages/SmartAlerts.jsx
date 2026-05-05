import { useOutletContext } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SmartAlerts = () => {
  const { T, dark } = useOutletContext();
  const [filter, setFilter] = useState("all");

  const alerts = [
    {
      id: 1,
      type: "urgent",
      icon: "⚠️",
      title: "Food Expiring Soon",
      message: "45 meals of Dal Makhani at Taj Palace will expire in 30 minutes",
      time: "2 min ago",
      location: "Connaught Place, Delhi",
      action: "Notify NGOs",
      color: T.amber,
      bg: T.amberSoft,
      border: `rgba(245,158,11,0.2)`,
    },
    {
      id: 2,
      type: "match",
      icon: "🤖",
      title: "AI Match Found",
      message: "Found 3 NGOs within 2km suitable for your Biryani donation (80 meals)",
      time: "5 min ago",
      location: "ITC Grand Chola, Delhi",
      action: "View Matches",
      color: T.accent,
      bg: T.accentSoft,
      border: `rgba(34,197,94,0.2)`,
    },
    {
      id: 3,
      type: "pickup",
      icon: "🚴",
      title: "Pickup Update",
      message: "Volunteer Ramesh is 0.8km away and will arrive in 4 minutes",
      time: "8 min ago",
      location: "Paharganj, Delhi",
      action: "Track Live",
      color: T.blue,
      bg: T.blueSoft,
      border: `rgba(59,130,246,0.2)`,
    },
    {
      id: 4,
      type: "delivery",
      icon: "✅",
      title: "Delivery Confirmed",
      message: "Order #2847 successfully delivered to Akshaya Patra - 45 meals",
      time: "15 min ago",
      location: "Karol Bagh, Delhi",
      action: "View Proof",
      color: T.teal,
      bg: T.tealSoft,
      border: `rgba(20,184,166,0.2)`,
    },
    {
      id: 5,
      type: "new",
      icon: "🆕",
      title: "New Donation Posted",
      message: "Hyderabadi Biryani Platter - 80 meals available for pickup",
      time: "18 min ago",
      location: "Bangalore South",
      action: "View Details",
      color: "#8b5cf6",
      bg: "rgba(139,92,246,0.08)",
      border: `rgba(139,92,246,0.2)`,
    },
    {
      id: 6,
      type: "system",
      icon: "⚙️",
      title: "System Alert",
      message: "3 NGOs haven't confirmed pickup within 30min window - auto-escalating",
      time: "22 min ago",
      location: "Mumbai Central",
      action: "Manage",
      color: T.red,
      bg: T.redSoft,
      border: `rgba(239,68,68,0.2)`,
    },
  ];

  const filteredAlerts = filter === "all"
    ? alerts
    : alerts.filter(a => a.type === filter);

  const typeCounts = {
    all: alerts.length,
    urgent: alerts.filter(a => a.type === "urgent").length,
    match: alerts.filter(a => a.type === "match").length,
    pickup: alerts.filter(a => a.type === "pickup").length,
    delivery: alerts.filter(a => a.type === "delivery").length,
  };

  return (
    <div style={{ padding: "28px", background: T.bg, minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              width: 40, height: 40, borderRadius: 10,
              background: T.amberSoft, display: "flex",
              alignItems: "center", justifyContent: "center", fontSize: 20,
            }}
          >🔔</motion.div>
          <div>
            <h2 style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 24,
              color: T.text, margin: 0, letterSpacing: "-0.02em",
            }}>Smart Alerts</h2>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
              color: T.textMuted, letterSpacing: "0.06em",
            }}>Real-time notifications for your rescue operations</div>
          </div>
        </div>

        {/* Live indicator */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: T.accentSoft, border: `1px solid ${T.borderMed}`,
          borderRadius: 100, padding: "6px 14px",
        }}>
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
            style={{ width: 8, height: 8, borderRadius: "50%", background: T.accent }}
          />
          <span style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
            color: T.accent, fontWeight: 700, letterSpacing: "0.08em",
          }}>LIVE</span>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
        gap: 12, marginBottom: 24,
      }} className="rq-alerts-stats">
        {[
          { label: "Total Alerts", value: alerts.length, color: T.accent, icon: "🔔" },
          { label: "Urgent", value: typeCounts.urgent, color: T.amber, icon: "⚠️" },
          { label: "AI Matches", value: typeCounts.match, color: T.blue, icon: "🤖" },
          { label: "Active Pickups", value: typeCounts.pickup, color: T.teal, icon: "🚴" },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            style={{
              background: T.bgCard, borderRadius: 14, padding: "16px 18px",
              border: `1px solid ${T.border}`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 16 }}>{s.icon}</span>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
                color: T.textFaint, letterSpacing: "0.1em", textTransform: "uppercase",
              }}>{s.label}</span>
            </div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 22,
              fontWeight: 700, color: s.color, lineHeight: 1,
            }}>{s.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Filter Pills */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {[
          { id: "all", label: "All Alerts" },
          { id: "urgent", label: "⚠️ Urgent" },
          { id: "match", label: "🤖 AI Matches" },
          { id: "pickup", label: "🚴 Pickups" },
          { id: "delivery", label: "✅ Deliveries" },
        ].map(f => (
          <motion.button
            key={f.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilter(f.id)}
            style={{
              padding: "7px 14px", borderRadius: 100,
              border: `1px solid ${filter === f.id ? T.accent : T.border}`,
              background: filter === f.id ? T.accentSoft : "transparent",
              color: filter === f.id ? T.accent : T.textMuted,
              fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
              cursor: "pointer", fontWeight: filter === f.id ? 700 : 400,
              letterSpacing: "0.04em", transition: "all 0.2s",
            }}
          >{f.label} {f.id !== "all" && (
            <span style={{
              background: filter === f.id ? T.accent : T.bgAlt,
              color: filter === f.id ? "#fff" : T.textFaint,
              borderRadius: 100, padding: "1px 6px", marginLeft: 4,
              fontSize: 9, fontWeight: 700,
            }}>{typeCounts[f.id] || 0}</span>
          )}</motion.button>
        ))}
      </div>

      {/* Alerts List */}
      <AnimatePresence>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filteredAlerts.map((alert, i) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              whileHover={{ x: 4 }}
              style={{
                background: T.bgCard, borderRadius: 16,
                border: `1px solid ${alert.border}`,
                padding: "16px 20px", cursor: "pointer", position: "relative",
                overflow: "hidden", transition: "border-color 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = alert.color}
              onMouseLeave={e => e.currentTarget.style.borderColor = alert.border}
            >
              {/* Left accent bar */}
              <div style={{
                position: "absolute", left: 0, top: 0, bottom: 0, width: 3,
                background: alert.color, borderRadius: "0 3px 3px 0",
              }} />

              <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 12,
                  background: alert.bg, border: `1px solid ${alert.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18, flexShrink: 0,
                }}>{alert.icon}</div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{
                      fontFamily: "sans-serif", fontSize: 13, fontWeight: 600,
                      color: T.text,
                    }}>{alert.title}</span>
                    {alert.type === "urgent" && (
                      <span style={{
                        background: T.amber, color: "#fff", borderRadius: 4,
                        padding: "2px 6px", fontSize: 8,
                        fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
                        letterSpacing: "0.06em",
                      }}>URGENT</span>
                    )}
                  </div>
                  <p style={{
                    margin: "0 0 8px 0", fontSize: 12, color: T.textMuted,
                    lineHeight: 1.5,
                  }}>{alert.message}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
                      color: T.textFaint,
                    }}>📍 {alert.location}</span>
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
                      color: T.textFaint,
                    }}>🕐 {alert.time}</span>
                  </div>
                </div>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  style={{
                    padding: "8px 14px", borderRadius: 8, border: "none",
                    background: alert.color, color: "#fff",
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                    fontWeight: 600, cursor: "pointer", flexShrink: 0,
                  }}
                >{alert.action}</motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>

      {filteredAlerts.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ textAlign: "center", padding: "40px 20px", color: T.textFaint }}
        >
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔕</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
            No alerts found for this filter
          </div>
        </motion.div>
      )}

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 700px) {
          .rq-alerts-stats { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  );
};

export default SmartAlerts;
