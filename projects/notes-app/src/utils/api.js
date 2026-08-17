const TOKEN_KEY = "notes_access";
const REFRESH_KEY = "notes_refresh";

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function refreshAccessToken() {
  const refresh = localStorage.getItem(REFRESH_KEY);
  if (!refresh) throw new Error("No refresh token");

  const res = await fetch("/api/auth/token/refresh/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });

  if (!res.ok) throw new Error("Refresh failed");
  const data = await res.json();
  localStorage.setItem(TOKEN_KEY, data.access);
  return data.access;
}

async function request(url, options = {}, retry = true) {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...(options.headers || {}),
    },
  });

  if (res.status === 401 && retry) {
    try {
      await refreshAccessToken();
      return request(url, options, false);
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_KEY);
      window.location.reload();
    }
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || err.message || `HTTP ${res.status}`);
  }

  if (res.status === 204) return null;
  return res.json();
}

export const apiFetch = (url) => request(url);

export const apiPost = (url, body) =>
  request(url, { method: "POST", body: JSON.stringify(body) });

export const apiPatch = (url, body) =>
  request(url, { method: "PATCH", body: JSON.stringify(body) });

export const apiDelete = (url) =>
  request(url, { method: "DELETE" });
