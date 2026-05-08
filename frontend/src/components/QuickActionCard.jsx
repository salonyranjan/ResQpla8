// QuickActionCard.jsx
import React from "react";
import { motion } from "framer-motion";

// Sub-component: BotanicalGrowth visualizing total meals as a growing tree
const BotanicalGrowth = ({ totalMeals }) => {
  // Normalize total meals to a reasonable range for visual scaling
  const maxMeals = 500; // arbitrary upper bound for full growth
  const clamped = Math.min(totalMeals, maxMeals);
  const heightRatio = clamped / maxMeals; // 0 to 1

  // Trunk height animation (0% to 100% of max height)
  const trunkHeight = 80 + heightRatio * 120; // pixels, base 80

  // Leaves count based on meals
  const leafCount = Math.round(5 + heightRatio * 15);

  // Generate leaf positions around trunk
  const leaves = [];
  for (let i = 0; i < leafCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 30 + Math.random() * 20;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius - trunkHeight / 2; // offset upward
    leaves.push({ x, y, key: i });
  }

  return (
    <svg width={180} height={200} viewBox="0 0 180 200" style={{ overflow: "visible" }}>
      {/* Trunk */}
      <motion.rect
        x={80}
        y={200 - trunkHeight}
        width={20}
        height={trunkHeight}
        fill="#8B5A2B"
        initial={{ height: 0 }}
        animate={{ height: trunkHeight }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
      {/* Leaves */}
      {leaves.map(l => (
        <motion.circle
          key={l.key}
          cx={80 + l.x}
          cy={200 - trunkHeight + l.y}
          r={4}
          fill="#22c55e"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1, 1, 1.05, 1] }}
          transition={{
            times: [0, 0.2, 0.2, 0.6, 1],
            duration: 4,
            repeat: Infinity,
            repeatDelay: 2,
            ease: "easeInOut",
          }}
          whileHover={{ scale: 1.3 }}
        />
      ))}
    </svg>
  );
};

// Main card component
const QuickActionCard = ({ stats, T, onQuickDonation, dailyTip, tipLoading }) => (
  <div
    style={{
      background: T.bgCard,
      borderRadius: 24,
      border: `1px solid ${T.border}`,
      padding: "2rem",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
      minHeight: "600px",
      position: "relative",
      overflow: "hidden",
    }}
  >
    {/* Faint background icon */}
    <div style={{
      position: "absolute",
      inset: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "10rem",
      color: T.text,
      opacity: 0.05,
      pointerEvents: "none",
      zIndex: -1,
    }}>🌿</div>

    <h3 style={{
      margin: 0,
      fontFamily: "Georgia, 'Times New Roman', serif",
      fontSize: 20,
      fontWeight: 700,
      color: T.text,
      marginBottom: "1rem",
      textAlign: "center",
    }}>Quick Action</h3>

    {/* Tree visualization */}
    <BotanicalGrowth totalMeals={stats?.totalMeals || 0} />

    {/* Donation button */}
    <motion.button
      whileHover={{ scale: 1.04, boxShadow: `0 10px 40px rgba(34,197,94,0.3)` }}
      whileTap={{ scale: 0.97 }}
      onClick={onQuickDonation}
      style={{
        padding: "16px 32px",
        borderRadius: 20,
        background: T.accent,
        border: "none",
        color: "#fff",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 13,
        fontWeight: 700,
        cursor: "pointer",
        letterSpacing: "0.04em",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "40px",
        marginTop: "20px",
      }}
    >
      Quick Donation →
    </motion.button>

    {/* AI Insight */}
    <div style={{ marginBottom: 28, width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 16 }}>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: T.textFaint, letterSpacing: "0.2em", marginBottom: 4, textTransform: "uppercase" }}>INSIGHT</div>
          <h2 style={{ margin: 0, fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 19, fontWeight: 700, color: T.text, letterSpacing: "-0.02em" }}>AI Insight</h2>
        </div>
        <motion.div
          onClick={async () => {
            // Users can re-trigger tip load via parent, but we expose same handler
            // Assuming parent passes a function to update tip; here we simply call tipLoading setter via prop if provided.
          }}
          style={{ cursor: "pointer", opacity: 0.4, fontSize: 18, marginLeft: 8 }}
          animate={tipLoading ? { rotate: 360 } : { rotate: 0 }}
          transition={tipLoading ? { repeat: Infinity, duration: 1, ease: "linear" } : {}}
        >↻</motion.div>
      </div>
      {tipLoading ? (
        <div style={{ color: T.textMuted, fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>
          Generating insight...
        </div>
      ) : (
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: T.text }}>
          {dailyTip || "[AI Insight placeholder]"}
        </p>
      )}
    </div>
  </div>
);

export default QuickActionCard;
