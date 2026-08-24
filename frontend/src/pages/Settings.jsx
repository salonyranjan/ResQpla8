import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const Settings = () => {
  const { T } = useOutletContext();
  const { user, logout, updatePreferences } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [browserAlerts, setBrowserAlerts] = useState(false);
  const [emailUpdates, setEmailUpdates] = useState(false);
  const [permission, setPermission] = useState(() => typeof Notification === "undefined" ? "unsupported" : Notification.permission);
  const [saving, setSaving] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    setBrowserAlerts(Boolean(user?.prefs?.browserAlerts));
    setEmailUpdates(Boolean(user?.prefs?.emailUpdates));
  }, [user?.$id, user?.prefs?.browserAlerts, user?.prefs?.emailUpdates]);

  const savePreference = async (key, value) => {
    setSaving(key);
    setMessage({ type: "", text: "" });
    try {
      await updatePreferences({ [key]: value });
      setMessage({ type: "success", text: "Preferences saved to your account." });
      return true;
    } catch (error) {
      setMessage({ type: "error", text: error.message || "Preference could not be saved." });
      return false;
    } finally {
      setSaving("");
    }
  };

  const changeBrowserAlerts = async (enabled) => {
    if (enabled) {
      if (typeof Notification === "undefined") {
        setMessage({ type: "error", text: "This browser does not support system notifications." });
        return;
      }
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result !== "granted") {
        setBrowserAlerts(false);
        setMessage({ type: "error", text: "Notification permission was not granted in this browser." });
        return;
      }
    }
    setBrowserAlerts(enabled);
    if (!(await savePreference("browserAlerts", enabled))) setBrowserAlerts(!enabled);
  };

  const changeEmailUpdates = async (enabled) => {
    setEmailUpdates(enabled);
    if (!(await savePreference("emailUpdates", enabled))) setEmailUpdates(!enabled);
  };

  const sendTestNotification = () => {
    if (permission === "granted") new Notification("ResQPlate alerts are enabled", { body: "This browser can display ResQPlate notifications." });
  };

  const signOut = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      setMessage({ type: "error", text: error.message || "Sign out failed." });
      setLoggingOut(false);
    }
  };

  const card = { background: T.bgCard, borderRadius: 18, padding: 22, border: `1px solid ${T.border}` };
  const row = { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18, padding: "13px 0" };

  return (
    <div style={{ padding: 28, background: T.bg, minHeight: "100vh" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <div style={{ width: 42, height: 42, borderRadius: 11, background: T.accentSoft, display: "grid", placeItems: "center", fontSize: 20 }}>⚙️</div>
        <div><h2 style={{ fontFamily: "'DM Mono', monospace", fontSize: 24, color: T.text, margin: 0 }}>Settings</h2><p style={{ color: T.textMuted, fontSize: 11.5, marginTop: 3 }}>Account-synced preferences and browser controls</p></div>
      </div>

      {message.text && <div role="status" style={{ marginBottom: 16, padding: 12, borderRadius: 12, color: message.type === "error" ? T.red : T.accent, background: message.type === "error" ? T.redSoft : T.accentSoft, border: `1px solid ${message.type === "error" ? T.red : T.accent}33`, fontSize: 12 }}>{message.text}</div>}

      <div style={{ display: "grid", gap: 18, maxWidth: 760 }}>
        <section style={card}>
          <h3 style={{ color: T.text, fontSize: 16, marginBottom: 8 }}>Appearance</h3>
          <p style={{ color: T.textMuted, fontSize: 11.5, marginBottom: 14 }}>Theme changes apply immediately and remain on this device.</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {["light", "dark"].map((value) => <button key={value} type="button" onClick={() => setTheme(value)} aria-pressed={theme === value} style={{ padding: 12, borderRadius: 12, border: `1px solid ${theme === value ? T.accent : T.border}`, background: theme === value ? T.accentSoft : T.bgAlt, color: theme === value ? T.accent : T.textMuted, cursor: "pointer", fontWeight: 700, textTransform: "capitalize" }}>{value === "light" ? "☀️" : "🌙"} {value}</button>)}
          </div>
        </section>

        <section style={card}>
          <h3 style={{ color: T.text, fontSize: 16 }}>Notifications</h3>
          <div style={row}>
            <div><p style={{ color: T.text, fontSize: 13, fontWeight: 700 }}>Browser alerts</p><p style={{ color: T.textMuted, fontSize: 11, marginTop: 4 }}>Permission: {permission}. Your choice is stored in Appwrite.</p></div>
            <input type="checkbox" aria-label="Browser alerts" checked={browserAlerts && permission === "granted"} disabled={saving === "browserAlerts" || permission === "unsupported"} onChange={(event) => changeBrowserAlerts(event.target.checked)} style={{ width: 20, height: 20, accentColor: T.accent }} />
          </div>
          {browserAlerts && permission === "granted" && <button type="button" onClick={sendTestNotification} style={{ padding: "8px 12px", borderRadius: 9, border: `1px solid ${T.borderMed}`, background: T.bgAlt, color: T.textMuted, cursor: "pointer" }}>Send test notification</button>}
          <div style={{ ...row, borderTop: `1px solid ${T.border}`, marginTop: 13 }}>
            <div><p style={{ color: T.text, fontSize: 13, fontWeight: 700 }}>Email-update preference</p><p style={{ color: T.textMuted, fontSize: 11, marginTop: 4 }}>Records whether you want rescue emails when an email workflow is configured.</p></div>
            <input type="checkbox" aria-label="Email updates" checked={emailUpdates} disabled={saving === "emailUpdates"} onChange={(event) => changeEmailUpdates(event.target.checked)} style={{ width: 20, height: 20, accentColor: T.accent }} />
          </div>
        </section>

        <section style={card}>
          <h3 style={{ color: T.text, fontSize: 16, marginBottom: 14 }}>Account</h3>
          <div style={{ display: "grid", gap: 10 }}>
            <button type="button" onClick={() => navigate("/dashboard/profile")} style={{ padding: 12, border: 0, borderRadius: 11, background: T.accent, color: "#fff", cursor: "pointer", fontWeight: 700 }}>Manage profile and password</button>
            <button type="button" onClick={signOut} disabled={loggingOut} style={{ padding: 12, borderRadius: 11, background: T.redSoft, color: T.red, border: `1px solid ${T.red}33`, cursor: loggingOut ? "wait" : "pointer", fontWeight: 700 }}>{loggingOut ? "Signing out…" : "Sign out"}</button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Settings;
