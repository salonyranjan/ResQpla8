import { useOutletContext } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useVolunteerPickups } from "../hooks/useVolunteerPickups";

const VolunteerPickup = () => {
  const { T } = useOutletContext();
  const { filteredPickups, filter, setFilter, statusCounts } = useVolunteerPickups(T);

  const getStatusBadge = (status) => {
    const badges = {
      "on-the-way": { label: "On The Way", color: T.blue, bg: T.blueSoft },
      "arrived": { label: "Arrived", color: T.amber, bg: T.amberSoft },
      "picking-up": { label: "Picking Up", color: T.accent, bg: T.accentSoft },
      "delivered": { label: "Delivered", color: T.teal, bg: T.tealSoft },
    };
    return badges[status] || badges["on-the-way"];
  };

  return (
    <div style={{ padding: "28px", background: T.bg, minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              width: 40, height: 40, borderRadius: 10,
              background: T.amberSoft, display: "flex",
              alignItems: "center", justifyContent: "center", fontSize: 20,
            }}
          >🚴</motion.div>
          <div>
            <h2 style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 24,
              color: T.text, margin: 0, letterSpacing: "-0.02em",
            }}>Volunteer Pickups</h2>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
              color: T.textMuted, letterSpacing: "0.06em",
            }}>Live tracking of food rescue operations</div>
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
        display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
        gap: 14, marginBottom: 24,
      }} className="rq-pickup-stats">
        {[
          { label: "Active Pickups", value: statusCounts.all, icon: "🚴", color: T.accent },
          { label: "On The Way", value: statusCounts["on-the-way"], icon: "🚲", color: T.blue },
          { label: "Arrived", value: statusCounts.arrived, icon: "📍", color: T.amber },
          { label: "Avg Delivery", value: "4.2 min", icon: "⏱", color: T.teal },
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
              <span style={{ fontSize: 18 }}>{s.icon}</span>
            </div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 22,
              fontWeight: 700, color: s.color, lineHeight: 1, marginBottom: 4,
            }}>{s.value}</div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
              color: T.textMuted, letterSpacing: "0.1em", textTransform: "uppercase",
            }}>{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Filter Pills */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {[
          { id: "all", label: "All Pickups" },
          { id: "on-the-way", label: "🚲 On The Way" },
          { id: "arrived", label: "📍 Arrived" },
          { id: "picking-up", label: "📦 Picking Up" },
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
          >
            {f.label} {f.id !== "all" && (
              <span style={{
                background: filter === f.id ? T.accent : T.bgAlt,
                color: filter === f.id ? "#fff" : T.textFaint,
                borderRadius: 100, padding: "1px 6px", marginLeft: 4,
                fontSize: 9, fontWeight: 700,
              }}>{statusCounts[f.id] || 0}</span>
            )}
          </motion.button>
        ))}
      </div>

      {/* Pickup Cards */}
      <AnimatePresence>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {filteredPickups.map((pickup, i) => {
            const badge = getStatusBadge(pickup.status);
            return (
              <motion.div
                key={pickup.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                whileHover={{ x: 4 }}
                style={{
                  background: T.bgCard, borderRadius: 18,
                  border: `1px solid ${T.border}`,
                  padding: "20px", cursor: "pointer", position: "relative",
                  overflow: "hidden", transition: "border-color 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = pickup.color}
                onMouseLeave={e => e.currentTarget.style.borderColor = T.border}
              >
                {/* Left accent bar */}
                <div style={{
                  position: "absolute", left: 0, top: 0, bottom: 0, width: 3,
                  background: pickup.color, borderRadius: "0 3px 3px 0",
                }} />

                {/* Header Row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 12,
                      background: `${pickup.color}18`, border: `1px solid ${pickup.color}33`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 14, fontWeight: 700, color: pickup.color,
                      fontFamily: "'JetBrains Mono', monospace",
                    }}>{pickup.avatar}</div>
                    <div>
                      <div style={{
                        fontFamily: "sans-serif", fontSize: 15, fontWeight: 600,
                        color: T.text,
                      }}>{pickup.volunteer}</div>
                      <div style={{
                        fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                        color: T.textMuted, marginTop: 2,
                      }}>★ {pickup.rating} · {pickup.rescues} rescues</div>
                    </div>
                  </div>

                  <div style={{
                    background: badge.bg, border: `1px solid ${badge.color}33`,
                    borderRadius: 8, padding: "4px 10px", flexShrink: 0,
                  }}>
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
                      color: badge.color, fontWeight: 700, letterSpacing: "0.06em",
                    }}>{badge.label.toUpperCase()}</span>
                  </div>
                </div>

                {/* Food Item */}
                <div style={{
                  background: T.bgAlt, borderRadius: 12, padding: "12px 16px",
                  marginBottom: 16,
                }}>
                  <div style={{
                    fontFamily: "sans-serif", fontSize: 14, fontWeight: 600,
                    color: T.text, marginBottom: 4,
                  }}>{pickup.foodItem}</div>
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                    color: T.textMuted,
                  }}>From: {pickup.donor}</div>
                </div>

                {/* Locations */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: 140 }}>
                    <div style={{
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
                      color: T.textFaint, letterSpacing: "0.1em", marginBottom: 4,
                      textTransform: "uppercase",
                    }}>Pickup</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 14 }}>📍</span>
                      <span style={{
                        fontFamily: "sans-serif", fontSize: 12, color: T.text,
                      }}>{pickup.pickupLocation}</span>
                    </div>
                  </div>

                  <motion.div
                    animate={{ x: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    style={{ color: T.accent, fontSize: 18, flexShrink: 0 }}
                  >→</motion.div>

                  <div style={{ flex: 1, minWidth: 140 }}>
                    <div style={{
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
                      color: T.textFaint, letterSpacing: "0.1em", marginBottom: 4,
                      textTransform: "uppercase",
                    }}>Deliver To</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 14 }}>🏠</span>
                      <span style={{
                        fontFamily: "sans-serif", fontSize: 12, color: T.text,
                      }}>{pickup.deliveryLocation}</span>
                    </div>
                  </div>

                  <div style={{
                    background: `${pickup.color}18`, border: `1px solid ${pickup.color}33`,
                    borderRadius: 8, padding: "6px 10px", flexShrink: 0, textAlign: "center",
                  }}>
                    <div style={{
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
                      color: pickup.color, fontWeight: 700,
                    }}>{pickup.eta}</div>
                    <div style={{
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 8,
                      color: T.textFaint,
                    }}>ETA</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
                      color: T.textFaint, letterSpacing: "0.08em",
                    }}>PROGRESS</span>
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
                      color: pickup.color, fontWeight: 700,
                    }}>{Math.round(pickup.progress)}%</span>
                  </div>
                  <div style={{
                    height: 6, background: T.bgAlt, borderRadius: 100,
                    overflow: "hidden",
                  }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pickup.progress}%` }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      style={{
                        height: "100%", borderRadius: 100,
                        background: `linear-gradient(90deg, ${pickup.color}88, ${pickup.color})`,
                      }}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    style={{
                      padding: "8px 14px", borderRadius: 8, border: "none",
                      background: pickup.color, color: "#fff",
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                      fontWeight: 600, cursor: "pointer", flexShrink: 0,
                    }}
                  >📍 Track Live</motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    style={{
                      padding: "8px 14px", borderRadius: 8,
                      border: `1px solid ${T.border}`, background: T.bgAlt,
                      color: T.text, fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                      fontWeight: 500, cursor: "pointer", flexShrink: 0,
                    }}
                  >📞 Contact Volunteer</motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    style={{
                      padding: "8px 14px", borderRadius: 8,
                      border: `1px solid ${T.border}`, background: T.bgAlt,
                      color: T.textMuted, fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                      fontWeight: 500, cursor: "pointer", flexShrink: 0, marginLeft: "auto",
                    }}
                  >View Details →</motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </AnimatePresence>

      {filteredPickups.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ textAlign: "center", padding: "40px 20px", color: T.textFaint }}
        >
          <div style={{ fontSize: 40, marginBottom: 12 }}>🚴</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
            No pickups found for this filter
          </div>
        </motion.div>
      )}

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 700px) {
          .rq-pickup-stats { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  );
};

export default VolunteerPickup;
