import { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { listAllPickups } from "../services/foodService";

const Analytics = () => {
  const { T } = useOutletContext();
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

  const stats = useMemo(() => {
    const completed = pickups.filter((p) => p.status === "completed");
    const meals = completed.reduce((sum, p) => sum + Number(p.mealsCount || 0), 0);
    const weight = completed.reduce((sum, p) => sum + Number(p.weight || 0), 0);
    const successRate = pickups.length ? Math.round((completed.length / pickups.length) * 100) : 0;
    return { completed: completed.length, meals, weight, successRate, pending: pickups.filter((p) => p.status === "pending").length };
  }, [pickups]);

  const cards = [
    ["Total donations", pickups.length],
    ["Pending rescues", stats.pending],
    ["Completed rescues", stats.completed],
    ["Meals rescued", stats.meals],
    ["Food rescued", `${stats.weight.toFixed(1)} kg`],
    ["Completion rate", `${stats.successRate}%`],
  ];

  return (
    <main style={{ padding: 28, minHeight: "100vh", background: T.bg, color: T.text }}>
      <h1 style={{ margin: 0, fontSize: 28 }}>Analytics</h1>
      <p style={{ margin: "8px 0 24px", color: T.textMuted }}>Live totals calculated from your Appwrite pickup records.</p>

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
            {pickups.length === 0 ? <p style={{ color: T.textMuted }}>No donation records yet.</p> : pickups.slice(0, 8).map((pickup) => (
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
