import store from "@/store/Store";
import { setLogout, setTokenExpiresAt } from "@/features/auth/AuthSlice";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

let refreshPromise: Promise<any> | null = null;
const ACCESS_TOKEN_LIFETIME = 15 * 60 * 1000; // 15 minutes

async function silentRefresh() {
  if (refreshPromise) {
    return refreshPromise;
  }

  const url = `${BASE_URL}/auth/refresh`;
  
  refreshPromise = fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  })
    .then(async (response) => {
      refreshPromise = null;
      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }
      
      const newExpiry = Date.now() + ACCESS_TOKEN_LIFETIME;
      store.dispatch(setTokenExpiresAt(newExpiry));
      
      return response.json();
    })
    .catch((err) => {
      refreshPromise = null;
      store.dispatch(setLogout());
      throw err;
    });

  return refreshPromise;
}

export async function apiFetch(path: string, options: RequestInit = {}) {
  const state = store.getState() as any;
  const { isAuthenticated, tokenExpiresAt } = state.AuthReducer;

  // 1. Proactive Token Refresh Check (if expires in < 2 minutes)
  if (isAuthenticated && tokenExpiresAt) {
    const timeRemaining = tokenExpiresAt - Date.now();
    if (timeRemaining < 2 * 60 * 1000) {
      try {
        await silentRefresh();
      } catch (err) {
        throw new Error('Session expired');
      }
    }
  }

  const url = `${BASE_URL}${path}`;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    });

    // 2. Reactive Token Refresh (if request gets 401, refresh and retry once)
    if (response.status === 401 && path !== '/auth/refresh') {
      try {
        await silentRefresh();
        
        // Retry with fresh credentials
        const retryResponse = await fetch(url, {
          ...options,
          headers,
          credentials: 'include',
        });
        
        if (!retryResponse.ok) {
          throw new Error('Unauthorized');
        }
        
        return await parseResponse(retryResponse);
      } catch (err) {
        store.dispatch(setLogout());
        throw new Error('Session expired');
      }
    }

    if (!response.ok) {
      let errorMessage = 'An error occurred';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {}
      throw new Error(errorMessage);
    }

    return await parseResponse(response);
  } catch (error: any) {
    throw new Error(error.message || 'Network error');
  }
}

async function parseResponse(response: Response) {
  if (response.status === 204) {
    return null;
  }
  try {
    return await response.json();
  } catch (e) {
    return null;
  }
}
