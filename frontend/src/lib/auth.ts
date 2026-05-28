// ── Auth API utility ──────────────────────────────────────────
// Connects to the Go auth-service at localhost:8080

const AUTH_BASE = process.env.NEXT_PUBLIC_AUTH_URL ?? "http://localhost:8080";
const TOKEN_KEY = "bmv_token";

export interface AuthUser {
  name: string;
  email: string;
  role: string;
}

export interface TokenClaims {
  sub: string;
  email: string;
  name: string;
  role: string;
  exp: number;
}

// ── Token helpers ─────────────────────────────────────────────

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  const token = getToken();
  if (!token) return false;
  try {
    // Decode JWT payload (no verification – server handles that)
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export function getUser(): TokenClaims | null {
  const token = getToken();
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload as TokenClaims;
  } catch {
    return null;
  }
}

// ── API calls ─────────────────────────────────────────────────

export async function login(email: string, password: string): Promise<void> {
  const res = await fetch(`${AUTH_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error ?? "Login failed");
  }

  const { token } = await res.json();
  setToken(token);
}

export async function register(
  name: string,
  email: string,
  password: string,
  role: string = "user"
): Promise<void> {
  const res = await fetch(`${AUTH_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, role, username: email }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error ?? "Registration failed");
  }
}

export function logout(): void {
  removeToken();
}
