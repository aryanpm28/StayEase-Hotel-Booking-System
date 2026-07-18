import { io } from "socket.io-client";

const REALTIME_URL = import.meta.env.VITE_REALTIME_URL || "http://localhost:4000";

let socket = null;

export function getSocket() {
  if (!socket) {
    socket = io(REALTIME_URL, { autoConnect: false });
  }
  return socket;
}

export function connectAndIdentify({ role, customerId }) {
  const s = getSocket();
  if (!s.connected) s.connect();
  s.emit("identify", { role, customerId });
  return s;
}

// Best-effort — the app should keep working even if the realtime
// service isn't running, so these never throw.
export async function notifyBookingCreated(payload) {
  try {
    await fetch(`${REALTIME_URL}/api/notify/booking-created`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    // realtime service unavailable — ignore
  }
}

export async function notifyBookingCancelled(payload) {
  try {
    await fetch(`${REALTIME_URL}/api/notify/booking-cancelled`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    // realtime service unavailable — ignore
  }
}

export async function notifyPaymentCompleted(payload) {
  try {
    await fetch(`${REALTIME_URL}/api/notify/payment-completed`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    // realtime service unavailable — ignore
  }
}
