import { useState, useMemo, useEffect } from "react";
import { useOutletContext, useSearchParams } from "react-router-dom";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { HiOutlineSearch, HiOutlineAdjustments, HiOutlineX, HiOutlineClock, HiOutlineLocationMarker } from "react-icons/hi";
import FoodCard from "../components/FoodCard";
import { listAvailableFood, subscribeToPickupChanges } from "../services/foodService";

const stagger = { 
  hidden: { opacity: 0 }, 
  show: { opacity: 1, transition: { staggerChildren: 0.06 } } 
};

const fadeUp = { 
  hidden: { opacity: 0, y: 18 }, 
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } 
};

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

  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const activeCategory = searchParams.get("category") || "All";
  const [sortBy, setSortBy] = useState("recent");

  // Live data state
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState(["All"]);

  const handleCategoryChange = (cat) => {
    if (cat === "All") {
      setSearchParams({});
    } else {
      setSearchParams({ category: cat });
    }
  };

  // Fetch available pickups from Appwrite
  useEffect(() => {
    let cancelled = false;

    const fetchListings = async () => {
      try {
        const docs = await listAvailableFood(500);
        if (!cancelled) {
          setListings(docs);

          // Derive unique categories dynamically
          const cats = ["All"];
          docs.forEach(doc => {
            if (doc.category && !cats.includes(doc.category)) {
              cats.push(doc.category);
            }
          });
          setCategories(cats);
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to fetch food listings:", err);
        if (!cancelled) {
          setError(err.message || "Failed to load listings. Please try again later.");
          setLoading(false);
        }
      }
    };

    fetchListings();
    let unsubscribe;
    try {
      unsubscribe = subscribeToPickupChanges(fetchListings);
    } catch (err) {
      console.error("Live listing updates are unavailable:", err);
    }
    const expiryRefresh = window.setInterval(fetchListings, 60_000);
    return () => {
      cancelled = true;
      window.clearInterval(expiryRefresh);
      unsubscribe?.();
    };
  }, []);

  // Filter and sort locally (JS fallback for search since Appwrite search may not be indexed)
  const filtered = useMemo(() => {
    let result = listings;

    // Filter by search term
    if (search) {
      const term = search.toLowerCase();
      result = result.filter(item =>
        (item.name && item.name.toLowerCase().includes(term)) ||
        (item.location && item.location.toLowerCase().includes(term)) ||
        (item.foodItem && item.foodItem.toLowerCase().includes(term)) ||
        (item.description && item.description.toLowerCase().includes(term))
      );
    }

    // Filter by category
    if (activeCategory !== "All") {
      result = result.filter(item => item.category === activeCategory);
    }

    // Sort
    if (sortBy === "distance") {
      result = [...result].sort((a, b) => {
        const distA = parseFloat((a.distance || "0 km").replace(" km", "")) || 0;
        const distB = parseFloat((b.distance || "0 km").replace(" km", "")) || 0;
        return distA - distB;
      });
    }
    if (sortBy === "quantity") {
      result = [...result].sort((a, b) => {
        const qtyA = parseInt(a.qty?.match(/\d+/)?.[0] || a.meals || 0, 10);
        const qtyB = parseInt(b.qty?.match(/\d+/)?.[0] || b.meals || 0, 10);
        return qtyB - qtyA;
      });
    }

    return result;
  }, [listings, search, activeCategory, sortBy]);

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
            <Motion.button
              key={cat}
              whileTap={{ scale: 0.94 }}
              onClick={() => handleCategoryChange(cat)}
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
            </Motion.button>
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
                fontWeight: sortBy === s ? 700 : 400,
                cursor: "pointer",
                fontFamily: "monospace",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div style={{ display: "flex", justifyContent: "center", padding: "3rem" }}>
          <Motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            style={{
              width: 40,
              height: 40,
              border: `4px solid ${T.accentSoft}`,
              borderTopColor: T.accent,
              borderRadius: "50%",
            }}
          />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div style={{
          margin: "1rem 16px",
          padding: "1rem",
          background: "rgba(239,68,68,0.08)",
          border: "1px solid rgba(239,68,68,0.25)",
          borderRadius: 12,
          color: "#ef4444",
          fontFamily: "monospace",
          fontSize: 12,
        }}>
          ⚠ {error}
        </div>
      )}

      {/* Food Grid */}
      {!loading && !error && (
        <div style={{ padding: "0 12px 16px" }}>
          {filtered.length > 0 ? (
            <Motion.div
              variants={stagger}
              initial="hidden"
              animate="show"
              style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
            >
              <AnimatePresence>
                {filtered.map((item) => (
                  <Motion.div
                    key={item.$id || item.id}
                    variants={fadeUp}
                    layout
                    exit={{ opacity: 0, scale: 0.85 }}
                  >
                    <FoodCard item={item} T={T} dark={dark} />
                  </Motion.div>
                ))}
              </AnimatePresence>
            </Motion.div>
          ) : (
            <Motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ textAlign: "center", paddingTop: 80 }}
            >
              <div style={{ fontSize: 56, marginBottom: 16 }}>🥡</div>
              <p style={{ fontSize: 17, fontWeight: 700, color: T.text, marginBottom: 6 }}>No food listings found</p>
              <p style={{ fontSize: 13, color: T.textMuted }}>{listings.length ? "Try adjusting your search or filters." : "No pending donations are available right now."}</p>
              <Motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => { setSearch(""); handleCategoryChange("All"); }}
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
              </Motion.button>
            </Motion.div>
          )}
        </div>
      )}
    </div>
  );
}
