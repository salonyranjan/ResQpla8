import { useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import {
  HiOutlineArrowLeft,
  HiOutlineCheckCircle,
  HiOutlineLocationMarker,
  HiOutlineCreditCard,
  HiOutlineShieldCheck,
  HiOutlineClock,
} from "react-icons/hi";

export default function CheckoutPage() {
  const ctx = useOutletContext() || {};
  const dark = ctx?.dark ?? true;
  const T = dark
    ? {
        bg: "#080e0a", bgAlt: "#0d1710", bgCard: "#111c14", border: "rgba(34,197,94,0.09)",
        borderMed: "rgba(34,197,94,0.18)", text: "#ecfdf5", textMuted: "#6ee7b7",
        textFaint: "rgba(110,231,183,0.35)", accent: "#22c55e", accentSoft: "rgba(34,197,94,0.09)",
        amber: "#f59e0b", teal: "#14b8a6", shadow: "0 4px 24px rgba(0,0,0,0.4)",
        nav: "rgba(8,14,10,0.97)", bgInput: "#0d1710",
      }
    : {
        bg: "#f0f7f2", bgAlt: "#e8f2eb", bgCard: "#ffffff", border: "rgba(26,74,46,0.09)",
        borderMed: "rgba(26,74,46,0.18)", text: "#0d1f12", textMuted: "#3a6647",
        textFaint: "rgba(58,102,71,0.4)", accent: "#16a34a", accentSoft: "rgba(22,163,74,0.09)",
        amber: "#d97706", teal: "#0d9488", shadow: "0 4px 24px rgba(0,0,0,0.06)",
        nav: "rgba(240,247,242,0.97)", bgInput: "#f8fdf9",
      };

  const { items, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState({ street: "", city: "", state: "", zip: "" });
  const [paymentMethod, setPaymentMethod] = useState("free");
  const [orderId, setOrderId] = useState("");
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const handlePlaceOrder = async () => {
    const id = `ORD-${Date.now().toString().slice(-6)}`;
    setOrderId(id);

    // CSBS Pro-Tip: Save order to Appwrite
    // Replace these with your actual Appwrite Database ID and Collection ID
    // const DATABASE_ID = "your_database_id";
    // const ORDERS_COLLECTION_ID = "orders";
    // await databases.createDocument(DATABASE_ID, ORDERS_COLLECTION_ID, id, {
    //   userId: user?.$id,
    //   items: JSON.stringify(items),
    //   status: "pending_pickup",
    //   address: address.street
    // });

    clearCart();
    setStep(3);
  };

  const inputStyle = {
    width: "100%",
    padding: "13px 16px",
    background: T.bgInput,
    border: `1px solid ${T.border}`,
    borderRadius: 14,
    fontSize: 13.5,
    color: T.text,
    outline: "none",
    fontFamily: "inherit",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  };

  const steps = ["Address", "Payment", "Confirm"];

  if (items.length === 0 && step !== 3) {
    return (
      <div style={{ minHeight: "100vh", background: T.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32 }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>🛒</div>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: T.text, marginBottom: 16 }}>Your cart is empty</h2>
        <Link to="/dashboard/search">
          <button style={{ background: T.accent, color: "#fff", border: "none", borderRadius: 16, padding: "14px 28px", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
            Browse Food
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ background: T.bg, minHeight: "100vh", paddingBottom: 100 }}>
      {/* Header */}
      <div style={{
        position: "sticky", top: 0, background: T.nav, backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${T.border}`, padding: "14px 16px",
        display: "flex", alignItems: "center", gap: 12, zIndex: 40,
      }}>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => step > 1 && step < 3 ? setStep(step - 1) : navigate(-1)}
          style={{ width: 38, height: 38, borderRadius: 12, background: T.bgCard, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
        >
          <HiOutlineArrowLeft style={{ fontSize: 18, color: T.textMuted }} />
        </motion.button>
        <h1 style={{ fontSize: 17, fontWeight: 800, color: T.text }}>
          {step === 1 ? "Delivery Address" : step === 2 ? "Payment" : "Order Confirmed!"}
        </h1>
      </div>

      {/* Stepper */}
      {step < 3 && (
        <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "center", gap: 0 }}>
          {steps.map((label, idx) => (
            <div key={label} style={{ display: "flex", alignItems: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <motion.div
                  animate={{ scale: step === idx + 1 ? 1.1 : 1 }}
                  style={{
                    width: 32, height: 32, borderRadius: "50%",
                    background: step > idx + 1 ? T.accent : step === idx + 1 ? T.accentSoft : T.bgAlt,
                    border: `2px solid ${step >= idx + 1 ? T.accent : T.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, fontWeight: 800, fontFamily: "monospace",
                    color: step > idx + 1 ? "#fff" : step === idx + 1 ? T.accent : T.textFaint,
                  }}
                >
                  {step > idx + 1 ? <HiOutlineCheckCircle style={{ fontSize: 16 }} /> : idx + 1}
                </motion.div>
                <span style={{ fontSize: 9, color: step >= idx + 1 ? T.accent : T.textFaint, fontFamily: "monospace", fontWeight: step === idx + 1 ? 700 : 400 }}>
                  {label}
                </span>
              </div>
              {idx < 2 && (
                <div style={{ width: 56, height: 2, background: step > idx + 1 ? T.accent : T.border, margin: "0 6px", marginBottom: 18, transition: "background 0.3s" }} />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24, rotate: -5, transition: { duration: 0.2 } }}
          transition={{ duration: 0.25 }}
          style={{ padding: "0 16px" }}
        >
          {/* Step 1: Address */}
          {step === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 20, padding: 18 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <HiOutlineLocationMarker style={{ color: T.accent, fontSize: 20 }} />
                  <h3 style={{ fontWeight: 700, fontSize: 15, color: T.text }}>Delivery Address</h3>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <input
                    placeholder="Street Address"
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = T.accent)}
                    onBlur={(e) => (e.target.style.borderColor = T.border)}
                  />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <input placeholder="City" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} style={inputStyle}
                      onFocus={(e) => (e.target.style.borderColor = T.accent)} onBlur={(e) => (e.target.style.borderColor = T.border)} />
                    <input placeholder="State" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} style={inputStyle}
                      onFocus={(e) => (e.target.style.borderColor = T.accent)} onBlur={(e) => (e.target.style.borderColor = T.border)} />
                  </div>
                  <input placeholder="ZIP Code" value={address.zip} onChange={(e) => setAddress({ ...address, zip: e.target.value })} style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = T.accent)} onBlur={(e) => (e.target.style.borderColor = T.border)} />
                </div>
              </div>

              {/* Quick select saved addresses */}
              <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 20, padding: 16 }}>
                <p style={{ fontSize: 11, color: T.textFaint, fontFamily: "monospace", letterSpacing: "0.08em", marginBottom: 12 }}>SAVED LOCATIONS</p>
                {["🏠 Home — 42 MG Road, Delhi", "🏢 Work — Sector 5, Noida"].map((loc, i) => (
                  <button key={i} style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 12px", background: T.bgAlt, border: `1px solid ${T.border}`, borderRadius: 12, fontSize: 13, color: T.textMuted, cursor: "pointer", fontFamily: "inherit", marginBottom: i === 0 ? 8 : 0 }}>
                    {loc}
                  </button>
                ))}
              </div>

              <motion.button whileTap={{ scale: 0.98 }} onClick={() => setStep(2)}
                style={{ background: `linear-gradient(135deg, ${T.accent}, #16a34a)`, color: "#fff", border: "none", borderRadius: 18, padding: "16px", fontWeight: 800, fontSize: 15, cursor: "pointer", fontFamily: "inherit", boxShadow: `0 8px 32px ${T.accent}44` }}>
                Continue to Payment →
              </motion.button>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 20, padding: 18 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <HiOutlineCreditCard style={{ color: T.accent, fontSize: 20 }} />
                  <h3 style={{ fontWeight: 700, fontSize: 15, color: T.text }}>Payment Method</h3>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    { id: "free", label: "🌿 Free Donation", desc: "All food donations are free of charge", badge: "RECOMMENDED" },
                    { id: "paypal", label: "💳 PayPal", desc: "Pay via PayPal (demo)", badge: null },
                    { id: "card", label: "🏦 Credit/Debit Card", desc: "Secure card payment (demo)", badge: null },
                  ].map((method) => (
                    <motion.button
                      key={method.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setPaymentMethod(method.id)}
                      style={{
                        width: "100%", textAlign: "left", padding: "14px 16px",
                        borderRadius: 16,
                        border: `2px solid ${paymentMethod === method.id ? T.accent : T.border}`,
                        background: paymentMethod === method.id ? T.accentSoft : "transparent",
                        cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <p style={{ fontWeight: 700, fontSize: 13.5, color: T.text }}>{method.label}</p>
                        {method.badge && (
                          <span style={{ fontSize: 9, background: T.accentSoft, color: T.accent, borderRadius: 100, padding: "2px 8px", fontFamily: "monospace", fontWeight: 700, border: `1px solid ${T.borderMed}` }}>
                            {method.badge}
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: 11.5, color: T.textMuted, marginTop: 3 }}>{method.desc}</p>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Order summary */}
              <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 20, padding: 18 }}>
                <p style={{ fontSize: 11, color: T.textFaint, fontFamily: "monospace", letterSpacing: "0.08em", marginBottom: 14 }}>ORDER SUMMARY</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {items.map((item) => (
                    <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <img src={item.image} alt={item.name} style={{ width: 40, height: 40, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} />
                      <span style={{ flex: 1, fontSize: 13, color: T.textMuted }}>{item.name} ×{item.quantity}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: T.accent, fontFamily: "monospace" }}>FREE</span>
                    </div>
                  ))}
                  <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 12, display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontWeight: 800, fontSize: 14, color: T.text }}>Total</span>
                    <span style={{ fontWeight: 800, fontSize: 14, color: T.accent, fontFamily: "monospace" }}>{totalItems} items (Free)</span>
                  </div>
                </div>
              </div>

              <motion.button whileTap={{ scale: 0.98 }} onClick={handlePlaceOrder}
                style={{ background: `linear-gradient(135deg, ${T.accent}, #16a34a)`, color: "#fff", border: "none", borderRadius: 18, padding: "16px", fontWeight: 800, fontSize: 15, cursor: "pointer", fontFamily: "inherit", boxShadow: `0 8px 32px ${T.accent}44`, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <HiOutlineShieldCheck style={{ fontSize: 20 }} />
                Place Order — Free
              </motion.button>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200 }} style={{ textAlign: "center", paddingTop: 24 }}>
              <motion.div
                animate={{ rotate: [0, -10, 10, -5, 5, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, delay: 0.2 }}
                style={{ fontSize: 80, marginBottom: 20 }}
              >
                🎉
              </motion.div>
              <h2 style={{ fontSize: 26, fontWeight: 900, color: T.text, marginBottom: 10, letterSpacing: "-0.03em" }}>
                Order Placed!
              </h2>
              <div style={{ display: "inline-block", background: T.accentSoft, border: `1px solid ${T.borderMed}`, borderRadius: 12, padding: "8px 20px", marginBottom: 10 }}>
                <p style={{ fontFamily: "monospace", fontSize: 14, color: T.accent, fontWeight: 700 }}>{orderId}</p>
              </div>
              <p style={{ fontSize: 13, color: T.textMuted, marginBottom: 32 }}>You'll receive updates about your delivery soon.</p>

              {/* Reservation Timer */}
              <div style={{
                marginTop: 12,
                padding: "10px",
                background: T.accentSoft,
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                gap: 8,
                maxWidth: 300,
                margin: "0 auto 32px"
              }}>
                <HiOutlineClock style={{ color: T.accent }} />
                <span style={{ fontSize: "11px", color: T.textMuted }}>
                  Items reserved for <b>14:59</b> minutes
                </span>
              </div>

              {/* CO2 Savings Badge */}
              <div style={{
                background: T.amber + "15",
                border: `1px solid ${T.amber}44`,
                borderRadius: 12,
                padding: "10px 16px",
                marginBottom: 32,
                maxWidth: 280,
                margin: "0 auto 32px"
              }}>
                <p style={{ fontSize: 12, color: T.amber, fontWeight: 700, fontFamily: "monospace" }}>
                  This rescue saved 1.2kg of CO₂ emissions
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate(`/tracking/${orderId}`)}
                  style={{ background: `linear-gradient(135deg, ${T.accent}, #16a34a)`, color: "#fff", border: "none", borderRadius: 18, padding: "16px", fontWeight: 800, fontSize: 14, cursor: "pointer", fontFamily: "inherit", boxShadow: `0 8px 32px ${T.accent}44` }}
                >
                  Track My Order 🚀
                </motion.button>
                <Link to="/dashboard" style={{ textDecoration: "none" }}>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    style={{ width: "100%", background: T.bgCard, color: T.textMuted, border: `1px solid ${T.border}`, borderRadius: 18, padding: "16px", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}
                  >
                    Back to Home
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
