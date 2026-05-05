import { useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const Analytics = () => {
  const { T, dark } = useOutletContext();
  const [timeRange, setTimeRange] = useState("7d");

  // Mock data
  const metrics = [
    { label: "Total Donations", value: 1247, change: "+12%", up: true, icon: "📦", color: T.accent },
    { label: "Meals Rescued", value: "38,420", change: "+18%", up: true, icon: "🍽️", color: T.teal },
    { label: "CO₂ Saved", value: "9,210 kg", change: "+15%", up: true, icon: "🌿", color: "#10b981" },
    { label: "NGOs Served", value: 54, change: "+3", up: true, icon: "🤝", color: T.amber },
    { label: "Avg Response", value: "4.2 min", change: "-8%", up: true, icon: "⚡", color: T.blue },
    { label: "Success Rate", value: "97.8%", change: "+2.1%", up: true, icon: "✅", color: "#8b5cf6" },
  ];

  const weeklyData = [
    { day: "Mon", donations: 42, meals: 380, co2: 95 },
    { day: "Tue", donations: 38, meals: 340, co2: 85 },
    { day: "Wed", donations: 55, meals: 490, co2: 122 },
    { day: "Thu", donations: 48, meals: 420, co2: 105 },
    { day: "Fri", donations: 62, meals: 580, co2: 145 },
    { day: "Sat", donations: 71, meals: 650, co2: 162 },
    { day: "Sun", donations: 45, meals: 410, co2: 102 },
  ];

  const categoryData = [
    { name: "Main Course", count: 480, pct: 100, color: T.accent },
    { name: "Snacks", count: 310, pct: 65, color: T.amber },
    { name: "Beverages", count: 240, pct: 50, color: T.blue },
    { name: "Desserts", count: 180, pct: 38, color: "#8b5cf6" },
    { name: "Bakery", count: 150, pct: 31, color: T.teal },
  ];

  const topPerformers = [
    { name: "Akshaya Patra", donations: 142, meals: 4200, rating: 4.9 },
    { name: "Feeding India", donations: 118, meals: 3800, rating: 4.7 },
    { name: "Govt. Shelter #42", donations: 97, meals: 3200, rating: 4.5 },
    { name: "Food4All", donations: 84, meals: 2800, rating: 4.6 },
    { name: "Robin Hood Army", donations: 76, meals: 2400, rating: 4.8 },
  ];

  const recentActivity = [
    { id: 1, action: "Donation Created", item: "Dal Makhani x45", ngo: "Akshaya Patra", time: "2 min ago", status: "matched", color: T.accent },
    { id: 2, action: "Pickup Complete", item: "Biryani Platter x80", ngo: "Feeding India", time: "15 min ago", status: "completed", color: "#10b981" },
    { id: 3, action: "New NGO Joined", item: "Helping Hands", ngo: "Mumbai", time: "1 hr ago", status: "new", color: T.amber },
    { id: 4, action: "Donation Expired", item: "Snack Boxes x30", ngo: "Unclaimed", time: "2 hr ago", status: "expired", color: T.red },
    { id: 5, action: "AI Match", item: "Thali Set x60", ngo: "Govt. Shelter #42", time: "3 hr ago", status: "matched", color: T.blue },
  ];

  const maxDonations = Math.max(...weeklyData.map(d => d.donations));

  return (
    <div style={{ padding: "28px", background: T.bg, minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <motion.div
            animate={{ rotate: [0, 8, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            style={{
              width: 40, height: 40, borderRadius: 10,
              background: T.accentSoft, display: "flex",
              alignItems: "center", justifyContent: "center", fontSize: 20,
            }}
          >📊</motion.div>
          <div>
            <h2 style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 24,
              color: T.text, margin: 0, letterSpacing: "-0.02em",
            }}>Analytics</h2>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
              color: T.textMuted, letterSpacing: "0.06em",
            }}>Deep insights into your rescue operations</div>
          </div>
        </div>

        {/* Time range selector */}
        <div style={{ display: "flex", gap: 6, background: T.bgAlt, padding: 4, borderRadius: 10 }}>
          {["7d", "30d", "90d", "1y"].map(range => (
            <motion.button
              key={range}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTimeRange(range)}
              style={{
                padding: "6px 14px", borderRadius: 8, border: "none",
                background: timeRange === range ? T.accent : "transparent",
                color: timeRange === range ? "#fff" : T.textMuted,
                fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                fontWeight: timeRange === range ? 700 : 400,
                cursor: "pointer", transition: "all 0.2s",
              }}
            >{range}</motion.button>
          ))}
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 14, marginBottom: 28 }}>
        {metrics.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.5 }}
            whileHover={{ y: -3, boxShadow: `0 12px 36px ${m.color}18` }}
            style={{
              background: T.bgCard, borderRadius: 18, padding: "20px 18px",
              border: `1px solid ${T.border}`,
              position: "relative", overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: `radial-gradient(circle, ${m.color}12 0%, transparent 70%)` }} />
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 20 }}>{m.icon}</span>
              <div style={{
                background: `${m.color}18`, border: `1px solid ${m.color}33`,
                borderRadius: 6, padding: "2px 8px", marginLeft: "auto",
              }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: m.color, fontWeight: 700 }}>{m.change}</span>
              </div>
            </div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 26,
              fontWeight: 700, color: T.text, lineHeight: 1, marginBottom: 4,
            }}>{m.value}</div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
              color: T.textMuted, letterSpacing: "0.04em",
            }}>{m.label.toUpperCase()}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }} className="rq-analytics-charts">
        {/* Weekly Donations Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            background: T.bgCard, borderRadius: 18, padding: "22px 24px",
            border: `1px solid ${T.border}`,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <h3 style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 14,
                color: T.text, margin: 0, fontWeight: 700,
              }}>Weekly Donations</h3>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                color: T.textMuted, marginTop: 2,
              }}>Last 7 days performance</div>
            </div>
            <div style={{
              background: `${T.accent}18`, border: `1px solid ${T.accent}33`,
              borderRadius: 8, padding: "4px 10px",
            }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: T.accent, fontWeight: 700 }}>Avg: 52/day</span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 160, paddingBottom: 24, position: "relative" }}>
            {weeklyData.map((d, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(d.donations / maxDonations) * 140}px` }}
                  transition={{ duration: 0.8, delay: 0.4 + i * 0.06 }}
                  whileHover={{ background: T.accent }}
                  style={{
                    width: "100%", borderRadius: "6px 6px 0 0",
                    background: `linear-gradient(180deg, ${T.accent}, ${T.teal})`,
                    minHeight: 4, cursor: "pointer", position: "relative",
                  }}
                >
                  <div style={{
                    position: "absolute", top: -20, left: "50%", transform: "translateX(-50%)",
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: T.accent, fontWeight: 700,
                    opacity: 0, transition: "opacity 0.2s",
                  }}
                  className="rq-chart-tooltip"
                  >{d.donations}</div>
                </motion.div>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
                  color: T.textFaint, letterSpacing: "0.04em",
                }}>{d.day}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Category Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            background: T.bgCard, borderRadius: 18, padding: "22px 24px",
            border: `1px solid ${T.border}`,
          }}
        >
          <h3 style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 14,
            color: T.text, margin: "0 0 20px 0", fontWeight: 700,
          }}>Category Breakdown</h3>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {categoryData.map((cat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.06 }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                    color: T.text, fontWeight: 500,
                  }}>{cat.name}</span>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                    color: cat.color, fontWeight: 700,
                  }}>{cat.count}</span>
                </div>
                <div style={{ height: 8, background: T.bgAlt, borderRadius: 100, overflow: "hidden" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${cat.pct}%` }}
                    transition={{ duration: 1.2, delay: 0.6 + i * 0.08 }}
                    style={{
                      height: "100%", borderRadius: 100,
                      background: `linear-gradient(90deg, ${cat.color}88, ${cat.color})`,
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Donut summary */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: 24, marginTop: 24, paddingTop: 20, borderTop: `1px solid ${T.border}`,
          }}>
            <div style={{ textAlign: "center" }}>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 24,
                fontWeight: 700, color: T.accent,
              }}>1,360</div>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
                color: T.textMuted, letterSpacing: "0.08em",
              }}>TOTAL</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 24,
                fontWeight: 700, color: T.teal,
              }}>5</div>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
                color: T.textMuted, letterSpacing: "0.08em",
              }}>CATS</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20, marginBottom: 28 }} className="rq-analytics-bottom">
        {/* Top NGOs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{
            background: T.bgCard, borderRadius: 18, padding: "22px 24px",
            border: `1px solid ${T.border}`,
          }}
        >
          <h3 style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 14,
            color: T.text, margin: "0 0 16px 0", fontWeight: 700,
          }}>Top Performing NGOs</h3>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {topPerformers.map((ngo, i) => (
              <motion.div
                key={i}
                whileHover={{ x: 4 }}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "12px 14px", borderRadius: 12,
                  background: i === 0 ? T.accentSoft : "transparent",
                  border: `1px solid ${i === 0 ? T.borderMed : "transparent"}`,
                  cursor: "pointer",
                }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: `${T.accent}18`, border: `1px solid ${T.accent}33`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, fontWeight: 700, color: T.accent, flexShrink: 0,
                  fontFamily: "'JetBrains Mono', monospace",
                }}>#{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontFamily: "sans-serif", fontSize: 13, fontWeight: 600,
                    color: T.text,
                  }}>{ngo.name}</div>
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                    color: T.textMuted, marginTop: 2,
                  }}>{ngo.donations} donations · {ngo.meals.toLocaleString()} meals</div>
                </div>
                <div style={{
                  background: `${T.amber}18`, border: `1px solid ${T.amber}33`,
                  borderRadius: 8, padding: "3px 8px", flexShrink: 0,
                }}>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                    color: T.amber, fontWeight: 700,
                  }}>★ {ngo.rating}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          style={{
            background: T.bgCard, borderRadius: 18, padding: "22px 24px",
            border: `1px solid ${T.border}`,
          }}
        >
          <h3 style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 14,
            color: T.text, margin: "0 0 16px 0", fontWeight: 700,
          }}>Recent Activity</h3>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {recentActivity.map((act, i) => (
              <motion.div
                key={act.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.05 }}
                whileHover={{ x: 3 }}
                style={{
                  display: "flex", alignItems: "flex-start", gap: 10,
                  padding: "10px 12px", borderRadius: 10,
                  cursor: "pointer",
                }}
                onMouseEnter={e => e.currentTarget.style.background = T.bgAlt}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <div style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: act.color, marginTop: 5, flexShrink: 0,
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontFamily: "sans-serif", fontSize: 12, fontWeight: 600,
                    color: T.text,
                  }}>{act.action}</div>
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                    color: T.textMuted, marginTop: 2,
                  }}>{act.item}</div>
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
                    color: T.textFaint, marginTop: 3,
                  }}>{act.ngo} · {act.time}</div>
                </div>
                <div style={{
                  background: `${act.color}18`, border: `1px solid ${act.color}33`,
                  borderRadius: 6, padding: "2px 8px", flexShrink: 0, alignSelf: "flex-start", marginTop: 2,
                }}>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
                    color: act.color, fontWeight: 600,
                  }}>{act.status.toUpperCase()}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 900px) {
          .rq-analytics-charts { grid-template-columns: 1fr !important; }
          .rq-analytics-bottom { grid-template-columns: 1fr !important; }
        }
        .rq-chart-tooltip:hover { opacity: 1 !important; }
        .rq-chart-bar:hover + .rq-chart-tooltip { opacity: 1 !important; }
      `}</style>
    </div>
  );
};

export default Analytics;
