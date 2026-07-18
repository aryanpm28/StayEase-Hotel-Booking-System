import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { extractErrorMessage } from "../api/client";
import ErrorBanner from "../components/ErrorBanner";

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  password: "",
  address: "",
};

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await register(form);
      navigate("/login", { state: { registered: true, email: form.email } });
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col justify-center px-5 py-16">
      <div className="flex items-center gap-2 text-brass">
        <UserPlus size={22} />
        <span className="font-mono text-xs uppercase tracking-widest">Join StayEase</span>
      </div>
      <h1 className="mt-2 font-display text-3xl text-ink">Create your account</h1>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-ink/60">First name</span>
          <input
            required
            value={form.firstName}
            onChange={update("firstName")}
            className="rounded-lg border border-ink/15 px-3 py-2 outline-none focus:border-brass"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="text-ink/60">Last name</span>
          <input
            required
            value={form.lastName}
            onChange={update("lastName")}
            className="rounded-lg border border-ink/15 px-3 py-2 outline-none focus:border-brass"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm sm:col-span-2">
          <span className="text-ink/60">Email</span>
          <input
            type="email"
            required
            value={form.email}
            onChange={update("email")}
            className="rounded-lg border border-ink/15 px-3 py-2 outline-none focus:border-brass"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="text-ink/60">Phone number</span>
          <input
            required
            placeholder="98765 43210"
            pattern="^[6-9]\d{9}$"
            title="Enter a valid 10-digit Indian mobile number"
            value={form.phoneNumber}
            onChange={update("phoneNumber")}
            className="rounded-lg border border-ink/15 px-3 py-2 outline-none focus:border-brass"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="text-ink/60">Password</span>
          <input
            type="password"
            required
            minLength={8}
            value={form.password}
            onChange={update("password")}
            className="rounded-lg border border-ink/15 px-3 py-2 outline-none focus:border-brass"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm sm:col-span-2">
          <span className="text-ink/60">Address</span>
          <textarea
            required
            maxLength={200}
            rows={2}
            value={form.address}
            onChange={update("address")}
            className="rounded-lg border border-ink/15 px-3 py-2 outline-none focus:border-brass"
          />
        </label>

        {error && (
          <div className="sm:col-span-2">
            <ErrorBanner message={error} />
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 w-full rounded-full bg-ink py-3 text-ivory transition hover:bg-wine disabled:opacity-60 sm:col-span-2"
        >
          {submitting ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink/60">
        Already have an account?{" "}
        <Link to="/login" className="text-brass underline underline-offset-2">
          Sign in
        </Link>
      </p>
    </div>
  );
}
