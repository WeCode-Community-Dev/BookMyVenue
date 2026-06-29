/**
 * API client utility for communicating with the NestJS backend via the Next.js BFF secure proxy.
 */
import { clearSession } from "./authStore";

const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    // Client-side: use relative URL to trigger local proxy
    return "/api";
  }
  // Server-side: call localhost
  return "http://localhost:3000/api";
};

export interface RequestOptions extends RequestInit {
  body?: any;
}

/**
 * Custom fetch wrapper that handles proxy routing, content types, and credentials.
 */
export async function apiFetch<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const headers = new Headers(options.headers);

  // Set content type to JSON by default unless payload is FormData (e.g. file uploads)
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const fetchOptions: RequestInit = {
    ...options,
    headers,
    credentials: options.credentials || "same-origin", // Automatically include same-origin HttpOnly cookies
  };

  if (options.body) {
    fetchOptions.body = options.body instanceof FormData ? options.body : JSON.stringify(options.body);
  }

  const response = await fetch(url, fetchOptions);

  if (!response.ok) {
    // Intercept unrecoverable 401 Unauthorized (invalid/expired refresh tokens)
    if (response.status === 401 && typeof window !== "undefined") {
      clearSession();
      const isPartner = window.location.pathname.startsWith("/partner");
      const redirectUrl = isPartner ? "/partner/login" : "/login";
      const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
      window.location.href = `${redirectUrl}?returnUrl=${returnUrl}`;
    }

    let errorMessage = `API request failed with status ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      // Fallback if response is not JSON
    }
    throw new Error(errorMessage);
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json() as Promise<T>;
  }

  return response.text() as unknown as Promise<T>;
}
