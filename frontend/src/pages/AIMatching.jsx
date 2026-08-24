import { useNavigate, useOutletContext } from "react-router-dom";
import { useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { findVolunteerMatches } from "../services/volunteerRouting";

const AIMatching = () => {
  const { T } = useOutletContext();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    foodType: "Veg",
    quantity: "",
    location: "",
    expiresIn: "2h",
  });
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState("");

  const runMatch = async () => {
    setLoading(true);
    setError("");
    setMatches([]);
    setStep(1);
    try {
      const ranked = await findVolunteerMatches({ address: form.location, quantity: form.quantity, expiry: form.expiresIn });
      setStep(2);
      setMatches(ranked.slice(0, 3).map((volunteer, index) => ({
        id: volunteer.$id,
        name: volunteer.name || `Volunteer ${volunteer.userId.slice(-6)}`,
        capacity: `${volunteer.maxMeals || 0} meals`,
        distance: `${volunteer.distanceKm.toFixed(1)} km`,
        reliability: Math.round((Number(volunteer.reliability) > 1 ? Number(volunteer.reliability) : Number(volunteer.reliability) * 100) || 0),
        score: Math.round(volunteer.routingScore * 100),
        color: [T.accent, T.teal, T.amber][index],
      })));
      setStep(3);
    } catch (matchError) {
      setError(matchError.message || "Volunteer matching could not be completed.");
      setStep(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "28px", background: T.bg, minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
        <Motion.div
          animate={{ rotate: loading ? 360 : 0 }}
          transition={{ duration: 1.5, repeat: loading ? Infinity : 0, ease: "linear" }}
          style={{
            width: 40, height: 40, borderRadius: 10,
            background: T.accentSoft, display: "flex",
            alignItems: "center", justifyContent: "center", fontSize: 20,
          }}
        >🤖</Motion.div>
        <div>
          <h2 style={{
            fontFamily: "'DM Mono', monospace", fontSize: 24,
            color: T.text, margin: 0, letterSpacing: "-0.02em",
          }}>Volunteer Matching</h2>
          <div style={{
            fontFamily: "'DM Mono', monospace", fontSize: 11,
            color: T.textMuted, letterSpacing: "0.06em",
          }}>Distance, capacity and reliability scoring from live volunteer records</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Input Form */}
        <div style={{
          background: T.bgCard, borderRadius: 18, padding: 24,
          border: `1px solid ${T.border}`,
        }}>
          <h3 style={{
            fontFamily: "'DM Mono', monospace", fontSize: 16,
            color: T.text, margin: "0 0 20px 0",
          }}>Donation Details</h3>

          {[
            { label: "Food Type", key: "foodType", options: ["Veg", "Non-Veg", "Vegan", "Mixed"] },
            { label: "Quantity (meals)", key: "quantity", placeholder: "e.g. 45" },
            { label: "Pickup Location", key: "location", placeholder: "e.g. Connaught Place" },
            { label: "Expires In", key: "expiresIn", options: ["1h", "2h", "4h", "6h", "12h"] },
          ].map((field) => (
            <div key={field.key} style={{ marginBottom: 16 }}>
              <label style={{
                display: "block", fontFamily: "'DM Mono', monospace",
                fontSize: 11, color: T.textMuted, letterSpacing: "0.08em",
                marginBottom: 6, textTransform: "uppercase",
              }}>{field.label}</label>
              {field.options ? (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {field.options.map((opt) => (
                    <Motion.button
                      key={opt}
                      type="button"
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setForm(f => ({ ...f, [field.key]: opt }))}
                      style={{
                        padding: "8px 16px", borderRadius: 10, border: `1px solid ${form[field.key] === opt ? T.accent : T.border}`,
                        background: form[field.key] === opt ? T.accentSoft : T.bgInput,
                        color: form[field.key] === opt ? T.accent : T.textMuted,
                        fontFamily: "'DM Mono', monospace", fontSize: 12,
                        cursor: "pointer", fontWeight: form[field.key] === opt ? 700 : 400,
                      }}
                    >{opt}</Motion.button>
                  ))}
                </div>
              ) : (
                <input
                  value={form[field.key]}
                  onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                  placeholder={field.placeholder}
                  style={{
                    width: "100%", padding: "10px 14px", borderRadius: 10,
                    border: `1px solid ${T.border}`, background: T.bgInput,
                    color: T.text, fontFamily: "'DM Mono', monospace",
                    fontSize: 13, outline: "none", boxSizing: "border-box",
                  }}
                />
              )}
            </div>
          ))}

          {error && <div role="alert" style={{ marginBottom: 14, padding: 11, borderRadius: 10, color: T.red, background: T.redSoft }}>{error}</div>}
          <Motion.button
            whileHover={{ scale: 1.02, boxShadow: `0 8px 28px ${T.accentGlow}` }}
            whileTap={{ scale: 0.97 }}
            onClick={runMatch}
            disabled={loading || !form.quantity || !form.location}
            style={{
              width: "100%", padding: "14px 0", borderRadius: 12, border: "none",
              background: loading ? T.bgAlt : T.accent, color: loading ? T.textMuted : "#fff",
              fontFamily: "'DM Mono', monospace", fontSize: 14, fontWeight: 700,
              cursor: loading || !form.quantity || !form.location ? "not-allowed" : "pointer",
              opacity: loading || !form.quantity || !form.location ? 0.5 : 1,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}
          >
            {loading ? (
              <Motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>⚙️</Motion.span>
            ) : "⚡"}&nbsp;{loading ? "Scoring volunteers..." : "Find Volunteers"}
          </Motion.button>
        </div>

        {/* Matching Pipeline + Results */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Pipeline visualization */}
          <div style={{
            background: T.bgCard, borderRadius: 18, padding: 24,
            border: `1px solid ${T.border}`,
          }}>
            <h3 style={{
              fontFamily: "'DM Mono', monospace", fontSize: 16,
              color: T.text, margin: "0 0 20px 0",
            }}>Matching Pipeline</h3>
            <div style={{ display: "flex", alignItems: "center", gap: 0, overflow: "hidden" }}>
              {[
                { icon: "📋", label: "Input", done: step >= 1 },
                { icon: "🧠", label: "Scoring", done: step >= 2 },
                { icon: "📍", label: "Geo Filter", done: step >= 2 },
                { icon: "✅", label: "Match", done: step >= 3 },
              ].map((s, i) => (
                <div key={s.label} style={{ flex: 1, textAlign: "center" }}>
                  <Motion.div
                    animate={{
                      background: s.done ? `${T.accent}22` : T.bgInput,
                      borderColor: s.done ? T.accent : T.border,
                      scale: s.done && step === i + 1 ? [1, 1.15, 1] : 1,
                    }}
                    transition={{ duration: 0.5 }}
                    style={{
                      width: 48, height: 48, borderRadius: 14, border: `1px solid ${T.border}`,
                      margin: "0 auto 8px", display: "flex", alignItems: "center",
                      justifyContent: "center", fontSize: 20,
                    }}
                  >{s.icon}</Motion.div>
                  <div style={{
                    fontFamily: "'DM Mono', monospace", fontSize: 10,
                    color: s.done ? T.accent : T.textFaint, letterSpacing: "0.06em",
                  }}>{s.label}</div>
                  {i < 3 && (
                    <Motion.div
                      animate={{ background: step > i + 1 ? T.accent : T.border }}
                      style={{
                        height: 2, width: "100%", position: "relative",
                        top: -36, left: "50%", zIndex: -1,
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Results */}
          <AnimatePresence>
            {matches.length > 0 && (
              <Motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                style={{
                  background: T.bgCard, borderRadius: 18, padding: 24,
                  border: `1px solid ${T.border}`,
                }}
              >
                <h3 style={{
                  fontFamily: "'DM Mono', monospace", fontSize: 16,
                  color: T.text, margin: "0 0 16px 0",
                }}>Top Matches ({matches.length})</h3>
                {matches.map((m, i) => (
                  <Motion.div
                    key={m.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.12 }}
                    whileHover={{ x: 4 }}
                    style={{
                      display: "flex", alignItems: "center", gap: 14,
                      padding: "14px 16px", borderRadius: 12,
                      background: i === 0 ? T.accentSoft : "transparent",
                      border: `1px solid ${i === 0 ? T.borderMed : "transparent"}`,
                      marginBottom: i < matches.length - 1 ? 10 : 0,
                      cursor: "pointer",
                    }}
                  >
                    <div style={{
                      width: 42, height: 42, borderRadius: 12,
                      background: `${m.color}18`, border: `1px solid ${m.color}33`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 18, flexShrink: 0,
                    }}>🏠</div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontFamily: "'DM Mono', monospace", fontSize: 13,
                        fontWeight: 600, color: T.text,
                      }}>{m.name}</div>
                      <div style={{
                        fontFamily: "'DM Mono', monospace", fontSize: 10,
                        color: T.textMuted, marginTop: 2,
                      }}>{m.distance} · capacity {m.capacity} · reliability {m.reliability}% · score {m.score}%</div>
                    </div>
                    {i === 0 && (
                      <div style={{
                        background: T.accent, color: "#fff",
                        borderRadius: 6, padding: "3px 8px",
                        fontFamily: "'DM Mono', monospace", fontSize: 9,
                        fontWeight: 700, letterSpacing: "0.06em",
                      }}>BEST</div>
                    )}
                    <Motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate("/dashboard/donate", { state: { donationDraft: form, suggestedPartner: m.name } })}
                      style={{
                        padding: "8px 14px", borderRadius: 8, border: "none",
                        background: m.color, color: "#fff",
                        fontFamily: "'DM Mono', monospace", fontSize: 11,
                        fontWeight: 600, cursor: "pointer",
                      }}
                    >Select</Motion.button>
                  </Motion.div>
                ))}
              </Motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AIMatching;
