import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/* ─── Floating Particle ─────────────────────────────────────────── */
function Particle({ style }) {
  return <span className="particle" style={style} />;
}

/* ─── Main Component ─────────────────────────────────────────────── */
export default function Login() {
  const { login, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [dark, setDark] = useState(true);
  const [focused, setFocused] = useState(null);
  const [mounted, setMounted] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    setTimeout(() => setMounted(true), 50);
  }, []);

  // Subtle card tilt on mouse move
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const onMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(1200px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg) translateY(-2px)`;
    };
    const onLeave = () => {
      card.style.transform = "perspective(1200px) rotateY(0deg) rotateX(0deg) translateY(0)";
    };
    card.addEventListener("mousemove", onMove);
    card.addEventListener("mouseleave", onLeave);
    return () => {
      card.removeEventListener("mousemove", onMove);
      card.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError("Please fill in all fields."); return; }
    setLoading(true); setError("");
    try {
      await login(form.email, form.password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const particles = Array.from({ length: 18 }, (_, i) => ({
    width: `${Math.random() * 6 + 2}px`,
    height: `${Math.random() * 6 + 2}px`,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDuration: `${Math.random() * 8 + 6}s`,
    animationDelay: `${Math.random() * 4}s`,
    opacity: Math.random() * 0.5 + 0.1,
  }));

  const d = dark;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300;12..96,400;12..96,600;12..96,800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .login-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          font-family: 'DM Sans', sans-serif;
          transition: background 0.5s ease, color 0.5s ease;
          position: relative;
          overflow: hidden;
        }

        /* ── Backgrounds ── */
        .login-root.dark-mode {
          background: #050c07;
          color: #e8f5ec;
        }
        .login-root.light-mode {
          background: #f0faf2;
          color: #0d1f10;
        }

        /* Mesh gradient orbs */
        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          transition: background 0.5s;
        }
        .orb-1 {
          width: 500px; height: 500px;
          top: -120px; left: -120px;
        }
        .orb-2 {
          width: 400px; height: 400px;
          bottom: -100px; right: -80px;
        }
        .orb-3 {
          width: 300px; height: 300px;
          top: 40%; left: 55%;
        }
        .dark-mode .orb-1 { background: radial-gradient(circle, rgba(16,185,129,0.18) 0%, transparent 70%); }
        .dark-mode .orb-2 { background: radial-gradient(circle, rgba(5,150,105,0.14) 0%, transparent 70%); }
        .dark-mode .orb-3 { background: radial-gradient(circle, rgba(20,83,45,0.12) 0%, transparent 70%); }
        .light-mode .orb-1 { background: radial-gradient(circle, rgba(16,185,129,0.22) 0%, transparent 70%); }
        .light-mode .orb-2 { background: radial-gradient(circle, rgba(5,150,105,0.18) 0%, transparent 70%); }
        .light-mode .orb-3 { background: radial-gradient(circle, rgba(110,231,183,0.25) 0%, transparent 70%); }

        /* Grid overlay */
        .grid-bg {
          position: absolute; inset: 0; pointer-events: none;
          background-image: linear-gradient(rgba(16,185,129,0.04) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(16,185,129,0.04) 1px, transparent 1px);
          background-size: 48px 48px;
        }
        .light-mode .grid-bg {
          background-image: linear-gradient(rgba(5,150,105,0.06) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(5,150,105,0.06) 1px, transparent 1px);
        }

        /* Particles */
        .particle {
          position: absolute;
          border-radius: 50%;
          background: rgba(16,185,129,0.6);
          animation: floatUp linear infinite;
          pointer-events: none;
        }
        .light-mode .particle { background: rgba(5,150,105,0.4); }
        @keyframes floatUp {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 0.6; }
          100% { transform: translateY(-120px) scale(0.3); opacity: 0; }
        }

        /* ── Card ── */
        .card {
          position: relative; z-index: 10;
          width: 100%; max-width: 440px;
          border-radius: 28px;
          padding: 44px 40px;
          transition: transform 0.15s ease, box-shadow 0.4s ease, background 0.5s, border-color 0.5s;
          transform-style: preserve-3d;
          opacity: 0;
          transform: translateY(32px) scale(0.96);
        }
        .card.visible {
          opacity: 1;
          transform: translateY(0) scale(1);
          transition: opacity 0.6s cubic-bezier(.22,1,.36,1), transform 0.6s cubic-bezier(.22,1,.36,1),
                      box-shadow 0.4s ease, background 0.5s;
        }
        .dark-mode .card {
          background: rgba(10, 22, 13, 0.85);
          border: 1px solid rgba(16,185,129,0.15);
          box-shadow: 0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(16,185,129,0.06),
                      inset 0 1px 0 rgba(255,255,255,0.04);
          backdrop-filter: blur(20px);
        }
        .light-mode .card {
          background: rgba(255,255,255,0.88);
          border: 1px solid rgba(16,185,129,0.2);
          box-shadow: 0 24px 64px rgba(5,150,105,0.12), 0 0 0 1px rgba(16,185,129,0.08),
                      inset 0 1px 0 rgba(255,255,255,0.9);
          backdrop-filter: blur(20px);
        }

        /* Shimmer top border */
        .card::before {
          content: '';
          position: absolute; top: 0; left: 10%; right: 10%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(16,185,129,0.6), rgba(52,211,153,0.8), rgba(16,185,129,0.6), transparent);
          border-radius: 999px;
        }

        /* ── Logo area ── */
        .logo-wrap {
          display: flex; align-items: center; gap: 14px;
          margin-bottom: 32px;
        }
        .logo-icon {
          width: 48px; height: 48px;
          border-radius: 14px;
          background: linear-gradient(135deg, #059669, #10b981, #34d399);
          display: flex; align-items: center; justify-content: center;
          font-size: 22px;
          box-shadow: 0 8px 24px rgba(16,185,129,0.4), inset 0 1px 0 rgba(255,255,255,0.2);
          flex-shrink: 0;
          position: relative;
          overflow: hidden;
        }
        .logo-icon::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.15));
        }
        .logo-text {
          font-family: 'Bricolage Grotesque', sans-serif;
          font-size: 26px;
          font-weight: 800;
          letter-spacing: -0.5px;
          line-height: 1;
        }
        .dark-mode .logo-text { color: #d1fae5; }
        .light-mode .logo-text { color: #064e3b; }
        .logo-accent { color: #f59e0b; }
        .logo-tagline {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-top: 3px;
        }
        .dark-mode .logo-tagline { color: rgba(110,231,183,0.5); }
        .light-mode .logo-tagline { color: rgba(5,150,105,0.6); }

        /* ── Heading ── */
        .heading { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: 28px; line-height: 1.1; margin-bottom: 8px; }
        .dark-mode .heading { color: #ecfdf5; }
        .light-mode .heading { color: #064e3b; }
        .subheading { font-size: 14px; font-weight: 400; margin-bottom: 32px; }
        .dark-mode .subheading { color: rgba(110,231,183,0.5); }
        .light-mode .subheading { color: rgba(5,150,105,0.65); }

        /* ── Divider ── */
        .divider { width: 40px; height: 3px; border-radius: 2px; background: linear-gradient(90deg,#059669,#34d399); margin-bottom: 28px; }

        /* ── Error ── */
        .error-box {
          margin-bottom: 20px; padding: 12px 16px;
          border-radius: 12px; font-size: 13px;
          display: flex; align-items: center; gap: 10px;
          animation: shake 0.4s ease;
        }
        .dark-mode .error-box { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.25); color: #fca5a5; }
        .light-mode .error-box { background: rgba(239,68,68,0.07); border: 1px solid rgba(239,68,68,0.2); color: #dc2626; }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20%,60% { transform: translateX(-6px); }
          40%,80% { transform: translateX(6px); }
        }

        /* ── Fields ── */
        .field { margin-bottom: 20px; }
        .field-label {
          display: block;
          font-size: 10px; font-weight: 600;
          letter-spacing: 0.12em; text-transform: uppercase;
          margin-bottom: 8px;
        }
        .dark-mode .field-label { color: rgba(110,231,183,0.45); }
        .light-mode .field-label { color: rgba(5,150,105,0.6); }

        .input-wrap {
          position: relative;
        }
        .input-icon {
          position: absolute; left: 16px; top: 50%; transform: translateY(-50%);
          width: 18px; height: 18px; pointer-events: none;
          transition: color 0.2s;
        }
        .dark-mode .input-icon { color: rgba(110,231,183,0.3); }
        .light-mode .input-icon { color: rgba(5,150,105,0.4); }
        .input-wrap.focused .input-icon {
          color: #10b981 !important;
        }

        .field input {
          width: 100%;
          padding: 14px 16px 14px 44px;
          border-radius: 14px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 400;
          outline: none;
          transition: all 0.2s ease;
          border: 1.5px solid transparent;
        }
        .dark-mode .field input {
          background: rgba(5,46,22,0.5);
          color: #d1fae5;
          border-color: rgba(16,185,129,0.1);
          caret-color: #34d399;
        }
        .dark-mode .field input::placeholder { color: rgba(110,231,183,0.25); }
        .dark-mode .field input:focus {
          background: rgba(5,46,22,0.75);
          border-color: rgba(16,185,129,0.45);
          box-shadow: 0 0 0 4px rgba(16,185,129,0.08);
        }
        .light-mode .field input {
          background: rgba(236,253,245,0.8);
          color: #064e3b;
          border-color: rgba(16,185,129,0.15);
          caret-color: #059669;
        }
        .light-mode .field input::placeholder { color: rgba(5,150,105,0.35); }
        .light-mode .field input:focus {
          background: #fff;
          border-color: rgba(16,185,129,0.5);
          box-shadow: 0 0 0 4px rgba(16,185,129,0.1);
        }

        /* eye toggle */
        .eye-btn {
          position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer; padding: 4px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 6px; transition: all 0.15s;
          width: 28px; height: 28px;
        }
        .dark-mode .eye-btn { color: rgba(110,231,183,0.35); }
        .light-mode .eye-btn { color: rgba(5,150,105,0.4); }
        .eye-btn:hover { background: rgba(16,185,129,0.1); color: #10b981; }

        .pw-hint { margin-top: 6px; font-size: 11px; color: #f87171; font-weight: 500; }

        /* ── Submit ── */
        .submit-btn {
          width: 100%; padding: 15px;
          border: none; border-radius: 14px;
          font-family: 'Bricolage Grotesque', sans-serif;
          font-size: 15px; font-weight: 700;
          cursor: pointer; position: relative; overflow: hidden;
          background: linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%);
          color: #fff;
          box-shadow: 0 8px 24px rgba(16,185,129,0.35), 0 2px 8px rgba(0,0,0,0.15);
          transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
          letter-spacing: 0.01em;
          margin-top: 8px;
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 14px 36px rgba(16,185,129,0.45), 0 4px 12px rgba(0,0,0,0.2);
        }
        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .submit-btn:disabled { opacity: 0.55; cursor: not-allowed; }

        /* shimmer on button */
        .submit-btn::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%);
          transform: translateX(-100%);
        }
        .submit-btn:hover:not(:disabled)::after {
          animation: btnShimmer 0.6s ease forwards;
        }
        @keyframes btnShimmer {
          to { transform: translateX(100%); }
        }

        /* spinner */
        .spinner {
          width: 16px; height: 16px; display: inline-block; vertical-align: middle;
          border: 2.5px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          margin-right: 8px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── Footer ── */
        .footer-text { margin-top: 28px; text-align: center; font-size: 13.5px; }
        .dark-mode .footer-text { color: rgba(110,231,183,0.45); }
        .light-mode .footer-text { color: rgba(5,150,105,0.6); }
        .signup-link {
          font-weight: 700; color: #10b981;
          text-decoration: none; transition: color 0.15s;
          border-bottom: 1px dashed rgba(16,185,129,0.4);
          padding-bottom: 1px;
        }
        .signup-link:hover { color: #34d399; border-color: #34d399; }

        /* ── Social Divider ── */
        .social-divider {
          display: flex; align-items: center; gap: 12px; margin: 24px 0;
        }
        .social-line { flex: 1; height: 1px; }
        .dark-mode .social-line { background: rgba(16,185,129,0.12); }
        .light-mode .social-line { background: rgba(16,185,129,0.18); }
        .social-label { font-size: 11px; font-weight: 500; letter-spacing: 0.06em; white-space: nowrap; }
        .dark-mode .social-label { color: rgba(110,231,183,0.3); }
        .light-mode .social-label { color: rgba(5,150,105,0.4); }

        /* ── Theme toggle ── */
        .theme-toggle {
          position: absolute; top: 20px; right: 20px;
          width: 40px; height: 40px;
          border-radius: 12px; border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px;
          transition: all 0.2s ease;
          z-index: 20;
        }
        .dark-mode .theme-toggle {
          background: rgba(16,185,129,0.1);
          color: #34d399;
          border: 1px solid rgba(16,185,129,0.15);
        }
        .light-mode .theme-toggle {
          background: rgba(5,150,105,0.08);
          color: #059669;
          border: 1px solid rgba(16,185,129,0.2);
        }
        .theme-toggle:hover { transform: scale(1.1) rotate(15deg); }

        /* Badge */
        .trust-badges {
          display: flex; align-items: center; justify-content: center;
          gap: 16px; margin-top: 24px;
        }
        .badge {
          display: flex; align-items: center; gap: 5px;
          font-size: 10.5px; font-weight: 500; letter-spacing: 0.04em;
        }
        .dark-mode .badge { color: rgba(110,231,183,0.3); }
        .light-mode .badge { color: rgba(5,150,105,0.4); }
        .badge-dot { width: 5px; height: 5px; border-radius: 50%; background: #10b981; flex-shrink: 0; }

        @media (max-width: 480px) {
          .card { padding: 32px 24px; }
          .heading { font-size: 24px; }
        }
      `}</style>

      <div className={`login-root ${d ? "dark-mode" : "light-mode"}`}>
        {/* Orbs */}
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="grid-bg" />

        {/* Particles */}
        {particles.map((style, i) => <Particle key={i} style={style} />)}

        {/* Theme toggle */}
        <button
          className="theme-toggle"
          onClick={() => setDark(!d)}
          title={d ? "Switch to Light Mode" : "Switch to Dark Mode"}
          style={{ position: "fixed", top: 20, right: 20 }}
        >
          {d ? "☀️" : "🌙"}
        </button>

        {/* Card */}
        <div className={`card ${mounted ? "visible" : ""}`} ref={cardRef}>
          {/* Logo */}
          <div className="logo-wrap">
            <div className="logo-icon">🌿</div>
            <div>
              <div className="logo-text">ResQ<span className="logo-accent">Plate</span></div>
              <div className="logo-tagline">Food Rescue Network</div>
            </div>
          </div>

          <h2 className="heading">Welcome back</h2>
          <p className="subheading">Sign in to continue your mission</p>
          <div className="divider" />

          {/* Error */}
          {error && (
            <div className="error-box">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="field">
              <label className="field-label">Email Address</label>
              <div className={`input-wrap ${focused === "email" ? "focused" : ""}`}>
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="3"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="field">
              <label className="field-label">Password</label>
              <div className={`input-wrap ${focused === "password" ? "focused" : ""}`}>
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused(null)}
                  placeholder="Min. 8 characters"
                  minLength={8}
                  required
                  autoComplete="current-password"
                  style={{ paddingRight: "48px" }}
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
              {form.password.length > 0 && form.password.length < 8 && (
                <p className="pw-hint">⚠ At least 8 characters required</p>
              )}
            </div>

            {/* Submit */}
            <button type="submit" className="submit-btn" disabled={loading || authLoading}>
              {loading ? (
                <><span className="spinner" />Signing in…</>
              ) : (
                <>Sign In →</>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="social-divider">
            <div className="social-line" />
            <span className="social-label">Trusted & Secure</span>
            <div className="social-line" />
          </div>

          {/* Trust badges */}
          <div className="trust-badges">
            <div className="badge"><div className="badge-dot" />SSL Encrypted</div>
            <div className="badge"><div className="badge-dot" />GDPR Safe</div>
            <div className="badge"><div className="badge-dot" />Zero Waste</div>
          </div>

          {/* Footer */}
          <p className="footer-text">
            New to ResQPlate?{" "}
            <Link to="/register" className="signup-link">Create a free account →</Link>
          </p>
        </div>
      </div>
    </>
  );
}