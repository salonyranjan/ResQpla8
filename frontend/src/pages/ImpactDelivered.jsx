import { useState, useEffect, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import { databases } from "../services/appwrite";
import { Query } from "appwrite";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const PICKUPS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_PICKUPS_COLLECTION_ID;

/* ─── Theme Toggle ────────────────────────────────────────────── */
function ThemeToggle({ dark, onToggle }) {
  return (
    <button
      onClick={onToggle}
      aria-label="Toggle theme"
      style={{
        position: "fixed",
        top: "1.25rem",
        right: "1.25rem",
        zIndex: 100,
        width: "2.75rem",
        height: "2.75rem",
        borderRadius: "50%",
        border: dark ? "1.5px solid rgba(74,222,128,0.25)" : "1.5px solid rgba(0,0,0,0.10)",
        background: dark ? "rgba(17,28,20,0.85)" : "rgba(255,255,255,0.85)",
        backdropFilter: "blur(12px)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "1.1rem",
        boxShadow: dark
          ? "0 2px 20px rgba(74,222,128,0.12)"
          : "0 2px 20px rgba(0,0,0,0.08)",
        transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
      }}
    >
      {dark ? "☀️" : "🌙"}
    </button>
  );
}

/* ─── Floating orbs background ───────────────────────────────── */
function Orbs({ dark }) {
  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      <div style={{
        position: "absolute", top: "-15%", left: "-10%",
        width: "55vw", height: "55vw", borderRadius: "50%",
        background: dark
          ? "radial-gradient(circle, rgba(16,185,129,0.13) 0%, transparent 70%)"
          : "radial-gradient(circle, rgba(16,185,129,0.10) 0%, transparent 70%)",
        animation: "floatA 14s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute", bottom: "-20%", right: "-10%",
        width: "60vw", height: "60vw", borderRadius: "50%",
        background: dark
          ? "radial-gradient(circle, rgba(245,158,11,0.10) 0%, transparent 70%)"
          : "radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)",
        animation: "floatB 18s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute", top: "40%", left: "60%",
        width: "30vw", height: "30vw", borderRadius: "50%",
        background: dark
          ? "radial-gradient(circle, rgba(20,184,166,0.08) 0%, transparent 70%)"
          : "radial-gradient(circle, rgba(20,184,166,0.07) 0%, transparent 70%)",
        animation: "floatC 22s ease-in-out infinite",
      }} />
    </div>
  );
}

