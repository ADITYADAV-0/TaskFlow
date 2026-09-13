import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { getSession, login as apiLogin, logout as apiLogout } from "../data/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getSession());
  const [initializing, setInitializing] = useState(false);

  // Session is read synchronously from localStorage above, but we still
  // expose an `initializing` flag so a real async /api/auth/me check can be
  // dropped in later without changing how consumers read this context.
  useEffect(() => {
    setInitializing(false);
  }, []);

  const login = useCallback(async (email) => {
    const loggedInUser = await apiLogin({ email });
    setUser(loggedInUser);
    return loggedInUser;
  }, []);

  const logout = useCallback(async () => {
    await apiLogout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, initializing, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
