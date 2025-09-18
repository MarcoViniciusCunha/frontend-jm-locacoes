import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_API || "http://localhost:8080/api",
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};