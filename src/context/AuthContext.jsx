import { createContext, useContext } from "react";
import { useAuth } from "../hooks/useAuth";

const aContext = createContext(null);

export const useAuthContext = () => {
  const context = useContext(aContext);
  if (!context) {
    throw new Error("useAuthContext deve ser usado dentro de um AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const auth = useAuth();
  return <aContext.Provider value={auth}>{children}</aContext.Provider>;
};
