import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Sparkles } from "lucide-react";
import LedgerSearchBar from "../components/LedgerSearchBar";
import RoomCard from "../components/RoomCard";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import ErrorBanner from "../components/ErrorBanner";
import { getRoomTypes } from "../api/roomTypes";
import { getRooms, getAvailableRooms, searchRooms } from "../api/rooms";
import { extractErrorMessage } from "../api/client";

export default function Rooms() {
  const [searchParams] = useSearchParams();
  const [roomTypes, setRoomTypes] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const [emptyReason, setEmptyReason] = useState("");

  const initialParams = useMemo(() => {
    const roomType = searchParams.get("roomType");
    const checkInDate = searchParams.get("checkInDate");
    const checkOutDate = searchParams.get("checkOutDate");
    const guests = searchParams.get("guests");
    if (roomType && checkInDate && checkOutDate && guests) {
      return { roomType, checkInDate, checkOutDate, guests: Number(guests) };
    }
    return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getRoomTypes().then(setRoomTypes).catch(() => setRoomTypes([]));
  }, []);

  useEffect(() => {
    if (initialParams) {
      runSearch(initialParams);
    } else {
      loadAvailableRooms();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialParams]);

  // Default browse view — only rooms that aren't currently booked/checked-in
  function loadAvailableRooms() {
    setLoading(true);
    setError("");
    setSearched(false);
    setEmptyReason("");
    getAvailableRooms()
      .then(setRooms)
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false));
  }

  // When a dated search comes back empty, work out *why* by comparing against
  // every room of that type — was none ever added, do they all sleep too
  // few guests, or are they just booked for those specific dates?
  async function diagnoseEmptySearch(params) {
    try {
      const allRooms = await getRooms();
      const sameType = allRooms.filter(
        (r) => r.roomType?.toLowerCase() === params.roomType.toLowerCase()
      );

      if (sameType.length === 0) {
        setEmptyReason(
          `No "${params.roomType}" rooms have been added yet — try a different room type, or ask an admin to add one.`
        );
        return;
      }

      const bigEnough = sameType.filter((r) => r.capacity >= params.guests);
      if (bigEnough.length === 0) {
        const maxCap = Math.max(...sameType.map((r) => r.capacity));
        setEmptyReason(
          `Every "${params.roomType}" room sleeps at most ${maxCap} guest${
            maxCap > 1 ? "s" : ""
          } — try lowering your guest count.`
        );
        return;
      }

      setEmptyReason(
        `Every "${params.roomType}" room that fits ${params.guests} guest(s) is already booked for ${params.checkInDate} → ${params.checkOutDate} — try different dates.`
      );
    } catch {
      setEmptyReason("Try fewer guests, a different room type, or different dates.");
    }
  }

  function runSearch(params) {
    setLoading(true);
    setError("");
    setSearched(true);
    setEmptyReason("");
    searchRooms(params)
      .then((results) => {
        setRooms(results);
        if (results.length === 0) diagnoseEmptySearch(params);
      })
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false));
  }

  // Only for the default (un-searched) browse view: feature one room per
  // distinct room type (not just the first room overall), so every type
  // that has availability actually shows up.
  const showSampleLayout = !searched && !loading && !error && rooms.length > 0;
  const featuredByType = showSampleLayout
    ? Object.values(
        rooms.reduce((acc, room) => {
          if (!acc[room.roomType]) acc[room.roomType] = room;
          return acc;
        }, {})
      )
    : [];

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <h1 className="font-display text-3xl text-ink">Find your room</h1>
      <p className="mt-2 text-sm text-ink/60">
        Search by dates and party size, or browse what's available right now.
      </p>

      <div className="mt-8">
        <LedgerSearchBar roomTypes={roomTypes} onSearch={runSearch} initialValues={initialParams} />
      </div>

      {searched && (
        <button
          onClick={loadAvailableRooms}
          className="mt-4 text-sm text-brass underline underline-offset-2"
        >
          Clear search — show available rooms
        </button>
      )}

      <div className="mt-10">
        {loading && <LoadingSpinner label="Finding rooms" />}
        {!loading && error && <ErrorBanner message={error} />}

        {!loading && !error && rooms.length === 0 && (
          <EmptyState
            title={searched ? "No rooms match yet" : "Sorry, Rooms are not Available"}
            description={
              searched
                ? emptyReason || "Try different dates, a different room type, or fewer guests."
                : "Every room is currently booked — please check back soon."
            }
          />
        )}

        {showSampleLayout && featuredByType.length > 0 && (
          <div>
            <div className="flex items-center gap-2 text-brass">
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
              {rooms.length > 1
                ? `${rooms.length} rooms available right now.`
                : "That's the only room available right now."}
            </p>
          </div>
        )}

        {searched && !loading && !error && rooms.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2">
            {rooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
