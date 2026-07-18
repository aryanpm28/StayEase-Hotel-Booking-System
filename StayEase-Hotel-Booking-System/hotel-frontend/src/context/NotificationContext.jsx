import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { getSocket } from "../realtime/socket";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext(null);
let idCounter = 0;

export function NotificationProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [toasts, setToasts] = useState([]);
  const [feed, setFeed] = useState([]);
  const timers = useRef({});

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    clearTimeout(timers.current[id]);
    delete timers.current[id];
  }, []);

  const push = useCallback(
    (message, tone = "info") => {
      const id = ++idCounter;
      setToasts((prev) => [...prev, { id, message, tone }]);
      timers.current[id] = setTimeout(() => dismiss(id), 5000);
    },
    [dismiss]
  );

  useEffect(() => {
    const socket = getSocket();

    function handleNotification(payload) {
      push(payload.message, payload.type === "booking-cancelled" ? "warn" : "success");
      setFeed((prev) => [payload, ...prev].slice(0, 25));
    }

    socket.on("notification", handleNotification);
    return () => socket.off("notification", handleNotification);
  }, [push]);

  useEffect(() => {
    if (!isAuthenticated) setFeed([]);
  }, [isAuthenticated]);

  return (
    <NotificationContext.Provider value={{ toasts, feed, push, dismiss }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationProvider");
  return ctx;
}
