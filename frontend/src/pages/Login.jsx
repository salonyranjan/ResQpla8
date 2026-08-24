import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { getSafeDestination, getUserRole } from "../services/roleAccess";
import "./AuthPages.css";

const validEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export default function Login() {
  const { login, user, loading: authLoading } = useAuth();
  const { dark } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const destination = useMemo(() => {
    const requested = location.state?.from;
    return typeof requested === "string" && requested.startsWith("/") ? requested : "";
  }, [location.state]);
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    if (!authLoading && user) navigate(getSafeDestination(destination, getUserRole(user)), { replace: true });
  }, [authLoading, user, destination, navigate]);

  const update = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
    setServerError("");
  };

  const submit = async (event) => {
    event.preventDefault();
    const email = form.email.trim().toLowerCase();
    const nextErrors = {};
    if (!validEmail(email)) nextErrors.email = "Enter a valid email address.";
    if (!form.password) nextErrors.password = "Enter your password.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);
    setServerError("");
    try {
      const signedInUser = await login(email, form.password);
      navigate(getSafeDestination(destination, getUserRole(signedInUser)), { replace: true });
    } catch (error) {
      setServerError(error.message || "Sign in failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className={`auth-page ${dark ? "dark" : "light"}`}>
      <section className="auth-card" aria-labelledby="login-title">
        <div className="auth-brand"><Logo size={42} /><Link className="auth-back" to="/">Back home</Link></div>
        <div className="auth-kicker">Account access</div>
        <h1 className="auth-title" id="login-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in once. ResQPlate will open the workspace saved for your account role.</p>
        {serverError && <div className="auth-alert" role="alert">{serverError}</div>}
        <form className="auth-form" onSubmit={submit} noValidate>
          <div className="auth-field">
            <label htmlFor="login-email">Email address</label>
            <input id="login-email" className="auth-input" name="email" type="email" value={form.email} onChange={update} autoComplete="email" inputMode="email" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "login-email-error" : undefined} autoFocus />
            {errors.email && <p className="auth-field-error" id="login-email-error">{errors.email}</p>}
          </div>
          <div className="auth-field">
            <label htmlFor="login-password">Password</label>
            <div className="auth-input-wrap">
              <input id="login-password" className="auth-input has-action" name="password" type={showPassword ? "text" : "password"} value={form.password} onChange={update} autoComplete="current-password" aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? "login-password-error" : undefined} />
              <button className="auth-password-toggle" type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? "Hide" : "Show"}</button>
            </div>
            {errors.password && <p className="auth-field-error" id="login-password-error">{errors.password}</p>}
          </div>
          <button className="auth-submit" type="submit" disabled={submitting || authLoading}>{submitting ? "Signing in…" : "Sign in"}</button>
        </form>
        <p className="auth-footer">New to ResQPlate? <Link to="/register">Create an account</Link></p>
      </section>
    </main>
  );
}
