import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../api/axios";

const AuthContext = createContext(undefined);

const TOKEN_KEY = "token";
const readStoredToken  = () => localStorage.getItem(TOKEN_KEY);
const persistToken     = (token) => localStorage.setItem(TOKEN_KEY, token);
const clearStoredToken = () => localStorage.removeItem(TOKEN_KEY);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken]     = useState(readStoredToken);

  const handleLogout = useCallback(() => {
    clearStoredToken();
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    async function fetchCurrentUser() {
      if (!token) { setLoading(false); return; }
      try {
        const res = await api.get("/auth/me");
        setUser(res.data.user);
      } catch {
        handleLogout();
      } finally {
        setLoading(false);
      }
    }
    fetchCurrentUser();
  }, [token]);

  const handleLogin = useCallback(async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    const { token: newToken, user: newUser } = res.data;
    persistToken(newToken);
    setToken(newToken);
    setUser(newUser);
    return newUser;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login: handleLogin, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an <AuthProvider>.");
  }
  return context;
}