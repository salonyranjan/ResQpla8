import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  HiOutlineBell,
  HiOutlineChartBar,
  HiOutlineCog6Tooth,
  HiOutlineHome,
  HiOutlineMap,
  HiOutlineMoon,
  HiOutlinePlusCircle,
  HiOutlineShoppingBag,
  HiOutlineSun,
  HiOutlineUserCircle,
  HiOutlineXMark,
  HiOutlineBars3,
} from "react-icons/hi2";
import Logo from "../components/Logo";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const themes = {
  dark: {
    bg: "#080e0a", bgAlt: "#0d1710", bgCard: "#111c14", bgCardHover: "#152018", bgGlass: "rgba(8,14,10,.95)", bgInput: "#0d1710",
    border: "rgba(34,197,94,.09)", borderMed: "rgba(34,197,94,.17)", borderStrong: "rgba(34,197,94,.28)", text: "#ecfdf5", textMuted: "#8ab798", textFaint: "rgba(138,183,152,.52)",
    accent: "#32ad63", accentGlow: "rgba(50,173,99,.22)", accentSoft: "rgba(50,173,99,.10)", amber: "#f59e0b", amberSoft: "rgba(245,158,11,.12)", red: "#ef4444", redSoft: "rgba(239,68,68,.10)", blue: "#3b82f6", blueSoft: "rgba(59,130,246,.10)", teal: "#14b8a6", tealSoft: "rgba(20,184,166,.10)", purple: "#a855f7", purpleSoft: "rgba(168,85,247,.10)", shadow: "0 20px 55px rgba(0,0,0,.42)", shadowSm: "0 5px 18px rgba(0,0,0,.25)", scrollbar: "#203528",
  },
  light: {
    bg: "#f3f7f4", bgAlt: "#eaf1ec", bgCard: "#ffffff", bgCardHover: "#f8fbf9", bgGlass: "rgba(255,255,255,.95)", bgInput: "#f8fbf9",
    border: "rgba(25,76,42,.09)", borderMed: "rgba(25,76,42,.16)", borderStrong: "rgba(25,76,42,.25)", text: "#132219", textMuted: "#587061", textFaint: "rgba(88,112,97,.58)",
    accent: "#278a50", accentGlow: "rgba(39,138,80,.18)", accentSoft: "rgba(39,138,80,.09)", amber: "#d97706", amberSoft: "rgba(217,119,6,.09)", red: "#dc2626", redSoft: "rgba(220,38,38,.08)", blue: "#2563eb", blueSoft: "rgba(37,99,235,.08)", teal: "#0d9488", tealSoft: "rgba(13,148,136,.08)", purple: "#9333ea", purpleSoft: "rgba(147,51,234,.08)", shadow: "0 20px 55px rgba(19,54,30,.12)", shadowSm: "0 5px 18px rgba(19,54,30,.07)", scrollbar: "#c9d9ce",
  },
};

const primaryLinks = [
  { label: "Overview", to: "/dashboard", end: true, icon: HiOutlineHome },
  { label: "Post food", to: "/dashboard/donate", icon: HiOutlinePlusCircle },
  { label: "Browse food", to: "/dashboard/search", icon: HiOutlineShoppingBag },
  { label: "Analytics", to: "/dashboard/analytics", icon: HiOutlineChartBar },
  { label: "Activity", to: "/dashboard/smart-alerts", icon: HiOutlineBell },
];

const secondaryLinks = [
  { label: "Map view", to: "/map", icon: HiOutlineMap },
  { label: "Profile", to: "/dashboard/profile", icon: HiOutlineUserCircle },
  { label: "Settings", to: "/dashboard/settings", icon: HiOutlineCog6Tooth },
];

function NavigationLink({ item, onNavigate }) {
  const Icon = item.icon;
  return (
    <NavLink to={item.to} end={item.end} onClick={onNavigate} className={({ isActive }) => `dashboard-nav-link${isActive ? " active" : ""}`}>
      <Icon aria-hidden="true" />
      <span>{item.label}</span>
    </NavLink>
  );
}

