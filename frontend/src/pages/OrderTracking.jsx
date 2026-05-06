import { useParams, Link, useNavigate, useOutletContext } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineArrowLeft,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineTruck,
  HiOutlineShoppingBag,
  HiOutlineFire,
  HiOutlinePhone,
} from "react-icons/hi";
import { useOrderTracking } from "../hooks/useOrderTracking";

export default function OrderTracking() {
  const ctx = useOutletContext?.() ?? {};
  const dark = ctx?.dark ?? true;
  const T = dark
    ? {
        bg: "#080e0a", bgAlt: "#0d1710", bgCard: "#111c14", border: "rgba(34,197,94,0.09)",
        borderMed: "rgba(34,197,94,0.18)", text: "#ecfdf5", textMuted: "#6ee7b7",
        textFaint: "rgba(110,231,183,0.35)", accent: "#22c55e", accentSoft: "rgba(34,197,94,0.09)",
        amber: "#f59e0b", amberSoft: "rgba(245,158,11,0.1)", teal: "#14b8a6",
        shadow: "0 4px 24px rgba(0,0,0,0.4)", nav: "rgba(8,14,10,0.97)",
      }
    : {
        bg: "#f0f7f2", bgAlt: "#e8f2eb", bgCard: "#ffffff", border: "rgba(26,74,46,0.09)",
        borderMed: "rgba(26,74,46,0.18)", text: "#0d1f12", textMuted: "#3a6647",
        textFaint: "rgba(58,102,71,0.4)", accent: "#16a34a", accentSoft: "rgba(22,163,74,0.09)",
        amber: "#d97706", amberSoft: "rgba(217,119,6,0.08)", teal: "#0d9488",
        shadow: "0 4px 24px rgba(0,0,0,0.06)", nav: "rgba(240,247,242,0.97)",
      };

  const { orderId } = useParams();
  const navigate = useNavigate();
  const { order, currentStep, eta, progressPct, STATUS_STEPS } = useOrderTracking(orderId);

  // Map icons to steps (since hook doesn't include icon components)
  const STEP_ICONS = {
    order_placed: HiOutlineShoppingBag,
    confirmed: HiOutlineCheckCircle,
    preaping: HiOutlineFire,
    out_for_delivery: HiOutlineTruck,
    delivered: HiOutlineCheckCircle,
  };

  return (
    <div style={{ background: T.bg, minHeight: "100vh", paddingBottom: 32 }}>
      {/* Header */}
      <div style={{
        position: "sticky", top: 0, background: T.nav, backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${T.border}`, padding: "14px 16px",
        display: "flex", alignItems: "center", gap: 12, zIndex: 40,
      }}>
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)}
          style={{ width: 38, height: 38, borderRadius: 12, background: T.bgCard, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <HiOutlineArrowLeft style={{ fontSize: 18, color: T.textMuted }} />
        </motion.button>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 16, fontWeight: 800, color: T.text }}>Tracking Order</h1>
          <p style={{ fontSize: 11, color: T.accent, fontFamily: "monospace", fontWeight: 700 }}>{orderId}</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, background: T.accentSoft, border: `1px solid ${T.borderMed}`, borderRadius: 100, padding: "5px 12px" }}>
          <motion.div animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1.2, repeat: Infinity }}
            style={{ width: 5, height: 5, borderRadius: "50%", background: T.accent }} />
          <span style={{ fontFamily: "monospace", fontSize: 9, color: T.accent, letterSpacing: "0.1em" }}>LIVE</span>
        </div>
      </div>

      {/* ETA Hero */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          margin: "16px 16px 0",
          background: currentStep === STATUS_STEPS.length - 1
            ? `linear-gradient(135deg, ${dark ? "#1a3d1e" : "#dcfce7"}, ${dark ? "#0f2912" : "#f0fdf4"})`
            : `linear-gradient(135deg, ${dark ? "#1a2c3d" : "#dbeafe"}, ${dark ? "#0f1f2d" : "#eff6ff"})`,
          border: `1px solid ${currentStep === STATUS_STEPS.length - 1 ? T.borderMed : "rgba(59,130,246,0.2)"}`,
          borderRadius: 22,
          padding: "22px 20px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: dark ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.3)" }} />
        <div style={{ position: "relative" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
            >
              <div style={{ fontSize: 48, marginBottom: 10 }}>
                {currentStep === STATUS_STEPS.length - 1 ? "🎉" : currentStep >= 3 ? "🚴" : currentStep >= 2 ? "🍳" : "📋"}
              </div>
              <p style={{ fontSize: 22, fontWeight: 900, color: T.text, letterSpacing: "-0.03em" }}>
                {currentStep === STATUS_STEPS.length - 1 ? "Delivered!" : `${eta} min away`}
              </p>
              <p style={{ fontSize: 13, color: T.textMuted, marginTop: 6 }}>
                {STATUS_STEPS[currentStep].sub}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Progress bar */}
      <div style={{ margin: "16px 16px 0", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 20, padding: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <p style={{ fontSize: 12, fontFamily: "monospace", color: T.textFaint, letterSpacing: "0.08em" }}>PROGRESS</p>
          <p style={{ fontSize: 12, fontFamily: "monospace", color: T.accent, fontWeight: 700 }}>{Math.round(progressPct)}%</p>
        </div>
        <div style={{ height: 8, background: T.bgAlt, borderRadius: 100, overflow: "hidden" }}>
          <motion.div
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{ height: "100%", background: `linear-gradient(90deg, ${T.accent}, ${T.teal})`, borderRadius: 100 }}
          />
        </div>
      </div>

      {/* Step tracker */}
      <div style={{ margin: "16px 16px 0", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 20, padding: 20 }}>
        <p style={{ fontSize: 11, fontFamily: "monospace", color: T.textFaint, letterSpacing: "0.08em", marginBottom: 16 }}>DELIVERY STEPS</p>
        <div style={{ position: "relative" }}>
          {/* Vertical line */}
          <div style={{
            position: "absolute", left: 19, top: 20, bottom: 20, width: 2,
            background: T.border, borderRadius: 1,
          }} />
          <motion.div
            animate={{ height: `${progressPct}%` }}
            transition={{ duration: 0.8 }}
            style={{
              position: "absolute", left: 19, top: 20, width: 2,
              background: `linear-gradient(180deg, ${T.accent}, ${T.teal})`,
              borderRadius: 1,
            }}
          />

          {STATUS_STEPS.map((step, idx) => {
            const Icon = STEP_ICONS[step.id] || HiOutlineShoppingBag;
            const isCompleted = idx < currentStep;
            const isCurrent = idx === currentStep;
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: idx < STATUS_STEPS.length - 1 ? 20 : 0 }}
              >
                <motion.div
                  animate={isCurrent ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 1.5, repeat: isCurrent ? Infinity : 0 }}
                  style={{
                    width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                    background: isCompleted ? T.accent : isCurrent ? T.accentSoft : T.bgAlt,
                    border: `2px solid ${isCompleted || isCurrent ? T.accent : T.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    zIndex: 1, position: "relative",
                  }}
                >
                  <Icon style={{ fontSize: 18, color: isCompleted ? "#fff" : isCurrent ? T.accent : T.textFaint }} />
                </motion.div>

                <div style={{ paddingTop: 8 }}>
                  <p style={{ fontWeight: isCompleted || isCurrent ? 700 : 400, fontSize: 14, color: isCompleted ? T.accent : isCurrent ? T.text : T.textFaint }}>
                    {step.label}
                  </p>
                  <p style={{ fontSize: 11.5, color: T.textFaint, marginTop: 2 }}>{step.sub}</p>
                  {isCurrent && (
                    <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
                      style={{ display: "inline-flex", alignItems: "center", gap: 4, marginTop: 6, background: T.accentSoft, borderRadius: 100, padding: "2px 10px", border: `1px solid ${T.borderMed}` }}>
                      <div style={{ width: 4, height: 4, borderRadius: "50%", background: T.accent }} />
                      <span style={{ fontSize: 9, color: T.accent, fontFamily: "monospace", fontWeight: 700 }}>IN PROGRESS</span>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Delivery partner */}
      <div style={{ margin: "16px 16px 0", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 20, padding: 16 }}>
        <p style={{ fontSize: 11, fontFamily: "monospace", color: T.textFaint, letterSpacing: "0.08em", marginBottom: 14 }}>DELIVERY PARTNER</p>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 16,
            background: `linear-gradient(135deg, ${T.accent}, ${T.teal})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, flexShrink: 0,
          }}>
            🚴
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 700, fontSize: 14, color: T.text }}>Ramesh Kumar</p>
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
              <span style={{ fontSize: 11, color: T.amber }}>★★★★★</span>
              <span style={{ fontSize: 11, color: T.textFaint, fontFamily: "monospace" }}>4.9 · 248 deliveries</span>
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.92 }}
            style={{
              width: 42, height: 42, borderRadius: 13,
              background: T.accentSoft, border: `1px solid ${T.borderMed}`,
              display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
            }}
          >
            <HiOutlinePhone style={{ fontSize: 18, color: T.accent }} />
          </motion.button>
        </div>
      </div>

      {/* Order summary */}
      {order?.items?.length > 0 && (
        <div style={{ margin: "16px 16px 0", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 20, padding: 16 }}>
          <p style={{ fontSize: 11, fontFamily: "monospace", color: T.textFaint, letterSpacing: "0.08em", marginBottom: 14 }}>ITEMS</p>
          {order.items.map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < order.items.length - 1 ? `1px solid ${T.border}` : "none" }}>
              <img src={item.image} alt={item.name} style={{ width: 40, height: 40, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{item.name}</p>
                <p style={{ fontSize: 11, color: T.textFaint }}>{item.quantity}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delivery address */}
      <div style={{ margin: "16px 16px 0", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 20, padding: 16 }}>
        <p style={{ fontSize: 11, fontFamily: "monospace", color: T.textFaint, letterSpacing: "0.08em", marginBottom: 10 }}>DELIVERY TO</p>
        <p style={{ fontSize: 13.5, color: T.textMuted }}>{order?.deliveryAddress || "Your saved address"}</p>
      </div>
    </div>
  );
}
