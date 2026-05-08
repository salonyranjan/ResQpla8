import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { analyzeDonationImage } from "../../services/aiService";

/**
 * QuickDonationModal
 * Props: isOpen, onClose, T (theme)
 *
 * Features:
 *  - "Snap & ResQ" vision section (top) with file input, scanning state, and auto-fill
 *  - Manual donation form (below) with food type, quantity, location, expiry
 *  - Glassmorphic styling, dashed accent border, botanical watermark
 */
export default function QuickDonationModal({ isOpen, onClose, T }) {
  const [form, setForm] = useState({
    foodType: "Veg",
    quantity: "",
    location: "",
    expiresIn: "2h",
    foodName: "",
  });

  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanError, setScanError] = useState("");
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(null);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setScanning(false);
      setScanProgress(0);
      setScanError("");
      setFileName("");
      setForm({ foodType: "Veg", quantity: "", location: "", expiresIn: "2h", foodName: "" });
    }
  }, [isOpen]);

  /* ── Image-to-Base64 ── */
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (e) => reject(e);
    });

  /* ── Handle file selection ── */
  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setScanError("");
    setScanning(true);
    setScanProgress(0);

    // Simulate high-speed progress bar (Groq is fast ~1-2s)
    const progressInterval = setInterval(() => {
      setScanProgress((p) => Math.min(p + 8, 90));
    }, 80);

    try {
      const b64 = await toBase64(file);
      // Strip data URI prefix for the API call
      const base64Data = b64.split(",")[1] || b64;
      const result = await analyzeDonationImage(base64Data);

      // Auto-fill form
      if (result.food) setForm((f) => ({ ...f, foodName: result.food }));
      if (result.meals) setForm((f) => ({ ...f, quantity: String(result.meals) }));
      if (result.type && ["Veg", "Non-Veg", "Mixed"].includes(result.type)) {
        setForm((f) => ({ ...f, foodType: result.type }));
      }

      setScanProgress(100);
      setTimeout(() => {
        setScanning(false);
        setScanProgress(0);
      }, 600);
    } catch (err) {
      console.error("Vision scan failed:", err);
      setScanError("Scan failed — try again or fill manually.");
      setScanning(false);
      setScanProgress(0);
    } finally {
      clearInterval(progressInterval);
    }
  };

  /* ── Submit handler (placeholder) ── */
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: wire up to actual donation API
    alert(`Donation submitted!\n${JSON.stringify(form, null, 2)}`);
    onClose?.();
  };

  /* ── Theme fallbacks ── */
  const theme = T || {
    accent: "#22c55e",
    accentGlow: "rgba(34,197,94,0.25)",
    accentSoft: "rgba(34,197,94,0.08)",
    text: "#ecfdf5",
    textMuted: "#6ee7b7",
    textFaint: "rgba(110,231,183,0.35)",
    bgCard: "rgba(5,18,9,0.97)",
    bgInput: "#0d1710",
    border: "rgba(34,197,94,0.12)",
    borderMed: "rgba(34,197,94,0.18)",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed", inset: 0, zIndex: 1000,
            background: "rgba(0,0,0,0.65)",
            backdropFilter: "blur(6px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 16,
          }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            style={{
              background: theme.bgCard,
              borderRadius: 24,
              border: `1px solid ${theme.borderMed}`,
              boxShadow: `0 40px 100px rgba(0,0,0,0.7), 0 0 80px ${theme.accentGlow}`,
              width: "100%",
              maxWidth: 520,
              maxHeight: "90vh",
              overflow: "auto",
              position: "relative",
              fontFamily: "'JetBrains Mono', monospace",
              color: theme.text,
            }}
          >
            {/* Botanical watermark */}
            <div style={{
              position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 180, opacity: 0.04, fontFamily: "serif",
              userSelect: "none",
            }}>🌿</div>

            <div style={{ position: "relative", zIndex: 1, padding: "28px 28px 24px" }}>
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                <div>
                  <h2 style={{
                    margin: 0, fontFamily: "Georgia, serif", fontSize: 22, fontWeight: 700,
                    color: theme.text, letterSpacing: "-0.02em",
                  }}>
                    Quick Donation
                  </h2>
                  <p style={{
                    margin: "4px 0 0", fontSize: 11, color: theme.textMuted, letterSpacing: "0.04em",
                  }}>
                    Snap a photo or fill manually
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  style={{
                    background: "transparent", border: "none", color: theme.textMuted,
                    fontSize: 22, cursor: "pointer", padding: 4, lineHeight: 1,
                  }}
                  aria-label="Close"
                >✕</motion.button>
              </div>

              {/* ═══ Snap & ResQ Section ═══ */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  backdropFilter: "blur(12px)",
                  border: `2px dashed ${theme.accent}66`,
                  borderRadius: 18,
                  padding: "20px 18px",
                  marginBottom: 24,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Corner leaf decorations */}
                <span style={{
                  position: "absolute", top: 6, left: 8, fontSize: 14, opacity: 0.25,
                  pointerEvents: "none",
                }}>🌿</span>
                <span style={{
                  position: "absolute", bottom: 6, right: 8, fontSize: 14, opacity: 0.25,
                  pointerEvents: "none", transform: "scaleX(-1)",
                }}>🌿</span>

                <div style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
                  color: theme.accent, letterSpacing: "0.14em", textTransform: "uppercase",
                  marginBottom: 10, display: "flex", alignItems: "center", gap: 6,
                }}>
                  <span style={{ fontSize: 16 }}>📸</span>
                  Snap &amp; ResQ
                  <span style={{
                    background: `${theme.accent}18`, border: `1px solid ${theme.accent}33`,
                    borderRadius: 4, padding: "1px 6px", fontSize: 8, marginLeft: 4,
                  }}>AI VISION</span>
                </div>

                {/* File input area */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFile}
                  style={{ display: "none" }}
                />

                <motion.div
                  whileHover={{ borderColor: `${theme.accent}aa` }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: `2px dashed ${fileName ? theme.accent + "88" : theme.accent + "44"}`,
                    borderRadius: 12, padding: "18px 12px", textAlign: "center",
                    cursor: "pointer", transition: "border-color 0.2s",
                    background: fileName ? `${theme.accent}08` : "transparent",
                  }}
                >
                  {fileName ? (
                    <div>
                      <div style={{ fontSize: 20, marginBottom: 4 }}>✅</div>
                      <div style={{ fontSize: 11, color: theme.accent, fontWeight: 600 }}>{fileName}</div>
                      <div style={{ fontSize: 9, color: theme.textFaint, marginTop: 2 }}>Click to change image</div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontSize: 28, marginBottom: 6, opacity: 0.7 }}>📷</div>
                      <div style={{ fontSize: 12, color: theme.textMuted }}>Click to upload food image</div>
                      <div style={{ fontSize: 9, color: theme.textFaint, marginTop: 2 }}>Groq Vision will auto-detect details</div>
                    </div>
                  )}
                </motion.div>

                {/* Scanning state with high-speed loading bar */}
                <AnimatePresence>
                  {scanning && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ marginTop: 12, overflow: "hidden" }}
                    >
                      <div style={{
                        display: "flex", alignItems: "center", gap: 8,
                        marginBottom: 8, fontSize: 11, color: theme.accent,
                        fontFamily: "'JetBrains Mono', monospace",
                      }}>
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                          style={{ display: "inline-block" }}
                        >⚡</motion.span>
                        Scanning with Groq Vision…
                      </div>
                      {/* High-speed loading bar */}
                      <div style={{
                        height: 4, borderRadius: 100, background: "rgba(34,197,94,0.1)", overflow: "hidden",
                      }}>
                        <motion.div
                          animate={{ x: ["-100%", "100%"] }}
                          transition={{ repeat: Infinity, duration: 0.6, ease: "linear" }}
                          style={{
                            width: "40%", height: "100%", borderRadius: 100,
                            background: `linear-gradient(90deg, transparent, ${theme.accent}, transparent)`,
                          }}
                        />
                      </div>
                      <div style={{
                        fontSize: 9, color: theme.textFaint, marginTop: 4, textAlign: "center",
                        }}>
                        Powered by Groq • Low-latency inference
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Scan error */}
                <AnimatePresence>
                  {scanError && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      style={{
                        marginTop: 8, padding: "6px 10px", borderRadius: 8,
                        background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
                        color: "#ef4444", fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      ⚠ {scanError}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* ═══ Donation Form ═══ */}
              <form onSubmit={handleSubmit}>
                {/* Food Name (auto-filled) */}
                {form.foodName && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ marginBottom: 14 }}
                  >
                    <label style={{
                      display: "block", fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 9, color: theme.textMuted, letterSpacing: "0.08em",
                      marginBottom: 4, textTransform: "uppercase",
                    }}>Detected Food</label>
                    <div style={{
                      padding: "8px 12px", borderRadius: 10,
                      background: `${theme.accent}12`, border: `1px solid ${theme.accent}33`,
                      fontSize: 12, color: theme.accent, fontWeight: 600,
                    }}>
                      🍽 {form.foodName}
                    </div>
                  </motion.div>
                )}

                {/* Food Type */}
                <div style={{ marginBottom: 14 }}>
                  <label style={{
                    display: "block", fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 9, color: theme.textMuted, letterSpacing: "0.08em",
                    marginBottom: 6, textTransform: "uppercase",
                  }}>Food Type</label>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {["Veg", "Non-Veg", "Mixed"].map((opt) => (
                      <motion.button
                        key={opt}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, foodType: opt }))}
                        style={{
                          padding: "8px 16px", borderRadius: 10,
                          border: `1px solid ${form.foodType === opt ? theme.accent : theme.border}`,
                          background: form.foodType === opt ? theme.accentSoft : theme.bgInput,
                          color: form.foodType === opt ? theme.accent : theme.textMuted,
                          fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                          cursor: "pointer", fontWeight: form.foodType === opt ? 700 : 400,
                        }}
                      >{opt}</motion.button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div style={{ marginBottom: 14 }}>
                  <label style={{
                    display: "block", fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 9, color: theme.textMuted, letterSpacing: "0.08em",
                    marginBottom: 6, textTransform: "uppercase",
                  }}>Quantity (meals)</label>
                  <input
                    value={form.quantity}
                    onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))}
                    placeholder="e.g. 45"
                    type="number"
                    min="1"
                    style={{
                      width: "100%", padding: "10px 14px", borderRadius: 10,
                      border: `1px solid ${theme.border}`, background: theme.bgInput,
                      color: theme.text, fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 13, outline: "none", boxSizing: "border-box",
                    }}
                  />
                </div>

                {/* Location */}
                <div style={{ marginBottom: 14 }}>
                  <label style={{
                    display: "block", fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 9, color: theme.textMuted, letterSpacing: "0.08em",
                    marginBottom: 6, textTransform: "uppercase",
                  }}>Pickup Location</label>
                  <input
                    value={form.location}
                    onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                    placeholder="e.g. Connaught Place"
                    style={{
                      width: "100%", padding: "10px 14px", borderRadius: 10,
                      border: `1px solid ${theme.border}`, background: theme.bgInput,
                      color: theme.text, fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 13, outline: "none", boxSizing: "border-box",
                    }}
                  />
                </div>

                {/* Expires In */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{
                    display: "block", fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 9, color: theme.textMuted, letterSpacing: "0.08em",
                    marginBottom: 6, textTransform: "uppercase",
                  }}>Expires In</label>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {["1h", "2h", "4h", "6h", "12h"].map((opt) => (
                      <motion.button
                        key={opt}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, expiresIn: opt }))}
                        style={{
                          padding: "8px 14px", borderRadius: 10,
                          border: `1px solid ${form.expiresIn === opt ? theme.accent : theme.border}`,
                          background: form.expiresIn === opt ? theme.accentSoft : theme.bgInput,
                          color: form.expiresIn === opt ? theme.accent : theme.textMuted,
                          fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                          cursor: "pointer", fontWeight: form.expiresIn === opt ? 700 : 400,
                        }}
                      >{opt}</motion.button>
                    ))}
                  </div>
                </div>

                {/* Submit */}
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: `0 8px 28px ${theme.accentGlow}` }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  disabled={!form.quantity || !form.location}
                  style={{
                    width: "100%", padding: "14px 0", borderRadius: 14, border: "none",
                    background: (!form.quantity || !form.location) ? theme.bgInput : theme.accent,
                    color: (!form.quantity || !form.location) ? theme.textMuted : "#fff",
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 700,
                    cursor: (!form.quantity || !form.location) ? "not-allowed" : "pointer",
                    opacity: (!form.quantity || !form.location) ? 0.5 : 1,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  }}
                >
                  ⚡ Submit Donation
                </motion.button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
