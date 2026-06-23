const ACCESS_KEY  = 'bmv_access_token';
// const REFRESH_KEY = 'bmv_refresh_token';

export const saveTokens = (accessToken, rememberMe = true) => {
  const store = rememberMe ? localStorage : sessionStorage;
  const other = rememberMe ? sessionStorage : localStorage;

  // Make sure no stale copy is left in the other storage.
  other.removeItem(ACCESS_KEY);
  // other.removeItem(REFRESH_KEY);

  store.setItem(ACCESS_KEY, accessToken);
  // store.setItem(REFRESH_KEY, refreshToken);
};

export const getAccessToken = () =>
  localStorage.getItem(ACCESS_KEY) || sessionStorage.getItem(ACCESS_KEY);

// export const getRefreshToken = () =>
//   localStorage.getItem(REFRESH_KEY) || sessionStorage.getItem(REFRESH_KEY);

export const clearTokens = () => {
  localStorage.removeItem(ACCESS_KEY);
  // localStorage.removeItem(REFRESH_KEY);
  sessionStorage.removeItem(ACCESS_KEY);
  // sessionStorage.removeItem(REFRESH_KEY);
};

export const isAuthenticated = () => !!getAccessToken();