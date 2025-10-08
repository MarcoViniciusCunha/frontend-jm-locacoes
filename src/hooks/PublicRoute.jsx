import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

export default function PublicRoute({ children }) {
  const { isAuthenticated } = useAuthContext();
  return isAuthenticated ? <Navigate to="/" /> : children;
}
