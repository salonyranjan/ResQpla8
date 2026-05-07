import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { toPng } from "html-to-image";
import { getMonthlyStats, generateImpactStory } from "../../services/impactService";

/**
 * Glassmorphic Impact Card with AI‑generated story.
 * - Fetches monthly stats for the logged‑in donor (via userId prop).
 * - Uses Gemini 1.5 Flash to craft a poetic impact story.
 * - “Share Your Growth” downloads the card as PNG via html‑to‑image.
 *
 * Props:
 *   userId {string}   – Appwrite user $id (required)
 *   T      {object}   – theme object from DashboardLayout outlet context (optional)
 */
export default function ImpactCard({ userId, T }) {
  const cardRef = useRef(null);

  // Fallback theme (matches DashboardHome fallbackTheme)
  const theme = T || {
    accent: "#22c55e",
    accentGlow: "rgba(34,197,94,0.25)",
    text: "#ecfdf5",
    textMuted: "#6ee7b7",
    bgCard: "rgba(13,22,15,0.85)",
    border: "rgba(34,197,94,0.12)",
    borderMed: "rgba(34,197,94,0.15)",
  };

  const [stats, setStats] = useState({
    totalWeight: 0,
    totalMeals: 0,
    estimatedCO2: 0,
  });
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch stats & generate story once we have a userId
  useEffect(() => {
    if (!userId) return;

    let cancelled = false;

    async function load() {
      try {
        const data = await getMonthlyStats(userId);
        if (!cancelled) setStats(data);

        const aiStory = await generateImpactStory(data);
        if (!cancelled) setStory(aiStory);
      } catch (err) {
        console.error("ImpactCard error:", err);
        if (!cancelled) setError("Could not load impact data.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [userId]);

  const handleShare = async () => {
    const node = cardRef.current;
    if (!node) return;
    try {
      const dataUrl = await toPng(node, { cacheBust: true });
      const link = document.createElement("a");
      link.download = "resqplate-impact.png";
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  /* ── Loading state ────────────────────────────────────────── */
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 8,
          padding: "2rem",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 12,
          color: theme.textMuted,
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          style={{
            width: 32,
            height: 32,
            border: `3px solid ${theme.accent}33`,
            borderTopColor: theme.accent,
            borderRadius: "50%",
          }}
        />
        Growing your impact story…
      </motion.div>
    );
  }

  /* ── Error state ─────────────────────────────────────────── */
  if (error) {
    return (
      <div style={{
        padding: "1rem",
        background: "rgba(239,68,68,0.08)",
        borderRadius: 12,
        color: "#ef4444",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 12,
      }}>
        ⚠ {error}
      </div>
    );
  }

  /* ── Main card ──────────────────────────────────────────── */
  return (
    <motion.div
      ref={cardRef}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      style={{
        // Glassmorphic dark‑green gradient
        background: `linear-gradient(135deg, ${theme.bgCard || "rgba(13,31,18,0.55)"} 0%, rgba(10,26,15,0.55) 60%, rgba(8,18,8,0.55) 100%)`,
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderRadius: 24,
        padding: "28px 32px",
        border: `1px solid ${theme.border}`,
        boxShadow: `0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px ${theme.borderMed || theme.border}`,
        maxWidth: 480,
        color: theme.text,
        fontFamily: "'JetBrains Mono', monospace",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative glow */}
      <div style={{
        position: "absolute",
        top: -40,
        right: -40,
        width: 160,
        height: 160,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${theme.accent}12 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />

      {/* Header */}
      <h3 style={{
        margin: "0 0 20px",
        fontFamily: "Georgia, serif",
        fontSize: 22,
        fontWeight: 700,
        color: theme.accent,
        letterSpacing: "-0.02em",
        position: "relative",
      }}>
        🌿 Your Impact Story
      </h3>

      {/* Stats grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 12,
        marginBottom: 24,
        position: "relative",
      }}>
        {[
          { label: "Meals Rescued", value: stats.totalMeals, unit: "" },
          { label: "Weight Saved", value: stats.totalWeight, unit: "kg" },
          { label: "CO₂ Offset", value: stats.estimatedCO2, unit: "kg" },
        ].map((s) => (
          <div key={s.label} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: theme.accent }}>
              {s.value.toLocaleString()}
              {s.unit && <span style={{ fontSize: 12, marginLeft: 2 }}>{s.unit}</span>}
            </div>
            <div style={{ fontSize: 9, color: theme.textMuted, marginTop: 4, letterSpacing: "0.04em" }}>
              {s.label.toUpperCase()}
            </div>
          </div>
        ))}
      </div>

      {/* AI‑generated story */}
      <blockquote style={{
        margin: "0 0 24px",
        padding: "16px",
        background: "rgba(255,255,255,0.04)",
        borderRadius: 12,
        borderLeft: `3px solid ${theme.accent}`,
        fontStyle: "italic",
        fontSize: 14,
        lineHeight: 1.6,
        color: theme.text,
        position: "relative",
      }}>
        {story || "Your botanical legacy is being written…"}
      </blockquote>

      {/* Share button */}
      <div style={{ textAlign: "center" }}>
        <motion.button
          whileHover={{ scale: 1.03, boxShadow: `0 8px 30px ${theme.accentGlow}` }}
          whileTap={{ scale: 0.97 }}
          onClick={handleShare}
          style={{
            padding: "11px 22px",
            borderRadius: 14,
            background: `linear-gradient(135deg, ${theme.accent}, #14b8a6)`,
            border: "none",
            color: "#fff",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
            letterSpacing: "0.04em",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          📸 Share Your Growth
        </motion.button>
      </div>
    </motion.div>
  );
}
