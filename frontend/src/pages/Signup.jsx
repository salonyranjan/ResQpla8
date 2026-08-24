import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Logo from "../components/Logo";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import "./AuthPages.css";
import { getRoleHome } from "../services/roleAccess";

const validEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export default function Signup() {
  const { register, user, loading: authLoading } = useAuth();
  const { dark } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestedRole = searchParams.get("role");
  const initialRole = ["donor", "receiver", "volunteer"].includes(requestedRole) ? requestedRole : requestedRole === "ngo" ? "receiver" : "receiver";
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmation: "", role: initialRole });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    if (!authLoading && user) navigate("/dashboard", { replace: true });
  }, [authLoading, user, navigate]);

  const update = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
    setServerError("");
  };

  const submit = async (event) => {
    event.preventDefault();
    const name = form.name.trim().replace(/\s+/g, " ");
    const email = form.email.trim().toLowerCase();
    const nextErrors = {};
    if (name.length < 2) nextErrors.name = "Enter your full name.";
    else if (name.length > 128) nextErrors.name = "Name must be 128 characters or fewer.";
    if (!validEmail(email)) nextErrors.email = "Enter a valid email address.";
    if (form.password.length < 8) nextErrors.password = "Use at least 8 characters.";
    else if (form.password.length > 256) nextErrors.password = "Password must be 256 characters or fewer.";
    if (form.confirmation !== form.password) nextErrors.confirmation = "Passwords do not match.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);
    setServerError("");
    try {
      await register(email, form.password, name, form.role);
      navigate(getRoleHome(form.role), { replace: true });
    } catch (error) {
      setServerError(error.message || "Account creation failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className={`auth-page ${dark ? "dark" : "light"}`}>
      <section className="auth-card" aria-labelledby="signup-title">
        <div className="auth-brand"><Logo size={42} /><Link className="auth-back" to="/">Back home</Link></div>
        <div className="auth-kicker">Create an account</div>
        <h1 className="auth-title" id="signup-title">Join ResQPlate</h1>
        <p className="auth-subtitle">Create one secure account. You can post donations and claim available food after signing in.</p>
        {serverError && <div className="auth-alert" role="alert">{serverError}</div>}
        <form className="auth-form" onSubmit={submit} noValidate>
          <div className="auth-field">
            <label htmlFor="signup-name">Full name</label>
            <input id="signup-name" className="auth-input" name="name" value={form.name} onChange={update} autoComplete="name" maxLength={128} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "signup-name-error" : undefined} autoFocus />
            {errors.name && <p className="auth-field-error" id="signup-name-error">{errors.name}</p>}
          </div>
          <div className="auth-field">
            <label htmlFor="signup-email">Email address</label>
            <input id="signup-email" className="auth-input" name="email" type="email" value={form.email} onChange={update} autoComplete="email" inputMode="email" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "signup-email-error" : undefined} />
            {errors.email && <p className="auth-field-error" id="signup-email-error">{errors.email}</p>}
          </div>
          <div className="auth-field">
            <label>How will you use ResQPlate?</label>
            <div className="auth-role-grid">
              {[{ id: "receiver", label: "Receive", detail: "Claim available food" }, { id: "donor", label: "Donate", detail: "Share surplus food" }, { id: "volunteer", label: "Volunteer", detail: "Collect and deliver" }].map((role) => <button className="auth-role" key={role.id} type="button" onClick={() => setForm((current) => ({ ...current, role: role.id }))} aria-pressed={form.role === role.id}><strong>{role.label}</strong><span>{role.detail}</span></button>)}
            </div>
            <p className="auth-help">Your dashboard and permitted actions will match this role. You can change it later in Settings.</p>
          </div>
          <div className="auth-field">
            <label htmlFor="signup-password">Password</label>
            <div className="auth-input-wrap">
              <input id="signup-password" className="auth-input has-action" name="password" type={showPassword ? "text" : "password"} value={form.password} onChange={update} autoComplete="new-password" minLength={8} maxLength={256} aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? "signup-password-error" : "signup-password-help"} />
              <button className="auth-password-toggle" type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? "Hide" : "Show"}</button>
            </div>
            {errors.password ? <p className="auth-field-error" id="signup-password-error">{errors.password}</p> : <p className="auth-help" id="signup-password-help">Use at least 8 characters. A longer, unique password is safer.</p>}
          </div>
          <div className="auth-field">
            <label htmlFor="signup-confirmation">Confirm password</label>
            <input id="signup-confirmation" className="auth-input" name="confirmation" type={showPassword ? "text" : "password"} value={form.confirmation} onChange={update} autoComplete="new-password" aria-invalid={Boolean(errors.confirmation)} aria-describedby={errors.confirmation ? "signup-confirmation-error" : undefined} />
            {errors.confirmation && <p className="auth-field-error" id="signup-confirmation-error">{errors.confirmation}</p>}
          </div>
          <button className="auth-submit" type="submit" disabled={submitting || authLoading}>{submitting ? "Creating account…" : "Create account"}</button>
        </form>
        <p className="auth-footer">Already registered? <Link to="/login">Sign in</Link></p>
      </section>
    </main>
  );
}
