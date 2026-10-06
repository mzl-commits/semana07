import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { api, setAccessToken, setRefreshHandler } from "../services/api.js";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const bootstrap = useRef(null);
  const applyToken = useCallback((value) => { setToken(value); setAccessToken(value); }, []);
  const clearSession = useCallback(() => {
    localStorage.removeItem("refreshToken");
    setUser(null);
    applyToken(null);
  }, [applyToken]);
  const refreshAccessToken = useCallback(async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) throw new Error("Sesion expirada");
    try {
      const { data } = await api.post("/auth/refreshtoken", { refreshToken });
      applyToken(data.accessToken);
      return data.accessToken;
    } catch (error) { clearSession(); throw error; }
  }, [applyToken, clearSession]);
  useEffect(() => {
    let active = true;
    setRefreshHandler(refreshAccessToken);
    if (!bootstrap.current) bootstrap.current = (async () => {
      if (!localStorage.getItem("refreshToken")) return null;
      await refreshAccessToken();
      return (await api.get("/auth/me")).data;
    })();
    bootstrap.current.then((profile) => { if (active) setUser(profile); })
      .catch(() => { if (active) clearSession(); })
      .finally(() => { if (active) setInitializing(false); });
    return () => { active = false; setRefreshHandler(null); };
  }, [refreshAccessToken, clearSession]);
  const login = (data) => {
    setUser({ id: data.id, username: data.username, email: data.email, roles: data.roles });
    applyToken(data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
  };
  const logout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    try { if (refreshToken) await api.post("/auth/signout", { refreshToken }); }
    finally { clearSession(); }
  };
  return <AuthContext.Provider value={{ user, token, initializing, login, logout, refreshAccessToken }}>{children}</AuthContext.Provider>;
}
