export const API_BASE = 'http://localhost:8000/api/v1';

export const getHeaders = () => {
  return {
    'Content-Type': 'application/json',
  };
};

export const getFetchOptions = (options = {}) => {
  const headers = {
    ...getHeaders(),
    ...(options.headers || {})
  };

  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  return {
    ...options,
    credentials: 'include',
    headers
  };
};

export const fetchWithAuth = async (url, options = {}) => {
  const fetchOptions = getFetchOptions(options);
  let res = await fetch(url, fetchOptions);

  if (res.status === 401) {
    const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    }).catch(() => null);

    if (refreshRes && refreshRes.ok) {
      res = await fetch(url, fetchOptions);
    } else {
      localStorage.removeItem('user_role');
      localStorage.removeItem('token');
      // If we are not on the auth page, we might want to let the app know it needs to re-auth
      window.dispatchEvent(new Event('auth-failed'));
    }
  }

  return res;
};
