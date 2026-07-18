import { Link } from "react-router-dom";
import { Users } from "lucide-react";

export default function RoomCard({ room, footer }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      {/* punched key-card notch */}
      <div className="absolute -left-3 top-8 h-6 w-6 rounded-full bg-ivory" />

      <div className="flex items-center justify-between border-b border-dashed border-ink/15 px-6 py-3">
        <span className="font-mono text-xs tracking-widest text-ink/50">
          ROOM {room.roomNumber}
        </span>
        <span className="font-mono text-xs tracking-widest text-brass">
          {room.roomType?.toUpperCase()}
        </span>
      </div>

      <div className="px-6 py-5">
        <h3 className="font-display text-2xl text-ink">{room.roomType}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-ink/60">
          {room.description || "A comfortable stay tailored to your visit."}
        </p>

        <div className="mt-4 flex items-center gap-1.5 text-sm text-ink/60">
          <Users size={15} />
          <span>Sleeps {room.capacity}</span>
        </div>

        <div className="mt-5 flex items-end justify-between">
          <div>
            <span className="font-mono text-2xl text-ink">
              ₹{Number(room.pricePerNight).toLocaleString("en-IN")}
            </span>
            <span className="text-xs text-ink/50"> / night</span>
          </div>

          {footer ?? (
            <Link
              to={`/rooms/${room.id}`}
              className="rounded-full bg-ink px-4 py-2 text-sm text-ivory transition group-hover:bg-wine"
            >
              View room
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
