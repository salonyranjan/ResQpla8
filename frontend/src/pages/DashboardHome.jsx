import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { listAllPickups, listAvailableFood, subscribeToPickupChanges } from "../services/foodService";

const statusLabel = (status) => status?.replaceAll("_", " ") || "unknown";

export default function DashboardHome() {
  const { T } = useOutletContext();
  const { user } = useAuth();
  const [pickups, setPickups] = useState([]);
  const [available, setAvailable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    try {
      const [allPickups, availableFood] = await Promise.all([
        listAllPickups(500),
        listAvailableFood(6),
      ]);
      setPickups(allPickups);
      setAvailable(availableFood);
      setError("");
    } catch (requestError) {
      setError(requestError.message || "Dashboard data could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
    let unsubscribe;
    try {
      unsubscribe = subscribeToPickupChanges(loadDashboard);
    } catch (subscriptionError) {
      console.error("Dashboard live updates are unavailable:", subscriptionError);
    }
    const expiryRefresh = window.setInterval(loadDashboard, 60_000);
    return () => {
      unsubscribe?.();
      window.clearInterval(expiryRefresh);
    };
  }, [loadDashboard]);

  const ownPickups = useMemo(
    () => pickups.filter((pickup) => pickup.donorId === user?.$id),
    [pickups, user?.$id],
  );
  const completed = ownPickups.filter((pickup) => pickup.status === "completed");
  const mealsRescued = completed.reduce((total, pickup) => total + Number(pickup.mealsCount || 0), 0);
  const stats = [
    { label: "My donations", value: ownPickups.length, note: "Records created by you" },
    { label: "Awaiting pickup", value: ownPickups.filter((pickup) => pickup.status === "pending").length, note: "Your available listings" },
    { label: "Completed", value: completed.length, note: "Finished pickup records" },
    { label: "Meals rescued", value: mealsRescued, note: "From completed pickups" },
  ];

  const panel = { background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 16 };

  return (
    <main style={{ minHeight: "100vh", padding: "28px", background: T.bg, color: T.text }}>
      <section style={{ ...panel, padding: "26px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
        <div>
          <div style={{ color: T.accent, fontSize: 12, fontWeight: 750, letterSpacing: ".08em", textTransform: "uppercase" }}>Dashboard</div>
          <h1 style={{ margin: "7px 0 6px", fontSize: 30, letterSpacing: "-.035em" }}>Hello, {user?.name?.split(" ")[0] || "there"}</h1>
          <p style={{ margin: 0, color: T.textMuted, lineHeight: 1.6 }}>Manage real food donations and pickup activity from one place.</p>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link to="/dashboard/donate" style={{ padding: "11px 17px", borderRadius: 10, background: T.accent, color: "#fff", textDecoration: "none", fontWeight: 700 }}>Post food</Link>
          <Link to="/dashboard/search" style={{ padding: "11px 17px", borderRadius: 10, border: `1px solid ${T.borderMed}`, color: T.text, textDecoration: "none", fontWeight: 700 }}>Browse food</Link>
        </div>
      </section>

      {error && <div role="alert" style={{ marginTop: 18, padding: 14, borderRadius: 12, color: T.red, background: T.redSoft }}>{error}</div>}

      <section aria-label="Account activity" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginTop: 18 }}>
        {stats.map((stat) => (
          <article key={stat.label} style={{ ...panel, padding: 19 }}>
            <div style={{ color: T.textMuted, fontSize: 12 }}>{stat.label}</div>
            <strong style={{ display: "block", margin: "7px 0 5px", fontSize: 28 }}>{loading ? "—" : stat.value}</strong>
            <div style={{ color: T.textFaint, fontSize: 11 }}>{stat.note}</div>
          </article>
        ))}
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))", gap: 18, marginTop: 18 }}>
        <section style={{ ...panel, padding: 21 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 14 }}>
            <div><h2 style={{ margin: 0, fontSize: 18 }}>Available food</h2><p style={{ margin: "4px 0 0", color: T.textMuted, fontSize: 12 }}>Current, unclaimed listings</p></div>
            <Link to="/dashboard/search" style={{ color: T.accent, fontSize: 12, fontWeight: 700, textDecoration: "none" }}>View all</Link>
          </div>
          {loading ? <p style={{ color: T.textMuted }}>Loading listings…</p> : available.length === 0 ? <p style={{ color: T.textMuted }}>No food is currently available.</p> : available.slice(0, 5).map((item) => (
            <Link key={item.$id} to="/dashboard/search" style={{ display: "flex", justifyContent: "space-between", gap: 14, padding: "13px 0", borderTop: `1px solid ${T.border}`, color: "inherit", textDecoration: "none" }}>
              <div><strong style={{ fontSize: 14 }}>{item.foodType || item.name}</strong><div style={{ marginTop: 4, color: T.textMuted, fontSize: 12 }}>{item.pickupLocation}</div></div>
              <div style={{ textAlign: "right", color: T.accent, fontSize: 12, whiteSpace: "nowrap" }}>{item.mealsCount || 0} meals</div>
            </Link>
          ))}
        </section>

        <section style={{ ...panel, padding: 21 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 14 }}>
            <div><h2 style={{ margin: 0, fontSize: 18 }}>My recent donations</h2><p style={{ margin: "4px 0 0", color: T.textMuted, fontSize: 12 }}>Your latest pickup records</p></div>
            <Link to="/dashboard/profile" style={{ color: T.accent, fontSize: 12, fontWeight: 700, textDecoration: "none" }}>History</Link>
          </div>
          {loading ? <p style={{ color: T.textMuted }}>Loading history…</p> : ownPickups.length === 0 ? (
            <div><p style={{ color: T.textMuted }}>You have not posted a donation yet.</p><Link to="/dashboard/donate" style={{ color: T.accent, fontWeight: 700, textDecoration: "none" }}>Post your first donation</Link></div>
          ) : ownPickups.slice(0, 5).map((item) => (
            <div key={item.$id} style={{ display: "flex", justifyContent: "space-between", gap: 14, padding: "13px 0", borderTop: `1px solid ${T.border}` }}>
              <div><strong style={{ fontSize: 14 }}>{item.foodType || item.name}</strong><div style={{ marginTop: 4, color: T.textMuted, fontSize: 12 }}>{new Date(item.$createdAt).toLocaleDateString()}</div></div>
              <span style={{ alignSelf: "center", padding: "4px 8px", borderRadius: 999, background: T.accentSoft, color: T.accent, fontSize: 11, textTransform: "capitalize" }}>{statusLabel(item.status)}</span>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
