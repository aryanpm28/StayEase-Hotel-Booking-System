import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { KeyRound } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { extractErrorMessage } from "../api/client";
import ErrorBanner from "../components/ErrorBanner";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(location.state?.email || "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const user = await login({ email, password });
      const from = location.state?.from?.pathname;
      navigate(from || (user.role === "ADMIN" ? "/admin" : "/rooms"), { replace: true });
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5 py-16">
      <div className="flex items-center gap-2 text-brass">
        <KeyRound size={22} />
        <span className="font-mono text-xs uppercase tracking-widest">Welcome back</span>
      </div>
      <h1 className="mt-2 font-display text-3xl text-ink">Sign in</h1>

      {location.state?.registered && (
        <p className="mt-4 rounded-lg border border-sage/40 bg-sage/10 px-4 py-2 text-sm text-sage">
          Account created — sign in to continue.
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-ink/60">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-ink/15 px-3 py-2 outline-none focus:border-brass"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="text-ink/60">Password</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-lg border border-ink/15 px-3 py-2 outline-none focus:border-brass"
          />
        </label>

        {error && <ErrorBanner message={error} />}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 w-full rounded-full bg-ink py-3 text-ivory transition hover:bg-wine disabled:opacity-60"
        >
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink/60">
        New to StayEase?{" "}
        <Link to="/register" className="text-brass underline underline-offset-2">
          Create an account
        </Link>
      </p>
    </div>
  );
}
