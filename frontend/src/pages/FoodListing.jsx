import { useState, useMemo, useEffect } from "react";
import { useLocation, useNavigate, useOutletContext, useSearchParams } from "react-router-dom";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { HiOutlineSearch, HiOutlineAdjustments, HiOutlineX, HiOutlineClock, HiOutlineLocationMarker } from "react-icons/hi";
import FoodCard from "../components/FoodCard";
import { listAvailableFood, subscribeToPickupChanges } from "../services/foodService";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useVolunteerPickups } from "../hooks/useVolunteerPickups";

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
  const location = useLocation();
  const navigate = useNavigate();
  const isPublicPage = location.pathname === "/donations";
  const { user } = useAuth();
  const isVolunteer = isPublicPage && user?.prefs?.role === "volunteer";
  const { pickups: volunteerPickups, busyId: volunteerBusyId, error: volunteerError, accept: acceptVolunteerPickup } = useVolunteerPickups(isVolunteer);
  const readyVolunteerPickups = useMemo(() => volunteerPickups.filter((pickup) => pickup.hasReceiver && ["pending", "accepted"].includes(pickup.status)), [volunteerPickups]);
  const { dark: appDark } = useTheme();
  const dark = ctx?.dark ?? appDark;
  const T = dark
    ? {
        bg: "#070f09", bgAlt: "#0d1710", bgCard: "#111c14", border: "rgba(255,255,255,0.09)",
        borderMed: "rgba(34,197,94,0.18)", text: "#ecfdf5", textMuted: "#6ee7b7",
        textFaint: "rgba(110,231,183,0.35)", accent: "#22c55e", accentSoft: "rgba(34,197,94,0.09)",
        amber: "#f59e0b", teal: "#14b8a6", shadow: "0 4px 24px rgba(0,0,0,0.4)", bgInput: "#0d1710",
      }
    : {
        bg: "#f7f2e8", bgAlt: "#efe9de", bgCard: "#ffffff", border: "rgba(17,28,21,0.1)",
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
      {isPublicPage && <>
        <section className="donations-hero">
          <div className="donations-hero-inner">
            <p className="donations-eyebrow"><span /> Community food sharing</p>
            <h1>Good food deserves<br /><em>another table.</em></h1>
            <p className="donations-intro">Browse fresh food shared by neighbours and local partners. No account is needed until you choose something to claim.</p>
            <div className="donations-trust"><span>Free to browse</span><i /><span>Live availability</span><i /><span>Sign in only to claim</span></div>
          </div>
        </section>
        <style>{`
          .donations-hero{position:relative;overflow:hidden;padding:clamp(58px,8vw,96px) 24px clamp(48px,6vw,72px);border-bottom:1px solid ${T.border};background:${dark ? "radial-gradient(circle at 82% 20%,rgba(82,183,136,.13),transparent 28%),#070f09" : "radial-gradient(circle at 82% 20%,rgba(82,183,136,.18),transparent 28%),#f7f2e8"}}
          .donations-hero-inner{width:min(760px,100%);margin:auto;text-align:center}.donations-eyebrow{display:flex;align-items:center;justify-content:center;gap:10px;margin:0 0 18px;color:${dark ? "#8dd5aa" : "#2d6a4f"};font-family:var(--font-meta);font-size:10px;font-weight:500;letter-spacing:.14em;text-transform:uppercase}.donations-eyebrow span{width:26px;height:1px;background:currentColor}
          .donations-hero h1{margin:0 auto;max-width:680px;color:${T.text};font-family:var(--font-display);font-size:clamp(36px,5vw,58px);font-weight:700;letter-spacing:-.035em;line-height:1.08}.donations-hero h1 em{color:${dark ? "#8dd5aa" : "#2d6a4f"};font-weight:700}
          .donations-intro{max-width:590px;margin:20px auto 24px;color:${dark ? "#aab8ae" : "#536158"};font-family:var(--font-body);font-size:clamp(15px,1.5vw,17px);line-height:1.65}.donations-trust{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:12px;color:${dark ? "#77877c" : "#6b776f"};font-family:var(--font-meta);font-size:9px;letter-spacing:.06em;text-transform:uppercase}.donations-trust i{width:4px;height:4px;border-radius:50%;background:#52b788}
          @media(max-width:600px){.donations-hero{padding:42px 18px 38px}.donations-hero h1{font-size:clamp(32px,10vw,40px);line-height:1.12}.donations-hero h1 br{display:none}.donations-intro{font-size:15px;margin-top:16px}.donations-trust{gap:8px;font-size:8px}.donation-search-header{top:62px!important}.donation-results-bar{align-items:flex-start!important;flex-direction:column}.donation-sort-options{width:100%;overflow-x:auto;padding-bottom:3px}.donation-sort-options button{flex:1;min-width:max-content}}
        `}</style>
      </>}
      {isVolunteer && (readyVolunteerPickups.length > 0 || volunteerError) && (
        <section className="donation-volunteer-board" style={{ background: T.bg, padding: "22px 16px 4px" }}>
          <div style={{ width: "min(1180px, 100%)", margin: "0 auto", padding: 18, border: `1px solid ${T.borderMed}`, borderRadius: 16, background: T.bgCard, boxShadow: T.shadow }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 14 }}>
              <div><p style={{ margin: "0 0 4px", color: T.accent, fontFamily: "var(--font-meta)", fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase" }}>Private volunteer requests</p><h2 style={{ margin: 0, color: T.text, fontSize: 19 }}>Ready for pickup and delivery</h2><p style={{ margin: "5px 0 0", color: T.textMuted, fontSize: 12 }}>These matched rescues now have both donor and receiver locations.</p></div>
              <span style={{ display: "grid", placeItems: "center", minWidth: 32, height: 32, borderRadius: 10, background: T.accentSoft, color: T.accent, fontWeight: 800 }}>{readyVolunteerPickups.length}</span>
            </div>
            {volunteerError && <div role="alert" style={{ marginBottom: 12, padding: 10, borderRadius: 9, background: "rgba(239,68,68,.09)", color: "#ef4444", fontSize: 12 }}>{volunteerError}</div>}
            <div style={{ display: "grid", gap: 10 }}>
              {readyVolunteerPickups.slice(0, 3).map((pickup) => <article key={pickup.notificationId} className="donation-volunteer-request" style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) auto", gap: 14, alignItems: "center", padding: 14, borderRadius: 12, border: `1px solid ${T.border}`, background: T.bgAlt }}>
                <div style={{ minWidth: 0 }}><strong style={{ display: "block", color: T.text, fontSize: 14 }}>{pickup.foodItem} · {pickup.meals} meals</strong><div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6, color: T.textMuted, fontSize: 11 }}><span>Pickup: {pickup.pickupLocation}</span><span aria-hidden="true">→</span><span>Deliver: {pickup.deliveryLocation}</span></div></div>
                {pickup.status === "pending" ? <button type="button" disabled={volunteerBusyId === pickup.id} onClick={async () => { if (await acceptVolunteerPickup(pickup)) navigate("/dashboard/volunteer"); }} style={{ padding: "9px 14px", border: 0, borderRadius: 9, background: T.accent, color: "#fff", fontWeight: 750, cursor: "pointer" }}>{volunteerBusyId === pickup.id ? "Accepting…" : "Take delivery"}</button> : <button type="button" onClick={() => navigate("/dashboard/volunteer")} style={{ padding: "9px 14px", border: `1px solid ${T.borderMed}`, borderRadius: 9, background: T.bgCard, color: T.accent, fontWeight: 750, cursor: "pointer" }}>Open assignment</button>}
              </article>)}
            </div>
          </div>
          <style>{`@media(max-width:640px){.donation-volunteer-request{grid-template-columns:1fr!important}.donation-volunteer-request button{width:100%}}`}</style>
        </section>
      )}
      {/* Sticky search header */}
      <div
        className={isPublicPage ? "donation-search-header" : undefined}
        style={{
          position: "sticky",
          top: isPublicPage ? 68 : 0,
          zIndex: 40,
          background: dark ? "rgba(8,14,10,0.97)" : "rgba(240,247,242,0.97)",
          backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${T.border}`,
          padding: "16px max(16px, calc((100% - 1180px) / 2)) 14px",
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
        className={isPublicPage ? "donation-results-bar" : undefined}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px max(16px, calc((100% - 1180px) / 2)) 12px",
        }}
      >
        <p style={{ fontSize: 12.5, color: T.textMuted, fontFamily: "monospace" }}>
          <span style={{ color: T.text, fontWeight: 700 }}>{filtered.length}</span> results
        </p>
        <div className={isPublicPage ? "donation-sort-options" : undefined} style={{ display: "flex", gap: 6 }}>
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
        <div style={{ width: "min(1180px, calc(100% - 32px))", margin: "0 auto", padding: "0 0 56px" }}>
          {filtered.length > 0 ? (
            <Motion.div
              variants={stagger}
              initial="hidden"
              animate="show"
              style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", gap: 12 }}
            >
              <AnimatePresence>
                {filtered.map((item) => (
                  <Motion.div
                    key={item.$id || item.id}
                    variants={fadeUp}
                    layout
                    exit={{ opacity: 0, scale: 0.85 }}
                  >
                    <FoodCard item={item} T={T} dark={dark} publicClaim={isPublicPage} />
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
