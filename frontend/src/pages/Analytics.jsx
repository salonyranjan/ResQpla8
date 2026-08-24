import { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { listAllPickups } from "../services/foodService";

const Analytics = () => {
  const { T } = useOutletContext();
  const { user } = useAuth();
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    listAllPickups()
      .then((items) => active && setPickups(items))
      .catch((err) => active && setError(err.message || "Analytics could not be loaded."))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  const ownPickups = useMemo(
    () => pickups.filter((pickup) => pickup.donorId === user?.$id),
    [pickups, user?.$id],
  );

  const stats = useMemo(() => {
    const completed = ownPickups.filter((p) => p.status === "completed");
    const meals = completed.reduce((sum, p) => sum + Number(p.mealsCount || 0), 0);
    const successRate = ownPickups.length ? Math.round((completed.length / ownPickups.length) * 100) : 0;
    return { completed: completed.length, meals, successRate, pending: ownPickups.filter((p) => p.status === "pending").length };
  }, [ownPickups]);

  const cards = [
    ["My donations", ownPickups.length],
    ["Pending rescues", stats.pending],
    ["Completed rescues", stats.completed],
    ["Meals rescued", stats.meals],
    ["Completion rate", `${stats.successRate}%`],
  ];

  return (
    <main style={{ padding: 28, minHeight: "100vh", background: T.bg, color: T.text }}>
      <h1 style={{ margin: 0, fontSize: 28 }}>Analytics</h1>
      <p style={{ margin: "8px 0 24px", color: T.textMuted }}>Live totals calculated only from donations posted by your account.</p>

      {loading && <p style={{ color: T.textMuted }}>Loading live analytics…</p>}
      {error && <div role="alert" style={{ padding: 14, borderRadius: 10, background: `${T.red}15`, color: T.red }}>{error}</div>}

      {!loading && !error && (
        <>
          <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
            {cards.map(([label, value]) => (
              <article key={label} style={{ padding: 20, borderRadius: 14, background: T.bgCard, border: `1px solid ${T.border}` }}>
                <div style={{ fontSize: 13, color: T.textMuted }}>{label}</div>
                <strong style={{ display: "block", marginTop: 8, fontSize: 27 }}>{value}</strong>
              </article>
            ))}
          </section>

          <section style={{ marginTop: 24, padding: 20, borderRadius: 14, background: T.bgCard, border: `1px solid ${T.border}` }}>
            <h2 style={{ margin: "0 0 16px", fontSize: 18 }}>Recent activity</h2>
            {ownPickups.length === 0 ? <p style={{ color: T.textMuted }}>You have no donation records yet.</p> : ownPickups.slice(0, 8).map((pickup) => (
              <div key={pickup.$id} style={{ display: "flex", justifyContent: "space-between", gap: 16, padding: "12px 0", borderBottom: `1px solid ${T.border}` }}>
                <div>
                  <div style={{ fontWeight: 650 }}>{pickup.foodType || "Food donation"}</div>
                  <div style={{ marginTop: 3, fontSize: 12, color: T.textMuted }}>{pickup.pickupLocation || "No pickup location"}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ textTransform: "capitalize", color: T.accent }}>{pickup.status}</div>
                  <div style={{ marginTop: 3, fontSize: 12, color: T.textMuted }}>{pickup.mealsCount || 0} meals</div>
                </div>
              </div>
            ))}
          </section>
        </>
      )}
    </main>
  );
};

export default Analytics;
