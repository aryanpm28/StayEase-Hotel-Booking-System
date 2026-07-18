import { useEffect, useState } from "react";
import { CalendarDays, X } from "lucide-react";
import { getBookings, cancelBooking } from "../api/bookings";
import { notifyBookingCancelled } from "../realtime/socket";
import { useAuth } from "../context/AuthContext";
import { extractErrorMessage } from "../api/client";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import ErrorBanner from "../components/ErrorBanner";

const statusStyles = {
  BOOKED: "bg-sage/15 text-sage",
  CHECKED_IN: "bg-brass/15 text-brass",
  CHECKED_OUT: "bg-ink/10 text-ink/60",
  CANCELLED: "bg-wine/10 text-wine",
};

export default function MyBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  function load() {
    setLoading(true);
    getBookings()
      .then(setBookings)
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleCancel(booking) {
    setCancellingId(booking.bookingId);
    try {
      await cancelBooking(booking.bookingId);
      notifyBookingCancelled({
        customerId: user?.id,
        customerName: `${user?.firstName} ${user?.lastName}`,
        roomNumber: booking.roomNumber,
        bookingId: booking.bookingId,
      });
      setBookings((prev) =>
        prev.map((b) =>
          b.bookingId === booking.bookingId ? { ...b, bookingStatus: "CANCELLED" } : b
        )
      );
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setCancellingId(null);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <h1 className="font-display text-3xl text-ink">My bookings</h1>
      <p className="mt-2 text-sm text-ink/60">Everything you've reserved with us.</p>

      <div className="mt-8">
        {loading && <LoadingSpinner label="Loading bookings" />}
        {!loading && error && <ErrorBanner message={error} />}
        {!loading && !error && bookings.length === 0 && (
          <EmptyState
            title="No bookings yet"
            description="Once you reserve a room, it'll show up here."
          />
        )}

        <div className="flex flex-col gap-4">
          {bookings.map((b) => (
            <div
              key={b.bookingId}
              className="flex flex-col gap-3 rounded-xl border border-ink/10 bg-white p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display text-lg text-ink">{b.roomType}</span>
                  <span className="font-mono text-xs text-ink/50">· {b.roomNumber}</span>
                </div>
                <div className="mt-1 flex items-center gap-1.5 text-sm text-ink/60">
                  <CalendarDays size={14} />
                  <span>
                    {b.checkInDate} → {b.checkOutDate} · {b.numberOfGuests} guest
                    {b.numberOfGuests > 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-mono text-lg text-ink">
                  ₹{Number(b.totalPrice).toLocaleString("en-IN")}
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    statusStyles[b.bookingStatus] || "bg-ink/10 text-ink/60"
                  }`}
                >
                  {b.bookingStatus.replace("_", " ")}
                </span>
                {b.bookingStatus === "BOOKED" && (
                  <button
                    onClick={() => handleCancel(b)}
                    disabled={cancellingId === b.bookingId}
                    className="flex items-center gap-1 rounded-full border border-wine/40 px-3 py-1 text-xs text-wine transition hover:bg-wine/5 disabled:opacity-50"
                  >
                    <X size={13} />
                    {cancellingId === b.bookingId ? "Cancelling…" : "Cancel"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
