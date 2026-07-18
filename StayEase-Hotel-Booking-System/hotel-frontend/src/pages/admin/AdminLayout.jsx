import { NavLink, Outlet } from "react-router-dom";
import { BedDouble, LayoutGrid, ReceiptText, Tags, CalendarRange } from "lucide-react";

const links = [
  { to: "/admin", label: "Overview", icon: LayoutGrid, end: true },
  { to: "/admin/room-types", label: "Room types", icon: Tags },
  { to: "/admin/rooms", label: "Rooms", icon: BedDouble },
  { to: "/admin/bookings", label: "Bookings", icon: CalendarRange },
  { to: "/admin/payments", label: "Payments", icon: ReceiptText },
];

export default function AdminLayout() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-10 lg:flex-row">
      <aside className="lg:w-56 lg:shrink-0">
        <p className="font-mono text-xs uppercase tracking-widest text-ink/40">
          Admin
        </p>
        <nav className="mt-4 flex flex-row gap-2 overflow-x-auto lg:flex-col">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm transition ${
                  isActive
                    ? "bg-ink text-ivory"
                    : "text-ink/70 hover:bg-ink/5"
                }`
              }
            >
              <link.icon size={16} />
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
