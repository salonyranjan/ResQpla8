import { useOutletContext } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";

const PostIn60Seconds = () => {
  const { T, dark } = useOutletContext();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    foodType: "Veg",
    quantity: "",
    description: "",
    location: "",
    expiry: "2h",
    images: [],
    video: null,
    videoPreview: null,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setForm(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setForm(prev => ({ ...prev, video: file, videoPreview: preview }));
    }
  };

  const removeImage = (index) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.quantity || !form.location || !form.description) {
      alert("Please fill all required fields");
      return;
    }
    setLoading(true);
    // Simulate 60-second posting
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setStep(1);
        setForm({
          foodType: "Veg",
          quantity: "",
          description: "",
          location: "",
          expiry: "2h",
          images: [],
          video: null,
          videoPreview: null,
        });
      }, 3000);
    }, 1500);
  };

  const nextStep = () => {
    if (step === 1 && (!form.quantity || !form.location)) {
      alert("Please fill quantity and location");
      return;
    }
    if (step === 2 && !form.description) {
      alert("Please add a description");
      return;
    }
    setStep(step + 1);
  };

  return (
    <div style={{ padding: "28px", background: T.bg, minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            width: 40, height: 40, borderRadius: 10,
            background: T.accentSoft, display: "flex",
            alignItems: "center", justifyContent: "center", fontSize: 20,
          }}
        >⚡</motion.div>
        <div>
          <h2 style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 24,
            color: T.text, margin: 0, letterSpacing: "-0.02em",
          }}>Post in 60 Seconds</h2>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
            color: T.textMuted, letterSpacing: "0.06em",
          }}>Share surplus food instantly with NGOs</div>
        </div>
      </div>

      {/* Progress Steps */}
      <div style={{
        background: T.bgCard, borderRadius: 18, padding: "20px 24px",
        marginBottom: 24, border: `1px solid ${T.border}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
          {[
            { num: "1", label: "Details", icon: "📝" },
            { num: "2", label: "Media", icon: "📸" },
            { num: "3", label: "Publish", icon: "🚀" },
          ].map((s, i) => (
            <div key={i} style={{ flex: 1, textAlign: "center", position: "relative" }}>
              <motion.div
                animate={{
                  background: step >= i + 1 ? T.accent : T.bgInput,
                  borderColor: step >= i + 1 ? T.accent : T.border,
                  scale: step === i + 1 ? [1, 1.1, 1] : 1,
                }}
                transition={{ duration: 0.5 }}
                style={{
                  width: 48, height: 48, borderRadius: 14,
                  border: `2px solid ${T.border}`, margin: "0 auto 8px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18, color: step >= i + 1 ? "#fff" : T.textMuted,
                }}
              >{s.icon}</motion.div>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                color: step >= i + 1 ? T.accent : T.textFaint,
                letterSpacing: "0.06em", fontWeight: step >= i + 1 ? 700 : 400,
              }}>{s.label}</div>
              {i < 2 && (
                <motion.div
                  animate={{ background: step > i + 1 ? T.accent : T.border }}
                  style={{
                    height: 2, width: "100%", position: "absolute",
                    top: 24, left: "50%", zIndex: -1,
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {success && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            background: `${T.accent}18`, border: `2px solid ${T.accent}`,
            borderRadius: 24, padding: "40px 32px", marginBottom: 24,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
          <h3 style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 20,
            color: T.accent, margin: "0 0 8px 0",
          }}>Posted Successfully!</h3>
          <p style={{ margin: 0, color: T.textMuted, fontSize: 13 }}>
            Your food donation is now live and visible to NGOs nearby.
          </p>
        </motion.div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Step 1: Details */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
              background: T.bgCard, borderRadius: 18, padding: "24px",
              marginBottom: 20, border: `1px solid ${T.border}`,
            }}
          >
            <h3 style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 16,
              color: T.text, margin: "0 0 20px 0",
            }}>Quick Details</h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{
                  display: "block", fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11, color: T.textMuted, letterSpacing: "0.08em",
                  marginBottom: 6, textTransform: "uppercase",
                }}>Food Type</label>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {["Veg", "Non-Veg", "Vegan"].map(type => (
                    <motion.button
                      key={type}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setForm(f => ({ ...f, foodType: type }))}
                      type="button"
                      style={{
                        padding: "8px 14px", borderRadius: 8,
                        border: `1px solid ${form.foodType === type ? T.accent : T.border}`,
                        background: form.foodType === type ? T.accentSoft : T.bgInput,
                        color: form.foodType === type ? T.accent : T.textMuted,
                        fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
                        cursor: "pointer", fontWeight: form.foodType === type ? 700 : 400,
                      }}
                    >{type}</motion.button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{
                  display: "block", fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11, color: T.textMuted, letterSpacing: "0.08em",
                  marginBottom: 6, textTransform: "uppercase",
                }}>Quantity (meals)</label>
                <input
                  type="number" min="1"
                  value={form.quantity}
                  onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))}
                  placeholder="e.g. 45"
                  style={{
                    width: "100%", padding: "10px 14px", borderRadius: 10,
                    border: `1px solid ${T.border}`, background: T.bgInput,
                    color: T.text, fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 13, outline: "none", boxSizing: "border-box",
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{
                display: "block", fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11, color: T.textMuted, letterSpacing: "0.08em",
                marginBottom: 6, textTransform: "uppercase",
              }}>Pickup Location</label>
              <input
                value={form.location}
                onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                placeholder="e.g. Connaught Place, Delhi"
                style={{
                  width: "100%", padding: "10px 14px", borderRadius: 10,
                  border: `1px solid ${T.border}`, background: T.bgInput,
                  color: T.text, fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 13, outline: "none", boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{
                display: "block", fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11, color: T.textMuted, letterSpacing: "0.08em",
                marginBottom: 6, textTransform: "uppercase",
              }}>Description</label>
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Brief description of food items..."
                rows={3}
                style={{
                  width: "100%", padding: "10px 14px", borderRadius: 10,
                  border: `1px solid ${T.border}`, background: T.bgInput,
                  color: T.text, fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 13, outline: "none", boxSizing: "border-box",
                  resize: "vertical",
                }}
              />
            </div>

            <div>
              <label style={{
                display: "block", fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11, color: T.textMuted, letterSpacing: "0.08em",
                marginBottom: 6, textTransform: "uppercase",
              }}>Expires In</label>
              <div style={{ display: "flex", gap: 8 }}>
                {["1h", "2h", "4h", "6h"].map(opt => (
                  <motion.button
                    key={opt}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setForm(f => ({ ...f, expiry: opt }))}
                    type="button"
                    style={{
                      padding: "8px 14px", borderRadius: 8,
                      border: `1px solid ${form.expiry === opt ? T.accent : T.border}`,
                      background: form.expiry === opt ? T.accentSoft : T.bgInput,
                      color: form.expiry === opt ? T.accent : T.textMuted,
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
                      cursor: "pointer", fontWeight: form.expiry === opt ? 700 : 400,
                    }}
                  >{opt}</motion.button>
                ))}
              </div>
            </div>

            <motion.button
              type="button"
              onClick={nextStep}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              style={{
                width: "100%", padding: "14px 0", borderRadius: 12, border: "none",
                background: T.accent, color: "#fff",
                fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 700,
                cursor: "pointer", marginTop: 20,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}
            >
              Next: Add Media →
            </motion.button>
          </motion.div>
        )}

        {/* Step 2: Media Upload */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
              background: T.bgCard, borderRadius: 18, padding: "24px",
              marginBottom: 20, border: `1px solid ${T.border}`,
            }}
          >
            <h3 style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 16,
              color: T.text, margin: "0 0 20px 0",
            }}>Add Photos & Video</h3>

            {/* Image Upload */}
            <div style={{ marginBottom: 24 }}>
              <label style={{
                display: "block", fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11, color: T.textMuted, letterSpacing: "0.08em",
                marginBottom: 10, textTransform: "uppercase",
              }}>Food Photos (Multiple)</label>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
                {form.images.map((img, i) => (
                  <div key={i} style={{
                    position: "relative", width: 100, height: 100,
                    borderRadius: 10, overflow: "hidden", border: `1px solid ${T.border}`,
                  }}>
                    <img src={img.preview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      style={{
                        position: "absolute", top: 4, right: 4,
                        width: 20, height: 20, borderRadius: "50%",
                        background: T.red, color: "#fff", border: "none",
                        cursor: "pointer", fontSize: 10, display: "flex",
                        alignItems: "center", justifyContent: "center",
                      }}
                    >✕</button>
                  </div>
                ))}
                <label
                  htmlFor="food-images"
                  style={{
                    width: 100, height: 100, borderRadius: 10,
                    border: `2px dashed ${T.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", fontSize: 24, color: T.textFaint,
                    background: T.bgInput,
                  }}
                >📸</label>
                <input
                  id="food-images"
                  type="file"
                  accept="image/*"
                  multiple
                  style={{ display: "none" }}
                  onChange={handleImageUpload}
                />
              </div>
              <p style={{ margin: 0, fontSize: 11, color: T.textFaint, fontStyle: "italic" }}>
                JPG or PNG recommended (max 5MB each)
              </p>
            </div>

            {/* Video Upload */}
            <div style={{ marginBottom: 24 }}>
              <label style={{
                display: "block", fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11, color: T.textMuted, letterSpacing: "0.08em",
                marginBottom: 10, textTransform: "uppercase",
              }}>Video (Optional)</label>
              {!form.videoPreview ? (
                <label
                  htmlFor="food-video"
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "20px", borderRadius: 10,
                    border: `2px dashed ${T.border}`,
                    cursor: "pointer", background: T.bgInput,
                  }}
                >
                  <span style={{ fontSize: 24 }}>🎥</span>
                  <div>
                    <div style={{
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
                      color: T.text, fontWeight: 600,
                    }}>Upload Video</div>
                    <div style={{ fontSize: 10, color: T.textFaint, marginTop: 2 }}>
                      MP4 or MOV, max 50MB
                    </div>
                  </div>
                </label>
              ) : (
                <div style={{ borderRadius: 10, overflow: "hidden", border: `1px solid ${T.border}` }}>
                  <video controls style={{ width: "100%", maxHeight: 300 }}>
                    <source src={form.videoPreview} type="video/mp4" />
                  </video>
                  <div style={{
                    padding: "8px 12px", background: T.bgAlt,
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                  }}>
                    <span style={{ fontSize: 11, color: T.textMuted }}>{form.video?.name}</span>
                    <button
                      type="button"
                      onClick={() => setForm(f => ({ ...f, video: null, videoPreview: null }))}
                      style={{
                        background: T.red, color: "#fff", border: "none",
                        padding: "4px 8px", borderRadius: 6, cursor: "pointer", fontSize: 10,
                      }}
                    >Remove</button>
                  </div>
                </div>
              )}
              <input
                id="food-video"
                type="file"
                accept="video/*"
                style={{ display: "none" }}
                onChange={handleVideoUpload}
              />
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <motion.button
                type="button"
                onClick={() => setStep(1)}
                whileTap={{ scale: 0.97 }}
                style={{
                  flex: 1, padding: "14px 0", borderRadius: 12,
                  border: `1px solid ${T.border}`, background: T.bgAlt,
                  color: T.text, fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 14, fontWeight: 600, cursor: "pointer",
                }}
              >
                ← Back
              </motion.button>
              <motion.button
                type="button"
                onClick={nextStep}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  flex: 2, padding: "14px 0", borderRadius: 12, border: "none",
                  background: T.accent, color: "#fff",
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 700,
                  cursor: "pointer", display: "flex", alignItems: "center",
                  justifyContent: "center", gap: 8,
                }}
              >
                Next: Publish →
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Publish */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: T.bgCard, borderRadius: 18, padding: "32px 24px",
              marginBottom: 20, border: `1px solid ${T.border}`,
              textAlign: "center",
            }}
          >
            <div style={{
              width: 80, height: 80, borderRadius: "50%",
              background: T.accentSoft, border: `2px solid ${T.accent}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 36, margin: "0 auto 20px",
            }}>📋</div>
            <h3 style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 20,
              color: T.text, margin: "0 0 12px 0",
            }}>Ready to Publish!</h3>
            <div style={{
              background: T.bgAlt, borderRadius: 14, padding: "16px 20px",
              marginBottom: 24, textAlign: "left",
            }}>
              <div style={{ marginBottom: 8 }}>
                <span style={{ color: T.textMuted, fontSize: 11 }}>Food Type: </span>
                <span style={{ color: T.text, fontWeight: 600 }}>{form.foodType}</span>
              </div>
              <div style={{ marginBottom: 8 }}>
                <span style={{ color: T.textMuted, fontSize: 11 }}>Quantity: </span>
                <span style={{ color: T.accent, fontWeight: 700 }}>{form.quantity} meals</span>
              </div>
              <div style={{ marginBottom: 8 }}>
                <span style={{ color: T.textMuted, fontSize: 11 }}>Location: </span>
                <span style={{ color: T.text }}>{form.location}</span>
              </div>
              <div style={{ marginBottom: 8 }}>
                <span style={{ color: T.textMuted, fontSize: 11 }}>Expires: </span>
                <span style={{ color: T.amber, fontWeight: 600 }}>{form.expiry}</span>
              </div>
              <div>
                <span style={{ color: T.textMuted, fontSize: 11 }}>Media: </span>
                <span style={{ color: T.text }}>{form.images.length} photos{form.video ? " + 1 video" : ""}</span>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <motion.button
                type="button"
                onClick={() => setStep(2)}
                whileTap={{ scale: 0.97 }}
                style={{
                  flex: 1, padding: "14px 0", borderRadius: 12,
                  border: `1px solid ${T.border}`, background: T.bgAlt,
                  color: T.text, fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 14, fontWeight: 600, cursor: "pointer",
                }}
              >
                ← Edit
              </motion.button>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                disabled={loading}
                style={{
                  flex: 2, padding: "14px 0", borderRadius: 12, border: "none",
                  background: loading ? T.bgAlt : T.accent, color: loading ? T.textMuted : "#fff",
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 700,
                  cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.5 : 1,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}
              >
                {loading ? (
                  <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>⚙️</motion.span>
                ) : "⚡"}&nbsp;{loading ? "Posting..." : "Post Now!"}
              </motion.button>
            </div>
          </motion.div>
        )}
      </form>
    </div>
  );
};

export default PostIn60Seconds;
