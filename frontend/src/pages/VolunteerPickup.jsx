import { useEffect, useMemo, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { HiOutlineArrowPath, HiOutlineCheckCircle, HiOutlineClock, HiOutlineMapPin, HiOutlineTruck, HiOutlineUsers } from "react-icons/hi2";
import { useVolunteerPickups } from "../hooks/useVolunteerPickups";
import { useAuth } from "../context/AuthContext";
import { getVolunteerProfile, getVolunteerWorkflowStatus, saveVolunteerProfile } from "../services/volunteerRouting";

const labels = { pending: "New request", accepted: "Assigned to you", delivered: "Delivered", declined: "Declined", expired: "Expired" };

export default function VolunteerPickup() {
  const { T } = useOutletContext();
  const { user, updatePreferences } = useAuth();
  const navigate = useNavigate();
  const { pickups, loading, error, busyId, refresh, accept, decline, complete } = useVolunteerPickups();
  const [filter, setFilter] = useState("active");
  const [profile, setProfile] = useState(null);
  const [profileForm, setProfileForm] = useState({ maxMeals: 20, available: true });
  const [profileBusy, setProfileBusy] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const filtered = useMemo(() => pickups.filter((item) => filter === "all" || (filter === "active" ? ["pending", "accepted"].includes(item.status) : item.status === filter)), [pickups, filter]);
  const activeCount = pickups.filter((item) => ["pending", "accepted"].includes(item.status)).length;
  const deliveredCount = pickups.filter((item) => item.status === "delivered").length;
  const workflowStatus = getVolunteerWorkflowStatus();

  const directionsUrl = (address) => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;

  useEffect(() => {
    getVolunteerProfile(user?.$id).then((result) => {
      setProfile(result);
      if (result) setProfileForm({ maxMeals: result.maxMeals || 20, available: Boolean(result.available) });
    }).catch(() => setProfileMessage("Volunteer profile could not be loaded."));
  }, [user?.$id]);

  const saveProfile = () => {
    if (!navigator.geolocation) { setProfileMessage("Location services are required to volunteer."); return; }
    setProfileBusy(true); setProfileMessage("Requesting your location…");
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      try {
        const saved = await saveVolunteerProfile({ userId: user.$id, latitude: coords.latitude, longitude: coords.longitude, ...profileForm });
        setProfile(saved);
        await updatePreferences({ role: "volunteer", onboardingComplete: true });
        setProfileMessage("Volunteer availability saved. Nearby rescue requests can now reach you.");
      } catch (profileError) { setProfileMessage(profileError.message || "Volunteer profile could not be saved."); }
      finally { setProfileBusy(false); }
    }, () => { setProfileMessage("Location permission was not granted. It is required for nearby matching."); setProfileBusy(false); }, { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 });
  };

  return <main className="vp-page" style={{ "--vp-bg": T.bg, "--vp-card": T.bgCard, "--vp-soft": T.bgAlt, "--vp-text": T.text, "--vp-muted": T.textMuted, "--vp-faint": T.textFaint, "--vp-line": T.border, "--vp-accent": T.accent, "--vp-accent-soft": T.accentSoft, "--vp-red": T.red }}>
    <style>{`
      .vp-page{min-height:100vh;padding:28px;background:var(--vp-bg);color:var(--vp-text);font-family:var(--font-body)}.vp-shell{width:min(1050px,100%);margin:auto}.vp-head{display:flex;align-items:flex-start;justify-content:space-between;gap:18px;margin-bottom:24px}.vp-kicker{margin:0 0 7px;color:var(--vp-accent);font-family:var(--font-meta);font-size:10px;letter-spacing:.12em;text-transform:uppercase}.vp-head h1{margin:0;font-size:28px;letter-spacing:-.035em}.vp-head p{margin:7px 0 0;color:var(--vp-muted);font-size:14px}.vp-refresh{display:flex;align-items:center;gap:7px;padding:10px 13px;border:1px solid var(--vp-line);border-radius:10px;background:var(--vp-card);color:var(--vp-muted);font:600 12px var(--font-body);cursor:pointer}
      .vp-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:22px}.vp-stat{display:flex;align-items:center;gap:13px;padding:17px;border:1px solid var(--vp-line);border-radius:14px;background:var(--vp-card)}.vp-stat svg{width:22px;height:22px;color:var(--vp-accent)}.vp-stat strong{display:block;font-size:20px}.vp-stat span{display:block;color:var(--vp-muted);font-size:11px}.vp-tabs{display:flex;gap:7px;margin-bottom:16px;overflow:auto;padding-bottom:2px}.vp-tab{white-space:nowrap;padding:8px 13px;border:1px solid var(--vp-line);border-radius:100px;background:transparent;color:var(--vp-muted);font:600 11px var(--font-body);cursor:pointer}.vp-tab.active{border-color:var(--vp-accent);background:var(--vp-accent-soft);color:var(--vp-accent)}.vp-alert{margin-bottom:16px;padding:12px 14px;border:1px solid color-mix(in srgb,var(--vp-red) 25%,transparent);border-radius:11px;background:color-mix(in srgb,var(--vp-red) 8%,transparent);color:var(--vp-red);font-size:13px}
      .vp-list{display:grid;gap:14px}.vp-card{overflow:hidden;border:1px solid var(--vp-line);border-radius:17px;background:var(--vp-card)}.vp-card-head{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;padding:18px 20px;border-bottom:1px solid var(--vp-line)}.vp-card-head h2{margin:0;font-size:17px}.vp-card-meta{display:flex;flex-wrap:wrap;gap:8px;margin-top:6px;color:var(--vp-muted);font-size:11px}.vp-badge{flex:none;padding:5px 9px;border-radius:100px;font:600 9px var(--font-meta);letter-spacing:.05em;text-transform:uppercase}.vp-route{display:grid;grid-template-columns:1fr 42px 1fr;padding:18px 20px}.vp-stop{min-width:0}.vp-stop-label{display:flex;align-items:center;gap:6px;margin-bottom:7px;color:var(--vp-faint);font:500 9px var(--font-meta);letter-spacing:.09em;text-transform:uppercase}.vp-stop-label svg{width:14px}.vp-stop strong{display:block;font-size:13px;line-height:1.45}.vp-stop small{display:block;margin-top:5px;color:var(--vp-muted);font-size:11px}.vp-route-line{position:relative;display:flex;align-items:center;justify-content:center;color:var(--vp-accent)}.vp-route-line:before{content:'';width:28px;border-top:1px dashed var(--vp-accent)}.vp-progress{height:4px;background:var(--vp-soft)}.vp-progress span{display:block;height:100%;background:var(--vp-accent);transition:width .3s}.vp-actions{display:flex;align-items:center;gap:8px;padding:14px 20px;border-top:1px solid var(--vp-line);background:color-mix(in srgb,var(--vp-soft) 45%,transparent)}.vp-button{padding:9px 14px;border:1px solid var(--vp-line);border-radius:9px;background:var(--vp-card);color:var(--vp-text);font:650 12px var(--font-body);text-decoration:none;cursor:pointer}.vp-button.primary{border-color:var(--vp-accent);background:var(--vp-accent);color:#fff}.vp-button.danger{color:var(--vp-red)}.vp-button:disabled{opacity:.55;cursor:wait}.vp-note{margin-right:auto;color:var(--vp-muted);font-size:11px}.vp-empty{padding:60px 20px;text-align:center;border:1px dashed var(--vp-line);border-radius:16px;color:var(--vp-muted)}.vp-empty svg{width:34px;height:34px;margin-bottom:10px;color:var(--vp-accent)}
      .vp-enrol{display:grid;grid-template-columns:minmax(0,1fr) auto auto;align-items:end;gap:12px;margin-bottom:18px;padding:17px;border:1px solid var(--vp-line);border-radius:14px;background:var(--vp-card)}.vp-enrol h2{margin:0 0 4px;font-size:15px}.vp-enrol p{margin:0;color:var(--vp-muted);font-size:11px}.vp-field label{display:block;margin-bottom:6px;color:var(--vp-muted);font-size:10px}.vp-field input{width:100px;padding:9px;border:1px solid var(--vp-line);border-radius:9px;background:var(--vp-soft);color:var(--vp-text)}.vp-availability{display:flex;align-items:center;gap:7px;padding:9px}.vp-profile-message{margin:-7px 0 16px;color:var(--vp-accent);font-size:11px}
      @media(max-width:700px){.vp-page{padding:18px 14px}.vp-head h1{font-size:23px}.vp-head p{font-size:13px}.vp-refresh span{display:none}.vp-enrol{grid-template-columns:1fr 1fr}.vp-enrol>div:first-child{grid-column:1/-1}.vp-enrol .vp-button{grid-column:1/-1}.vp-stats{grid-template-columns:1fr 1fr}.vp-stat:last-child{grid-column:1/-1}.vp-route{grid-template-columns:1fr;padding:16px}.vp-route-line{height:28px;justify-content:flex-start;padding-left:7px}.vp-route-line:before{width:1px;height:20px;border-top:0;border-left:1px dashed var(--vp-accent)}.vp-actions{align-items:stretch;flex-direction:column;padding:13px 16px}.vp-note{margin:0 0 3px}.vp-button{text-align:center;width:100%}.vp-card-head{padding:16px}.vp-card-head h2{font-size:15px}}
    `}</style>
    <div className="vp-shell">
      <header className="vp-head"><div><div className="vp-kicker">Volunteer operations</div><h1>Pickup assignments</h1><p>Accept nearby rescues, collect food safely, and confirm delivery.</p></div><button className="vp-refresh" onClick={refresh}><HiOutlineArrowPath /><span>Refresh</span></button></header>
      <section className="vp-enrol"><div><h2>{profile ? "Volunteer availability" : "Become a pickup volunteer"}</h2><p>Your precise location is private and used to rank nearby requests.</p></div><div className="vp-field"><label htmlFor="volunteer-capacity">Meal capacity</label><input id="volunteer-capacity" type="number" min="1" max="500" value={profileForm.maxMeals} onChange={(event) => setProfileForm((current) => ({ ...current, maxMeals: event.target.value }))} /></div><label className="vp-availability"><input type="checkbox" checked={profileForm.available} onChange={(event) => setProfileForm((current) => ({ ...current, available: event.target.checked }))} /> Available</label><button className="vp-button primary" disabled={profileBusy} onClick={saveProfile}>{profileBusy ? "Saving…" : profile ? "Update location" : "Enable volunteering"}</button></section>
      {profileMessage && <div className="vp-profile-message" role="status">{profileMessage}</div>}
      {!workflowStatus.ready && <div className="vp-alert" role="alert">{workflowStatus.message}</div>}
      <section className="vp-stats" aria-label="Assignment summary">
        <div className="vp-stat"><HiOutlineTruck /><div><strong>{activeCount}</strong><span>Active assignments</span></div></div>
        <div className="vp-stat"><HiOutlineClock /><div><strong>{pickups.filter((p) => p.status === "pending").length}</strong><span>Awaiting response</span></div></div>
        <div className="vp-stat"><HiOutlineCheckCircle /><div><strong>{deliveredCount}</strong><span>Deliveries completed</span></div></div>
      </section>
      <nav className="vp-tabs" aria-label="Filter assignments">{[["active","Active"],["pending","New"],["accepted","Accepted"],["delivered","Delivered"],["all","All"]].map(([id,label]) => <button key={id} className={`vp-tab ${filter === id ? "active" : ""}`} onClick={() => setFilter(id)}>{label}</button>)}</nav>
      {error && <div className="vp-alert" role="alert">{error}</div>}
      {loading ? <div className="vp-empty">Loading volunteer assignments…</div> : filtered.length ? <div className="vp-list">{filtered.map((pickup) => {
        const busy = busyId === pickup.id;
        return <article className="vp-card" key={pickup.notificationId}>
          <div className="vp-card-head"><div><h2>{pickup.foodItem}</h2><div className="vp-card-meta"><span>{pickup.meals} meals</span><span>•</span><span>{pickup.distanceKm.toFixed(1)} km away</span><span>•</span><span>{pickup.matchScore}% match</span></div></div><span className="vp-badge" style={{ color: pickup.color, background: `${pickup.color}18` }}>{labels[pickup.status]}</span></div>
          <div className="vp-route"><div className="vp-stop"><div className="vp-stop-label"><HiOutlineMapPin />Pickup from donor</div><strong>{pickup.pickupLocation}</strong><small>{pickup.donor}</small></div><div className="vp-route-line" /><div className="vp-stop"><div className="vp-stop-label"><HiOutlineUsers />Deliver to receiver</div><strong>{pickup.deliveryLocation}</strong><small>{pickup.hasReceiver ? "Receiver address confirmed" : "You can accept now; delivery unlocks after a claim"}</small></div></div>
          <div className="vp-progress"><span style={{ width: `${pickup.progress}%` }} /></div>
          <div className="vp-actions">
            {pickup.status === "pending" && <><span className="vp-note">Respond promptly so another volunteer can be notified.</span><button className="vp-button danger" disabled={busy} onClick={() => decline(pickup)}>Decline</button><button className="vp-button primary" disabled={busy} onClick={() => accept(pickup)}>{busy ? "Saving…" : "Accept pickup"}</button></>}
            {pickup.status === "accepted" && <><span className="vp-note">Verify the food and receiver before completing.</span><a className="vp-button" href={directionsUrl(pickup.pickupLocation)} target="_blank" rel="noreferrer">Directions to donor</a><button className="vp-button" onClick={() => navigate(`/dashboard/map?pickup=${pickup.id}`)}>View full route</button><button className="vp-button primary" disabled={busy || !pickup.hasReceiver} onClick={() => complete(pickup)}>{busy ? "Updating…" : pickup.hasReceiver ? "Confirm delivered" : "Awaiting receiver"}</button></>}
            {pickup.status === "delivered" && <><span className="vp-note">Delivery completed successfully.</span><button className="vp-button" onClick={() => navigate(`/tracking/${pickup.id}`)}>View receipt</button></>}
            {["declined","expired"].includes(pickup.status) && <span className="vp-note">This assignment is closed.</span>}
          </div>
        </article>;
      })}</div> : <div className="vp-empty"><HiOutlineTruck /><div>No assignments in this view</div></div>}
    </div>
  </main>;
}
