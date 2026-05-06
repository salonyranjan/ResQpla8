import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/* ─── Theme Toggle ────────────────────────────────────────────── */
function ThemeToggle({ dark, onToggle }) {
  return (
    <button
      onClick={onToggle}
      aria-label="Toggle theme"
      style={{
        position: "fixed",
        top: "1.25rem",
        right: "1.25rem",
        zIndex: 100,
        width: "2.75rem",
        height: "2.75rem",
        borderRadius: "50%",
        border: dark ? "1.5px solid rgba(74,222,128,0.25)" : "1.5px solid rgba(0,0,0,0.10)",
        background: dark ? "rgba(17,28,20,0.85)" : "rgba(255,255,255,0.85)",
        backdropFilter: "blur(12px)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "1.1rem",
        boxShadow: dark
          ? "0 2px 20px rgba(74,222,128,0.12)"
          : "0 2px 20px rgba(0,0,0,0.08)",
        transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
      }}
    >
      {dark ? "☀️" : "🌙"}
    </button>
  );
}

/* ─── Floating orbs background ───────────────────────────────── */
function Orbs({ dark }) {
  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      <div style={{
        position: "absolute", top: "-15%", left: "-10%",
        width: "55vw", height: "55vw", borderRadius: "50%",
        background: dark
          ? "radial-gradient(circle, rgba(16,185,129,0.13) 0%, transparent 70%)"
          : "radial-gradient(circle, rgba(16,185,129,0.10) 0%, transparent 70%)",
        animation: "floatA 14s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute", bottom: "-20%", right: "-10%",
        width: "60vw", height: "60vw", borderRadius: "50%",
        background: dark
          ? "radial-gradient(circle, rgba(245,158,11,0.10) 0%, transparent 70%)"
          : "radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)",
        animation: "floatB 18s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute", top: "40%", left: "60%",
        width: "30vw", height: "30vw", borderRadius: "50%",
        background: dark
          ? "radial-gradient(circle, rgba(20,184,166,0.08) 0%, transparent 70%)"
          : "radial-gradient(circle, rgba(20,184,166,0.07) 0%, transparent 70%)",
        animation: "floatC 22s ease-in-out infinite",
      }} />
    </div>
  );
}

/* ─── Input Field ─────────────────────────────────────────────── */
function Field({ label, name, type = "text", value, onChange, placeholder, error, dark, icon }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: "0.1rem" }}>
      <label style={{
        display: "block",
        fontSize: "0.68rem",
        fontWeight: 700,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: dark ? "rgba(134,239,172,0.5)" : "rgba(71,85,105,0.7)",
        marginBottom: "0.5rem",
        fontFamily: "'DM Mono', monospace",
      }}>{icon} {label}</label>
      <div style={{ position: "relative" }}>
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "0.875rem 1rem",
            background: dark
              ? focused ? "rgba(16,185,129,0.06)" : "rgba(255,255,255,0.03)"
              : focused ? "rgba(16,185,129,0.04)" : "rgba(248,250,252,1)",
            border: error
              ? "1.5px solid rgba(239,68,68,0.7)"
              : focused
                ? "1.5px solid rgba(16,185,129,0.7)"
                : dark
                  ? "1.5px solid rgba(74,222,128,0.12)"
                  : "1.5px solid rgba(203,213,225,1)",
            borderRadius: "0.75rem",
            fontSize: "0.9rem",
            color: dark ? "rgba(240,253,244,0.9)" : "rgba(15,23,42,0.9)",
            outline: "none",
            fontFamily: "'Outfit', sans-serif",
            transition: "all 0.25s ease",
            boxShadow: focused
              ? dark
                ? "0 0 0 3px rgba(16,185,129,0.12), 0 4px 16px rgba(0,0,0,0.3)"
                : "0 0 0 3px rgba(16,185,129,0.10), 0 4px 16px rgba(0,0,0,0.06)"
              : dark
                ? "0 2px 8px rgba(0,0,0,0.3)"
                : "0 1px 4px rgba(0,0,0,0.04)",
          }}
        />
      </div>
      {error && (
        <p style={{
          marginTop: "0.35rem",
          fontSize: "0.72rem",
          color: "rgba(239,68,68,0.9)",
          fontFamily: "'DM Mono', monospace",
          display: "flex",
          alignItems: "center",
          gap: "0.25rem",
        }}>⚠ {error}</p>
      )}
    </div>
  );
}

