// Central API client — a thin wrapper around fetch.
// All backend calls should go through here so we configure the base URL,
// headers, auth token, and error handling in one place.
//
// Vite reads env vars prefixed with VITE_ (see .env). Falls back to the

import { showError } from "../utils/toastBus";

// local backend if VITE_API_URL is not set.
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

// Where the app JWT lives in the browser.
const TOKEN_KEY = 'bmv_token'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

// Called when the backend rejects our token (401) on any request, so the auth
// context can clear the stale session and route guards can redirect to login.
// AuthProvider registers a handler here on mount; until then it's a no-op.
let onUnauthorized = () => {};

export function setUnauthorizedHandler(handler) {
  onUnauthorized = handler;
}

async function request(path, options = {}) {
  const token = getToken();

  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
    })
  } catch (error) {
    showError(error.message);
    throw error;
  }

  if (!res.ok) {
    let detail = res.statusText;
    let body = null;
    try {
      body = await res.json();
      detail = body.message || detail;
    } catch {
      // response had no JSON body; keep statusText
    }
    // Token invalid/expired/revoked — drop the stale session so route guards
    // bounce the user to login. Skipped during the initial /auth/me restore,
    // which handles its own 401 (no session exists yet to clear).
    if (res.status === 401) {
      setToken(null);
      onUnauthorized();
    }
    showError(detail);
    const error = new Error(`API error ${res.status}: ${detail}`);
    // Preserve the structured response so callers can react to it — e.g. submit
    // returns { missingFields: [...] } for per-field form highlighting.
    error.status = res.status;
    error.data = body;
    throw error;
  }

  return res.json()
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) }),
  patch: (path, body) => request(path, { method: 'PATCH', body: JSON.stringify(body) }),
  del: (path) => request(path, { method: 'DELETE' }),
}
