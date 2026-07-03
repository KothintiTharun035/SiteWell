import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { validateEmail } from "../utils/helper";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || "/dashboard";

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setError("Enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Enter your password.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await axiosInstance.post("/login", { email, password });
      login(res.data.user, res.data.accessToken);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const message =
        err.response?.data?.message || "Couldn't log you in. Check your connection and try again.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="auth">
      <div className="auth__card">
        <div className="auth__eyebrow">Sitewell</div>
        <h1 className="auth__title">Welcome back</h1>
        <p className="auth__subtitle">Log in to run and review your site checks.</p>

        {error && <div className="auth__error">{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn--primary btn--block" disabled={isSubmitting}>
            {isSubmitting ? "Logging in…" : "Log in"}
          </button>
        </form>

        <div className="auth__footer">
          Don't have an account? <Link to="/register">Create one</Link>
        </div>
      </div>
    </div>
  );
}
