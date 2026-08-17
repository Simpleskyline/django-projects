import { useState, useEffect } from "react";
import { apiPost } from "../utils/api";

const TOKEN_KEY = "notes_access";
const REFRESH_KEY = "notes_refresh";
const DEV_MODE = true; // set to false when Django backend is ready

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (DEV_MODE) {
      setUser({ username: "devuser", id: 1 });
      setLoading(false);
      return;
    }
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      fetchMe(token)
        .then(setUser)
        .catch(() => {
          clearTokens();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const fetchMe = async (token) => {
    const res = await fetch("/api/auth/me/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Invalid token");
    return res.json();
  };

  const login = async (username, password) => {
    if (DEV_MODE) {
      setUser({ username, id: 1 });
      return;
    }
    const data = await apiPost("/api/auth/token/", { username, password });
    localStorage.setItem(TOKEN_KEY, data.access);
    localStorage.setItem(REFRESH_KEY, data.refresh);
    const me = await fetchMe(data.access);
    setUser(me);
  };

  const register = async (username, password) => {
    if (DEV_MODE) {
      setUser({ username, id: 1 });
      return;
    }
    await apiPost("/api/auth/register/", { username, password });
    await login(username, password);
  };

  const logout = () => {
    if (DEV_MODE) {
      setUser(null);
      return;
    }
    clearTokens();
    setUser(null);
  };

  return { user, login, logout, register, loading };
}

function clearTokens() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
}
