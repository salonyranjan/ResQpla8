import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

/* ═══════════════════════════════════════════════════════
   LOGIN.JSX — God-Level Edition
   Features: Dark/Light mode, animated background, social
   auth, biometric hint, remember me, role selector,
   strength meter, particle canvas, micro-animations
═══════════════════════════════════════════════════════ */

/* ── Inline global styles ── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=DM+Mono:wght@400;500&display=swap');

  .lp-root *, .lp-root *::before, .lp-root *::after { box-sizing: border-box; margin: 0; padding: 0; }
  .lp-root { font-family: 'DM Sans', system-ui, sans-serif; }
  .lp-root h1, .lp-root h2 { font-family: 'Syne', system-ui, sans-serif; }
  .lp-root .mono { font-family: 'DM Mono', monospace; }

  /* Scrollbar */
  .lp-root ::-webkit-scrollbar { width: 4px; }
  .lp-root ::-webkit-scrollbar-thumb { background: rgba(82,183,136,0.3); border-radius: 10px; }

  /* Animations */
  @keyframes lp-float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
  @keyframes lp-spin    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes lp-shake   { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-6px)} 40%,80%{transform:translateX(6px)} }
  @keyframes lp-slide-up{ from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes lp-fade-in { from{opacity:0} to{opacity:1} }
  @keyframes lp-ping    { 0%{transform:scale(1);opacity:0.6} 80%,100%{transform:scale(2.2);opacity:0} }
  @keyframes lp-shimmer { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
  @keyframes lp-pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.3;transform:scale(0.6)} }
  @keyframes lp-gradient-shift {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes lp-morph {
    0%,100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
    25%     { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
    50%     { border-radius: 50% 60% 30% 60% / 30% 40% 70% 50%; }
    75%     { border-radius: 40% 60% 60% 40% / 60% 30% 60% 40%; }
  }

  /* Input group */
  .lp-input-wrap { position: relative; }
  .lp-input-wrap .lp-input-icon {
    position: absolute; left: 16px; top: 50%; transform: translateY(-50%);
    transition: color 0.2s; pointer-events: none; z-index: 1;
  }
  .lp-input-wrap .lp-input-icon-right {
    position: absolute; right: 16px; top: 50%; transform: translateY(-50%);
    cursor: pointer; z-index: 1;
  }

  /* Input base */
  .lp-input {
    width: 100%; padding: 15px 16px 15px 48px;
    border-radius: 16px; font-size: 14.5px;
    font-family: 'DM Sans', sans-serif;
    outline: none; transition: all 0.25s;
    border: 1.5px solid transparent;
  }
  .lp-input.with-right { padding-right: 48px; }

  /* Light mode input */
  .lp-light .lp-input {
    background: rgba(0,0,0,0.04);
    border-color: rgba(0,0,0,0.09);
    color: #0a1a0d;
  }
  .lp-light .lp-input::placeholder { color: rgba(0,0,0,0.3); }
  .lp-light .lp-input:focus {
    background: #fff;
    border-color: #2d8a55;
    box-shadow: 0 0 0 4px rgba(45,138,85,0.1);
  }
  .lp-light .lp-input-icon { color: rgba(0,0,0,0.35); }
  .lp-light .lp-input-wrap:focus-within .lp-input-icon { color: #2d8a55; }
  .lp-light .lp-input-icon-right { color: rgba(0,0,0,0.35); }
  .lp-light .lp-input-icon-right:hover { color: #2d8a55; }

  /* Dark mode input */
  .lp-dark .lp-input {
    background: rgba(255,255,255,0.05);
    border-color: rgba(255,255,255,0.08);
    color: #fff;
  }
  .lp-dark .lp-input::placeholder { color: rgba(255,255,255,0.25); }
  .lp-dark .lp-input:focus {
    background: rgba(255,255,255,0.08);
    border-color: #52b788;
    box-shadow: 0 0 0 4px rgba(82,183,136,0.12);
  }
  .lp-dark .lp-input-icon { color: rgba(255,255,255,0.3); }
  .lp-dark .lp-input-wrap:focus-within .lp-input-icon { color: #52b788; }
  .lp-dark .lp-input-icon-right { color: rgba(255,255,255,0.35); }
  .lp-dark .lp-input-icon-right:hover { color: #52b788; }

  /* Error shake */
  .lp-shake { animation: lp-shake 0.45s ease; }

  /* Role button */
  .lp-role-btn {
    flex: 1; padding: 10px 6px; border-radius: 12px;
    font-family: 'DM Sans', sans-serif; font-size: 12.5px; font-weight: 600;
    cursor: pointer; transition: all 0.2s; border: 1.5px solid transparent;
    display: flex; flex-direction: column; align-items: center; gap: 4px;
  }
  .lp-light .lp-role-btn {
    background: rgba(0,0,0,0.04); border-color: rgba(0,0,0,0.08); color: rgba(0,0,0,0.45);
  }
  .lp-light .lp-role-btn.active {
    background: #2d8a55; border-color: #2d8a55; color: #fff;
    box-shadow: 0 6px 20px rgba(45,138,85,0.35);
  }
  .lp-dark .lp-role-btn {
    background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.07); color: rgba(255,255,255,0.4);
  }
  .lp-dark .lp-role-btn.active {
    background: linear-gradient(135deg,#2d8a55,#52b788); border-color: #52b788; color: #fff;
    box-shadow: 0 6px 24px rgba(82,183,136,0.3);
  }

  /* Social btn */
  .lp-social-btn {
    display: flex; align-items: center; justify-content: center; gap: 10px;
    padding: 12px 0; border-radius: 14px; font-size: 14px; font-weight: 600;
    cursor: pointer; transition: all 0.2s; font-family: 'DM Sans', sans-serif;
  }
  .lp-light .lp-social-btn {
    background: rgba(0,0,0,0.04); border: 1.5px solid rgba(0,0,0,0.09); color: #0a1a0d;
  }
  .lp-light .lp-social-btn:hover { background: rgba(0,0,0,0.07); transform: translateY(-2px); }
  .lp-dark .lp-social-btn {
    background: rgba(255,255,255,0.05); border: 1.5px solid rgba(255,255,255,0.08); color: #fff;
  }
  .lp-dark .lp-social-btn:hover { background: rgba(255,255,255,0.1); transform: translateY(-2px); }

  /* Divider */
  .lp-divider {
    display: flex; align-items: center; gap: 14px;
    font-size: 11.5px; font-weight: 500; letter-spacing: 0.08em;
    text-transform: uppercase; font-family: 'DM Mono', monospace;
  }
  .lp-divider::before, .lp-divider::after {
    content: ''; flex: 1; height: 1px;
  }
  .lp-light .lp-divider { color: rgba(0,0,0,0.25); }
  .lp-light .lp-divider::before, .lp-light .lp-divider::after { background: rgba(0,0,0,0.08); }
  .lp-dark .lp-divider { color: rgba(255,255,255,0.2); }
  .lp-dark .lp-divider::before, .lp-dark .lp-divider::after { background: rgba(255,255,255,0.08); }

  /* Submit button */
  .lp-submit {
    width: 100%; padding: 15px 0; border-radius: 16px; border: none;
    font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700;
    cursor: pointer; transition: all 0.25s; position: relative; overflow: hidden;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    background: linear-gradient(135deg, #1a6b3c, #2d8a55, #52b788, #2d8a55, #1a6b3c);
    background-size: 300% 300%;
    animation: lp-gradient-shift 4s ease infinite;
    color: #fff;
    box-shadow: 0 12px 40px rgba(45,138,85,0.45);
  }
  .lp-submit:hover { transform: translateY(-2px); box-shadow: 0 20px 52px rgba(45,138,85,0.55); }
  .lp-submit:active { transform: translateY(0); }
  .lp-submit:disabled { opacity: 0.65; cursor: not-allowed; transform: none; animation: none; background: #2d8a55; }
  .lp-submit::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
    transform: translateX(-100%); transition: transform 0.5s;
  }
  .lp-submit:hover::before { transform: translateX(100%); }

  /* Checkbox */
  .lp-checkbox { appearance: none; width: 18px; height: 18px; border-radius: 6px; cursor: pointer; transition: all 0.2s; flex-shrink: 0; }
  .lp-light .lp-checkbox { border: 1.5px solid rgba(0,0,0,0.15); background: rgba(0,0,0,0.03); }
  .lp-light .lp-checkbox:checked { background: #2d8a55; border-color: #2d8a55; }
  .lp-dark .lp-checkbox { border: 1.5px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.05); }
  .lp-dark .lp-checkbox:checked { background: #52b788; border-color: #52b788; }

  /* Strength bar */
  .lp-strength-bar {
    height: 3px; border-radius: 100px;
    transition: width 0.4s ease, background 0.4s ease;
  }

  /* Mode toggle */
  .lp-mode-toggle {
    width: 48px; height: 26px; border-radius: 100px; cursor: pointer;
    position: relative; transition: background 0.3s; border: none;
    flex-shrink: 0;
  }
  .lp-mode-toggle::after {
    content: ''; position: absolute; top: 3px; left: 3px;
    width: 20px; height: 20px; border-radius: 50%;
    background: #fff; transition: transform 0.3s;
    box-shadow: 0 2px 6px rgba(0,0,0,0.25);
  }
  .lp-mode-toggle.dark-mode { background: #2d8a55; }
  .lp-mode-toggle.dark-mode::after { transform: translateX(22px); }
  .lp-mode-toggle.light-mode { background: rgba(0,0,0,0.15); }

  /* Toast */
  .lp-toast {
    position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%);
    z-index: 9999; padding: 13px 24px; border-radius: 100px;
    font-size: 13.5px; font-weight: 600; font-family: 'DM Sans', sans-serif;
    display: flex; align-items: center; gap: 9px;
    backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.15);
    box-shadow: 0 16px 48px rgba(0,0,0,0.35);
    animation: lp-slide-up 0.3s ease;
    white-space: nowrap;
  }
  .lp-toast.success { background: rgba(45,138,85,0.92); color: #fff; }
  .lp-toast.error   { background: rgba(220,38,38,0.92);  color: #fff; }

  /* Floating label */
  .lp-label {
    display: block; font-size: 11px; font-weight: 600;
    letter-spacing: 0.12em; text-transform: uppercase;
    margin-bottom: 8px; font-family: 'DM Mono', monospace;
  }
  .lp-light .lp-label { color: rgba(0,0,0,0.4); }
  .lp-dark  .lp-label { color: rgba(255,255,255,0.35); }
`;

/* ── SVG Icons ── */
const Icon = {
  Mail: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
    </svg>
  ),
  Lock: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  ),
  Eye: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  EyeOff: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/>
    </svg>
  ),
  Sun: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
    </svg>
  ),
  Moon: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
    </svg>
  ),
  Spinner: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: "lp-spin 0.75s linear infinite" }}>
      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
    </svg>
  ),
  Arrow: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  ),
  Fingerprint: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 4"/><path d="M5 19.5C5.5 18 6 15 6 12c0-1.7.7-3.3 1.8-4.5"/><path d="M17.5 12c0 4.8-1 7.7-3.5 10"/><path d="M8.5 22C9 20.8 10 18 10 12c0-1.1.4-2.2 1-3"/><path d="M21 12a9 9 0 1 0-7.5 8.8"/>
    </svg>
  ),
  Google: () => (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  ),
};

/* ── Animated Canvas Background ── */
const AnimatedBg = ({ dark }) => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: 38 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2.8 + 0.8,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.5 + 0.1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = dark
          ? `rgba(82,183,136,${p.alpha})`
          : `rgba(26,107,60,${p.alpha * 0.6})`;
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[j].x - p.x;
          const dy = particles[j].y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 90) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = dark
              ? `rgba(82,183,136,${(1 - dist / 90) * 0.12})`
              : `rgba(26,107,60,${(1 - dist / 90) * 0.07})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [dark]);

  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />;
};

/* ── Password strength ── */
const getStrength = (pw) => {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
};
const STRENGTH_META = [
  { label: "Too short",  color: "#ef4444", width: "15%" },
  { label: "Weak",       color: "#f97316", width: "35%" },
  { label: "Fair",       color: "#eab308", width: "60%" },
  { label: "Good",       color: "#22c55e", width: "80%" },
  { label: "Strong 💪",  color: "#10b981", width: "100%" },
];

/* ── Toast component ── */
const Toast = ({ toast }) => {
  if (!toast) return null;
  return (
    <div className={`lp-toast ${toast.type}`}>
      <span>{toast.type === "success" ? "✓" : "⚠"}</span>
      {toast.message}
    </div>
  );
};

/* ══════════════════════════════════════
   MAIN LOGIN COMPONENT
══════════════════════════════════════ */
const Login = () => {
  const navigate = useNavigate();

  /* ── State ── */
  const [dark, setDark]               = useState(() => window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false);
  const [form, setForm]               = useState({ email: "", password: "", role: "donor" });
  const [showPw, setShowPw]           = useState(false);
  const [remember, setRemember]       = useState(true);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");
  const [shake, setShake]             = useState(false);
  const [toast, setToast]             = useState(null);
  const [step, setStep]               = useState("credentials"); // credentials | 2fa
  const [twoFa, setTwoFa]             = useState(["", "", "", "", "", ""]);
  const [emailFocused, setEmailFocused] = useState(false);
  const formRef = useRef(null);

  /* ── Inject styles ── */
  useEffect(() => {
    if (document.getElementById("lp-styles")) return;
    const el = document.createElement("style");
    el.id = "lp-styles";
    el.textContent = STYLES;
    document.head.appendChild(el);
    return () => document.getElementById("lp-styles")?.remove();
  }, []);

  /* ── Restore remember-me ── */
  useEffect(() => {
    const saved = localStorage.getItem("rq_email");
    if (saved) setForm(f => ({ ...f, email: saved }));
  }, []);

  /* ── Toast helper ── */
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3200);
  };

  /* ── Handle change ── */
  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  /* ── Submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      triggerShake();
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Demo mode — bypass real API for preview
      await new Promise(r => setTimeout(r, 1400));
      // const res = await axios.post("http://localhost:5000/api/login", form);
      // localStorage.setItem("token", res.data.token);

      if (remember) localStorage.setItem("rq_email", form.email);
      else localStorage.removeItem("rq_email");

      showToast("Welcome back! Redirecting…", "success");
      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid email or password.";
      setError(msg);
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  /* ── 2FA OTP input ── */
  const otp2faRefs = useRef([]);
  const handle2Fa = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...twoFa];
    next[i] = val;
    setTwoFa(next);
    if (val && i < 5) otp2faRefs.current[i + 1]?.focus();
    if (next.every(d => d) && next.join("") === "123456") {
      showToast("2FA verified! Logging in…");
      setTimeout(() => navigate("/dashboard"), 1000);
    }
  };

  /* ── Social login placeholder ── */
  const handleSocial = (provider) => {
    showToast(`${provider} login coming soon!`, "error");
  };

  /* ── Design tokens ── */
  const D = {
    bg:        dark ? "#071008"        : "#f0f5f1",
    panel:     dark ? "rgba(10,22,14,0.95)" : "rgba(255,255,255,0.97)",
    text:      dark ? "#ffffff"         : "#0a1a0d",
    textMuted: dark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.4)",
    textFaint: dark ? "rgba(255,255,255,0.2)"  : "rgba(0,0,0,0.2)",
    border:    dark ? "rgba(82,183,136,0.12)"  : "rgba(0,0,0,0.08)",
    accent:    dark ? "#52b788" : "#2d8a55",
    gold:      "#d4a017",
    error:     "#ef4444",
    heroBg:    dark
      ? "linear-gradient(148deg,#071008 0%,#0f2418 50%,#071008 100%)"
      : "linear-gradient(148deg,#122a1a 0%,#1e4d35 50%,#0f2418 100%)",
  };

  const ROLES = [
    { id: "donor", emoji: "🍱", label: "Donor" },
    { id: "ngo",   emoji: "🤝", label: "NGO" },
    { id: "admin", emoji: "🛡️", label: "Admin" },
  ];

  const strength = form.password ? getStrength(form.password) : -1;
  const strengthMeta = strength >= 0 ? STRENGTH_META[strength] : null;

  return (
    <div
      className={`lp-root lp-${dark ? "dark" : "light"}`}
      style={{
        minHeight: "100vh",
        display: "flex",
        background: D.bg,
        position: "relative",
        overflow: "hidden",
        transition: "background 0.4s",
      }}
    >
      {/* ── Background canvas ── */}
      <AnimatedBg dark={dark} />

      {/* ── Morphing blobs ── */}
      <div style={{
        position: "fixed", width: 600, height: 600, borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
        background: dark
          ? "radial-gradient(circle, rgba(45,138,85,0.08) 0%, transparent 70%)"
          : "radial-gradient(circle, rgba(45,138,85,0.06) 0%, transparent 70%)",
        top: "-10%", left: "-5%",
        animation: "lp-morph 18s ease-in-out infinite",
        pointerEvents: "none", zIndex: 0,
      }} />
      <div style={{
        position: "fixed", width: 500, height: 500, borderRadius: "40% 60% 70% 30% / 40% 70% 30% 60%",
        background: dark
          ? "radial-gradient(circle, rgba(82,183,136,0.06) 0%, transparent 70%)"
          : "radial-gradient(circle, rgba(26,107,60,0.04) 0%, transparent 70%)",
        bottom: "-10%", right: "-5%",
        animation: "lp-morph 22s ease-in-out infinite reverse",
        pointerEvents: "none", zIndex: 0,
      }} />

      {/* ══════════════════════════════
          LEFT HERO PANEL
      ══════════════════════════════ */}
      <div style={{
        display: "none",
        width: "48%",
        background: D.heroBg,
        position: "relative",
        overflow: "hidden",
        flexDirection: "column",
        justifyContent: "center",
        padding: "60px 64px",
        zIndex: 1,
        // show on desktop
        ...(typeof window !== "undefined" && window.innerWidth > 1024 ? { display: "flex" } : {}),
      }}
        className="lp-hero-panel"
      >
        <style>{`.lp-hero-panel { display: none !important; } @media(min-width:1024px){ .lp-hero-panel { display: flex !important; } }`}</style>

        {/* BG image */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.22,
          backgroundImage: "url('https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=1470&auto=format&fit=crop')",
          backgroundSize: "cover", backgroundPosition: "center",
        }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(7,16,8,0.92) 0%, rgba(18,42,26,0.75) 100%)" }} />

        {/* Decorative rings */}
        {[380, 560, 740].map((s, i) => (
          <div key={i} style={{
            position: "absolute", width: s, height: s, borderRadius: "50%",
            border: `1px solid rgba(82,183,136,${0.06 - i * 0.015})`,
            top: "50%", left: "50%", transform: "translate(-50%,-50%)",
            animation: `lp-spin ${60 + i * 20}s linear infinite${i % 2 ? " reverse" : ""}`,
            pointerEvents: "none",
          }} />
        ))}

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Brand */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 64 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 13,
              background: "linear-gradient(135deg,#2d8a55,#0d9488)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
            }}>🌿</div>
            <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.03em" }}>
              ResQ<span style={{ color: "#d4a017" }}>Plate</span>
            </span>
          </div>

          {/* Icon */}
          <div style={{
            width: 72, height: 72, borderRadius: 24,
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.12)",
            backdropFilter: "blur(12px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 32, marginBottom: 36,
            animation: "lp-float 5s ease-in-out infinite",
          }}>🔐</div>

          <h1 style={{
            fontFamily: "'Syne',sans-serif",
            fontSize: "clamp(40px,4.5vw,64px)",
            fontWeight: 800, color: "#fff",
            lineHeight: 0.95, marginBottom: 24,
            letterSpacing: "-0.04em",
          }}>
            Welcome<br />
            <span style={{
              background: "linear-gradient(115deg,#d4a017,#f0c040,#d4a017)",
              backgroundSize: "200% 200%",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              animation: "lp-shimmer 3s ease infinite",
            }}>Back.</span>
          </h1>

          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.48)", lineHeight: 1.88, maxWidth: 360, marginBottom: 52, fontWeight: 300 }}>
            Every login brings us one step closer to a world with zero hunger. Continue your journey with ResQPlate.
          </p>

          {/* Stats */}
          <div style={{ display: "flex", gap: 32 }}>
            {[
              { val: "12K+", label: "Meals Rescued" },
              { val: "54",   label: "NGO Partners" },
              { val: "98%",  label: "Satisfaction" },
            ].map((s, i) => (
              <div key={i}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 800, color: "#52b788", lineHeight: 1 }}>{s.val}</div>
                <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.35)", marginTop: 4, fontFamily: "'DM Mono',monospace", letterSpacing: "0.06em" }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Live dot */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 48 }}>
            <div style={{ position: "relative", width: 10, height: 10 }}>
              <div style={{ position: "absolute", inset: 0, background: "#52b788", borderRadius: "50%", animation: "lp-ping 2s ease-out infinite" }} />
              <div style={{ width: 10, height: 10, background: "#52b788", borderRadius: "50%" }} />
            </div>
            <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 10.5, color: "rgba(149,213,178,0.7)", letterSpacing: "0.08em" }}>
              47 active rescues right now
            </span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════
          RIGHT FORM PANEL
      ══════════════════════════════ */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
        position: "relative",
        zIndex: 1,
        overflowY: "auto",
      }}>
        {/* Dark mode toggle — top right */}
        <div style={{ position: "absolute", top: 24, right: 24, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 14, color: D.textMuted }}>{dark ? <Icon.Moon /> : <Icon.Sun />}</span>
          <button
            className={`lp-mode-toggle ${dark ? "dark-mode" : "light-mode"}`}
            onClick={() => setDark(d => !d)}
            title="Toggle dark mode"
          />
        </div>

        {/* Mobile brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 40 }} className="lp-mobile-brand">
          <style>{`@media(min-width:1024px){ .lp-mobile-brand { display: none !important; } }`}</style>
          <div style={{ width: 34, height: 34, borderRadius: 11, background: "linear-gradient(135deg,#2d8a55,#0d9488)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>🌿</div>
          <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 18, fontWeight: 800, color: D.text }}>
            ResQ<span style={{ color: "#d4a017" }}>Plate</span>
          </span>
        </div>

        {/* Card */}
        <div
          ref={formRef}
          className={shake ? "lp-shake" : ""}
          style={{
            width: "100%", maxWidth: 440,
            background: D.panel,
            borderRadius: 28,
            padding: "40px 36px",
            boxShadow: dark
              ? "0 48px 120px rgba(0,0,0,0.7), 0 0 0 1px rgba(82,183,136,0.1)"
              : "0 32px 80px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06)",
            backdropFilter: "blur(24px)",
            animation: "lp-slide-up 0.5s ease",
          }}
        >
          {step === "credentials" ? (
            <>
              {/* Header */}
              <div style={{ marginBottom: 32 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 14, background: dark ? "rgba(82,183,136,0.12)" : "rgba(45,138,85,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 20 }}>👋</span>
                  </div>
                  <div>
                    <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 800, color: D.text, lineHeight: 1.1 }}>Sign In</h2>
                    <div style={{ fontSize: 12.5, color: D.textMuted, marginTop: 2 }}>Access your ResQPlate dashboard</div>
                  </div>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div style={{
                  marginBottom: 20, padding: "12px 16px",
                  background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.22)",
                  borderRadius: 14, fontSize: 13.5, color: "#ef4444",
                  display: "flex", alignItems: "center", gap: 9,
                  animation: "lp-slide-up 0.2s ease",
                }}>
                  <span style={{ fontSize: 16 }}>⚠️</span> {error}
                </div>
              )}

              {/* Social logins */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 22 }}>
                <button className="lp-social-btn" onClick={() => handleSocial("Google")}>
                  <Icon.Google /> Google
                </button>
                <button className="lp-social-btn" onClick={() => handleSocial("Biometric")}>
                  <Icon.Fingerprint />
                  <span style={{ fontSize: 13.5, fontWeight: 600 }}>Biometric</span>
                </button>
              </div>

              <div className="lp-divider" style={{ marginBottom: 22 }}>or</div>

              {/* Role selector */}
              <div style={{ marginBottom: 20 }}>
                <label className="lp-label">Login As</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {ROLES.map(r => (
                    <button
                      key={r.id}
                      type="button"
                      className={`lp-role-btn${form.role === r.id ? " active" : ""}`}
                      onClick={() => setForm(f => ({ ...f, role: r.id }))}
                    >
                      <span style={{ fontSize: 18 }}>{r.emoji}</span>
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Email */}
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 14 }}>
                  <label className="lp-label">Email Address</label>
                  <div className="lp-input-wrap">
                    <span className="lp-input-icon"><Icon.Mail /></span>
                    <input
                      className="lp-input"
                      type="email"
                      name="email"
                      value={form.email}
                      placeholder="you@example.com"
                      autoComplete="email"
                      required
                      onChange={handleChange}
                      onFocus={() => setEmailFocused(true)}
                      onBlur={() => setEmailFocused(false)}
                    />
                  </div>
                </div>

                {/* Password */}
                <div style={{ marginBottom: 8 }}>
                  <label className="lp-label">Password</label>
                  <div className="lp-input-wrap">
                    <span className="lp-input-icon"><Icon.Lock /></span>
                    <input
                      className="lp-input with-right"
                      type={showPw ? "text" : "password"}
                      name="password"
                      value={form.password}
                      placeholder="Your password"
                      autoComplete="current-password"
                      required
                      onChange={handleChange}
                    />
                    <span className="lp-input-icon-right" onClick={() => setShowPw(v => !v)}>
                      {showPw ? <Icon.EyeOff /> : <Icon.Eye />}
                    </span>
                  </div>
                </div>

                {/* Strength bar */}
                {form.password && (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ height: 3, background: dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)", borderRadius: 100, overflow: "hidden" }}>
                      <div className="lp-strength-bar" style={{ width: strengthMeta?.width, background: strengthMeta?.color }} />
                    </div>
                    <div style={{ fontSize: 10.5, color: strengthMeta?.color, marginTop: 5, fontFamily: "'DM Mono',monospace", fontWeight: 500 }}>
                      {strengthMeta?.label}
                    </div>
                  </div>
                )}

                {/* Remember + Forgot */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13.5, color: D.textMuted, userSelect: "none" }}>
                    <input type="checkbox" className="lp-checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
                    Remember me
                  </label>
                  <button type="button" style={{
                    background: "none", border: "none", cursor: "pointer",
                    fontSize: 13.5, fontWeight: 600, color: D.accent,
                    fontFamily: "'DM Sans',sans-serif",
                  }}
                    onClick={() => showToast("Password reset email sent!", "success")}
                  >Forgot password?</button>
                </div>

                {/* Submit */}
                <button type="submit" className="lp-submit" disabled={loading}>
                  {loading ? <><Icon.Spinner /> Signing in…</> : <>Sign In <Icon.Arrow /></>}
                </button>
              </form>

              {/* 2FA link */}
              <div style={{ textAlign: "center", marginTop: 18 }}>
                <button
                  type="button"
                  onClick={() => setStep("2fa")}
                  style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12.5, color: D.textMuted, fontFamily: "'DM Sans',sans-serif" }}
                >
                  Have a 2FA code? →
                </button>
              </div>

              {/* Footer */}
              <div style={{ textAlign: "center", marginTop: 28, paddingTop: 24, borderTop: `1px solid ${D.border}` }}>
                <span style={{ fontSize: 13.5, color: D.textMuted }}>Don't have an account? </span>
                <Link to="/register" style={{ fontSize: 13.5, fontWeight: 700, color: D.accent, textDecoration: "none" }}>
                  Sign up free →
                </Link>
              </div>
            </>
          ) : (
            /* ── 2FA Step ── */
            <div style={{ animation: "lp-slide-up 0.35s ease" }}>
              <button
                onClick={() => setStep("credentials")}
                style={{ background: "none", border: "none", cursor: "pointer", color: D.textMuted, fontSize: 13.5, marginBottom: 28, display: "flex", alignItems: "center", gap: 6, fontFamily: "'DM Sans',sans-serif" }}
              >← Back</button>

              <div style={{ textAlign: "center", marginBottom: 32 }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🔐</div>
                <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 800, color: D.text, marginBottom: 8 }}>Two-Factor Auth</h2>
                <p style={{ fontSize: 14, color: D.textMuted, lineHeight: 1.7 }}>
                  Enter the 6-digit code from your authenticator app. (Demo: <span className="mono" style={{ color: D.accent }}>123456</span>)
                </p>
              </div>

              <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 28 }}>
                {twoFa.map((digit, i) => (
                  <input
                    key={i}
                    ref={el => otp2faRefs.current[i] = el}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handle2Fa(i, e.target.value)}
                    onKeyDown={e => {
                      if (e.key === "Backspace" && !twoFa[i] && i > 0) {
                        otp2faRefs.current[i - 1]?.focus();
                      }
                    }}
                    style={{
                      width: 52, height: 58, textAlign: "center",
                      fontSize: 22, fontFamily: "'DM Mono',monospace", fontWeight: 600,
                      borderRadius: 16, outline: "none", transition: "all 0.2s",
                      background: dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
                      border: `2px solid ${digit ? D.accent : (dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)")}`,
                      color: D.text,
                      boxShadow: digit ? `0 0 0 3px ${D.accent}22` : "none",
                    }}
                  />
                ))}
              </div>

              <button
                onClick={() => setStep("credentials")}
                className="lp-submit"
              >Verify Code <Icon.Arrow /></button>
            </div>
          )}
        </div>

        {/* Footer note */}
        <div style={{ marginTop: 28, fontSize: 11.5, color: D.textFaint, textAlign: "center", fontFamily: "'DM Mono',monospace", letterSpacing: "0.04em" }}>
          🛡️ 256-bit SSL · GDPR Compliant · No spam, ever
        </div>
      </div>

      {/* Toast */}
      <Toast toast={toast} />
    </div>
  );
};

export default Login;