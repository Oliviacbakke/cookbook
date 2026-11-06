import { useState, useEffect, useSyncExternalStore } from "react";
import { API } from "./config";
import { API_KEY } from "./apiKey";

let offline = false;
const listeners = new Set();

function setOffline(value) {
  if (offline !== value) {
    offline = value;
    listeners.forEach((listener) => listener());
  }
}

export function useOffline() {
  return useSyncExternalStore(
    (callback) => {
      listeners.add(callback);
      return () => listeners.delete(callback);
    },
    () => offline
  );
}

// ---------- Saved copy of recipes on the phone ----------
const PREFIX = "cookbook-cache:";

function readCache(path) {
  try {
    const raw = localStorage.getItem(PREFIX + path);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeCache(path, data) {
  try {
    localStorage.setItem(PREFIX + path, JSON.stringify(data));
  } catch {
    // storage full or unavailable - ignore
  }
}

function clearCache(path) {
  try {
    localStorage.removeItem(PREFIX + path);
  } catch {
    // ignore
  }
}

// fetch wrapper: adds the API key, throws on network failure or non-2xx.
export async function apiFetch(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (API_KEY) headers["X-API-Key"] = API_KEY;
  if (options.body) headers["Content-Type"] = "application/json";

  let response;
  try {
    response = await fetch(`${API}${path}`, { ...options, headers });
  } catch {
    throw new Error("Can't reach the cookbook. Check your connection.");
  }

  setOffline(false);

  let data = null;
  try {
    data = await response.json();
  } catch {
    // no JSON body
  }
  if (!response.ok) {
    const error = new Error((data && data.error) || `Request failed (${response.status})`);
    error.status = response.status;
    throw error;
  }
  return data;
}

// GET helper: shows the saved copy right away, refreshes in the background,
// and falls back to the saved copy if the server can't be reached.
export function useApi(path) {
  const [data, setDataState] = useState(() => readCache(path));
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(() => readCache(path) === null);
  const [key, setKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const cached = readCache(path);
    setDataState(cached);
    setLoading(cached === null);
    setError(null);

    apiFetch(path)
      .then((fresh) => {
        if (cancelled) return;
        setDataState(fresh);
        writeCache(path, fresh);
        if (path === "/recipes" && Array.isArray(fresh)) {
          fresh.forEach((recipe) => writeCache(`/recipes/${recipe.id}`, recipe));
        }
      })
      .catch((e) => {
        if (cancelled) return;
        const serverUnreachable = !e.status || e.status >= 500;
        if (cached !== null && serverUnreachable) {
          setOffline(true);
          return;
        }
        if (e.status && e.status < 500) {
          clearCache(path);
          setDataState(null);
        }
        setError(e);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [path, key]);

  // Updates the screen and the saved copy together (used after deleting).
  function setData(updater) {
    setDataState((previous) => {
      const next = typeof updater === "function" ? updater(previous) : updater;
      writeCache(path, next);
      return next;
    });
  }

  return { data, setData, error, loading, reload: () => setKey((k) => k + 1) };
}