import { useOutletContext } from "react-router-dom";
import { useState } from "react";

const Settings = () => {
  const { T, dark } = useOutletContext();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(false);
  const [themePreference, setThemePreference] = useState(dark ? "dark" : "light");

  return (
    <div style={{ padding: "28px", background: T.bg, minHeight: "100vh" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "10px",
            background: T.accentSoft,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ⚙️
        </div>
        <h2
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "24px",
            color: T.text,
            margin: 0,
            letterSpacing: "-0.02em",
          }}
        >
          Settings
        </h2>
      </div>

      <div style={{ background: T.bgCard, borderRadius: "16px", padding: "24px", marginBottom: "24px", border: `1px solid ${T.border}` }}>
        <h3
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "18px",
            color: T.text,
            margin: "0 0 16px 0",
          }}
        >
          Appearance
        </h3>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ fontSize: "16px" }}>🌓 Theme</div>
          <select
            value={themePreference}
            onChange={(e) => setThemePreference(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: "8px",
              border: `1px solid ${T.border}`,
              background: T.bgInput,
              color: T.text,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "14px",
              minWidth: "120px",
            }}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
          <div style={{ fontSize: "12px", color: T.textFaint, marginLeft: "auto" }}>
            Applies on next load
          </div>
        </div>
      </div>

      <div style={{ background: T.bgCard, borderRadius: "16px", padding: "24px", marginBottom: "24px", border: `1px solid ${T.border}` }}>
        <h3
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "18px",
            color: T.text,
            margin: "0 0 16px 0",
          }}
        >
          Notifications
        </h3>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
          <input
            type="checkbox"
            checked={notificationsEnabled}
            onChange={(e) => setNotificationsEnabled(e.target.checked)}
            style={{ width: "18px", height: "18px", cursor: "pointer" }}
          />
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "14px",
              color: T.text,
              cursor: "pointer",
            }}
          >
            Enable push notifications
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
          <input
            type="checkbox"
            checked={emailUpdates}
            onChange={(e) => setEmailUpdates(e.target.checked)}
            style={{ width: "18px", height: "18px", cursor: "pointer" }}
          />
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "14px",
              color: T.text,
              cursor: "pointer",
            }}
          >
            Email updates for rescued meals
          </span>
        </div>
        <div style={{ fontSize: "12px", color: T.textFaint }}>
          We'll notify you about new food listings and rescue impacts
        </div>
      </div>

      <div style={{ background: T.bgCard, borderRadius: "16px", padding: "24px", border: `1px solid ${T.border}` }}>
        <h3
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "18px",
            color: T.text,
            margin: "0 0 16px 0",
          }}
        >
          Account
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <button
            onClick={() => alert("Profile update coming soon!")}
            style={{
              width: "100%",
              padding: "12px 16px",
              background: T.accent,
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              justifyContent: "center",
            }}
          >
            <span>👤</span> Update Profile
          </button>
          <button
            onClick={() => alert("Logout functionality pending")}
            style={{
              width: "100%",
              padding: "12px 16px",
              background: T.redSoft,
              color: T.red,
              border: `1px solid ${T.red}`,
              borderRadius: "10px",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              justifyContent: "center",
            }}
          >
            <span>🚪</span> Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;