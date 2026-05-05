import { useState, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineSearch, HiOutlineAdjustments, HiOutlineX, HiOutlineClock, HiOutlineLocationMarker } from "react-icons/hi";
import FoodCard from "../components/FoodCard";
import { foodListings, categories } from "../data/mockData";

const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const fadeUp = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } };

export default function FoodListing() {
  const ctx = useOutletContext();
  const dark = ctx?.dark ?? true;
  const T = dark
    ? {
        bg: "#080e0a", bgAlt: "#0d1710", bgCard: "#111c14", border: "rgba(34,197,94,0.09)",
        borderMed: "rgba(34,197,94,0.18)", text: "#ecfdf5", textMuted: "#6ee7b7",
        textFaint: "rgba(110,231,183,0.35)", accent: "#22c55e", accentSoft: "rgba(34,197,94,0.09)",
        amber: "#f59e0b", teal: "#14b8a6", shadow: "0 4px 24px rgba(0,0,0,0.4)", bgInput: "#0d1710",
      }
    : {
        bg: "#f0f7f2", bgAlt: "#e8f2eb", bgCard: "#ffffff", border: "rgba(26,74,46,0.09)",
        borderMed: "rgba(26,74,46,0.18)", text: "#0d1f12", textMuted: "#3a6647",
        textFaint: "rgba(58,102,71,0.4)", accent: "#16a34a", accentSoft: "rgba(22,163,74,0.09)",
        amber: "#d97706", teal: "#0d9488", shadow: "0 4px 24px rgba(0,0,0,0.06)", bgInput: "#f8fdf9",
      };

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("recent");

  const filtered = useMemo(() => {
    let result = foodListings.filter((item) => {
      const matchesSearch =
        !search ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.restaurant.toLowerCase().includes(search.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(search.toLowerCase()));
      const matchesCategory = activeCategory === "All" || item.category === activeCategory;
      return matchesSearch && matchesCategory;
    });

    if (sortBy === "distance") result = [...result].sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    if (sortBy === "quantity") result = [...result].sort((a, b) => parseInt(b.quantity) - parseInt(a.quantity));

    return result;
  }, [search, activeCategory, sortBy]);

  return (
    <div style={{ background: T.bg, minHeight: "100vh" }}>
      {/* Sticky search header */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          background: dark ? "rgba(8,14,10,0.97)" : "rgba(240,247,242,0.97)",
          backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${T.border}`,
          padding: "16px 16px 14px",
        }}
      >
        {/* Search input */}
        <div style={{ position: "relative", marginBottom: 12 }}>
          <HiOutlineSearch
            style={{
              position: "absolute",
              left: 14,
              top: "50%",
              transform: "translateY(-50%)",
              color: T.textFaint,
              fontSize: 18,
            }}
          />
          <input
            type="text"
            placeholder="Search food, restaurant…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              height: 44,
              paddingLeft: 42,
              paddingRight: search ? 42 : 16,
              background: T.bgInput,
              border: `1px solid ${T.border}`,
              borderRadius: 14,
              fontSize: 13.5,
              color: T.text,
              outline: "none",
              fontFamily: "inherit",
              transition: "border-color 0.2s",
              boxSizing: "border-box",
            }}
            onFocus={(e) => (e.target.style.borderColor = T.accent)}
            onBlur={(e) => (e.target.style.borderColor = T.border)}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              style={{
                position: "absolute",
                right: 12,
                top: "50%",
                transform: "translateY(-50%)",
                background: T.bgAlt,
                border: "none",
                borderRadius: "50%",
                width: 22,
                height: 22,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <HiOutlineX style={{ fontSize: 12, color: T.textMuted }} />
            </button>
          )}
        </div>

        {/* Categories */}
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 2, scrollbarWidth: "none" }}>
          {categories.map((cat) => (
            <motion.button
              key={cat}
              whileTap={{ scale: 0.94 }}
              onClick={() => setActiveCategory(cat)}
              style={{
                whiteSpace: "nowrap",
                padding: "6px 14px",
                borderRadius: 100,
                border: `1px solid ${activeCategory === cat ? T.accent : T.border}`,
                background: activeCategory === cat ? T.accent : "transparent",
                color: activeCategory === cat ? "#fff" : T.textMuted,
                fontSize: 12,
                fontWeight: activeCategory === cat ? 700 : 400,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.2s",
                flexShrink: 0,
              }}
            >
              {cat}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Results bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
        }}
      >
        <p style={{ fontSize: 12.5, color: T.textMuted, fontFamily: "monospace" }}>
          <span style={{ color: T.text, fontWeight: 700 }}>{filtered.length}</span> results
        </p>
        <div style={{ display: "flex", gap: 6 }}>
          {["recent", "distance", "quantity"].map((s) => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              style={{
                padding: "4px 10px",
                borderRadius: 8,
                border: `1px solid ${sortBy === s ? T.accent : T.border}`,
                background: sortBy === s ? T.accentSoft : "transparent",
                color: sortBy === s ? T.accent : T.textFaint,
                fontSize: 10,
                fontFamily: "monospace",
                fontWeight: sortBy === s ? 700 : 400,
                cursor: "pointer",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Food Grid */}
      <div style={{ padding: "0 12px 16px" }}>
        {filtered.length > 0 ? (
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <AnimatePresence>
              {filtered.map((item) => (
                <motion.div
                  key={item.id}
                  variants={fadeUp}
                  layout
                  exit={{ opacity: 0, scale: 0.85 }}
                >
                  <FoodCard item={item} T={T} dark={dark} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: "center", paddingTop: 80 }}
          >
            <div style={{ fontSize: 56, marginBottom: 16 }}>🥡</div>
            <p style={{ fontSize: 17, fontWeight: 700, color: T.text, marginBottom: 6 }}>No food listings found</p>
            <p style={{ fontSize: 13, color: T.textFaint }}>Try adjusting your search or filters</p>
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => { setSearch(""); setActiveCategory("All"); }}
              style={{
                marginTop: 20,
                padding: "10px 24px",
                background: T.accent,
                color: "#fff",
                border: "none",
                borderRadius: 14,
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Clear Filters
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}