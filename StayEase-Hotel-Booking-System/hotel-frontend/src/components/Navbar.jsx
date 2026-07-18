import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { KeyRound, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navLinkClass = ({ isActive }) =>
  `text-sm tracking-wide transition-colors hover:text-brass-light ${
    isActive ? "text-brass-light" : "text-ivory/80"
  }`;

export default function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-brass/20 bg-ink text-ivory">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link to="/" className="flex items-center gap-2">
          <KeyRound size={22} className="text-brass-light" />
          <span className="font-display text-xl tracking-tight">StayEase</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          <NavLink to="/rooms" className={navLinkClass}>
            Rooms
          </NavLink>
          {isAuthenticated && !isAdmin && (
            <NavLink to="/my-bookings" className={navLinkClass}>
              My Bookings
            </NavLink>
          )}
          {isAuthenticated && !isAdmin && (
            <NavLink to="/profile" className={navLinkClass}>
              Profile
            </NavLink>
          )}
          {isAdmin && (
            <NavLink to="/admin" className={navLinkClass}>
              Admin
            </NavLink>
          )}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          {isAuthenticated ? (
            <>
              <span className="font-mono text-xs text-ivory/60">
                {user?.firstName}
              </span>
              <button
                onClick={handleLogout}
                className="rounded-full border border-brass/50 px-4 py-1.5 text-sm text-ivory transition hover:bg-brass/10"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm text-ivory/80 transition hover:text-brass-light"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-brass px-4 py-1.5 text-sm font-medium text-ink transition hover:bg-brass-light"
              >
                Book with us
              </Link>
            </>
          )}
        </div>

        <button
          className="text-ivory md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-brass/20 px-5 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            <NavLink to="/rooms" className={navLinkClass} onClick={() => setOpen(false)}>
              Rooms
            </NavLink>
            {isAuthenticated && !isAdmin && (
              <NavLink to="/my-bookings" className={navLinkClass} onClick={() => setOpen(false)}>
                My Bookings
              </NavLink>
            )}
            {isAuthenticated && !isAdmin && (
              <NavLink to="/profile" className={navLinkClass} onClick={() => setOpen(false)}>
                Profile
              </NavLink>
            )}
            {isAdmin && (
              <NavLink to="/admin" className={navLinkClass} onClick={() => setOpen(false)}>
                Admin
              </NavLink>
            )}
            {isAuthenticated ? (
              <button onClick={handleLogout} className="text-left text-sm text-ivory/80">
                Sign out
              </button>
            ) : (
              <>
                <Link to="/login" className="text-sm text-ivory/80" onClick={() => setOpen(false)}>
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="w-fit rounded-full bg-brass px-4 py-1.5 text-sm font-medium text-ink"
                  onClick={() => setOpen(false)}
                >
                  Book with us
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
