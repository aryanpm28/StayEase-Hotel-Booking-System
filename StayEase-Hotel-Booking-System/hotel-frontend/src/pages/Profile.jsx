import { useEffect, useState } from "react";
import { UserRound } from "lucide-react";
import { getMyProfile, updateMyProfile } from "../api/auth";
import { extractErrorMessage } from "../api/client";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorBanner from "../components/ErrorBanner";

export default function Profile() {
  const [form, setForm] = useState(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getMyProfile()
      .then(setForm)
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaved(false);
    setSaving(true);
    try {
      const updated = await updateMyProfile({ ...form, password });
      setForm(updated);
      setPassword("");
      setSaved(true);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <LoadingSpinner label="Loading profile" />;
  if (!form)
    return (
      <div className="mx-auto max-w-lg px-5 py-16">
        <ErrorBanner message={error} />
      </div>
    );

  return (
    <div className="mx-auto max-w-lg px-5 py-12">
      <div className="flex items-center gap-2 text-brass">
        <UserRound size={20} />
        <span className="font-mono text-xs uppercase tracking-widest">Account</span>
      </div>
      <h1 className="mt-2 font-display text-3xl text-ink">Your profile</h1>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
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
        </div>

        <label className="flex flex-col gap-1 text-sm">
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
            pattern="^[6-9]\d{9}$"
            value={form.phoneNumber}
            onChange={update("phoneNumber")}
            className="rounded-lg border border-ink/15 px-3 py-2 outline-none focus:border-brass"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
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

        <label className="flex flex-col gap-1 text-sm">
          <span className="text-ink/60">Confirm password to save changes</span>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-lg border border-ink/15 px-3 py-2 outline-none focus:border-brass"
          />
        </label>

        {error && <ErrorBanner message={error} />}
        {saved && (
          <p className="rounded-lg border border-sage/40 bg-sage/10 px-4 py-2 text-sm text-sage">
            Profile updated.
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="mt-2 w-full rounded-full bg-ink py-3 text-ivory transition hover:bg-wine disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </form>
    </div>
  );
}
