import { api, setAuthToken } from "../utils/config";
import jwt_decode from "jwt-decode";

export const login = async (email, password) => {
  const res = await api.post("/login", { email, password });

  if (res.data.token) {
    localStorage.setItem("token", res.data.token);
    setAuthToken(res.data.token);
  }

  return res.data;
};

export const logout = () => {
  localStorage.removeItem("token");
  setAuthToken(null);
};

export const isTokenValid = () => {
  const token = localStorage.getItem("token");

  if (!token) return false;

  const decoded = jwt_decode(token);
  const now = Date.now() / 1000;

  return decoded.exp > now;
};
