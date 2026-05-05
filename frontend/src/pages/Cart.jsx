import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import {
  HiOutlineArrowLeft,
  HiOutlineTrash,
  HiOutlineShoppingCart,
  HiOutlinePlus,
  HiOutlineMinus,
} from "react-icons/hi";

export default function CartPage() {
  const ctx = useOutletContext();
  const dark = ctx?.dark ?? true;
  const T = dark
    ? {
        bg: "#080e0a", bgAlt: "#0d1710", bgCard: "#111c14", border: "rgba(34,197,94,0.09)",
        borderMed: "rgba(34,197,94,0.18)", text: "#ecfdf5", textMuted: "#6ee7b7",
        textFaint: "rgba(110,231,183,0.35)", accent: "#22c55e", accentSoft: "rgba(34,197,94,0.09)",
        red: "#ef4444", redSoft: "rgba(239,68,68,0.1)", amber: "#f59e0b", shadow: "0 4px 24px rgba(0,0,0,0.4)",
        nav: "rgba(8,14,10,0.97)",
      }
    : {
        bg: "#f0f7f2", bgAlt: "#e8f2eb", bgCard: "#ffffff", border: "rgba(26,74,46,0.09)",
        borderMed: "rgba(26,74,46,0.18)", text: "#0d1f12", textMuted: "#3a6647",
        textFaint: "rgba(58,102,71,0.4)", accent: "#16a34a", accentSoft: "rgba(22,163,74,0.09)",
        red: "#dc2626", redSoft: "rgba(220,38,38,0.08)", amber: "#d97706", shadow: "0 4px 24px rgba(0,0,0,0.06)",
        nav: "rgba(240,247,242,0.97)",
      };

  const { items, removeItem, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  if (items.length === 0) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: T.bg,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 32,
        }}
      >
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          style={{ textAlign: "center" }}
        >
          <div
            style={{
              width: 100,
              height: 100,
              borderRadius: 28,
              background: T.accentSoft,
              border: `1px solid ${T.borderMed}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 44,
              margin: "0 auto 20px",
            }}
          >
            🛒
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: T.text, marginBottom: 8 }}>Your cart is empty</h2>
          <p style={{ fontSize: 13, color: T.textMuted, marginBottom: 28 }}>
            Browse food listings and add items to get started
          </p>
          <Link to="/dashboard/search" style={{ textDecoration: "none" }}>
            <motion.button
              whileTap={{ scale: 0.96 }}
              style={{
                background: T.accent,
                color: "#fff",
                border: "none",
                borderRadius: 16,
                padding: "14px 32px",
                fontWeight: 800,
                fontSize: 14,
                cursor: "pointer",
                fontFamily: "inherit",
                letterSpacing: "-0.01em",
              }}
            >
              Browse Food
            </motion.button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ background: T.bg, minHeight: "100vh", paddingBottom: 140 }}>
      {/* Header */}
      <div
        style={{
          position: "sticky",
          top: 0,
          background: T.nav,
          backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${T.border}`,
          padding: "14px 16px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          zIndex: 40,
        }}
      >
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(-1)}
          style={{
            width: 38,
            height: 38,
            borderRadius: 12,
            background: T.bgCard,
            border: `1px solid ${T.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <HiOutlineArrowLeft style={{ fontSize: 18, color: T.textMuted }} />
        </motion.button>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 17, fontWeight: 800, color: T.text }}>My Cart</h1>
          <p style={{ fontSize: 11, color: T.textFaint, fontFamily: "monospace" }}>{totalItems} items</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={clearCart}
          style={{
            padding: "6px 12px",
            background: T.redSoft,
            border: `1px solid ${T.red}33`,
            borderRadius: 10,
            color: T.red,
            fontSize: 11,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "monospace",
            letterSpacing: "0.04em",
          }}
        >
          CLEAR
        </motion.button>
      </div>

      {/* Cart Items */}
      <div style={{ padding: "16px 16px 0" }}>
        <AnimatePresence>
          {items.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100, height: 0, marginBottom: 0 }}
              transition={{ delay: idx * 0.05 }}
              style={{
                background: T.bgCard,
                border: `1px solid ${T.border}`,
                borderRadius: 20,
                padding: 14,
                display: "flex",
                gap: 14,
                alignItems: "center",
                marginBottom: 12,
                boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
              }}
            >
              <img
                src={item.image}
                alt={item.name}
                style={{
                  width: 76,
                  height: 76,
                  objectFit: "cover",
                  borderRadius: 14,
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3
                  style={{
                    fontWeight: 700,
                    fontSize: 14,
                    color: T.text,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    marginBottom: 3,
                  }}
                >
                  {item.name}
                </h3>
                <p style={{ fontSize: 11.5, color: T.textMuted, marginBottom: 10 }}>{item.restaurant}</p>

                {/* Quantity controls */}
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <motion.button
                    whileTap={{ scale: 0.88 }}
                    onClick={() => item.quantity > 1 ? updateQuantity(item.id, item.quantity - 1) : removeItem(item.id)}
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 9,
                      background: T.bgAlt,
                      border: `1px solid ${T.border}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                  >
                    <HiOutlineMinus style={{ fontSize: 13, color: T.textMuted }} />
                  </motion.button>
                  <span style={{ fontWeight: 800, fontSize: 15, color: T.text, minWidth: 20, textAlign: "center", fontFamily: "monospace" }}>
                    {item.quantity}
                  </span>
                  <motion.button
                    whileTap={{ scale: 0.88 }}
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 9,
                      background: T.accentSoft,
                      border: `1px solid ${T.borderMed}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                  >
                    <HiOutlinePlus style={{ fontSize: 13, color: T.accent }} />
                  </motion.button>

                  <span
                    style={{
                      marginLeft: "auto",
                      fontSize: 12,
                      fontWeight: 700,
                      color: T.accent,
                      background: T.accentSoft,
                      borderRadius: 8,
                      padding: "3px 10px",
                      fontFamily: "monospace",
                    }}
                  >
                    FREE
                  </span>
                </div>
              </div>

              {/* Delete */}
              <motion.button
                whileTap={{ scale: 0.88 }}
                onClick={() => removeItem(item.id)}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  background: T.redSoft,
                  border: `1px solid ${T.red}22`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  flexShrink: 0,
                  alignSelf: "flex-start",
                }}
              >
                <HiOutlineTrash style={{ fontSize: 16, color: T.red }} />
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Order Summary */}
      <div style={{ padding: "8px 16px 0" }}>
        <div
          style={{
            background: T.bgCard,
            border: `1px solid ${T.border}`,
            borderRadius: 20,
            padding: 18,
          }}
        >
          <h3 style={{ fontWeight: 700, fontSize: 14, color: T.text, marginBottom: 14, fontFamily: "monospace", letterSpacing: "0.06em" }}>
            ORDER SUMMARY
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, color: T.textMuted }}>Total items</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{totalItems}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, color: T.textMuted }}>Delivery</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: T.accent }}>Free</span>
            </div>
            <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 10, display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: T.text }}>Total Cost</span>
              <span style={{ fontSize: 14, fontWeight: 800, color: T.accent }}>₹0.00 (Free)</span>
            </div>
          </div>
          <p style={{ marginTop: 12, fontSize: 11, color: T.textFaint, fontFamily: "monospace" }}>
            🌿 All donations are completely free
          </p>
        </div>
      </div>

      {/* Bottom CTA */}
      <div
        style={{
          position: "fixed",
          bottom: 68,
          left: 0,
          right: 0,
          padding: "12px 16px 16px",
          background: T.nav,
          backdropFilter: "blur(20px)",
          borderTop: `1px solid ${T.border}`,
          zIndex: 40,
        }}
      >
        <motion.button
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/checkout")}
          style={{
            width: "100%",
            background: `linear-gradient(135deg, ${T.accent}, #16a34a)`,
            color: "#fff",
            border: "none",
            borderRadius: 18,
            padding: "16px 20px",
            fontWeight: 800,
            fontSize: 15,
            cursor: "pointer",
            fontFamily: "inherit",
            letterSpacing: "-0.01em",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            boxShadow: `0 8px 32px ${T.accent}44`,
          }}
        >
          <HiOutlineShoppingCart style={{ fontSize: 20 }} />
          Proceed to Checkout · {totalItems} items
        </motion.button>
      </div>
    </div>
  );
}