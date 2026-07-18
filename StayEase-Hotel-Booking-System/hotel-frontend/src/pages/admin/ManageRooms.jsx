import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, X } from "lucide-react";
import { getRooms, createRoom, updateRoom, deleteRoom } from "../../api/rooms";
import { getRoomTypes } from "../../api/roomTypes";
import { extractErrorMessage } from "../../api/client";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorBanner from "../../components/ErrorBanner";

const emptyForm = { roomType: "", capacity: "", imageUrl: "", description: "" };

export default function ManageRooms() {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  function load() {
    setLoading(true);
    Promise.all([getRooms(), getRoomTypes()])
      .then(([r, rt]) => {
        setRooms(r);
        setRoomTypes(rt);
        setForm((f) => ({ ...f, roomType: f.roomType || rt[0]?.name || "" }));
      })
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  function startEdit(room) {
    setEditingId(room.id);
    setForm({
      roomType: room.roomType,
      capacity: room.capacity,
      imageUrl: room.imageUrl || "",
      description: room.description || "",
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm({ ...emptyForm, roomType: roomTypes[0]?.name || "" });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    const payload = { ...form, capacity: Number(form.capacity) };
    try {
      if (editingId) {
        await updateRoom(editingId, payload);
      } else {
        await createRoom(payload);
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
      await deleteRoom(id);
      load();
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Rooms</h1>
      <p className="mt-2 text-sm text-ink/60">
        Room numbers are generated automatically from the room type's prefix.
        Every room sleeps at most 2 guests.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 grid gap-3 rounded-xl border border-ink/10 bg-white p-5 sm:grid-cols-2"
      >
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-ink/60">Room type</span>
          <select
            required
            value={form.roomType}
            onChange={(e) => setForm((f) => ({ ...f, roomType: e.target.value }))}
            className="rounded-lg border border-ink/15 px-3 py-2 outline-none focus:border-brass"
          >
            {roomTypes.length === 0 && <option value="">Add a room type first</option>}
            {roomTypes.map((rt) => (
              <option key={rt.id} value={rt.name}>
                {rt.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="text-ink/60">Capacity (max 2)</span>
          <input
            type="number"
            min={1}
            max={2}
            required
            value={form.capacity}
            onChange={(e) => setForm((f) => ({ ...f, capacity: e.target.value }))}
            className="rounded-lg border border-ink/15 px-3 py-2 outline-none focus:border-brass"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm sm:col-span-2">
          <span className="text-ink/60">
            Description <span className="text-ink/40">(shown to guests)</span>
          </span>
          <input
            required
            maxLength={300}
            placeholder="e.g. A bright, quiet room with a king bed and city views."
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            className="rounded-lg border border-ink/15 px-3 py-2 outline-none focus:border-brass"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm sm:col-span-2">
          <span className="text-ink/60">Image URL (optional)</span>
          <input
            value={form.imageUrl}
            placeholder="https://…"
            onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
            className="rounded-lg border border-ink/15 px-3 py-2 outline-none focus:border-brass"
          />
        </label>

        <div className="flex gap-3 sm:col-span-2">
          <button
            type="submit"
            disabled={saving || roomTypes.length === 0}
            className="flex items-center justify-center gap-2 rounded-lg bg-ink px-5 py-2 text-sm text-ivory transition hover:bg-wine disabled:opacity-60"
          >
            {editingId ? <Pencil size={15} /> : <Plus size={15} />}
            {editingId ? "Save" : "Add room"}
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
        </div>
      </form>

      {error && (
        <div className="mt-4">
          <ErrorBanner message={error} />
        </div>
      )}

      <div className="mt-6">
        {loading ? (
          <LoadingSpinner label="Loading rooms" />
        ) : (
          <div className="overflow-hidden rounded-xl border border-ink/10 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-ivory-dim text-left text-ink/50">
                <tr>
                  <th className="px-4 py-3 font-normal">Room</th>
                  <th className="px-4 py-3 font-normal">Type</th>
                  <th className="px-4 py-3 font-normal">Capacity</th>
                  <th className="px-4 py-3 font-normal">Price / night</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => (
                  <tr key={room.id} className="border-t border-ink/5">
                    <td className="px-4 py-3 font-mono">{room.roomNumber}</td>
                    <td className="px-4 py-3">{room.roomType}</td>
                    <td className="px-4 py-3">{room.capacity}</td>
                    <td className="px-4 py-3 font-mono">
                      ₹{Number(room.pricePerNight).toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => startEdit(room)}
                        className="mr-3 text-ink/50 hover:text-brass"
                        aria-label="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(room.id)}
                        className="text-ink/50 hover:text-wine"
                        aria-label="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {rooms.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-ink/50">
                      No rooms yet.
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
