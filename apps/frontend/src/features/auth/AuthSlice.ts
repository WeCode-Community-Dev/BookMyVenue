import { createSlice } from "@reduxjs/toolkit";

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
  justLoggedOut: boolean;
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    loading: true,
    error: null,
    otpSent: false,
    emailSentTo: null,
    tokenExpiresAt: null,
    justLoggedOut: false,
};

const AuthSlice = createSlice({
    name: "AuthReducer",
    initialState,
    reducers: {
        setLoading: (state, action: { payload: boolean }) => {
            state.loading = action.payload;
        },
        setError: (state, action: { payload: string | null }) => {
            state.error = action.payload;
        },
        setOtpSent: (state, action: { payload: { email: string } }) => {
            state.otpSent = true;
            state.emailSentTo = action.payload.email;
            state.error = null;
        },
        clearOtpSent: (state) => {
            state.otpSent = false;
            state.emailSentTo = null;
        },
        setTokenExpiresAt: (state, action: { payload: number | null }) => {
            state.tokenExpiresAt = action.payload;
        },
        setAuthSuccess: (state, action: { payload: User }) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.loading = false;
            state.error = null;
            // Access token is valid for 15 minutes in backend configuration
            state.tokenExpiresAt = Date.now() + (15 * 60 * 1000);
            state.justLoggedOut = false;
        },
        setLogout: (state, action: { payload: { isManual?: boolean } | undefined }) => {
            state.user = null;
            state.isAuthenticated = false;
            state.otpSent = false;
            state.emailSentTo = null;
            state.error = null;
            state.tokenExpiresAt = null;
            state.loading = false;
            state.justLoggedOut = action.payload?.isManual ?? false;
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

export const selectUser = (state: { AuthReducer: AuthState }) => {
    return state.AuthReducer.user; 
};

export const selectIsAuthenticated = (state: { AuthReducer: AuthState }) => {
    return state.AuthReducer.isAuthenticated; 
};

export const selectAuthLoading = (state: { AuthReducer: AuthState }) => {
    return state.AuthReducer.loading; 
};

export const selectAuthError = (state: { AuthReducer: AuthState }) => {
    return state.AuthReducer.error; 
};

export const selectOtpSent = (state: { AuthReducer: AuthState }) => {
    return state.AuthReducer.otpSent; 
};

export const selectEmailSentTo = (state: { AuthReducer: AuthState }) => {
    return state.AuthReducer.emailSentTo; 
};

export const selectJustLoggedOut = (state: { AuthReducer: AuthState }) => {
    return state.AuthReducer.justLoggedOut; 
};

export default AuthSlice.reducer;
