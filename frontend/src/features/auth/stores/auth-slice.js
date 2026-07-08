import { createSlice } from '@reduxjs/toolkit';

import { getStoredToken, getStoredUser, setStoredToken, setStoredUser } from '@/lib/api';

const initialState = {
  token: getStoredToken(),
  user: getStoredUser(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action) {
      const { token, user } = action.payload;
      state.token = token;
      state.user = user;
      setStoredToken(token);
      setStoredUser(user);
    },
    setUser(state, action) {
      state.user = action.payload;
      setStoredUser(action.payload);
    },
    logout(state) {
      state.token = null;
      state.user = null;
      setStoredToken(null);
      setStoredUser(null);
    },
  },
});

export const { setCredentials, setUser, logout } = authSlice.actions;
export const selectAuth = (state) => state.auth;
export const selectToken = (state) => state.auth.token;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => Boolean(state.auth.token);
export default authSlice.reducer;
