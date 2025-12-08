import { useState, useEffect } from "react";
import jwtDecode from "jwt-decode";
import { setAuthToken } from "../utils/config";

export const useAuth = () => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [expiresAt, setExpiresAt] = useState(() => {
    const stored = localStorage.getItem("expiresAt");
    return stored ? new Date(stored) : null;
  });

  useEffect(() => {
    if (token && expiresAt) {
      const timeout = setTimeout(() => {
        logout();
      }, expiresAt.getTime() - new Date().getTime());

      return () => clearTimeout(timeout);
    }
  }, [token, expiresAt]);

  const login = (token) => {
    const decoded = jwtDecode(token);
    const expirationDate = new Date(decoded.exp * 1000);

    localStorage.setItem("token", token);
    localStorage.setItem("expiresAt", expirationDate.toISOString());

    setAuthToken(token);

    setToken(token);
    setExpiresAt(expirationDate);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("expiresAt");
    setToken(null);
    setExpiresAt(null);
  };

  return { token, login, logout, isAuthenticated: !!token };
};
