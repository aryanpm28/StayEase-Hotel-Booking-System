import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, X } from "lucide-react";
import {
  getRoomTypes,
  createRoomType,
  updateRoomType,
  deleteRoomType,
} from "../../api/roomTypes";
import { extractErrorMessage } from "../../api/client";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorBanner from "../../components/ErrorBanner";

const emptyForm = { name: "", pricePerNight: "", prefix: "" };

export default function ManageRoomTypes() {
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  function load() {
    setLoading(true);
    getRoomTypes()
      .then(setRoomTypes)
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  function startEdit(rt) {
    setEditingId(rt.id);
    setForm({ name: rt.name, pricePerNight: rt.pricePerNight, prefix: rt.prefix });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    const payload = { ...form, pricePerNight: Number(form.pricePerNight) };
    try {
      if (editingId) {
        await updateRoomType(editingId, payload);
      } else {
        await createRoomType(payload);
      }
      resetForm();
      load();
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    setError("");
    try {
      await deleteRoomType(id);
      load();
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Room types</h1>
      <p className="mt-2 text-sm text-ink/60">
        e.g. "Deluxe" / D, "Suite" / SUI, "Premium" / PR — the prefix is used to
        generate room numbers automatically (D101, SUI201, PR301...).
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 flex flex-col gap-3 rounded-xl border border-ink/10 bg-white p-5 sm:flex-row sm:items-end"
      >
        <label className="flex flex-1 flex-col gap-1 text-sm">
          <span className="text-ink/60">Name</span>
          <input
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="rounded-lg border border-ink/15 px-3 py-2 outline-none focus:border-brass"
          />
        </label>
        <label className="flex flex-1 flex-col gap-1 text-sm">
          <span className="text-ink/60">Price / night</span>
          <input
            type="number"
            min={1}
            required
            value={form.pricePerNight}
            onChange={(e) => setForm((f) => ({ ...f, pricePerNight: e.target.value }))}
            className="rounded-lg border border-ink/15 px-3 py-2 outline-none focus:border-brass"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-ink/60">Prefix</span>
          <input
            required
            maxLength={3}
            placeholder="e.g. D, SUI, PR"
            pattern="^[A-Za-z]{1,3}$"
            title="1-3 letters, e.g. D, SUI, PR"
            value={form.prefix}
            onChange={(e) =>
              setForm((f) => ({ ...f, prefix: e.target.value.toUpperCase() }))
            }
            className="w-28 rounded-lg border border-ink/15 px-3 py-2 uppercase outline-none focus:border-brass"
          />
        </label>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center justify-center gap-2 rounded-lg bg-ink px-5 py-2 text-sm text-ivory transition hover:bg-wine disabled:opacity-60"
        >
          {editingId ? <Pencil size={15} /> : <Plus size={15} />}
          {editingId ? "Save" : "Add type"}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={resetForm}
            className="flex items-center gap-1 rounded-lg border border-ink/15 px-4 py-2 text-sm text-ink/70"
          >
            <X size={14} /> Cancel
          </button>
        )}
      </form>

      {error && (
        <div className="mt-4">
          <ErrorBanner message={error} />
        </div>
      )}

      <div className="mt-6">
        {loading ? (
          <LoadingSpinner label="Loading room types" />
        ) : (
          <div className="overflow-hidden rounded-xl border border-ink/10 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-ivory-dim text-left text-ink/50">
                <tr>
                  <th className="px-4 py-3 font-normal">Name</th>
                  <th className="px-4 py-3 font-normal">Prefix</th>
                  <th className="px-4 py-3 font-normal">Price / night</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {roomTypes.map((rt) => (
                  <tr key={rt.id} className="border-t border-ink/5">
                    <td className="px-4 py-3">{rt.name}</td>
                    <td className="px-4 py-3 font-mono text-brass">{rt.prefix}</td>
                    <td className="px-4 py-3 font-mono">
                      ₹{Number(rt.pricePerNight).toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => startEdit(rt)}
                        className="mr-3 text-ink/50 hover:text-brass"
                        aria-label="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(rt.id)}
                        className="text-ink/50 hover:text-wine"
                        aria-label="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {roomTypes.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-ink/50">
                      No room types yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
