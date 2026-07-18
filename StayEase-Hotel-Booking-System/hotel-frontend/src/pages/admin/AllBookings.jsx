import { useEffect, useState } from "react";
import { getBookings } from "../../api/bookings";
import { extractErrorMessage } from "../../api/client";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorBanner from "../../components/ErrorBanner";

const statusStyles = {
  BOOKED: "bg-sage/15 text-sage",
  CHECKED_IN: "bg-brass/15 text-brass",
  CHECKED_OUT: "bg-ink/10 text-ink/60",
  CANCELLED: "bg-wine/10 text-wine",
};

export default function AllBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    getBookings()
      .then(setBookings)
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    statusFilter === "ALL"
      ? bookings
      : bookings.filter((b) => b.bookingStatus === statusFilter);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl text-ink">Bookings</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-ink/15 px-3 py-2 text-sm outline-none focus:border-brass"
        >
          <option value="ALL">All statuses</option>
          <option value="BOOKED">Booked</option>
          <option value="CHECKED_IN">Checked in</option>
          <option value="CHECKED_OUT">Checked out</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      <div className="mt-6">
        {loading && <LoadingSpinner label="Loading bookings" />}
        {!loading && error && <ErrorBanner message={error} />}
        {!loading && !error && (
          <div className="overflow-hidden rounded-xl border border-ink/10 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-ivory-dim text-left text-ink/50">
                <tr>
                  <th className="px-4 py-3 font-normal">Guest</th>
                  <th className="px-4 py-3 font-normal">Room</th>
                  <th className="px-4 py-3 font-normal">Dates</th>
                  <th className="px-4 py-3 font-normal">Total</th>
                  <th className="px-4 py-3 font-normal">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => (
                  <tr key={b.bookingId} className="border-t border-ink/5">
                    <td className="px-4 py-3">{b.customerName}</td>
                    <td className="px-4 py-3">
                      {b.roomType} · <span className="font-mono">{b.roomNumber}</span>
                    </td>
                    <td className="px-4 py-3 text-ink/70">
                      {b.checkInDate} → {b.checkOutDate}
                    </td>
                    <td className="px-4 py-3 font-mono">
                      ₹{Number(b.totalPrice).toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          statusStyles[b.bookingStatus] || "bg-ink/10 text-ink/60"
                        }`}
                      >
                        {b.bookingStatus.replace("_", " ")}
                      </span>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-ink/50">
                      No bookings match this filter.
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
