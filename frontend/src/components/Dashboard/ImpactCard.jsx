import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";
import { toPng } from "html-to-image";
import { getMonthlyStats, generateImpactStory } from "../../services/impactService";

/* ─────────────────────────────────────────────
   Animated number counter
───────────────────────────────────────────── */
function AnimatedNumber({ value, duration = 1.4 }) {
  const spring = useSpring(0, { stiffness: 60, damping: 18, duration });
  const display = useTransform(spring, (v) =>
    Math.round(v).toLocaleString()
  );
  useEffect(() => { spring.set(value); }, [value, spring]);
  return <motion.span>{display}</motion.span>;
}

/* ─────────────────────────────────────────────
   Floating particle
───────────────────────────────────────────── */
function Particle({ style }) {
  return (
    <motion.div
      style={{
        position: "absolute",
        borderRadius: "50%",
        background: "rgba(34,197,94,0.4)",
        pointerEvents: "none",
        ...style,
      }}
      initial={{ opacity: 0, y: 0 }}
      animate={{ opacity: [0, 0.7, 0.7, 0], y: [-4, -90] }}
      transition={{
        duration: style.duration ?? 5,
        delay: style.delay ?? 0,
        repeat: Infinity,
        ease: "easeOut",
      }}
    />
  );
}

/* ─────────────────────────────────────────────
   Stat card
───────────────────────────────────────────── */
function StatPill({ icon, value, unit, label, delay, theme }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20, delay }}
      whileHover={{ scale: 1.04, transition: { type: "spring", stiffness: 400, damping: 20 } }}
      style={{
        position: "relative",
        background: "rgba(34,197,94,0.05)",
        border: `1px solid rgba(34,197,94,0.12)`,
        borderRadius: 18,
        padding: "18px 12px 16px",
        textAlign: "center",
        overflow: "hidden",
        cursor: "default",
      }}
    >
      {/* inner glow */}
      <div style={{
        position: "absolute", bottom: -20, left: "50%", transform: "translateX(-50%)",
        width: 70, height: 50, borderRadius: "50%",
        background: `radial-gradient(ellipse, ${theme.accent}22 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />

      <div style={{ fontSize: 22, marginBottom: 10 }}>{icon}</div>

      <div style={{
        fontSize: 26, fontWeight: 700, color: theme.accent,
        fontVariantNumeric: "tabular-nums", lineHeight: 1,
        fontFamily: "'Space Mono', 'JetBrains Mono', monospace",
      }}>
        <AnimatedNumber value={value} />
        {unit && <span style={{ fontSize: 11, marginLeft: 2, color: theme.textMuted }}>{unit}</span>}
      </div>

      <div style={{
        fontSize: 8.5, color: "rgba(110,231,183,0.45)",
        letterSpacing: "0.1em", textTransform: "uppercase",
        marginTop: 6, fontFamily: "'Space Mono', monospace",
      }}>
        {label}
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Progress bar
───────────────────────────────────────────── */
function GoalBar({ pct, theme }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}
      style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}
    >
      <span style={{
        fontSize: 9, color: "rgba(110,231,183,0.5)",
        letterSpacing: "0.1em", textTransform: "uppercase",
        fontFamily: "'Space Mono', monospace", whiteSpace: "nowrap",
      }}>
        Monthly goal
      </span>
      <div style={{
        flex: 1, height: 4, borderRadius: 100,
        background: "rgba(34,197,94,0.1)", overflow: "hidden",
      }}>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.8, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          style={{
            height: "100%", borderRadius: 100,
            background: `linear-gradient(90deg, ${theme.accent}, #14b8a6)`,
            transformOrigin: "left",
            width: `${Math.min(pct, 100)}%`,
          }}
        />
      </div>
      <span style={{
        fontSize: 10, color: theme.accent, fontWeight: 700,
        fontFamily: "'Space Mono', monospace",
      }}>
        {pct}%
      </span>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Main ImpactCard
───────────────────────────────────────────── */
export default function ImpactCard({ userId, T, onQuickDonation }) {
  const cardRef = useRef(null);
  const [shareState, setShareState] = useState("idle"); // idle | downloading | done

  const theme = T || {
    accent: "#22c55e",
    accentGlow: "rgba(34,197,94,0.25)",
    text: "#ecfdf5",
    textMuted: "#6ee7b7",
    bgCard: "rgba(5,18,9,0.97)",
    border: "rgba(34,197,94,0.12)",
    borderMed: "rgba(34,197,94,0.18)",
  };

  const [stats, setStats] = useState({ totalWeight: 0, totalMeals: 0, estimatedCO2: 0 });
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [goalPct] = useState(74); // derive from stats if available in your impactService

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

  const handleShare = useCallback(async () => {
    if (!cardRef.current || shareState !== "idle") return;
    setShareState("downloading");
    try {
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 3 });
      const link = document.createElement("a");
      link.download = "resqplate-impact.png";
      link.href = dataUrl;
      link.click();
      setShareState("done");
      setTimeout(() => setShareState("idle"), 2500);
    } catch (err) {
      console.error("Share failed:", err);
      setShareState("idle");
    }
  }, [shareState]);

  /* Particle data */
  const particles = Array.from({ length: 10 }, (_, i) => ({
    width: Math.random() * 4 + 2,
    height: Math.random() * 4 + 2,
    left: `${Math.random() * 95}%`,
    bottom: Math.random() * 40,
    duration: 4 + Math.random() * 5,
    delay: Math.random() * 5,
  }));

  /* ── Loading ── */
  if (loading) {
    return (
      <div style={{
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: 16, padding: "3rem",
        fontFamily: "'Space Mono', 'JetBrains Mono', monospace",
      }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
          style={{
            width: 36, height: 36,
            border: `2.5px solid ${theme.accent}30`,
            borderTopColor: theme.accent,
            borderRadius: "50%",
          }}
        />
        <motion.span
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          style={{ fontSize: 11, color: theme.textMuted, letterSpacing: "0.06em" }}
        >
          Growing your impact story…
        </motion.span>
      </div>
    );
  }

  /* ── Error ── */
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          padding: "16px 20px",
          background: "rgba(239,68,68,0.06)",
          border: "1px solid rgba(239,68,68,0.15)",
          borderRadius: 16,
          color: "#ef4444",
          fontFamily: "'Space Mono', monospace",
          fontSize: 12,
        }}
      >
        ⚠ {error}
      </motion.div>
    );
  }

  const now = new Date();
  const monthLabel = now.toLocaleString("default", { month: "long", year: "numeric" });

  /* ── Main card ── */
  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 28, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 160, damping: 22 }}
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 480,
        borderRadius: 28,
        overflow: "hidden",
        background: `linear-gradient(145deg, rgba(5,18,9,0.97) 0%, rgba(3,14,7,0.98) 55%, rgba(2,10,5,0.99) 100%)`,
        border: `1px solid ${theme.border}`,
        boxShadow: `0 0 0 1px rgba(34,197,94,0.05), 0 40px 90px rgba(0,0,0,0.65), 0 0 140px rgba(34,197,94,0.05)`,
        fontFamily: "'Space Mono', 'JetBrains Mono', monospace",
        color: theme.text,
      }}
    >
      {/* Scan line grid texture */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 32px, rgba(34,197,94,0.022) 32px, rgba(34,197,94,0.022) 33px)",
      }} />

      {/* Top radial glow */}
      <div style={{
        position: "absolute", top: -90, left: "50%", transform: "translateX(-50%)",
        width: 340, height: 220, borderRadius: "50%", pointerEvents: "none",
        background: "radial-gradient(ellipse, rgba(34,197,94,0.16) 0%, transparent 68%)",
        zIndex: 0,
      }} />

      {/* Floating particles */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
        {particles.map((p, i) => <Particle key={i} style={p} />)}
      </div>

      {/* Month chip (top-right) */}
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          position: "absolute", top: 28, right: 32, zIndex: 2,
          background: "rgba(34,197,94,0.07)",
          border: "1px solid rgba(34,197,94,0.14)",
          borderRadius: 9, padding: "5px 11px",
          fontSize: 9, letterSpacing: "0.1em",
          color: "rgba(110,231,183,0.6)", textTransform: "uppercase",
        }}
      >
        {monthLabel}
      </motion.div>

      {/* Card body */}
      <div style={{ position: "relative", zIndex: 1, padding: "36px 36px 32px" }}>

        {/* Live badge */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            background: "rgba(34,197,94,0.08)",
            border: "1px solid rgba(34,197,94,0.2)",
            borderRadius: 100, padding: "5px 14px 5px 10px",
            marginBottom: 22,
          }}
        >
          <motion.div
            animate={{ boxShadow: ["0 0 0 0 rgba(34,197,94,0.5)", "0 0 0 5px rgba(34,197,94,0)"] }}
            transition={{ repeat: Infinity, duration: 2 }}
            style={{ width: 7, height: 7, borderRadius: "50%", background: theme.accent }}
          />
          <span style={{ fontSize: 10, letterSpacing: "0.12em", color: "#4ade80", textTransform: "uppercase" }}>
            Live Impact
          </span>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, type: "spring", stiffness: 200, damping: 22 }}
        >
          <h2 style={{
            margin: "0 0 6px",
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 30, fontWeight: 700, lineHeight: 1.18,
            color: theme.text, letterSpacing: "-0.02em",
          }}>
            Your Impact<br />
            <em style={{ fontStyle: "italic" }}>Story</em>
          </h2>
          <p style={{
            margin: "0 0 28px", fontSize: 11,
            color: "rgba(110,231,183,0.5)", letterSpacing: "0.05em",
          }}>
            Monthly environmental contribution · ResQplate
          </p>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.25, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{
            height: 1, marginBottom: 28,
            background: "linear-gradient(90deg, transparent, rgba(34,197,94,0.28) 30%, rgba(34,197,94,0.28) 70%, transparent)",
            transformOrigin: "left",
          }}
        />

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 28 }}>
          <StatPill icon="🍽" value={stats.totalMeals} label="Meals Rescued" delay={0.3} theme={theme} />
          <StatPill icon="⚖" value={stats.totalWeight} unit="kg" label="Weight Saved" delay={0.38} theme={theme} />
          <StatPill icon="🌿" value={stats.estimatedCO2} unit="kg" label="CO₂ Offset" delay={0.46} theme={theme} />
        </div>

        {/* AI story */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.54, type: "spring", stiffness: 180, damping: 22 }}
          style={{ position: "relative", marginBottom: 28 }}
        >
          {/* Left accent bar */}
          <div style={{
            position: "absolute", left: 0, top: 0, bottom: 0, width: 3, borderRadius: 8,
            background: `linear-gradient(180deg, ${theme.accent}, #14b8a6)`,
          }} />

          <blockquote style={{
            margin: 0, padding: "18px 18px 18px 24px",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(34,197,94,0.08)",
            borderRadius: 16,
            fontFamily: "'Playfair Display', Georgia, serif",
            fontStyle: "italic", fontSize: 14, lineHeight: 1.78,
            color: "rgba(236,253,245,0.85)",
          }}>
            <span style={{
              fontSize: 44, lineHeight: 1, color: "rgba(34,197,94,0.14)",
              fontFamily: "Georgia, serif", float: "left",
              marginRight: 8, marginTop: -4, userSelect: "none",
            }}>
              "
            </span>
            {story || "Your botanical legacy is being written…"}
          </blockquote>
        </motion.div>

        {/* Monthly goal bar */}
        <GoalBar pct={goalPct} theme={theme} />

        {/* Footer actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.64 }}
          style={{ display: "flex", alignItems: "center", gap: 12 }}
        >
          {/* Quick Donation button */}
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: "0 8px 28px rgba(34,197,94,0.4)" }}
            whileTap={{ scale: 0.96 }}
            onClick={onQuickDonation}
            style={{
              flex: 1, padding: "13px 18px",
              borderRadius: 14, border: "none", cursor: "pointer",
              fontFamily: "'Space Mono', monospace", fontSize: 11, fontWeight: 700,
              letterSpacing: "0.06em",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              background: `linear-gradient(135deg, ${theme.accent} 0%, #14b8a6 100%)`,
              color: "#052e16",
              boxShadow: "0 4px 20px rgba(34,197,94,0.28)",
              transition: "background 0.3s",
            }}
          >
            <span>📸 Quick Donation</span>
          </motion.button>
          {/* Primary share button */}
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: "0 10px 36px rgba(34,197,94,0.45)" }}
            whileTap={{ scale: 0.96 }}
            onClick={handleShare}
            style={{
              flex: 1, padding: "13px 18px",
              borderRadius: 14, border: "none", cursor: "pointer",
              fontFamily: "'Space Mono', monospace", fontSize: 11, fontWeight: 700,
              letterSpacing: "0.06em",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              background: shareState === "done"
                ? "linear-gradient(135deg, #16a34a, #0f766e)"
                : `linear-gradient(135deg, ${theme.accent} 0%, #14b8a6 100%)`,
              color: "#052e16",
              boxShadow: "0 4px 20px rgba(34,197,94,0.28)",
              transition: "background 0.3s",
            }}
          >
            <AnimatePresence mode="wait">
              {shareState === "idle" && (
                <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  📸 Share Your Growth
                </motion.span>
              )}
              {shareState === "downloading" && (
                <motion.span key="dl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                    style={{ display: "inline-block" }}>⟳</motion.span>
                  Downloading…
                </motion.span>
              )}
              {shareState === "done" && (
                <motion.span key="done" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  ✓ Saved!
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Refresh icon button */}
          <motion.button
            whileHover={{ scale: 1.07, background: "rgba(34,197,94,0.12)" }}
            whileTap={{ scale: 0.92, rotate: -30 }}
            style={{
              width: 48, height: 48, borderRadius: 14, border: "1px solid rgba(34,197,94,0.18)",
              background: "rgba(34,197,94,0.07)", color: "#4ade80",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", fontSize: 18,
            }}
            aria-label="Refresh stats"
          >
            ↺
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}