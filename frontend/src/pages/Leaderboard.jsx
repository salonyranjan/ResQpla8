import { useEffect, useState } from "react";
import { Query } from "appwrite";
import { useOutletContext } from "react-router-dom";
import { databases } from "../services/appwrite";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const VOLUNTEERS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_VOLUNTEERS_COLLECTION_ID;

export default function Leaderboard() {
  const { T } = useOutletContext();
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    databases.listDocuments(DATABASE_ID, VOLUNTEERS_COLLECTION_ID, [Query.limit(100)])
      .then((response) => {
        if (!active) return;
        setVolunteers(response.documents
          .filter((item) => item.available)
          .sort((a, b) => Number(b.reliability || 0) - Number(a.reliability || 0)));
      })
      .catch((requestError) => active && setError(requestError.message || "Volunteer data could not be loaded."))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  return <main style={{ padding: 28, minHeight: "100vh", background: T.bg, color: T.text }}>
    <h1 style={{ margin: 0, fontSize: 28 }}>Volunteer readiness</h1>
    <p style={{ margin: "8px 0 24px", color: T.textMuted }}>Available volunteers ranked by their recorded reliability—not fabricated rescue totals.</p>
    {loading && <p style={{ color: T.textMuted }}>Loading volunteer records…</p>}
    {error && <div role="alert" style={{ padding: 14, borderRadius: 12, color: T.red, background: T.redSoft }}>{error}</div>}
    {!loading && !error && volunteers.length === 0 && <p style={{ color: T.textMuted }}>No available volunteer records exist yet.</p>}
    {!loading && !error && volunteers.length > 0 && <section style={{ display: "grid", gap: 10 }}>
      {volunteers.map((volunteer, index) => {
        const reliability = Number(volunteer.reliability || 0);
        const percent = Math.round(reliability > 1 ? reliability : reliability * 100);
        return <article key={volunteer.$id} style={{ display: "flex", alignItems: "center", gap: 14, padding: 17, border: `1px solid ${T.border}`, borderRadius: 14, background: T.bgCard }}>
          <strong style={{ width: 28, color: T.accent }}>#{index + 1}</strong>
          <div style={{ flex: 1 }}><strong>Volunteer {volunteer.userId.slice(-6)}</strong><div style={{ marginTop: 4, color: T.textMuted, fontSize: 12 }}>Capacity: {volunteer.maxMeals} meals</div></div>
          <span style={{ color: T.accent, fontWeight: 800 }}>{percent}% reliable</span>
        </article>;
      })}
    </section>}
  </main>;
}