/* ─── Password Strength ───────────────────────────────────────── */
function PasswordStrength({ password, dark }) {
  if (!password) return null;
  const strength = password.length >= 12 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)
    ? 4 : password.length >= 10 && /[A-Z]/.test(password) && /[0-9]/.test(password)
    ? 3 : password.length >= 8
    ? 2 : 1;
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["", "#ef4444", "#f59e0b", "#10b981", "#10b981"];
  return (
    <div style={{ marginTop: "0.5rem" }}>
      <div style={{ display: "flex", gap: "0.25rem", marginBottom: "0.25rem" }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{
            flex: 1, height: "3px", borderRadius: "9999px",
            background: i <= strength ? colors[strength] : dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
            transition: "background 0.3s ease",
          }} />
        ))}
      </div>
      <p style={{
        fontSize: "0.7rem",
        color: colors[strength],
        fontFamily: "'DM Mono', monospace",
        letterSpacing: "0.05em",
      }}>{labels[strength]}</p>
    </div>
  );
}

/* ─── Main Component ──────────────────────────────────────────── */
export default function Signup() {
  const { register, loading: authLoading, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (user && !authLoading) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, authLoading, navigate]);

  // Read ?role= from URL and pre-select the correct role
  useEffect(() => {
    const roleParam = searchParams.get("role");
    if (roleParam && ["donor", "ngo", "volunteer"].includes(roleParam)) {
      setForm(f => ({ ...f, role: roleParam }));
    }
  }, [searchParams]);

  const [dark, setDark] = useState(true);
  const [step, setStep] = useState(0);
  const [animDir, setAnimDir] = useState(1); // 1 = forward, -1 = back
  const [visible, setVisible] = useState(true);
  const [form, setForm] = useState({
    role: "donor", name: "", email: "", phone: "",
    orgName: "", password: "", confirmPw: "",
    latitude: "", longitude: "", city: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [locating, setLocating] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === "checkbox" ? checked : value }));
    setErrors(e2 => ({ ...e2, [name]: "" }));
    setError("");
  };

  const validate = () => {
    const e = {};
    if (step === 0 && !form.role) e.role = "Please select a role";
    if (step === 1) {
      if (!form.name.trim()) e.name = "Name is required";
      if (!form.email.includes("@")) e.email = "Enter a valid email";
      if (form.role === "ngo" && !form.orgName.trim()) e.orgName = "Organization name required";
    }
    if (step === 2) {
      if (form.password.length < 8) e.password = "Minimum 8 characters";
      if (form.password !== form.confirmPw) e.confirmPw = "Passwords don't match";
    }
    if (step === 3) {
      if (!form.latitude || !form.longitude) e.location = "Please detect your location";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const transition = (dir, fn) => {
    setAnimDir(dir);
    setVisible(false);
    setTimeout(() => { fn(); setVisible(true); }, 220);
  };

  const goNext = () => { if (!validate()) return; transition(1, () => setStep(s => Math.min(s + 1, 3))); };
  const goPrev = () => transition(-1, () => setStep(s => Math.max(s - 1, 0)));

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true); setError("");
    try {
      await register(form.email, form.password, form.name);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLocate = () => {
    if (!navigator.geolocation) { setError("Geolocation not supported"); return; }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm(f => ({
          ...f,
          latitude: pos.coords.latitude.toFixed(6),
          longitude: pos.coords.longitude.toFixed(6),
        }));
        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`)
          .then(r => r.json())
          .then(d => {
            const city = d.address?.city || d.address?.town || d.address?.village || "";
            if (city) setForm(f => ({ ...f, city }));
          })
          .catch(() => {})
          .finally(() => setLocating(false));
      },
      () => { setError("Could not get location"); setLocating(false); }
    );
  };

  const roles = [
    { id: "donor", emoji: "🍱", label: "Food Donor", desc: "Restaurant, hotel or individual with surplus food", color: "#10b981" },
    { id: "ngo", emoji: "🤝", label: "NGO Partner", desc: "Verified nonprofit collecting and distributing meals", color: "#f59e0b" },
    { id: "volunteer", emoji: "🚴", label: "Volunteer", desc: "Individual helping with pickups and deliveries", color: "#14b8a6" },
  ];

  const stepLabels = ["Role", "Profile", "Security", "Location"];
  const stepIcons = ["🎭", "👤", "🔐", "📍"];

  // CSS injected once
  useEffect(() => {
    const id = "rq-styles";
    if (document.getElementById(id)) return;
    const s = document.createElement("style");
    s.id = id;
    s.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=DM+Mono:wght@400;500&family=Syne:wght@700;800;900&display=swap');
      @keyframes floatA { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(3%,5%) scale(1.05)} }
      @keyframes floatB { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-4%,-3%) scale(1.08)} }
      @keyframes floatC { 0%,100%{transform:translate(0,0)} 50%{transform:translate(5%,4%)} }
      @keyframes spin { to { transform: rotate(360deg); } }
      @keyframes slideIn { from { opacity:0; transform: translateY(10px); } to { opacity:1; transform:translateY(0); } }
      @keyframes pulse { 0%,100%{box-shadow:0 0 0 0 rgba(16,185,129,0.4)} 50%{box-shadow:0 0 0 8px rgba(16,185,129,0)} }
    `;
    document.head.appendChild(s);
  }, []);

  const bg = dark ? "#080e0a" : "#f0fdf4";
  const cardBg = dark ? "rgba(13,22,15,0.85)" : "rgba(255,255,255,0.92)";
  const textMain = dark ? "rgba(240,253,244,0.95)" : "rgba(15,23,42,0.95)";
  const textSub = dark ? "rgba(134,239,172,0.45)" : "rgba(71,85,105,0.6)";

  return (
    <div style={{
      minHeight: "100vh",
      background: dark
        ? "linear-gradient(135deg, #060d08 0%, #0a1a0f 50%, #080e0a 100%)"
        : "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f0fdfa 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem 1rem",
      fontFamily: "'Outfit', sans-serif",
      position: "relative",
      transition: "background 0.5s ease",
    }}>
      <Orbs dark={dark} />
      <ThemeToggle dark={dark} onToggle={() => setDark(d => !d)} />

      {/* Card */}
      <div style={{
        position: "relative",
        zIndex: 1,
        width: "100%",
        maxWidth: "490px",
        background: cardBg,
        borderRadius: "1.75rem",
        border: dark ? "1px solid rgba(74,222,128,0.10)" : "1px solid rgba(0,0,0,0.06)",
        boxShadow: dark
          ? "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(74,222,128,0.06), inset 0 1px 0 rgba(255,255,255,0.04)"
          : "0 32px 80px rgba(0,0,0,0.10), 0 0 0 1px rgba(255,255,255,0.9), inset 0 1px 0 rgba(255,255,255,1)",
        backdropFilter: "blur(24px)",
        overflow: "hidden",
        transition: "box-shadow 0.5s ease",
      }}>
        {/* Top accent bar */}
        <div style={{
          height: "3px",
          background: "linear-gradient(90deg, #10b981, #f59e0b, #14b8a6, #10b981)",
          backgroundSize: "200% 100%",
          animation: "none",
        }} />

        <div style={{ padding: "2rem 2rem 2.25rem" }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
              <div style={{
                width: "2.5rem", height: "2.5rem",
                borderRadius: "0.75rem",
                background: "linear-gradient(135deg, #10b981, #14b8a6)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.1rem",
                boxShadow: "0 4px 16px rgba(16,185,129,0.35)",
              }}>🌿</div>
              <h1 style={{
                fontSize: "1.45rem",
                fontWeight: 900,
                fontFamily: "'Syne', sans-serif",
                color: textMain,
                letterSpacing: "-0.03em",
                lineHeight: 1,
              }}>
                ResQ<span style={{ color: "#f59e0b" }}>Plate</span>
              </h1>
            </div>
            <div style={{
              fontSize: "0.68rem",
              fontFamily: "'DM Mono', monospace",
              color: textSub,
              letterSpacing: "0.08em",
              border: dark ? "1px solid rgba(74,222,128,0.15)" : "1px solid rgba(0,0,0,0.08)",
              padding: "0.25rem 0.65rem",
              borderRadius: "9999px",
            }}>
              FREE SIGNUP
            </div>
          </div>

          {/* Step Progress */}
          <div style={{ marginBottom: "1.75rem" }}>
            <div style={{ display: "flex", gap: "0.4rem", marginBottom: "0.75rem" }}>
              {[0, 1, 2, 3].map(i => (
                <div key={i} style={{ flex: 1, position: "relative" }}>
                  <div style={{
                    height: "4px",
                    borderRadius: "9999px",
                    background: i < step
                      ? "linear-gradient(90deg,#10b981,#14b8a6)"
                      : i === step
                        ? "linear-gradient(90deg,#10b981,rgba(16,185,129,0.4))"
                        : dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)",
                    transition: "background 0.5s ease",
                    overflow: "hidden",
                  }}>
                    {i === step && (
                      <div style={{
                        position: "absolute", inset: 0,
                        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                        animation: "slideIn 1.5s ease infinite",
                      }} />
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {[0, 1, 2, 3].map(i => (
                  <div key={i} style={{
                    width: "1.75rem", height: "1.75rem",
                    borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.7rem",
                    background: i === step
                      ? "linear-gradient(135deg,#10b981,#14b8a6)"
                      : i < step
                        ? "rgba(16,185,129,0.15)"
                        : dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                    border: i === step
                      ? "none"
                      : i < step
                        ? "1px solid rgba(16,185,129,0.3)"
                        : dark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.07)",
                    color: i === step ? "#fff" : i < step ? "#10b981" : textSub,
                    transition: "all 0.3s ease",
                    boxShadow: i === step ? "0 2px 10px rgba(16,185,129,0.4)" : "none",
                  }}>
                    {i < step ? "✓" : stepIcons[i]}
                  </div>
                ))}
              </div>
              <span style={{
                fontSize: "0.7rem",
                fontFamily: "'DM Mono', monospace",
                color: "#10b981",
                letterSpacing: "0.06em",
              }}>
                {stepLabels[step]} · {step + 1}/4
              </span>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div style={{
              marginBottom: "1rem",
              padding: "0.75rem 1rem",
              background: dark ? "rgba(239,68,68,0.08)" : "rgba(239,68,68,0.06)",
              border: "1px solid rgba(239,68,68,0.25)",
              borderRadius: "0.75rem",
              fontSize: "0.82rem",
              color: "#ef4444",
              fontFamily: "'DM Mono', monospace",
              display: "flex", alignItems: "center", gap: "0.5rem",
            }}>⚠ {error}</div>
          )}

          {/* Step Content */}
          <div style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : `translateY(${animDir * 12}px)`,
            transition: "opacity 0.22s ease, transform 0.22s ease",
          }}>

            {/* ── Step 0: Role ── */}
            {step === 0 && (
              <div>
                <h2 style={{ fontSize: "1.25rem", fontWeight: 800, fontFamily: "'Syne',sans-serif", color: textMain, marginBottom: "0.25rem" }}>
                  Pick your role
                </h2>
                <p style={{ fontSize: "0.82rem", color: textSub, marginBottom: "1.25rem" }}>How will you use ResQPlate?</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                  {roles.map(r => (
                    <div
                      key={r.id}
                      onClick={() => setForm(f => ({ ...f, role: r.id }))}
                      style={{
                        padding: "1rem 1.1rem",
                        borderRadius: "1rem",
                        cursor: "pointer",
                        border: form.role === r.id
                          ? `1.5px solid ${r.color}`
                          : dark ? "1.5px solid rgba(255,255,255,0.06)" : "1.5px solid rgba(0,0,0,0.07)",
                        background: form.role === r.id
                          ? dark ? `rgba(${r.id === 'donor' ? '16,185,129' : r.id === 'ngo' ? '245,158,11' : '20,184,166'},0.10)` : `rgba(${r.id === 'donor' ? '16,185,129' : r.id === 'ngo' ? '245,158,11' : '20,184,166'},0.07)`
                          : dark ? "rgba(255,255,255,0.02)" : "rgba(248,250,252,1)",
                        display: "flex", alignItems: "center", gap: "0.9rem",
                        transition: "all 0.25s cubic-bezier(0.34,1.56,0.64,1)",
                        transform: form.role === r.id ? "scale(1.015)" : "scale(1)",
                        boxShadow: form.role === r.id
                          ? `0 4px 20px rgba(${r.id === 'donor' ? '16,185,129' : r.id === 'ngo' ? '245,158,11' : '20,184,166'},0.20)`
                          : "none",
                      }}
                    >
                      <div style={{
                        width: "2.75rem", height: "2.75rem",
                        borderRadius: "0.75rem",
                        background: form.role === r.id
                          ? `linear-gradient(135deg, ${r.color}, ${r.color}bb)`
                          : dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "1.3rem",
                        flexShrink: 0,
                        transition: "all 0.25s ease",
                        boxShadow: form.role === r.id ? `0 4px 12px ${r.color}55` : "none",
                      }}>{r.emoji}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontWeight: 700,
                          fontSize: "0.9rem",
                          color: form.role === r.id ? r.color : textMain,
                          transition: "color 0.2s",
                        }}>{r.label}</div>
                        <div style={{ fontSize: "0.75rem", color: textSub, marginTop: "0.1rem" }}>{r.desc}</div>
                      </div>
                      <div style={{
                        width: "1.4rem", height: "1.4rem",
                        borderRadius: "50%",
                        background: form.role === r.id ? r.color : "transparent",
                        border: form.role === r.id ? "none" : dark ? "1.5px solid rgba(255,255,255,0.12)" : "1.5px solid rgba(0,0,0,0.12)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "0.65rem", color: "#fff",
                        flexShrink: 0,
                        transition: "all 0.25s ease",
                      }}>
                        {form.role === r.id && "✓"}
                      </div>
                    </div>
                  ))}
                </div>
                {errors.role && <p style={{ marginTop: "0.5rem", fontSize: "0.72rem", color: "#ef4444", fontFamily: "'DM Mono', monospace" }}>⚠ {errors.role}</p>}
              </div>
            )}

            {/* ── Step 1: Profile ── */}
            {step === 1 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
                <div>
                  <h2 style={{ fontSize: "1.25rem", fontWeight: 800, fontFamily: "'Syne',sans-serif", color: textMain, marginBottom: "0.25rem" }}>Your Profile</h2>
                  <p style={{ fontSize: "0.82rem", color: textSub }}>Tell us a bit about yourself</p>
                </div>
                <Field label="Full Name" name="name" value={form.name} onChange={handleChange}
                  placeholder="e.g. Arjun Sharma" error={errors.name} dark={dark} icon="👤" />
                <Field label="Email Address" name="email" type="email" value={form.email} onChange={handleChange}
                  placeholder="you@example.com" error={errors.email} dark={dark} icon="✉️" />
                <Field label="Phone (optional)" name="phone" type="tel" value={form.phone} onChange={handleChange}
                  placeholder="+91 98765 43210" dark={dark} icon="📱" />
                {form.role === "ngo" && (
                  <Field label="Organization Name" name="orgName" value={form.orgName} onChange={handleChange}
                    placeholder="Your NGO name" error={errors.orgName} dark={dark} icon="🏢" />
                )}
              </div>
            )}

            {/* ── Step 2: Password ── */}
            {step === 2 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
                <div>
                  <h2 style={{ fontSize: "1.25rem", fontWeight: 800, fontFamily: "'Syne',sans-serif", color: textMain, marginBottom: "0.25rem" }}>Secure Account</h2>
                  <p style={{ fontSize: "0.82rem", color: textSub }}>Create a strong password to protect your account</p>
                </div>
                <div>
                  <Field label="Password" name="password" type="password" value={form.password} onChange={handleChange}
                    placeholder="Minimum 8 characters" error={errors.password} dark={dark} icon="🔑" />
                  <PasswordStrength password={form.password} dark={dark} />
                </div>
                <Field label="Confirm Password" name="confirmPw" type="password" value={form.confirmPw} onChange={handleChange}
                  placeholder="Repeat your password" error={errors.confirmPw} dark={dark} icon="🔒" />
                {/* Tips */}
                <div style={{
                  padding: "0.85rem 1rem",
                  background: dark ? "rgba(16,185,129,0.05)" : "rgba(16,185,129,0.04)",
                  border: dark ? "1px solid rgba(16,185,129,0.12)" : "1px solid rgba(16,185,129,0.15)",
                  borderRadius: "0.75rem",
                }}>
                  <p style={{ fontSize: "0.72rem", color: textSub, fontFamily: "'DM Mono', monospace", lineHeight: 1.7, margin: 0 }}>
                    Tips: 12+ chars · Uppercase · Number · Symbol
                  </p>
                </div>
              </div>
            )}

            {/* ── Step 3: Location ── */}
            {step === 3 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
                <div>
                  <h2 style={{ fontSize: "1.25rem", fontWeight: 800, fontFamily: "'Syne',sans-serif", color: textMain, marginBottom: "0.25rem" }}>Your Location</h2>
                  <p style={{ fontSize: "0.82rem", color: textSub }}>We match you with nearby donations — your location stays private</p>
                </div>
                <button
                  type="button"
                  onClick={handleLocate}
                  disabled={locating}
                  style={{
                    width: "100%",
                    padding: "2rem 1rem",
                    background: form.latitude
                      ? dark ? "rgba(16,185,129,0.08)" : "rgba(16,185,129,0.05)"
                      : dark ? "rgba(255,255,255,0.02)" : "rgba(248,250,252,1)",
                    border: form.latitude
                      ? "2px solid rgba(16,185,129,0.4)"
                      : dark ? "2px dashed rgba(255,255,255,0.08)" : "2px dashed rgba(0,0,0,0.10)",
                    borderRadius: "1rem",
                    cursor: locating ? "wait" : "pointer",
                    transition: "all 0.3s ease",
                    textAlign: "center",
                    boxShadow: form.latitude ? "0 4px 24px rgba(16,185,129,0.15)" : "none",
                  }}
                >
                  <div style={{
                    fontSize: "2.5rem",
                    marginBottom: "0.65rem",
                    animation: locating ? "spin 1.5s linear infinite" : "none",
                    display: "inline-block",
                  }}>
                    {locating ? "⏳" : form.latitude ? "✅" : "📍"}
                  </div>
                  <div style={{
                    fontWeight: 700, fontSize: "0.95rem",
                    color: form.latitude ? "#10b981" : textMain,
                    fontFamily: "'Syne', sans-serif",
                    marginBottom: "0.25rem",
                  }}>
                    {locating ? "Detecting location…" : form.latitude ? "Location Captured!" : "Detect My Location"}
                  </div>
                  {form.city && (
                    <div style={{
                      fontSize: "0.8rem",
                      color: "#10b981",
                      fontFamily: "'DM Mono', monospace",
                      opacity: 0.85,
                    }}>📌 {form.city}</div>
                  )}
                  {form.latitude && !form.city && (
                    <div style={{ fontSize: "0.72rem", color: textSub, fontFamily: "'DM Mono', monospace" }}>
                      {form.latitude}, {form.longitude}
                    </div>
                  )}
                  {!form.latitude && !locating && (
                    <div style={{ fontSize: "0.75rem", color: textSub, marginTop: "0.25rem" }}>
                      Tap to allow location access
                    </div>
                  )}
                </button>
                {errors.location && (
                  <p style={{ fontSize: "0.72rem", color: "#ef4444", fontFamily: "'DM Mono', monospace" }}>⚠ {errors.location}</p>
                )}
                <div style={{
                  padding: "0.75rem 1rem",
                  background: dark ? "rgba(245,158,11,0.05)" : "rgba(245,158,11,0.04)",
                  border: dark ? "1px solid rgba(245,158,11,0.12)" : "1px solid rgba(245,158,11,0.15)",
                  borderRadius: "0.75rem",
                  fontSize: "0.72rem",
                  color: textSub,
                  fontFamily: "'DM Mono', monospace",
                  lineHeight: 1.6,
                }}>
                  🔒 Your precise coordinates are never shared publicly
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.75rem" }}>
            {step > 0 && (
              <button
                type="button"
                onClick={goPrev}
                style={{
                  padding: "0.875rem 1.25rem",
                  borderRadius: "0.875rem",
                  border: dark ? "1.5px solid rgba(74,222,128,0.15)" : "1.5px solid rgba(0,0,0,0.10)",
                  background: "transparent",
                  color: textSub,
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  fontFamily: "'Outfit', sans-serif",
                  transition: "all 0.2s ease",
                  letterSpacing: "-0.01em",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)";
                  e.currentTarget.style.color = textMain;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = textSub;
                }}
              >← Back</button>
            )}
            {step < 3 ? (
              <button
                type="button"
                onClick={goNext}
                style={{
                  flex: 1,
                  padding: "0.9375rem 1.5rem",
                  borderRadius: "0.875rem",
                  border: "none",
                  background: "linear-gradient(135deg, #10b981, #14b8a6)",
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: "0.95rem",
                  cursor: "pointer",
                  fontFamily: "'Syne', sans-serif",
                  letterSpacing: "-0.01em",
                  boxShadow: "0 4px 20px rgba(16,185,129,0.35)",
                  transition: "all 0.25s cubic-bezier(0.34,1.56,0.64,1)",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 28px rgba(16,185,129,0.45)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 20px rgba(16,185,129,0.35)";
                }}
              >Continue →</button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || authLoading}
                style={{
                  flex: 1,
                  padding: "0.9375rem 1.5rem",
                  borderRadius: "0.875rem",
                  border: "none",
                  background: loading
                    ? "rgba(16,185,129,0.5)"
                    : "linear-gradient(135deg, #10b981, #059669)",
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: "0.95rem",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontFamily: "'Syne', sans-serif",
                  letterSpacing: "-0.01em",
                  boxShadow: loading ? "none" : "0 4px 20px rgba(16,185,129,0.40)",
                  transition: "all 0.25s ease",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                }}
                onMouseEnter={e => {
                  if (!loading) {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 8px 28px rgba(16,185,129,0.50)";
                  }
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 20px rgba(16,185,129,0.40)";
                }}
              >
                {loading ? (
                  <>
                    <span style={{ display: "inline-block", width: "1rem", height: "1rem", border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                    Creating…
                  </>
                ) : "Create Account 🚀"}
              </button>
            )}
          </div>

          {/* Footer */}
          <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
            <p style={{ fontSize: "0.82rem", color: textSub }}>
              Already have an account?{" "}
              <Link to="/login" style={{
                color: "#10b981",
                fontWeight: 700,
                textDecoration: "none",
                borderBottom: "1px solid rgba(16,185,129,0.3)",
                paddingBottom: "1px",
                transition: "border-color 0.2s",
              }}>Sign in →</Link>
            </p>
            <p style={{
              marginTop: "0.75rem",
              fontSize: "0.68rem",
              color: dark ? "rgba(134,239,172,0.2)" : "rgba(71,85,105,0.35)",
              fontFamily: "'DM Mono', monospace",
              letterSpacing: "0.05em",
            }}>
              By continuing you agree to our Terms & Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}