import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Users, CalendarDays } from "lucide-react";
import { getRoomById } from "../api/rooms";
import { createBooking } from "../api/bookings";
import { notifyBookingCreated } from "../realtime/socket";
import { useAuth } from "../context/AuthContext";
import { extractErrorMessage } from "../api/client";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorBanner from "../components/ErrorBanner";

// Backend validates checkIn/checkOut with @Future, which rejects today —
// so the earliest selectable date here is tomorrow.
const tomorrowIso = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
};

export default function RoomDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, user } = useAuth();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [numberOfGuests, setNumberOfGuests] = useState(1);

  useEffect(() => {
    getRoomById(id)
      .then(setRoom)
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [id]);

  const nights =
    checkInDate && checkOutDate
      ? Math.max(
          0,
          Math.round(
            (new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24)
          )
        )
      : 0;

  const estimatedTotal = room ? nights * room.pricePerNight : 0;

  async function handleBook(e) {
    e.preventDefault();
    setError("");

    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: `/rooms/${id}` } } });
      return;
    }

    setSubmitting(true);
    try {
      const booking = await createBooking({
        roomId: Number(id),
        checkInDate,
        checkOutDate,
        numberOfGuests: Number(numberOfGuests),
      });

      notifyBookingCreated({
        customerId: user?.id,
        customerName: `${user?.firstName} ${user?.lastName}`,
        roomNumber: booking.roomNumber,
        roomType: booking.roomType,
        checkInDate: booking.checkInDate,
        checkOutDate: booking.checkOutDate,
        totalPrice: booking.totalPrice,
      });

      navigate(`/payment/${booking.bookingId}`);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <LoadingSpinner label="Loading room" />;
  if (error && !room)
    return (
      <div className="mx-auto max-w-2xl px-5 py-16">
        <ErrorBanner message={error} />
      </div>
    );
  if (!room) return null;

  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <div className="grid gap-10 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <span className="font-mono text-xs tracking-widest text-brass">
            ROOM {room.roomNumber}
          </span>
          <h1 className="mt-2 font-display text-4xl text-ink">{room.roomType}</h1>
          <p className="mt-4 text-ink/70">
            {room.description || "A comfortable, well-appointed room for your stay."}
          </p>

          <div className="mt-6 flex items-center gap-2 text-sm text-ink/60">
            <Users size={16} />
            <span>Sleeps up to {room.capacity} guests</span>
          </div>

          <p className="mt-8 font-mono text-3xl text-ink">
            ₹{Number(room.pricePerNight).toLocaleString("en-IN")}
            <span className="text-sm text-ink/50"> / night</span>
          </p>
        </div>

        <div className="lg:col-span-2">
          <form
            onSubmit={handleBook}
            className="sticky top-24 rounded-2xl border border-ink/10 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center gap-2 text-ink">
              <CalendarDays size={18} className="text-brass" />
              <h2 className="font-display text-lg">Reserve this room</h2>
            </div>

            <div className="mt-5 flex flex-col gap-4">
              <label className="flex flex-col gap-1 text-sm">
                <span className="text-ink/60">Check-in</span>
                <input
                  type="date"
                  required
                  min={tomorrowIso()}
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  className="rounded-lg border border-ink/15 px-3 py-2 outline-none focus:border-brass"
                />
              </label>

              <label className="flex flex-col gap-1 text-sm">
                <span className="text-ink/60">Check-out</span>
                <input
                  type="date"
                  required
                  min={checkInDate || tomorrowIso()}
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  className="rounded-lg border border-ink/15 px-3 py-2 outline-none focus:border-brass"
                />
              </label>

              <label className="flex flex-col gap-1 text-sm">
                <span className="text-ink/60">Guests (max {room.capacity})</span>
                <input
                  type="number"
                  min={1}
                  max={room.capacity}
                  required
                  value={numberOfGuests}
                  onChange={(e) => setNumberOfGuests(e.target.value)}
                  className="rounded-lg border border-ink/15 px-3 py-2 outline-none focus:border-brass"
                />
              </label>
            </div>

            {nights > 0 && (
              <div className="mt-5 flex items-center justify-between border-t border-dashed border-ink/15 pt-4 text-sm">
                <span className="text-ink/60">
                  {nights} night{nights > 1 ? "s" : ""}
                </span>
                <span className="font-mono text-lg text-ink">
                  ₹{estimatedTotal.toLocaleString("en-IN")}
                </span>
              </div>
            )}

            {error && (
              <div className="mt-4">
                <ErrorBanner message={error} />
              </div>
            )}

            {isAdmin ? (
              <p className="mt-5 text-sm text-ink/50">
                Admin accounts can't place bookings — sign in as a guest to book.
              </p>
            ) : (
              <button
                type="submit"
                disabled={submitting}
                className="mt-5 w-full rounded-full bg-wine py-3 text-ivory transition hover:bg-wine-light disabled:opacity-60"
              >
                {submitting
                  ? "Reserving…"
                  : isAuthenticated
                  ? "Reserve room"
                  : "Sign in to reserve"}
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
