import { useLocation, useOutletContext, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { createFoodDonation } from "../services/foodService";

const DonateFood = () => {
  const { T } = useOutletContext();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const draft = location.state?.donationDraft;
  const [form, setForm] = useState({
    foodType: draft?.foodType || "Veg",
    quantity: draft?.quantity || "",
    description: "",
    location: draft?.location || "",
    expiry: draft?.expiresIn || "2h",
    image: null,
    imagePreview: null,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      if (form.imagePreview) URL.revokeObjectURL(form.imagePreview);
    };
  }, [form.imagePreview]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Select a valid image file.");
        e.target.value = "";
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("The food photo must be 5 MB or smaller.");
        e.target.value = "";
        return;
      }
      const preview = URL.createObjectURL(file);
      setError("");
      setForm(prev => ({ ...prev, image: file, imagePreview: preview }));
    } else {
      setForm(prev => ({ ...prev, image: null, imagePreview: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.quantity || !form.location || !form.description || !form.image) {
      setError("Complete all required fields and select a food photo.");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      await createFoodDonation({ ...form, userId: user?.$id });
      setSuccess(true);
      setForm({
        foodType: "Veg",
        quantity: "",
        description: "",
        location: "",
        expiry: "2h",
        image: null,
        imagePreview: null,
      });
      setTimeout(() => navigate("/dashboard/search"), 900);
    } catch (err) {
      setError(err.message || "The donation could not be posted. Check Appwrite permissions and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "28px", background: T.bg, minHeight: "100vh" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <Motion.div
          animate={{ rotate: loading ? 360 : 0 }}
          transition={{ duration: 1.5, repeat: loading ? Infinity : 0, ease: "linear" }}
          style={{
            width: 40, height: 40, borderRadius: 10,
            background: T.accentSoft, display: "flex",
            alignItems: "center", justifyContent: "center", fontSize: 20,
          }}
        >🍱</Motion.div>
        <div>
          <h2 style={{
            fontFamily: "'DM Mono', monospace", fontSize: 24,
            color: T.text, margin: 0, letterSpacing: "-0.02em",
          }}>Donate Food</h2>
          <div style={{
            fontFamily: "'DM Mono', monospace", fontSize: 11,
            color: T.textMuted, letterSpacing: "0.06em",
          }}>Share surplus food with NGOs in need</div>
        </div>
      </div>

      {success && (
        <Motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          style={{
            background: `${T.accent}18`, border: `1px solid ${T.accent}33`,
            borderRadius: 14, padding: "16px 20px", marginBottom: 24,
            display: "flex", alignItems: "center", gap: 12,
          }}
        >
          <div style={{ fontSize: 24 }}>{T.accent === "#22c55e" ? "✅" : "🎉"}</div>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, color: T.accent, fontFamily: "'DM Mono', monospace" }}>
              Donation submitted successfully!
            </h3>
            <p style={{ margin: "4px 0 0", fontSize: 12, color: T.text }}>
              Your food listing is now live and visible to nearby NGOs.
            </p>
          </div>
        </Motion.div>
      )}

      {error && (
        <div role="alert" style={{ background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.25)", color: "#ef4444", borderRadius: 14, padding: "14px 18px", marginBottom: 20, fontSize: 13 }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ maxWidth: 500, margin: "0 auto" }}>
        <div style={{ background: T.bgCard, borderRadius: 18, padding: "24px", marginBottom: 20, border: `1px solid ${T.border}` }}>
          <h3 style={{
            fontFamily: "'DM Mono', monospace", fontSize: 16,
            color: T.text, margin: "0 0 16px 0",
          }}>Food Details</h3>

          <div style={{ marginBottom: 16 }}>
            <label style={{
              display: "block", fontFamily: "'DM Mono', monospace",
              fontSize: 11, color: T.textMuted, letterSpacing: "0.08em",
              marginBottom: 6, textTransform: "uppercase",
            }}>Food Type</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["Veg", "Non-Veg", "Vegan", "Mixed"].map((type) => (
                <Motion.button
                  key={type}
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setForm(f => ({ ...f, foodType: type }))}
                  style={{
                    padding: "8px 12px", borderRadius: 8, border: `1px solid ${form.foodType === type ? T.accent : T.border}`,
                    background: form.foodType === type ? T.accentSoft : T.bgInput,
                    color: form.foodType === type ? T.accent : T.textMuted,
                    fontFamily: "'DM Mono', monospace", fontSize: 12,
                    cursor: "pointer", fontWeight: form.foodType === type ? 700 : 400,
                  }}
                >
                  {type}
                </Motion.button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{
              display: "block", fontFamily: "'DM Mono', monospace",
              fontSize: 11, color: T.textMuted, letterSpacing: "0.08em",
              marginBottom: 6, textTransform: "uppercase",
            }}>Quantity (meals)</label>
            <input
              type="number"
              min="1"
              value={form.quantity}
              onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))}
              placeholder="e.g. 45"
              style={{
                width: "100%", padding: "10px 14px", borderRadius: 10,
                border: `1px solid ${T.border}`, background: T.bgInput,
                color: T.text, fontFamily: "'DM Mono', monospace",
                fontSize: 13, outline: "none", boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{
              display: "block", fontFamily: "'DM Mono', monospace",
              fontSize: 11, color: T.textMuted, letterSpacing: "0.08em",
              marginBottom: 6, textTransform: "uppercase",
            }}>Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Brief description of the food items..."
              rows={3}
              style={{
                width: "100%", padding: "10px 14px", borderRadius: 10,
                border: `1px solid ${T.border}`, background: T.bgInput,
                color: T.text, fontFamily: "'DM Mono', monospace",
                fontSize: 13, outline: "none", boxSizing: "border-box",
                resize: "vertical",
              }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{
              display: "block", fontFamily: "'DM Mono', monospace",
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
                color: T.text, fontFamily: "'DM Mono', monospace",
                fontSize: 13, outline: "none", boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{
              display: "block", fontFamily: "'DM Mono', monospace",
              fontSize: 11, color: T.textMuted, letterSpacing: "0.08em",
              marginBottom: 6, textTransform: "uppercase",
            }}>Expires In</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["1h", "2h", "4h", "6h", "12h", "24h"].map((opt) => (
                <Motion.button
                  key={opt}
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setForm(f => ({ ...f, expiry: opt }))}
                  style={{
                    padding: "8px 12px", borderRadius: 8, border: `1px solid ${form.expiry === opt ? T.accent : T.border}`,
                    background: form.expiry === opt ? T.accentSoft : T.bgInput,
                    color: form.expiry === opt ? T.accent : T.textMuted,
                    fontFamily: "'DM Mono', monospace", fontSize: 12,
                    cursor: "pointer", fontWeight: form.expiry === opt ? 700 : 400,
                  }}
                >
                  {opt}
                </Motion.button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{
              display: "block", fontFamily: "'DM Mono', monospace",
              fontSize: 11, color: T.textMuted, letterSpacing: "0.08em",
              marginBottom: 6, textTransform: "uppercase",
            }}>Photo of Food</label>
            <div style={{ position: "relative" }}>
              <label
                htmlFor="food-image"
                style={{
                  display: "inline-block", padding: "14px 20px", borderRadius: 10,
                  background: T.accentSoft, color: T.accent,
                  fontFamily: "'DM Mono', monospace", fontSize: 12,
                  fontWeight: 600, cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                📎 Upload Image
              </label>
              <input
                id="food-image"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
              {form.imagePreview && (
                <div style={{ marginTop: 12, borderRadius: 10, overflow: "hidden", border: `1px solid ${T.border}` }}>
                  <img
                    src={form.imagePreview}
                    alt="Preview"
                    style={{ width: "100%", height: "auto", display: "block" }}
                  />
                </div>
              )}
              {!form.imagePreview && (
                <p style={{ marginTop: 8, fontSize: 11, color: T.textFaint, fontStyle: "italic" }}>
                  JPG or PNG recommended (max 5MB)
                </p>
              )}
            </div>
          </div>

          <Motion.button
            type="submit"
            whileHover={{ scale: 1.02, boxShadow: `0 8px 28px ${T.accentGlow}` }}
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            style={{
              width: "100%", padding: "14px 0", borderRadius: 12, border: "none",
              background: loading ? T.bgAlt : T.accent, color: loading ? T.textMuted : "#fff",
              fontFamily: "'DM Mono', monospace", fontSize: 14, fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.5 : 1,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}
          >
            {loading ? (
              <Motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>⚙️</Motion.span>
            ) : "📤"}&nbsp;{loading ? "Uploading..." : "Donate Food"}
          </Motion.button>
        </div>

        <div style={{ textAlign: "center", marginTop: 20 }}>
          <Link to="/dashboard" style={{ textDecoration: "none" }}>
            <Motion.span
              whileHover={{ x: 3 }}
              style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: T.accent, letterSpacing: "0.08em", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
            >
              ← Back to Dashboard
            </Motion.span>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default DonateFood;
