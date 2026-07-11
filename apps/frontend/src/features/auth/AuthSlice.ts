import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  role: "USER" | "VENUE_OWNER" | "ADMIN";
  profileIssues: number;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  otpSent: boolean;
  emailSentTo: string | null;
  tokenExpiresAt: number | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  otpSent: false,
  emailSentTo: null,
  tokenExpiresAt: null,
};

const AuthSlice = createSlice({
  name: "AuthReducer",
  initialState,

  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    setOtpSent: (state, action: PayloadAction<{ email: string }>) => {
      state.otpSent = true;
      state.emailSentTo = action.payload.email;
      state.error = null;
    },

    clearOtpSent: (state) => {
      state.otpSent = false;
      state.emailSentTo = null;
    },

    setTokenExpiresAt: (state, action: PayloadAction<number | null>) => {
      state.tokenExpiresAt = action.payload;
    },

    setAuthSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      // Access token is valid for 15 minutes in backend configuration
      state.tokenExpiresAt = Date.now() + 15 * 60 * 1000;
    },
    
    setLogout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.otpSent = false;
      state.emailSentTo = null;
      state.error = null;
      state.tokenExpiresAt = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setOtpSent,
  clearOtpSent,
  setTokenExpiresAt,
  setAuthSuccess,
  setLogout,
} = AuthSlice.actions;

export const selectUser = (state: { AuthReducer: AuthState }) => state.AuthReducer.user;
export const selectIsAuthenticated = (state: { AuthReducer: AuthState }) => state.AuthReducer.isAuthenticated;
export const selectAuthLoading = (state: { AuthReducer: AuthState }) => state.AuthReducer.loading;
export const selectAuthError = (state: { AuthReducer: AuthState }) => state.AuthReducer.error;
export const selectOtpSent = (state: { AuthReducer: AuthState }) => state.AuthReducer.otpSent;
export const selectEmailSentTo = (state: { AuthReducer: AuthState }) => state.AuthReducer.emailSentTo;

export default AuthSlice.reducer;