import { useEffect, useState } from "react";
import { Search } from "lucide-react";

// Backend validates checkIn/checkOut with @Future, which rejects today —
// so the earliest selectable date here is tomorrow.
const tomorrowIso = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
};

export default function LedgerSearchBar({
  roomTypes = [],
  onSearch,
  dense = false,
  initialValues = null,
}) {
  const [roomType, setRoomType] = useState(initialValues?.roomType || "");
  const [checkInDate, setCheckInDate] = useState(initialValues?.checkInDate || "");
  const [checkOutDate, setCheckOutDate] = useState(initialValues?.checkOutDate || "");
  const [guests, setGuests] = useState(initialValues?.guests || 1);

  useEffect(() => {
    if (!roomType && roomTypes.length) {
      setRoomType(roomTypes[0].name);
    }
  }, [roomTypes, roomType]);

  function handleSubmit(e) {
    e.preventDefault();
    onSearch?.({ roomType, checkInDate, checkOutDate, guests: Number(guests) });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex flex-col overflow-hidden rounded-2xl border border-brass/30 bg-ivory shadow-xl shadow-black/10 sm:flex-row sm:items-stretch ${
        dense ? "text-sm" : ""
      }`}
    >
      <label className="flex flex-1 flex-col gap-1 border-b border-brass/20 px-5 py-3 sm:border-b-0 sm:border-r">
        <span className="font-mono text-[10px] uppercase tracking-widest text-ink/40">
          Room type
        </span>
        <select
          required
          value={roomType}
          onChange={(e) => setRoomType(e.target.value)}
          className="bg-transparent text-ink outline-none"
        >
          {roomTypes.length === 0 && <option value="">No room types yet</option>}
          {roomTypes.map((rt) => (
            <option key={rt.id} value={rt.name}>
              {rt.name}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-1 flex-col gap-1 border-b border-brass/20 px-5 py-3 sm:border-b-0 sm:border-r">
        <span className="font-mono text-[10px] uppercase tracking-widest text-ink/40">
          Check-in
        </span>
        <input
          type="date"
          min={tomorrowIso()}
          required
          value={checkInDate}
          onChange={(e) => setCheckInDate(e.target.value)}
          className="bg-transparent text-ink outline-none"
        />
      </label>

      <label className="flex flex-1 flex-col gap-1 border-b border-brass/20 px-5 py-3 sm:border-b-0 sm:border-r">
        <span className="font-mono text-[10px] uppercase tracking-widest text-ink/40">
          Check-out
        </span>
        <input
          type="date"
          min={checkInDate || tomorrowIso()}
          required
          value={checkOutDate}
          onChange={(e) => setCheckOutDate(e.target.value)}
          className="bg-transparent text-ink outline-none"
        />
      </label>

      <label className="flex flex-1 flex-col gap-1 px-5 py-3 sm:border-r border-brass/20">
        <span className="font-mono text-[10px] uppercase tracking-widest text-ink/40">
          Guests (max 2)
        </span>
        <input
          type="number"
          min={1}
          max={2}
          required
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
          className="bg-transparent text-ink outline-none"
        />
      </label>

      <button
        type="submit"
        className="flex items-center justify-center gap-2 bg-wine px-6 py-3 text-ivory transition hover:bg-wine-light"
      >
        <Search size={16} />
        <span className="font-medium">Search</span>
      </button>
    </form>
  );
}
