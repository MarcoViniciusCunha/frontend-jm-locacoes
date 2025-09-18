import { useState, useEffect } from "react";
import { setAuthToken } from "../utils/config";

export const useAuth = () => {
    const [auth, setAuth] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setAuthToken(token);
            setAuth(true);
        }
        setLoading(false);
    }, []);

    return { auth, loading}
}