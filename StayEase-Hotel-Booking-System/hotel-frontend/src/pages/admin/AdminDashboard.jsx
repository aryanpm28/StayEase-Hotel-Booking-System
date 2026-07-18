import { useEffect, useState } from "react";
import { BedDouble, CalendarRange, ReceiptText, Radio } from "lucide-react";
import { getRooms } from "../../api/rooms";
import { getBookings } from "../../api/bookings";
import { getPayments } from "../../api/payments";
import { useNotifications } from "../../context/NotificationContext";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function AdminDashboard() {
  const { feed } = useNotifications();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    Promise.all([getRooms(), getBookings(), getPayments()])
      .then(([rooms, bookings, payments]) => {
        setStats({
          rooms: rooms.length,
          activeBookings: bookings.filter((b) => b.bookingStatus === "BOOKED").length,
          totalBookings: bookings.length,
          revenue: payments.reduce((sum, p) => sum + Number(p.amount || 0), 0),
        });
      })
      .catch(() => setStats({ rooms: 0, activeBookings: 0, totalBookings: 0, revenue: 0 }));
  }, []);

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Overview</h1>
      <p className="mt-2 text-sm text-ink/60">Everything happening at the front desk.</p>

      {!stats ? (
        <LoadingSpinner label="Loading overview" />
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-4">
          <StatCard icon={BedDouble} label="Rooms" value={stats.rooms} />
          <StatCard icon={CalendarRange} label="Active bookings" value={stats.activeBookings} />
          <StatCard icon={CalendarRange} label="Total bookings" value={stats.totalBookings} />
          <StatCard
            icon={ReceiptText}
            label="Revenue"
            value={`₹${stats.revenue.toLocaleString("en-IN")}`}
          />
        </div>
      )}

      <div className="mt-10">
        <div className="flex items-center gap-2 text-ink">
          <Radio size={18} className="text-brass" />
          <h2 className="font-display text-lg">Live activity</h2>
        </div>
        <div className="mt-4 flex flex-col gap-2">
          {feed.length === 0 && (
            <p className="text-sm text-ink/50">
              Bookings, cancellations, and payments will appear here in real time.
            </p>
          )}
          {feed.map((item, i) => (
            <div
              key={i}
              className="rounded-lg border border-ink/10 bg-white px-4 py-3 text-sm text-ink/80"
            >
              {item.message}
              <span className="ml-2 font-mono text-xs text-ink/40">
                {new Date(item.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-ink/10 bg-white p-5">
      <Icon size={18} className="text-brass" />
      <p className="mt-3 font-mono text-2xl text-ink">{value}</p>
      <p className="text-xs text-ink/50">{label}</p>
    </div>
  );
}
