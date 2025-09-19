import { useState, useEffect } from "react";
import { setAuthToken } from "../utils/config";
import jwtDecode from "jwt-decode";

export const useAuth = () => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [expiresAt, setExpiresAt] = useState(() => {
    const stored = localStorage.getItem("expiresAt");
    return stored ? new Date(stored) : null;
  });

  useEffect(() => {
    setAuthToken(token);

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
    setToken(token);
    setExpiresAt(expirationDate);
    console.log("Token armazenado:", token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("expiresAt");
    setToken(null);
    setExpiresAt(null);
  };

  return { token, login, logout, isAuthenticated: !!token };
};
