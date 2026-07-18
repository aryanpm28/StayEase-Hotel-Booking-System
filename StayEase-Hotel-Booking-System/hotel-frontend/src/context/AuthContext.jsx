import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import * as authApi from "../api/auth";
import { connectAndIdentify, getSocket } from "../realtime/socket";

const AuthContext = createContext(null);

const STORAGE_TOKEN = "stayease_token";
const STORAGE_USER = "stayease_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(STORAGE_USER);
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      connectAndIdentify({
        role: user.role,
        customerId: user.role === "CUSTOMER" ? user.id : undefined,
      });
      if (user.role === "ADMIN") {
        connectAndIdentify({ role: "ADMIN" });
      }
    }

    return () => {
      // keep the socket alive across route changes; only torn down on logout
    };
  }, [user]);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    try {
      const data = await authApi.login(credentials);
      const nextUser = {
        id: data.id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        role: data.role,
      };
      localStorage.setItem(STORAGE_TOKEN, data.token);
      localStorage.setItem(STORAGE_USER, JSON.stringify(nextUser));
      setUser(nextUser);
      return nextUser;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (payload) => {
    setLoading(true);
    try {
      return await authApi.register(payload);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_TOKEN);
    localStorage.removeItem(STORAGE_USER);
    setUser(null);
    const s = getSocket();
    if (s.connected) s.disconnect();
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: !!user,
      isAdmin: user?.role === "ADMIN",
      login,
      register,
      logout,
    }),
    [user, loading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
