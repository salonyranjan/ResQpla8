import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const links = [
  { label: "Home", to: "/", end: true },
  { label: "About", to: "/about" },
  { label: "Donations", to: "/donations" },
  { label: "Contact", to: "/contact" },
  { label: "Dashboard", to: "/dashboard", dashboard: true },
];

const ThemeIcon = ({ dark }) => dark ? <path d="M20.5 14.2A8.2 8.2 0 019.8 3.5a8.5 8.5 0 1010.7 10.7z" /> : <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4l1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>;

const NavBar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const { dark, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 8);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  useEffect(() => setOpen(false), [location.pathname]);
  useEffect(() => {
    if (!open) return undefined;
    const escape = (event) => event.key === "Escape" && setOpen(false);
    const resize = () => window.innerWidth >= 880 && setOpen(false);
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", escape);
    window.addEventListener("resize", resize);
    return () => {
      document.body.style.overflow = oldOverflow;
      document.removeEventListener("keydown", escape);
      window.removeEventListener("resize", resize);
    };
  }, [open]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try { await logout(); navigate("/"); }
    finally { setLoggingOut(false); setOpen(false); }
  };
  const initials = (user?.name || user?.email || "User").split(/\s+|@/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("");

  return <>
    <header className={`main-navbar ${scrolled ? "is-scrolled" : ""}`}>
      <div className="main-navbar-inner">
        <Logo size={38} className="main-navbar-logo" />
        <nav className="desktop-navigation" aria-label="Main navigation">
          {links.map((item) => <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => `main-nav-link ${item.dashboard ? "dashboard-nav-link" : ""} ${isActive ? "active" : ""}`}>
            {item.dashboard && <svg className="dashboard-nav-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>}
            {item.label}
          </NavLink>)}
        </nav>
        <div className="main-navbar-actions">
          <button className="nav-icon-button" type="button" onClick={toggleTheme} aria-label={dark ? "Use light mode" : "Use dark mode"} title={dark ? "Light mode" : "Dark mode"}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><ThemeIcon dark={dark} /></svg>
          </button>
          <div className="desktop-account-actions">
            {isAuthenticated ? <Link to="/dashboard/profile" className="account-link" aria-label="Open your profile"><span className="account-avatar">{initials}</span><span className="account-copy"><small>My account</small>{user?.name || "Profile"}</span></Link> : <><Link to="/login" className="login-link">Log in</Link><Link to="/register" className="primary-nav-action">Get started</Link></>}
          </div>
          <button className="nav-icon-button mobile-menu-button" type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? "Close navigation" : "Open navigation"}><i /><i /><i /></button>
        </div>
      </div>
    </header>

    <button className={`mobile-menu-backdrop ${open ? "open" : ""}`} type="button" onClick={() => setOpen(false)} aria-label="Close navigation" tabIndex={open ? 0 : -1} />
    <aside id="mobile-navigation" className={`mobile-navigation ${open ? "open" : ""}`} aria-hidden={!open}>
      <div className="mobile-navigation-header"><Logo size={36} /><button className="nav-icon-button mobile-close-button" onClick={() => setOpen(false)} aria-label="Close navigation">×</button></div>
      {isAuthenticated && <div className="mobile-user-card"><span className="account-avatar">{initials}</span><span className="account-copy"><small>Signed in as</small>{user?.name || user?.email}</span></div>}
      <nav className="mobile-navigation-links" aria-label="Mobile navigation">
        {links.map((item) => <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => `mobile-nav-link ${item.dashboard ? "mobile-dashboard-link" : ""} ${isActive ? "active" : ""}`} tabIndex={open ? 0 : -1}>{item.label}<span aria-hidden="true">→</span></NavLink>)}
      </nav>
      <div className="mobile-navigation-actions">
        {isAuthenticated ? <button className="mobile-secondary-action" onClick={handleLogout} disabled={loggingOut} tabIndex={open ? 0 : -1}>{loggingOut ? "Signing out…" : "Sign out"}</button> : <><Link to="/login" className="mobile-secondary-action" tabIndex={open ? 0 : -1}>Log in</Link><Link to="/register" className="mobile-primary-action" tabIndex={open ? 0 : -1}>Create an account</Link></>}
      </div>
    </aside>

    <style>{`
      .main-navbar{position:sticky;top:0;z-index:60;height:68px;background:${dark ? "rgba(7,15,9,.92)" : "rgba(247,242,232,.94)"};border-bottom:1px solid transparent;backdrop-filter:blur(18px);transition:.2s}.main-navbar.is-scrolled{border-color:${dark ? "rgba(255,255,255,.09)" : "rgba(17,28,21,.1)"};box-shadow:0 10px 30px rgba(0,0,0,${dark ? ".2" : ".07"})}
      .main-navbar-inner{width:min(1180px,100%);height:100%;margin:auto;padding:0 24px;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:24px}.main-navbar-logo{justify-self:start}.desktop-navigation{display:flex;gap:4px;padding:4px;border:1px solid ${dark ? "rgba(255,255,255,.08)" : "rgba(17,28,21,.09)"};border-radius:12px;background:${dark ? "rgba(255,255,255,.025)" : "rgba(255,255,255,.42)"}}
      .main-nav-link{display:inline-flex;align-items:center;gap:7px;padding:8px 15px;border-radius:9px;color:${dark ? "#aab8ae" : "#536158"};font-size:14px;font-weight:650;text-decoration:none;transition:color .18s ease,background .18s ease,transform .18s ease}.main-nav-link:hover{color:${dark ? "#fff" : "#132419"};background:${dark ? "rgba(255,255,255,.05)" : "rgba(45,106,79,.06)"}}.main-nav-link.active{background:${dark ? "rgba(82,183,136,.15)" : "#e1ecdf"};color:${dark ? "#8dd5aa" : "#205f43"}}.dashboard-nav-link{color:${dark ? "#a9dfbd" : "#246044"}}.dashboard-nav-icon{width:15px;height:15px;fill:none;stroke:currentColor;stroke-width:1.8}.main-nav-link:focus-visible,.nav-icon-button:focus-visible,.account-link:focus-visible,.login-link:focus-visible,.primary-nav-action:focus-visible,.mobile-nav-link:focus-visible,.mobile-secondary-action:focus-visible,.mobile-primary-action:focus-visible{outline:3px solid rgba(82,183,136,.3);outline-offset:2px}
      .main-navbar-actions,.desktop-account-actions,.account-link{display:flex;align-items:center}.main-navbar-actions{justify-self:end;gap:10px}.desktop-account-actions{gap:8px}.nav-icon-button{display:grid;place-items:center;width:40px;height:40px;border:1px solid ${dark ? "rgba(255,255,255,.1)" : "rgba(17,28,21,.12)"};border-radius:11px;background:${dark ? "rgba(255,255,255,.04)" : "rgba(255,255,255,.5)"};color:${dark ? "#dbe8df" : "#233c2d"};cursor:pointer}.nav-icon-button:hover{border-color:#52b788}.nav-icon-button svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
      .login-link,.primary-nav-action{padding:9px 16px;border-radius:10px;font-size:14px;font-weight:700;text-decoration:none;transition:transform .18s ease,box-shadow .18s ease,background .18s ease}.login-link{color:${dark ? "#dce6df" : "#26392c"}}.login-link:hover{background:${dark ? "rgba(255,255,255,.05)" : "rgba(45,106,79,.06)"}}.primary-nav-action{background:#2d6a4f;color:#fff;box-shadow:0 6px 16px rgba(45,106,79,.18)}.primary-nav-action:hover{transform:translateY(-1px);background:#245b42;box-shadow:0 8px 20px rgba(45,106,79,.25)}.account-link{gap:9px;padding:5px 10px 5px 5px;border-radius:12px;color:${dark ? "#f0f5f1" : "#17271c"};text-decoration:none;transition:background .18s ease}.account-link:hover{background:${dark ? "rgba(255,255,255,.055)" : "rgba(45,106,79,.07)"}}.account-avatar{display:grid;place-items:center;flex:0 0 34px;height:34px;border-radius:10px;background:#2d6a4f;color:#fff;font-size:12px;font-weight:800}.account-copy{max-width:140px;display:flex;flex-direction:column;font-size:13px;font-weight:700;line-height:1.25;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.account-copy small{font-size:10px;font-weight:500;color:${dark ? "#91a097" : "#6b776f"}}
      .mobile-menu-button,.mobile-menu-backdrop,.mobile-navigation{display:none}.mobile-menu-button{gap:4px}.mobile-menu-button i{display:block;width:18px;height:2px;border-radius:2px;background:currentColor}
      @media(max-width:879px){.main-navbar{height:62px}.main-navbar-inner{display:flex;justify-content:space-between;padding:0 16px}.desktop-navigation,.desktop-account-actions{display:none}.main-navbar-actions{margin-left:auto}.mobile-menu-button{display:grid}.main-navbar-logo img{width:34px;height:34px}.main-navbar-logo span{font-size:18px!important}.mobile-menu-backdrop{display:block;position:fixed;inset:0;z-index:69;border:0;background:rgba(0,0,0,.56);opacity:0;pointer-events:none;transition:opacity .22s}.mobile-menu-backdrop.open{opacity:1;pointer-events:auto}.mobile-navigation{display:flex;position:fixed;z-index:70;inset:0 0 0 auto;width:min(340px,88vw);padding:max(14px,env(safe-area-inset-top)) 16px max(20px,env(safe-area-inset-bottom));flex-direction:column;background:${dark ? "#0a130d" : "#f8f4eb"};color:${dark ? "#eef6f0" : "#17271c"};box-shadow:-20px 0 50px rgba(0,0,0,.22);transform:translateX(105%);visibility:hidden;transition:.25s}.mobile-navigation.open{transform:translateX(0);visibility:visible}.mobile-navigation-header{height:48px;display:flex;align-items:center;justify-content:space-between}.mobile-close-button{font-size:26px}.mobile-user-card{display:flex;align-items:center;gap:11px;margin:20px 0 6px;padding:13px;border-radius:14px;background:${dark ? "rgba(255,255,255,.045)" : "#ece9df"}}.mobile-navigation-links{display:flex;flex:1;flex-direction:column;gap:4px;padding:18px 0;overflow:auto}.mobile-nav-link{display:flex;justify-content:space-between;padding:13px 14px;border-radius:11px;color:${dark ? "#bac7be" : "#4e5b52"};font-size:15px;font-weight:650;text-decoration:none}.mobile-nav-link.active{background:${dark ? "rgba(82,183,136,.14)" : "#dfeade"};color:${dark ? "#8dd5aa" : "#205f43"}}.mobile-navigation-actions{display:grid;gap:9px}.mobile-secondary-action,.mobile-primary-action{width:100%;padding:12px;border-radius:11px;font:inherit;font-size:14px;font-weight:750;text-align:center;text-decoration:none;cursor:pointer}.mobile-secondary-action{border:1px solid ${dark ? "rgba(255,255,255,.12)" : "rgba(17,28,21,.14)"};background:transparent;color:inherit}.mobile-primary-action{border:1px solid #2d6a4f;background:#2d6a4f;color:#fff}}
      .mobile-dashboard-link{margin-top:8px;background:#2d6a4f!important;color:#fff!important;box-shadow:0 8px 20px rgba(45,106,79,.18)}
      @media(max-width:380px){.main-navbar-inner{padding:0 12px}.main-navbar-actions{gap:7px}.nav-icon-button{width:38px;height:38px}.mobile-navigation{width:92vw}}
    `}</style>
  </>;
};

export default NavBar;