export default function DashboardLayout() {
  const { dark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const T = dark ? themes.dark : themes.light;
  const initials = user?.name?.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "U";

  const signOut = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await logout();
      navigate("/login", { replace: true });
    } finally {
      setLoggingOut(false);
    }
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <div className={`dashboard-shell ${dark ? "dark" : "light"}`} style={{ "--dash-bg": T.bg, "--dash-panel": T.bgCard, "--dash-text": T.text, "--dash-muted": T.textMuted, "--dash-faint": T.textFaint, "--dash-line": T.border, "--dash-line-med": T.borderMed, "--dash-accent": T.accent, "--dash-accent-soft": T.accentSoft, "--dash-shadow": T.shadow }}>
      <style>{`
        .dashboard-shell{min-height:100dvh;display:grid;grid-template-columns:250px minmax(0,1fr);background:var(--dash-bg);color:var(--dash-text);font-family:'Cabinet Grotesk',system-ui,sans-serif}
        .dashboard-sidebar{position:sticky;top:0;height:100dvh;display:flex;flex-direction:column;border-right:1px solid var(--dash-line);background:var(--dash-panel);z-index:80}
        .dashboard-logo{height:76px;padding:0 20px;display:flex;align-items:center;border-bottom:1px solid var(--dash-line)}
        .dashboard-nav{flex:1;overflow:auto;padding:18px 13px}
        .dashboard-nav-label{padding:0 11px;margin:4px 0 8px;color:var(--dash-faint);font-size:10px;font-weight:750;letter-spacing:.12em;text-transform:uppercase}
        .dashboard-nav-link{display:flex;align-items:center;gap:12px;min-height:44px;margin:3px 0;padding:0 12px;border-radius:10px;color:var(--dash-muted);text-decoration:none;font-size:13.5px;font-weight:620;transition:background .16s,color .16s}
        .dashboard-nav-link svg{width:19px;height:19px;flex:none}.dashboard-nav-link:hover{background:var(--dash-accent-soft);color:var(--dash-text)}.dashboard-nav-link.active{background:var(--dash-accent-soft);color:var(--dash-accent);box-shadow:inset 3px 0 var(--dash-accent)}
        .dashboard-account{padding:15px;border-top:1px solid var(--dash-line)}
        .dashboard-account-row{display:flex;align-items:center;gap:10px;min-width:0}.dashboard-avatar{width:38px;height:38px;display:grid;place-items:center;border-radius:11px;background:var(--dash-accent);color:#fff;font-size:12px;font-weight:800;flex:none}
        .dashboard-user{min-width:0;flex:1}.dashboard-user strong,.dashboard-user span{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.dashboard-user strong{font-size:13px}.dashboard-user span{margin-top:2px;color:var(--dash-muted);font-size:11px}
        .dashboard-signout{width:100%;margin-top:12px;padding:9px 12px;border:1px solid var(--dash-line);border-radius:9px;background:transparent;color:var(--dash-muted);font:inherit;font-size:12px;font-weight:650;cursor:pointer}.dashboard-signout:hover{border-color:#dc5a5a;color:#dc5a5a}
        .dashboard-main{min-width:0}.dashboard-topbar{position:sticky;top:0;z-index:60;height:76px;padding:0 24px;display:flex;align-items:center;justify-content:space-between;gap:14px;border-bottom:1px solid var(--dash-line);background:color-mix(in srgb,var(--dash-panel) 94%,transparent);backdrop-filter:blur(18px)}
        .dashboard-topbar-title strong{display:block;font-size:15px}.dashboard-topbar-title span{display:block;margin-top:3px;color:var(--dash-muted);font-size:11px}.dashboard-top-actions{display:flex;align-items:center;gap:9px}
        .dashboard-icon-button{width:40px;height:40px;display:grid;place-items:center;border:1px solid var(--dash-line);border-radius:10px;background:var(--dash-panel);color:var(--dash-muted);cursor:pointer}.dashboard-icon-button:hover{border-color:var(--dash-line-med);color:var(--dash-accent)}.dashboard-icon-button svg{width:19px;height:19px}
        .dashboard-content{min-width:0}.dashboard-content>div>main{padding:28px!important}.dashboard-menu-button{display:none}
        .dashboard-mobile-backdrop{display:none}
        @media(max-width:820px){.dashboard-shell{display:block}.dashboard-sidebar{position:fixed;left:0;top:0;width:min(290px,86vw);transform:translateX(-105%);transition:transform .22s;box-shadow:var(--dash-shadow)}.dashboard-sidebar.open{transform:translateX(0)}.dashboard-menu-button{display:grid}.dashboard-mobile-backdrop{display:block;position:fixed;inset:0;z-index:70;background:rgba(0,0,0,.42);border:0}.dashboard-topbar{height:68px;padding:0 max(14px,env(safe-area-inset-right)) 0 max(14px,env(safe-area-inset-left))}.dashboard-content>div>main{padding:18px!important}}
        @media(max-width:430px){.dashboard-topbar-title span{display:none}.dashboard-topbar-title strong{font-size:13px}.dashboard-top-actions{gap:6px}.dashboard-icon-button{width:38px;height:38px}.dashboard-content>div>main{padding:14px!important}}
      `}</style>

      {mobileOpen && <button className="dashboard-mobile-backdrop" aria-label="Close navigation" onClick={closeMobile} />}
      <aside className={`dashboard-sidebar ${mobileOpen ? "open" : ""}`} aria-label="Dashboard navigation">
        <div className="dashboard-logo"><Logo size={38} /></div>
        <nav className="dashboard-nav">
          <div className="dashboard-nav-label">Workspace</div>
          {primaryLinks.map((item) => <NavigationLink key={item.to} item={item} onNavigate={closeMobile} />)}
          <div className="dashboard-nav-label" style={{ marginTop: 24 }}>Account</div>
          {secondaryLinks.map((item) => <NavigationLink key={item.to} item={item} onNavigate={closeMobile} />)}
        </nav>
        <div className="dashboard-account">
          <div className="dashboard-account-row"><div className="dashboard-avatar">{initials}</div><div className="dashboard-user"><strong>{user?.name || "ResQPlate user"}</strong><span>{user?.email}</span></div></div>
          <button className="dashboard-signout" onClick={signOut} disabled={loggingOut}>{loggingOut ? "Signing out…" : "Sign out"}</button>
        </div>
      </aside>

      <section className="dashboard-main">
        <header className="dashboard-topbar">
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <button className="dashboard-icon-button dashboard-menu-button" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><HiOutlineBars3 /></button>
            <div className="dashboard-topbar-title"><strong>ResQPlate workspace</strong><span>Food rescue operations</span></div>
          </div>
          <div className="dashboard-top-actions">
            <Link className="dashboard-icon-button" to="/cart" aria-label="Open cart"><HiOutlineShoppingBag /></Link>
            <button className="dashboard-icon-button" onClick={toggleTheme} aria-label={dark ? "Use light mode" : "Use dark mode"}>{dark ? <HiOutlineSun /> : <HiOutlineMoon />}</button>
            {mobileOpen && <button className="dashboard-icon-button" onClick={closeMobile} aria-label="Close navigation"><HiOutlineXMark /></button>}
          </div>
        </header>
        <div className="dashboard-content"><Outlet context={{ T, dark }} /></div>
      </section>
    </div>
  );
}
