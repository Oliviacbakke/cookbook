import { useState, useEffect } from "react";
import { API } from "./config";
import { API_KEY } from "./apiKey";

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

// GET helper with loading / error state and a reload function.
export function useApi(path) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [key, setKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    apiFetch(path)
      .then((d) => !cancelled && setData(d))
      .catch((e) => !cancelled && setError(e))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [path, key]);

  return { data, setData, error, loading, reload: () => setKey((k) => k + 1) };
}
