import { useNavigate, useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const Settings = () => {
  const { T } = useOutletContext();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => localStorage.getItem("resqplate-push-notifications") !== "false");
  const [emailUpdates, setEmailUpdates] = useState(() => localStorage.getItem("resqplate-email-updates") === "true");

  useEffect(() => {
    localStorage.setItem("resqplate-push-notifications", String(notificationsEnabled));
    localStorage.setItem("resqplate-email-updates", String(emailUpdates));
  }, [notificationsEnabled, emailUpdates]);

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
            fontFamily: "'DM Mono', monospace",
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
            fontFamily: "'DM Mono', monospace",
            fontSize: "18px",
            color: T.text,
            margin: "0 0 16px 0",
          }}
        >
          Notifications
        </h3>
        <label style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
          <input
            type="checkbox"
            checked={notificationsEnabled}
            onChange={(e) => setNotificationsEnabled(e.target.checked)}
            style={{ width: "18px", height: "18px", cursor: "pointer" }}
          />
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "14px",
              color: T.text,
              cursor: "pointer",
            }}
          >
            Enable push notifications
          </span>
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
          <input
            type="checkbox"
            checked={emailUpdates}
            onChange={(e) => setEmailUpdates(e.target.checked)}
            style={{ width: "18px", height: "18px", cursor: "pointer" }}
          />
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "14px",
              color: T.text,
              cursor: "pointer",
            }}
          >
            Email updates for rescued meals
          </span>
        </label>
        <div style={{ fontSize: "12px", color: T.textFaint }}>
          We'll notify you about new food listings and rescue impacts
        </div>
      </div>

      <div style={{ background: T.bgCard, borderRadius: "16px", padding: "24px", border: `1px solid ${T.border}` }}>
        <h3
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "18px",
            color: T.text,
            margin: "0 0 16px 0",
          }}
        >
          Account
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <button
            onClick={() => navigate("/dashboard/profile")}
            style={{
              width: "100%",
              padding: "12px 16px",
              background: T.accent,
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              fontFamily: "'DM Mono', monospace",
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
            onClick={async () => {
              await logout();
              navigate("/login", { replace: true });
            }}
            style={{
              width: "100%",
              padding: "12px 16px",
              background: T.redSoft,
              color: T.red,
              border: `1px solid ${T.red}`,
              borderRadius: "10px",
              fontFamily: "'DM Mono', monospace",
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
