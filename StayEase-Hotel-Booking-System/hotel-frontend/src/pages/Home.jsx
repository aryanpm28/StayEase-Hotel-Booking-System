import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { BedDouble, KeyRound, ShieldCheck, Sparkles } from "lucide-react";
import LedgerSearchBar from "../components/LedgerSearchBar";
import HotelFacadeArt from "../components/HotelFacadeArt";
import RoomCard from "../components/RoomCard";
import { getRoomTypes } from "../api/roomTypes";
import { getAvailableRooms } from "../api/rooms";

const perks = [
  {
    icon: KeyRound,
    title: "Instant confirmation",
    body: "Your room is locked in the moment you book — no waiting on a callback.",
  },
  {
    icon: ShieldCheck,
    title: "Secure by design",
    body: "Every reservation and payment sits behind authenticated, encrypted access.",
  },
  {
    icon: Sparkles,
    title: "Live status updates",
    body: "Booking and payment confirmations reach you the second they happen.",
  },
];

export default function Home() {
  const [roomTypes, setRoomTypes] = useState([]);
  const [availableRooms, setAvailableRooms] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getRoomTypes().then(setRoomTypes).catch(() => setRoomTypes([]));
    getAvailableRooms()
      .then(setAvailableRooms)
      .catch(() => setAvailableRooms([]));
  }, []);

  function handleSearch(params) {
    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v))
    ).toString();
    navigate(`/rooms?${query}`);
  }

  // One representative room per distinct room type (Normal, Deluxe, Suite,
  // Premium, ...), not just the first room overall.
  const featuredByType = useMemo(() => {
    if (!availableRooms) return [];
    const byType = {};
    for (const room of availableRooms) {
      if (!byType[room.roomType]) byType[room.roomType] = room;
    }
    return Object.values(byType);
  }, [availableRooms]);

  return (
    <div>
      <section className="relative overflow-hidden bg-ink text-ivory">
        <HotelFacadeArt className="pointer-events-none absolute inset-0 h-full w-full opacity-70" />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/10"
        />
        <div className="relative mx-auto max-w-6xl px-5 pb-28 pt-20 sm:pt-28">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-brass-light">
            StayEase Hotels
          </p>
          <h1 className="mt-5 max-w-2xl font-display text-4xl leading-tight sm:text-6xl">
            A room ready the moment you decide to arrive.
          </h1>
          <p className="mt-5 max-w-lg text-ivory/70">
            Search live availability, hold your room, and get confirmed — all
            in the time it takes to check in at a real front desk.
          </p>
        </div>

        <div className="relative mx-auto -mt-8 max-w-5xl px-5 pb-16">
          <LedgerSearchBar roomTypes={roomTypes} onSearch={handleSearch} />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid gap-8 sm:grid-cols-3">
          {perks.map((perk) => (
            <div key={perk.title} className="flex flex-col gap-3">
              <perk.icon className="text-brass" size={26} />
              <h3 className="font-display text-lg text-ink">{perk.title}</h3>
              <p className="text-sm text-ink/60">{perk.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-ivory-dim">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BedDouble className="text-brass" size={22} />
              <h2 className="font-display text-2xl text-ink">Available rooms</h2>
            </div>
            <Link
              to="/rooms"
              className="text-sm text-brass underline underline-offset-2"
            >
              See all rooms
            </Link>
          </div>

          {availableRooms === null && (
            <p className="mt-8 text-sm text-ink/50">Checking what's free…</p>
          )}

          {availableRooms !== null && availableRooms.length === 0 && (
            <p className="mt-8 rounded-xl border border-dashed border-ink/20 bg-white px-6 py-10 text-center text-ink/60">
              Sorry, Rooms are not Available
            </p>
          )}

          {availableRooms && availableRooms.length > 0 && (
            <>
              <div className="mt-8 flex items-center gap-2 text-brass">
                <Sparkles size={16} />
                <span className="font-mono text-xs uppercase tracking-widest">
                  Featured rooms
                </span>
              </div>
              <div className="mt-4 grid gap-6 sm:grid-cols-2">
                {featuredByType.map((room) => (
                  <RoomCard key={room.id} room={room} />
                ))}
              </div>

              <p className="mt-6 text-sm text-ink/60">
                {availableRooms.length > 1
                  ? `${availableRooms.length} rooms available right now.`
                  : "That's the only room available right now."}
              </p>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
