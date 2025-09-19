import { useState, useEffect } from "react";
import { setAuthToken } from "../utils/config";

export const useAuth = () => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [expiresAt, setExpiresAt] = useState(() =>
    localStorage.getItem("expiresAt")
  );

  useEffect(() => {
    setAuthToken(token);

    if (token && expiresAt) {
      const timeout = setTimeout(() => {
        logout();
      }, new Date(expiresAt) - new Date());

      return () => clearTimeout(timeout);
    }
  }, [token, expiresAt]);

  const login = (token, expiresIn) => {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    localStorage.setItem("token", token);
    localStorage.setItem("expiresAt", expirationDate);
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