/* ─── Main Component ──────────────────────────────────────────── */
export default function ImpactDelivered() {
  const { T, dark, toggleDark } = useOutletContext() || {};
  const theme = T || {
    bg: dark ? "#080e0a" : "#f0fdf4",
    bgCard: dark ? "rgba(13,22,15,0.85)" : "rgba(255,255,255,0.92)",
    text: dark ? "rgba(240,253,244,0.95)" : "rgba(15,23,42,0.95)",
    textMuted: dark ? "rgba(134,239,172,0.45)" : "rgba(71,85,105,0.6)",
    textFaint: dark ? "rgba(134,239,172,0.3)" : "rgba(71,85,105,0.4)",
    accent: "#10b981",
    accentGlow: "rgba(16,185,129,0.25)",
    border: dark ? "1px solid rgba(74,222,128,0.10)" : "1px solid rgba(0,0,0,0.06)",
    borderMed: dark ? "rgba(74,222,128,0.15)" : "rgba(0,0,0,0.08)",
    shadow: dark
      ? "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(74,222,128,0.06)"
      : "0 32px 80px rgba(0,0,0,0.10), 0 0 0 1px rgba(255,255,255,0.9)",
  };

  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchDelivered = async () => {
      try {
        const response = await databases.listDocuments(
          DATABASE_ID,
          PICKUPS_COLLECTION_ID,
          [Query.equal("status", "delivered")]
        );
        if (!cancelled) {
          setPickups(response.documents);
          setError(null);
        }
      } catch (err) {
        console.error("Failed to fetch delivered pickups:", err);
        if (!cancelled) {
          setError("Failed to load impact data. Please try again later.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchDelivered();
    return () => { cancelled = true; };
  }, []);

  const totalMeals = useMemo(() => {
    return pickups.reduce((sum, p) => {
      const qty = parseInt(p.qty?.match(/\d+/)?.[0] || p.meals || 0, 10);
      return sum + (isNaN(qty) ? 0 : qty);
    }, 0);
  }, [pickups]);

  const totalCO2 = useMemo(() => {
    // Estimate: ~0.5 kg CO₂ saved per meal
    return (totalMeals * 0.5).toFixed(1);
  }, [totalMeals]);

  // CSS injection for animations
  useEffect(() => {
    const id = "impact-orb-styles";
    if (document.getElementById(id)) return;
    const s = document.createElement("style");
    s.id = id;
    s.textContent = `
      @keyframes floatA { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(3%,5%) scale(1.05)} }
      @keyframes floatB { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-4%,-3%) scale(1.08)} }
      @keyframes floatC { 0%,100%{transform:translate(0,0)} 50%{transform:translate(5%,4%)} }
      @keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
    `;
    document.head.appendChild(s);
  }, []);

  const bg = dark ? "#080e0a" : "#f0fdf4";

  return (
    <div style={{
      minHeight: "100vh",
      background: bg,
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "center",
      padding: "2rem 1rem",
      fontFamily: "'Outfit', sans-serif",
      position: "relative",
      transition: "background 0.5s ease",
    }}>
      <Orbs dark={dark} />
      <ThemeToggle dark={dark} onToggle={toggleDark} />

      <div style={{
        position: "relative",
        zIndex: 1,
        width: "100%",
        maxWidth: "900px",
        background: theme.bgCard,
        borderRadius: "1.75rem",
        border: theme.border,
        boxShadow: theme.shadow,
        backdropFilter: "blur(24px)",
        overflow: "hidden",
        transition: "box-shadow 0.5s ease",
      }}>
        {/* Top accent bar */}
        <div style={{
          height: "3px",
          background: "linear-gradient(90deg, #10b981, #f59e0b, #14b8a6, #10b981)",
          backgroundSize: "200% 100%",
        }} />

        <div style={{ padding: "2rem 2rem 2.25rem" }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
              <div style={{
                width: "2.5rem", height: "2.5rem",
                borderRadius: "0.75rem",
                background: "linear-gradient(135deg, #10b981, #14b8a6)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.1rem",
                boxShadow: "0 4px 16px rgba(16,185,129,0.35)",
              }}>🌿</div>
              <h1 style={{
                fontSize: "1.45rem",
                fontWeight: 900,
                fontFamily: "'Syne', sans-serif",
                color: theme.text,
                letterSpacing: "-0.03em",
                lineHeight: 1,
              }}>
                ResQ<span style={{ color: "#f59e0b" }}>Plate</span>
              </h1>
            </div>
            <div style={{
              fontSize: "0.68rem",
              fontFamily: "'DM Mono', monospace",
              color: theme.textMuted,
              letterSpacing: "0.08em",
              border: theme.borderMed,
              padding: "0.25rem 0.65rem",
              borderRadius: "9999px",
            }}>
              IMPACT REPORT
            </div>
          </div>

          {/* Title */}
          <div style={{ marginBottom: "2rem" }}>
            <h2 style={{
              fontSize: "1.5rem",
              fontWeight: 800,
              fontFamily: "'Syne', sans-serif",
              color: theme.text,
              marginBottom: "0.25rem",
              letterSpacing: "-0.02em",
            }}>📋 Impact Delivered</h2>
            <p style={{
              fontSize: "0.82rem",
              color: theme.textMuted,
              fontFamily: "'Outfit', sans-serif",
            }}>Track your community's rescued meals and environmental impact</p>
          </div>

          {/* Error Banner */}
          {error && (
            <div style={{
              marginBottom: "1.5rem",
              padding: "0.75rem 1rem",
              background: dark ? "rgba(239,68,68,0.08)" : "rgba(239,68,68,0.06)",
              border: "1px solid rgba(239,68,68,0.25)",
              borderRadius: "0.75rem",
              fontSize: "0.82rem",
              color: "#ef4444",
              fontFamily: "'DM Mono', monospace",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}>⚠ {error}</div>
          )}

          {/* Loading State */}
          {loading && (
            <div style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "3rem",
            }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                style={{
                  width: 40, height: 40,
                  border: "4px solid rgba(16,185,129,0.2)",
                  borderTopColor: "#10b981",
                  borderRadius: "50%",
                }}
              />
            </div>
          )}

          {/* Stats Cards */}
          {!loading && (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1rem",
              marginBottom: "2rem",
            }}>
              {[
                { label: "Total Deliveries", value: pickups.length, suffix: "", icon: "✅", color: "#10b981" },
                { label: "Meals Rescued", value: totalMeals.toLocaleString(), suffix: "", icon: "🍽️", color: "#f59e0b" },
                { label: "CO₂ Saved", value: totalCO2, suffix: " kg", icon: "🌿", color: "#14b8a6" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  style={{
                    background: dark ? "rgba(16,185,129,0.05)" : "rgba(16,185,129,0.04)",
                    border: `1px solid ${stat.color}22`,
                    borderRadius: "1rem",
                    padding: "1.25rem",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{stat.icon}</div>
                  <div style={{
                    fontSize: "1.5rem",
                    fontWeight: 800,
                    color: stat.color,
                    fontFamily: "'Syne', sans-serif",
                    lineHeight: 1.2,
                  }}>
                    {stat.value}{stat.suffix && <span style={{ fontSize: "0.9rem", marginLeft: "2px" }}>{stat.suffix}</span>}
                  </div>
                  <div style={{
                    fontSize: "0.72rem",
                    color: theme.textMuted,
                    fontFamily: "'DM Mono', monospace",
                    letterSpacing: "0.08em",
                    marginTop: "0.25rem",
                  }}>{stat.label.toUpperCase()}</div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Delivered Pickups List */}
          {!loading && !error && (
            <div>
              <h3 style={{
                fontSize: "1rem",
                fontWeight: 700,
                color: theme.text,
                marginBottom: "1rem",
                fontFamily: "'Syne', sans-serif",
              }}>Recent Deliveries</h3>

              {pickups.length === 0 ? (
                <div style={{
                  textAlign: "center",
                  padding: "2rem",
                  color: theme.textMuted,
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.85rem",
                }}>
                  <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>📋</div>
                  No delivered pickups found yet.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {pickups.map((pickup, idx) => (
                    <motion.div
                      key={pickup.$id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      style={{
                        background: dark ? "rgba(255,255,255,0.03)" : "rgba(248,250,252,1)",
                        border: `1px solid ${dark ? "rgba(74,222,128,0.08)" : "rgba(0,0,0,0.06)"}`,
                        borderRadius: "0.75rem",
                        padding: "1rem 1.25rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        transition: "border-color 0.2s",
                      }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = "#10b98155"}
                      onMouseLeave={e => e.currentTarget.style.borderColor = dark ? "rgba(74,222,128,0.08)" : "rgba(0,0,0,0.06)"}
                    >
                      <div style={{
                        width: "2.5rem",
                        height: "2.5rem",
                        borderRadius: "0.5rem",
                        background: "rgba(16,185,129,0.10)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1rem",
                        flexShrink: 0,
                      }}>✅</div>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontWeight: 600,
                          fontSize: "0.9rem",
                          color: theme.text,
                          marginBottom: "0.15rem",
                        }}>{pickup.foodItem || pickup.food || "Meal donation"}</div>
                        <div style={{
                          fontSize: "0.75rem",
                          color: theme.textMuted,
                          fontFamily: "'DM Mono', monospace",
                        }}>
                          To: {pickup.ngo || pickup.ngoName || "NGO"} &nbsp;·&nbsp; From: {pickup.donor || pickup.restaurant || "Donor"}
                        </div>
                      </div>
                      <div style={{
                        fontSize: "0.72rem",
                        color: "#10b981",
                        fontFamily: "'DM Mono', monospace",
                        fontWeight: 600,
                        flexShrink: 0,
                      }}>
                        {pickup.qty || "1 meal"}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
