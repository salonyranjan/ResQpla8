import { useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const AIMatching = () => {
  const { T, dark } = useOutletContext();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    foodType: "Veg",
    quantity: "",
    location: "",
    expiresIn: "2h",
  });
  const [matches, setMatches] = useState([]);

  const runMatch = () => {
    setLoading(true);
    setStep(1);
    setTimeout(() => { setStep(2); }, 1200);
    setTimeout(() => {
      setMatches([
        { id: 1, name: "Akshaya Patra", location: "Delhi", capacity: "50 meals", distance: "1.2 km", rating: 4.9, eta: "8 min", color: T.accent },
        { id: 2, name: "Feeding India", location: "Delhi", capacity: "40 meals", distance: "2.8 km", rating: 4.7, eta: "15 min", color: T.teal },
        { id: 3, name: "Govt. Shelter #42", location: "Delhi", capacity: "30 meals", distance: "0.8 km", rating: 4.5, eta: "5 min", color: T.amber },
      ]);
      setLoading(false);
      setStep(3);
    }, 2800);
  };

  return (
    <div style={{ padding: "28px", background: T.bg, minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
        <motion.div
          animate={{ rotate: loading ? 360 : 0 }}
          transition={{ duration: 1.5, repeat: loading ? Infinity : 0, ease: "linear" }}
          style={{
            width: 40, height: 40, borderRadius: 10,
            background: T.accentSoft, display: "flex",
            alignItems: "center", justifyContent: "center", fontSize: 20,
          }}
        >🤖</motion.div>
        <div>
          <h2 style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 24,
            color: T.text, margin: 0, letterSpacing: "-0.02em",
          }}>AI-Powered Matching</h2>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
            color: T.textMuted, letterSpacing: "0.06em",
          }}>Real-time donor → NGO intelligence engine</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Input Form */}
        <div style={{
          background: T.bgCard, borderRadius: 18, padding: 24,
          border: `1px solid ${T.border}`,
        }}>
          <h3 style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 16,
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
                display: "block", fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11, color: T.textMuted, letterSpacing: "0.08em",
                marginBottom: 6, textTransform: "uppercase",
              }}>{field.label}</label>
              {field.options ? (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {field.options.map((opt) => (
                    <motion.button
                      key={opt}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setForm(f => ({ ...f, [field.key]: opt }))}
                      style={{
                        padding: "8px 16px", borderRadius: 10, border: `1px solid ${form[field.key] === opt ? T.accent : T.border}`,
                        background: form[field.key] === opt ? T.accentSoft : T.bgInput,
                        color: form[field.key] === opt ? T.accent : T.textMuted,
                        fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
                        cursor: "pointer", fontWeight: form[field.key] === opt ? 700 : 400,
                      }}
                    >{opt}</motion.button>
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
                    color: T.text, fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 13, outline: "none", boxSizing: "border-box",
                  }}
                />
              )}
            </div>
          ))}

          <motion.button
            whileHover={{ scale: 1.02, boxShadow: `0 8px 28px ${T.accentGlow}` }}
            whileTap={{ scale: 0.97 }}
            onClick={runMatch}
            disabled={loading || !form.quantity || !form.location}
            style={{
              width: "100%", padding: "14px 0", borderRadius: 12, border: "none",
              background: loading ? T.bgAlt : T.accent, color: loading ? T.textMuted : "#fff",
              fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 700,
              cursor: loading || !form.quantity || !form.location ? "not-allowed" : "pointer",
              opacity: loading || !form.quantity || !form.location ? 0.5 : 1,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}
          >
            {loading ? (
              <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>⚙️</motion.span>
            ) : "⚡"}&nbsp;{loading ? "AI Processing..." : "Run AI Match"}
          </motion.button>
        </div>

        {/* Matching Pipeline + Results */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Pipeline visualization */}
          <div style={{
            background: T.bgCard, borderRadius: 18, padding: 24,
            border: `1px solid ${T.border}`,
          }}>
            <h3 style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 16,
              color: T.text, margin: "0 0 20px 0",
            }}>Matching Pipeline</h3>
            <div style={{ display: "flex", alignItems: "center", gap: 0, overflow: "hidden" }}>
              {[
                { icon: "📋", label: "Input", done: step >= 1 },
                { icon: "🧠", label: "AI Scan", done: step >= 2 },
                { icon: "📍", label: "Geo Filter", done: step >= 2 },
                { icon: "✅", label: "Match", done: step >= 3 },
              ].map((s, i) => (
                <div key={s.label} style={{ flex: 1, textAlign: "center" }}>
                  <motion.div
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
                  >{s.icon}</motion.div>
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                    color: s.done ? T.accent : T.textFaint, letterSpacing: "0.06em",
                  }}>{s.label}</div>
                  {i < 3 && (
                    <motion.div
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
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                style={{
                  background: T.bgCard, borderRadius: 18, padding: 24,
                  border: `1px solid ${T.border}`,
                }}
              >
                <h3 style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 16,
                  color: T.text, margin: "0 0 16px 0",
                }}>Top Matches ({matches.length})</h3>
                {matches.map((m, i) => (
                  <motion.div
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
                        fontFamily: "'JetBrains Mono', monospace", fontSize: 13,
                        fontWeight: 600, color: T.text,
                      }}>{m.name}</div>
                      <div style={{
                        fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                        color: T.textMuted, marginTop: 2,
                      }}>{m.location} · {m.capacity} · ⭐ {m.rating} · {m.eta}</div>
                    </div>
                    {i === 0 && (
                      <div style={{
                        background: T.accent, color: "#fff",
                        borderRadius: 6, padding: "3px 8px",
                        fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
                        fontWeight: 700, letterSpacing: "0.06em",
                      }}>BEST</div>
                    )}
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      style={{
                        padding: "8px 14px", borderRadius: 8, border: "none",
                        background: m.color, color: "#fff",
                        fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                        fontWeight: 600, cursor: "pointer",
                      }}
                    >Select</motion.button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AIMatching;